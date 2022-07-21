import React, {useState} from "react";
import styles from "../../Header.module.css";
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";
import {Button, Form} from "semantic-ui-react";
import {useWeb3Context} from "../../../contexts/Web3";
import useAsync from "../../../components/useAsync";
import {addOwner} from "../../../api/multi-sig-wallet";
import Web3 from "web3";
interface Props {
}

interface OwnerParams {
    web3: Web3;
    account: string;
    address: string;
}

const Owner: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    const [visible, setVisible] = useState(false)
    const {
        state: {web3, account},
    } = useWeb3Context();

    const [input, setInput] = useState("");
    const {pending, call} = useAsync<OwnerParams, void>(
        ({web3, account, address}) => addOwner(web3, account, {address})
    );

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    async function onSubmit() {
        if (pending) {
            return;
        }
        setVisible(!visible)
        if (!web3) {
            alert("No web3");
            return;
        }

        const address = input;
        if(address) {
            const {error} = await call({
                web3,
                account,
                address,
            });
            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                setInput("");
            }
        }
    }

    return (
        <div>
            <div>
                <div>
                    {state.owners.map((owner, i) => (
                        <div key={i}>{i + 1}. {owner}</div>
                    ))}
                </div>
            </div>
            <div className="depositForm" style={{display: `${visible ? 'block' : 'none'}`}}>
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <Form.Input
                            placeholder="Address's owner"
                            value={input}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form>
            </div>
            <div style={{marginTop: 10, width: 250}}><Button className={styles.btnComfirm} disabled={pending}
                                                             color="blue" loading={pending} onClick={onSubmit}>
                Add owner
            </Button>
            </div>
        </div>
    );
};

export default Owner;
