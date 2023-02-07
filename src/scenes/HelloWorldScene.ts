import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene
{
    load: any;
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWitdh: 30, FrameHeight: 48});

    }

    create()
    {
        this.add.image(400, 300, 'sky')
    }
    update()
    {
        
    }
}
