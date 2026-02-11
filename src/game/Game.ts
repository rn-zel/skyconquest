import { Application } from 'pixi.js';
import { Player } from './Player';
import { EnemyManager } from './EnemyManager';
import { Cloud } from './Cloud';
import { Input } from './Input';
import { UI } from './UI';

export class Game {
  app: Application;
  player!: Player;
  enemies!: EnemyManager;
  clouds: Cloud[] = [];
  input: Input;
  ui!: UI;
  gameOver = false;

  constructor() {
    this.app = new Application({
      resizeTo: window,
      backgroundColor: 0xE6FDFF,
    });

    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.input = new Input();
  }

  async start() {

    this.player = new Player(this.app);
    await this.player.init();

    this.enemies = new EnemyManager(this.app);
    this.ui = new UI(this.app);

    for (let i = 0; i < 15; i++) {
      this.clouds.push(new Cloud(this.app));
    }

    this.app.ticker.add(this.update);
  }

  update = () => {
    if (this.gameOver) return;

    this.player.update(this.input);
    this.clouds.forEach(c => c.update());

    if (this.enemies.update(this.player)) {
      this.gameOver = true;
      this.ui.showGameOver(() => this.reset());
    }

    this.ui.updateScore(this.player.score);
  };

  reset() {
    this.gameOver = false;
    this.player.reset();
    this.enemies.reset();
    this.ui.reset();
  }
}
