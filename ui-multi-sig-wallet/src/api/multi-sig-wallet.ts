import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import multiSigWalletTruffle from "../build/contracts/MultiSigWallet.json";

// @ts-ignore
const MultiSigWallet = TruffleContract(multiSigWalletTruffle);

interface Transaction {
    txIndex: number;
    to: string;
    value: BN;
    data: string;
    addressToken: string;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
    cancel: boolean;
    by: string;
}

interface Token {
    addressToken: string,
    name: string,
    symbol: string,
    value: string
}

interface GetResponse {
    address: string;
    balance: string;
    owners: string[];
    numConfirmationsRequired: number;
    transactionCount: number;
    transactions: Transaction[];
    tokens: Token[]
}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
    MultiSigWallet.setProvider(web3.currentProvider);

    const multiSig = await MultiSigWallet.deployed();

    const balance = await web3.eth.getBalance(multiSig.address);
    const owners = await multiSig.getOwners();
    const numConfirmationsRequired = await multiSig.numConfirmationsRequired();
    const transactionCount = await multiSig.getTransactionCount();
    const tokenCount = await multiSig.getTokenCount();
    const count = transactionCount.toNumber();
    const transactions: Transaction[] = [];
    const tokens: Token[] = [];
    for (let i = 0; i < tokenCount; i++) {
        const txIndex = i;

        const tx = await multiSig.getToken(txIndex);
        tokens.push({
            addressToken: tx.addressToken,
            name: tx.name,
            symbol: tx.symbol,
            value: tx.value
        });
    }

    for (let i = 0; i < transactionCount; i++) {
        const txIndex = i;

        const tx = await multiSig.getTransaction(txIndex);
        const isConfirmed = await multiSig.isConfirmed(txIndex, account);
        transactions.push({
            txIndex,
            to: tx.to,
            value: tx.value,
            data: tx.data,
            addressToken: tx.addressToken,
            executed: tx.executed,
            numConfirmations: tx.numConfirmations.toNumber(),
            isConfirmedByCurrentAccount: isConfirmed,
            cancel: tx.cancel,
            by: tx.by
        });
    }

    return {
        address: multiSig.address,
        balance,
        owners,
        numConfirmationsRequired: numConfirmationsRequired.toNumber(),
        transactionCount: count,
        transactions,
        tokens
    };
}

export async function deposit(
    web3: Web3,
    account: string,
    params: {
        value: BN;
    }
) {
    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.sendTransaction({from: account, value: params.value});
}

export async function addOwner(
    web3: Web3,
    account: string,
    params: {
        address: string;
    }
) {
    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.createOwner(params.address, {from: account});
}

export async function createToken(
    web3: Web3,
    account: string,
    params: {
        name: string;
        symbol: string;
        value: string;
    }
) {
    const {name, symbol, value} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.createToken(name, symbol, value, {
        from: account,
    });
}

export async function addNumConfirmationsRequired(
    web3: Web3,
    account: string,
    params: {
        num: string;
    }
) {
    const {num} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.addNumConfirmationsRequired(num, {
        from: account,
    });
}

export async function submitTx(
    web3: Web3,
    account: string,
    params: {
        to: string;
        value: string;
        data: string;
        addressToken: string
    }
) {
    const {to, value, data, addressToken} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.submitTransaction(to, value, data, addressToken, {
        from: account,
    });
}

export async function confirmTx(
    web3: Web3,
    account: string,
    params: {
        txIndex: number;
    }
) {
    const {txIndex} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.confirmTransaction(txIndex, {
        from: account,
    });
}

export async function revokeConfirmation(
    web3: Web3,
    account: string,
    params: {
        txIndex: number;
    }
) {
    const {txIndex} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.revokeConfirmation(txIndex, {
        from: account,
    });
}

export async function executeTx(
    web3: Web3,
    account: string,
    params: {
        txIndex: number;
    }
) {
    const {txIndex} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.executeTransaction(txIndex, {
        from: account,
    });
}

export async function cancelTx(
    web3: Web3,
    account: string,
    params: {
        txIndex: number;
    }
) {
    const {txIndex} = params;

    MultiSigWallet.setProvider(web3.currentProvider);
    const multiSig = await MultiSigWallet.deployed();

    await multiSig.cancelTransaction(txIndex, {
        from: account,
    });
}

export function subscribe(
    web3: Web3,
    address: string,
    callback: (error: Error | null, log: Log | null) => void
) {
    const multiSig = new web3.eth.Contract(MultiSigWallet.abi, address);

    const res = multiSig.events.allEvents((error: Error, log: Log) => {
        if (error) {
            callback(error, null);
        } else if (log) {
            callback(null, log);
        }
    });

    return () => res.unsubscribe();
}

interface Deposit {
    event: "Deposit";
    returnValues: {
        sender: string;
        amount: string;
        balance: string;
    };
}

interface CreateToken {
    event: "CreateToken";
    returnValues: {
        addressToken: string,
        name: string,
        symbol: string,
        value: string
    };
}

interface CreateOwner {
    event: "CreateOwner";
    returnValues: {
        ownerAddress: string
    };
}

interface SubmitTransaction {
    event: "SubmitTransaction";
    returnValues: {
        owner: string;
        txIndex: string;
        to: string;
        value: string;
        data: string;
        addressToken: string;
        by: string;
    };
}

interface ConfirmTransaction {
    event: "ConfirmTransaction";
    returnValues: {
        owner: string;
        txIndex: string;
    };
}

interface RevokeConfirmation {
    event: "RevokeConfirmation";
    returnValues: {
        owner: string;
        txIndex: string;
    };
}

interface ExecuteTransaction {
    event: "ExecuteTransaction";
    returnValues: {
        owner: string;
        txIndex: string;
    };
}

interface CancelTransaction {
    event: "CancelTransaction";
    returnValues: {
        owner: string;
        txIndex: string;
    };
}
interface SetNumConfirmation {
    event: "SetNumConfirmation";
    returnValues: {
        num: string;
    };
}

type Log =
    | Deposit
    | SubmitTransaction
    | ConfirmTransaction
    | RevokeConfirmation
    | ExecuteTransaction
    | CancelTransaction
    | CreateToken
    | CreateOwner
    | SetNumConfirmation;

