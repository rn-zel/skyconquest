import { Application, Texture } from 'pixi.js';
import { Enemy } from './Enemy';
import { Player } from './Player';

export class EnemyManager {
  enemies: Enemy[] = [];
  app: Application;

  constructor(app: Application) {
    this.app = app;

    const t1 = Texture.from('/assets/enemy.png');
    const t2 = Texture.from('/assets/enemy2.png');

    for (let i = 0; i < 6; i++) this.spawn(t1, 0.3, 2, 5);
    for (let i = 0; i < 4; i++) this.spawn(t2, 0.2, 3, 5);
  }

  spawn(texture: Texture, scale: number, min: number, max: number) {
    const enemy = new Enemy(
      texture,
      scale,
      Math.random() * (max - min) + min,
      Math.random() * this.app.screen.width,
      -Math.random() * 300
    );
    this.app.stage.addChild(enemy.sprite);
    this.enemies.push(enemy);
  }

  update(player: Player): boolean {
    let hitplayer = false;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.sprite.y += enemy.speed;


      // collision player
      const dx = player.sprite.x - enemy.sprite.x;
      const dy = player.sprite.y - enemy.sprite.y;
      const dist = Math.hypot(dx, dy);
      if (dist < (player.sprite.width + enemy.sprite.width) / 3) {
        hitplayer = true;
      }

      // collision bullets
      for (let j = player.bullets.length - 1; j >= 0; j--) {
        const bullet = player.bullets[j];
        const bdx = bullet.sprite.x - enemy.sprite.x;
        const bdy = bullet.sprite.y - enemy.sprite.y;
        const bdist = Math.hypot(bdx, bdy);

        if (bdist < enemy.sprite.width / 2) {
          
          if (enemy.sprite.parent) enemy.sprite.parent.removeChild(enemy.sprite);
          this.enemies.splice(i, 1);

         
          bullet.destroy();
          player.bullets.splice(j, 1);

          player.score +=1;

         
          this.spawn(enemy.sprite.texture, enemy.sprite.scale.x, 2, 5);

          break;
        }
      }
    }

    return hitplayer;
  }

  reset() {

    this.enemies.forEach(e => {
      e.sprite.y = -Math.random() * 300;
      e.sprite.x = Math.random() * this.app.screen.width;
    });
  }
}
