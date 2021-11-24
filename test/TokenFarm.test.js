
const { assert } = require("chai");
const Web3 = require("web3");

require('chai')
  .use(require('chai-as-promised'))
  .should()


const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');


function tokens(n){
    return Web3.utils.toWei(n, 'ether');
}



contract('TokenFarm',([owner, investor])=>{

    let daiToken, dappToken, tokenFarm ;
    before(async () =>{
        // web3 = new Web3("ws://127.0.0.1:7545");
         daiToken = await DaiToken.new();
         dappToken = await DappToken.new();
         tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        await dappToken.transfer(tokenFarm.address, tokens('1000000'));
        await daiToken.transfer(investor, tokens('100'), {from:owner});

    });

    // write test here
    describe('Mock dai delpoyment',async()=>{
        it('dai delpoyment have a name', async()=>{
            
            let name = await daiToken.name();
            assert.equal(name, "Mock DAI Token");
        })
    });

    describe('Mock Dapp delpoyment',async()=>{
        it('Dapp delpoyment have a name', async()=>{
            
            let name = await dappToken.name();
            assert.equal(name, "DApp Token");
        })
    });

    describe('Mock Token farm delpoyment',async()=>{
        it('Token farm delpoyment a name', async()=>{
            
            let name = await tokenFarm.name();
            assert.equal(name, "Dapp public token");
        })
    });

    describe('Mock dapptoken balance from tokenFarm address', async()=>{
        it('verify tokenFarm has all dapptoken supply', async()=>{
            let balanceOfDappTokenFromTokenFarm = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balanceOfDappTokenFromTokenFarm, tokens('1000000'));
        })
    });

    describe('Investor receives 100 dai token', async()=>{
        it('investor has 100 dai token balance', async()=>{
            let balanceOfInvestor = await daiToken.balanceOf(investor);
            assert.equal(balanceOfInvestor, tokens('100'));
        })
    });

    describe('owners balance dai token check', async()=>{
        it('100 dai token reduced from owners balance', async()=>{
            let balanceOfOwnerDaiToken = await daiToken.balanceOf(owner);
            assert.equal(balanceOfOwnerDaiToken, tokens('999900'));
        })
    });

    describe('farming tokens', async()=>{
        it('rewards for staking dai tokens ', async()=>{
            let balanceOfInvestorDaiToken = await daiToken.balanceOf(investor);
            assert.equal(balanceOfInvestorDaiToken, tokens('100'), 'investor mock dai token balance is correct before staking');

            await daiToken.approve(tokenFarm.address, tokens('100'), {from:investor});
            await tokenFarm.stakeTokens(tokens('100'), {from:investor});

            let balanceOfDaiTokenAfterStaking = await daiToken.balanceOf(investor);
            assert.equal(balanceOfDaiTokenAfterStaking, tokens('0'), 'investor mock dai token balance is correct after staking');

            let stakedBalanceFromTokenAddress = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(stakedBalanceFromTokenAddress, tokens('100'), 'stakedbalance is correct');

            let isStaking = await tokenFarm.isStaking(investor);
            assert.equal(isStaking,true, 'isstaking state is correct');

            await tokenFarm.issueTokens({from:owner});

            //check balance after issuances
            let balanceOfOwnerAfterIssuance = await dappToken.balanceOf(investor);
            assert.equal(balanceOfOwnerAfterIssuance, tokens('100'), 'issued token balance is correct');

            //check balance of tokenfarm address
            let balanceOfTokeFarmAfterIssuance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balanceOfTokeFarmAfterIssuance, tokens('999900'), 'remaining balance from dapp token');

            await tokenFarm.issueTokens({from:investor}).should.be.rejected;

            //await  dappToken.approve( tokenFarm.address, tokens('100'), {from:investor});
            await tokenFarm.unStakeTokens({from:investor});
            
            let balanceOfInvestorDaiTokenAfterunstaking = await daiToken.balanceOf(investor);
            assert.equal(balanceOfInvestorDaiTokenAfterunstaking, tokens('100'), 'investor mock dai token balance is correct after unstaking');

            let BalanceOfDaiTokenFromTokenAddress = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(BalanceOfDaiTokenFromTokenAddress, tokens('0'), 'unstakedbalance is correct');

            let stakingBalanceOfInvestor = await tokenFarm.stakingBalance(investor);
            assert.equal(stakingBalanceOfInvestor, tokens('0'), 'stacking balance is correct');

            let isStakingAfterUnstaking = await tokenFarm.isStaking(investor)
            assert.equal(isStakingAfterUnstaking, false, 'is staking is false after unstaking');

            // let balanceOfInvestorDappTokenAfterunstaking = await dappToken.balanceOf(investor);
            // assert.equal(balanceOfInvestorDappTokenAfterunstaking, tokens('0'), 'investor dapptoken balance is correct after unstaking');

            // let balanceOfTokenFarmDappTokenAfterunstaking = await dappToken.balanceOf(tokenFarm.address);
            // assert.equal(balanceOfTokenFarmDappTokenAfterunstaking, tokens('1000000'), 'investor dapptoken balance is correct after unstaking');
 
        })
    });
})