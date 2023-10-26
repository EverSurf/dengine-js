import type { BinaryLibraryWithParams } from './index.d';

export function libReactNativeJsi(): Promise<BinaryLibraryWithParams> {
  const debotClientJsiModule = (global as any).debotClientJsiModule;
  return Promise.resolve({
    getLibName(): Promise<string> {
      return Promise.resolve('react-native-jsi');
    },

    setResponseParamsHandler(
      handler: (
        requestId: number,
        params: any,
        responseType: number,
        finished: boolean
      ) => void
    ): void {
      debotClientJsiModule.setResponseParamsHandler(handler);
    },
    createContext(configJson: string): Promise<string> {
      return new Promise((resolve) => {
        debotClientJsiModule.createContext(configJson, resolve);
      });
    },
    destroyContext(context: number): void {
      debotClientJsiModule.destroyContext(context);
    },
    sendRequestParams(
      context: number,
      requestId: number,
      functionName: string,
      functionParams: any
    ): void {
      debotClientJsiModule.sendRequestParams(
        context,
        requestId,
        functionName,
        replaceBigInts(functionParams)
      );
    },
  });
}

function replaceBigInts(value: any): any {
  // original JS BigInt
  if (typeof value === 'bigint') {
    if (value < Number.MAX_SAFE_INTEGER && value > Number.MIN_SAFE_INTEGER) {
      return Number(value);
    } else {
      return value.toString();
    }
  }

  // BigInt polyfill on Android
  if (typeof value === 'object' && value !== null && value.toJSON != null) {
    return value.toJSON();
  }

  // nested object or array
  if (typeof value === 'object' && value !== null) {
    const result = Array.isArray(value) ? [] : {};
    for (const key in value) {
      (result as any)[key] = replaceBigInts(value[key]);
    }
    return result;
  }

  return value;
}

function __createBlob(blobId: string, offset: number, size: number): Blob {
  const BlobManager = require('react-native/Libraries/Blob/BlobManager'); // memoized
  return BlobManager.createFromOptions({ blobId, offset, size });
}

(global as any).__createBlob = __createBlob;
