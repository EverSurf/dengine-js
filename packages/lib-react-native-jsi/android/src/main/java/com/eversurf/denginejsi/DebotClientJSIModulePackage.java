package com.eversurf.denginejsi;

import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.blob.BlobModule;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;

import java.util.Arrays;
import java.util.List;

public class DebotClientJSIModulePackage implements JSIModulePackage {
  static {
    System.loadLibrary("denginejsi");
  }

  public static native void installJSIBindings(long jsiPtr, CallInvokerHolderImpl jsCallInvokerHolder, DebotClientJsiBlobManager debotClientJsiBlobManager);

  @Override
  public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
    long jsiPtr = reactApplicationContext.getJavaScriptContextHolder().get();
    CallInvokerHolderImpl jsCallInvokerHolder = (CallInvokerHolderImpl) reactApplicationContext.getCatalystInstance().getJSCallInvokerHolder();
    BlobModule reactNativeBlobModule = reactApplicationContext.getNativeModule(BlobModule.class);
    DebotClientJsiBlobManager debotClientJsiBlobManager = new DebotClientJsiBlobManager(reactNativeBlobModule);

    // install JSI bindings before running bundled JS code
    DebotClientJSIModulePackage.installJSIBindings(jsiPtr, jsCallInvokerHolder, debotClientJsiBlobManager);

    return Arrays.<JSIModuleSpec>asList();
  }
}
