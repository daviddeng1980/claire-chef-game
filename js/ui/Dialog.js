// 对话框组件
class Dialog {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isVisible = false;
    }
    
    show(title, content, buttons = []) {
        if (this.isVisible) this.hide();
        
        this.container = this.scene.add.container(375, 667);
        
        // 半透明背景
        const overlay = this.scene.add.rectangle(0, 0, 750, 1334, 0x000000, 0.5);
        overlay.setInteractive();
        this.container.add(overlay);
        
        // 对话框背景
        const dialogBg = this.scene.add.graphics();
        dialogBg.fillStyle(0xFFFFFF, 1);
        dialogBg.fillRoundedRect(-300, -200, 600, 400, 20);
        dialogBg.lineStyle(4, 0xFF6B6B, 1);
        dialogBg.strokeRoundedRect(-300, -200, 600, 400, 20);
        this.container.add(dialogBg);
        
        // 标题
        const titleText = this.scene.add.text(0, -150, title, {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(titleText);
        
        // 内容
        const contentText = this.scene.add.text(0, -50, content, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.container.add(contentText);
        
        // 按钮
        if (buttons.length === 0) {
            buttons = [{ text: '确定', callback: () => this.hide() }];
        }
        
        const buttonY = 100;
        const buttonSpacing = 220;
        const startX = -(buttons.length - 1) * buttonSpacing / 2;
        
        buttons.forEach((btn, index) => {
            const x = startX + index * buttonSpacing;
            
            const button = this.scene.add.image(x, buttonY, 'button_new')
                .setInteractive({ useHandCursor: true });
            
            const buttonText = this.scene.add.text(x, buttonY, btn.text, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            
            button.on('pointerdown', () => {
                if (btn.callback) btn.callback();
                this.hide();
            });
            
            this.container.add([button, buttonText]);
        });
        
        this.isVisible = true;
        
        // 添加出现动画
        this.container.setScale(0);
        this.scene.tweens.add({
            targets: this.container,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
    }
    
    hide() {
        if (!this.container) return;
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.8,
            duration: 150,
            onComplete: () => {
                this.container.destroy();
                this.container = null;
                this.isVisible = false;
            }
        });
    }
    
    confirm(title, content, onConfirm, onCancel) {
        this.show(title, content, [
            { text: '取消', callback: onCancel },
            { text: '确定', callback: onConfirm }
        ]);
    }
    
    alert(title, content, callback) {
        this.show(title, content, [
            { text: '确定', callback: callback }
        ]);
    }
}
