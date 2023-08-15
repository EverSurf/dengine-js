

import {ResponseHandler} from "./bin";

interface IClient {
    request(
        functionName: string,
        functionParams?: any,
        responseHandler?: ResponseHandler
    ): Promise<any>;
    requestSync(
        functionName: string,
        functionParams?: any,
    ): any;
    resolve_app_request(app_request_id: number | null, result: any): Promise<void>;
    reject_app_request(app_request_id: number | null, error: any): Promise<void>;
}

// client module


export enum ClientErrorCode {
    NotImplemented = 1,
    InvalidHex = 2,
    InvalidBase64 = 3,
    InvalidAddress = 4,
    CallbackParamsCantBeConvertedToJson = 5,
    WebsocketConnectError = 6,
    WebsocketReceiveError = 7,
    WebsocketSendError = 8,
    HttpClientCreateError = 9,
    HttpRequestCreateError = 10,
    HttpRequestSendError = 11,
    HttpRequestParseError = 12,
    CallbackNotRegistered = 13,
    NetModuleNotInit = 14,
    InvalidConfig = 15,
    CannotCreateRuntime = 16,
    InvalidContextHandle = 17,
    CannotSerializeResult = 18,
    CannotSerializeError = 19,
    CannotConvertJsValueToJson = 20,
    CannotReceiveSpawnedResult = 21,
    SetTimerError = 22,
    InvalidParams = 23,
    ContractsAddressConversionFailed = 24,
    UnknownFunction = 25,
    AppRequestError = 26,
    NoSuchRequest = 27,
    CanNotSendRequestResult = 28,
    CanNotReceiveRequestResult = 29,
    CanNotParseRequestResult = 30,
    UnexpectedCallbackResponse = 31,
    CanNotParseNumber = 32,
    InternalError = 33,
    InvalidHandle = 34,
    LocalStorageError = 35,
    InvalidData = 36
}

export type ClientError = {

    code: number,

    message: string,

    data: any
}

export type ClientConfig = {
    endpoints?: string[],
    access_key?: string
}

export type BindingConfig = {

    library?: string,

    version?: string
}

/**
 * Network protocol used to perform GraphQL queries.
 */
export enum NetworkQueriesProtocol {
    HTTP = "HTTP",
    WS = "WS"
}

export type ParamsOfAppRequest = {

    /**
     * Request ID.
     * 
     * @remarks
     * Should be used in `resolve_app_request` call
     */
    app_request_id: number,

    /**
     * Request describing data
     */
    request_data: any
}

/**
 * Error occurred during request processing
 */
export type AppRequestResultErrorVariant = {

    /**
     * Error description
     */
    text: string
}

/**
 * Request processed successfully
 */
export type AppRequestResultOkVariant = {

    /**
     * Request processing result
     */
    result: any
}

/**
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `Error`
 * 
 * Error occurred during request processing
 * 
 * ### `Ok`
 * 
 * Request processed successfully
 */
export type AppRequestResult = ({
    type: 'Error'
} & AppRequestResultErrorVariant) | ({
    type: 'Ok'
} & AppRequestResultOkVariant)

export function appRequestResultError(text: string): AppRequestResult {
    return {
        type: 'Error',
        text,
    };
}

export function appRequestResultOk(result: any): AppRequestResult {
    return {
        type: 'Ok',
        result,
    };
}

export type ResultOfGetApiReference = {

    api: any
}

export type ResultOfVersion = {

    /**
     * Core Library version
     */
    version: string
}

export type ParamsOfResolveAppRequest = {

    /**
     * Request ID received from SDK
     */
    app_request_id: number,

    /**
     * Result of request processing
     */
    result: AppRequestResult
}

/**
 * Provides information about library.
 */
export class ClientModule {
    client: IClient;

    constructor(client: IClient) {
        this.client = client;
    }

    /**
     * Returns Core Library API reference
     * @returns ResultOfGetApiReference
     */
    get_api_reference(): Promise<ResultOfGetApiReference> {
        return this.client.request('client.get_api_reference');
    }

