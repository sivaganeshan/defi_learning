# defi_learning

#### How to run 
1. Checkout the code and run `npm install`
2. install truffle globally `npm i -g truffle`
3. Install ganache (local blockchain development environment)
4. Install metamask extension from your desired browser
5. Run ganache and configure your network provider details in truffe-config.js
6. Refer smartcontracts from the folder path `src/contracts` and Execute `truffle test` to make sure all the test cases are passing
7. Execute `truffle migrate` (this will deploy the smart contracts into ganache ,refer truffel.config.js and migrations/2_deploy_contracts.js) 
   and for repeated smarcontract depolyment execute `truffle migrate --reset`
1. In metamask, configure local network provider details as ganache.(url:'https://127.0.0.1:7545 and chainid:1337)
1. run `npm run start`, application will be running in localhost:3000

#### Basic details
1. Created a two new ERC20 token as `Dai` and `Dapp`, Where investors will stake `dai token` to get rewards in `Dapp token`.
1. Refer smart contracts `Daitoken.sol, DappToken.sol` from `src/contracts` for Erc20 implementation.
1. Refer `TokenFarm.sol` smartcontract for staking and unstaking process.
1. Issuing rewards are manual. you have to run the scripts from `scripts/issue_token.js` , command will be `truffle exec scropts/issue_token.js`
1. For front end react project, refer App.js -> corresponding components.


#### Demo video
https://drive.google.com/file/d/1ocBk8hU2hJhChK_FmBK1rBQM2AOS6vT3/view?usp=sharing
