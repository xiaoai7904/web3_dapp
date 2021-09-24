var Migrations = artifacts.require("./land/ShipCore.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};