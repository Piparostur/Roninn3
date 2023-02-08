class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' });
    }
  
    create() {
      this.add.text(200, 200, 'Press any key to start', {
        fontSize: '32px',
        color: '#fff',
        align: 'center',
      });
  
      this.input.keyboard.on('keydown', () => {
        this.scene.start('HelloWorldScene');
      });
    }
  }
  