import useStoreApi from '@/hooks/useStoreApi';
import useWeb3 from '@/hooks/useWeb3';
import useContract from '@/hooks/useContract';
import useDecimals from '@/hooks/useDecimals';
import useTips from '@/hooks/useTips';
import { isPc } from '@/module/utils/Utils';

export const useAccount = () => {
  const { showPcInstallTips, showMobileInstallTips } = useTips();
  const { setAddress, setBalance, setSeaBalance } = useStoreApi();
  const web3 = useWeb3();
  const { getSEAContract } = useContract();
  const decimals = useDecimals();
  const getUserAccount = () => {
    return new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        try {
          await web3.eth.requestAccounts();
          web3.eth.getAccounts().then(accounts => {
            setAddress(accounts[0]);
            updateBalance(accounts[0]);
            getSEAContractBalance(accounts[0]);
            resolve(accounts[0]);
          });
        } catch (error) {
          console.error(error);

          reject();
        }
      } else {
        if (isPc()) {
          showPcInstallTips();
        } else {
          showMobileInstallTips();
        }
        reject();
      }
    });
  };

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, 'ether'));
    });
  };

  // 获取合约代币余额
  const getSEAContractBalance = address => {
    return new Promise(async resolve => {
      try {
        const seaTokenIns = await getSEAContract();
        const seaBalance = await seaTokenIns.methods.balanceOf(address).call();
        const value = parseInt(seaBalance / decimals);
        setSeaBalance(value);
        resolve(value);
      } catch (error) {
        console.error('err', error);
        resolve(0);
      }
    });
  };

  return { getUserAccount, getSEAContractBalance };
};

export default useAccount;
