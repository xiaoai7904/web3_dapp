import React from 'react';
import { Modal } from 'antd';
import { LoadingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { localStorageApi } from '@/store';
import { explorerLinkAddressMap } from '@/config';

const meatMaskIcon = require('../assets/svg/icon_metamask.svg');
const opearIcon = require('../assets/svg/opera.svg');
const uniswapIcon = require('../assets/images/uniswap-logo.png');
const pancakeSwapIcon = require('../assets/images/pancakeswap-cake-logo.png');

// 提示弹窗
export const useTips = () => {
  const showPcInstallTips = () => {
    Modal.info({
      title: 'Metamask extensions not detected!',
      centered: true,
      className: 'install-modal-wrap',
      okText: 'Close',
      content: (
        <div className="flex-center intall-tips" style={{ flexDirection: 'column' }}>
          <img className="metamask-icon" src={meatMaskIcon} alt="Metamask" />
          <a className="link" href="https://metamask.io/" rel="noopener noreferrer" target="_blank">
            Install MetaMask Wallet
          </a>
        </div>
      ),
      onOk() {},
    });
  };

  const showMobileInstallTips = () => {
    Modal.info({
      title: 'Browser does not support',
      centered: true,
      className: 'install-modal-wrap',
      okText: 'Close',
      content: (
        <div className="install-content">
          <div className="flex-center intall-tips" style={{ flexDirection: 'column' }}>
            <img className="metamask-icon" src={uniswapIcon} alt="Metamask" />
            <a className="link" href="https://metamask.io/" rel="noopener noreferrer" target="_blank">
              Install MetaMask App
            </a>
          </div>
          <div className="flex-center intall-tips" style={{ flexDirection: 'column' }}>
            <img className="metamask-icon" src={opearIcon} alt="Opear" />
            <a className="link" href="https://www.opera.com/mobile" rel="noopener noreferrer" target="_blank">
              Install Opera Mobile App
            </a>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  const showBuySEATips = () => {
    Modal.info({
      title: 'Insufficient account balance',
      centered: true,
      className: 'install-modal-wrap',
      okText: 'Close',
      content: (
        <div className="buy-sea-content flex-between">
          <a className="buy-sea-item" href="https://app.uniswap.org/#/swap" rel="noopener noreferrer" target="_blank">
            <div className="flex-center intall-tips" style={{ flexDirection: 'column' }}>
              <img className="metamask-icon" src={uniswapIcon} alt="Uniswap" />
              <span className="link"> Buy USDT on Uniswap</span>
            </div>
          </a>
          <a className="buy-sea-item" href="https://pancakeswap.finance/swap" rel="noopener noreferrer" target="_blank">
            <div className="flex-center intall-tips" style={{ flexDirection: 'column' }}>
              <img className="metamask-icon" src={pancakeSwapIcon} alt="PancakeSwap" />
              <span className="link">Buy USDT on Pancake</span>
            </div>
          </a>
        </div>
      ),
      onOk() {},
    });
  };

  const showBuyLoadingTips = value => {
    const modal = Modal.info({
      centered: true,
      footer: null,
      icon: null,
      className: 'install-modal-wrap buy-loading-modal-wrap',
      keyboard: false,
      maskClosable: false,
      content: (
        <div className="buy-loading-content">
          <LoadingOutlined style={{ fontSize: '120px', color: '#1890ff' }} />
          <h2>Waiting For Transaction</h2>
          <p className="total">
            Total cost of <span>{value}</span>&nbsp;USDT
          </p>
          <p className="text">Confirm this transaction in your wallet</p>
        </div>
      ),
      onOk() {},
    });
    return modal;
  };

  const showBuyConfirmSuccessTips = hash => {
    const chainId = localStorageApi.get('chainId');
    const link = explorerLinkAddressMap[chainId];

    const modal = Modal.info({
      centered: true,
      footer: null,
      icon: null,
      className: 'install-modal-wrap',
      okText: 'Close',
      keyboard: false,
      maskClosable: false,
      content: (
        <div className="buy-confirm-content">
          <ClockCircleOutlined style={{ fontSize: '80px', color: '#1890ff' }} />
          <h2>Transaction Submitted</h2>
          <a href={`${link}${hash}`} rel="noopener noreferrer" target="_blank">
            View on Explorer
          </a>
        </div>
      ),
      onOk() {},
    });
    return modal;
  };

  return { showPcInstallTips, showMobileInstallTips, showBuySEATips, showBuyLoadingTips, showBuyConfirmSuccessTips };
};

export default useTips;
