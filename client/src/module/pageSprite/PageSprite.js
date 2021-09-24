import { Sprite } from 'pixi.js';

/**
 * 舞台小精灵
 */
export default class PageSprite {
  constructor(texture, options) {
    this.sprite = new Sprite(texture);
    this.options = options;
    this.bindEvent();
  }
  setStyle(options = { x: 0, y: 0, width: 30, height: 30, disabled: false }) {
    const { x, y, width, height, disabled } = options;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = width;
    this.sprite.height = height;
    this.sprite.alpha = disabled ? 0.5 : 1;
  }
  bindEvent() {
    const _this = this;
    this.sprite.interactive = true;
    this.sprite.on('pointerdown', function (e) {
      if (_this.options.placeholder || _this.options.disabled || _this.options.genre === 9) return false;
      window.dapp.event.emit('landPointerdown', _this.options);
    });
    // 交易成功，当前岛屿禁止购买
    window.dapp.event.on('isLandBuySuccess_' + this.options.id, () => {
      this.sprite.alpha = 0.5;
      this.options.disabled = true
    });
  }
}
