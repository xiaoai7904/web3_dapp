/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { message, notification, Modal } from 'antd';
import Web3 from 'web3';
import { localStorageApi } from '@/store';
import useStoreApi from '@/hooks/useStoreApi';
import { mainNetwork } from '@/config';

let count = 0;
let networkCount = 0;
let networkChangeCount = 0;

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const { setMainNetWork } = useStoreApi();

  const bindEvent = () => {
    // 监听网络切换
    window.ethereum.on('networkChanged', function (network) {
      if (networkChangeCount === 0) {
        Modal.info({
          title: 'Network changes',
          content: 'The network link has changed. For the safety of your funds, please reload the page',
          onOk() {
            window.location.reload();
          },
        });
      }
      networkChangeCount++;
    });
  };

  const checkIsMainNetwork = id => {
    const flag = mainNetwork.indexOf(Number(id)) < 0;
    setMainNetWork(flag ? 0 : 1);
    if (networkCount === 0 && flag) {
      notification.error({
        message: 'Wrong network',
        duration: null,
        description: 'Please change to Mainnet network',
      });
      networkCount++;
    }
  };

  useEffect(() => {
    var instance;
    try {
      if (window.ethereum) {
        // set up a new provider
        try {
          bindEvent();
          instance = new Web3(window.ethereum);
          localStorageApi.set('chainId', window.ethereum.chainId);
          process.env.REACT_APP_RELEASE_ENV === 'production' && checkIsMainNetwork(window.ethereum.chainId);
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        instance = new Web3(window.web3);
      } else {
        // fallback on localhost provider
        // const provider = new Web3.provider.HttpProvider('http://127.0.0.1:7545');
        instance = new Web3('http://127.0.0.1:7545');
      }
      setWeb3(instance);
    } catch (error) {
      count++;
      if (count <= 1) {
        message.error('Please Install MetaMask for your browser');
      }
    }
  }, []);

  return web3;
};

export default useWeb3;
