import {
  AppDebotBrowser,
  DebotClient,
  DebotInfo,
  ParamsOfAppDebotBrowserApproveVariant,
  ResultOfAppDebotBrowserGetSigningBoxVariant,
  ParamsOfAppDebotBrowserLogVariant,
  ParamsOfAppDebotBrowserSendVariant,
  ResultOfAppDebotBrowserApproveVariant,
  SigningBoxHandle,
  ParamsOfAppDebotBrowserDecryptVariant,
  ParamsOfAppDebotBrowserEncryptVariant,
  ParamsOfAppDebotBrowserFetchVariant,
  ParamsOfAppDebotBrowserQueryCollectionVariant,
  ParamsOfAppDebotBrowserQueryVariant,
  ParamsOfAppDebotBrowserSendMessageVariant,
  ParamsOfAppDebotBrowserSignVariant,
  ResultOfAppDebotBrowserDecryptVariant,
  ResultOfAppDebotBrowserEncryptVariant,
  ResultOfAppDebotBrowserFetchVariant,
  ResultOfAppDebotBrowserQueryCollectionVariant,
  ResultOfAppDebotBrowserQueryVariant,
  ResultOfAppDebotBrowserSendMessageVariant,
  ResultOfAppDebotBrowserSignVariant,
  FetchHeader,
  ParamsOfAppDebotBrowserGetEncryptionBoxInfoVariant,
  ParamsOfAppDebotBrowserGetSigningBoxInfoVariant,
  ParamsOfAppDebotBrowserQueryTransactionTreeVariant,
  ParamsOfAppDebotBrowserWaitForCollectionVariant,
  ParamsOfAppDebotBrowserWaitForTransactionVariant,
  ResultOfAppDebotBrowserGetEncryptionBoxInfoVariant,
  ResultOfAppDebotBrowserGetSigningBoxInfoVariant,
  ResultOfAppDebotBrowserQueryTransactionTreeVariant,
  ResultOfAppDebotBrowserWaitForCollectionVariant,
  ResultOfAppDebotBrowserWaitForTransactionVariant,
  LogLevel,
} from "@eversurf/dengine-js";
import { TonClient, KeyPair } from "@eversdk/core";
import { TerminalABI } from "./abi_2.2";
import { TestsRunner, get_runner } from "./runner";

export type DebotEntry = {
  handle: number;
  info: DebotInfo;
  address: string;
};

export const browserAddress =
  "0000000000000000000000000000000000000000000000000000000000000000";

interface DebotInterface {
  call(from: string, msg: string): Promise<string | undefined>;
}

const TerminalId =
  "8796536366ee21852db56dccb60bc564598b618c865fc50c8b1ab740bba128e3";

class Terminal implements DebotInterface {
  private log;
  private sdk: TonClient;

  constructor(sdk: TonClient, log: (msg: string) => void) {
    this.log = log;
    this.sdk = sdk;
  }

  async call(from: string, msg: string): Promise<string | undefined> {
    const { name, value } = await this.sdk.abi.decode_message({
      abi: {
        type: "Serialized",
        value: TerminalABI,
      },
      message: msg,
    });
    var res = {};
    if (name === "print") {
      res = await this.print(value.message);
    } else if (name === "input") {
      res = await this.input(value.prompt);
    }
    if (value.answerId !== "0") {
      const { message } = await this.sdk.abi.encode_internal_message({
        abi: {
          type: "Serialized",
          value: TerminalABI,
        },
        address: from,
        /** Interface address */
        src_address: `-31:${TerminalId}`,
        /** Amount of tokens on operation (must flatten BigNumber values to string) */
        value: "1000000000000000",
        call_set:
          value.answerId !== "0"
            ? { function_name: value.answerId, input: res }
            : undefined,
      });

      return message;
    }
    return undefined;
  }

  private async print(msg: string): Promise<any> {
    this.log(msg);
    return {};
  }
  private async input(prompt: string): Promise<any> {
    this.log(prompt);
    return { value: "string" };
  }
}

