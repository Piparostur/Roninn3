import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import StartScreen from './scenes/StartScreen'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [StartScreen, HelloWorldScene]
	//scene: [StartScreen, HelloWorldScene] // held að start scene fari líka hérna en virkaði ekki þarf að tweaka ehv.


}

export default new Phaser.Game(config)
