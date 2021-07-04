import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
import { events } from './EventCenter'
import ObsticalesController from './ObsticalesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController{

    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine
    private obsticales : ObsticalesController

    constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obsticales: ObsticalesController){
        this.sprite = sprite
        this.cursors = cursors
        this.obsticales = obsticales

        this.createAnimations()

        this.stateMachine = new StateMachine(this, 'player')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate,
            // onExit: this.idleOnExit
        })
        .addState('walk',{
            onEnter: this.walkOnEnter,
            onUpdate: this.walkOnUpdate,
            onExit:this.walkOnExit
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .addState('readInfo', {
            onEnter: this.readOnEnter,
        })
        .addState('hitbox-hit', {
            onEnter: this.hitboxhitOnEnter,
            onUpdate: this.hitboxhitOnUpdate,
            // onExit: this.hitboxhitOnExit
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if(this.obsticales.is('hitboxs', body)){
                this.stateMachine.setState('hitbox-hit')
                return
            }

            if(this.obsticales.is('info', body)){
                events.emit('info')
                this.stateMachine.setState('readInfo')
            }

            const gameObject = body.gameObject

            if(!gameObject){
                return
            }

            if(gameObject instanceof Phaser.Physics.Matter.TileBody){

                if(this.stateMachine.isCurrentState('jump')){
                    this.stateMachine.setState('idle')
                }
                if(this.stateMachine.isCurrentState('hitbox-hit')){
                    
                    console.log('now idle')
                    this.stateMachine.setState('idle')
                }
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            switch(type){
                case 'diamond':{
                    
                    events.emit('diamond-collected')
                    sprite.destroy()
                    break
                }
                case 'info':{
                    this.stateMachine.setState('readInfo')
                    console.log("Schild 1")
                    events.emit('info')
                    break
                }
                case 'info2':{
                    this.stateMachine.setState('readInfo')
                    events.emit('info2')
                    console.log("Schild 2")
                    break
                }
            }
        })
    }

    update(dt: number){
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        this.sprite.play('player-idle')
    }

    private idleOnUpdate(){
        if (this.cursors.left.isDown || this.cursors.right.isDown){
            this.stateMachine.setState('walk')
        }

        const spaceJustPressd = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressd) {
            this.stateMachine.setState('jump')
        }
    }

    // private idleOnExit(){
    //     console.log("Exit")
    // }

    private walkOnEnter(){
        this.sprite.play('player-walk')
    }

    private walkOnUpdate(){
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)

            this.sprite.flipX = false
        } else {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }

        const spaceJustPressd = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressd) {
            this.stateMachine.setState('jump')
        }
        
    }

    private walkOnExit(){
        this.sprite.stop()
    }

    private jumpOnEnter(){
        this.sprite.setVelocityY(-10)
        this.sprite.play('player-jump')
    }

    private jumpOnUpdate(){
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)

            this.sprite.flipX = false
        }
    }

    private readOnEnter(){
        console.log("readInfo")
        
        this.stateMachine.setState("walk")
    }

    private hitboxhitOnEnter(){
        this.sprite.setVelocityY(-12)
        this.sprite.play('player-hurt')
        // this.stateMachine.setState('jump')
    }

    private hitboxhitOnUpdate(){
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)

            this.sprite.flipX = false
        }
    }

    


    private createAnimations() {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'coal-guy', frame: 'coal-guy-chill-11.svg' }]
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 12,
                end: 15,
                prefix: 'coal-guy-running-',
                suffix: '.svg'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 18,
                end: 19,
                prefix: 'coal-guy-jumping-',
                suffix: '.svg'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-hurt',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 20,
                end: 21,
                prefix: 'coal_guy_hurt-',
                suffix: '.svg'
            }),
            repeat: -1
        })
    }
}