#import "BlobManager.h"
#import "DebotClientJsiModule.h"
#import "TONJSIExecutorInitializer.h"

namespace eversurf
{
  using namespace facebook::react;

  JSIExecutor::RuntimeInstaller TONJSIExecutorRuntimeInstaller(
      RCTBridge *bridge,
      JSIExecutor::RuntimeInstaller runtimeInstallerToWrap)
  {
    const auto runtimeInstaller = [bridge, runtimeInstallerToWrap](facebook::jsi::Runtime &runtime)
    {
      if (!bridge)
      {
        return;
      }

      auto jsCallInvoker = bridge.jsCallInvoker;

      RCTBlobManager *reactBlobManager = [bridge moduleForName:@"BlobModule"];

      std::unique_ptr<eversurf::BlobManager> blobManager =
          std::make_unique<eversurf::BlobManager>(reactBlobManager);

      std::unique_ptr<eversurf::DebotClientJsiModule> debotClientJsiModule =
          std::make_unique<eversurf::DebotClientJsiModule>(runtime, jsCallInvoker, std::move(blobManager));

      runtime.global().setProperty(
          runtime,
          jsi::PropNameID::forAscii(runtime, "debotClientJsiModule"),
          jsi::Object::createFromHostObject(runtime, std::move(debotClientJsiModule)));

      if (runtimeInstallerToWrap)
      {
        runtimeInstallerToWrap(runtime);
      }
    };
    return runtimeInstaller;
  }

} // namespace eversurf
