import React, { useEffect, useState } from 'react';
import useStoreApi from '@/hooks/useStoreApi';
import { shipMap } from '@/module/pageMap/PageMap.config';
import { Button, Image, Spin } from 'antd';
import { priceTypeListApi } from '@/module/requestApi/RequestApi';
import './MallPage.style.less';

const shipIcon1 = require('../../assets/images/ship1.png');
const shipIcon2 = require('../../assets/images/ship2.png');
const shipIcon3 = require('../../assets/images/ship3.png');
const shipIcon4 = require('../../assets/images/ship4.png');

const ship = [shipIcon1, shipIcon2, shipIcon3, shipIcon4];

export const MallPage = () => {
  const { list, loading, openBlindBox } = useMallPageHook();
  const { mainNetWork } = useStoreApi();
  const isMainNetWork = mainNetWork === 1;

  return (
    <div className="mall-page-containter">
      <Spin spinning={loading} size="large">
        <div className="mall-page-wrap">
          <div className="mall-page">
            {!isMainNetWork ? (
              <div className="mall-page-main-net-tips flex-center">Sorry,Please change to Mainnet network.</div>
            ) : (
              <div className="mall-page-list" gutter={20}>
                {list.map((item, index) => {
                  const shipItem = shipMap.get(item.genre);
                  return (
                    <div key={index} className="mall-page-item flext-center">
                      <Image src={ship[index]} width="100%" preview={false} />
                      <div className="mall-page-item-des flex-between">
                        <span>Defense</span>
                        <span>{shipItem.defense}</span>
                      </div>
                      <div className="mall-page-item-des flex-between">
                        <span>Attack</span>
                        <span>{shipItem.attack}</span>
                      </div>
                      <div className="mall-page-item-des flex-between">
                        <span>{shipItem.name}</span>
                        <span className="price">{item.price} USDT</span>
                      </div>
                      <div className="mall-page-item-des open-btn">
                        <Button type="primary" onClick={() => openBlindBox(item)}>
                          Open blind box
                        </Button>
                      </div>
                      <div className="mall-page-item-des flex-between">
                        <span className="tips">Tip: Ship color, attack and defense will be randomly generated</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

const useMallPageHook = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const openBlindBox = item => {
    window.dapp.event.emit('openBilndBox', item);
  };

  const requestList = async () => {
    try {
      setLoading(true);
      const result = await priceTypeListApi();
      setList(result.list.filter(item => item.type === 2));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestList();
  }, []);
  return { list, loading, openBlindBox };
};
export default MallPage;
