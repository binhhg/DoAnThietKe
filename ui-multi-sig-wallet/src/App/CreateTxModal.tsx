import React, {useState} from "react";
import {Button, Modal, Form, Message} from "semantic-ui-react";
import useAsync from "../components/useAsync";
import {useWeb3Context} from "../contexts/Web3";
import {submitTx} from "../api/multi-sig-wallet";
import styles from "./ModalHeader.module.css";
import {Drawer} from 'antd';
import {useMultiSigWalletContext} from "../contexts/MultiSigWallet";

interface Props {
    open: boolean;
    onClose: (event?: any) => void;
}

interface SubmitTxParams {
    to: string;
    value: string;
    data: string;
    addressToken: string
}

const CreateTxModal: React.FC<Props> = ({open, onClose}) => {
    const [visible, setVisible] = useState(false);
    const {state} = useMultiSigWalletContext();
    const showDrawer = () => {
        setVisible(true);
    };

    const onCloseModal = () => {
        setVisible(false);
    };
    const {
        state: {web3, account},
    } = useWeb3Context();

    const {pending, error, call} = useAsync<SubmitTxParams, any>(
        async (params) => {
            if (!web3) {
                throw new Error("No web3");
            }

            await submitTx(web3, account, params);
        }
    );

    const [inputs, setInputs] = useState({
        to: "",
        value: 0,
        data: "",
        addressToken: ""
    });

    function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [name]: e.target.value,
        });
    }

    async function onSubmit() {
      if(!visible) {
          if (pending) {
              return;
          }

          const {error} = await call({
              ...inputs,
              value: inputs.value.toString(),
          });

          if (!error) {
              onClose();
          }
      }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header className={styles.modalHeader}>Create Transaction</Modal.Header>
            <Modal.Content>
                {error && <Message error>{error.message}</Message>}
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <label>To</label>
                        <Form.Input
                            type="text"
                            value={inputs.to}
                            onChange={(e) => onChange("to", e)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Form.Input
                            type="number"
                            min={0}
                            value={inputs.value}
                            onChange={(e) => onChange("value", e)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Data</label>
                        <Form.Input
                            value={inputs.data}
                            onChange={(e) => onChange("data", e)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Token address</label>
                        <Form.Input
                            type="text"
                            value={inputs.addressToken}
                            onChange={(e) => onChange("addressToken", e)}
                        />
                    </Form.Field>
                    <div className="site-drawer-render-in-current-wrapper">
                        <div
                            style={{
                                marginTop: 16,
                                display: "flex",
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button type="primary" onClick={showDrawer}>
                                Show all token
                            </Button>
                        </div>
                        <Drawer
                            title="All my token"
                            placement="right"
                            closable={false}
                            onClose={onCloseModal}
                            visible={visible}
                            getContainer={false}
                            style={{
                                position: 'absolute',
                                display: `${visible ? 'block' : 'none'}`
                            }}
                        >
                            {
                                state.tokens.length ? (
                                    state.tokens.map((item, index) =>
                                       <div key={index}>
                                           <span style={{fontWeight: 'bold', fontStyle: 'italic'}}>{index + 1}. Token: {item.name}</span>
                                           <ul>
                                               <li>Name: {item.name}</li>
                                               <li>Address: {item.addressToken}</li>
                                               <li>Symbol: {item.symbol}</li>
                                               <li>Total supply: {item.value.toString()}</li>
                                           </ul>
                                       </div>
                                    )
                                ) : null
                            }
                        </Drawer>
                    </div>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose} disabled={pending}>
                    Cancel
                </Button>
                <Button
                    color="blue"
                    onClick={onSubmit}
                    disabled={pending}
                    loading={pending}
                >
                    Create
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTxModal;
