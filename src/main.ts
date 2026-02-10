import { AnimatedSprite, Application, Assets, Texture, Sprite, Text, TextStyle } from 'pixi.js';

(async () => {
  const app = new Application({
    autoStart: false,
    resizeTo: window,
    backgroundColor: 0xE6FDFF 
  });

  document.body.appendChild(app.view);

  await Assets.load('https://pixijs.io/examples/examples/assets/spritesheet/fighter.json');

  // Plane frames
  const frames: Texture[] = [];
  for (let i = 0; i < 30; i++) {
    const val = i < 10 ? `0${i}` : i.toString();
    frames.push(Texture.from(`rollSequence00${val}.png`));
  }

  const plane = new AnimatedSprite(frames);
  plane.anchor.set(0.5);
  plane.scale.set(0.5);
  plane.animationSpeed = 0.3;
  plane.x = app.screen.width / 2;
  plane.y = app.screen.height - 100;
  plane.play();
  app.stage.addChild(plane);

  // Key tracking
  const keys: Record<string, boolean> = {};
  window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

  // Clouds
  const cloudCount = 15;
  const clouds: { sprite: Sprite; speed: number }[] = [];
  for (let i = 0; i < cloudCount; i++) {
    const cloudTexture = Texture.from('./src/assets/cloud.png'); 
    const cloud = new Sprite(cloudTexture);
    const scale = Math.random() * 0.02 + 0.02; 
    cloud.scale.set(scale);
    cloud.x = Math.random() * app.screen.width;
    cloud.y = Math.random() * app.screen.height; 
    app.stage.addChild(cloud);
    const speed = Math.random() * 2 + 2;
    clouds.push({ sprite: cloud, speed });
  }

  //type
type Enemy = {
  sprite: Sprite;
  speed: number;
};

//textures
const enemyTexture = Texture.from('./src/assets/enemy.png');
const enemyTexture2 = Texture.from('./src/assets/enemy2.png');

//list
const enemies: Enemy[] = [];

// spawner
function spawnEnemy(
  texture: Texture,
  scale: number,
  minSpeed: number,
  maxSpeed: number
) {
  const enemy = new Sprite(texture);
  enemy.anchor.set(0.5);
  enemy.scale.set(scale);
  enemy.x = Math.random() * app.screen.width;
  enemy.y = -Math.random() * 300;
  app.stage.addChild(enemy);

  const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
  enemies.push({ sprite: enemy, speed });
}


for (let i = 0; i < 6; i++) {
  spawnEnemy(enemyTexture, 0.3, 2, 5);
}

for (let i = 0; i < 4; i++) {
  spawnEnemy(enemyTexture2, 0.45, 3, 6);
}


  const planeSpeed = 12;
  let gameOver = false;

  // Scoring
  let score = 0;
  const scoreText = new Text(`Score: ${score}`, {
    fill: '#000000',
    fontSize: 40,
    fontWeight: 'bold'
  });
  scoreText.x = 20;
  scoreText.y = 20;
  app.stage.addChild(scoreText);

  // Game Over 
  const style = new TextStyle({ fill: '#FF0000', fontSize: 120, fontWeight: 'bold' });
  const gameOverText = new Text('GAME OVER', style);
  gameOverText.anchor.set(0.5);
  gameOverText.x = app.screen.width / 2;
  gameOverText.y = app.screen.height / 2;
  gameOverText.visible = false;

 
  app.stage.addChild(gameOverText);
  app.stage.sortableChildren = true;

  

  // Play Again 
  const buttonStyle = new TextStyle({ fill: '#FFFFFF', fontSize: 50, fontWeight: 'bold', stroke: '#000000', strokeThickness: 5 });
  const playAgainText = new Text('PLAY AGAIN', buttonStyle);
  playAgainText.anchor.set(0.5);
  playAgainText.x = app.screen.width / 2;
  playAgainText.y = app.screen.height / 2 + 120;
  playAgainText.interactive = true;
  playAgainText.buttonMode = true;
  playAgainText.visible = false;
  app.stage.addChild(playAgainText);

  // Reset 
  function resetGame() {
    plane.x = app.screen.width / 2;
    plane.y = app.screen.height - 100;
    enemies.forEach(({ sprite }) => {
      sprite.y = -Math.random() * 300;
      sprite.x = Math.random() * app.screen.width;
    });
    score = 0;
    scoreText.text = `Score: ${score}`;
    gameOver = false;
    gameOverText.visible = false;
    playAgainText.visible = false;
  }

  playAgainText.on('pointerdown', resetGame);

  // Game loop
  app.ticker.add(() => {
    clouds.forEach(({ sprite, speed }) => {
      sprite.x += speed;
      if (sprite.x - sprite.width / 2 > app.screen.width) {
        sprite.x = -sprite.width / 2;
      }
    });

    if (gameOver) {
      gameOverText.visible = true;
      playAgainText.visible = true;
      return;
    }


    if (keys['arrowup'] || keys['w']) plane.y -= planeSpeed;
    if (keys['arrowdown'] || keys['s']) plane.y += planeSpeed;
    if (keys['arrowleft'] || keys['a']) plane.x -= planeSpeed;
    if (keys['arrowright'] || keys['d']) plane.x += planeSpeed;

    plane.x = Math.max(plane.width / 2, Math.min(app.screen.width - plane.width / 2, plane.x));
    plane.y = Math.max(plane.height / 2, Math.min(app.screen.height - plane.height / 2, plane.y));

  // collision
    enemies.forEach(({ sprite, speed }) => {
      sprite.y += speed;

      // Check if passed
      if (sprite.y - sprite.height / 2 > app.screen.height) {
        sprite.y = -sprite.height / 2;
        sprite.x = Math.random() * app.screen.width;
        score += 1; 
        scoreText.text = `Score: ${score}`;
      }

      // Collision
      const dx = plane.x - sprite.x;
      const dy = plane.y - sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (plane.width / 2 + sprite.width / 2)) {
        gameOver = true;
        gameOverText.visible = true;
        playAgainText.visible = true;

      }
    });
  });

  app.start();
})();
