/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        //Player Animation
        this.FRAME_WIDTH = 64;
        this.FRAME_HEIGHT = 32;
        this.PJ_SCALE = 1.5;
        this.PJ_FRAME_RATE = 10;
        this.PJ_MAX_SPEED = 200;
        this.PJ_GRAVITY = 500;
        this.jumpTimer = 0;
        this.upBtn = null;
        this.leftBtn = null;
        this.rightBtn = null;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('bg1', 'assets/background1.jpg');
        this.preloadPJ();
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.preloadPJ = function () {
        this.load.spritesheet('animIddle', 'assets/iddle.png', this.FRAME_WIDTH, this.FRAME_HEIGHT, 4);
        this.load.spritesheet('animLiteAtq', 'assets/lightAttack.png', this.FRAME_WIDTH, this.FRAME_HEIGHT, 6);
        this.load.spritesheet('animJump', 'assets/jump.png', this.FRAME_WIDTH, this.FRAME_HEIGHT, 6);
        this.load.spritesheet('animWalk', 'assets/walk.png', this.FRAME_WIDTH, this.FRAME_HEIGHT, 8);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configControls();
        this.createBG('bg1');
        this.createPlayer();
    };
    mainState.prototype.createBG = function (backGroundKey) {
        var bg = this.add.sprite(0, 0, backGroundKey);
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };
    mainState.prototype.createPlayer = function () {
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
    };
    mainState.prototype.loadAnimations = function () {
        this.player.animations.add('animJump', [0, 1, 2, 3, 4, 5, 6], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animLiteAtq', [0, 1, 2, 3, 4, 5, 6], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animWalk', [0, 1, 2, 3, 4, 5, 6, 7, 8], this.PJ_FRAME_RATE, true);
        this.player.animations.add('animIddle', [0, 1, 2, 3, 4], this.PJ_FRAME_RATE, true);
        console.log("Cargadas animaciones");
    };
    mainState.prototype.configControls = function () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.upBtn = this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftBtn = this.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightBtn = this.input.keyboard.addKey(Phaser.Keyboard.D);
        console.log("cargados controles");
    };
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
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.PJmovement();
    };
    mainState.prototype.PJmovement = function () {
        if (this.leftBtn.isDown) {
            this.player.body.velocity.x = -this.PJ_MAX_SPEED;
            this.player.animations.play('animWalk');
        }
        else if (this.rightBtn.isDown) {
            this.player.body.velocity.x = this.PJ_MAX_SPEED;
            this.player.animations.play('animWalk');
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.play('animIdle');
        }
        if (this.upBtn.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -250;
            this.player.animations.play('animJump');
            this.jumpTimer = this.time.now + 750;
        }
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map