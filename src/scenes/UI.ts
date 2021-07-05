import Phaser from "phaser"
import TimerEvent from "phaser"
import { events } from './EventCenter'

export default class UI extends Phaser.Scene{

    private diamondLabe!: Phaser.GameObjects.Text
    private diamondCollected = 0
    private infoText
    private info!: Phaser.GameObjects.Text
    private timerEvent
    private show = false

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
         events.off('info2', this.readInfo2, this)
        })
    }


    private readInfo(){
        this.infoText = "Mit den Pfeiltasten kannst du dich Bewegen"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(10000, this.destroyText, [], this)
        this.show = true
        
        // const info = this.add.text(50,100, this.infoText,{
        //     fontSize: '15px'
        // })
        // info.setActive(false)
        
    }

    private destroyText(){
        if(this.timerEvent.getProgress().toString() == "1"){
            console.log(this.timerEvent.getProgress())
            this.show = false
            this.info.destroy()

        }
        
    }

    

    private readInfo2(){
        this.infoText = "Spring mit Space"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(10000, this.destroyText, [], this)
        this.show = true

    }

    private handelDiamondCollected(){
        this.diamondCollected++
        this.diamondLabe.text =  `${this.diamondCollected}`
    }

}
