import Phaser from 'phaser';
import class HelloWorldScene  './HelloWorldScene';

export default class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' });
    }
  
    create() {
      this.add.text(200, 200, 'Press any key to start', {
        fontSize: '32px',
        color: '#fff', // Skoða betur 
        backgroundColor: '#000',
      });
  
      this.input.keyboard.on('keydown', () => {
        //this.scene.start('HelloWorldScene');
        this.scene.start('HelloWorldScene');

      });
    }
  }
  