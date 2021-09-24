pragma solidity ^0.5.0;

import '@openzeppelin/contracts/lifecycle/Pausable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IsLandERC721.sol';

contract ShipCore is Pausable, IsLandERC721 {
    // 舰队类型购买信息
    mapping(uint256 => Counters.Counter) public payedTotalCount;
    // 舰队集合
    ShipStruct[] ships;

    // 地图块信息
    struct ShipStruct {
        uint256 genre;
        uint256 color; // 颜色
        uint256 power; // 攻击力
        uint256 blood; // 血量
        uint256 bornAt; //生成时间
    }

    constructor() public IsLandERC721('Nautical Ship', 'SHIP') {}

    // 获取已经购买船只信息
    function getTokenIds(address account) external view onlyCLevel returns (uint256[] memory) {
        uint256[] memory tokenIds = _tokensOfOwner(account);
        return tokenIds;
    }

    // 获取船只信息
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
        uint256[] memory colors = new uint256[](tokenIds.length);
        uint256[] memory powers = new uint256[](tokenIds.length);
        uint256[] memory bloods = new uint256[](tokenIds.length);
        uint256[] memory bornAts = new uint256[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ShipStruct memory shipStruct = ships[tokenIds[i]];
            genres[i] = shipStruct.genre;
            colors[i] = shipStruct.color;
            powers[i] = shipStruct.power;
            bloods[i] = shipStruct.blood;
            bornAts[i] = shipStruct.bornAt;
        }
        return (tokenIds, genres, colors, powers, bloods, bornAts);
    }

    // 购买船只盲盒
    function payShip(uint256 genre, address owner, int256 reveal) external onlyCLevel returns (uint256 shipId) {
        if (owner == address(0)) {
            owner = cooAddress;
        }
        // 随机颜色
        uint256 color;
        uint256 power;
        uint256 blood;
        // 随机攻击力
        (color, power, blood) = _shipColumn(genre, reveal);

        // 累加总计值
        payedTotalCount[genre].increment();
        // 存储数据到区块上
        ShipStruct memory shipStruct = ShipStruct(genre, color, power, blood, now);
        shipId = ships.push(shipStruct) - 1;
        _mint(owner, shipId);
        _setTokenURI(shipId, _concatTokenURI('', genre));
        // 调用成功事件
        emit PayedSpawned(owner, shipId);

        return shipId;
    }

    // 购买船只盲盒-批量
    function payShips(uint256[] calldata genres, address owner, int256 reveal) external onlyCLevel {
        if (owner == address(0)) {
            owner = cooAddress;
        }
        // 随机颜色
        uint256 color;
        uint256 power;
        uint256 blood;
        for (uint256 i = 0; i < genres.length; i++) {
            // 随机攻击力
            (color, power, blood) = _shipColumn(genres[i], reveal);

            // 累加总计值
            payedTotalCount[genres[i]].increment();
            // 存储数据到区块上
            ShipStruct memory shipStruct = ShipStruct(genres[i], color, power, blood, now);
            uint256 shipId = ships.push(shipStruct) - 1;
            _mint(owner, shipId);
            _setTokenURI(shipId, _concatTokenURI('', genres[i]));
        }

        // 调用成功事件
        emit PayedSpawned(owner, genres.length);
    }

    function _shipColumn(uint256 _genre, int256 reveal)
        private
        view
        returns (
            uint256 _color,
            uint256 _power,
            uint256 _blood
        )
    {
        if (_genre == 1) {
            _power = 10 + _randomNumber(21, reveal);
            _blood = 100 + _randomNumber(51, reveal);
        } else if (_genre == 2) {
            _power = 50 + _randomNumber(31, reveal);
            _blood = 200 + _randomNumber(201, reveal);
        } else if (_genre == 3) {
            _power = 120 + _randomNumber(181, reveal);
            _blood = 800 + _randomNumber(701, reveal);
        } else if (_genre == 4) {
            _power = 500 + _randomNumber(501, reveal);
            _blood = 2500 + _randomNumber(1501, reveal);
        }

        _color =_random(4, _genre, reveal);
        return (_color, _power, _blood);
    }

    // 随机数
    function _random(uint256 _length, uint256 _genre, int256 _reveal) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, blockhash(block.number - 1), block.coinbase, now, _genre, _reveal))) % _length;
    }

    // 随机数
    function _randomNumber(uint256 _upper, int256 _reveal) private view returns (uint256 _number) {
        uint256 _seed = uint256(keccak256(abi.encodePacked(block.difficulty, blockhash(block.number - 1), block.coinbase, now, _reveal)));
        _number = _seed % _upper;
    }
}
