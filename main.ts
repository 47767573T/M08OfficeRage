/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;

    private player:Phaser.Sprite;

    //Player Animation
    private FRAME_WIDTH = 64;
    private FRAME_HEIGHT = 32;
    private PJ_SCALE = 1.5;
    private PJ_FRAME_RATE = 10;
    private PJ_MAX_SPEED = 200;
    private PJ_GRAVITY = 500;
    private jumpTimer = 0;
    private onJump;
    private onLiteAtq;
    private onWalk;


    //Controles
    private cursor:Phaser.CursorKeys;
    private upBtn = null;
    private leftBtn = null;
    private rightBtn = null;
    private downBtn;



    preload():void {

        super.preload();

        this.load.image('bg1', 'assets/background1.jpg');
        this.preloadPJ();

        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    private preloadPJ(){

        this.load.spritesheet('animIddle', 'assets/iddle.png'
            ,this.FRAME_WIDTH, this.FRAME_HEIGHT, 4
        );

        this.load.spritesheet('animLiteAtq', 'assets/lightAttack.png'
            ,this.FRAME_WIDTH, this.FRAME_HEIGHT, 6
        );

        this.load.spritesheet('animJump', 'assets/jump.png'
            ,this.FRAME_WIDTH, this.FRAME_HEIGHT, 6
        );

        this.load.spritesheet('animWalk', 'assets/walk.png'
            ,this.FRAME_WIDTH, this.FRAME_HEIGHT, 8
        );
    }

    create():void {

        super.create();
        this.configControls();
        this.createBG('bg1');
        this.createPlayer();
    }

    private createBG(backGroundKey) {

        var bg = this.add.sprite(0, 0, backGroundKey);
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);

    }

    private createPlayer(){

        this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'animIddle');

        this.player.scale.setTo(this.PJ_SCALE, this.PJ_SCALE);
        this.player.anchor.setTo(0, 1);

        this.loadAnimations();
        //this.player.animations.add('animIddle').play(this.PJ_FRAME_RATE, true);

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.checkWorldBounds = true;
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.PJ_MAX_SPEED, this.PJ_MAX_SPEED);

        this.player.body.gravity.y = this.PJ_GRAVITY;
    }

    private loadAnimations(){

        this.player.animations.add('animJump'
            , [0, 1, 2, 3, 4, 5, 6], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animLiteAtq'
            , [0, 1, 2, 3, 4, 5, 6], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animWalk'
            , [0, 1, 2, 3, 4, 5, 6, 7, 8], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animIddle'
            , [0, 1, 2, 3, 4], this.PJ_FRAME_RATE, true);
        console.log("Cargadas animaciones");

    }

    private configControls () {

        this.cursor = this.input.keyboard.createCursorKeys();

        this.upBtn = this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftBtn = this.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightBtn = this.input.keyboard.addKey(Phaser.Keyboard.D);
        console.log("cargados controles");

    }

    //private jump
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

        this.PJmovement();
    }

    private PJmovement(){

        if (this.leftBtn.isDown) {
            this.player.body.velocity.x = -this.PJ_MAX_SPEED;
            this.player.animations.play('animWalk');

        }else if (this.rightBtn.isDown) {
            this.player.body.velocity.x = this.PJ_MAX_SPEED;
            this.player.animations.play('animWalk');

        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.play('animIdle');
        }

        if(this.upBtn.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer){
            this.player.body.velocity.y = -250;
            this.player.animations.play('animJump');
            this.jumpTimer = this.time.now + 750;

        }
    }

    /*if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
{
    player.body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
}*/

}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
