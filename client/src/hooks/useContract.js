// import SEAToken from '@/contracts/SEAToken.json';
import useWeb3 from '@/hooks/useWeb3';
import { localStorageApi } from '@/store';
import { getContractAddress, getContractAbi } from '@/module/utils/Utils';

import usdtEthAbi from '../contractsJson/USDT_eth.json';
import usdtEthTestAbi from '../contractsJson/USDT_eth_test.json';
import usdtBscAbi from '../contractsJson/USDT_bsc.json';
import usdtBscTestAbi from '../contractsJson/USDT_bsc_test.json';

const usdtAbiMap = {
  eth: usdtEthAbi,
  eth_test: usdtEthTestAbi,
  bsc: usdtBscAbi,
  bsc_test: usdtBscTestAbi,
};

export const useContract = () => {
  const web3 = useWeb3();
  const getContract = async (contract, address) => {
    try {
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = contract.networks[networkId];
      const instance = new web3.eth.Contract(contract.abi, address);
      return instance;
    } catch (error) {
      console.error('getContract', error);
    }
  };

  const getSEAContract = () => {
    const chainId = localStorageApi.get('chainId');
    return getContract({ abi: getContractAbi(chainId, usdtAbiMap) }, getContractAddress(chainId));
  };

  return { getContract, getSEAContract };
};

export default useContract;
