import React, {useState} from "react";
import {useMultiSigWalletContext} from "../contexts/MultiSigWallet";
 import { Form, Button } from "semantic-ui-react";
import DepositForm from "./DepositForm";
import CreateTxModal from "./CreateTxModal";
import TabsView from "./TabsView";
import styles from "./Header.module.css";
import {useWeb3Context} from "../contexts/Web3";
import useAsync from "../components/useAsync";
import {addNumConfirmationsRequired, createToken} from "../api/multi-sig-wallet";
import { Divider } from 'antd';
import Owner from "./components/Owner";
import Token from "./components/Token";
interface AddNumConfirmationsRequired {
    num: string;
}

function MultiSigWallet() {
    const [visible, setVisible] = useState(false)
    const {state} = useMultiSigWalletContext();
    const {
        state: { web3, account },
    } = useWeb3Context();

    const { pending, error, call } = useAsync<AddNumConfirmationsRequired, any>(
        async (params) => {
            if (!web3) {
                throw new Error("No web3");
            }

            await addNumConfirmationsRequired(web3, account, params);
        }
    );
    const [open, openModal] = useState(false);
    const [inputs, setInputs] = useState({
       num: ""
    });
    function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [name]: e.target.value,
        });
    }
    async function onSubmit() {
        if (pending) {
            return;
        }
        setVisible(!visible)
        if(inputs.num) {
            await call({
                ...inputs,
                num: inputs.num.toString(),
            });
        }
    }
    return (
        <div>
            <Divider plain />
           <div>
               <div className={styles.titleHeader}>Address owner list of contract</div>
               <Owner/>
           </div>
            <Divider plain />
           <div>
               <div className={styles.titleHeader}>Token list of contract</div>
               <Token/>
           </div>
            <Divider plain />
            <div>
                <div className={styles.titleHeader}>Execute Transaction</div>
                <div className={styles.transactionTitle}>Number of required accept: {state.numConfirmationsRequired}</div>
                <div className={styles.btnWapper}>
                    <Button className={styles.btn} color="blue" onClick={() => openModal(true)}>Create Transaction</Button>
                    {open && <CreateTxModal open={open} onClose={() => openModal(false)}/>}
                    <div style={{marginTop: 10}}>  <Button
                        className={styles.btnComfirm}
                        color="blue"
                        onClick={onSubmit}
                        disabled={pending}
                        loading={pending}
                    >Set number of required accept</Button></div>
                    <div style={{
                        display: `${visible? 'block': 'none'}`
                    }}>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input
                                    type="text"
                                    value={inputs.num}
                                    onChange={(e) => onChange("num", e)}
                                />
                            </Form.Field>
                        </Form>
                    </div>
                </div>
            </div>
            <Divider plain/>
           <div>
               <div className={styles.titleHeader}>Balance information</div>
               <div className={styles.transactionTitle}>Balance: {state.balance} wei</div>
               <div>Deposit into contract</div>
               <DepositForm/>
           </div>
            <Divider plain />
            <div className={styles.titleHeader}>Transaction information</div>
            <TabsView/>
        </div>
    );
}

export default MultiSigWallet;
