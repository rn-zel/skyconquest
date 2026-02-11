import { Sprite, Texture } from 'pixi.js';

export class Enemy {
  sprite: Sprite;
  speed: number;

  constructor(texture: Texture, scale: number, speed: number, x: number, y: number) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(scale);
    this.sprite.position.set(x, y);
    this.speed = speed;
  }
}
