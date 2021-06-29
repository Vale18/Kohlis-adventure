import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private penguin?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController

    private isTouchingGround = false

    constructor() {
        super('game')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.atlas('coal-guy', 'assets/coal_guy.png', 'assets/coal_guy.json')
        this.load.image('tiles', 'assets/sprites-12.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game2.json')
    }

    create() {
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Miene', 'tiles')

        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch (name) {
                case 'penguin-spawn': {
                    this.penguin = this.matter.add.sprite(x + (width*0.5), y, 'coal-guy')
                        .setFixedRotation()

                    this.playerController = new PlayerController(this.penguin, this.cursors)

                    this.cameras.main.startFollow(this.penguin)
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