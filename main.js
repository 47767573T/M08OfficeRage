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
        this.PJ_FRAME_WIDTH = 64;
        this.PJ_FRAME_HEIGHT = 32;
        this.PJ_SCALE = 1.5;
        this.PJ_FRAME_RATE = 10;
        this.PJ_MAX_SPEED = 200;
        this.PJ_GRAVITY = 200;
        this.jumpTimer = 0;
        this.rightStance = true;
        //Monsters Animation
        this.MOB_QUANTITY = 30;
        this.MOB_FRAME_WIDTH = 64;
        this.MOB_FRAME_HEIGHT = 36;
        this.MOB_GRAVITY = 500;
        //Fireball Animation
        this.FB_FRAME_WIDTH = 64;
        this.FB_FRAME_HEIGHT = 36;
        this.FB_MAX_SPEED = 500;
        this.nextFire = 0;
        this.fireRate = 500;
        this.upBtn = null;
        this.leftBtn = null;
        this.rightBtn = null;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('bg1', 'assets/background1.jpg');
        this.load.spritesheet('playerAnimation', 'assets/allAnimation.png', this.PJ_FRAME_WIDTH, this.PJ_FRAME_HEIGHT, 66);
        this.load.spritesheet('monsterAnimation', 'assets/monsters.png', this.MOB_FRAME_WIDTH, this.MOB_FRAME_HEIGHT, 24);
        this.load.spritesheet('fireballAnimation', 'assets/flameShotSet.png', this.FB_FRAME_WIDTH, this.FB_FRAME_HEIGHT, 6);
        this.load.image('fireball', 'assets/Fireball.png');
        //this.load.audio('blaster', 'assets/audio/SoundEffects/blaster.mp3');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configControls();
        this.createBG('bg1');
        this.createPlayer();
        this.createMonsters();
        this.createFireballs();
    };
    mainState.prototype.configControls = function () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.upBtn = this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftBtn = this.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightBtn = this.input.keyboard.addKey(Phaser.Keyboard.D);
        console.log("cargados controles");
    };
    mainState.prototype.createBG = function (backGroundKey) {
        var bg = this.add.sprite(0, 0, backGroundKey);
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };
    mainState.prototype.createPlayer = function () {
        this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'playerAnimation');
        this.player.scale.setTo(this.PJ_SCALE, this.PJ_SCALE);
        this.player.anchor.setTo(0, 1);
        this.playerAnimationsLoad();
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.checkWorldBounds = true;
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.PJ_MAX_SPEED, this.PJ_MAX_SPEED);
        this.player.body.gravity.y = this.PJ_GRAVITY;
    };
    mainState.prototype.playerAnimationsLoad = function () {
        this.player.animations.add('iddleRight', [0, 1, 2, 3], this.PJ_FRAME_RATE, true);
        this.player.animations.add('iddleLeft', [4, 5, 6, 7], this.PJ_FRAME_RATE, true);
        this.player.animations.add('walkRight', [8, 9, 10, 11, 12, 13, 14, 15], this.PJ_FRAME_RATE, true);
        this.player.animations.add('walkLeft', [16, 17, 18, 19, 20, 21, 22, 23], this.PJ_FRAME_RATE, true);
        this.player.animations.add('jumpRight', [24, 25, 26, 27, 28, 29, 30, 31], this.PJ_FRAME_RATE, true);
        this.player.animations.add('jumpLeft', [32, 33, 34, 35, 36, 37, 38, 39], this.PJ_FRAME_RATE, true);
        this.player.animations.add('atqLiteRight', [40, 41, 42, 43, 44, 45], this.PJ_FRAME_RATE, true);
        this.player.animations.add('atqLiteLeft', [46, 47, 48, 49, 50, 51], this.PJ_FRAME_RATE, true);
        this.player.animations.add('deadRight', [52, 53, 54, 55, 56, 57, 58], this.PJ_FRAME_RATE, true);
        this.player.animations.add('deadRLeft', [59, 60, 61, 62, 63, 64, 65], this.PJ_FRAME_RATE, true);
    };
    mainState.prototype.createMonsters = function () {
        this.monsters = this.add.group();
        this.monsters.enableBody = true;
        this.monsters.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < this.MOB_QUANTITY; i++) {
            var monster = new Monster(this.game, 800, 100, 'monsterAnimation');
            var scale = this.rnd.integerInRange(0.4, 1);
            monster.scale.setTo(scale, scale);
            monster.health = this.rnd.integerInRange(1, 5);
            monster.body.velocity.x = -this.rnd.integerInRange(20, 50);
            monster.body.gravity.y = this.rnd.integerInRange(this.PJ_GRAVITY, this.MOB_GRAVITY);
            monster.scale.setTo(scale, scale);
            monster.animations.play('walk');
            monster.health = this.rnd.integerInRange(1, 5);
            this.monsters.add(monster);
        }
    };
    mainState.prototype.createFireballs = function () {
        this.fireballs = this.add.group();
        this.fireballs.enableBody = true;
        this.fireballs.physicsBodyType = Phaser.Physics.ARCADE;
        this.fireballs.classType = Fireball;
        this.fireballs.createMultiple(20, 'fireball');
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.PJmovement();
        this.fireWithLeftMouse();
    };
    mainState.prototype.PJmovement = function () {
        if (this.leftBtn.isDown) {
            this.player.body.velocity.x = -this.PJ_MAX_SPEED;
            this.player.animations.play('walkLeft');
            this.rightStance = false;
        }
        else if (this.rightBtn.isDown) {
            this.player.body.velocity.x = this.PJ_MAX_SPEED;
            this.player.animations.play('walkRight');
            this.rightStance = true;
        }
        else {
            this.player.body.velocity.x = 0;
            if (this.rightStance)
                this.player.animations.play('iddleRight');
            else
                this.player.animations.play('iddleLeft');
        }
        if (this.upBtn.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -500;
            this.jumpTimer = this.time.now + 750;
            if (this.rightStance)
                this.player.animations.play('jumpRight');
            else
                this.player.animations.play('jumpLeft');
        }
    };
    mainState.prototype.fireWithLeftMouse = function () {
        if (this.input.activePointer.isDown) {
            this.shoot();
        }
    };
    mainState.prototype.shoot = function () {
        if (this.time.now > this.nextFire && this.fireballs.countDead() > 0) {
            this.nextFire = this.time.now + this.fireRate;
            var fireball = this.fireballs.getFirstDead();
            if (fireball) {
                fireball.reset(this.player.x, this.player.y);
                fireball.animations.play('shoot', 10);
                if (this.rightStance)
                    fireball.body.velocity.x = this.FB_MAX_SPEED;
                else
                    fireball.body.velocity.x = -this.FB_MAX_SPEED;
            }
        }
    };
    return mainState;
})(Phaser.State);
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.body.bounce.setTo(0.9);
        this.checkWorldBounds = true;
        this.body.collideWorldBounds = true;
        this.animations.add('walk', [5, 6, 7, 8, 9], 10, true);
    }
    Monster.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return Monster;
})(Phaser.Sprite);
var Fireball = (function (_super) {
    __extends(Fireball, _super);
    function Fireball(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.5, 0.5);
        this.animations.add('shoot'); //, [1,2,3,4,5,6], 10,true);
        this.outOfBoundsKill = true;
        this.checkWorldBounds = true;
    }
    Fireball.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return Fireball;
})(Phaser.Sprite);
/*
this.fireball = this.add.sprite(this.player.x, this.player.y, 'fireball');
this.fireball.scale.setTo(0.15, 0.15);
this.fireball.anchor.setTo(0.5, 0.5);

//variables Animacion
this.fireball.animations.add('run').play();

//variables de movimiento
this.physics.enable(this.fireball);
this.fireball.body.collideWorldBounds = true;       //Colision
this.fireball.body.bounce.setTo(0.8);               //Rebote
this.fireball.body.maxVelocity.setTo(this.FB_MAX_SPEED, this.FB_MAX_SPEED);

this.fireball.rotation = this.physics.arcade.angleToPointer(this.fireball)
*/
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