export class DebotBrowser implements AppDebotBrowser {
  private sdk: TonClient;
  private dengine: DebotClient;
  private handlers: AppDebotBrowser;
  private mainDebotAddress?: string;
  private outputs: string[] = [];
  private userKey: KeyPair;
  private signBox?: SigningBoxHandle;
  private msgQueue: string[] = [];
  private interfaces = new Map<string, DebotInterface>();

  private debots = new Map<string, DebotEntry>();

  constructor({
    sdk,
    dengine,
    userKey,
  }: {
    sdk: TonClient;
    dengine: DebotClient;
    userKey: KeyPair;
  }) {
    this.sdk = sdk;
    this.dengine = dengine;
    this.handlers = this.createHandlers();
    this.userKey = userKey;
    this.interfaces.set(
      TerminalId,
      new Terminal(this.sdk, (msg: string) => { this.outputs.push(msg) })
    );
  }

  public start = async (address: string): Promise<string[]> => {
    if (!this.signBox) {
      const { handle } = await this.sdk.crypto.get_signing_box(this.userKey);
      this.signBox = handle;
    }
    await this.remove();
    await this.initDebot(address);
    await this.startDebot(address);

    var nextMsg = this.msgQueue.shift();
    while (nextMsg) {
      const parsed = await this.parseMsg(nextMsg);
      const [wc, addr] = parsed.dst.split(":");
      if (wc == "-31") {
        const iface = this.interfaces.get(addr);
        if (iface) {
          const responseMsg = await iface.call(parsed.src, nextMsg);
          if (responseMsg) {
            const invokee = this.debots.get(parsed.src);
            if (invokee) {
              await this.dengine.debot.send({
                debot_handle: invokee.handle,
                message: responseMsg,
              });
            }
          }
        } else {
          break;
        }
        //interface call
      } else if (addr == browserAddress) {
        // for browser
        this.outputs.push("[BROWSER] message for browser");
        break;
      } else {
        // invoking
        var invokee = this.debots.get(parsed.dst);
        if (!invokee) {
          await this.initDebot(parsed.dst);
          invokee = this.debots.get(parsed.dst);
        }
        if (invokee) {
          await this.dengine.debot.send({
            debot_handle: invokee.handle,
            message: nextMsg,
          });
        }
      }

      nextMsg = this.msgQueue.shift();
    }

    return this.outputs;
  };

  private async initDebot(address: string): Promise<void> {
    const { info, debot_handle } = await this.dengine.debot.init(
      { address: address },
      this.handlers
    );
    this.debots.set(address, {
      handle: debot_handle,
      info,
      address,
    });
  }

  async startDebot(address: string) {
    this.mainDebotAddress = address;
    const mainDebotEntry = this.debots.get(this.mainDebotAddress);
    if (mainDebotEntry) {
      await this.dengine.debot.start({
        debot_handle: mainDebotEntry.handle,
      });
    }
  }

  private remove = async (): Promise<void> => {
    if (this.mainDebotAddress) {
      const entry = this.debots.get(this.mainDebotAddress);
      if (entry) {
        await this.dengine.debot.remove({ debot_handle: entry.handle });
      }
      this.mainDebotAddress = undefined;
    }
  };

  private parseMsg = async (message: string): Promise<any> => {
    const { parsed } = await this.sdk.boc.parse_message({
      boc: message,
    });
    return parsed;
  };

  private createHandlers = (): AppDebotBrowser => {
      return this;
    };
    
  /// Interface Impl
  log(params: ParamsOfAppDebotBrowserLogVariant): void {
    if (params.level === LogLevel.User) {
        this.outputs.push(params.msg);
    } else {
        console.log(`[${params.level}] ${params.msg}`);
    }
  }

  async get_signing_box(): Promise<ResultOfAppDebotBrowserGetSigningBoxVariant> {
    return { signing_box: this.signBox ?? 0 };
  }

  send(params: ParamsOfAppDebotBrowserSendVariant): void {
    this.msgQueue.push(params.message);
  }

