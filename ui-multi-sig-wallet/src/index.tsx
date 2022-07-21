import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App";
import {
  Provider as Web3Provider,
  Updater as Web3Updater,
} from "./contexts/Web3";
import {
  Provider as MultiSigWalletProvider,
  Updater as MultiSigWalletUpdater,
} from "./contexts/MultiSigWallet";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <MultiSigWalletProvider>
        <App />
        <Web3Updater />
        <MultiSigWalletUpdater />
      </MultiSigWalletProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);


serviceWorker.unregister();
