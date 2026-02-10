import { AnimatedSprite, Application, Assets, Texture, Sprite } from 'pixi.js';

(async () => {
  const app = new Application({
    autoStart: false,
    resizeTo: window,
    backgroundColor: 0xE6FDFF 
  });

  document.body.appendChild(app.view);


  await Assets.load('https://pixijs.io/examples/examples/assets/spritesheet/fighter.json');

  //array frames plane
  const frames: Texture[] = [];
  for (let i = 0; i < 30; i++) {
    const val = i < 10 ? `0${i}` : i.toString();
    frames.push(Texture.from(`rollSequence00${val}.png`));
  }

  const scaling = 0.5;

  const plane = new AnimatedSprite(frames);
  plane.anchor.set(0.5);
  plane.scale.set(scaling);
  plane.animationSpeed = 0.3;
  plane.x = app.screen.width / 2;
  plane.y = app.screen.height / 2;
  plane.play();
  app.stage.addChild(plane);

  // Key tracking
  const keys: Record<string, boolean> = {};
  window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

  
  const cloudCount = 20;
  const clouds: { sprite: Sprite; speed: number }[] = [];

  for (let i = 0; i < cloudCount; i++) {
    const cloudTexture = Texture.from('./src/assets/cloud.png'); 
    const cloud = new Sprite(cloudTexture);

    const scale = Math.random() * 0.05; 
    cloud.scale.set(scale);
    cloud.x = Math.random() * app.screen.width;
    cloud.y = Math.random() * (app.screen.height ); 
    app.stage.addChild(cloud);

    const speed = Math.random() * 2 + 1;
    clouds.push({ sprite: cloud, speed });
  }

  const planeSpeed = 12;

  // Game loop
  app.ticker.add(() => {
    
    if (keys['arrowup'] || keys['w']) plane.y -= planeSpeed;
    if (keys['arrowdown'] || keys['s']) plane.y += planeSpeed;
    if (keys['arrowleft'] || keys['a']) plane.x -= planeSpeed;
    if (keys['arrowright'] || keys['d']) plane.x += planeSpeed;

    
    plane.x = Math.max(plane.width / 2, Math.min(app.screen.width - plane.width / 2, plane.x));
    plane.y = Math.max(plane.height / 2, Math.min(app.screen.height - plane.height / 2, plane.y));

    // clouds
    clouds.forEach(({ sprite, speed }) => {
      sprite.x += speed;
      if (sprite.x - sprite.width / 2 > app.screen.width) {
        sprite.x = -sprite.width / 2; 
      }
    });
  });

  app.start();
})();
