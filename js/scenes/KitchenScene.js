// 厨房场景 - 用具升级
class KitchenScene extends Phaser.Scene {
    constructor() {
        super({ key: 'KitchenScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 标题
        this.add.text(width/2, 50, '我的厨房', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 厨房评级
        const rating = window.gameKitchen.getKitchenRating();
        this.add.text(width/2, 110, `${rating.stars} ${rating.rating}`, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: rating.color
        }).setOrigin(0.5);
        
        // 总星数
        this.add.text(width/2, 150, `总星级: ${window.gameKitchen.getTotalStars()}/48`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 用具网格
        this.createUtensilsGrid();
        
        // 返回按钮
        this.createBackButton();
    }
    
    createUtensilsGrid() {
        const utensils = window.gameKitchen.getAllUtensils();
        const startY = 220;
        const cols = 4;
        const cellWidth = 170;
        const cellHeight = 180;
        
        utensils.forEach((utensil, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = 95 + col * cellWidth;
            const y = startY + row * cellHeight;
            
            this.createUtensilCell(x, y, utensil);
        });
    }
    
    createUtensilCell(x, y, utensil) {
        // 背景面板
        const panel = this.add.graphics();
        panel.fillStyle(0xFFFFFF, 1);
        panel.fillRoundedRect(x - 75, y - 70, 150, 160, 10);
        panel.lineStyle(2, this.getLevelColor(utensil.level), 1);
        panel.strokeRoundedRect(x - 75, y - 70, 150, 160, 10);
        
        // 图标
        this.add.text(x, y - 35, utensil.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);
        
        // 名称
        this.add.text(x, y + 5, utensil.name, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 等级
        this.add.text(x, y + 40, `Lv.${utensil.level}`, {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: this.getLevelColor(utensil.level)
        }).setOrigin(0.5);
        
        // 升级按钮
        if (utensil.level < utensil.maxLevel) {
            const cost = window.gameKitchen.getUpgradeCost(utensil.id);
            const btn = this.add.graphics();
            btn.fillStyle(0xFF6B6B, 1);
            btn.fillRoundedRect(x - 55, y + 60, 110, 40, 8);
            
            this.add.text(x, y + 80, `升级 ${cost}💰`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.upgradeUtensil(utensil.id));
        } else {
            this.add.text(x, y + 80, '已满级', {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFD700'
            }).setOrigin(0.5);
        }
    }
    
    getLevelColor(level) {
        const colors = { 1: '#999999', 2: '#CD7F32', 3: '#C0C0C0', 4: '#C0C0C0', 5: '#FFD700', 6: '#00BFFF' };
        return colors[level] || '#999999';
    }
    
    upgradeUtensil(utensilId) {
        const result = window.gameKitchen.upgradeUtensil(utensilId);
        if (result.success) {
            this.showMessage(result.message, '#00AA00');
            this.scene.restart();
        } else {
            this.showMessage(result.message, '#FF0000');
        }
    }
    
    showMessage(text, color) {
        const msg = this.add.text(375, 1200, text, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: color,
            backgroundColor: '#FFFFFF',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: msg,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
    
    createBackButton() {
        const btn = this.add.graphics();
        btn.fillStyle(0xFF6B6B, 1);
        btn.fillRoundedRect(20, 20, 120, 50, 10);
        
        this.add.text(80, 45, '← 返回', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('StreetScene'));
    }
}