import { Application, Graphics } from 'pixi.js';

export class Bullet {
  sprite: Graphics;
  speed = 10;

  constructor(app: Application, x: number, y: number, width = 5, height = 15, color = 0xffffff) {
 
    this.sprite = new Graphics();
    this.sprite.beginFill(color);
    this.sprite.drawRect(-width / 2, -height / 2, width, height); 
    this.sprite.endFill();

    this.sprite.position.set(x, y);
    app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.y -= this.speed;
  }

  destroy() {
    if (this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
  }
}
