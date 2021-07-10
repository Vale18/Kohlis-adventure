import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class EmptyLorenController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController

    private moveTime = 0

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.stateMachine = new StateMachine(this, 'emptyLore')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move-left', {
            onEnter: this.moveLeftOnEnter,
            onUpdate: this.moveLeftOnUpdate
        })
        .addState('move-right',{
            onEnter: this.moveRightOnEnter,
            onUpdate: this.moveRightOnUpdate
        })
        .setState('move-left')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyA as MatterJS.BodyType
            

            if(this.obsticales.is('leftWall', body)){
                console.log('linke Wand')
                // this.stateMachine.setState('move-right')
                this.stateMachine.setState('move-right')
                this.sprite.setVelocityX(3)
            }
            if(this.obsticales.is('rightWall', body)){
                this.stateMachine.setState('move-left')
            }
        })


    }


    

    

    private idleOnEnter(){
        // this.stateMachine.setState('move-left')
    }
    
    private moveLeftOnEnter(){
        this.moveTime = 0
    }


    private moveLeftOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(-3)
        console.log('Speed' + this.sprite.body.velocity)
        // if(this.moveTime > 9000){
        //     this.stateMachine.setState('move-right')
        // }
    }

    private moveRightOnEnter(){
        this.moveTime = 0
    }

    private moveRightOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(3)
        // if(this.moveTime > 9000){
        //     this.stateMachine.setState('move-left')
        // }
    }

    destroy(){
        
    }
    update(dt: number){
        this.stateMachine.update(dt)
    }
}
