const Web3 = require("web3");


const TokenFarm = artifacts.require('TokenFarm');
const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();

    await deployer.deploy(DappToken);
    const dappToken = await DappToken.deployed();

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    await dappToken.transfer(tokenFarm.address, Web3.utils.toBN("1000000000000000000000000"));

    await daiToken.transfer(accounts[1], Web3.utils.toBN("100000000000000000000"));

};
