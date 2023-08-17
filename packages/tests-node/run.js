const { program } = require("commander");
const { TonClient } = require("@eversdk/core");
const { libNode } = require("@eversdk/lib-node");
const { DebotClient } = require("@eversurf/dengine-js");
// const { libNode: dengineNode } = require("@eversurf/dengine-node");
const {
  TestsLogger,
  TestsRunner,
  zeroRunningState,
} = require("@eversdk/tests");

TestsRunner.setTimeout = setTimeout;
TestsRunner.log = console.log;
TestsRunner.exit = process.exit;

TonClient.useBinaryLibrary(libNode);
// DebotClient.useBinaryLibrary(dengineNode);

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

async function run(testNames) {
  let state = zeroRunningState;
  const logger = new TestsLogger();

  const client = new TonClient(resolveConfig());
  const runner = new TestsRunner(client);

  await runner.run((x) => (state = { ...x }), {
    log: (...args) => {
      logger.logOutput(args.join(" ") + "\n");
    },
    filter:
      testNames.length > 0
        ? (testEntry) =>
            testNames.some((testName) => testEntry.name.indexOf(testName) >= 0)
        : undefined,
  });
  console.log(state);
}

(async () => {
  program.argument("[testNames...]").action(run);
  await program.parseAsync(process.argv);
})();
