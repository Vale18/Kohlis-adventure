import Phaser from 'phaser'
import PlayerController from './PlayerController'
import ObsticalesController from './ObsticalesController'
import MienenguyController from './MienenguyController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private obstacles!: ObsticalesController
    private mienenguy: MienenguyController[] = []

    private isTouchingGround = false

    constructor() {
        super('game')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.obstacles = new ObsticalesController()
        this.mienenguy = []

        this.events.once(Phaser.Scenes.Events.DESTROY, () =>{
            this.destroy()
        })
    }

    preload() {
        this.load.atlas('coal-guy', 'assets/coal_guy2.png', 'assets/coal_guy2.json')
        this.load.atlas('mienenguy', 'assets/mienenguy.png', 'assets/mienenguy.json')
        this.load.image('tiles', 'assets/tiles-12.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game2.json')
        this.load.image('diamond', 'assets/diamond.png')
        this.load.image('health', 'assets/healing.png')
    }

    create() {
        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Miene', 'tiles')
    

        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })
        
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
                    diamont.setScale(0.3)
                    diamont.setData('type', 'diamond')

                    break
                }
                case 'health':{
                    const health = this.matter.add.sprite(x+(width*0.5),y, 'health', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    health.setScale(0.3)
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

                
            }
        })

        

        this.matter.world.convertTilemapLayer(ground)
    }

    private destroy(){
       this.mienenguy.forEach(mienenguy => mienenguy.destroy()) 
    }

    update(t: number, dt: number) {
        this.playerController?.update(dt)
            
        this.mienenguy.forEach(mienenguy => mienenguy.update(dt))

    }
}