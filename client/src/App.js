/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './App.css';
import './style/index.less';
import RouterApp from '@/router/Router';
import { priceListApi, getUserInfoApi } from '@/module/requestApi/RequestApi';
import useStoreApi from '@/hooks/useStoreApi';
import { localStorageApi } from '@/store';
import { getChianName } from '@/module/utils/Utils';

const App = () => {
  const { setIsLandPrice } = useStoreApi();
  const requestIsLandPrice = async () => {
    try {
      const result = await priceListApi({ chainName: getChianName(localStorageApi.get('chainId')) });
      setIsLandPrice(result.list);
    } catch (error) {}
  };

  const getUserInfo = async () => {
    try {
      await getUserInfoApi();
    } catch (error) {
      window.dapp.event.emit('loginExpired');
    }
  };

  useEffect(() => {
    requestIsLandPrice();
    if (localStorageApi.get('token')) {
      getUserInfo();
    }
  }, []);

  return <RouterApp />;
};

export default App;
