import React, { useReducer, useContext, createContext } from 'react';
import { uniqBy, concat, filter, isNumber } from 'lodash';
export const StoreContext = createContext();
const initialState = {
  message: '',
  balance: 0,
  address: null,
  isLandShopCar: [],
  otherShopCar: [],
  seaBalance: 0,
  isLandPrice: [],
  chainName: 'eth',
  mainNetWork: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'NEW-ADDRESS':
      return {
        ...state,
        address: action.address,
        message: action.message,
      };
    case 'SET-BALANCE':
      return {
        ...state,
        balance: action.balance,
      };
    case 'SET-ISLAND-SHOPCAR':
      if (!action.isLandShopCar) {
        return {
          ...state,
          isLandShopCar: [],
        };
      }
      if (isNumber(action.isLandShopCar)) {
        return {
          ...state,
          isLandShopCar: filter(state.isLandShopCar, item => item.id !== action.isLandShopCar),
        };
      }
      return {
        ...state,
        isLandShopCar: uniqBy(concat(state.isLandShopCar, [action.isLandShopCar]), 'id'),
      };
    case 'SET-OTHER-SHOPCAR':
      if (!action.otherShopCar) {
        return {
          ...state,
          otherShopCar: [],
        };
      }
      if (isNumber(action.otherShopCar)) {
        return {
          ...state,
          otherShopCar: filter(state.otherShopCar, item => item.id !== action.otherShopCar),
        };
      }
      return {
        ...state,
        otherShopCar: uniqBy(concat(state.otherShopCar, [action.otherShopCar]), 'id'),
      };
    case 'SET-SEA-BAKANCE':
      return {
        ...state,
        seaBalance: action.seaBalance,
      };
    case 'SET-ISLAND-PRICE':
      return {
        ...state,
        isLandPrice: action.isLandPrice,
      };
    case 'SET-CHAIN-NAME':
      return {
        ...state,
        chainName: action.chainName,
      };
    case 'SET-MAIN-NET-WORK':
      return {
        ...state,
        mainNetWork: action.mainNetWork,
      };
    default:
      throw new Error(`Unknown type of action: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export const localStorageApi = {
  set(name, value) {
    localStorage.setItem(name, value);
  },
  get(name) {
    return localStorage.getItem(name);
  },
  del(name) {
    localStorage.removeItem(name);
  },
};

export default StoreContext;
