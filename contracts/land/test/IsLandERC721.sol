pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./AccessControl.sol";
import "./IIsLandDelegate.sol";
import "../../common/KeyValueStorage.sol";

contract IsLandERC721 is ERC721Full, ERC721Mintable, AccessControl {
    // 全局数据存储器
    KeyValueStorage public globalS;
    // 购买成功事件
    event PayedSpawned(address indexed owner, uint256 indexed tokenId);
    // 转让成功事件
    event TransferSpawned(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(KeyValueStorage globalStorage) ERC721Full("Nautical Chart", "ISLAND") public {
        globalS = globalStorage;
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    modifier mustBeOwnerToken(uint256 tokenId) {
        require(_exists(tokenId));
        _;
    }

    modifier noOwnerToken(uint256 tokenId) {
        require(!_exists(tokenId), '资源信息已经被购买');
        _;
    }

    function _isLand() internal view returns(IIsLandDelegate) {
        IIsLandDelegate isLand = IIsLandDelegate(globalS.getAddress(keccak256("IsLand")));
        return isLand;
    }

    // 获取逻辑合约地址引用
    function getIsLand() external view returns(IIsLandDelegate) {
        return _isLand();
    }

    // 返回全局数据存储器
    function getGlobalS() external view returns(KeyValueStorage){
        return globalS;
    }

    // 购买地图
    function payLand(uint256 mapId, uint8 genre, address owner) external noOwnerToken(mapId) {
        IIsLandDelegate isLand = _isLand();
        isLand.payLand(mapId, genre, owner);
        _mint(owner, mapId);
        _setTokenURI(mapId, "QmVYUynEgKUaAYMR9TejpsbbLhA3TXBPD3ywD9JtVZ8CeL/0");
        // 调用成功事件
        emit PayedSpawned(owner, mapId);
    }

    // 转让地图
    function transferIsLand(uint256 mapId, address from, address to) external mustBeOwnerToken(mapId) {
        IIsLandDelegate isLand = _isLand();
        isLand.transferIsLand(mapId, to);
        _transferFrom(from, to, mapId);
        // 调用成功事件
        emit TransferSpawned(from, to, mapId);
    }

    // 获取已经购买地图信息
    function getTokenIds(address account) external view returns (uint256[] memory) {
        uint256[] memory tokenIds = _tokensOfOwner(account);
        return tokenIds;
    }
    
}
