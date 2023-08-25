

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
    InvalidData = 36,
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

export type ClientError = {

    code: number,

    message: string,

    data: any
}

export type BindingConfig = {

    library?: string,

    version?: string
}

export type ClientConfig = {

    endpoints?: string[],

    access_key?: string
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

export type DebotHandle = number

/**
 * Describes `Debot` metadata.
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
 * Describes the operation that the `DeBot` wants to perform.
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

export type FetchResponse = {

    status: number,

    headers: FetchHeader[],

    content: string
}

export type FetchHeader = {

    key: string,

    value: string
}

/**
 * Describes how much funds will be debited from the target  contract balance as a result of the transaction.
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

export type EncryptionBoxHandle = number

export type SigningBoxHandle = number

export type ParamsOfQuery = {

    /**
     * GraphQL query text.
     */
    query: string,

    /**
     * Variables used in query.
     * 
     * @remarks
     * Must be a map with named values that can be used in query.
     */
    variables?: any
}

export type ParamsOfQueryCollection = {

    /**
     * Collection name (accounts, blocks, transactions, messages, block_signatures)
     */
    collection: string,

    /**
     * Collection filter
     */
    filter?: any,

    /**
     * Projection (result) string
     */
    result: string,

    /**
     * Sorting order
     */
    order?: OrderBy[],

    /**
     * Number of documents to return
     */
    limit?: number
}

export type ResultOfQuery = {

    /**
     * Result provided by DAppServer.
     */
    result: any
}

export type ResultOfQueryCollection = {

    /**
     * Objects that match the provided criteria
     */
    result: any[]
}

