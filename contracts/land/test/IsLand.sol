pragma solidity ^0.5.0;

import "../../common/Proxy.sol";
import "./StorageStateful.sol";
import "./IsLandStorage.sol";

/// 入口合约
contract IsLand is StorageStateful, Proxy {
    
    bool public isInitialized;
	
	event UpdateStorage(address indexed admin, address indexed storage_);
	
	constructor() public {
		IsLandStorage storage_ = new IsLandStorage(address(this));
		_installStorage(storage_);
	}
	
	function _installGlobalS(KeyValueStorage globalS_) internal {
	    _globalS = globalS_;
	    _globalS.setAddress(keccak256("IsLand"), address(this));
	}
	
	function _installStorage(IsLandStorage storage_) internal {
		_storage = storage_;
		emit UpdateStorage(msg.sender, address(storage_));
	}
	
	function initialize(KeyValueStorage globalS_, address logic_) onlyOwner external {
	    require(!isInitialized, "IsLand: has already initialized");
	    _installGlobalS(globalS_);
	    upgradeTo("0.0.1", logic_);
	    isInitialized = true;
	}
} 