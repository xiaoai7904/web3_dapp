// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract SEAToken is ERC20, ERC20Detailed {
    constructor () public ERC20Detailed("SEA_TOKEN", "SEA", 18) {
        _mint(msg.sender, 270000000 * (10 ** uint256(decimals())));
    }

    function getSellerAddr() public view returns (address) {
        return _msgSender();
    }

}