export type OrderBy = {

    path: string,

    direction: SortDirection
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export type ParamsOfWaitForCollection = {

    /**
     * Collection name (accounts, blocks, transactions, messages, block_signatures)
     */
    collection: string,

    /**
     * Collection filter
     */
    filter?: any,

    /**
     * Projection (result) string
     */
    result: string,

    /**
     * Query timeout
     */
    timeout?: number
}

export type ResultOfWaitForCollection = {

    /**
     * First found object that matches the provided criteria
     */
    result: any
}

/**
 * Encryption box information.
 */
export type EncryptionBoxInfo = {

    /**
     * Derivation path, for instance "m/44'/396'/0'/0/0"
     */
    hdpath?: string,

    /**
     * Cryptographic algorithm, used by this encryption box
     */
    algorithm?: string,

    /**
     * Options, depends on algorithm and specific encryption box implementation
     */
    options?: any,

    /**
     * Public information, depends on algorithm
     */
    public?: any
}

export type MessageNode = {

    /**
     * Message id.
     */
    id: string,

    /**
     * Source transaction id.
     * 
     * @remarks
     * This field is missing for an external inbound messages.
     */
    src_transaction_id?: string,

    /**
     * Destination transaction id.
     * 
     * @remarks
     * This field is missing for an external outbound messages.
     */
    dst_transaction_id?: string,

    /**
     * Source address.
     */
    src?: string,

    /**
     * Destination address.
     */
    dst?: string,

    /**
     * Transferred tokens value.
     */
    value?: string,

    /**
     * Bounce flag.
     */
    bounce: boolean,

    /**
     * Decoded body.
     * 
     * @remarks
     * Library tries to decode message body using provided `params.abi_registry`.
     * This field will be missing if none of the provided abi can be used to decode.
     */
    decoded_body?: DecodedMessageBody
}

export type TransactionNode = {

    /**
     * Transaction id.
     */
    id: string,

    /**
     * In message id.
     */
    in_msg: string,

    /**
     * Out message ids.
     */
    out_msgs: string[],

    /**
     * Account address.
     */
    account_addr: string,

    /**
     * Transactions total fees.
     */
    total_fees: string,

    /**
     * Aborted flag.
     */
    aborted: boolean,

    /**
     * Compute phase exit code.
     */
    exit_code?: number
}

export type ParamsOfQueryTransactionTree = {

    /**
     * Input message id.
     */
    in_msg: string,

    /**
     * List of contract ABIs that will be used to decode message bodies. Library will try to decode each returned message body using any ABI from the registry.
     */
    abi_registry?: Abi[],

    /**
     * Timeout used to limit waiting time for the missing messages and transaction.
     * 
     * @remarks
     * If some of the following messages and transactions are missing yet
     * The maximum waiting time is regulated by this option.
     * 
     * Default value is 60000 (1 min). If `timeout` is set to 0 then function will wait infinitely
     * until the whole transaction tree is executed
     */
    timeout?: number,

    /**
     * Maximum transaction count to wait.
     * 
     * @remarks
     * If transaction tree contains more transaction then this parameter then only first `transaction_max_count` transaction are awaited and returned.
     * 
     * Default value is 50. If `transaction_max_count` is set to 0 then no limitation on
     * transaction count is used and all transaction are returned.
     */
    transaction_max_count?: number
}

export type ResultOfQueryTransactionTree = {

    /**
     * Messages.
     */
    messages: MessageNode[],

    /**
     * Transactions.
     */
    transactions: TransactionNode[]
}

export type ResultOfProcessMessage = {

    /**
     * Parsed transaction.
     * 
     * @remarks
     * In addition to the regular transaction fields there is a
     * `boc` field encoded with `base64` which contains source
     * transaction BOC.
     */
    transaction: any,

    /**
     * List of output messages' BOCs.
     * 
     * @remarks
     * Encoded as `base64`
     */
    out_messages: string[],

    /**
     * Optional decoded message bodies according to the optional `abi` parameter.
     */
    decoded?: DecodedOutput,

    /**
     * Transaction fees
     */
    fees: TransactionFees
}

export type WaitForTransactionParams = {

    abi?: Abi,

    message: string,

    shard_block_id: string,

    send_events?: boolean,

    sending_endpoints?: string[]
}

export type DecodedMessageBody = {

    /**
     * Type of the message body content.
     */
    body_type: MessageBodyType,

    /**
     * Function or event name.
     */
    name: string,

    /**
     * Parameters or result value.
     */
    value?: any,

    /**
     * Function header.
     */
    header?: FunctionHeader
}

export type TransactionFees = {

    /**
     * Deprecated.
     * 
     * @remarks
     * Contains the same data as ext_in_msg_fee field
     */
    in_msg_fwd_fee: bigint,

    /**
     * Fee for account storage
     */
    storage_fee: bigint,

    /**
     * Fee for processing
     */
    gas_fee: bigint,

    /**
     * Deprecated.
     * 
     * @remarks
     * Contains the same data as total_fwd_fees field. Deprecated because of its confusing name, that is not the same with GraphQL API Transaction type's field.
     */
    out_msgs_fwd_fee: bigint,

    /**
     * Deprecated.
     * 
     * @remarks
     * Contains the same data as account_fees field
     */
    total_account_fees: bigint,

    /**
     * Deprecated because it means total value sent in the transaction, which does not relate to any fees.
     */
    total_output: bigint,

    /**
     * Fee for inbound external message import.
     */
    ext_in_msg_fee: bigint,

    /**
     * Total fees the account pays for message forwarding
     */
    total_fwd_fees: bigint,

    /**
     * Total account fees for the transaction execution. Compounds of storage_fee + gas_fee + ext_in_msg_fee + total_fwd_fees
     */
    account_fees: bigint
}

export type DecodedOutput = {

    /**
     * Decoded bodies of the out messages.
     * 
     * @remarks
     * If the message can't be decoded, then `None` will be stored in
     * the appropriate position.
     */
    out_messages: DecodedMessageBody | null[],

    /**
     * Decoded body of the function output message.
     */
    output?: any
}

export type AbiContractVariant = {

    value: AbiContract
}

export type AbiJsonVariant = {

    value: string
}

export type AbiHandleVariant = {

    value: AbiHandle
}

export type AbiSerializedVariant = {

    value: AbiContract
}

/**
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `Contract`
 * 
 * 
 * ### `Json`
 * 
 * 
 * ### `Handle`
 * 
 * 
 * ### `Serialized`
 * 
 */
export type Abi = ({
    type: 'Contract'
} & AbiContractVariant) | ({
    type: 'Json'
} & AbiJsonVariant) | ({
    type: 'Handle'
} & AbiHandleVariant) | ({
    type: 'Serialized'
} & AbiSerializedVariant)

export function abiContract(value: AbiContract): Abi {
    return {
        type: 'Contract',
        value,
    };
}

export function abiJson(value: string): Abi {
    return {
        type: 'Json',
        value,
    };
}

export function abiHandle(value: AbiHandle): Abi {
    return {
        type: 'Handle',
        value,
    };
}

export function abiSerialized(value: AbiContract): Abi {
    return {
        type: 'Serialized',
        value,
    };
}

export type AbiContract = {

    'ABI version'?: number,

    abi_version?: number,

    version?: string | null,

    header?: string[],

    functions?: AbiFunction[],

    events?: AbiEvent[],

    data?: AbiData[],

    fields?: AbiParam[]
}

export type AbiEvent = {

    name: string,

    inputs: AbiParam[],

    id?: string | null
}

export type AbiFunction = {

    name: string,

    inputs: AbiParam[],

    outputs: AbiParam[],

    id?: string | null
}

export type AbiParam = {

    name: string,

    type: string,

    components?: AbiParam[]
}

export type AbiData = {

    key: number,

    name: string,

    type: string,

    components?: AbiParam[]
}

export type AbiHandle = number

export enum MessageBodyType {
    Input = "Input",
    Output = "Output",
    InternalOutput = "InternalOutput",
    Event = "Event"
}

/**
 * The ABI function header.
 * 
 * @remarks
 * Includes several hidden function parameters that contract
 * uses for security, message delivery monitoring and replay protection reasons.
 * 
 * The actual set of header fields depends on the contract's ABI.
 * If a contract's ABI does not include some headers, then they are not filled.
 */
export type FunctionHeader = {

    /**
     * Message expiration timestamp (UNIX time) in seconds.
     * 
     * @remarks
     * If not specified - calculated automatically from message_expiration_timeout(),
     * try_index and message_expiration_timeout_grow_factor() (if ABI includes `expire` header).
     */
    expire?: number,

    /**
     * Message creation time in milliseconds.
     * 
     * @remarks
     * If not specified, `now` is used (if ABI includes `time` header).
     */
    time?: bigint,

    /**
     * Public key is used by the contract to check the signature.
     * 
     * @remarks
     * Encoded in `hex`. If not specified, method fails with exception (if ABI includes `pubkey` header)..
     */
    pubkey?: string
}

/**
 * Parameters to init DeBot.
 */
export type ParamsOfInit = {

    /**
     * Debot smart contract address
     */
    address: string
}

/**
 * Structure for storing debot handle returned from `init` function.
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
 * Get signing box to sign data.
 * 
 * @remarks
 * Signing box returned is owned and disposed by debot engine
 */
export type ParamsOfAppDebotBrowserGetSigningBoxVariant = {

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

export type ParamsOfAppDebotBrowserFetchVariant = {

    url: string,

    method: string,

    headers: FetchHeader[],

    body?: string
}

export type ParamsOfAppDebotBrowserEncryptVariant = {

    handle: EncryptionBoxHandle,

    data: string
}

export type ParamsOfAppDebotBrowserDecryptVariant = {

    handle: EncryptionBoxHandle,

    data: string
}

export type ParamsOfAppDebotBrowserSignVariant = {

    handle: SigningBoxHandle,

    data: string
}

export type ParamsOfAppDebotBrowserSendMessageVariant = {

    message: string
}

export type ParamsOfAppDebotBrowserQueryVariant = {

    params: ParamsOfQuery
}

export type ParamsOfAppDebotBrowserQueryCollectionVariant = {

    params: ParamsOfQueryCollection
}

export type ParamsOfAppDebotBrowserWaitForCollectionVariant = {

    params: ParamsOfWaitForCollection
}

export type ParamsOfAppDebotBrowserWaitForTransactionVariant = {

    params: WaitForTransactionParams
}

export type ParamsOfAppDebotBrowserQueryTransactionTreeVariant = {

    params: ParamsOfQueryTransactionTree
}

export type ParamsOfAppDebotBrowserGetSigningBoxInfoVariant = {

    handle: SigningBoxHandle
}

export type ParamsOfAppDebotBrowserGetEncryptionBoxInfoVariant = {

    handle: EncryptionBoxHandle
}

/**
 *  [DEPRECATED](DEPRECATED.md) Debot Browser callbacks
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
 * ### `GetSigningBox`
 * 
 * Get signing box to sign data.
 * 
 * ### `Send`
 * 
 * Used by Debot to call DInterface implemented by Debot Browser.
 * 
 * ### `Approve`
 * 
 * Requests permission from DeBot Browser to execute DeBot operation.
 * 
 * ### `Fetch`
 * 
 * 
 * ### `Encrypt`
 * 
 * 
 * ### `Decrypt`
 * 
 * 
 * ### `Sign`
 * 
 * 
 * ### `SendMessage`
 * 
 * 
 * ### `Query`
 * 
 * 
 * ### `QueryCollection`
 * 
 * 
 * ### `WaitForCollection`
 * 
 * 
 * ### `WaitForTransaction`
 * 
 * 
 * ### `QueryTransactionTree`
 * 
 * 
 * ### `GetSigningBoxInfo`
 * 
 * 
 * ### `GetEncryptionBoxInfo`
 * 
 */
export type ParamsOfAppDebotBrowser = ({
    type: 'Log'
} & ParamsOfAppDebotBrowserLogVariant) | ({
    type: 'GetSigningBox'
} & ParamsOfAppDebotBrowserGetSigningBoxVariant) | ({
    type: 'Send'
} & ParamsOfAppDebotBrowserSendVariant) | ({
    type: 'Approve'
} & ParamsOfAppDebotBrowserApproveVariant) | ({
    type: 'Fetch'
} & ParamsOfAppDebotBrowserFetchVariant) | ({
    type: 'Encrypt'
} & ParamsOfAppDebotBrowserEncryptVariant) | ({
    type: 'Decrypt'
} & ParamsOfAppDebotBrowserDecryptVariant) | ({
    type: 'Sign'
} & ParamsOfAppDebotBrowserSignVariant) | ({
    type: 'SendMessage'
} & ParamsOfAppDebotBrowserSendMessageVariant) | ({
    type: 'Query'
} & ParamsOfAppDebotBrowserQueryVariant) | ({
    type: 'QueryCollection'
} & ParamsOfAppDebotBrowserQueryCollectionVariant) | ({
    type: 'WaitForCollection'
} & ParamsOfAppDebotBrowserWaitForCollectionVariant) | ({
    type: 'WaitForTransaction'
} & ParamsOfAppDebotBrowserWaitForTransactionVariant) | ({
    type: 'QueryTransactionTree'
} & ParamsOfAppDebotBrowserQueryTransactionTreeVariant) | ({
    type: 'GetSigningBoxInfo'
} & ParamsOfAppDebotBrowserGetSigningBoxInfoVariant) | ({
    type: 'GetEncryptionBoxInfo'
} & ParamsOfAppDebotBrowserGetEncryptionBoxInfoVariant)

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

export function paramsOfAppDebotBrowserFetch(url: string, method: string, headers: FetchHeader[], body?: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Fetch',
        url,
        method,
        headers,
        body,
    };
}

export function paramsOfAppDebotBrowserEncrypt(handle: EncryptionBoxHandle, data: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Encrypt',
        handle,
        data,
    };
}

