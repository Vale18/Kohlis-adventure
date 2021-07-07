import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";

export default class MiniMienenguyController{
    // private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite){
        // this.scene = scene
        this.sprite = sprite
        this.stateMachine = new StateMachine(this, 'miniMienenguy')


    }

    destroy(){
        
    }

    update(dt: number){
        this.stateMachine.update(dt)
    }
}