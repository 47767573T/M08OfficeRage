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
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('bg1', 'assets/');
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
    };
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
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map