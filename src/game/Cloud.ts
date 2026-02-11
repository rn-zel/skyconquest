import { Application, Sprite } from 'pixi.js';

export class Cloud {
  sprite: Sprite;
  speed: number;
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.sprite = Sprite.from('/assets/cloud.png');

    const scale = Math.random() * 0.02 + 0.02;
    this.sprite.scale.set(scale);
    this.sprite.x = Math.random() * app.screen.width;
    this.sprite.y = Math.random() * app.screen.height;

    this.speed = Math.random() * 2 + 2;
    app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.x += this.speed;
    if (this.sprite.x > this.app.screen.width) {
      this.sprite.x = -this.sprite.width;
    }
  }
}
