// 建筑实体
class Building extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture || 'building');
        scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.scene = scene;
        this.config = {
            id: config.id || '',
            name: config.name || '建筑',
            type: config.type || 'generic',
            onEnter: config.onEnter || null
        };
        
        this.setupInteraction();
    }
    
    setupInteraction() {
        this.on('pointerover', () => {
            this.setScale(1.1);
        });
        
        this.on('pointerout', () => {
            this.setScale(1);
        });
        
        this.on('pointerdown', () => {
            if (this.config.onEnter) {
                this.config.onEnter(this);
            }
        });
    }
    
    setBuildingName(name) {
        this.config.name = name;
    }
    
    getBuildingId() {
        return this.config.id;
    }
    
    setBuildingType(type) {
        this.config.type = type;
    }
}
