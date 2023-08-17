import { 
    AppDebotBrowser,
    DebotClient,
    DebotInfo,
    ParamsOfAppDebotBrowserApproveVariant,
    ResultOfAppDebotBrowserGetSigningBoxVariant,
    ParamsOfAppDebotBrowserLogVariant,
    ParamsOfAppDebotBrowserSendVariant,
    ResultOfAppDebotBrowserApproveVariant,
    SigningBoxHandle
} from '@eversurf/dengine-js';
import {TonClient, KeyPair} from '@eversdk/core';
import { TerminalABI } from './abi_2.2';
import { stdin } from 'process';

export type DebotEntry = {
    handle: number;
    info: DebotInfo;
    address: string;
};

export const browserAddress = '0000000000000000000000000000000000000000000000000000000000000000';

interface DebotInterface {
    call(from: string, msg: string): Promise<string | undefined>;
}

const TerminalId = '8796536366ee21852db56dccb60bc564598b618c865fc50c8b1ab740bba128e3';

class Terminal implements DebotInterface {
    private log;
    private sdk: TonClient;

    constructor(sdk: TonClient, log: (msg: string) => void) {
        this.log = log;
        this.sdk = sdk;
    }

    async call(from: string, msg: string): Promise<string | undefined> {
        const {name, value} = await this.sdk.abi.decode_message({
            abi: {
                type: 'Serialized',
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
        if (value.answerId !== '0') {
            const {message} = await this.sdk.abi.encode_internal_message({
                abi: {
                    type: 'Serialized',
                    value: TerminalABI,
                },
                address: from,
                /** Interface address */
                src_address: `-31:${TerminalId}`,
                /** Amount of tokens on operation (must flatten BigNumber values to string) */
                value: "1000000000000000",
                call_set: value.answerId !== '0' ? { function_name: value.answerId, input: res } : undefined,
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
        stdin.read();
        return {value: "string"};
    }
}

export class DebotBrowser implements AppDebotBrowser {
    private sdk: TonClient;
    private dengine: DebotClient;
    private handlers: AppDebotBrowser;
    private mainDebot?: string;
    private outputs: string[] = [];
    private userKey: KeyPair;
    private signBox?: SigningBoxHandle;
    private msgQueue: string[] = [];
    private interfaces = new Map<string, DebotInterface>();

    private debots = new Map<string, DebotEntry>();

    constructor({
        sdk,
        dengine,
        userKey
    }: {
        sdk: TonClient;
        dengine: DebotClient;
        userKey: KeyPair;
    }) {
        this.sdk = sdk;
        this.dengine = dengine;
        this.handlers = this.createHandlers();
        this.userKey = userKey;
        this.interfaces.set(TerminalId, new Terminal(this.sdk, (msg: string) => this.outputs.push(msg)));
    }

    public start = async (address: string): Promise<string[]> => {
        if (!this.signBox) {
            const {handle} = await this.sdk.crypto.get_signing_box(this.userKey);
            this.signBox = handle;
        }        
        await this.remove();
        await this.init(address);
        this.mainDebot = address;

        var nextMsg = this.msgQueue.shift();
        while (nextMsg) {
            const parsed = await this.parseMsg(nextMsg);
            const [wc, addr] = parsed.dst.split(':');
            if (wc == "-31") {
                const iface = this.interfaces.get(addr);
                if (iface) {
                    const responseMsg = await iface.call(parsed.src, nextMsg);
                    if (responseMsg) {
                        const invokee = this.debots.get(parsed.src);
                        if (invokee) {
                            await this.dengine.debot.send({
                                debot_handle: invokee.handle, 
                                message: responseMsg 
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
                    await this.init(parsed.dst);
                    invokee = this.debots.get(parsed.dst);
                }
                if (invokee) {
                    await this.dengine.debot.send({
                        debot_handle: invokee.handle, 
                        message: nextMsg 
                    });
                }
            }

            nextMsg = this.msgQueue.shift();
        }

        return this.outputs;
    };

    private async init(address: string): Promise<void> {
        const { info, debot_handle } = await this.dengine.debot.init(
            { address: address },
            this.handlers,
        );
        this.debots.set(address, {
            handle: debot_handle,
            info,
            address
        });
    }

    private remove = async (): Promise<void> => {
        if (this.mainDebot) {
            const entry = this.debots.get(this.mainDebot);
            if (entry) {
                await this.dengine.debot.remove({ debot_handle: entry.handle });
            }
            this.mainDebot = undefined;
        }
    };

    private parseMsg = async (message: string): Promise<any> => {
        const { parsed } = await this.sdk.boc.parse_message({
            boc: message,
        });
        return parsed;
    };

    /// Interface Impl 
    private createHandlers = (): AppDebotBrowser => {
        return {
            log: this.log,
            get_signing_box: this.get_signing_box,
            send: this.send,
            approve: this.approve,
        };
    };

    log(params: ParamsOfAppDebotBrowserLogVariant): void {
        this.outputs.push(`[DEBOT]  ${params.msg}`);
    };

    async get_signing_box(): Promise<ResultOfAppDebotBrowserGetSigningBoxVariant> {
        return { signing_box: this.signBox ?? 0 };
    }

    send(params: ParamsOfAppDebotBrowserSendVariant): void {
        this.msgQueue.push(params.message);
    }

    async approve(params: ParamsOfAppDebotBrowserApproveVariant): Promise<ResultOfAppDebotBrowserApproveVariant> {
        params;
        return { approved: true};
    }

}