export function paramsOfAppDebotBrowserDecrypt(handle: EncryptionBoxHandle, data: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Decrypt',
        handle,
        data,
    };
}

export function paramsOfAppDebotBrowserSign(handle: SigningBoxHandle, data: string): ParamsOfAppDebotBrowser {
    return {
        type: 'Sign',
        handle,
        data,
    };
}

export function paramsOfAppDebotBrowserSendMessage(message: string): ParamsOfAppDebotBrowser {
    return {
        type: 'SendMessage',
        message,
    };
}

export function paramsOfAppDebotBrowserQuery(params: ParamsOfQuery): ParamsOfAppDebotBrowser {
    return {
        type: 'Query',
        params,
    };
}

export function paramsOfAppDebotBrowserQueryCollection(params: ParamsOfQueryCollection): ParamsOfAppDebotBrowser {
    return {
        type: 'QueryCollection',
        params,
    };
}

export function paramsOfAppDebotBrowserWaitForCollection(params: ParamsOfWaitForCollection): ParamsOfAppDebotBrowser {
    return {
        type: 'WaitForCollection',
        params,
    };
}

export function paramsOfAppDebotBrowserWaitForTransaction(params: WaitForTransactionParams): ParamsOfAppDebotBrowser {
    return {
        type: 'WaitForTransaction',
        params,
    };
}

