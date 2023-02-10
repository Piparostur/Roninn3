import Phaser from "phaser";
import StartScene from "./StartScreen";

export default class FirstScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'FirstScreen' });
    }

    preload(){
        this.load.image('scifi', 'assets/scifi.png');
        this.load.image('Roninn_logo', 'assets/Roninn_logo.png');
        this.load.image('Roninn_logo2', 'assets/Roninn_logo2.png');
    }

    create() {
        this.add.image(400, 300, 'scifi');
        //add Roninn logo to the screen but make it invisible
        this.add.image(400, 300, 'Roninn_logo2').setVisible(false);
        //Make Roninn slowly appear
        this.time.delayedCall(1000, () => {
            this.add.image(400, 300, 'Roninn_logo').setVisible(true);
        });
        // Now pause 3 seconds and then start the StartScene
        this.time.delayedCall(4000, () => {
            this.scene.start('StartScene');   
        });
    }
}