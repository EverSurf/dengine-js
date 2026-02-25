package eversurf.dengine;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class DebotClientModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public DebotClientModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        DebotClientJsonInterface.IResponseHandler responseHandler = new DebotClientJsonInterface.IResponseHandler() {
            @Override
            public void invoke(long requestId, String paramsJson, long responseType, boolean finished) {
                WritableMap params = Arguments.createMap();
                params.putInt("requestId", (int) requestId);
                params.putString("paramsJson", paramsJson);
                params.putInt("responseType", (int) responseType);
                params.putBoolean("finished", finished);
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("Response", params);
            }
        };
        DebotClientJsonInterface.setResponseHandler(responseHandler);
    }

    @NonNull
    @Override
    public String getName() {
        return "DebotClientModule";
    }

    @ReactMethod
    public void sendRequest(int context, int requestId, String functionName, String functionParamsJson) {
        DebotClientJsonInterface.sendRequest(context, requestId, functionName, functionParamsJson);
    }

    @ReactMethod
    public void createContext(String configJson, Callback onResult) {
        onResult.invoke(DebotClientJsonInterface.createContext(configJson));
    }

    @ReactMethod
    public void destroyContext(int context) {
        DebotClientJsonInterface.destroyContext(context);
    }
}
