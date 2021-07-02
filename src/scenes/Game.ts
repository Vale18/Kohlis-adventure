import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController

    private isTouchingGround = false

    constructor() {
        super('game')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.atlas('coal-guy', 'assets/coal_guy2.png', 'assets/coal_guy2.json')
        this.load.image('tiles', 'assets/tiles-12.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game2.json')
        this.load.image('diamond', 'assets/diamond.png')
    }

    create() {
        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Miene', 'tiles')

        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch (name) {
                case 'penguin-spawn': {
                    this.player = this.matter.add.sprite(x + (width*0.5), y, 'coal-guy')
                        .setScale(0.8)
                        .setFixedRotation()

                    this.playerController = new PlayerController(this.player, this.cursors)

                    this.cameras.main.startFollow(this.player)

                    
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

                
            }
        })

        

        this.matter.world.convertTilemapLayer(ground)
    }

    update(t: number, dt: number) {

        if(!this.playerController){
            return
        }

        this.playerController.update(dt)

    }
}