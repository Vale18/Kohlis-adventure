import Phaser from "phaser"
import { events } from './EventCenter'

export default class EndScreen extends Phaser.Scene{

    private scoreLabel!: Phaser.GameObjects.Text
    private score = 0

    constructor() {
		super({
            key:'endScreen'
        });
	}
    preload() {
        this.load.image('background', 'assets/winning.png');
        this.load.image('diamond', 'assets/diamond2.png')
        this.scene.remove('titleScene')
        this.scene.bringToTop('endScreen')
    };

    create() {
        
        events.on('changeToEndscreen', this.setDiamondScore, this)
        
        
        const winnbg = this.add.image(0,0,'background');
        winnbg.setOrigin(0,0);
        const uiDiamond = this.add.image(20,50, 'diamond')
        .setScale(1)
        this.scoreLabel = this.add.text(35,35, `${this.score}`,{
            fontSize: '32px'
        })
        const text = this.add.text(200,200, 'Neues Spiel starten');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    };

    private setDiamondScore(score: number){
        this.score = score
    }

    private clickButton() {
        
        this.scene.run('game');
    }



}