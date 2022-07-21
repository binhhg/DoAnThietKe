import React from "react";
import styles from "./AllTrasaction.module.css";
import TransactionList from "../../TransactionList";
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";

interface Props {
}

const AllTrasaction: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    return (
        (state.transactions).length ?
            <div className={styles.title}>
                <TransactionList
                    numConfirmationsRequired={state.numConfirmationsRequired}
                    data={state.transactions}
                    count={state.transactionCount}
                />
            </div> :
            <div style={{fontStyle: "italic", fontSize: 20, fontWeight: "bold", textAlign: "center", padding: 50}}>No
                transactions</div>
    );
};

export default AllTrasaction;
