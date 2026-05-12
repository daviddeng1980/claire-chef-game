// 按钮组件
class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);
        
        this.config = {
            width: config.width || 200,
            height: config.height || 60,
            text: text || '按钮',
            callback: config.callback || null,
            textColor: config.textColor || '#FFFFFF',
            textSize: config.textSize || '24px',
            backgroundColor: config.backgroundColor || 0xFF6B6B,
            disabled: config.disabled || false
        };
        
        this.createButton();
        this.setupEvents();
    }
    
    createButton() {
        // 按钮背景
        this.background = this.scene.add.graphics();
        this.background.fillStyle(this.config.backgroundColor, 1);
        this.background.fillRoundedRect(-this.config.width/2, -this.config.height/2, this.config.width, this.config.height, 10);
        this.add(this.background);
        
        // 按钮文字
        this.textObj = this.scene.add.text(0, 0, this.config.text, {
            fontSize: this.config.textSize,
            fontFamily: 'Microsoft YaHei',
            color: this.config.textColor
        }).setOrigin(0.5);
        this.add(this.textObj);
        
        // 添加装饰线
        this.scene.add.graphics()
            .lineStyle(2, 0xFFFFFF, 0.5)
            .strokeRoundedRect(-this.config.width/2 + 10, -this.config.height/2 + 5, this.config.width - 20, this.config.height - 10, 8)
            .setDepth(1);
        
        // 使容器可交互
        this.setSize(this.config.width, this.config.height);
        this.setInteractive({ useHandCursor: true });
    }
    
    setupEvents() {
        this.on('pointerover', () => {
            if (!this.config.disabled) {
                this.setScale(1.05);
            }
        });
        
        this.on('pointerout', () => {
            if (!this.config.disabled) {
                this.setScale(1);
            }
        });
        
        this.on('pointerdown', () => {
            if (!this.config.disabled && this.config.callback) {
                this.config.callback();
            }
        });
    }
    
    setCallback(callback) {
        this.config.callback = callback;
    }
    
    setText(text) {
        this.textObj.setText(text);
        this.config.text = text;
    }
    
    setDisabled(disabled) {
        this.config.disabled = disabled;
        this.setAlpha(disabled ? 0.5 : 1);
    }
}
