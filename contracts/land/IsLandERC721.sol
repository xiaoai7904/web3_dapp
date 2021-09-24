pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./AccessControl.sol";

contract IsLandERC721 is ERC721Full, ERC721Mintable, AccessControl {
    
    string public tokenURISuffix = ".json";

    using Counters for Counters.Counter;

    // 购买成功事件
    event PayedSpawned(address indexed owner, uint256 indexed tokenId);
    // 转让成功事件
    event TransferSpawned(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public {
//        _setBaseURI(baseUri);
//        _safeMint(msg.sender, 1);
//        _setTokenURI(1, "image.json");
    }

    modifier mustBeOwnerToken(uint256 tokenId) {
        require(_exists(tokenId), 'token already exist');
        _;
    }

    modifier noOwnerToken(uint256 tokenId) {
        require(!_exists(tokenId), 'token already payed');
        _;
    }

    function setBaseURI(string calldata baseUri) external onlyCLevel {
        _setBaseURI(baseUri);
    }

    
    function _concatTokenURI(
        string memory tokenURIPrefix,
        uint256 _tokenId
    )
    internal
    view
    returns (string memory)
    {
        bytes memory _tokenURIPrefixBytes = bytes(tokenURIPrefix);
        bytes memory _tokenURISuffixBytes = bytes(tokenURISuffix);
        uint256 _tmpTokenId = _tokenId;
        uint256 _length;

        do {
            _length++;
            _tmpTokenId /= 10;
        } while (_tmpTokenId > 0);

        bytes memory _tokenURIBytes = new bytes(_tokenURIPrefixBytes.length + _length + 5);
        uint256 _i = _tokenURIBytes.length - 6;

        _tmpTokenId = _tokenId;

        do {
            _tokenURIBytes[_i--] = byte(uint8(48 + _tmpTokenId % 10));
            _tmpTokenId /= 10;
        } while (_tmpTokenId > 0);

        for (_i = 0; _i < _tokenURIPrefixBytes.length; _i++) {
            _tokenURIBytes[_i] = _tokenURIPrefixBytes[_i];
        }

        for (_i = 0; _i < _tokenURISuffixBytes.length; _i++) {
            _tokenURIBytes[_tokenURIBytes.length + _i - 5] = _tokenURISuffixBytes[_i];
        }

        return string(_tokenURIBytes);
    }

}
