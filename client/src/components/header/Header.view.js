import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Modal, Checkbox, Input, message, notification, Drawer, Spin } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import PageHistory from '@/router/PageHistory';
import {
  registerApi,
  loginApi,
  logoutApi,
  modifyPasswordApi,
  forgotPasswordApi,
  getCodeApi,
  validCodeApi,
} from '@/module/requestApi/RequestApi';
import { localStorageApi } from '@/store';
import { md5, isPc } from '@/module/utils/Utils';
import useAccount from '@/hooks/useAccount';
import useStoreApi from '@/hooks/useStoreApi';
import TransactionListView from '@/view/transactionList/TransactionList.view';
import './Header.style.less';

const logo = require('../../assets/images/logo.png');
const logo1 = require('../../assets/images/logo1.png');
const email = require('../../assets/images/icon_email.png');
const lock = require('../../assets/images/icon_lock.png');
const next = require('../../assets/images/form-icon_next.png');

let timerIns = null;
/**
 * 页面头部
 */
export const HeaderView = () => {
  const {
    userName,
    active,
    currentPath,
    isModalVisible,
    setIsModalVisible,
    modalState,
    openMenu,
    goto,
    login,
    goHome,
    changeModal,
    registerEvent,
    loginEvent,
    logoutEvent,
    modifyPasswordEvent,
    emailValue,
    passwordValue,
    confirmPasswordValue,
    newPasswordValue,
    verificationCode,
    changeField,
    loading,
    openModifyPasswordModal,
    openTransactionList,
    transactionListVisible,
    onCloseTransactionList,
    isSendCode,
    time,
    getCode,
    codeLoading,
    validCodeEvent,
    setPasswordEvent,
  } = useHeaderViewHook();

  // const menu = (
  //   <Menu>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
  //         FQA
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //         Discord
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //         Twitter
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //         Reddit
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // );
  const marketplaceRouterPath = PageHistory.location.pathname === '/marketplace';
  const userMenu = (
    <Menu>
      <Menu.Item key={1}>
        <div onClick={openTransactionList}>Transaction List</div>
      </Menu.Item>
      <Menu.Item key={2}>
        <div onClick={openModifyPasswordModal}>Change Password</div>
      </Menu.Item>
      <Menu.Item key={3}>
        <div onClick={logoutEvent}>Logout</div>
      </Menu.Item>
    </Menu>
  );

  const modalTitleArr = ['', 'SING-IN', 'Register for an account', 'Change Password'];
  const modalTitle = (
    <div className="account-modal-title">
      <img className="header-view-logo-modal" src={logo1} alt="USDT" />
      <div className="title">{modalTitleArr[modalState]}</div>
    </div>
  );
  const antLoadingIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;
  const navList = [
    {
      id: 1,
      path: '/home',
      name: 'The island sale',
    },
    {
      id: 2,
      path: '/marketplace',
      name: 'Marketplace',
    },
    // {
    //   id: 3,
    //   path: '/blog',
    //   name: 'Blog',
    // },
  ];
  return (
    <div className="header-view">
      <div className="header-view-container">
        {!marketplaceRouterPath && <img className="header-view-logo" src={logo} alt="USDT" onClick={goHome} />}
        {marketplaceRouterPath && <img className="header-view-logo2" src={logo1} alt="USDT" onClick={goHome} />}
        <img className="header-view-logo1" src={logo1} alt="USDT" onClick={goHome} />
        <div className="header-view-link" style={marketplaceRouterPath ? { marginLeft: 0 } : {}}>
          <ul className="header-view-menu">
            {navList.map(item => {
              return (
                <li key={item.id} onClick={() => goto(item.path)} style={currentPath === item.path ? { color: '#fff' } : {}}>
                  {item.name}
                </li>
              );
            })}
            {/* <li>
              <Dropdown overlay={menu}>
                <span onClick={e => e.preventDefault()}>Community ▼</span>
              </Dropdown>
            </li> */}
          </ul>
          <ul className="header-view-account flex-between">
            {userName && (
              <li className="user-name">
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <div>
                    <UserOutlined /> {userName}
                  </div>
                </Dropdown>
              </li>
            )}
            {!userName && <li onClick={() => login()}>sign-in</li>}
          </ul>
        </div>
        <div className={`header-menu ${active ? 'active' : ''}`} onClick={openMenu}>
          <span></span>
        </div>
        <ul className={`min-menu-list ${active ? 'min-menu-list-active' : ''}`}>
          {navList.map(item => {
            return (
              <li key={item.id} onClick={() => goto(item.path)} style={currentPath === item.path ? { backgroundColor: '#0099cc' } : {}}>
                {item.name}
              </li>
            );
          })}
          {!userName && <li onClick={() => login()}>sign-in</li>}
          {userName && <li onClick={() => openTransactionList()}>Transaction List</li>}
          {userName && <li onClick={() => logoutEvent()}>logout</li>}
        </ul>
      </div>

      <Modal
        title={modalTitle}
        centered
        visible={isModalVisible}
        footer={null}
        closable={false}
        width={360}
        wrapClassName="account-modal"
        onCancel={() => setIsModalVisible(false)}>
        {modalState === 1 && (
          <form className="account-form">
            <div className="input-field deep-blue">
              <img src={email} className="email" alt="email" />
              <Input
                value={emailValue}
                name="emailLogin"
                type="text"
                placeholder="Email Address"
                onChange={e => changeField(e, 'emailValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={passwordValue}
                name="passwordLogin"
                type="password"
                placeholder="Password"
                onChange={e => changeField(e, 'passwordValue')}
              />
            </div>
            <div className="account-remember flex-between form-item-top">
              <Checkbox>Remember me</Checkbox>
              <span className="forgot-pass" onClick={() => changeModal(4)}>
                Forgot pass?
              </span>
            </div>
            <div className="btn form-item-top flex-center">
              {loading && <LoadingOutlined style={{ fontSize: '60px', color: '#3393bb' }} />}
              {!loading && <Button onClick={loginEvent}>Email login</Button>}
            </div>
            <div className="go-to-register flex-center">
              No account?
              <span className="flex-center" onClick={() => changeModal(2)}>
                &nbsp;Create account
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path id="icon_arrowRight" className="cls-1" d="M12.523,27L8,22.752,13.64,16,8,9.247,12.523,5,24,16Z"></path>
                </svg>
              </span>
            </div>
          </form>
        )}

        {modalState === 2 && (
          <form className="account-form">
            <div className="input-field deep-blue">
              <img src={email} className="email" alt="email" />
              <Input
                value={emailValue}
                name="emailLogin"
                type="text"
                placeholder="Email Address"
                onChange={e => changeField(e, 'emailValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={passwordValue}
                name="passwordLogin"
                type="password"
                placeholder="Password"
                onChange={e => changeField(e, 'passwordValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={confirmPasswordValue}
                name="passwordLogin"
                type="password"
                placeholder="Confirm Password"
                onChange={e => changeField(e, 'confirmPasswordValue')}
              />
            </div>
            <div className="btn form-item-top btn-register flex-center">
              {loading && <LoadingOutlined style={{ fontSize: '60px', color: '#3393bb' }} />}
              {!loading && <img src={next} className="next" alt="confirm" onClick={registerEvent} />}
            </div>
            <div className="go-to-register flex-center">
              Have an account?
              <span className="flex-center" onClick={() => changeModal(1)}>
                &nbsp;Sign-in
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path id="icon_arrowRight" className="cls-1" d="M12.523,27L8,22.752,13.64,16,8,9.247,12.523,5,24,16Z"></path>
                </svg>
              </span>
            </div>
          </form>
        )}

        {modalState === 3 && (
          <form className="account-form">
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={passwordValue}
                name="passwordLogin"
                type="password"
                placeholder="Password"
                onChange={e => changeField(e, 'passwordValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={newPasswordValue}
                name="passwordLogin"
                type="password"
                placeholder="New Password"
                onChange={e => changeField(e, 'newPasswordValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={confirmPasswordValue}
                name="passwordLogin"
                type="password"
                placeholder="Confirm Password"
                onChange={e => changeField(e, 'confirmPasswordValue')}
              />
            </div>
            <div className="btn form-item-top btn-register flex-center">
              {loading && <LoadingOutlined style={{ fontSize: '60px', color: '#3393bb' }} />}
              {!loading && <img src={next} className="next" alt="confirm" onClick={modifyPasswordEvent} />}
            </div>
          </form>
        )}

        {modalState === 4 && (
          <form className="account-form">
            <div className="input-field deep-blue">
              <img src={email} className="email" alt="email" />
              <Input
                value={emailValue}
                name="emailLogin"
                type="text"
                placeholder="Email Address"
                onChange={e => changeField(e, 'emailValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={verificationCode}
                name="verificationCode"
                type="text"
                placeholder="Verification Code"
                onChange={e => changeField(e, 'verificationCode')}
              />
              <Spin indicator={antLoadingIcon} spinning={codeLoading}>
                <span className="code-text" onClick={getCode}>
                  {isSendCode ? `${time}s` : 'Send'}
                </span>
              </Spin>
            </div>
            <div className="btn form-item-top btn-register flex-center">
              {loading && <LoadingOutlined style={{ fontSize: '60px', color: '#3393bb' }} />}
              {!loading && <img src={next} className="next" alt="confirm" onClick={validCodeEvent} />}
            </div>
          </form>
        )}

        {modalState === 5 && (
          <form className="account-form">
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={passwordValue}
                name="passwordLogin"
                type="password"
                placeholder="Password"
                onChange={e => changeField(e, 'passwordValue')}
              />
            </div>
            <div className="input-field deep-blue form-item-top">
              <img src={lock} className="lock" alt="lock" />
              <Input
                value={confirmPasswordValue}
                name="passwordLogin"
                type="password"
                placeholder="Confirm Password"
                onChange={e => changeField(e, 'confirmPasswordValue')}
              />
            </div>
            <div className="btn form-item-top btn-register flex-center">
              {loading && <LoadingOutlined style={{ fontSize: '60px', color: '#3393bb' }} />}
              {!loading && <img src={next} className="next" alt="confirm" onClick={setPasswordEvent} />}
            </div>
          </form>
        )}
      </Modal>

      <Drawer
        title="Transaction List"
        width={isPc() ? '70%' : '90%'}
        placement="right"
        onClose={onCloseTransactionList}
        destroyOnClose
        visible={transactionListVisible}>
        <TransactionListView />
      </Drawer>
    </div>
  );
};

const useHeaderViewHook = () => {
  const [userName, setUserName] = useState(localStorageApi.get('userName') || '');
  const [active, setActive] = useState(false);
  const [currentPath, setCurrentPath] = useState(PageHistory.location.pathname);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalState, setModalState] = useState(1); // 1 登录，2 注册 3 修改密码，4 忘记密码获取验证码，5 忘记密码设置密码
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionListVisible, setTransactionListVisible] = useState(false);
  const [time, setTime] = useState(60);
  const [isSendCode, setIsSendCode] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const { getUserAccount } = useAccount();
  const { address } = useStoreApi();

  const openMenu = () => {
    setActive(!active);
  };

  const goto = path => {
    path && setCurrentPath(path);
    active && setActive(!active);
    PageHistory.replace(path);
  };

  const login = () => {
    active && setActive(!active);
    setIsModalVisible(true);
  };

  const goHome = () => {
    PageHistory.replace('/home');
  };

  const changeModal = (val, notRestValue = []) => {
    !notRestValue.includes('emailValue') && setEmailValue('');
    setPasswordValue('');
    setConfirmPasswordValue('');
    setNewPasswordValue('');
    setVerificationCode('');
    setModalState(val);
  };

  const openModifyPasswordModal = () => {
    setIsModalVisible(true);
    changeModal(3);
  };

  const changeField = (e, type) => {
    const updateFieldMap = {
      emailValue: () => {
        setEmailValue(e.target.value);
      },
      passwordValue: () => {
        setPasswordValue(e.target.value);
      },
      confirmPasswordValue: () => {
        setConfirmPasswordValue(e.target.value);
      },
      newPasswordValue: () => {
        setNewPasswordValue(e.target.value);
      },
      verificationCode: () => {
        setVerificationCode(e.target.value);
      },
    };
    updateFieldMap[type]();
  };

  const successTips = description => {
    notification.success({
      message: 'Tips',
      description,
    });
  };

  const resetInfo = () => {
    setUserName('');
    localStorageApi.del('token');
    localStorageApi.del('userName');
  };

  const checkInputParams = () => {
    if (passwordValue !== confirmPasswordValue) {
      message.error('The two passwords entered are inconsistent');
      return false;
    }

    return true;
  };
  const registerEvent = async () => {
    try {
      if (!checkInputParams()) return false;
      setLoading(true);
      const result = await registerApi({ loginName: emailValue, contact: emailValue, password: md5(passwordValue), code: '1234' });
      localStorageApi.set('token', result.user.token);
      localStorageApi.set('userName', result.user.userName);
      setUserName(result.user.userName);
      setIsModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const loginEvent = async () => {
    try {
      setLoading(true);
      const result = await loginApi({ loginName: emailValue, password: md5(passwordValue) });
      localStorageApi.set('token', result.user.token);
      localStorageApi.set('userName', result.user.userName);
      setUserName(result.user.userName);
      setIsModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const logoutEvent = () => {
    Modal.confirm({
      title: 'Tips',
      content: 'Are you sure you want to log out?',
      centered: true,
      onOk: async close => {
        try {
          await logoutApi();
          resetInfo();
          close();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  const modifyPasswordEvent = async () => {
    try {
      setLoading(true);
      await modifyPasswordApi({
        contact: localStorageApi.get('userName'),
        oldPassword: md5(passwordValue),
        password: md5(newPasswordValue),
      });
      successTips('Password changed successfully, please log in again');
      resetInfo();
      setLoading(false);
      changeModal(1);
    } catch (error) {
      setLoading(false);
    }
  };
  const openTransactionList = async () => {
    if (!address) {
      await getUserAccount();
    }

    setTransactionListVisible(true);
  };
  const onCloseTransactionList = () => {
    setTransactionListVisible(false);
  };
  const countdown = () => {
    let _time = time;
    timerIns = setInterval(() => {
      if (_time <= 0) {
        setTime(60);
        setIsSendCode(false);
        timerIns && clearInterval(timerIns);
      } else {
        _time--;
        setTime(_time);
      }
    }, 1000);
  };
  const getCode = async () => {
    try {
      if (!emailValue) {
        notification.error({
          message: 'Tips',
          description: 'Please input the email address',
        });
        return false;
      }
      setCodeLoading(true);
      await getCodeApi({ codeType: 'resetpwd', contact: emailValue });
      successTips('Verification code sent');
      setIsSendCode(true);
      setCodeLoading(false);
      countdown();
    } catch (error) {
      setCodeLoading(false);
      setIsSendCode(false);
    }
  };
  const validCodeEvent = async () => {
    try {
      setLoading(true);
      await validCodeApi({ codeType: 'resetpwd', contact: emailValue, code: verificationCode });
      setLoading(false);
      changeModal(5, ['emailValue']);
    } catch (error) {
      setLoading(false);
    }
  };
  const setPasswordEvent = async () => {
    try {
      if (!checkInputParams()) return false;
      setLoading(true);
      await forgotPasswordApi({ contact: emailValue, password: md5(passwordValue) });
      successTips('Password reset complete');
      setLoading(false);
      changeModal(1);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.dapp.event.on('loginExpired', () => {
      setUserName('');
    });
    window.dapp.event.on('createAccount', () => {
      setIsModalVisible(true);
      changeModal(2);
    });
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      changeModal(1);
    }
  }, [isModalVisible]);
  return {
    userName,
    active,
    currentPath,
    isModalVisible,
    setIsModalVisible,
    modalState,
    openMenu,
    goto,
    login,
    goHome,
    changeModal,
    registerEvent,
    loginEvent,
    logoutEvent,
    modifyPasswordEvent,
    emailValue,
    passwordValue,
    confirmPasswordValue,
    newPasswordValue,
    verificationCode,
    changeField,
    loading,
    openModifyPasswordModal,
    openTransactionList,
    transactionListVisible,
    onCloseTransactionList,
    isSendCode,
    time,
    getCode,
    codeLoading,
    validCodeEvent,
    setPasswordEvent,
  };
};
export default HeaderView;
