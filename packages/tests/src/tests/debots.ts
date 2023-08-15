import {DebotClient} from "@eversurf/dengine-js";
import { expect, test, beforeAll } from "../jest";
import { ABIVersions, runner } from "../runner";
import { ContractPackage } from "../contracts";
import { Account } from "../account";

var DebotAddress1: string = "";
beforeAll(async () => {
    let package1: ContractPackage = {
        abi: {},
        tvc: ""
    }
    const debot1: Account = await runner.getAccount(package1, 2);
    DebotAddress1 = await debot1.getAddress();
    await runner.deploy(debot1);
    
})

test("Debot module import", async () => {
    let client = new DebotClient({endpoints: [process.env.TON_NETWORK_ADDRESS || "http://localhost"]});
    await client.debot.init({address: DebotAddress1}. );
});