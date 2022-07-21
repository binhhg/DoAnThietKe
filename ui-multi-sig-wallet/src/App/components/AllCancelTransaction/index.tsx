import React from "react";
import styles from "./AllCancelTransaction.module.css";
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";
import TransactionList from "../../TransactionList";

interface Props {
}

const AllCancelTransaction: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    return (
        (state.transactions.filter(item => item.cancel)).length ?
            <div className={styles.title}>
                <TransactionList
                    numConfirmationsRequired={state.numConfirmationsRequired}
                    data={state.transactions.filter(item => item.cancel)}
                    count={state.transactionCount}
                />
            </div> :
        <div style={{fontStyle: "italic", fontSize: 20, fontWeight:"bold", textAlign: "center", padding: 50}}>No transactions</div>

    );
};

export default AllCancelTransaction;
