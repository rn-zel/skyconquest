import { AnimatedSprite, Application, Assets, Texture, Graphics } from 'pixi.js';
import { Input } from './Input';
import { Bullet } from './Bullet';




export class Player {
  sprite!: AnimatedSprite;
  speed = 12;
  app: Application;
  bullets: Bullet[] = [];
  shootCooldown = 0; 
  
  score = 0;

  constructor(app: Application) {
    this.app = app;
  }

  async init() {
 
    await Assets.load(
      'https://pixijs.io/examples/examples/assets/spritesheet/fighter.json'
    );

    const frames: Texture[] = [];
    for (let i = 0; i < 30; i++) {
      const v = i < 10 ? `0${i}` : i;
      frames.push(Texture.from(`rollSequence00${v}.png`));
    }

    this.sprite = new AnimatedSprite(frames);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.5);
    this.sprite.animationSpeed = 0.3;
    this.reset();
    this.sprite.play();

    this.app.stage.addChild(this.sprite);
  }

  update(input: Input) {
    if (!this.sprite) return;

    //  movement
    if (input.isDown('w') || input.isDown('arrowup')) this.sprite.y -= this.speed;
    if (input.isDown('s') || input.isDown('arrowdown')) this.sprite.y += this.speed;
    if (input.isDown('a') || input.isDown('arrowleft')) this.sprite.x -= this.speed;
    if (input.isDown('d') || input.isDown('arrowright')) this.sprite.x += this.speed;

 
    this.sprite.x = Math.max(
      this.sprite.width / 2,
      Math.min(this.app.screen.width - this.sprite.width / 2, this.sprite.x)
    );
    this.sprite.y = Math.max(
      this.sprite.height / 2,
      Math.min(this.app.screen.height - this.sprite.height / 2, this.sprite.y)
    );

    //  shooting
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = 12; 
    }

    // bullets upd
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();

  
      if (bullet.sprite.y < -10) {
        bullet.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  shoot() {
    const bullet = new Bullet(
      this.app,
      this.sprite.x,
      this.sprite.y - this.sprite.height / 2,
      6,   
      15,  
      0xff0000 
    );
    this.bullets.push(bullet);
  }
  

  reset() {
    if (!this.sprite) return;
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height - 100;

    
    this.bullets.forEach(b => b.destroy());
    this.bullets = [];

    this.score = 0;
  }
}
