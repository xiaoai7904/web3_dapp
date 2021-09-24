import React, { useState } from 'react';
import useShopCar, { useShopCarSumAmount } from '@/hooks/useShopCar';
import MapPage from '@/components/map/MapPage.view';
import MallPage from '@/components/mall/MallPage.view';
import HeaderView from '@/components/header/Header.view';
import { islandsMap, shipMap } from '@/module/pageMap/PageMap.config';
import { Row, Col, Button, Tabs, Image, Drawer } from 'antd';
import { ShoppingCartOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { isPc } from '@/module/utils/Utils';

import './Marketplace.style.less';

const shopCarIcon = require('../../assets/svg/icon_cart.svg');
const shopCarEmptyIcon = require('../../assets/images/illustration_emptycart.png');
const meatMaskIcon = require('../../assets/svg/icon_metamask.svg');
const shopIcon = require('../../assets/svg/shop-icon.svg');
const mapIcon = require('../../assets/svg/map-icon.svg');

const IsLandShopCar = props => {
  const { shopCarData } = props;
  const { delShopCar, getIsLandPrice } = useShopCar(1);
  if (!shopCarData.length) return null;
  return (
    <div className="shopcar-content">
      {shopCarData.map(item => {
        return (
          <div key={item.id} className="shopcar-item-content">
            <p className="flex-between shopcar-item">
              <span className="label">Type:</span>
              <span className="value">{islandsMap.get(item.genre)}</span>
            </p>
            <p className="flex-between shopcar-item">
              <span className="label">Coordinate:</span>
              <span className="value">
                {item.x},{item.y}
              </span>
            </p>
            <p className="flex-between shopcar-item">
              <span className="label">Price: </span>
              <span className="value">{getIsLandPrice(item.genre, item.location)} USDT</span>
            </p>
            <CloseCircleOutlined className="del-icon" style={{ fontSize: '30px', color: '#193853' }} onClick={() => delShopCar(item.id)} />
          </div>
        );
      })}
    </div>
  );
};

const OtherShopCar = props => {
  const { shopCarData } = props;
  const { delShopCar } = useShopCar(2);
  if (!shopCarData.length) return null;
  return (
    <div className="shopcar-content">
      {shopCarData.map(item => {
        const shipItem = shipMap.get(item.genre);
        return (
          <div key={item.id} className="shopcar-item-content">
            <p className="title-content">
              <span className="title">{shipItem.name}</span>
            </p>
            <p className="flex-between shopcar-item">
              <span className="label">Price:</span>
              <span className="value">{item.price} USDT</span>
            </p>
            <CloseCircleOutlined className="del-icon" style={{ fontSize: '30px', color: '#193853' }} onClick={() => delShopCar(item.id)} />
          </div>
        );
      })}
    </div>
  );
};
// 购物车列表
const ShopCarView = props => {
  const { type } = props;
  const { isLandShopCar, otherShopCar, pay, payLoading } = useShopCar(type);
  const { sumAmount } = useShopCarSumAmount(type);
  const shopCarDataMap = new Map([
    [1, isLandShopCar],
    [2, otherShopCar],
  ]);
  const shopCarData = shopCarDataMap.get(type);

  return (
    <div>
      <div className="marketplace-shopcar-title flex-center">
        <img src={shopCarIcon} alt="shopCar" />
        <span className="title">Shopping Cart</span>
        <div className="line-container">
          <span className="line"></span>
          <span className="dot2"></span>
          <span className="dot1"></span>
        </div>
      </div>
      {shopCarData.length <= 0 && (
        <div className="shopcar-empty">
          <img src={shopCarEmptyIcon} alt="shopCar empty" />
          <div className="text">Your cart is empty.</div>
        </div>
      )}
      <div className="wallet-suggestion">
        <div className="suggestion-box flex-between">
          <div className="text">
            <span>Need a wallet? We suggest&nbsp;</span>
            <a href="https://metamask.io/" rel="noopener noreferrer" target="_blank">
              Metamask
            </a>
          </div>
          <img src={meatMaskIcon} alt="Metamask" />
        </div>
      </div>
      {type === 1 && <IsLandShopCar shopCarData={shopCarData} />}
      {type === 2 && <OtherShopCar shopCarData={shopCarData} />}
      <div className="shopcar-buy flex-between">
        <h2 className="shopcar-buy-text">Total:{sumAmount} USDT</h2>
        <Button type="primary" onClick={() => pay(type)} loading={payLoading} disabled={shopCarData.length <= 0}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

// 交易市场
const Marketplace = () => {
  const { shopCarIsLandVisible, shopCarShipVisible, onCloseShopCarIsLand, onCloseShopCarShip, openShopCarIsLand, openShopCarShip } =
    useMarketplaceHook();
  const tab1 = (
    <div className="tab-title flex-center">
      <Image width="40px" src={mapIcon} preview={false} />
      <span>IsLand</span>
    </div>
  );

  const tab2 = (
    <div className="tab-title flex-center">
      <Image width="40px" src={shopIcon} preview={false} />
      <span>Mall</span>
    </div>
  );

  return (
    <div className={isPc() ? 'marketplace' : 'marketplace marketplace-mobile'}>
      <HeaderView />
      <Tabs tabPosition={isPc() ? 'left' : 'top'}>
        <Tabs.TabPane tab={isPc() ? tab1 : 'IsLand'} key="1">
          <Row className="marketplace-row">
            <Col className="marketplace-shopcar" xs={0} sm={0} md={0} lg={8} xl={6} xxl={4}>
              <ShopCarView type={1} />
            </Col>
            <Col className="marketplace-col-right" xs={24} sm={24} md={24} lg={16} xl={18} xxl={20}>
              <MapPage />
            </Col>
          </Row>
          <div className="mini-shopcar" onClick={openShopCarIsLand}>
            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
          </div>
          <Drawer
            title="Shopping Cart"
            width="70%"
            placement="right"
            onClose={onCloseShopCarIsLand}
            forceRender
            visible={shopCarIsLandVisible}
            className="shopcar-drawer">
            <ShopCarView type={1} />
          </Drawer>
        </Tabs.TabPane>
        <Tabs.TabPane tab={isPc() ? tab2 : 'Mall'} key="2">
          <Row className="marketplace-row">
            <Col className="marketplace-shopcar" xs={0} sm={0} md={0} lg={8} xl={6} xxl={4}>
              <ShopCarView type={2} />
            </Col>
            <Col className="marketplace-col-right" xs={24} sm={24} md={24} lg={16} xl={18} xxl={20}>
              <MallPage />
            </Col>
          </Row>
          <div className="mini-shopcar" onClick={openShopCarShip}>
            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
          </div>
          <Drawer
            title="Shopping Cart"
            width="70%"
            placement="right"
            onClose={onCloseShopCarShip}
            forceRender
            visible={shopCarShipVisible}
            className="shopcar-drawer">
            <ShopCarView type={2} />
          </Drawer>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

const useMarketplaceHook = () => {
  const [shopCarIsLandVisible, setShopCarIsLandVisible] = useState(false);
  const [shopCarShipVisible, setShopCarShipVisible] = useState(false);

  const openShopCarIsLand = () => {
    setShopCarIsLandVisible(true);
  };
  const openShopCarShip = () => {
    setShopCarShipVisible(true);
  };
  const onCloseShopCarIsLand = () => {
    setShopCarIsLandVisible(false);
  };
  const onCloseShopCarShip = () => {
    setShopCarShipVisible(false);
  };

  return { shopCarIsLandVisible, shopCarShipVisible, onCloseShopCarIsLand, onCloseShopCarShip, openShopCarIsLand, openShopCarShip };
};
export default Marketplace;
