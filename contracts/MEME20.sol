// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MEME20 is ERC20("MEME ERC20", "MEME20") {
    constructor() {
        _mint(msg.sender, 100_000_000_000 ether);
    }

    function multiTransfer(address [] memory receivers, uint256 [] memory amounts) public {
        for(uint256 i=0; i<receivers.length; i++) {
            transfer(receivers[i], amounts[i]);
        }
    }
}
