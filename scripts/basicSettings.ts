import { ethers } from "hardhat";

async function main() {
  const ERC20 = await ethers.getContractAt("MEME20","0xFcDDb389a43FB110FA348061e189C0E7a62C2F2d");
  const ERC721 = await ethers.getContractAt("WOWFRIENDS","0x38396F4452bA8b1D942d73154B8e75E7d294F52a");
  const Governor = await ethers.getContractAt("MEMGOVERNOR","0x38396F4452bA8b1D942d73154B8e75E7d294F52a");
  await ERC721.mint("0x4C2F0D308c17C401172b4bf706a10E32EE6326cC");
  await ERC721.mint("0x4C2F0D308c17C401172b4bf706a10E32EE6326cC");
  await ERC721.mint("0x4C2F0D308c17C401172b4bf706a10E32EE6326cC");
  await ERC721.mint("0x4C2F0D308c17C401172b4bf706a10E32EE6326cC");

  transferCalldata = erc20Token1.interface.encodeFunctionData("multiTransfer", [[voter1.address, voter2.address, voter3.address, voter4.address], [changeToBigInt(1),changeToBigInt(1),changeToBigInt(1),changeToBigInt(1)]]);

  await ERC20.approve("0x38396F4452bA8b1D942d73154B8e75E7d294F52a", 10**18*10000);
  await Governor.
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
