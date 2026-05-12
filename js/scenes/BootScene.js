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
        // 使用 AssetGenerator 生成精美素材
        const generator = new AssetGenerator(this);
        
        // 生成角色
        generator.generateClaire();
        
        // 生成建筑
        const buildings = ['home', 'restaurant', 'barbershop', 'mall', 'cinema', 'cooking_school'];
        buildings.forEach(building => {
            generator.generateBuilding(building);
        });
        
        // 生成食材
        const items = ['tomato', 'carrot', 'egg', 'meat', 'fish'];
        items.forEach(item => {
            generator.generateFoodItem(item);
        });
        
        // 生成UI
        generator.generateButton(280, 80);
        
        // 生成面板纹理
        const panelGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        panelGraphics.fillStyle(0xFFFFFF, 0.95);
        panelGraphics.fillRoundedRect(0, 0, 600, 400, 20);
        panelGraphics.lineStyle(4, 0xFF6B6B, 1);
        panelGraphics.strokeRoundedRect(0, 0, 600, 400, 20);
        panelGraphics.generateTexture('panel', 600, 400);
        
        // 生成背景
        generator.generateBackground('street');
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
        const continueBtn = this.add.image(width / 2, 900, 'button_new')
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
        const newGameBtn = this.add.image(width / 2, 1000, 'button_new')
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
