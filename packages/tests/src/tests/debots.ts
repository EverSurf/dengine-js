import {DebotClient} from "@eversurf/dengine-js";
import { test, beforeAll } from "../jest";
import { runner } from "../runner";
import { contracts } from "../contracts";
import { Account } from "../account";
import { DebotBrowser } from "../debot-browser";

const debots: {
    [index: number]: Account;
} = {};

const dengine = new DebotClient({endpoints: [process.env.TON_NETWORK_ADDRESS || "http://localhost"]});

const deploy_debot = async (name: any): Promise<Account> => {
    const sdk = runner.getClient();
    const debot = await runner.getAccount(contracts[name], 2);
    await runner.deploy(debot);

    const { transaction } = await sdk.processing.process_message({
        send_events: false,
        message_encode_params: {
            address: debot.addr,
            abi: debot.abi,
            call_set: {
                function_name: "setABI",
                input: {
                    dabi: debot.abi.toString()
                }
            },
            signer: debot.signer,
        }
    });
    debot.setMinExpectedLt(transaction["lt"]);
    return debot;
}

beforeAll(async () => {
    debots[1] = await deploy_debot('debot1');
})

test("Debot module import", async () => {
    
    const sdk = runner.getClient();
    const userKey = await sdk.crypto.generate_random_sign_keys();
    const browser = new DebotBrowser({sdk, dengine, userKey});
    const outputs = await browser.start(debots[1].addr);
    console.log(outputs);
});