    /**
     * Returns Core Library API reference
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * @returns ResultOfGetApiReference
     */
    get_api_reference_sync(): ResultOfGetApiReference {
        return this.client.requestSync('client.get_api_reference');
    }

    /**
     * Returns Core Library version
     * @returns ResultOfVersion
     */
    version(): Promise<ResultOfVersion> {
        return this.client.request('client.version');
    }

    /**
     * Returns Core Library version
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * @returns ResultOfVersion
     */
    version_sync(): ResultOfVersion {
        return this.client.requestSync('client.version');
    }

    /**
     * Returns Core Library API reference
     * @returns ClientConfig
     */
    config(): Promise<ClientConfig> {
        return this.client.request('client.config');
    }

    /**
     * Returns Core Library API reference
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * @returns ClientConfig
     */
    config_sync(): ClientConfig {
        return this.client.requestSync('client.config');
    }

    /**
     * Resolves application request processing result
     * 
     * @param {ParamsOfResolveAppRequest} params
     * @returns 
     */
    resolve_app_request(params: ParamsOfResolveAppRequest): Promise<void> {
        return this.client.request('client.resolve_app_request', params);
    }

    /**
     * Resolves application request processing result
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfResolveAppRequest} params
     * @returns 
     */
    resolve_app_request_sync(params: ParamsOfResolveAppRequest): void {
        this.client.requestSync('client.resolve_app_request', params);
    }
}

// crypto module


export enum CryptoErrorCode {
    InvalidPublicKey = 100,
    InvalidSecretKey = 101,
    InvalidKey = 102,
    InvalidFactorizeChallenge = 106,
    InvalidBigInt = 107,
    ScryptFailed = 108,
    InvalidKeySize = 109,
    NaclSecretBoxFailed = 110,
    NaclBoxFailed = 111,
    NaclSignFailed = 112,
    Bip39InvalidEntropy = 113,
    Bip39InvalidPhrase = 114,
    Bip32InvalidKey = 115,
    Bip32InvalidDerivePath = 116,
    Bip39InvalidDictionary = 117,
    Bip39InvalidWordCount = 118,
    MnemonicGenerationFailed = 119,
    MnemonicFromEntropyFailed = 120,
    SigningBoxNotRegistered = 121,
    InvalidSignature = 122,
    EncryptionBoxNotRegistered = 123,
    InvalidIvSize = 124,
    UnsupportedCipherMode = 125,
    CannotCreateCipher = 126,
    EncryptDataError = 127,
    DecryptDataError = 128,
    IvRequired = 129,
    CryptoBoxNotRegistered = 130,
    InvalidCryptoBoxType = 131,
    CryptoBoxSecretSerializationError = 132,
    CryptoBoxSecretDeserializationError = 133,
    InvalidNonceSize = 134
}

export type SigningBoxHandle = number

export type EncryptionBoxHandle = number

// debot module


export enum DebotErrorCode {
    DebotStartFailed = 801,
    DebotFetchFailed = 802,
    DebotExecutionFailed = 803,
    DebotInvalidHandle = 804,
    DebotInvalidJsonParams = 805,
    DebotInvalidFunctionId = 806,
    DebotInvalidAbi = 807,
    DebotGetMethodFailed = 808,
    DebotInvalidMsg = 809,
    DebotExternalCallFailed = 810,
    DebotBrowserCallbackFailed = 811,
    DebotOperationRejected = 812,
    DebotNoCode = 813
}

/**
 *  Handle of registered in SDK debot
 */
export type DebotHandle = number

/**
 *  Describes a debot action in a Debot Context.
 */
export type DebotAction = {

    /**
     * A short action description.
     * 
     * @remarks
     * Should be used by Debot Browser as name of menu item.
     */
    description: string,

    /**
     * Depends on action type.
     * 
     * @remarks
     * Can be a debot function name or a print string (for Print Action).
     */
    name: string,

    /**
     * Action type.
     */
    action_type: number,

    /**
     * ID of debot context to switch after action execution.
     */
    to: number,

    /**
     * Action attributes.
     * 
     * @remarks
     * In the form of "param=value,flag". attribute example: instant, args, fargs, sign.
     */
    attributes: string,

    /**
     * Some internal action data.
     * 
     * @remarks
     * Used by debot only.
     */
    misc: string
}

