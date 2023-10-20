/*
 * Copyright 2018-2020 TON Labs LTD.
 *
 * Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at:
 *
 * http://www.ton.dev/licenses
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific TON DEV software governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const {http, https} = require('follow-redirects');
const zlib = require('zlib');
const path = require('path');
const os = require('os');

const binariesSource =
  process.env.DENGINE_BIN_SRC ||
  'https://github.com/EverSurf/dengine-bin/releases/download';
const binariesVersion =
  process.env.DENGINE_BIN_VERSION ||
  require('./package.json').version.split('.').slice(0, 2).join('_');
const binariesHomePath = path.resolve(
  os.homedir(),
  '.eversurf',
  'binaries',
  binariesVersion
);

function downloadAndGunzip(dest, url) {
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream(dest, { flags: 'w' });
    let opened = false;
    const failed = (err) => {
      if (file) {
        file.close();
        file = null;

        fs.unlink(dest, () => {});
        reject(err);
      }
    };

    file.on('finish', () => {
      if (opened && file) {
        resolve();
      }
    });

    file.on('open', () => {
      opened = true;
    });

    file.on('error', (err) => {
      if (err.code === 'EEXIST') {
        file.close();
        reject('File already exists');
      } else {
        failed(err);
      }
    });

    const unzip = zlib.createGunzip();
    unzip.pipe(file);
    const protocol = url.split(':')[0].toLowerCase();
    if (protocol === 'http' || protocol === 'https') {
      let net = http;
      if (protocol === 'https') {
        net = https;
      }
      const request = net.get(url, (response) => {
        if (response.statusCode !== 200) {
          failed({
            message: `Download from ${url} failed with ${response.statusCode}: ${response.statusMessage}`,
          });
          return;
        }
        response.pipe(unzip);
        request.on('error', (err) => {
          failed(err);
        });
      });
    }
  });
}

function resolveBinariesTargetPath() {
  try {
    const currentDir = process.cwd();
    const testFile = path.join(currentDir, '__test_writable__.txt');
    fs.writeFileSync(testFile, 'test writable', { encoding: 'utf8' });
    fs.unlinkSync(testFile);
    return currentDir;
  } catch {
    if (!fs.existsSync(binariesHomePath)) {
      fs.mkdirSync(binariesHomePath, { recursive: true });
    }
    return binariesHomePath;
  }
}

async function dl(dstPath, src) {
  const srcUrl = `${binariesSource}/alpha/${src}.gz`;
  const dstDir = path.dirname(path.resolve(dstPath));
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }
  process.stdout.write(`Downloading from ${srcUrl} to ${dstPath} ...`);
  await downloadAndGunzip(dstPath, srcUrl);
  process.stdout.write('\n');
}

async function main() {
  const binariesTargetPath = resolveBinariesTargetPath();
  await dl(
    path.join(
      binariesTargetPath,
      'android',
      'src',
      'main',
      'jniLibs',
      'arm64-v8a',
      'libdengine.so'
    ),
    `dengine_${binariesVersion}_react_native_aarch64-linux-android`
  );
  await dl(
    path.join(
      binariesTargetPath,
      'android',
      'src',
      'main',
      'jniLibs',
      'armeabi-v7a',
      'libdengine.so'
    ),
    `dengine_${binariesVersion}_react_native_armv7-linux-androideabi`
  );
  await dl(
    path.join(
      binariesTargetPath,
      'android',
      'src',
      'main',
      'jniLibs',
      'x86',
      'libdengine.so'
    ),
    `dengine_${binariesVersion}_react_native_i686-linux-android`
  );
  await dl(
    path.join(
      binariesTargetPath,
      'android',
      'src',
      'main',
      'jniLibs',
      'x86_64',
      'libdengine.so'
    ),
    `dengine_${binariesVersion}_react_native_x86_64-linux-android`
  );
  await dl(
    path.join(binariesTargetPath, `ios`, `libdengine.a`),
    `dengine_${binariesVersion}_react_native_ios`
  );
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
