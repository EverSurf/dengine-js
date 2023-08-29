import { DebotClient } from "@eversurf/dengine-js";
import { test, expect } from "../jest";
import { TestsRunner, get_runner } from "../runner";
import { contracts } from "../contracts";
import { Account } from "../account";
import { DebotBrowser } from "../debot-browser";

const debots: {
  [index: number]: Account;
} = {};

const dengine = new DebotClient({
  endpoints: [process.env.TON_NETWORK_ADDRESS || "http://localhost"],
});

const deploy_debot = async (
  tests: TestsRunner,
  name: any
): Promise<Account> => {
  const debot = await tests.getAccount(contracts[name], 2);
  await tests.deploy(debot);

  const { transaction } = await tests.sdk.processing.process_message({
    send_events: false,
    message_encode_params: {
      address: debot.addr,
      abi: debot.abi,
      call_set: {
        function_name: "setABI",
        input: {
          dabi: JSON.stringify(debot.abi.value),
        },
      },
      signer: debot.signer,
    },
  });
  debot.setMinExpectedLt(transaction["lt"]);
  return debot;
};

//beforeAll(async () => {
//  debots[1] = await deploy_debot(get_runner(), "debot1");
//});

test("Debot module import", async () => {
  const sdk = get_runner().sdk;
  debots[1] = await deploy_debot(get_runner(), "debot1");
  const userKey = await sdk.crypto.generate_random_sign_keys();
  const browser = new DebotBrowser({ sdk, dengine, userKey });
  const outputs = await browser.start(debots[1].addr);
  expect(outputs).toStrictEqual(["Started"]);
});
