import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController{

    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine

    constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys){
        this.sprite = sprite
        this.cursors = cursors

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
            onExit:this.walkOnExet
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            if(this.stateMachine.isCurrentState('jump')){
                this.stateMachine.setState('idle')
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

    private walkOnExet(){
        this.sprite.stop()
    }

    private jumpOnEnter(){
        this.sprite.setVelocityY(-10)
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

    private createAnimations() {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'coal-guy', frame: 'coal-guy-running-12.png' }]
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 12,
                end: 15,
                prefix: 'coal-guy-running-',
                suffix: '.png'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 12,
                end: 15,
                prefix: 'coal-guy-running-',
                suffix: '.png'
            }),
            repeat: -1
        })
    }
}