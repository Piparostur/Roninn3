import Phaser from 'phaser';
//connect to the HelloWorldScene
import HelloWorldScene from './HelloWorldScene';

export default class StartScene extends Phaser.Scene {
    constructor() {
      HelloWorldScene
      super({ key: 'StartScene' });
    }
  
    create() {
      this.add.text(200, 200, 'Press any key to start', {
        fontSize: '32px',
        color: '#fff', // Skoða betur 
        backgroundColor: '#000',
        shadow: { color: '#000', blur: 2, stroke: true, fill: true }
      });
  
      this.input.keyboard.on('keydown', () => {
        //this.scene.start('HelloWorldScene');
        this.scene.start('hello-world'); // Fixið var að nota super key í staðinn nafnið a scene
      });
    }
  }
  