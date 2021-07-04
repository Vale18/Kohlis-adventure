import Phaser from "phaser"
export default class TitleScene extends Phaser.Scene{

    //var titleScene = new Phaser.Scene("title");
    constructor() {
		super({key:'titleScene'});
	}
    preload = function() {

    };

    create = function() {
        var text = this.add.text(100,100, 'Welcome to my game!');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    };
    clickButton() {
        this.scene.switch('game');
    }

export default TitleScene;

}