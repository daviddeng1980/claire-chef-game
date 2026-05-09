// 街区场景
class StreetScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.STREET });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#90EE90');
        
        // 创建地面
        this.createGround();
        
        // 创建建筑
        this.createBuildings();
        
        // 创建玩家角色
        this.createPlayer();
        
        // 创建状态栏
        this.statusBar = new StatusBar(this, 375, 60);
        
        // 创建导航栏
        this.createNavigation();
        
        // 自动保存
        this.time.addEvent({
            delay: 60000, // 每分钟自动保存
            callback: this.autoSave,
            callbackScope: this,
            loop: true
        });
    }
    
    createGround() {
        // 创建街道
        const graphics = this.add.graphics();
        
        // 草地
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillRect(0, 0, 750, 1334);
        
        // 道路
        graphics.fillStyle(0xD3D3D3, 1);
        graphics.fillRect(100, 400, 550, 600);
        
        // 道路标线
        graphics.fillStyle(0xFFFFFF, 1);
        for (let y = 450; y < 1000; y += 100) {
            graphics.fillRect(370, y, 10, 50);
        }
        
        // 人行道
        graphics.fillStyle(0xA9A9A9, 1);
        graphics.fillRect(80, 380, 590, 20);
        graphics.fillRect(80, 1000, 590, 20);
    }
    
    createBuildings() {
        this.buildings = [];
        
        const buildingConfigs = [
            { id: 'home', x: 375, y: 300, name: '家' },
            { id: 'restaurant', x: 200, y: 550, name: '饭店' },
            { id: 'barbershop', x: 550, y: 550, name: '理发店' },
            { id: 'mall', x: 375, y: 750, name: '商场' },
            { id: 'cinema', x: 200, y: 950, name: '电影院' },
            { id: 'cooking_school', x: 550, y: 950, name: '烹饪学校' }
        ];
        
        buildingConfigs.forEach(config => {
            const building = this.add.image(config.x, config.y, config.id)
                .setInteractive({ useHandCursor: true });
            
            // 建筑名称
            const nameText = this.add.text(config.x, config.y + 60, config.name, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333',
                backgroundColor: '#FFFFFF',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
            
            // 交互效果
            building.on('pointerover', () => {
                building.setScale(1.1);
                nameText.setScale(1.1);
            });
            
            building.on('pointerout', () => {
                building.setScale(1);
                nameText.setScale(1);
            });
            
            building.on('pointerdown', () => {
                this.enterBuilding(config.id);
            });
            
            this.buildings.push({ sprite: building, name: nameText, id: config.id });
        });
    }
    
    createPlayer() {
        // 玩家角色（初始位置在街道中央）
        this.player = this.add.image(375, 700, 'claire');
        this.player.setScale(1.5);
        
        // 玩家名称
        this.playerName = this.add.text(375, 640, '克莱尔', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            backgroundColor: '#FFFFFF',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        
        // 添加简单的待机动画
        this.tweens.add({
            targets: [this.player, this.playerName],
            y: '+=10',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    

    
    createNavigation() {
        const width = this.cameras.main.width;
        const navY = 1250;
        
        // 导航栏背景
        const navBg = this.add.graphics();
        navBg.fillStyle(0xFFFFFF, 0.95);
        navBg.fillRoundedRect(10, navY - 20, 730, 80, 10);
        
        // 导航按钮
        const navItems = [
            { icon: '🏠', text: '主页', x: 70 },
            { icon: '🎒', text: '背包', x: 180 },
            { icon: '🏆', text: '成就', x: 290 },
            { icon: '👤', text: '角色', x: 400 },
            { icon: '⚙️', text: '设置', x: 510 }
        ];
        
        navItems.forEach(item => {
            const btn = this.add.container(item.x, navY + 20);
            
            const icon = this.add.text(0, -15, item.icon, {
                fontSize: '32px'
            }).setOrigin(0.5);
            
            const text = this.add.text(0, 15, item.text, {
                fontSize: '20px',
                fontFamily: 'Microsoft YaHei',
                color: '#666666'
            }).setOrigin(0.5);
            
            btn.add([icon, text]);
            btn.setSize(80, 60);
            btn.setInteractive({ useHandCursor: true });
            
            btn.on('pointerdown', () => {
                this.handleNavigation(item.text);
            });
        });
    }
    
    enterBuilding(buildingId) {
        // 根据建筑类型进入不同场景
        switch (buildingId) {
            case 'home':
                this.showHomeMenu();
                break;
            case 'restaurant':
                this.showRestaurantMenu();
                break;
            case 'barbershop':
                this.showBarbershopMenu();
                break;
            case 'mall':
                this.scene.start(CONSTANTS.SCENES.SHOP);
                break;
            case 'cinema':
                this.showCinemaMenu();
                break;
            case 'cooking_school':
                this.showCookingSchoolMenu();
                break;
        }
    }
    
    showHomeMenu() {
        this.showBuildingMenu('家', [
            { text: '休息恢复', callback: () => this.restAtHome() },
            { text: '查看菜谱', callback: () => this.scene.start('RecipeScene') },
            { text: '我的厨房', callback: () => this.scene.start('KitchenScene') },
            { text: '烹饪练习', callback: () => this.scene.start(CONSTANTS.SCENES.COOKING) }
        ]);
    }
    
    showRestaurantMenu() {
        this.showBuildingMenu('饭店', [
            { text: '打工赚钱', callback: () => this.showWorkOptions() },
            { text: '挑战游戏', callback: () => this.scene.start(CONSTANTS.SCENES.MINIGAME) }
        ]);
    }
    
    showBarbershopMenu() {
        this.showBuildingMenu('理发店', [
            { text: '石头剪刀布', callback: () => this.playGame('rock_paper_scissors') },
            { text: '记忆翻牌', callback: () => this.playGame('memory') }
        ]);
    }
    
    showCinemaMenu() {
        this.showBuildingMenu('电影院', [
            { text: '观看纪录片', callback: () => this.watchDocumentary() },
            { text: '烹饪节目', callback: () => this.watchCookingShow() }
        ]);
    }
    
    showCookingSchoolMenu() {
        this.showBuildingMenu('烹饪学校', [
            { text: '学习技能', callback: () => this.scene.start('SkillScene') },
            { text: '参加考核', callback: () => this.takeExam() }
        ]);
    }
    
    showBuildingMenu(buildingName, options) {
        // 创建菜单面板
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, buildingName, {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        let currentY = 620;
        const buttons = [];
        
        options.forEach(option => {
            const btn = this.add.image(375, currentY, 'button')
                .setInteractive({ useHandCursor: true });
            
            const btnText = this.add.text(375, currentY, option.text, {
                fontSize: '28px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            
            btn.on('pointerdown', () => {
                panel.destroy();
                title.destroy();
                buttons.forEach(b => { b.btn.destroy(); b.text.destroy(); });
                option.callback();
            });
            
            buttons.push({ btn, text: btnText });
            currentY += 80;
        });
        
        // 关闭按钮
        const closeBtn = this.add.image(375, currentY + 20, 'button')
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(375, currentY + 20, '离开', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            buttons.forEach(b => { b.btn.destroy(); b.text.destroy(); });
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    handleNavigation(navType) {
        switch (navType) {
            case '主页':
                // 已经在主页
                break;
            case '背包':
                this.scene.start('InventoryScene');
                break;
            case '成就':
                this.scene.start('AchievementScene');
                break;
            case '角色':
                this.scene.start('CharacterScene');
                break;
            case '设置':
                this.scene.start(CONSTANTS.SCENES.MENU);
                break;
        }
    }
    
    showInventory() {
        // 显示背包界面
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '背包', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const closeBtn = this.add.image(375, 900, 'button')
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(375, 900, '关闭', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    showQuests() {
        // 显示任务界面
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '任务', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const closeBtn = this.add.image(375, 900, 'button')
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(375, 900, '关闭', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    showCharacter() {
        // 显示角色信息
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '角色信息', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const closeBtn = this.add.image(375, 900, 'button')
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(375, 900, '关闭', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    restAtHome() {
        // 恢复体力
        alert('克莱尔休息了一会儿，体力恢复了！');
    }
    
    showRecipes() {
        alert('查看菜谱功能开发中...');
    }
    
    showWorkOptions() {
        this.showBuildingMenu('打工赚钱', [
            { text: '算术题 (5体力)', callback: () => this.scene.start('WorkScene', { workType: 'math' }) },
            { text: '洗碗 (8体力)', callback: () => this.scene.start('WorkScene', { workType: 'dishwashing' }) },
            { text: '端盘子 (10体力)', callback: () => this.scene.start('WorkScene', { workType: 'balancing' }) },
            { text: '收银 (10体力)', callback: () => this.scene.start('WorkScene', { workType: 'cashier' }) }
        ]);
    }
    
    playGame(gameType) {
        this.scene.start(CONSTANTS.SCENES.MINIGAME, { gameType });
    }
    
    watchDocumentary() {
        alert('观看纪录片，获得烹饪灵感！');
    }
    
    watchCookingShow() {
        alert('观看烹饪节目，学习新技巧！');
    }
    
    learnSkills() {
        alert('学习技能功能开发中...');
    }
    
    takeExam() {
        alert('参加考核功能开发中...');
    }
    
    autoSave() {
        // 自动保存游戏数据
        const gameState = {
            player: window.gamePlayer ? window.gamePlayer.getData() : null,
            timestamp: Date.now()
        };
        SaveSystem.save(gameState);
        console.log('游戏已自动保存');
    }
}