/**
 *  Describes DeBot metadata.
 */
export type DebotInfo = {

    /**
     * DeBot short name.
     */
    name?: string,

    /**
     * DeBot semantic version.
     */
    version?: string,

    /**
     * The name of DeBot deployer.
     */
    publisher?: string,

    /**
     * Short info about DeBot.
     */
    caption?: string,

    /**
     * The name of DeBot developer.
     */
    author?: string,

    /**
     * TON address of author for questions and donations.
     */
    support?: string,

    /**
     * String with the first messsage from DeBot.
     */
    hello?: string,

    /**
     * String with DeBot interface language (ISO-639).
     */
    language?: string,

    /**
     * String with DeBot ABI.
     */
    dabi?: string,

    /**
     * DeBot icon.
     */
    icon?: string,

    /**
     * Vector with IDs of DInterfaces used by DeBot.
     */
    interfaces: string[],

    /**
     * ABI version ("x.y") supported by DeBot
     */
    dabiVersion: string
}

/**
 * DeBot wants to create new transaction in blockchain.
 */
export type DebotActivityTransactionVariant = {

    /**
     * External inbound message BOC.
     */
    msg: string,

    /**
     * Target smart contract address.
     */
    dst: string,

    /**
     * List of spendings as a result of transaction.
     */
    out: Spending[],

    /**
     * Transaction total fee.
     */
    fee: bigint,

    /**
     * Indicates if target smart contract updates its code.
     */
    setcode: boolean,

    /**
     * Public key from keypair that was used to sign external message.
     */
    signkey: string,

    /**
     * Signing box handle used to sign external message.
     */
    signing_box_handle: number
}

/**
 *  Describes the operation that the DeBot wants to perform.
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `Transaction`
 * 
 * DeBot wants to create new transaction in blockchain.
 */
export type DebotActivity = ({
    type: 'Transaction'
} & DebotActivityTransactionVariant)

export function debotActivityTransaction(msg: string, dst: string, out: Spending[], fee: bigint, setcode: boolean, signkey: string, signing_box_handle: number): DebotActivity {
    return {
        type: 'Transaction',
        msg,
        dst,
        out,
        fee,
        setcode,
        signkey,
        signing_box_handle,
    };
}

/**
 *  Describes how much funds will be debited from the target  contract balance as a result of the transaction.
 */
export type Spending = {

    /**
     * Amount of nanotokens that will be sent to `dst` address.
     */
    amount: bigint,

    /**
     * Destination address of recipient of funds.
     */
    dst: string
}

/**
 *  Parameters to init DeBot.
 */
export type ParamsOfInit = {

    /**
     * Debot smart contract address
     */
    address: string
}

/**
 *  Structure for storing debot handle returned from `init` function.
 */
export type RegisteredDebot = {

    /**
     * Debot handle which references an instance of debot engine.
     */
    debot_handle: DebotHandle,

    /**
     * Debot abi as json string.
     */
    debot_abi: string,

    /**
     * Debot metadata.
     */
    info: DebotInfo
}

/**
 * Print message to user.
 */
export type ParamsOfAppDebotBrowserLogVariant = {

    /**
     * A string that must be printed to user.
     */
    msg: string
}

/**
 * Switch debot to another context (menu).
 */
export type ParamsOfAppDebotBrowserSwitchVariant = {

    /**
     * Debot context ID to which debot is switched.
     */
    context_id: number
}

/**
 * Notify browser that all context actions are shown.
 */
export type ParamsOfAppDebotBrowserSwitchCompletedVariant = {

}

/**
 * Show action to the user. Called after `switch` for each action in context.
 */
export type ParamsOfAppDebotBrowserShowActionVariant = {

    /**
     * Debot action that must be shown to user as menu item. At least `description` property must be shown from [DebotAction] structure.
     */
    action: DebotAction
}

