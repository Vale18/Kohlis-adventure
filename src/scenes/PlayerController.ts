import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
import { events } from './EventCenter'
import ObsticalesController from './ObsticalesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController{

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine
    private obsticales : ObsticalesController
    private health = 100

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obsticales: ObsticalesController){
        this.scene = scene
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
        .addState('hitbox-hit', {
            onEnter: this.hitboxhitOnEnter,
            // onUpdate: this.hitboxhitOnUpdate,
            // onExit: this.hitboxhitOnExit
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if(this.obsticales.is('hitboxs', body)){
                this.stateMachine.setState('hitbox-hit')
                
            }

            if(this.obsticales.is('info', body)){
                events.emit('info')
            }


            if(this.obsticales.is('info2', body)){
                events.emit('info2')
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
                case 'health':{
                    const value = sprite.getData('healthPoints') 
                    this.health += Phaser.Math.Clamp(value, 0, 100)
                    events.emit('health-changed', this.health)
                    sprite.destroy()
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
        this.health = Phaser.Math.Clamp(this.health - 10, 0,100)
        events.emit('health-changed', this.health)
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )
                this.sprite.setTint(color)
            }
        })
        this.stateMachine.setState('jump')
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

    }
}