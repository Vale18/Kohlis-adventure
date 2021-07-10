import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class EmptyLorenController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController
    private currentState = 'move-right'

    private moveTime = 0

    private moveRichtung = 1

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
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
            
            if(this.obsticales.is('rightWall', body)){
                console.log("Wand: rechtewand")
                this.stateMachine.setState('move-left')
                return
            }

            if(this.obsticales.is('leftWall', body)){
                console.log("Wand: linkewand")
                this.stateMachine.setState('move-right')
                return
            }

            
        })


    }


    

    public getRichtung(){
        console.log(this.moveRichtung)
        return this.moveRichtung
    }

    private idleOnEnter(){
        this.stateMachine.setState(this.currentState)
    }
    
    private moveLeftOnEnter(){
        this.moveTime = 0
        this.moveRichtung = 1
        this.currentState = 'move-left'
    }


    private moveLeftOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(-3)
        if(this.moveTime > 9000){
            this.stateMachine.setState('move-right')
        }
    }

    private moveRightOnEnter(){
        this.moveTime = 0
        this.moveRichtung = 2
        this.currentState = 'move-right'
    }

    private moveRightOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(3)
        if(this.moveTime > 9000){
            this.stateMachine.setState('move-left')
        }
    }

    destroy(){
        
    }
    update(dt: number){
        this.stateMachine.update(dt)
    }
}
