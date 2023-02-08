import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
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

    // ------------------------- PLATFORMS -------------------------
    this.platforms = this.physics.add.staticGroup({
        key: 'ground',
        repeat: 11,
        setXY: { x: 150, y: 550, stepX: 70 },
      });

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
    

    // ------------------------- STARS -------------------------
    this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
        });
    
    //Stjörnurnar fara ekki í gegnum platformana
    this.physics.add.collider(this.stars, this.platforms);

    //uuuuuu... þetta lætur stjörnurnar klessa á hvor aðra og svo slæda þær saman út af mappinu ???
    this.physics.add.collider(this.stars, this.stars);
    

    // ------------------------- PLAYER -------------------------
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.stars); //Þetta er ehv wonky hann er bara að bowla stjörnunum xD
    this.physics.add.collider(this.player, this.platforms);


    // ------------------------- CURSORS -------------------------
    this.cursors = this.input.keyboard.createCursorKeys();

      
  }

  update() {

    // ------------------------- LEFT ----------------------------------
      if (this.cursors!.left!.isDown) {
      this.player!.setVelocityX(-160); //Hversu hratt á að fara til vinstri
      // Check if space is pressed and player is touching the ground
      if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
        this.player!.setVelocityY(-250); // Hversu hátt á að hoppa
        this.player!.setVelocityX(-100); // Add additional velocity to the left
      }
  
    // ------------------------- RIGHT ----------------------------------
    } else if (this.cursors!.right!.isDown) {
      this.player!.setVelocityX(160); // Hversu hratt á að fara til hægri 
      // Tvö skilyrði fyrir hoppi þ.e. þú þarft að ýta á space og þú þarft að vera á jörðinni
      if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
        this.player!.setVelocityY(-250); // Hversu hátt á að hoppa 
        this.player!.setVelocityX(100); // Hvesu  mikið velocity þegar þú hoppar á ferð (hægri)
      }

    // ------------------------- STATIONARY JUMP -------------------------
    } else if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
      this.player!.setVelocityY(-250);
    } else {
      this.player!.setVelocityX(0);
    }
  }
}  
