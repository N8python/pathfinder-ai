var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var game = new Phaser.Game(config),
  platforms,
  enemies,
  frames = 1,
  step = 0,
  generations = 1,
  goodPaths = [],
  goalDone = false;

function preload(){
  this.load.image("sky", "sky.png");
  this.load.image("platform", "platform.png");
  this.load.spritesheet('alien',
  'invader32x32x4.png', {
    frameWidth: 32,
    frameHeight: 32
  }
);
}
function create(){
  this.add.image(400, 300, "sky")
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'platform').setScale(2).refreshBody();
  platforms.create(100, 100, "platform");
  platforms.create(300, 300, "platform");
  platforms.create(600, 450, "platform");
  enemies = this.physics.add.group({
    key: "alien",
    repeat: 50,
    setXY: {
      x: 12
    }
  });
  enemies.children.iterate(child => {
    child.paths = []
    child.move = dir => {
      if(dir === 1){
        child.x-=3;
      }
      if(dir === 2){
        child.x+=3;
      }
      child.paths+=dir;
    }
  })
  this.physics.add.collider(enemies, platforms);
}
function update(){
  console.log(step);
  console.log(frames);
  console.log(goodPaths.length)
  frames++;
  step++;
  enemies.children.iterate(child => {
    if (step < goodPaths.length) child.move(Number(goodPaths[step]));
    else child.move(Phaser.Math.Between(1, 2));
    if(child.x > 800){
      goalDone = true;
      console.log(generations)
    }
  })
  if(frames % (1200*generations) === 0 || (frames % 300 === 0 && goalDone)){
    var bestChild = enemies.children.entries[0];
    enemies.children.iterate(child => {
      if(Phaser.Math.Distance.Between(child.x, child.y, 800, 450) <
      Phaser.Math.Distance.Between(bestChild.x, bestChild.y, 800, 450)){
        bestChild = child;
      }
    });
    goodPaths=goodPaths.concat(bestChild.paths.split(''));
    goodPaths=goodPaths.join("").replace(/(12|21)/g, "").split("");
    generations+=1;
    step = 0;
    frames = 1;
    enemies = this.physics.add.group({
      key: "alien",
      repeat: 50,
      setXY: {
        x: 12
      }
    });
    enemies.children.iterate(child => {
      child.paths = []
      child.move = dir => {
        if(dir === 1){
          child.x-=3;
        }
        if(dir === 2){
          child.x+=3;
        }
        child.paths+=dir;
      }
    });
    this.physics.add.collider(enemies, platforms);
  }
}
