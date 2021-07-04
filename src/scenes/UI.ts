import Phaser from "phaser"
import TimerEvent from "phaser"
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

        events.on('info', this.readInfo, this)

        events.on('info2', this.readInfo2, this)
        

        this.events.once(Phaser.Scenes.Events.DESTROY, () =>{
         events.off('diamond-collected',this.handelDiamondCollected, this),
         events.off('info', this.readInfo, this),
         events.off('info2', this.readInfo, this)
        })
    }

    private readInfo(){
        this.add.text(50, 100, "Mit den Pfeiltasten kannst du dich Bewegen", {
            fontSize: '20px'
        })

    }
    private readInfo2(){
        this.add.text(50, 100, "Spring mit Space", {
            fontSize: '20px'
        })

    }

    private handelDiamondCollected(){
        this.diamondCollected++
        this.diamondLabe.text =  `${this.diamondCollected}`
    }
}
