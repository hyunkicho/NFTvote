import { ethers } from "hardhat";

async function main() {
  console.log('deploying WowFriends contract');
  const ERC721vote = await ethers.getContractFactory("MyERC721Vote");
  const exampleERC721 = await ERC721vote.deploy();
  await exampleERC721.deployed();

  console.log(`erc721vote contract is deployed to ${exampleERC721.address}`);

  const tokenURI = await exampleERC721.tokenURI();
  console.log("tokenURI : ", tokenURI);

  console.log('deploying governance contract')
  const Governor = await ethers.getContractFactory("MyGovernor");
  const governor = await Governor.deploy(exampleERC721.address);
  await governor.deployed();
  console.log(`governor contract is deployed to ${exampleERC721.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