/**
 * Request user input.
 */
export type ParamsOfAppDebotBrowserInputVariant = {

    /**
     * A prompt string that must be printed to user before input request.
     */
    prompt: string
}

/**
 * Get signing box to sign data.
 * 
 * @remarks
 * Signing box returned is owned and disposed by debot engine
 */
export type ParamsOfAppDebotBrowserGetSigningBoxVariant = {

}

/**
 * Execute action of another debot.
 */
export type ParamsOfAppDebotBrowserInvokeDebotVariant = {

    /**
     * Address of debot in blockchain.
     */
    debot_addr: string,

    /**
     * Debot action to execute.
     */
    action: DebotAction
}

/**
 * Used by Debot to call DInterface implemented by Debot Browser.
 */
export type ParamsOfAppDebotBrowserSendVariant = {

    /**
     * Internal message to DInterface address.
     * 
     * @remarks
     * Message body contains interface function and parameters.
     */
    message: string
}

/**
 * Requests permission from DeBot Browser to execute DeBot operation.
 */
export type ParamsOfAppDebotBrowserApproveVariant = {

    /**
     * DeBot activity details.
     */
    activity: DebotActivity
}

/**
 * Debot Browser callbacks
 * 
 * @remarks
 * Called by debot engine to communicate with debot browser.
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `Log`
 * 
 * Print message to user.
 * 
 * ### `Switch`
 * 
 * Switch debot to another context (menu).
 * 
 * ### `SwitchCompleted`
 * 
 * Notify browser that all context actions are shown.
 * 
 * ### `ShowAction`
 * 
 * Show action to the user. Called after `switch` for each action in context.
 * 
 * ### `Input`
 * 
 * Request user input.
 * 
 * ### `GetSigningBox`
 * 
 * Get signing box to sign data.
 * 
 * ### `InvokeDebot`
 * 
 * Execute action of another debot.
 * 
 * ### `Send`
 * 
 * Used by Debot to call DInterface implemented by Debot Browser.
 * 
 * ### `Approve`
 * 
 * Requests permission from DeBot Browser to execute DeBot operation.
 */
export type ParamsOfAppDebotBrowser = ({
    type: 'Log'
} & ParamsOfAppDebotBrowserLogVariant) | ({
    type: 'GetSigningBox'
} & ParamsOfAppDebotBrowserGetSigningBoxVariant) | ({
    type: 'Send'
} & ParamsOfAppDebotBrowserSendVariant) | ({
    type: 'Approve'
} & ParamsOfAppDebotBrowserApproveVariant)

export function paramsOfAppDebotBrowserLog(msg: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Log',
        msg,
    };
}

export function paramsOfAppDebotBrowserGetSigningBox(): ParamsOfAppDebotBrowser {
    return {
        type: 'GetSigningBox',
    };
}

export function paramsOfAppDebotBrowserSend(message: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Send',
        message,
    };
}

export function paramsOfAppDebotBrowserApprove(activity: DebotActivity): ParamsOfAppDebotBrowser {
    return {
        type: 'Approve',
        activity,
    };
}

/**
 * Result of user input.
 */
export type ResultOfAppDebotBrowserInputVariant = {

    /**
     * String entered by user.
     */
    value: string
}

/**
 * Result of getting signing box.
 */
export type ResultOfAppDebotBrowserGetSigningBoxVariant = {

    /**
     * Signing box for signing data requested by debot engine.
     * 
     * @remarks
     * Signing box is owned and disposed by debot engine
     */
    signing_box: SigningBoxHandle
}

/**
 * Result of debot invoking.
 */
export type ResultOfAppDebotBrowserInvokeDebotVariant = {

}

/**
 * Result of `approve` callback.
 */
export type ResultOfAppDebotBrowserApproveVariant = {

    /**
     * Indicates whether the DeBot is allowed to perform the specified operation.
     */
    approved: boolean
}

