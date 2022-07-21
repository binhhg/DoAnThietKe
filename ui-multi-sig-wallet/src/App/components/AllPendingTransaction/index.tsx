import React from "react";
import styles from "./AllPendingTransaction.module.css";
import TransactionList from "../../TransactionList";
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";
interface Props {}

const AllPendingTransaction: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    //state.transactions.filter(item => !item.executed && !item.cancel)
    return (
        (state.transactions.filter(item => !item.executed && !item.cancel)).length ?
                <div className={styles.title}>
                    <TransactionList
                        numConfirmationsRequired={state.numConfirmationsRequired}
                        data={state.transactions.filter(item => !item.executed && !item.cancel)}
                        count={state.transactionCount}
                    />
                </div>: <div style={{fontStyle: "italic", fontSize: 20, fontWeight:"bold", textAlign: "center", padding: 50}}>No transactions</div>

    );
};

export default AllPendingTransaction;
