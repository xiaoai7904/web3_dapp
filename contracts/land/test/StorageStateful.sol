pragma solidity ^0.5.0;

import "./IsLandStorage.sol";
import "../../common/KeyValueStorage.sol";

// 键值存储
contract StorageStateful {
    IsLandStorage public _storage;
    KeyValueStorage public _globalS;
}
