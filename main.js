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
        //Player vars
        this.PJ_FRAME_WIDTH = 32;
        this.PJ_FRAME_HEIGHT = 32;
        this.PJ_SCALE = 1.5;
        this.PJ_FRAME_RATE = 10;
        this.PJ_MAX_SPEED = 200;
        this.PJ_GRAVITY = 200;
        this.jumpTimer = 0;
        this.rightStance = true;
        this.PJ_MAX_LIFES = 30;
        //Monsters vars
        this.MOB_QUANTITY = 25;
        this.MOB_FRAME_WIDTH = 32;
        this.MOB_FRAME_HEIGHT = 36;
        this.MOB_GRAVITY = 500;
        this.MOB_MAX_VELOCITY = 200;
        //Fireball vars
        this.FB_MAX_SPEED = 500;
        this.nextFire = 0;
        this.fireRate = 400;
        this.upBtn = null;
        this.leftBtn = null;
        this.rightBtn = null;
        //Text
        this.killed = 0;
        this.lives = this.PJ_MAX_LIFES;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('bg1', 'assets/background1.jpg');
        this.load.spritesheet('playerAnimation', 'assets/allAnimation.png', this.PJ_FRAME_WIDTH, this.PJ_FRAME_HEIGHT, 200);
        this.load.spritesheet('monsterAnimation', 'assets/monsters.png', this.MOB_FRAME_WIDTH, this.MOB_FRAME_HEIGHT, 48);
        this.load.image('fireball', 'assets/blackFireball.png');
        this.load.image('blackfireball', 'assets/blackFireball.png');
        this.load.audio('scream2', 'assets/mobVoice.wav');
        this.load.audio('mobDeath', 'assets/mobdeath1.wav');
        this.load.audio('ambient', 'assets/ambient.mp3');
        this.load.audio('mobScoreSound', 'assets/mobJumping.wav');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.configControls();
        this.createBG('bg1');
        this.createTexts();
        this.createPlayer();
        this.createMonsters();
        this.createFireballs();
        this.physics.arcade.checkCollision.left = false;
        this.deathSound = this.game.add.audio('mobDeath');
        this.deathSound.allowMultiple = true;
        this.screamSound = this.game.add.audio('scream2');
        this.screamSound.allowMultiple = true;
        this.MOB_SCORE_SOUND = this.game.add.audio('mobScoreSound');
        this.MOB_SCORE_SOUND.allowMultiple = true;
    };
    mainState.prototype.configControls = function () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.upBtn = this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftBtn = this.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightBtn = this.input.keyboard.addKey(Phaser.Keyboard.D);
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
        this.player.health = this.PJ_MAX_LIFES;
        this.player.body.gravity.y = this.PJ_GRAVITY;
    };
    mainState.prototype.playerAnimationsLoad = function () {
        this.player.animations.add('iddleRight', [0, 2, 4, 6], this.PJ_FRAME_RATE, true);
        this.player.animations.add('iddleLeft', [8, 10, 12, 14], this.PJ_FRAME_RATE, true);
        this.player.animations.add('walkRight', [16, 18, 20, 22, 24, 26, 28, 30], this.PJ_FRAME_RATE, true);
        this.player.animations.add('walkLeft', [32, 34, 36, 38, 40, 42, 44, 46], this.PJ_FRAME_RATE, true);
        this.player.animations.add('jumpRight', [48, 50, 52, 54, 56, 58, 60, 62], this.PJ_FRAME_RATE, true);
        this.player.animations.add('jumpLeft', [64, 66, 68, 70, 72, 74, 76, 78], this.PJ_FRAME_RATE, true);
        this.player.animations.add('atqLiteRight', [80, 82, 84, 86, 88, 90], this.PJ_FRAME_RATE, true);
        this.player.animations.add('atqLiteLeft', [92, 94, 96, 98, 100, 102], this.PJ_FRAME_RATE, true);
    };
    mainState.prototype.createMonsters = function () {
        this.monsters = this.add.group();
        this.monsters.enableBody = true;
        this.monsters.physicsBodyType = Phaser.Physics.ARCADE;
        this.monsters.classType = Monster;
        for (var i = 0; i < this.MOB_QUANTITY; i++) {
            var monster = new Monster(this.game, 800, 100, 'monsterAnimation');
            var scale = this.rnd.realInRange(1, 2);
            monster.scale.setTo(scale, scale);
            monster.health = this.rnd.integerInRange(1, 5);
            monster.body.velocity.x = -this.rnd.integerInRange(15, this.MOB_MAX_VELOCITY);
            monster.body.gravity.y = this.rnd.integerInRange(this.PJ_GRAVITY, this.MOB_GRAVITY);
            monster.scale.setTo(scale, scale);
            monster.animations.play('walk');
            monster.events.onOutOfBounds.add(this.monsterScore, this);
            this.monsters.add(monster);
        }
    };
    mainState.prototype.monsterScore = function () {
        if (this.lives >= 1) {
            this.lives -= 1;
            console.log("lives: " + this.lives);
            var twIn = this.add.tween(this.livesText).to({ alpha: 1 }, 50);
            twIn.start();
            this.MOB_SCORE_SOUND.play();
            var twOut = this.add.tween(this.livesText).to({ alpha: 0 }, 1500);
            twIn.onComplete.add(function () {
                twOut.start();
            });
        }
        else if (this.lives == 0) {
            console.log("GAME OVER");
            this.game.paused = true;
            console.log("GAME ON PAUSE");
            this.input.onTap.addOnce(this.restart, this);
        }
    };
    mainState.prototype.createFireballs = function () {
        this.fireballs = this.add.group();
        this.fireballs.enableBody = true;
        this.fireballs.physicsBodyType = Phaser.Physics.ARCADE;
        this.fireballs.classType = Fireball;
        this.fireballs.createMultiple(20, 'fireball');
        this.fireballs.setAll('anchor.x', 0.5);
        this.fireballs.setAll('anchor.y', 0.5);
        this.fireballs.setAll('outOfBoundsKill', true);
        this.fireballs.setAll('checkWorldBounds', true);
    };
    mainState.prototype.createTexts = function () {
        this.scoreText = this.add.text(this.game.canvas.width / 2, 30, 'Killed: ' + this.killed, { font: "30px Callibri", fill: "#ffffff", align: "justify" });
        this.livesText = this.add.text(this.game.canvas.width / 2, 150, 'Saved: ' + this.lives, { font: "40px Callibri", fill: "#ffffff" });
        this.endText = this.add.text(this.game.canvas.width / 2, 150, 'Saved: ' + this.lives, { font: "40px Callibri", fill: "#ffffff" });
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.PJmovement();
        this.fireWithLeftMouse();
        this.updateText();
        this.physics.arcade.collide(this.fireballs, this.monsters, this.fireballHitMonster, null, this);
    };
    mainState.prototype.PJmovement = function () {
        if (this.lives > 0) {
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
        }
    };
    mainState.prototype.fireWithLeftMouse = function () {
        if (this.lives > 0) {
            if (this.input.activePointer.isDown) {
                this.shoot();
            }
        }
    };
    mainState.prototype.shoot = function () {
        if (this.time.now > this.nextFire && this.fireballs.countDead() > 0) {
            this.nextFire = this.time.now + this.fireRate;
            var fireball = this.fireballs.getFirstDead();
            if (fireball) {
                fireball.reset(this.player.x + 15, this.player.y - 15);
                if (this.rightStance)
                    fireball.body.velocity.x = this.FB_MAX_SPEED;
                else
                    fireball.body.velocity.x = -this.FB_MAX_SPEED;
            }
        }
    };
    mainState.prototype.fireballHitMonster = function (fireball, monster) {
        var tweenIn = this.add.tween(this.scoreText).to({ alpha: 1 }, 50);
        tweenIn.start();
        fireball.kill();
        this.killed += 1;
        monster.body.enable = false;
        monster.animations.play('died', 10, false, true);
        monster.animations.currentAnim.onComplete.addOnce(function () {
            monster.kill();
        });
        this.deathSound.play();
        var tweenOut = this.add.tween(this.scoreText).to({ alpha: 0 }, 1500);
        tweenIn.onComplete.add(function () {
            tweenOut.start();
        });
    };
    mainState.prototype.updateText = function () {
        this.scoreText.text = 'Killed: ' + this.killed;
        this.livesText.text = 'Saved: ' + this.lives;
    };
    mainState.prototype.restart = function () {
        this.lives = this.PJ_MAX_LIFES;
        this.killed = 0;
        this.game.paused = false;
        this.game.state.restart();
    };
    return mainState;
})(Phaser.State);
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.anchor.setTo(0.5, 0.5);
        this.body.bounce.setTo(0.9);
        this.checkWorldBounds = true;
        this.body.collideWorldBounds = true;
        this.animations.add('walk', [10, 12, 14, 16, 18], 10, true);
        this.animations.add('died', [34, 36, 38, 40, 42, 44, 46], 15, false);
        this.outOfBoundsKill = true;
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
        this.scale.setTo(0.2, 0.2);
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