/**
 *  Returning values from Debot Browser callbacks.
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `Input`
 * 
 * Result of user input.
 * 
 * ### `GetSigningBox`
 * 
 * Result of getting signing box.
 * 
 * ### `InvokeDebot`
 * 
 * Result of debot invoking.
 * 
 * ### `Approve`
 * 
 * Result of `approve` callback.
 */
export type ResultOfAppDebotBrowser = ({
    type: 'GetSigningBox'
} & ResultOfAppDebotBrowserGetSigningBoxVariant) | ({
    type: 'Approve'
} & ResultOfAppDebotBrowserApproveVariant)

export function resultOfAppDebotBrowserGetSigningBox(signing_box: SigningBoxHandle): ResultOfAppDebotBrowser {
    return {
        type: 'GetSigningBox',
        signing_box,
    };
}

export function resultOfAppDebotBrowserApprove(approved: boolean): ResultOfAppDebotBrowser {
    return {
        type: 'Approve',
        approved,
    };
}

/**
 *  Parameters to start DeBot. DeBot must be already initialized with init() function.
 */
export type ParamsOfStart = {

    /**
     * Debot handle which references an instance of debot engine.
     */
    debot_handle: DebotHandle
}

/**
 *  Parameters to fetch DeBot metadata.
 */
export type ParamsOfFetch = {

    /**
     * Debot smart contract address.
     */
    address: string
}

/**
 * 
 */
export type ResultOfFetch = {

    /**
     * Debot metadata.
     */
    info: DebotInfo
}

/**
 *  Parameters for executing debot action.
 */
export type ParamsOfExecute = {

    /**
     * Debot handle which references an instance of debot engine.
     */
    debot_handle: DebotHandle,

    /**
     * Debot Action that must be executed.
     */
    action: DebotAction
}

/**
 *  Parameters of `send` function.
 */
export type ParamsOfSend = {

    /**
     * Debot handle which references an instance of debot engine.
     */
    debot_handle: DebotHandle,

    /**
     * BOC of internal message to debot encoded in base64 format.
     */
    message: string
}

/**
 * 
 */
export type ParamsOfRemove = {

    /**
     * Debot handle which references an instance of debot engine.
     */
    debot_handle: DebotHandle
}

export interface AppDebotBrowser {
    log(params: ParamsOfAppDebotBrowserLogVariant): void,
    get_signing_box(): Promise<ResultOfAppDebotBrowserGetSigningBoxVariant>,
    send(params: ParamsOfAppDebotBrowserSendVariant): void,
    approve(params: ParamsOfAppDebotBrowserApproveVariant): Promise<ResultOfAppDebotBrowserApproveVariant>,
}

async function dispatchAppDebotBrowser(obj: AppDebotBrowser, params: ParamsOfAppDebotBrowser, app_request_id: number | null, client: IClient) {
    try {
        let result = {};
        switch (params.type) {
            case 'Log':
                obj.log(params);
                break;
            case 'GetSigningBox':
                result = await obj.get_signing_box();
                break;
            case 'Send':
                obj.send(params);
                break;
            case 'Approve':
                result = await obj.approve(params);
                break;
        }
        client.resolve_app_request(app_request_id, { type: params.type, ...result });
    }
    catch (error) {
        client.reject_app_request(app_request_id, error);
    }
}
/**
 * Module for working with debot.
 */
export class DebotModule {
    client: IClient;

    constructor(client: IClient) {
        this.client = client;
    }

    /**
     *  Creates and instance of DeBot.
     * 
     * @remarks
     * Downloads debot smart contract (code and data) from blockchain and creates
     * an instance of Debot Engine for it.
     * 
     * # Remarks
     * It does not switch debot to context 0. Browser Callbacks are not called.
     * 
     * @param {ParamsOfInit} params
     * @returns RegisteredDebot
     */
    init(params: ParamsOfInit, obj: AppDebotBrowser): Promise<RegisteredDebot> {
        return this.client.request('debot.init', params, (params: any, responseType: number) => {
            if (responseType === 3) {
                dispatchAppDebotBrowser(obj, params.request_data, params.app_request_id, this.client);
            } else if (responseType === 4) {
                dispatchAppDebotBrowser(obj, params, null, this.client);
            }
        });
    }

