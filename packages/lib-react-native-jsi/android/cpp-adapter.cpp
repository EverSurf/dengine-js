#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <CallInvokerHolder.h>

#include "DebotClientJsiModule.h"

using namespace facebook;

struct DebotClientJsiModule : jni::JavaClass<DebotClientJsiModule>
{
public:
  __unused static constexpr auto kJavaDescriptor = "Lcom/eversurf/denginejsi/DebotClientJSIModulePackage;";

  static void registerNatives()
  {
    javaClassStatic()->registerNatives({makeNativeMethod("installJSIBindings", DebotClientJsiModule::installJSIBindings)});
  }

private:
  static void installJSIBindings(jni::alias_ref<jni::JClass>,
                                 jlong jsContext,
                                 jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder,
                                 jni::alias_ref<eversurf::DebotClientJsiBlobManager> javaBlobManager)
  {
    jsi::Runtime *runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsContext);

    std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker =
        jsCallInvokerHolder->cthis()->getCallInvoker();

    std::unique_ptr<eversurf::BlobManager> blobManager =
        std::make_unique<eversurf::BlobManager>(make_global(javaBlobManager));

    std::unique_ptr<eversurf::DebotClientJsiModule> debotClientJsiModule =
        std::make_unique<eversurf::DebotClientJsiModule>(*runtime, jsCallInvoker, std::move(blobManager));

    runtime->global().setProperty(
        *runtime,
        jsi::PropNameID::forAscii(*runtime, "DebotClientJsiModule"),
        jsi::Object::createFromHostObject(*runtime, std::move(debotClientJsiModule)));
  }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *)
{
  return facebook::jni::initialize(vm, []
                                   { DebotClientJsiModule::registerNatives(); });
}
