var Migrations = artifacts.require("./land/IsLandCore.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
