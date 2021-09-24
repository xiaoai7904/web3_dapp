pragma solidity ^0.5.0;

import "@openzeppelin/contracts/drafts/Counters.sol";
/**
* 数据合约
*/
contract IsLandStorage  {

	using Counters for Counters.Counter;

	address public proxy;
	
	// 地图类型购买信息
    mapping(uint256 => Counters.Counter) public payedTotalCount;
    // 地图id和土地映射
    mapping(uint256 => IsLandStruct) public landNftMap;

    //小型岛
    uint8 constant public GENRE_SMALL = 1;
    //中型岛
    uint8 constant public GENRE_MEDIUM = 2;
    //小型岛
    uint8 constant public GENRE_LARGE = 3;
    //未知岛屿
    uint8 constant public GENRE_SECRET = 9;

    // 地图块信息
    struct IsLandStruct {
        uint256 genre;
        uint256 bornAt;     //生成时间
        address owner;     //拥有者
    }
	
 	constructor(address _proxy) public {
        require(_proxy != address(0), "zero address is not allowed");
        proxy = _proxy;
    }

	// 验证对model的操作是否来源于Proxy, 写成func, 节省gas消耗
 	function _isAuthorized() view internal {
        require(msg.sender == proxy, "AccountStorage: must be proxy");
    }

     // 购买地图
    function payLand(uint256 mapId, uint8 genre, address owner) external {
		_isAuthorized();
        // 校验地址是否为空
        require (owner == address(0));
        // 判断参数类型是否正确
        require(mapId == uint256(uint32(mapId)));
        require(genre == GENRE_SMALL || genre == GENRE_MEDIUM || genre == GENRE_LARGE);
        // 累加总计值
        payedTotalCount[genre].increment();
        // 存储数据到区块上
        IsLandStruct memory isLandStruct = IsLandStruct(genre, now, owner);
        landNftMap[mapId] = isLandStruct;
    }

    // 转让地图
    function transferIsLand(uint256 mapId, address to) external {
		_isAuthorized();
        require(to != address(0));
        // 判断参数类型是否正确
        require(mapId == uint256(uint32(mapId)));
        // 存储数据到区块上
        IsLandStruct memory isLandStruct = landNftMap[mapId];
        delete landNftMap[mapId];
        IsLandStruct memory newIsLandStruct = IsLandStruct(isLandStruct.genre, isLandStruct.bornAt, to);
        landNftMap[mapId] = newIsLandStruct;
    }
}