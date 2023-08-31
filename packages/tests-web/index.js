import entry from './entry';
import { TonClient } from '@eversdk/core';
import { libWeb, libWebSetup } from "@eversdk/lib-web";
import { create_runner } from "@eversurf/tests";
import { DebotClient } from "@eversurf/dengine-js";
import { libWeb as dengineWeb, libWebSetup as dengineWebSetup } from "@eversurf/dengine-web";


entry();
libWebSetup({
    disableSeparateWorker: true
})
dengineWebSetup({
    disableSeparateWorker: true
})
TonClient.useBinaryLibrary(libWeb);
DebotClient.useBinaryLibrary(dengineWeb);

function resolveConfig() {
    return {
      abi: {
        message_expiration_timeout: 5000,
        message_expiration_timeout_grow_factor: 1,
      },
      network: {
        message_retries_count: 10,
        endpoints: [`${process.env.TON_NETWORK_ADDRESS || "http://localhost"}`],
      },
    };
  }

window.addEventListener('load', () => {
    (async () => {
        try {
            const runner = create_runner(new TonClient(resolveConfig()));
            await runner.run(
                ({ version, passed, failed, finished }) => {
                    document.body.innerHTML = `Core Version ${version}<br />Passed: ${passed}<br />Failed: ${failed}<br />${finished ? 'Finished' : ''}`;
                },
                (...args) => console.log(...args),
            );
        } catch (error) {
            console.log('>>>', error);
            document.body.innerHTML = 'Error';
        }
    })();
    // startTests(() => {});
});
