// 地图块背景映射表
export const PageMapBgMap = new Map([
  [3, 'large'],
  [2, 'medium'],
  [1, 'small'],
  [9, 'unknown'],
]);

// 岛屿名称映射表
export const islandsMap = new Map([
  [3, 'Large island'],
  [2, 'Medium island'],
  [1, 'Small island'],
  [9, 'Unknown island'],
]);

// 岛屿对应价格SEA
export const isLandsPriceMap = new Map([
  ['large', 10000],
  ['medium', 1000],
  ['small', 100],
  ['unknown', 100],
]);

// 岛屿地图地理位置信息
export const isLandsDistributedInfo = [
  {
    // 大西洋
    id: 'atlantic',
    key: '2',
    name: 'Atlantic',
    bg: require('../../assets/images/atlantic_ocean.png'),
    w: 256,
    h: 144
  },
  {
    // 北冰洋
    id: 'arctic',
    key: '1',
    name: 'Arctic',
    bg: require('../../assets/images/arctic_ocean.png'),
    w: 48,
    h: 32
  },

  {
    // 印度洋
    id: 'indian',
    key: '3',
    name: 'Indian',
    bg: require('../../assets/images/indian_ocean.png'),
    w: 240,
    h: 128
  },
  {
    // 太平洋
    id: 'pacific',
    key: '4',
    name: 'Pacific',
    bg: require('../../assets/images/pacific_ocean.png'),
    w: 512,
    h: 288
  },
];

const unknownIcon = require('../../assets/images/unknown_island.png');
const mediumIcon = require('../../assets/images/medium_island.png');
const smallIcon = require('../../assets/images/small_island_.png');
const largeIcon = require('../../assets/images/large_island.png');

export const mapLegend = [
  {
    id: 1,
    icon: smallIcon,
    name: 'Small island',
  },
  {
    id: 2,
    icon: mediumIcon,
    name: 'Medium island',
  },
  {
    id: 3,
    icon: largeIcon,
    name: 'Large island',
  },
  {
    id: 9,
    icon: unknownIcon,
    name: 'Unknown island',
  },
];

export const shipMap = new Map([
  [1, { name: 'Gunboat', defense: '100～150', attack: '10～30' }],
  [2, { name: 'Vertical sailing boat', defense: '200～400', attack: '50~80' }],
  [3, { name: 'Yacht', defense: '800～1500', attack: '120～300' }],
  [4, { name: 'Frigate', defense: '2500～4000', attack: '500～1000' }],
]);

const createMap = (w,h) => {
  let data = [];
  for (let i = 0; i <= w; i++) {
    for (let j = 0; j <= h; j++) {
      data.push({
        id: `${i}_${j}`,
        x: i,
        y: j,
      });
    }
  }
  return data;
};

export const mapCoordinate = createMap;
