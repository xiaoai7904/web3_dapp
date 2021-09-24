import React, { useState } from 'react';
import useStoreApi from '@/hooks/useStoreApi';
import PageMap from '@/module/pageMap/PageMap';
import { isLandsDistributedInfo, mapLegend } from '@/module/pageMap/PageMap.config';
import { Row, Col, Image, Breadcrumb, Spin } from 'antd';
import { islandListApi } from '@/module/requestApi/RequestApi';
import { isPc, getChianName } from '@/module/utils/Utils';
import { localStorageApi } from '@/store';
import './MapPage.style.less';

export const MapPage = () => {
  const { currentMap, mapName, loading, gotoMap, back } = useMapPageHook();
  const { mainNetWork } = useStoreApi();
  const isMainNetWork = mainNetWork === 1;
  
  const renderPage = () => {
    if (isMainNetWork) {
      return (
        <>
          {!currentMap && (
            <Row gutter={20} className="map-page-row">
              {isLandsDistributedInfo.map(item => {
                return (
                  <Col xs={12} sm={12} md={8} lg={12} xl={6} xxl={6} onClick={() => gotoMap(item)} key={item.id}>
                    <Image width="100%" src={item.bg} preview={false} />
                    <div className="map-page-title">{item.name}</div>
                  </Col>
                );
              })}
            </Row>
          )}

          {currentMap && !isPc() && <div className="map-page-mobile-tips flex-center">Sorry,this is not supported on mobile.</div>}
          {currentMap && isPc() && (
            <Spin spinning={loading} size="large">
              <div className="map-page-wrap">
                <div id="map" className="map-page"></div>
                <div className="map-page-legend flex-between">
                  {mapLegend.map(item => {
                    return (
                      <div key={item.id} className="map-page-legend-item flex-between">
                        <Image width="20px" src={item.icon} preview={false} />
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Spin>
          )}
        </>
      );
    }

    return <div className="map-page-main-net-tips flex-center">Sorry,Please change to Mainnet network.</div>;
  };
  return (
    <div className="map-page-containter">
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={back}>Home</Breadcrumb.Item>
        <Breadcrumb.Item>{mapName}</Breadcrumb.Item>
      </Breadcrumb>
      {renderPage()}
    </div>
  );
};

const useMapPageHook = () => {
  const [currentMap, setCurrentMap] = useState('');
  const [mapName, setMapName] = useState('');
  const [loading, setLoading] = useState(false);

  const gotoMap = item => {
    setMapName(item.name);
    setCurrentMap(item.id);
    const chainName = getChianName(localStorageApi.get('chainId'));
    if (isPc()) {
      requestMapJson({ location: item.key, chainName }, { name: item.id, w: item.w, h: item.h });
    }
  };

  const back = () => {
    setCurrentMap('');
    setMapName('');
  };

  const handlerIsLandList = data => {
    let isLandObj = {};
    let newIsLand = [];
    data.forEach(item => {
      // 中型岛屿
      if (item.genre === 2) {
        item = Object.assign({}, item, { newx: item.x, newy: item.y, iconIndex: 1 });
        const newData1 = Object.assign({}, item, { newx: item.x + 1, newy: item.y, iconIndex: 2 });
        const newData2 = Object.assign({}, item, { newx: item.x, newy: item.y + 1, iconIndex: 3 });
        const newData3 = Object.assign({}, item, { newx: item.x + 1, newy: item.y + 1, iconIndex: 4 });

        newIsLand.push(newData1);
        newIsLand.push(newData2);
        newIsLand.push(newData3);

        isLandObj[`${item.x + 1}_${item.y}`] = newData1;
        isLandObj[`${item.x}_${item.y + 1}`] = newData2;
        isLandObj[`${item.x + 1}_${item.y + 1}`] = newData3;
      } else if (item.genre === 3) {
        item = Object.assign({}, item, { newx: item.x, newy: item.y, iconIndex: 1 });
        const newData1 = Object.assign({}, item, { newx: item.x + 1, newy: item.y, iconIndex: 2 });
        const newData2 = Object.assign({}, item, { newx: item.x, newy: item.y + 1, iconIndex: 4 });
        const newData3 = Object.assign({}, item, { newx: item.x + 2, newy: item.y, iconIndex: 3 });
        const newData4 = Object.assign({}, item, { newx: item.x, newy: item.y + 2, iconIndex: 7 });
        const newData5 = Object.assign({}, item, { newx: item.x + 1, newy: item.y + 1, iconIndex: 5 });
        const newData6 = Object.assign({}, item, { newx: item.x + 1, newy: item.y + 2, iconIndex: 8 });
        const newData7 = Object.assign({}, item, { newx: item.x + 2, newy: item.y + 1, iconIndex: 6 });
        const newData8 = Object.assign({}, item, { newx: item.x + 2, newy: item.y + 2, iconIndex: 9 });

        newIsLand.push(newData1);
        newIsLand.push(newData2);

        newIsLand.push(newData3);
        newIsLand.push(newData4);

        newIsLand.push(newData5);
        newIsLand.push(newData6);

        newIsLand.push(newData7);
        newIsLand.push(newData8);

        isLandObj[`${item.x + 1}_${item.y}`] = newData1;
        isLandObj[`${item.x}_${item.y + 1}`] = newData2;
        isLandObj[`${item.x + 2}_${item.y}`] = newData3;
        isLandObj[`${item.x}_${item.y + 2}`] = newData4;
        isLandObj[`${item.x + 1}_${item.y + 1}`] = newData5;
        isLandObj[`${item.x + 1}_${item.y + 2}`] = newData6;
        isLandObj[`${item.x + 2}_${item.y + 1}`] = newData7;
        isLandObj[`${item.x + 2}_${item.y + 2}`] = newData8;
      } else {
        item = Object.assign({}, item, { newx: item.x, newy: item.y });
      }

      const key = `${item.x}_${item.y}`;
      if (!isLandObj[key]) {
        isLandObj[key] = {};
      }
      isLandObj[key] = Object.assign({}, item);
    });

    return isLandObj;
  };

  const requestMapJson = async (params, pageMapOptions) => {
    try {
      setLoading(true);
      const result = await islandListApi(params);
      new PageMap(document.getElementById('map'), Object.assign({ jsonData: handlerIsLandList(result.list) }, pageMapOptions));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   currentMap && new PageMap(document.getElementById('map'), { name: '', jsonData: [] });
  // }, [currentMap]);

  return { currentMap, mapName, loading, gotoMap, back };
};
export default MapPage;
