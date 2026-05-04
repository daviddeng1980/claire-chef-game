// 启动场景
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.BOOT });
    }
    
    preload() {
        // 显示加载进度
        this.createLoadingUI();
        
        // 监听加载进度
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xFF6B6B, 1);
            this.progressBar.fillRect(175, 650, 400 * value, 30);
            this.percentText.setText(`${Math.round(value * 100)}%`);
        });
        
        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();
        });
        
        // 加载资源
        this.loadAssets();
    }
    
    createLoadingUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 游戏标题
        this.add.text(width / 2, 400, '克莱尔是个大厨师', {
            fontSize: '64px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 副标题
        this.add.text(width / 2, 500, '从新手到五星级大厨的养成之路', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 进度条背景
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0xEEEEEE, 1);
        this.progressBox.fillRect(170, 645, 410, 40);
        
        // 进度条
        this.progressBar = this.add.graphics();
        
        // 加载文字
        this.loadingText = this.add.text(width / 2, 600, '加载中...', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 百分比
        this.percentText = this.add.text(width / 2, 700, '0%', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
    }
    
    loadAssets() {
        // 这里加载游戏资源
        // 由于是原型阶段，使用程序化生成的图形代替图片资源
        
        // 生成角色纹理
        this.generateCharacterTexture();
        
        // 生成建筑纹理
        this.generateBuildingTextures();
        
        // 生成物品纹理
        this.generateItemTextures();
        
        // 生成UI纹理
        this.generateUITextures();
    }
    
    generateCharacterTexture() {
        // 创建简单的角色图形
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // 身体
        graphics.fillStyle(0xFFCCAA, 1);
        graphics.fillCircle(32, 32, 30);
        
        // 厨师帽
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRect(15, 5, 34, 20);
        graphics.fillRect(10, 0, 44, 10);
        
        // 眼睛
        graphics.fillStyle(0x333333, 1);
        graphics.fillCircle(22, 30, 4);
        graphics.fillCircle(42, 30, 4);
        
        // 嘴巴
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillCircle(32, 40, 6);
        
        graphics.generateTexture('player', 64, 64);
    }
    
    generateBuildingTextures() {
        const buildings = [
            { key: 'home', color: 0xFFB6C1, icon: '🏠' },
            { key: 'restaurant', color: 0xFF6B6B, icon: '🍜' },
            { key: 'barbershop', color: 0x87CEEB, icon: '💈' },
            { key: 'mall', color: 0x98FB98, icon: '🏬' },
            { key: 'cinema', color: 0xDDA0DD, icon: '🎬' },
            { key: 'cooking_school', color: 0xF0E68C, icon: '📚' }
        ];
        
        buildings.forEach(building => {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            
            // 建筑主体
            graphics.fillStyle(building.color, 1);
            graphics.fillRoundedRect(0, 20, 100, 80, 10);
            
            // 屋顶
            graphics.fillStyle(0x8B4513, 1);
            graphics.fillTriangle(0, 20, 50, 0, 100, 20);
            
            // 门
            graphics.fillStyle(0x654321, 1);
            graphics.fillRect(35, 60, 30, 40);
            
            graphics.generateTexture(building.key, 100, 100);
        });
    }
    
    generateItemTextures() {
        const items = [
            { key: 'tomato', color: 0xFF6347 },
            { key: 'egg', color: 0xFFE4B5 },
            { key: 'carrot', color: 0xFFA500 },
            { key: 'potato', color: 0xDAA520 }
        ];
        
        items.forEach(item => {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(item.color, 1);
            graphics.fillCircle(32, 32, 30);
            graphics.generateTexture(item.key, 64, 64);
        });
    }
    
    generateUITextures() {
        // 按钮纹理
        const buttonGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        buttonGraphics.fillStyle(0xFF6B6B, 1);
        buttonGraphics.fillRoundedRect(0, 0, 200, 60, 10);
        buttonGraphics.generateTexture('button', 200, 60);
        
        // 面板纹理
        const panelGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        panelGraphics.fillStyle(0xFFFFFF, 0.95);
        panelGraphics.fillRoundedRect(0, 0, 600, 400, 20);
        panelGraphics.lineStyle(4, 0xFF6B6B, 1);
        panelGraphics.strokeRoundedRect(0, 0, 600, 400, 20);
        panelGraphics.generateTexture('panel', 600, 400);
    }
    
    create() {
        // 检查是否有存档
        if (SaveSystem.hasSave()) {
            // 显示继续游戏按钮
            this.showContinueButton();
        } else {
            // 直接进入主菜单
            this.scene.start(CONSTANTS.SCENES.MENU);
        }
    }
    
    showContinueButton() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const saveInfo = SaveSystem.getSaveInfo();
        
        // 存档信息
        this.add.text(width / 2, 800, `检测到存档: ${saveInfo.date}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 继续游戏按钮
        const continueBtn = this.add.image(width / 2, 900, 'button')
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width / 2, 900, '继续游戏', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        continueBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.MENU, { loadSave: true });
        });
        
        // 新游戏按钮
        const newGameBtn = this.add.image(width / 2, 1000, 'button')
            .setInteractive({ useHandCursor: true });
        
        this.add.text(width / 2, 1000, '新游戏', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        newGameBtn.on('pointerdown', () => {
            // 确认是否覆盖存档
            if (confirm('确定要开始新游戏吗？这将覆盖现有存档。')) {
                SaveSystem.delete();
                this.scene.start(CONSTANTS.SCENES.MENU);
            }
        });
    }
}