  async approve(
    params: ParamsOfAppDebotBrowserApproveVariant
  ): Promise<ResultOfAppDebotBrowserApproveVariant> {
    params;
    return { approved: true };
  }
  async fetch(
    params: ParamsOfAppDebotBrowserFetchVariant
  ): Promise<ResultOfAppDebotBrowserFetchVariant> {
    const response = await TestsRunner.fetch(params.url, {
      method: params.method,
      headers: params.headers,
      body: params.body,
    });
    const headers: FetchHeader[] = [];
    response.forEach((value: string, key: string, obj: any) => {
      obj;
      headers.push({ key, value });
    });
    return {
      response: {
        status: response.status as number,
        headers,
        content: response.text as string,
      },
    };
  }
  async encrypt(
    params: ParamsOfAppDebotBrowserEncryptVariant
  ): Promise<ResultOfAppDebotBrowserEncryptVariant> {
    const sdk = get_runner().sdk;
    const res = await sdk.crypto.encryption_box_encrypt({
      encryption_box: params.handle,
      data: params.data,
    });
    return { encrypted: res.data };
  }

  async decrypt(
    params: ParamsOfAppDebotBrowserDecryptVariant
  ): Promise<ResultOfAppDebotBrowserDecryptVariant> {
    const sdk = get_runner().sdk;
    const res = await sdk.crypto.encryption_box_decrypt({
      encryption_box: params.handle,
      data: params.data,
    });
    return { decrypted: res.data };
  }
  async sign(
    params: ParamsOfAppDebotBrowserSignVariant
  ): Promise<ResultOfAppDebotBrowserSignVariant> {
    const sdk = get_runner().sdk;
    const { signature } = await sdk.crypto.signing_box_sign({
      signing_box: params.handle,
      unsigned: params.data,
    });
    return { signature };
  }
  async send_message(
    params: ParamsOfAppDebotBrowserSendMessageVariant
  ): Promise<ResultOfAppDebotBrowserSendMessageVariant> {
    const sdk = get_runner().sdk;
    const res = await sdk.processing.send_message({
      message: params.message,
    });
    return { ...res };
  }
  async query(
    params: ParamsOfAppDebotBrowserQueryVariant
  ): Promise<ResultOfAppDebotBrowserQueryVariant> {
    const sdk = get_runner().sdk;
    const res = await sdk.net.query(params.params);
    return { result: res };
  }
  async query_collection(
    params: ParamsOfAppDebotBrowserQueryCollectionVariant
  ): Promise<ResultOfAppDebotBrowserQueryCollectionVariant> {
    const sdk = get_runner().sdk;
    const res = await sdk.net.query_collection(params.params);
    return { result: res };
  }

  async wait_for_collection(
    params: ParamsOfAppDebotBrowserWaitForCollectionVariant
  ): Promise<ResultOfAppDebotBrowserWaitForCollectionVariant> {
    const sdk = get_runner().sdk;
    const result = await sdk.net.wait_for_collection(params.params);
    return { result };
  }
  async wait_for_transaction(
    params: ParamsOfAppDebotBrowserWaitForTransactionVariant
  ): Promise<ResultOfAppDebotBrowserWaitForTransactionVariant> {
    const sdk = get_runner().sdk;
    const result = await sdk.processing.wait_for_transaction(params.params);
    return { result };
  }
  async query_transaction_tree(
    params: ParamsOfAppDebotBrowserQueryTransactionTreeVariant
  ): Promise<ResultOfAppDebotBrowserQueryTransactionTreeVariant> {
    const sdk = get_runner().sdk;
    const result = await sdk.net.query_transaction_tree(params.params);
    return { result };
  }
  async get_signing_box_info(
    params: ParamsOfAppDebotBrowserGetSigningBoxInfoVariant
  ): Promise<ResultOfAppDebotBrowserGetSigningBoxInfoVariant> {
    const sdk = get_runner().sdk;
    const { pubkey } = await sdk.crypto.signing_box_get_public_key({
      handle: params.handle,
    });
    return { pubkey };
  }
  async get_encryption_box_info(
    params: ParamsOfAppDebotBrowserGetEncryptionBoxInfoVariant
  ): Promise<ResultOfAppDebotBrowserGetEncryptionBoxInfoVariant> {
    const sdk = get_runner().sdk;
    const { info } = await sdk.crypto.encryption_box_get_info({
      encryption_box: params.handle,
    });
    return { result: info };
  }
}
