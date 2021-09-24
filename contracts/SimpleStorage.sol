// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {

  uint storedData;

  // 地图块信息
  struct StoredStruct {
    uint genre;      //类型
  }

  mapping (uint => StoredStruct) public storedMapping;

  uint[2048][1] coordinate;

  address sellerAddr;

  constructor() public {
    sellerAddr = msg.sender;
  }

  function set(uint x) public {
    storedData = x;
    storedMapping[x] = StoredStruct(x);
    coordinate[0][0] = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }

  function getSellerAddr() public view returns (address) {
    return sellerAddr;
  }
}
