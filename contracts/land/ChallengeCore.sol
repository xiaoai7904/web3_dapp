pragma solidity ^0.5.0;

import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IsLandERC721.sol";
import "./Strings.sol";

contract ChallengeCore is Pausable, IsLandERC721 {

    // 地图块信息
    struct ShipStruct {
        uint256 genre;
        uint256 color;     // 颜色
        uint256 power;     // 攻击力
        uint256 blood;    // 血量
        uint256 bornAt;     //生成时间
        address owner;     //拥有者
    }

    constructor() IsLandERC721("Nautical Ship", "SHIP") public {

    }

    // 攻击未知岛屿
    function attack() external returns(bool){
        // 获取用户船只的总数量
        uint256 powerTotal;
        uint256 bloodTotal;
        (powerTotal, bloodTotal) = _totalColumn();

        // 未知岛屿的攻击力和血量
        uint256 islandPower;
        uint256 islandBlood;
        // 进行pk, 胜利获取100-500代币
        return _duel();
    }

    function _totalColumn() private view returns(uint256 _power, uint256 _blood){
        address _sender = msg.sender;
//        ShipStruct[] memory shipStructs = userShipNftMap[msg.sender];
        uint256 _powerTotal;
        uint256 _bloodTotal;
//        for (uint256 i = 0; i <= shipStructs.length; i++) {
//            _powerTotal += shipStructs[i].power;
//            _bloodTotal += shipStructs[i].blood;
//        }
        return (_powerTotal, _bloodTotal);
    }

    function _islandColumn() private pure returns(uint256 _power, uint256 _blood){

        return (_power, _blood);
    }

    // 决斗函数
    function _duel() private pure returns(bool){

        return false;
    }

    // 随机数
    function _random(uint256 _length) private view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, now))) % _length;
    }

    // 随机数
    function _randomNumber(
        uint256 _upper,
        uint256 _initialSeed
    )
    private
    view
    returns (uint256 _number)
    {
        uint256 _seed = uint256(
            keccak256(
                abi.encodePacked(
                    _initialSeed,
                    blockhash(block.number - 1),
                    block.coinbase,
                    block.difficulty
                )
            )
        );

        _number = _seed % _upper;
    }
}
