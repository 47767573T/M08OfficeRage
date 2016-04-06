/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private fireball:Phaser.Sprite;

    private cursor:Phaser.CursorKeys;

    preload():void {
        super.preload();
    }

    create():void {
        super.create();
    }
/*    private createFireball(){
        var anim;

        this.fireball = this.add.sprite(this.world.centerX, this.world.centerY, 'fireball');
        this.fireball.scale.setTo(0.15, 0.15);
        this.fireball.anchor.setTo(0.5, 0.5);

        //variables Animacion
        anim = this.fireball.animations.add('run');
        anim.play(15, true);

        //variables de movimiento
        this.physics.enable(this.fireball);
        this.fireball.body.collideWorldBounds = true;       //Colision
        this.fireball.body.bounce.setTo(0.8);               //Rebote
        this.fireball.body.maxVelocity.setTo(this.FB_MAX_SPEED, this.FB_MAX_SPEED);
        this.fireball.body.drag.setTo(this.FB_FRICTION, this.FB_FRICTION);

        this.fireball.rotation = this.physics.arcade.angleToPointer(this.fireball)

    }
*/

    update():void {
        super.update();
    }

/*  private fireballMove(){

        if (this.cursor.left.isDown) {
            this.fireball.body.acceleration.x =-this.FB_ACCELERATION;

        } else if (this.cursor.right.isDown) {
            this.fireball.body.acceleration.x =this.FB_ACCELERATION;

        } else if (this.cursor.up.isDown) {
            this.fireball.body.acceleration.y =-this.FB_ACCELERATION;

        } else if (this.cursor.down.isDown) {
            this.fireball.body.acceleration.y =this.FB_ACCELERATION;
        } else {if (this.pad.health = 1)
            this.fireball.body.acceleration.y =0;
            this.fireball.body.acceleration.x =0;
        }
    }
*/

}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}


window.onload = () => {
    var game = new SimpleGame();
};
