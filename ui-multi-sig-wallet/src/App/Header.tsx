import React, {useState} from "react";
import styles from "./Header.module.css";
interface Props {
}

const Header: React.FC<Props> = () => {
    const [open, openModal] = useState(false);
    return (
        <div>
            <div className={styles.title}>
                <span>MultiSig Wallet</span>
            </div>
        </div>
    );
};

export default Header;
