pragma solidity ^0.5.0;

/**
* 接口合约
*/
interface IIsLandDelegate {
	function payLand(uint256 mapId, uint8 genre, address owner) external;
	function transferIsLand(uint256 mapId, address to) external;
}
