/**
 * 请求工具
 */
import axios from 'axios';
import { message } from 'antd';
import { localStorageApi } from '@/store';
// let isExpired = false;
let httpIns;
export default class Http {
  constructor() {
    if (httpIns) return httpIns;
    this.$http = axios.create({});
    this.init();
    httpIns = this;
  }
  init() {
    this._defaultsConfig();
    this._interceptRequest();
    this._interceptResponse();
  }
  _defaultsConfig() {
    // this.$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    // this.$http.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
    this.$http.defaults.responseType = 'json';
    this.$http.defaults.validateStatus = function () {
      return true;
    };
  }
  _interceptRequest() {
    this.$http.interceptors.request.use(
      config => {
        const token = localStorageApi.get('token');
        if (token) {
          config.headers.token = token; //请求头加上token
        }
        return config;
      },
      error => Promise.reject(error)
    );
  }
  _interceptResponse() {
    this.$http.interceptors.response.use(
      response => {
        if (response.status === 200 && response.data && response.data.code === 0) {
          return Promise.resolve(response.data.data);
        }
        if (response.data && (response.data.code === 20006 || response.data.code === 10003)) {
          message.error('Login has expired, please log in again');
          // PageHistory.replace('/login');
          localStorageApi.del('token');
          localStorageApi.del('userName');
          window.dapp.event.emit('loginExpired')
          return Promise.reject(response);
        }

        if (response.data && response.data.code) {
          message.error(response.data.msg);
          return Promise.reject(response.data);
        }
        if (response.data && response.data.status) {
          message.error('Data acquisition failed');
          return Promise.reject(response.data);
        }
        if (!response.data) {
          message.error('Data acquisition failed');
          return Promise.reject(response.data);
        }
        message.error('Data acquisition failed');
        return Promise.reject(response.data);
      },
      error => {
        message.error('Data acquisition failed');
        return Promise.reject(error);
      }
    );
  }
  get(url, params) {
    return this.$http.get(url, params);
  }
  post(url, params) {
    return this.$http.post(url, params);
  }
}
