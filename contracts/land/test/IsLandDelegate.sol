pragma solidity ^0.5.0;

import "./IsLandStorage.sol";
import "./IIsLandDelegate.sol";
import "./StorageStateful.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
* 逻辑合约
*/
contract IsLandDelegate is StorageStateful, Ownable, IIsLandDelegate{
	
	function payLand(uint256 mapId, uint8 genre, address owner) external {
		_storage.payLand(mapId, genre, owner);
	}

	function transferIsLand(uint256 mapId, address to) external {
		_storage.transferIsLand(mapId, to);
	}
}
