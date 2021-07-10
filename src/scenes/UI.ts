import Phaser from "phaser"
import TimerEvent from "phaser"
import { events } from './EventCenter'

export default class UI extends Phaser.Scene{

    private diamondLabe!: Phaser.GameObjects.Text
    private diamondCollected = 0
    private graphics!: Phaser.GameObjects.Graphics
    private lastHealth =  100
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
        this.load.image('diamond', 'assets/diamond2.png')
    }

    create(){

        this.graphics = this.add.graphics()
        this.setHealthBar(100)


        const uiDiamond = this.add.image(20,50, 'diamond')
        .setScale(1)
        this.diamondLabe = this.add.text(35,35, '0',{
            fontSize: '32px'
        })
        events.on('diamond-collected',this.handelDiamondCollected, this)

        events.on('health-changed' , this.changeTheHealth, this)

        events.on('info', this.readInfo, this)
        events.on('info2', this.readInfo2, this)
        events.on('info3', this.readInfo3, this)
        events.on('info4', this.readInfo4, this)
        events.on('info5', this.readInfo5, this)
        events.on('info6', this.readInfo6, this)
        events.on('info7', this.readInfo7, this)
        events.on('info8', this.readInfo8, this)
        events.on('info9', this.readInfo9, this)

        this.events.once(Phaser.Scenes.Events.DESTROY, () =>{
         events.off('diamond-collected',this.handelDiamondCollected, this),
         events.off('info', this.readInfo, this),
         events.off('info2', this.readInfo2, this)
         events.off('info3', this.readInfo3, this)
         events.off('info4', this.readInfo4, this)
         events.off('info5', this.readInfo5, this)
         events.off('info6', this.readInfo6, this)
         events.off('info7', this.readInfo7, this)
         events.off('info8', this.readInfo8, this)
         events.off('info9', this.readInfo9, this)
        })
    }

    private setHealthBar(value: number){
        const width = 200
        const prozent = Phaser.Math.Clamp(value, 0 ,100)/100
        this.graphics.clear()
        this.graphics.fillStyle(0x808080)  
        this.graphics.fillRoundedRect(10, 10, width, 20, 5)
        if(prozent > 0){
            this.graphics.fillStyle(0x00ff00)
            this.graphics.fillRoundedRect(10, 10,width*prozent, 20, 5) 
        }
        
    }

    private changeTheHealth(value: number){
        this.tweens.addCounter({
            from: this.lastHealth,
            to: value,
            duration: 200,
            onUpdate: tween => {
                const value = tween.getValue()
                this.setHealthBar(value)
            }
        })
        
        this.lastHealth = value
    }


    private readInfo(){
        this.infoText = "Mit den Pfeiltasten bewegst du dich, spring mit Space"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true
        
    }
     
    private readInfo2(){
        this.infoText = "Diamanten kann man sammeln, sie sind deine Punkte"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo3(){
        this.infoText = "Es riecht nach fiesen Minenarbeitern, Zeit sie zu vermöbeln"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo4(){
        this.infoText = "Besiege sie durch den klassischen Kopfsprung"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo5(){
        this.infoText = "Die Stacheln sehen ungemütlich aus, finde einen anderen Weg"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo6(){
        this.infoText = "Das ist ein NormCoin, suche sie alle für eine Überraschung"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo7(){
        this.infoText = "↓ Vorsichtig, Lohren im Einsatz ↓"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo8(){
        this.infoText = "↑ Oreichalkos Mine ↑"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })

        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo9(){
        this.infoText = "Fahrstuhl leider außer Betrieb aufgrund eines Steinbruchs"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private readInfo10(){
        this.infoText = "→ Oreichalkos Mine →"
        if(this.show == true ){
            this.info.destroy()
        }
        this.info = this.add.text(50,100, this.infoText,{
            fontSize: '15px'
        })
        this.timerEvent = this.time.delayedCall(5000, this.destroyText, [], this)
        this.show = true

    }
    private destroyText(){
        if(this.timerEvent.getProgress().toString() == "1"){
            console.log(this.timerEvent.getProgress())
            this.show = false
            this.info.destroy()

        }
        
    }

    private handelDiamondCollected(){
        this.diamondCollected++
        this.diamondLabe.text =  `${this.diamondCollected}`
    }

}
