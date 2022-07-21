import React from "react";
import styles from "./AllExcutedTransaction.module.css";
import TransactionList from "../../TransactionList";
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";
interface Props {}

const AllExcutedTransaction: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    return (
        (state.transactions.filter(item => item.executed)).length?
        <div className={styles.title}>
            <TransactionList
                numConfirmationsRequired={state.numConfirmationsRequired}
                data={state.transactions.filter(item => item.executed)}
                count={state.transactionCount}
            />
        </div> :
    <div style={{fontStyle: "italic", fontSize: 20, fontWeight:"bold", textAlign: "center", padding: 50}}>No transactions</div>
    );
};

export default AllExcutedTransaction;
