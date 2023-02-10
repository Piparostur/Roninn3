import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
  private enemy?: Phaser.Physics.Arcade.Sprite;
  private bombs?: Phaser.Physics.Arcade.Group

  private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true); // Disable the star from the world if it is collected
    this.score += 10; // Add 10 points to the score
    this.scoreText?.setText(`SCORE: ${this.score}`); // Ef player nær stjörnum þá updateast þetta um 10 í score

    if (this.stars?.countActive(true) === 0) { // Ef það eru engar stjörnur eftir þá spawnast nýjar (og ein bomba hér fyrir neðan)
      this.stars.children.iterate(c => {
        const star = c as Phaser.Physics.Arcade.Image;

        star.enableBody(true, star.x, 0, true, true)});

        const x = (player as Phaser.Physics.Arcade.Sprite).x < 400 
        ? Phaser.Math.Between(400, 800) 
        : Phaser.Math.Between(0, 400); // Spawnar bombu á random stað á x ásnum

      const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(x, 16, 'bomb'); // Spawnar bombu
      bomb?.setBounce(1); // Bomban skoppa upp og niður
      bomb?.setCollideWorldBounds(true); // Bomban getur ekki farið út af mappinu
      bomb?.setVelocity(Phaser.Math.Between(-200, 200), 20); // Bomban fer á random átt á x ásnum og niður á y ásnum

      }



  } 

  private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject){
    this.physics.pause(); // Stop the game
    this.sound.stopAll(); // Stop the music
    this.sound.play('game_over'); // Play the game over sound
    this.player?.setTint(0xff0000); // Turn the player red
    this.player?.anims.play('turn'); // Play the turn animation
    var gameOverText = this.add.text(400, 300, "GAME OVER\nYour Score: " + this.score, {
      fontFamily: 'gothic',
      fontSize: '64px',
      backgroundColor: '#000000', 
      color: '#FF0000',
      align: 'center',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5, 0.5);
    this.time.delayedCall(3000, () => {
      //Restart game
      this.score = 0;
      this.scene.restart();
      console.log("game over");
});
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
    this.load.audio("game_over", "assets/game_over.wav")
    this.load.spritesheet('Ninja_enemy', 'assets/Ninja_enemy.png', { frameWidth: 32, frameHeight: 48 })
    this.load.spritesheet('Roninn', 'assets/Roninn.png', { frameWidth: 35, frameHeight: 56});
}


  create() {
    this.add.image(400, 300, 'sky');

    // ------------------------- SCORE ------------------------

    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {        // Score text
        fontSize: '20px', 
        color: '#000', 
        fontFamily: 'Arial', 
      });
    
    // ---------------------- HEALTH --------------------------
    

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
    this.player = this.physics.add.sprite(100, 450, 'Roninn');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
   // this.physics.add.collider(this.player, this.stars); //Þetta er ehv wonky hann er bara að bowla stjörnunum xD //Gæti verið kúl hugmynd af leik haha
    this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);
    this.physics.add.collider(this.player, this.platforms);

    // -------------------  PLAYER ANIMATIONS -------------------
    this.anims.create({

        key: 'left',
        frames: this.anims.generateFrameNumbers('Roninn', { start: 0, end: 4 }), //rammi 0-3 í spritesheet
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'Roninn', frame: 0 } ], // Rammi 4 í spritesheet
      frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('Roninn', { start: 6, end: 11 }),  //rammi 5-8 í spritesheet
        frameRate: 10,
        repeat: -1
    });

    // --------------------- Ninja Enemy -------------------------
    this.enemy = this.physics.add.sprite(400, 450, 'Ninja_enemy');
    this.enemy.setBounce(0.2);
    this.enemy.setCollideWorldBounds(true);
    this.physics.add.collider(this.enemy, this.platforms);
    if (this.player.x > this.enemy.x) {
        this.enemy.setVelocityX(-280);
    } else {
        this.enemy.setVelocityX(280);
    }

    // -------------- Game Over if player hits enemy --------------
    this.physics.add.collider(this.player, this.enemy, () => {
        //stop music and restart game
        //Mikilvægt að stoppa sound fyrst greinilega því annars byrjar leikurinn að spila lagið aftur 
        //ofan á original playið.
        this.sound.stopAll();
        this.sound.play("game_over", {volume: 0.1});

        //Game Over text
        var gameOverText = this.add.text(400, 300, "GAME OVER \nYour score: " + this.score, {
            fontFamily: 'gothic',
            fontSize: '48px',
            backgroundColor: '#000000', 
            color: '#FF0000',
            align: 'center',
            fontStyle: 'bold',
          });
        gameOverText.setOrigin(0.5, 0.5);

        // Pause 3 seconds and restart game
        this.time.delayedCall(3000, () => {
            //Restart game
            this.score = 0;
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

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this);

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
    // if d key is pressed
    
    } else if (this.cursors!.right!.isDown) {
      this.player!.setVelocityX(160); // Hversu hratt á að fara til hægri 
      this.player!.anims.play('right', true); // Spila animation
      // Tvö skilyrði fyrir hoppi þ.e. þú þarft að ýta á space og þú þarft að vera á jörðinni
      if (this.cursors!.space!.isDown && this.player!.body.touching.down) {
        this.player!.setVelocityY(-250); // Hversu hátt á að hoppa 
        this.player!.setVelocityX(100); // Hvesu  mikið velocity þegar þú hoppar á ferð (hægri)
      }

      // ---------------------- DOWN ----------------------
      /*
          Getum kannski sett ehv hérna eins og td. ef þú ýtir á down þá popparu 
          í gegnum platformið sem þú ert á. Eða t.d ehv animation að það kemur
          svona verndar skjöldur í kringum þig hugsaðu rúllu vélmennin í star wars 
          episodes 1-3.

      */


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
