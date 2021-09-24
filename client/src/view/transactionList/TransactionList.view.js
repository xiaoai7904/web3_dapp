/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { payedListApi } from '@/module/requestApi/RequestApi';
import { Table } from 'antd';
import useStoreApi from '@/hooks/useStoreApi';
import { shipMap, islandsMap, isLandsDistributedInfo } from '@/module/pageMap/PageMap.config';
import { localStorageApi } from '@/store';
import { getChianName } from '@/module/utils/Utils';

import './TransactionList.style.less';

const colorMap = {
  0: 'black',
  1: 'wood',
  2: 'white',
  3: 'red'
}

// 交易记录
export const TransactionListView = () => {
  const { isLandColumns, shipColumns, isLandTableLoading, shipTableLoading, isLandDataSource, shipDataSource } = useTransactionListHook();
  return (
    <div>
      <h2>IsLand</h2>
      <Table
        columns={isLandColumns}
        size="small"
        pagination={false}
        bordered
        loading={isLandTableLoading}
        dataSource={isLandDataSource}></Table>
      <h2>Ship</h2>
      <Table columns={shipColumns} size="small" pagination={false} bordered loading={shipTableLoading} dataSource={shipDataSource}></Table>
    </div>
  );
};

const useTransactionListHook = () => {
  const { address } = useStoreApi();

  const [isLandTableLoading, setIsLandTableLoading] = useState(false);
  const [isLandDataSource, setIsLandDataSource] = useState([]);

  const [shipTableLoading, setShipTableLoading] = useState(false);
  const [shipDataSource, setShipDataSource] = useState([]);

  const isLandColumns = [
    {
      title: 'Location',
      dataIndex: 'location',
      align: 'center',
      render(location) {
        const item = isLandsDistributedInfo.find(item => +item.key === +location);
        return <span>{item ? item.name : '--'}</span>;
      },
    },
    {
      title: 'Type',
      dataIndex: 'genre',
      align: 'center',
      render(genre) {
        const item = islandsMap.get(genre);
        return <span>{item || '--'}</span>;
      },
    },
    {
      title: 'Coordinate',
      dataIndex: 'coordinate',
      align: 'center',
      render(coordinate, record) {
        return (
          <span>
            {record.x},{record.y}
          </span>
        );
      },
    },
    {
      title: 'Creation Time',
      dataIndex: 'createTime',
      align: 'center',
      render(createTime) {
        return (
          <div className="transaction-table-td">
            <span style={{ display: 'block', width: '180px' }}>{createTime.replace(/T/g, ' ')}</span>
          </div>
        );
      },
    },
  ];

  const shipColumns = [
    {
      title: 'Type',
      dataIndex: 'genre',
      align: 'center',
      render(genre) {
        const item = shipMap.get(genre);
        return <span>{item ? item.name : '--'}</span>;
      },
    },
    {
      title: 'Defense',
      dataIndex: 'blood',
      align: 'center',
    },
    {
      title: 'Attack',
      dataIndex: 'power',
      align: 'center',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      align: 'center',
      render(color) {
        return <span>{colorMap[color]}</span>
      }
    },
    {
      title: 'Creation Time',
      dataIndex: 'createTime',
      align: 'center',
      render(createTime) {
        return (
          <div className="transaction-table-td">
            <span style={{ display: 'block', width: '180px' }}>{createTime.replace(/T/g, ' ')}</span>
          </div>
        );
      },
    },
  ];

  const requestIsLandList = async () => {
    try {
      const chainName = getChianName(localStorageApi.get('chainId'));
      setIsLandTableLoading(true);
      const result = await payedListApi({ type: 1, address: address, chainName });
      setIsLandDataSource(result.list);
      setIsLandTableLoading(false);
    } catch (error) {
      setIsLandTableLoading(false);
    }
  };

  const requestShipList = async () => {
    try {
      const chainName = getChianName(localStorageApi.get('chainId'));
      setShipTableLoading(true);
      const result = await payedListApi({ type: 2, address: address, chainName });
      setShipDataSource(result.list);
      setShipTableLoading(false);
    } catch (error) {
      setShipTableLoading(false);
    }
  };

  useEffect(() => {
    if (!isLandDataSource.length) requestIsLandList();
    if (!shipDataSource.length) requestShipList();
  }, []);

  return { isLandTableLoading, isLandDataSource, shipTableLoading, shipDataSource, isLandColumns, shipColumns };
};

export default TransactionListView;
