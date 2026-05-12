// NPC实体
class NPC extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture || 'npc');
        scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.scene = scene;
        this.config = {
            name: config.name || 'NPC',
            dialogue: config.dialogue || ['你好！'],
            onInteract: config.onInteract || null
        };
        
        this.setupInteraction();
    }
    
    setupInteraction() {
        this.on('pointerdown', () => {
            if (this.config.onInteract) {
                this.config.onInteract(this);
            } else {
                this.showDefaultDialogue();
            }
        });
    }
    
    showDefaultDialogue() {
        const dialogue = this.config.dialogue[0] || '你好！';
        if (this.scene.dialog) {
            this.scene.dialog.show(this.config.name, dialogue);
        }
    }
    
    setDialogue(dialogueArray) {
        this.config.dialogue = dialogueArray;
    }
    
    setName(name) {
        this.config.name = name;
    }
}
