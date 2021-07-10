import Phaser from 'phaser'
import PlayerController from './PlayerController'
import ObsticalesController from './ObsticalesController'
import MienenguyController from './MienenguyController'
import MiniMienenguyController from './MiniMienenguyController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private obstacles!: ObsticalesController
    private mienenguy: MienenguyController[] = []
    private miniMienenguy: MiniMienenguyController[] = []

    private isTouchingGround = false

    constructor() {
        super('game')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.obstacles = new ObsticalesController()
        this.mienenguy = []
        this.miniMienenguy = []

        this.events.once(Phaser.Scenes.Events.DESTROY, () =>{
            this.destroy()
        })
    }

    preload() {
        this.load.atlas('coal-guy', 'assets/coal_guy2.png', 'assets/coal_guy2.json')
        this.load.atlas('mienenguy', 'assets/mienenguy.png', 'assets/mienenguy.json')
        this.load.atlas('miniMienenguy', 'assets/miniMienenguy.png', 'assets/miniMienenguy.json')
        this.load.image('tiles', 'assets/tiles/basic.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/firstlevelv1.json')
        this.load.image('diamond', 'assets/diamond2.png')
        this.load.image('health', 'assets/heart.png')
        
    }

    create() {
        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Miene', 'tiles')
    
        const vordergrund = map.createLayer('vordergrund', tileset)
      //  const ground = map.createLayer('ground', tileset)
        vordergrund.setCollisionByProperty({ collides: true })
        
        const overlay = map.createLayer('overlay', tileset)

       

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objData
        
            switch (name) {
                case 'penguin-spawn': {
                    this.player = this.matter.add.sprite(x + (width*0.5), y, 'coal-guy')
                        .setScale(0.8)
                        .setFixedRotation()

                    this.playerController = new PlayerController(this, this.player, this.cursors, this.obstacles)

                    this.cameras.main.startFollow(this.player)

                    
                    break
                }
                
                case 'miniMienenguy-spawn':{
                    const miniMienenguy = this.matter.add.sprite(x,y, 'miniMienenguy')
                        .setFixedRotation()
                    this.obstacles.add('miniMienenguy', miniMienenguy.body as MatterJS.BodyType)
                    this.miniMienenguy.push(new MiniMienenguyController(this, miniMienenguy))
                    break
                }
                case 'mienenguy-spawn':{
                    const mienenguy = this.matter.add.sprite(x,y, 'mienenguy')
                        .setScale(1.2)
                        .setFixedRotation()
                    this.mienenguy.push(new MienenguyController(this, mienenguy))
                    this.obstacles.add('mienenguy', mienenguy.body as MatterJS.BodyType)
                    break
                }

                

                case 'diamond':{
                    const diamont = this.matter.add.sprite(x+(width*0.5),y,'diamond', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    diamont.setScale(1)
                    diamont.setData('type', 'diamond')

                    break
                }
                case 'health':{
                    const health = this.matter.add.sprite(x+(width*0.5),y, 'health', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    health.setScale(1)
                    health.setData('type', 'health') 
                    health.setData('healthPoints', 10)
                    break
                }
                case 'hitbox':{
                    const hitbox = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                    } )
                    this.obstacles.add('hitboxs', hitbox)
                    break
                }
                case 'info':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width,height,{
                        isStatic: true,
                        isSensor: true,
                    })
                    console.log(this)
                    this.obstacles.add('info', info)
                    break
                }
                case 'info2':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info2', info)
                    break
                }
                case 'info3':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info3', info)
                    break
                }
                case 'info4':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info4', info)
                    break
                }
                case 'info5':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info5', info)
                    break
                }
                case 'info6':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info6', info)
                    break
                }
                case 'info7':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info7', info)
                    break
                }
                case 'info8':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info8', info)
                    break
                }
                case 'info9':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info9', info)
                    break
                }
                
            }
        })

        

        this.matter.world.convertTilemapLayer(vordergrund)
    }

    private destroy(){
       this.mienenguy.forEach(mienenguy => mienenguy.destroy())
       this.miniMienenguy.forEach(miniMienenguy => miniMienenguy.destroy())
    }

    update(t: number, dt: number) {
        this.playerController?.update(dt)
            
        this.mienenguy.forEach(mienenguy => mienenguy.update(dt))
        this.miniMienenguy.forEach(miniMienenguy => miniMienenguy.update(dt))

        

    }
}