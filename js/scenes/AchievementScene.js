// 成就场景
class AchievementScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AchievementScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 标题
        this.add.text(width/2, 50, '🏆 成就', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 进度
        const progress = window.gameAchievement.getProgress();
        this.add.text(width/2, 100, `已解锁: ${progress.unlocked}/${progress.total}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 成就列表
        this.createAchievementsList();
        
        // 返回按钮
        this.createBackButton();
    }
    
    createAchievementsList() {
        const achievements = window.gameAchievement.getAchievements();
        const startY = 160;
        const itemHeight = 90;
        
        achievements.forEach((achievement, index) => {
            const y = startY + index * itemHeight;
            this.createAchievementItem(achievement, 375, y, index);
        });
        
        // 设置场景高度以容纳所有成就
        const totalHeight = startY + achievements.length * itemHeight + 100;
        if (totalHeight > 1334) {
            this.cameras.main.setScrollY(0);
            // 让画面可以滚动
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
                this.cameras.main.scrollY -= deltaY;
            });
        }
    }
    
    createAchievementItem(achievement, x, y, index) {
        // 背景
        const panel = this.add.graphics();
        const bgColor = achievement.unlocked ? 0xFFF8DC : 0xEEEEEE;
        panel.fillStyle(bgColor, 1);
        panel.fillRoundedRect(x - 340, y - 35, 680, 70, 10);
        
        // 图标
        this.add.text(x - 280, y, achievement.icon, {
            fontSize: '36px'
        }).setOrigin(0.5);
        
        // 名称
        const nameColor = achievement.unlocked ? '#333333' : '#999999';
        this.add.text(x - 200, y - 10, achievement.name, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: nameColor
        }).setOrigin(0, 0.5);
        
        // 描述
        this.add.text(x - 200, y + 15, achievement.desc, {
            fontSize: '18px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0, 0.5);
        
        // 奖励
        if (achievement.unlocked) {
            this.add.text(x + 200, y, '✓', {
                fontSize: '32px',
                fontFamily: 'Microsoft YaHei',
                color: '#00AA00'
            }).setOrigin(0.5);
        } else {
            this.add.text(x + 200, y, `${achievement.reward.gold}💰 ${achievement.reward.exp}⭐`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FF6B6B'
            }).setOrigin(0.5);
        }
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