import React, {useState, useEffect} from "react";
import styles from "../../Header.module.css"
import {useMultiSigWalletContext} from "../../../contexts/MultiSigWallet";
import {Button} from "semantic-ui-react";
import CreateTokenModal from "../../Element/CreateTokenModal";

interface Props {
}

const Token: React.FC<Props> = () => {
    const {state} = useMultiSigWalletContext();
    const [open, openModal] = useState(false);
    return (
        <div className={styles.token}>
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
           <div style={{width: 250}}>
               <Button className={styles.btnComfirm} color="blue" onClick={() => openModal(true)}>Create
                   Token</Button>
               {open && <CreateTokenModal open={open} onClose={() => openModal(false)}/>}
           </div>
        </div>
    );
};

export default Token;