export function paramsOfAppDebotBrowserQueryTransactionTree(params: ParamsOfQueryTransactionTree): ParamsOfAppDebotBrowser {
    return {
        type: 'QueryTransactionTree',
        params,
    };
}

export function paramsOfAppDebotBrowserGetSigningBoxInfo(handle: SigningBoxHandle): ParamsOfAppDebotBrowser {
    return {
        type: 'GetSigningBoxInfo',
        handle,
    };
}

export function paramsOfAppDebotBrowserGetEncryptionBoxInfo(handle: EncryptionBoxHandle): ParamsOfAppDebotBrowser {
    return {
        type: 'GetEncryptionBoxInfo',
        handle,
    };
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
 * Result of `approve` callback.
 */
export type ResultOfAppDebotBrowserApproveVariant = {

    /**
     * Indicates whether the DeBot is allowed to perform the specified operation.
     */
    approved: boolean
}

export type ResultOfAppDebotBrowserFetchVariant = {

    response: FetchResponse
}

export type ResultOfAppDebotBrowserEncryptVariant = {

    encrypted: string
}

export type ResultOfAppDebotBrowserDecryptVariant = {

    decrypted: string
}

export type ResultOfAppDebotBrowserSignVariant = {

    signature: string
}

export type ResultOfAppDebotBrowserSendMessageVariant = {

    shard_block_id: string,

    sending_endpoints: string[]
}

export type ResultOfAppDebotBrowserQueryVariant = {

    result: ResultOfQuery
}

export type ResultOfAppDebotBrowserQueryCollectionVariant = {

    result: ResultOfQueryCollection
}

export type ResultOfAppDebotBrowserWaitForCollectionVariant = {

    result: ResultOfWaitForCollection
}

export type ResultOfAppDebotBrowserWaitForTransactionVariant = {

    result: ResultOfProcessMessage
}

export type ResultOfAppDebotBrowserQueryTransactionTreeVariant = {

    result: ResultOfQueryTransactionTree
}

export type ResultOfAppDebotBrowserGetSigningBoxInfoVariant = {

    pubkey: string
}

export type ResultOfAppDebotBrowserGetEncryptionBoxInfoVariant = {

    result: EncryptionBoxInfo
}

/**
 * Returning values from Debot Browser callbacks.
 * 
 * Depends on `type` field.
 * 
 * 
 * ### `GetSigningBox`
 * 
 * Result of getting signing box.
 * 
 * ### `Approve`
 * 
 * Result of `approve` callback.
 * 
 * ### `Fetch`
 * 
 * 
 * ### `Encrypt`
 * 
 * 
 * ### `Decrypt`
 * 
 * 
 * ### `Sign`
 * 
 * 
 * ### `SendMessage`
 * 
 * 
 * ### `Query`
 * 
 * 
 * ### `QueryCollection`
 * 
 * 
 * ### `WaitForCollection`
 * 
 * 
 * ### `WaitForTransaction`
 * 
 * 
 * ### `QueryTransactionTree`
 * 
 * 
 * ### `GetSigningBoxInfo`
 * 
 * 
 * ### `GetEncryptionBoxInfo`
 * 
 */
export type ResultOfAppDebotBrowser = ({
    type: 'GetSigningBox'
} & ResultOfAppDebotBrowserGetSigningBoxVariant) | ({
    type: 'Approve'
} & ResultOfAppDebotBrowserApproveVariant) | ({
    type: 'Fetch'
} & ResultOfAppDebotBrowserFetchVariant) | ({
    type: 'Encrypt'
} & ResultOfAppDebotBrowserEncryptVariant) | ({
    type: 'Decrypt'
} & ResultOfAppDebotBrowserDecryptVariant) | ({
    type: 'Sign'
} & ResultOfAppDebotBrowserSignVariant) | ({
    type: 'SendMessage'
} & ResultOfAppDebotBrowserSendMessageVariant) | ({
    type: 'Query'
} & ResultOfAppDebotBrowserQueryVariant) | ({
    type: 'QueryCollection'
} & ResultOfAppDebotBrowserQueryCollectionVariant) | ({
    type: 'WaitForCollection'
} & ResultOfAppDebotBrowserWaitForCollectionVariant) | ({
    type: 'WaitForTransaction'
} & ResultOfAppDebotBrowserWaitForTransactionVariant) | ({
    type: 'QueryTransactionTree'
} & ResultOfAppDebotBrowserQueryTransactionTreeVariant) | ({
    type: 'GetSigningBoxInfo'
} & ResultOfAppDebotBrowserGetSigningBoxInfoVariant) | ({
    type: 'GetEncryptionBoxInfo'
} & ResultOfAppDebotBrowserGetEncryptionBoxInfoVariant)

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

export function resultOfAppDebotBrowserFetch(response: FetchResponse): ResultOfAppDebotBrowser {
    return {
        type: 'Fetch',
        response,
    };
}

export function resultOfAppDebotBrowserEncrypt(encrypted: string): ResultOfAppDebotBrowser {
    return {
        type: 'Encrypt',
        encrypted,
    };
}

export function resultOfAppDebotBrowserDecrypt(decrypted: string): ResultOfAppDebotBrowser {
    return {
        type: 'Decrypt',
        decrypted,
    };
}

export function resultOfAppDebotBrowserSign(signature: string): ResultOfAppDebotBrowser {
    return {
        type: 'Sign',
        signature,
    };
}

export function resultOfAppDebotBrowserSendMessage(shard_block_id: string, sending_endpoints: string[]): ResultOfAppDebotBrowser {
    return {
        type: 'SendMessage',
        shard_block_id,
        sending_endpoints,
    };
}

export function resultOfAppDebotBrowserQuery(result: ResultOfQuery): ResultOfAppDebotBrowser {
    return {
        type: 'Query',
        result,
    };
}

export function resultOfAppDebotBrowserQueryCollection(result: ResultOfQueryCollection): ResultOfAppDebotBrowser {
    return {
        type: 'QueryCollection',
        result,
    };
}

export function resultOfAppDebotBrowserWaitForCollection(result: ResultOfWaitForCollection): ResultOfAppDebotBrowser {
    return {
        type: 'WaitForCollection',
        result,
    };
}

export function resultOfAppDebotBrowserWaitForTransaction(result: ResultOfProcessMessage): ResultOfAppDebotBrowser {
    return {
        type: 'WaitForTransaction',
        result,
    };
}

export function resultOfAppDebotBrowserQueryTransactionTree(result: ResultOfQueryTransactionTree): ResultOfAppDebotBrowser {
    return {
        type: 'QueryTransactionTree',
        result,
    };
}

export function resultOfAppDebotBrowserGetSigningBoxInfo(pubkey: string): ResultOfAppDebotBrowser {
    return {
        type: 'GetSigningBoxInfo',
        pubkey,
    };
}

export function resultOfAppDebotBrowserGetEncryptionBoxInfo(result: EncryptionBoxInfo): ResultOfAppDebotBrowser {
    return {
        type: 'GetEncryptionBoxInfo',
        result,
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
 * Parameters to fetch DeBot metadata.
 */
export type ParamsOfFetch = {

    /**
     * Debot smart contract address.
     */
    address: string
}

export type ResultOfFetch = {

    /**
     * Debot metadata.
     */
    info: DebotInfo
}

/**
 * Parameters of `send` function.
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
    fetch(params: ParamsOfAppDebotBrowserFetchVariant): Promise<ResultOfAppDebotBrowserFetchVariant>,
    encrypt(params: ParamsOfAppDebotBrowserEncryptVariant): Promise<ResultOfAppDebotBrowserEncryptVariant>,
    decrypt(params: ParamsOfAppDebotBrowserDecryptVariant): Promise<ResultOfAppDebotBrowserDecryptVariant>,
    sign(params: ParamsOfAppDebotBrowserSignVariant): Promise<ResultOfAppDebotBrowserSignVariant>,
    send_message(params: ParamsOfAppDebotBrowserSendMessageVariant): Promise<ResultOfAppDebotBrowserSendMessageVariant>,
    query(params: ParamsOfAppDebotBrowserQueryVariant): Promise<ResultOfAppDebotBrowserQueryVariant>,
    query_collection(params: ParamsOfAppDebotBrowserQueryCollectionVariant): Promise<ResultOfAppDebotBrowserQueryCollectionVariant>,
    wait_for_collection(params: ParamsOfAppDebotBrowserWaitForCollectionVariant): Promise<ResultOfAppDebotBrowserWaitForCollectionVariant>,
    wait_for_transaction(params: ParamsOfAppDebotBrowserWaitForTransactionVariant): Promise<ResultOfAppDebotBrowserWaitForTransactionVariant>,
    query_transaction_tree(params: ParamsOfAppDebotBrowserQueryTransactionTreeVariant): Promise<ResultOfAppDebotBrowserQueryTransactionTreeVariant>,
    get_signing_box_info(params: ParamsOfAppDebotBrowserGetSigningBoxInfoVariant): Promise<ResultOfAppDebotBrowserGetSigningBoxInfoVariant>,
    get_encryption_box_info(params: ParamsOfAppDebotBrowserGetEncryptionBoxInfoVariant): Promise<ResultOfAppDebotBrowserGetEncryptionBoxInfoVariant>,
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
            case 'Fetch':
                result = await obj.fetch(params);
                break;
            case 'Encrypt':
                result = await obj.encrypt(params);
                break;
            case 'Decrypt':
                result = await obj.decrypt(params);
                break;
            case 'Sign':
                result = await obj.sign(params);
                break;
            case 'SendMessage':
                result = await obj.send_message(params);
                break;
            case 'Query':
                result = await obj.query(params);
                break;
            case 'QueryCollection':
                result = await obj.query_collection(params);
                break;
            case 'WaitForCollection':
                result = await obj.wait_for_collection(params);
                break;
            case 'WaitForTransaction':
                result = await obj.wait_for_transaction(params);
                break;
            case 'QueryTransactionTree':
                result = await obj.query_transaction_tree(params);
                break;
            case 'GetSigningBoxInfo':
                result = await obj.get_signing_box_info(params);
                break;
            case 'GetEncryptionBoxInfo':
                result = await obj.get_encryption_box_info(params);
                break;
        }
        client.resolve_app_request(app_request_id, { type: params.type, ...result });
    }
    catch (error) {
        client.reject_app_request(app_request_id, error);
    }
}
/**
 * [DEPRECATED](DEPRECATED.md) Module for working with debot.
 */
export class DebotModule {
    client: IClient;

    constructor(client: IClient) {
        this.client = client;
    }

    /**
     * Creates and instance of DeBot.
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
     * Creates and instance of DeBot.
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


