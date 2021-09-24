pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InterfaceCall {
    function callDeposit(address _contract)
    public
    returns(uint256)
    {
        IERC20 ci = IERC20(_contract);
        uint256 retValue = ci.totalSupply();
        return retValue;
    }
}
