/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useStoreApi from '@/hooks/useStoreApi';
import useWeb3 from '@/hooks/useWeb3';
import useContract from '@/hooks/useContract';
import useAccount from '@/hooks/useAccount';
import useTips from '@/hooks/useTips';
import { forEach } from 'lodash';
import { notification } from 'antd';
import { orderCheckApi, orderConfirmApi, orderFailApi, approveApi } from '@/module/requestApi/RequestApi';
import { localStorageApi } from '@/store';
import { getChianName, getTransferAddress, getContractAddress } from '@/module/utils/Utils';
import { approveAddress } from '@/config';

let tempShopcarData = [];

export const useShopCar = type => {
  const [payLoading, setPayLoading] = useState(false);
  const { getUserAccount, getSEAContractBalance } = useAccount();
  const { address, isLandShopCar, otherShopCar, isLandPrice, setIsLandShopCar, setOtherShopCar } = useStoreApi();
  const web3 = useWeb3();
  const { getSEAContract } = useContract();
  const { sumAmount } = useShopCarSumAmount(type);
  const { showBuySEATips, showBuyLoadingTips, showBuyConfirmSuccessTips } = useTips();

  const tipsFail = () => {
    notification.error({
      message: 'Tips',
      description: 'Transaction failed',
    });
  };
  const tipsSuccess = () => {
    notification.success({
      message: 'Tips',
      description: 'Successful transaction',
    });
  };
  const tipsFailTimeout = () => {
    notification.error({
      message: 'Tips',
      description: 'Transaction timeout',
    });
  };
  const getShopCarData = type => {
    const shopCarDataMap = new Map([
      [1, isLandShopCar],
      [2, otherShopCar],
    ]);
    return shopCarDataMap.get(type);
  };
  // 获取岛屿价格
  const getIsLandPrice = genre => {
    const currentIsland = isLandPrice.find(item => item.genre === genre);
    if (currentIsland) return currentIsland.price;
    return 0;
  };

  // 构造下单检查参数
  const createTransferParams = (type, addressValue) => {
    const shopCarData = getShopCarData(type);
    const chainName = getChianName();
    const transferParams = {
      1: {
        chainName,
        address: addressValue,
        type,
        orderVos: shopCarData.map(item => {
          return {
            commodityId: item.id,
            amount: getIsLandPrice(item.genre),
            genre: item.genre,
          };
        }),
      },
      2: {
        chainName,
        address: addressValue,
        type,
        orderVos: shopCarData.map(item => {
          return {
            amount: item.price,
            genre: item.genre,
          };
        }),
      },
    };
    return transferParams[type];
  };

  // 清空购物车数据
  const clearShopCar = type => {
    if (type === 1) {
      setIsLandShopCar();
    } else if (type === 2) {
      setOtherShopCar();
    }
  };

  // 授权usdt
  const approveUSDT = async (seaTokenIns, addressValue) => {
    try {
      const result = await seaTokenIns.methods.allowance(addressValue, approveAddress).call();
      if (+result <= 0) {
        const amount = web3.utils.toWei('999999999', 'ether');
        seaTokenIns.methods
          .approve(approveAddress, amount)
          .send({ from: addressValue })
          .on('confirmation', async (confirmationNumber, receipt) => {
            if (confirmationNumber === 0 && receipt.status) {
              try {
                await approveApi({
                  fromAddress: addressValue,
                  toAddress: approveAddress,
                  contractAddress: getContractAddress(),
                  chainName: getChianName(),
                  amount: '999999999',
                });
              } catch (error) {}
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 调用合约交易SEA
  const transferSea = async (addressValue = address, type) => {
    try {
      let loadingModal = null;
      let confirmModal = null;
      setPayLoading(true);

      // 该用户没有USDT代币，提示用户进行兑换
      const balance = await getSEAContractBalance(addressValue);

      if (balance <= 0 || balance < sumAmount) {
        showBuySEATips();
        setPayLoading(false);
        return false;
      }

      // 下单检查
      const orderParams = createTransferParams(type, addressValue);
      const orderCheckResult = await orderCheckApi(orderParams);
      const currentOrderId = orderCheckResult.uniqueCode;
      const seaTokenIns = await getSEAContract();
      const tokenDecimals = await seaTokenIns.methods.decimals().call();
      const amount = web3.utils.toWei(sumAmount + '', tokenDecimals == 6 ? 'mwei' : 'ether');

      seaTokenIns.methods
        .transfer(getTransferAddress(localStorageApi.get('chainId')), amount + '')
        .send({ from: addressValue })
        .on('confirmation', async (confirmationNumber, receipt) => {
          if (confirmationNumber === 0 && receipt.status) {
            confirmModal && confirmModal.destroy();
            try {
              console.log('order success', receipt, currentOrderId);
              await orderConfirmApi({ uniqueCode: currentOrderId, checkTxn: receipt.transactionHash });
              tipsSuccess();
              type === 1 &&
                orderParams.orderVos.forEach(item => {
                  window.dapp.event.emit('isLandBuySuccess_' + item.commodityId, item);
                });
            } catch (error) {}
          }
        })
        .on('transactionHash', hash => {
          // 点击metamask确定按钮会立即触发
          console.log('transactionHash', hash);
          setPayLoading(false);
          clearShopCar(type);
          loadingModal && loadingModal.destroy();
          confirmModal = showBuyConfirmSuccessTips(hash);
          approveUSDT(seaTokenIns, addressValue);
        })
        .on('error', (error, receipt) => {
          console.error(error, receipt);
          loadingModal && loadingModal.destroy();
          confirmModal && confirmModal.destroy();
          setPayLoading(false);
          tipsFail();
          orderFailApi({ uniqueCode: currentOrderId, checkTxn: '', message: 'Deal canceled' });
        });

      // 监听合约交易事件
      seaTokenIns.events
        .Transfer()
        .on('connected', () => {
          loadingModal = showBuyLoadingTips(sumAmount);
        })
        .on('error', (error, receipt) => {
          loadingModal && loadingModal.destroy();
          setPayLoading(false);
          orderFailApi({
            uniqueCode: currentOrderId,
            checkTxn: receipt.transactionHash,
            message: 'The transaction was rejected by the network',
          });
        });

      // 超时处理
      setTimeout(() => {
        if (payLoading) {
          setPayLoading(false);
          tipsFailTimeout();
        }
      }, 1000 * 60 * 5);
    } catch (error) {
      setPayLoading(false);
      console.error(error);
    }
  };

  // 支付购物车
  const pay = async type => {
    try {
      let _address = address;
      if (!_address) {
        _address = await getUserAccount();
      }
      transferSea(_address, type);
    } catch (error) {
      console.error(error);
    }
  };

  // 删除购物车数据
  const delShopCar = id => {
    if (type === 1) {
      setIsLandShopCar(id);
    } else if (type === 2) {
      setOtherShopCar(id);
    }
  };

  useEffect(() => {
    window.dapp.event.off('landPointerdown');
    window.dapp.event.off('openBilndBox');
    window.dapp.event.off('cancelShopcar');

    window.dapp.event.on('landPointerdown', data => {
      tempShopcarData.push(data);
      setTimeout(() => {
        if (tempShopcarData.length) {
          setIsLandShopCar(tempShopcarData[0]);
          tempShopcarData = [];
        }
      }, 300);
    });

    window.dapp.event.on('cancelShopcar', () => {
      tempShopcarData = [];
    });

    window.dapp.event.on('openBilndBox', data => {
      setOtherShopCar(data);
    });
    return () => {
      console.log('des');
      window.dapp.event.off('landPointerdown');
      window.dapp.event.off('openBilndBox');
      window.dapp.event.off('cancelShopcar');
      tempShopcarData = [];
    };
  }, []);

  return {
    isLandShopCar,
    otherShopCar,
    pay,
    payLoading,
    getIsLandPrice,
    delShopCar,
  };
};

export const useShopCarSumAmount = type => {
  const { isLandShopCar, otherShopCar } = useStoreApi();
  const { isLandPrice } = useStoreApi();
  let sumAmount = 0;

  // 获取岛屿价格
  const getIsLandPrice = genre => {
    const currentIsland = isLandPrice.find(item => item.genre === genre);
    if (currentIsland) return currentIsland.price;
    return 0;
  };

  if (type === 1) {
    forEach(isLandShopCar, item => {
      sumAmount += getIsLandPrice(item.genre);
    });
  } else if (type === 2) {
    forEach(otherShopCar, item => {
      sumAmount += item.price;
    });
  }

  return {
    sumAmount,
  };
};
export default useShopCar;