    /**
     *  Creates and instance of DeBot.
     * 
     * @remarks
     * Downloads debot smart contract (code and data) from blockchain and creates
     * an instance of Debot Engine for it.
     * 
     * # Remarks
     * It does not switch debot to context 0. Browser Callbacks are not called.
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfInit} params
     * @returns RegisteredDebot
     */
    init_sync(params: ParamsOfInit): RegisteredDebot {
        return this.client.requestSync('debot.init', params);
    }

    /**
     *  Starts the DeBot.
     * 
     * @remarks
     * Downloads debot smart contract from blockchain and switches it to
     * context zero.
     * 
     * This function must be used by Debot Browser to start a dialog with debot.
     * While the function is executing, several Browser Callbacks can be called,
     * since the debot tries to display all actions from the context 0 to the user.
     * 
     * When the debot starts SDK registers `BrowserCallbacks` AppObject.
     * Therefore when `debote.remove` is called the debot is being deleted and the callback is called
     * with `finish`=`true` which indicates that it will never be used again.
     * 
     * @param {ParamsOfStart} params
     * @returns 
     */
    start(params: ParamsOfStart): Promise<void> {
        return this.client.request('debot.start', params);
    }

    /**
     *  Starts the DeBot.
     * 
     * @remarks
     * Downloads debot smart contract from blockchain and switches it to
     * context zero.
     * 
     * This function must be used by Debot Browser to start a dialog with debot.
     * While the function is executing, several Browser Callbacks can be called,
     * since the debot tries to display all actions from the context 0 to the user.
     * 
     * When the debot starts SDK registers `BrowserCallbacks` AppObject.
     * Therefore when `debote.remove` is called the debot is being deleted and the callback is called
     * with `finish`=`true` which indicates that it will never be used again.
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfStart} params
     * @returns 
     */
    start_sync(params: ParamsOfStart): void {
        this.client.requestSync('debot.start', params);
    }

    /**
     *  Fetches DeBot metadata from blockchain.
     * 
     * @remarks
     * Downloads DeBot from blockchain and creates and fetches its metadata.
     * 
     * @param {ParamsOfFetch} params
     * @returns ResultOfFetch
     */
    fetch(params: ParamsOfFetch): Promise<ResultOfFetch> {
        return this.client.request('debot.fetch', params);
    }

    /**
     *  Fetches DeBot metadata from blockchain.
     * 
     * @remarks
     * Downloads DeBot from blockchain and creates and fetches its metadata.
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfFetch} params
     * @returns ResultOfFetch
     */
    fetch_sync(params: ParamsOfFetch): ResultOfFetch {
        return this.client.requestSync('debot.fetch', params);
    }

    /**
     *  Sends message to Debot.
     * 
     * @remarks
     * Used by Debot Browser to send response on Dinterface call or from other Debots.
     * 
     * @param {ParamsOfSend} params
     * @returns 
     */
    send(params: ParamsOfSend): Promise<void> {
        return this.client.request('debot.send', params);
    }

    /**
     *  Sends message to Debot.
     * 
     * @remarks
     * Used by Debot Browser to send response on Dinterface call or from other Debots.
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfSend} params
     * @returns 
     */
    send_sync(params: ParamsOfSend): void {
        this.client.requestSync('debot.send', params);
    }

    /**
     *  Destroys debot handle.
     * 
     * @remarks
     * Removes handle from Client Context and drops debot engine referenced by that handle.
     * 
     * @param {ParamsOfRemove} params
     * @returns 
     */
    remove(params: ParamsOfRemove): Promise<void> {
        return this.client.request('debot.remove', params);
    }

    /**
     *  Destroys debot handle.
     * 
     * @remarks
     * Removes handle from Client Context and drops debot engine referenced by that handle.
     * 
     * NOTE: Available only for `lib-node` binding.
     * 
     * 
     * 
     * @param {ParamsOfRemove} params
     * @returns 
     */
    remove_sync(params: ParamsOfRemove): void {
        this.client.requestSync('debot.remove', params);
    }
}

