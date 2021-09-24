import { Application, Container } from 'pixi.js';
import PageSprite from '@/module/pageSprite/PageSprite';
import { PageMapBgMap, mapCoordinate } from './PageMap.config';

const plotSpacing = 22;
const blockWidth = 5 * 4;
const blockHeight = 5 * 4;

/**
 * 页面地图类
 */
export default class PageMap {
  constructor(el, options = {}) {
    const DEFAULT_OPTIONS = {
      backgroundColor: 987674, //0x1c2d38,
      width: 5120,
      height: 2880,
      autoDensity: true,
      resolution: 1,
    };
    this.options = options;
    this.el = el;
    this.app = new Application({ ...DEFAULT_OPTIONS, ...options });
    this.rootContainer = new Container();
    this.addChild();
    this.loader();
    this.bindEvent();
  }
  addChild() {
    this.app.stage.addChild(this.rootContainer);
    this.el.appendChild(this.app.view);
  }
  loader() {
    const _this = this;
    this.app.loader
      .add('unknown', require('../../assets/images/unknown_island.png'))
      .add('default', require('../../assets/images/island_bg.png'))
      .add('small', require('../../assets/images/small_island_.png'))
      .add('medium_1', require('../../assets/images/medium_island_1.png'))
      .add('medium_2', require('../../assets/images/medium_island_2.png'))
      .add('medium_3', require('../../assets/images/medium_island_3.png'))
      .add('medium_4', require('../../assets/images/medium_island_4.png'))
      .add('large_1', require('../../assets/images/large_island_1.png'))
      .add('large_2', require('../../assets/images/large_island_2.png'))
      .add('large_3', require('../../assets/images/large_island_3.png'))
      .add('large_4', require('../../assets/images/large_island_4.png'))
      .add('large_5', require('../../assets/images/large_island_5.png'))
      .add('large_6', require('../../assets/images/large_island_6.png'))
      .add('large_7', require('../../assets/images/large_island_7.png'))
      .add('large_8', require('../../assets/images/large_island_8.png'))
      .add('large_9', require('../../assets/images/large_island_9.png'))
      .load((loader, resources) => {
        const createItem = (childItem, flag) => {
          let type,
            texture = resources.default.texture;

          if (flag) {
            type = PageMapBgMap.get(childItem.genre);
            if (['large', 'medium'].includes(type)) {
              texture = resources[`${type}_${childItem.iconIndex}`].texture;
            } else {
              texture = resources[type].texture;
            }
          }

          const spriteIns = new PageSprite(texture, {
            id: childItem.id,
            type: type,
            x: childItem.x,
            y: childItem.y,
            genre: childItem.genre,
            location: childItem.location,
            disabled: childItem.payed === 1, // 1表示已购买
            placeholder: !flag,
          });
          spriteIns.setStyle({
            x: childItem.newx * plotSpacing,
            y: childItem.newy * plotSpacing,
            width: blockWidth,
            height: blockHeight,
            disabled: childItem.payed === 1,
          });
          _this.rootContainer.addChild(spriteIns.sprite);
        };

        const coordinate = mapCoordinate(this.options.w, this.options.h);
        coordinate.forEach(item => {
          const newItem = this.options.jsonData[`${item.x}_${item.y}`];
          if (newItem) {
            createItem(newItem, true);
          } else {
            createItem({ ...item, ...{ newx: item.x, newy: item.y } });
          }
        });
      });
  }
  bindEvent() {
    const _this = this;
    let dragFlag = false;
    let startPoint = {};
    const $$map = document.getElementById('map');
    const clientRects = $$map && $$map.getClientRects()[0];

    this.el.addEventListener('mousedown', function (e) {
      dragFlag = true;
      startPoint = { x: e.x, y: e.y };
    });

    this.el.addEventListener('mousemove', function (e) {
      if (dragFlag) {
        window.dapp.event.emit('cancelShopcar');
        const dx = e.x - startPoint.x;
        const dy = e.y - startPoint.y;
        const oldx = _this.rootContainer.position.x;
        const oldy = _this.rootContainer.position.y;
        const limitValuex = _this.options.w * 22 - clientRects.width + 27;
        const limitValuey = _this.options.h * 22 - clientRects.height + 74;

        if (oldx + dx <= 5 && Math.abs(oldx + dx) < limitValuex) _this.rootContainer.position.x += dx;
        if (oldy + dy <= 5 && Math.abs(oldy + dy) < limitValuey) _this.rootContainer.position.y += dy;

        startPoint = { x: e.x, y: e.y };
      }
    });

    this.el.addEventListener('mouseup', function () {
      dragFlag = false;
    });
  }
}
