const token = artifacts.require("token");

module.exports = function (deployer, accounts) {
    deployer.deploy(token, {from: "0x18b97f7f7deBE3C77252B152a718239858bD2c46"})
};
