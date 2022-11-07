// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VoteERC20 is ERC20 {

    mapping(address => bool) initial_coin;
    mapping(address => uint32) public proposal_num;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }

    function InitialCoin() external {
        require(initial_coin[msg.sender] == false, "This account has got initial vite coins already");
        _mint(msg.sender, 100);
        initial_coin[msg.sender] = true;
        proposal_num[msg.sender]=0;
    }

    function AddProposalNum(address account) external{
        proposal_num[account]++;
    }

    function GetPro_num(address account) external view returns(uint256){
        return proposal_num[account];
    }

    function Reword(address account) external{
        _mint(account, 50);
    }
}