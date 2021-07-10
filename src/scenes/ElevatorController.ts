import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class ElevatorController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController

    

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.stateMachine = new StateMachine(this, 'elevator')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move-up', {
            onEnter: this.moveDownOnEnter,
            onUpdate: this.moveDownOnUpdate
        })
        .addState('move-down',{
            onEnter: this.moveUpOnEnter,
            onUpdate: this.moveUpOnUpdate
        })
        .setState('move-up')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyA as MatterJS.BodyType
            

            if(this.obsticales.is('elevatorTop', body)){
                console.log('Top')
                this.sprite.destroy()
                this.stateMachine.setState('move-down')
                
            }
            if(this.obsticales.is('elevatorBottom', body)){
                console.log('Bottom')
                this.sprite.setVelocity(0,-10)
                this.stateMachine.setState('move-up')
            }
        })
        

        this.sprite.setIgnoreGravity(true)


    }
    update(dt: number){
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        
        this.stateMachine.setState('move-up')
    }

    private moveDownOnEnter(){

    }

    public moveDownOnUpdate(){
        // this.sprite.body.velocity.y + 5
        this.sprite.setVelocityX(20)
        this.sprite.setVelocityX(0)
    }

    private moveUpOnEnter(){

    }

    public moveUpOnUpdate(){
        // this.sprite.body.velocity.y - 5
        this.sprite.setVelocityY(-20)
        this.sprite.setVelocityX(0)
    }

}