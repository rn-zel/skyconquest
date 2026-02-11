import { Application, Text, TextStyle } from 'pixi.js';

export class UI {
  score = 0;
  scoreText: Text;
  gameOverText: Text;
  playAgainText: Text;

  constructor(app: Application) {
    this.scoreText = new Text('Score: 0', { fill: '#000', fontSize: 40 });
    this.scoreText.position.set(20);
    app.stage.addChild(this.scoreText);

 


    this.gameOverText = new Text('GAME OVER', {
      fill: '#FF0000',
      fontSize: 120,
      fontWeight: 'bold'
    });
    this.gameOverText.anchor.set(0.5);
    this.gameOverText.position.set(app.screen.width / 2, app.screen.height / 2);
    this.gameOverText.visible = false;
    app.stage.addChild(this.gameOverText);

    this.playAgainText = new Text('PLAY AGAIN', {
      fill: '#fff',
      fontSize: 50,
      stroke: '#000',
      strokeThickness: 5
    });
    this.playAgainText.anchor.set(0.5);
    this.playAgainText.position.set(app.screen.width / 2, app.screen.height / 2 + 120);
    this.playAgainText.eventMode = 'static';
    this.playAgainText.cursor = 'pointer';
    this.playAgainText.visible = false;
    app.stage.addChild(this.playAgainText);
  }

  updateScore(score: number) {
    this.scoreText.text = `Score: ${score}`;
    }

  showGameOver(onRestart: () => void) {
    this.gameOverText.visible = true;
    this.playAgainText.visible = true;
    this.playAgainText.once('pointerdown', onRestart);
  }

  reset() {
    this.updateScore(0);
    this.gameOverText.visible = false;
    this.playAgainText.visible = false;
  }
}
