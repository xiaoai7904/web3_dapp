import MD5 from 'js-md5';
import { transferAddressMap, chianNameMap, contractAddressMap } from '@/config';
import { localStorageApi } from '@/store';

export const md5 = word => MD5(word);
export const throttle = (fn, ms) => {
  let startTime = 0;

  return (...arg) => {
    if (Date.now() - startTime > ms) {
      fn(...arg);
      startTime = Date.now();
    }
  };
};
export const debounce = (fn, ms) => {
  let timer = null;

  return (...arg) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...arg);
    }, ms);
  };
};
export const isPc = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return false;
  }
  return true;
};

export const getChianName = id => {
  if (!id) {
    id = localStorageApi.get('chainId');
  }
  return chianNameMap[id] || 'eth';
};

export const getContractAddress = id => {
  if (!id) {
    id = localStorageApi.get('chainId');
  }
  return contractAddressMap[id];
};

export const getContractAbi = (id, abiMap) => {
  const isPro = process.env.REACT_APP_RELEASE_ENV === 'production';
  const key = getChianName(id);
  return abiMap[`${key}${isPro ? '' : '_test'}`];
};

export const getTransferAddress = id => transferAddressMap[id];
