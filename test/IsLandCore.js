const IsLandCore = artifacts.require("./land/IsLandCore.sol");

contract("IsLandCore", accounts => {
  it("...creator test start", async () => {
    console.info('account:' + accounts[0]);
    console.info('account1:' + accounts[1]);
    const simpleStorageInstance = await IsLandCore.deployed();


    const isLandCount = await simpleStorageInstance.isLandCount.call();
    console.info("isLandCount:" + isLandCount.smallNum + ' ' + isLandCount.mediumNum + ' ' + isLandCount.largeNum);

    const payLand = await simpleStorageInstance.payLand(1, 1, accounts[0], {from: accounts[0]});
    console.info("payLand:" + payLand);

    const isLand = await simpleStorageInstance.getIsLandById(1, {from: accounts[0]});
    console.info("isLand:" + isLand.genre + ' ' + isLand.bornAt + ' ' + isLand.owner);

    const isLandCount2 = await simpleStorageInstance.isLandCount.call();
    console.info("isLandCount2:" + isLandCount2.smallNum + ' ' + isLandCount2.mediumNum + ' ' + isLandCount2.largeNum);

    const transferIsLand = await simpleStorageInstance.transferIsLand(1, accounts[0], "0xb10a61Daa9a87fFCBB444417dD69a3933C617", {from: accounts[0]});
    console.info("transferIsLand:" + transferIsLand);

    const isLand2 = await simpleStorageInstance.getIsLandById(1, {from: accounts[0]});
    console.info("isLand2:" + isLand2.genre + ' ' + isLand2.bornAt + ' ' + isLand2.owner);

    const tokenURI = await simpleStorageInstance.tokenURI(1, {from: accounts[0]});
    console.info("tokenURI:" + tokenURI);

  });
});

