const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = function (deployer, network, accounts) {
    const owners = accounts.slice(0, 3)
    const numComfirmationsRequired = 2
    deployer.deploy(MultiSigWallet, owners, numComfirmationsRequired, { from: "0x9cbfcd672e8a2d63a9b1ee744d78bbf2df5887e0"});

};
