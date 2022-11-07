import { ethers } from "hardhat";

async function main() {
  const VoteCoin = await ethers.getContractFactory("VoteCoin");
  const voteCoin = await VoteCoin.deploy();
  await voteCoin.deployed();
  console.log(`"VoteCoin": "${voteCoin.address}",`);//VoteCoin contract has been deployed successfully in 
  
  const erc20 = await voteCoin.voteERC20();
  console.log(`"VoteERC20": "${erc20}"`);//VoteERC20 contract has been deployed successfully in 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
