// 状态栏组件
class StatusBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(x, y);
        
        this.createBackground();
        this.createTexts();
        this.updateDisplay();
    }
    
    createBackground() {
        const bg = this.scene.add.graphics();
        bg.fillStyle(0xFFFFFF, 0.95);
        bg.fillRoundedRect(-360, -35, 720, 70, 10);
        
        this.container.add(bg);
    }
    
    createTexts() {
        // 玩家名称
        this.nameText = this.scene.add.text(-340, -20, '克莱尔', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        });
        
        // 金币
        this.goldText = this.scene.add.text(-150, -20, '💰 500', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        });
        
        // 体力
        this.energyText = this.scene.add.text(50, -20, '⚡ 100/100', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        });
        
        // 等级
        this.levelText = this.scene.add.text(250, -20, 'Lv.1', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        });
        
        this.container.add([this.nameText, this.goldText, this.energyText, this.levelText]);
    }
    
    updateDisplay() {
        if (!window.gamePlayer) return;
        
        const data = window.gamePlayer.getData();
        
        this.nameText.setText(data.name);
        this.goldText.setText(`💰 ${data.gold}`);
        this.energyText.setText(`⚡ ${data.energy}/${data.maxEnergy}`);
        this.levelText.setText(`Lv.${data.level}`);
        
        // 体力颜色变化
        if (data.energy < 20) {
            this.energyText.setColor('#FF0000');
        } else if (data.energy < 50) {
            this.energyText.setColor('#FFD700');
        } else {
            this.energyText.setColor('#333333');
        }
    }
    
    destroy() {
        this.container.destroy();
    }
}
