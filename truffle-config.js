const path = require('path');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = '';
const infura_url = 'https://ropsten.infura.io/v3/';
const mnemonic_sea = '';
const infura_url_sea = 'https://rinkeby.infura.io/v3/';
const infura_url_bsc_testnet = 'https://data-seed-prebsc-1-s2.binance.org:8545/';
const infura_url_eth = 'https://mainnet.infura.io/v3/';
const infura_url_bsc = 'https://bsc-dataseed1.binance.org/';
const privateKey = '';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    develop: {
      port: 8545,
    },
    //  ropsten 测试网络的设置，
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, infura_url);
      },
      network_id: '3',
      gas: 4500000,
    },
    //  rinkeby 测试网络的设置，
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic_sea, infura_url_sea);
      },
      network_id: '*',
    },
    eth: {
      provider: function () {
        return new HDWalletProvider(privateKey, infura_url_eth);
      },
      network_id: '*',
    },
    bsc: {
      provider: function () {
        return new HDWalletProvider(privateKey, infura_url_bsc);
      },
      network_id: '*',
    },
  },
  //   compilers: {
  //     solc: {
  //       version: "0.8.6"
  //     }
  //  }
};
