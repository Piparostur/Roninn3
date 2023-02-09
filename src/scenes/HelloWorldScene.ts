import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
  private enemy?: Phaser.Physics.Arcade.Sprite;
  private bomb?: Phaser.Physics.Arcade.Group

  private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true); // Disable the star from the world if it is collected

    this.score += 10; // Add 10 points to the score
    this.scoreText?.setText(`SCORE: ${this.score}`); // Ef player nær stjörnum þá updateast þetta um 10 í score
    } 

  private score = 0;  // Score counter
  private scoreText?: Phaser.GameObjects.Text;  // Text object for score

  constructor() {
  super('hello-world');
  }


  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio("music", "assets/BaB.mp3");
    this.load.spritesheet('Ninja_enemy', 'assets/Ninja_enemy.png', { frameWidth: 32, frameHeight: 48 });
}


  create() {
    this.add.image(400, 300, 'sky');

    // ------------------------- SCORE ------------------------

    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {        // Score text
        fontSize: '20px', 
        color: '#000', 
        fontFamily: 'Arial', });

    // ------------------------- TEXT -------------------------

      

    // ------------------------- MUSIC -------------------------
    this.sound.play("music", {loop: true, volume: 0.1});


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

        this.stars.children.iterate (c=> {
          const star = c as Phaser.Physics.Arcade.Image;
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // Stjörnurnar skoppa upp og niður
        });

    //Stjörnurnar fara ekki í gegnum platformana
    this.physics.add.collider(this.stars, this.platforms);

    //uuuuuu... þetta lætur stjörnurnar klessa á hvor aðra og svo slæda þær saman út af mappinu ???
    this.physics.add.collider(this.stars, this.stars);
    

    // ------------------------- PLAYER -------------------------
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
   // this.physics.add.collider(this.player, this.stars); //Þetta er ehv wonky hann er bara að bowla stjörnunum xD //Gæti verið kúl hugmynd af leik haha
    this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);
    this.physics.add.collider(this.player, this.platforms);

    // -------------------  PLAYER ANIMATIONS -------------------
    this.anims.create({

        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //rammi 0-3 í spritesheet
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ], // Rammi 4 í spritesheet
      frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),  //rammi 5-8 í spritesheet
        frameRate: 10,
        repeat: -1
    });

    // --------------------- Ninja Enemy -------------------------
    this.enemy = this.physics.add.sprite(400, 450, 'Ninja_enemy');
    this.enemy.setBounce(0.2);
    this.enemy.setCollideWorldBounds(true);
    this.physics.add.collider(this.enemy, this.platforms);
    if (this.player.x > this.enemy.x) {
        this.enemy.setVelocityX(-160);
    } else {
        this.enemy.setVelocityX(160);
    }

    // -------------- Game Over if player hits enemy --------------
    this.physics.add.collider(this.player, this.enemy, () => {
        //stop music and restart game
        //Mikilvægt að stoppa sound fyrst greinilega því annars byrjar leikurinn að spila lagið aftur 
        //ofan á original playið.
        this.sound.stopAll();

        //Game Over text
        var gameOverText = this.add.text(400, 300, "Game Over", {
            fontFamily: 'gothic',
            fontSize: '64px',
            backgroundColor: '#000000', 
            color: '#FF0000',
            align: 'center',
            fontStyle: 'bold',
          });
        gameOverText.setOrigin(0.5, 0.5);

        // Pause 3 seconds and restart game
        this.time.delayedCall(3000, () => {
            //Restart game
            this.scene.restart();
            console.log("game over");
      });
    });

  



    // ------------------------- CURSORS -------------------------
    this.cursors = this.input.keyboard.createCursorKeys();

    //Bæta við s key til að skjota
    //this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    


    // ------------------------- SHOOTING -------------------------

    //global function to shoot --> þetta virkar ekki
  //   const shoot = () => {
  //       this.bomb = this.physics.add.sprite(this.player.x, this.player.y, 'bomb');
  //       this.bomb.setVelocityX(100);
  //       this.bomb.setVelocityY(100);
  //       this.physics.world.enable(this.bomb);
  //       this.bomb.body.setSize(10, 10);
  //       this.bomb.body.allowGravity(false);
  //       this.physics.add.collider(this.bomb, this.platforms);  
   }


  update() {

    // ------------------------- LEFT ----------------------------------
      if (this.cursors!.left!.isDown) {
      this.player!.setVelocityX(-160); //Hversu hratt á að fara til vinstri
      this.player!.anims.play('left', true); // Spila animation
      // Check if space is pressed and player is touching the ground
      if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
        this.player!.setVelocityY(-250); // Hversu hátt á að hoppa
        this.player!.setVelocityX(-100);// Add additional velocity to the left
      }
  
    // ------------------------- RIGHT ----------------------------------
    } else if (this.cursors!.right!.isDown) {
      this.player!.setVelocityX(160); // Hversu hratt á að fara til hægri 
      this.player!.anims.play('right', true); // Spila animation
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
      this.player!.anims.play('turn');
    }

    // ------------------------- SHOOTING -------------------------
    // bombs from player when preesing s
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)) {
        //shoot(); 
        console.log("Bæng!")
    }


   }
 }  
