// 玩家实体
class Player extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture || 'player');
        scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.scene = scene;
        this.data = {
            name: '克莱尔',
            level: 1,
            health: 100,
            maxHealth: 100,
            speed: 5
        };
    }
    
    setPlayerData(data) {
        this.data = { ...this.data, ...data };
    }
    
    getPlayerData() {
        return this.data;
    }
    
    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 500,
            ease: 'Power2'
        });
    }
    
    playAnim(animKey) {
        if (this.scene.anims.exists(animKey)) {
            this.play(animKey);
        }
    }
}
