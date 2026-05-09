// 主菜单场景
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.MENU });
    }
    
    init(data) {
        this.loadSave = data.loadSave || false;
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 创建装饰背景
        this.createDecorations();
        
        // 游戏标题
        this.add.text(width / 2, 200, '克莱尔是个大厨师', {
            fontSize: '60px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 副标题
        this.add.text(width / 2, 280, '🦞 养成类烹饪游戏', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 角色展示
        const playerSprite = this.add.image(width / 2, 450, 'player');
        playerSprite.setScale(2);
        
        // 添加简单的浮动动画
        this.tweens.add({
            targets: playerSprite,
            y: 460,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 创建菜单按钮
        this.createMenuButtons();
        
        // 检查每日签到
        this.checkDailyReward();
        
        // 版本信息
        this.add.text(width / 2, height - 50, 'v1.4.0 - 龙虾工作室', {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);
        
        // 如果有存档，加载存档
        if (this.loadSave) {
            this.loadGameData();
        }
    }
    
    checkDailyReward() {
        if (window.gameDailyReward && window.gameDailyReward.canClaim()) {
            this.showDailyRewardButton();
        }
    }
    
    showDailyRewardButton() {
        const reward = window.gameDailyReward.getTodayReward();
        const consecutiveDays = window.gameDailyReward.getConsecutiveDays();
        
        // 签到按钮背景
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xFFE66D, 1);
        btnBg.fillRoundedRect(250, 380, 250, 80, 15);
        btnBg.setInteractive(new Phaser.Geom.Rectangle(250, 380, 250, 80), Phaser.Geom.Rectangle.Contains);
        
        const btnText = this.add.text(375, 420, `🎁 每日签到 (第${consecutiveDays + 1}天)`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        btnBg.on('pointerdown', () => {
            this.claimDailyReward();
        });
        btnText.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.claimDailyReward();
        });
    }
    
    claimDailyReward() {
        if (!window.gamePlayer) return;
        
        const result = window.gameDailyReward.claim(window.gamePlayer);
        
        // 显示奖励弹窗
        const panel = this.add.graphics();
        panel.fillStyle(0xFFFFFF, 1);
        panel.fillRoundedRect(175, 500, 400, 300, 20);
        panel.setScrollFactor(0);
        
        const title = this.add.text(375, 560, '🎉 签到成功!', {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);
        
        const rewardText = this.add.text(375, 640, `连续签到第${result.day}天\n\n+${result.gold}金币\n+${result.exp}经验`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        
        const closeBtn = this.add.graphics();
        closeBtn.fillStyle(0xFF6B6B, 1);
        closeBtn.fillRoundedRect(300, 720, 150, 50, 10);
        closeBtn.setScrollFactor(0);
        
        const closeText = this.add.text(375, 745, '确定', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0);
        
        closeBtn.setInteractive(new Phaser.Geom.Rectangle(300, 720, 150, 50), Phaser.Geom.Rectangle.Contains);
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            rewardText.destroy();
            closeBtn.destroy();
            closeText.destroy();
        });
        closeText.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            rewardText.destroy();
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    createDecorations() {
        // 添加一些装饰性的食物emoji
        const decorations = ['🍅', '🥕', '🥚', '🍜', '🥩', '🦞'];
        
        for (let i = 0; i < 8; i++) {
            const x = Phaser.Math.Between(50, 700);
            const y = Phaser.Math.Between(100, 1200);
            const emoji = decorations[Phaser.Math.Between(0, decorations.length - 1)];
            
            const text = this.add.text(x, y, emoji, {
                fontSize: '40px'
            }).setAlpha(0.3);
            
            // 添加旋转动画
            this.tweens.add({
                targets: text,
                angle: Phaser.Math.Between(-30, 30),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createMenuButtons() {
        const width = this.cameras.main.width;
        const startY = 700;
        const buttonSpacing = 100;
        
        // 开始游戏按钮
        this.createButton(width / 2, startY, '开始游戏', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
        
        // 设置按钮
        this.createButton(width / 2, startY + buttonSpacing, '设置', () => {
            this.showSettings();
        });
        
        // 关于按钮
        this.createButton(width / 2, startY + buttonSpacing * 2, '关于', () => {
            this.showAbout();
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.image(x, y, 'button')
            .setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        // 按钮交互效果
        button.on('pointerover', () => {
            button.setScale(1.05);
            buttonText.setScale(1.05);
        });
        
        button.on('pointerout', () => {
            button.setScale(1);
            buttonText.setScale(1);
        });
        
        button.on('pointerdown', () => {
            button.setScale(0.95);
            buttonText.setScale(0.95);
        });
        
        button.on('pointerup', () => {
            button.setScale(1);
            buttonText.setScale(1);
            callback();
        });
        
        return button;
    }
    
    showSettings() {
        // 创建设置面板
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '设置', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 音效开关
        const soundText = this.add.text(250, 620, '音效:', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0, 0.5);
        
        const soundToggle = this.add.text(450, 620, '🔊 开启', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        let soundEnabled = true;
        soundToggle.on('pointerdown', () => {
            soundEnabled = !soundEnabled;
            soundToggle.setText(soundEnabled ? '🔊 开启' : '🔇 关闭');
        });
        
        // 音乐开关
        const musicText = this.add.text(250, 700, '音乐:', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0, 0.5);
        
        const musicToggle = this.add.text(450, 700, '🔊 开启', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        
        let musicEnabled = true;
        musicToggle.on('pointerdown', () => {
            musicEnabled = !musicEnabled;
            musicToggle.setText(musicEnabled ? '🔊 开启' : '🔇 关闭');
        });
        
        // 删除存档按钮
        const deleteBtn = this.createButton(375, 800, '删除存档', () => {
            if (confirm('确定要删除所有存档数据吗？此操作不可恢复！')) {
                SaveSystem.delete();
                alert('存档已删除');
                this.scene.restart();
            }
        });
        
        // 关闭按钮
        const closeBtn = this.createButton(375, 900, '关闭', () => {
            panel.destroy();
            title.destroy();
            soundText.destroy();
            soundToggle.destroy();
            musicText.destroy();
            musicToggle.destroy();
            deleteBtn.destroy();
            closeBtn.destroy();
        });
    }
    
    showAbout() {
        // 创建关于面板
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '关于', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const aboutText = this.add.text(375, 650, 
            '克莱尔是个大厨师\n\n' +
            '一款养成类烹饪游戏\n' +
            '帮助克莱尔从新手成长为五星级大厨\n\n' +
            '开发者: 龙虾工作室 🦞\n' +
            '版本: v1.0.0', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);
        
        // 关闭按钮
        const closeBtn = this.createButton(375, 850, '关闭', () => {
            panel.destroy();
            title.destroy();
            aboutText.destroy();
            closeBtn.destroy();
        });
    }
    
    loadGameData() {
        const saveData = SaveSystem.load();
        if (saveData && saveData.player) {
            // 这里应该将存档数据加载到游戏系统中
            console.log('加载存档:', saveData);
        }
    }
}
