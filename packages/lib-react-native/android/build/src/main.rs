/*
 * Copyright 2018-2020 TON Labs LTD.
 *
 * Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
 * this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific TON DEV software governing permissions and
 * limitations under the License.
 *
 */

use std::env;
use std::path::PathBuf;
use ton_client_build::{check_targets, exec, path_str, Build};

struct Arch {
    target: &'static str,
    jni: &'static str,
    ndk: &'static str,
}

const ARCHS: [Arch; 4] = [
    Arch {
        target: "x86_64-linux-android",
        jni: "x86_64",
        ndk: "x86_64",
    },
    Arch {
        target: "i686-linux-android",
        jni: "x86",
        ndk: "x86",
    },
    Arch {
        target: "aarch64-linux-android",
        jni: "arm64-v8a",
        ndk: "arm64",
    },
    Arch {
        target: "armv7-linux-androideabi",
        jni: "armeabi-v7a",
        ndk: "arm",
    },
];

const LIB: &str = "libdengine.so";
const NDK_VERSION: &str = "android-ndk-r26";
const API: &str= "34";
fn ndk_url() -> String {
    format!("http://dl.google.com/android/repository/{NDK_VERSION}-linux.zip")
} 

fn main() {
    let target_arg = env::args().nth(1).unwrap_or("".to_string());
    let the_archs: Vec<&Arch> = ARCHS.iter().filter(|arch| arch.target.starts_with(&target_arg)).collect();
    let builder = Build::new();
    check_targets(&the_archs.iter().map(|x| x.target).collect::<Vec<_>>());
    check_ndk(&builder, &the_archs);
    for &arch in &the_archs {
        let target = arch.target;
        let toolchain = builder.lib_dir.join(format!("{NDK_VERSION}/toolchains/llvm/prebuilt/linux-x86_64"));
        std::env::set_var("TOOLCHAIN", &toolchain);
        std::env::set_var("API", API);
        std::env::set_var("AR", toolchain.join("bin/llvm-ar"));
        std::env::set_var("RANLIB", toolchain.join("bin/llvm-ranlib"));
        std::env::set_var("STRIP", toolchain.join("bin/llvm-strip"));
        std::env::set_var("LD", toolchain.join("bin/ld"));
        std::env::set_var("CC", toolchain.join(format!("bin/{target}{API}-clang")));
        std::env::set_var("CXX", toolchain.join(format!("bin/{target}{API}-clang++")));
        assert!(exec("cargo", &["build", "--target", target, "--release"]).success());
    }

    let out_dir = builder.package_dir.join("src/main/jniLibs");
    for &arch in &the_archs {
        let arch_out_dir = out_dir.join(arch.jni);
        std::fs::create_dir_all(&arch_out_dir).unwrap();
        let src = builder.target_dir.join(arch.target).join("release").join(LIB);
        if src.exists() {
            let out_lib = arch_out_dir.join(LIB);
            std::fs::copy(&src, &out_lib).unwrap();
            println!(
                "Android library for [{}] copied to \"{}\"",
                arch.target,
                path_str(&out_lib)
            );
            builder.publish_package_file(
                &format!("src/main/jniLibs/{}/{}", arch.jni, LIB),
                &format!("dengine_{{v}}_react_native_{}", arch.target),
            );
        } else {
            println!(
                "Android library for [{}] does not exists. Skipped.",
                arch.target
            );
        }
    }
}

fn get_ndk(builder: &Build) -> PathBuf {
    if let Ok(dir) = std::env::var("NDK_HOME") {
        let dir = PathBuf::from(dir);
        if dir.exists() {
            return dir;
        }
    }
    let ndk_zip_file = builder.lib_dir.join(ndk_url().split("/").last().unwrap());
    let ndk_dir = builder.lib_dir.join(&NDK_VERSION);
    if !ndk_zip_file.exists() {
        println!("Downloading android NDK...");
        assert!(exec("curl", &[&ndk_url(), "-o", path_str(&ndk_zip_file)]).success());
    }
    println!("Unzipping android NDK...");
    assert!(exec(
        "unzip",
        &[
            "-q",
            "-d",
            path_str(&builder.lib_dir),
            path_str(&ndk_zip_file),
        ],
    ).success());
    std::env::set_var("NDK_HOME", path_str(&ndk_dir));
    ndk_dir
}

fn check_ndk(builder: &Build, the_archs: &[&Arch]) {
    let ndk_dir = builder.lib_dir.join("NDK");
    let mut missing_archs = Vec::new();
    for &a in the_archs {
        if !ndk_dir.join(a.ndk).exists() {
            missing_archs.push(a);
        }
    }
    if missing_archs.is_empty() {
        println!("Standalone NDK already exists...");
        return;
    }
    get_ndk(builder);
    std::env::set_current_dir(&builder.lib_dir).unwrap();
}
