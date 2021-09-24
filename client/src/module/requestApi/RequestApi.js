import Http from '../http/Http';
const httpIns = new Http();

// 注册
export const registerApi = (params = {}) => httpIns.post('/api/v1/userfront/register', params);

// 获取用户信息
export const getUserInfoApi = () => httpIns.post('/api/v1/userfront/user-info');

// 登录
export const loginApi = (params = {}) => httpIns.post('/api/v1/userfront/login', params);

// 登出
export const logoutApi = (params = {}) => httpIns.post('/api/v1/userfront/logout', params);

// 价格列表
export const priceListApi = (params = {}) => httpIns.post('/api/v1/config/price-list', params);

// 岛屿信息
export const islandListApi = (params = {}) => httpIns.post('/api/v1/island/list', params);

// 下订单
export const orderCheckApi = (params = {}) => httpIns.post('/api/v1/order/check', params);

// 订单确认
export const orderConfirmApi = (params = {}) => httpIns.post('/api/v1/order/confirm', params);

// 交易失败更新数据
export const orderFailApi = (params = {}) => httpIns.post('/api/v1/order/fail', params);

// 修改密码
export const modifyPasswordApi = (params = {}) => httpIns.post('/api/v1/userfront/set-pwd', params);

// 忘记密码
export const forgotPasswordApi = (params = {}) => httpIns.post('/api/v1/userfront/reset-pwd', params);

// 获取验证码
export const getCodeApi = (params = {}) => httpIns.post('/api/v1/userfront/get-code', params);

// 验证验证码
export const validCodeApi = (params = {}) => httpIns.post('/api/v1/userfront/valid-code', params);

// 商城列表
export const priceTypeListApi = (params = {}) => httpIns.post('/api/v1/config/price-type-list', params);

// 购买列表
export const payedListApi = (params = {}) => httpIns.post('/api/v1/order/payed-list', params);

// 授权记录
export const approveApi = (params = {}) => httpIns.post('/api/v1/order/approve', params);

