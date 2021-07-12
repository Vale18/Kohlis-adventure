import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class BreakingWoodController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController
    private up = 1
    

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.stateMachine = new StateMachine(this, 'breakingWood')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate

        })
        .addState('break', {
            onEnter: this.breakOnEnter,
            onUpdate: this.breakOnUpdate
        })
        .setState('idle')

        

        // this.sprite.setIgnoreGravity(true)


    }
    update(dt: number){
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        this.sprite.isStatic
       
    }
    private idleOnUpdate(){
        this.sprite.setVelocityY(0)
        this.sprite.setVelocityX(0)
    }


    private breakOnEnter(){

    }

    public breakOnUpdate(){
        this.sprite.setVelocityY(5)
        this.sprite.setVelocityX(0)
        if(this.up === 1){
            this.stateMachine.setState('move-up')
        }
        
    }

    private moveUpOnEnter(){

    }

    public moveUpOnUpdate(){
        this.sprite.setVelocityY(-5)
        this.sprite.setVelocityX(0)
        if(this.up === 0){
            this.stateMachine.setState('move-down')
        }
    }

}