import Phaser from "phaser";
import { events } from './EventCenter'

export default class UI extends Phaser.Scene{

    private diamondLabe!: Phaser.GameObjects.Text
    private diamondCollected = 0

    constructor(){
        super({
            key: 'ui'
        })
    }
    init(){
        this.diamondCollected = 0
    }

    preload(){
        this.load.image('diamond', 'assets/diamond.png')
    }

    create(){
        const uiDiamond = this.add.image(20,25, 'diamond')
        .setScale(0.3)
        this.diamondLabe = this.add.text(35,10, '0',{
            fontSize: '32px'
        })

        events.on('diamond-collected',this.handelDiamondCollected, this)
    }

    private handelDiamondCollected(){
        this.diamondCollected++
        this.diamondLabe.text =  `${this.diamondCollected}`
    }
}
