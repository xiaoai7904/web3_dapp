pragma solidity ^0.5.0;

contract AccessControl {

    address public ceoAddress;
    address payable public cfoAddress;
    address public cooAddress;

    constructor() internal {
        ceoAddress = msg.sender;
    }

    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    modifier onlyCFO() {
        require(msg.sender == cfoAddress);
        _;
    }

    modifier onlyCOO() {
        require(msg.sender == cooAddress);
        _;
    }

    modifier onlyCLevel() {
        require(
        // solium-disable operator-whitespace
            msg.sender == ceoAddress ||
            msg.sender == cfoAddress ||
            msg.sender == cooAddress
        // solium-enable operator-whitespace
        );
        _;
    }

    function setCEO(address _newCEO) external onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
    }

    function setCFO(address payable _newCFO) external onlyCEO {
        cfoAddress = _newCFO;
    }

    function setCOO(address _newCOO) external onlyCEO {
        cooAddress = _newCOO;
    }

    function withdrawBalance() external onlyCFO {
        cfoAddress.transfer(address(this).balance);
    }
}

