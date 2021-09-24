pragma solidity ^0.5.0;

import '@openzeppelin/contracts/lifecycle/Pausable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IsLandERC721.sol';

contract IsLandCore is Pausable, IsLandERC721 {
    // 地图类型购买信息
    mapping(uint256 => Counters.Counter) public payedTotalCount;
    // 地图id和土地映射
    mapping(uint256 => IsLandStruct) public landNftMap;

    // 地图块信息
    struct IsLandStruct {
        uint256 genre;
        uint256 location;
        uint256 x;
        uint256 y;
        uint256 bornAt; //生成时间
    }

    // 定义721合约元数据
    constructor() public IsLandERC721('Nautical Chart', 'ISLAND') {}

    // 获取购买领地数量
    function isLandCount(uint256 location) external view returns (uint256 genreNum) {
        return payedTotalCount[location].current();
    }

    // 购买地图
    function payLand(
        uint256 mapId,
        uint256 genre,
        uint256 location,
        uint256 x,
        uint256 y,
        address owner
    ) external onlyCLevel noOwnerToken(mapId) {
        // 判断参数类型是否正确
        require(mapId == uint256(uint32(mapId)), 'mapId is error');

        if (owner == address(0)) {
            owner = cooAddress;
        }
        // 累加总计值
        payedTotalCount[genre].increment();
        // 存储数据到区块上
        IsLandStruct memory isLandStruct = IsLandStruct(genre, location, x, y, now);
        landNftMap[mapId] = isLandStruct;
        _mint(owner, mapId);
        _setTokenURI(mapId, _concatTokenURI('', genre));
        // 调用成功事件
        emit PayedSpawned(owner, mapId);
    }

    // 购买地图-批量
    function payLands(
        uint256[] calldata mapIds,
        uint256[] calldata genres,
        uint256[] calldata locations,
        uint256[] calldata xs,
        uint256[] calldata ys,
        address owner
    ) external onlyCLevel {
        if (owner == address(0)) {
            owner = cooAddress;
        }

        for (uint256 i = 0; i < mapIds.length; i++) {
            uint256 mapId = mapIds[i];
            require(!_exists(mapId), 'token already payed');
            // 累加总计值
            payedTotalCount[genres[i]].increment();

            // 存储数据到区块上
            IsLandStruct memory isLandStruct = IsLandStruct(genres[i], locations[i], xs[i], ys[i], now);
            landNftMap[mapId] = isLandStruct;
            _mint(owner, mapId);
            _setTokenURI(mapId, _concatTokenURI('', genres[i]));
        }
        // 调用成功事件
        emit PayedSpawned(owner, mapIds.length);
    }

    // 获取地图信息
    function getTokenId(uint256 mapId)
        external
        view
        returns (
            uint256 genre,
            uint256 location,
            uint256 x,
            uint256 y,
            uint256 bornAt,
            bytes memory tokenUri
        )
    {
        IsLandStruct memory isLandStruct = landNftMap[mapId];
        return (
            isLandStruct.genre,
            isLandStruct.location,
            isLandStruct.x,
            isLandStruct.y,
            isLandStruct.bornAt,
            bytes(this.tokenURI(mapId))
        );
    }

    // 获取已经购买地图信息
    function getTokenIds(address account) external view onlyCLevel returns (uint256[] memory) {
        uint256[] memory tokenIds = _tokensOfOwner(account);
        return tokenIds;
    }

    // 获取地图信息
    function list(address account)
        external
        view
        onlyCLevel
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint256[] memory tokenIds = _tokensOfOwner(account);

        uint256[] memory genres = new uint256[](tokenIds.length);
        uint256[] memory locations = new uint256[](tokenIds.length);
        uint256[] memory xs = new uint256[](tokenIds.length);
        uint256[] memory ys = new uint256[](tokenIds.length);
        uint256[] memory bornAts = new uint256[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            IsLandStruct memory isLandStruct = landNftMap[tokenIds[i]];
            genres[i] = isLandStruct.genre;
            locations[i] = isLandStruct.location;
            xs[i] = isLandStruct.x;
            ys[i] = isLandStruct.y;
            bornAts[i] = isLandStruct.bornAt;
        }

        return (tokenIds, genres, locations, xs, ys, bornAts);
    }

    //    // 调用erc20的交易信息
    //    function transferERC20(address erc20Address, address recipient, uint256 amount) external returns (bool) {
    //        IERC20 erc20 = IERC20(erc20Address);
    //        return erc20.transferFrom(msg.sender, recipient, amount);
    //    }
    //
    //    // 调用erc20的交易信息
    //    function balanceOfERC20(address erc20Address, address account) external view returns (uint256) {
    //        IERC20 erc20 = IERC20(erc20Address);
    //        return erc20.balanceOf(account);
    //    }
}
