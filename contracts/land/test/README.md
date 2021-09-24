## 目录结构介绍


    - contract
       |-- land                             // 客户模块，包含入口合约、逻辑合约、存储合约
           |--  IsLand.sol                  // 客户入口合约
           |--  IsLandDelegate.sol          // 客户逻辑合约
           |--  IsLandStorage.sol           // 客户存储合约
           |--  IIsLandDelegate.sol         // 客户逻辑合约接口
           |--  StorageStateful.sol         // 公共存储地址
       |-- common                           // 公共合约
           |--  Proxy.sol                   // 代理合约 
           |--  KeyValueStorage.sol         // 全局存储合约



## 部署操作步骤

* KeyValueStorage.sol
    
    部署账户地址将作为系统管理员地址。 然后再通过系统管理员账户部署客户入口合约
    
* IsLand.sol
    
    部署成功后，系统管理员账户部署客户逻辑合约
    
* IsLandDelegate.sol
    
    部署成功后，管理员身份调用IsLand.sol的initialize()方法，传入KeyValueStorage.sol合约地址，IsLandDelegate.sol合约地址作为参数，IsLand模块部署完成

* IsLandERC721.sol
    
    部署，传入KeyValueStorage.sol合约地址作为参数，IsLandERC721模块部署完成


## 升级逻辑合约

通过升级逻辑合约IsLandDelegate.sol来升级客户合约的功能。首先，部署新的逻辑合约IsLandDelegate.sol。部署成功后，在IsLand.sol合约中，利用upgradeTo()方法，传入版本号、新的逻辑合约地址作为参数来升级合约可实现的功能



>  [合约可升级方案参考地址](https://github.com/NoharaHiroshi/upgradability-solidity-demo)