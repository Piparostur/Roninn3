import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('hello-world');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.add.image(400, 300, 'sky');

    // Add platforms
    this.platforms = this.physics.add.staticGroup({
        key: 'ground',
        repeat: 11,
        setXY: { x: 150, y: 550, stepX: 70 },
      });

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Set up cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.platforms);
  }

  update() {
    if (this.cursors!.left!.isDown) {
      this.player!.setVelocityX(-160);
    } else if (this.cursors!.right!.isDown) {
      this.player!.setVelocityX(160);
      //jump on space but only if touching the ground
    } else if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
        this.player!.setVelocityY(-330);
    } else {
      this.player!.setVelocityX(0);
    }
  }
}
