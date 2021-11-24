pragma solidity ^0.5.16;

import './DaiToken.sol';
import './DappToken.sol';

contract TokenFarm{
    string public name ="Dapp public token";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken ) public{
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    } 
 
    //1. Stack Tokens
    function stakeTokens(uint _amount) public {
        require(_amount>0 , "amount cannot be 0");
        //Transfer dai token to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //add users to stakers array *only* if they haven't staked already

        if(!hasStaked[msg.sender]){
             stakers.push(msg.sender);
        }
        isStaking[msg.sender]= true;
        hasStaked[msg.sender] = true;
       
    }
    //2.issuing tokens
    function issueTokens() public {

    require(msg.sender == owner, "caller of isseTokens must be the owner");

        for(uint i=0; i< stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
            
        }
    }
    //3.Unstake Tokens
    function unStakeTokens() public {

        //get staking balance and validate for >0
        uint balance = stakingBalance[msg.sender];
        require(balance>0,"staking balance can not be zero");

        //if valid transfer from smart contract to sender
        daiToken.transfer(msg.sender,balance);

        //Reset the staking balance
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;

        //get back dapp token
        // dappToken.transferFrom(msg.sender, address(this), balance);

    }
   

}