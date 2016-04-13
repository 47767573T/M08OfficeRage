/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    monsters:Phaser.Group;

    private player:Phaser.Sprite;

    //Player Animation
    private PJ_FRAME_WIDTH = 64;
    private PJ_FRAME_HEIGHT = 32;
    private PJ_SCALE = 1.5;
    private PJ_FRAME_RATE = 10;
    private PJ_MAX_SPEED = 200;
    private PJ_GRAVITY = 500;
    private jumpTimer = 0;
    private rightStance = true;

    //Monsters Animation
    private MOB_QUANTITY = 30;
    private MOB_FRAME_WIDTH = 64;
    private MOB_FRAME_HEIGHT = 36;
    private MOB_GRAVITY = 700;

    //Controles
    private cursor:Phaser.CursorKeys;
    private upBtn = null;
    private leftBtn = null;
    private rightBtn = null;
    private downBtn;



    preload():void {

        super.preload();

        this.load.image('bg1', 'assets/background1.jpg');
        this.load.spritesheet('playerAnimation', 'assets/allAnimation.png', this.PJ_FRAME_WIDTH, this.PJ_FRAME_HEIGHT, 66);
        this.load.spritesheet('monsterAnimation', 'assets/monsters.png', this.MOB_FRAME_WIDTH, this.MOB_FRAME_HEIGHT, 24);
        //this.load.spritesheet('fireball', 'assets/flameShotSet.png', this.FRAME_WIDTH, this.FRAME_HEIGHT, 6);
        this.load.audio('blaster', 'assets/audio/SoundEffects/blaster.mp3');


        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    create():void {

        super.create();
        this.configControls();
        this.createBG('bg1');
        this.createPlayer();
        this.createMonsters();
    }

    private configControls () {

        this.cursor = this.input.keyboard.createCursorKeys();

        this.upBtn = this.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftBtn = this.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightBtn = this.input.keyboard.addKey(Phaser.Keyboard.D);
        console.log("cargados controles");

    }

    private createBG(backGroundKey) {

        var bg = this.add.sprite(0, 0, backGroundKey);
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);

    }

    private createPlayer(){

        this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'playerAnimation');

        this.player.scale.setTo(this.PJ_SCALE, this.PJ_SCALE);
        this.player.anchor.setTo(0, 1);

        this.playerAnimationsLoad();

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.checkWorldBounds = true;
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.PJ_MAX_SPEED, this.PJ_MAX_SPEED);

        this.player.body.gravity.y = this.PJ_GRAVITY;
    }

    private playerAnimationsLoad(){

        this.player.animations.add('iddleRight', [0,1,2,3], this.PJ_FRAME_RATE,true);
        this.player.animations.add('iddleLeft', [4,5,6,7], this.PJ_FRAME_RATE,true);
        this.player.animations.add('walkRight', [8,9,10,11,12,13,14,15], this.PJ_FRAME_RATE,true);
        this.player.animations.add('walkLeft', [16,17,18,19,20,21,22,23], this.PJ_FRAME_RATE,true);
        this.player.animations.add('jumpRight', [24,25,26,27,28,29,30,31], this.PJ_FRAME_RATE,true);
        this.player.animations.add('jumpLeft', [32,33,34,35,36,37,38,39], this.PJ_FRAME_RATE,true);
        this.player.animations.add('atqLiteRight', [40,41,42,43,44,45], this.PJ_FRAME_RATE,true);
        this.player.animations.add('atqLiteLeft', [46,47,48,49,50,51], this.PJ_FRAME_RATE,true);
        this.player.animations.add('deadRight', [52,53,54,55,56,57,58], this.PJ_FRAME_RATE,true);
        this.player.animations.add('deadRLeft', [59,60,61,62,63,64,65], this.PJ_FRAME_RATE,true);

    }

    private createMonsters(){

        this.monsters = this.add.group();
        this.monsters.enableBody = true;
        this.monsters.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < this.MOB_QUANTITY; i++){
            var monster = new Monster (this.game, 800, 100, 'monsterAnimation');
            var scale = this.rnd.integerInRange(0.4,1);

            monster.scale.setTo(scale, scale);
            monster.health = this.rnd.integerInRange(1,5);
            monster.body.velocity.x = -this.rnd.integerInRange(20, 50);
            monster.body.gravity.y = this.rnd.integerInRange(this.PJ_GRAVITY, this.MOB_GRAVITY);
            monster.scale.setTo(scale, scale);
            monster.animations.play('walk');
            monster.health = this.rnd.integerInRange(1,5);

            this.monsters.add(monster);
        }
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
        this.PJmovement();
    }

    private PJmovement(){

        if (this.leftBtn.isDown) {
            this.player.body.velocity.x = -this.PJ_MAX_SPEED;
            this.player.animations.play('walkLeft');
            this.rightStance = false;

        }else if (this.rightBtn.isDown) {
            this.player.body.velocity.x = this.PJ_MAX_SPEED;
            this.player.animations.play('walkRight');
            this.rightStance = true;

        } else {
            this.player.body.velocity.x = 0;

            if (this.rightStance) this.player.animations.play('iddleRight');
            else this.player.animations.play('iddleLeft');
        }

        if(this.upBtn.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer){
            this.player.body.velocity.y = -1600;
            this.jumpTimer = this.time.now + 750;

            if (this.rightStance) this.player.animations.play('jumpRight');
            else this.player.animations.play('jumpLeft');
        }
    }
}

class Monster extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture) {
        super(game, x, y, key);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);

        this.body.bounce.setTo(0.9);

        this.checkWorldBounds = true;
        this.body.collideWorldBounds = true;

        this.animations.add('walk', [5,6,7,8,9], 10,true);
        this.animations.add('dead', [17,18,19,20,21,22,23], 10,true);

    }
    update():void {
        super.update();
    }

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
