// 烹饪场景
class CookingScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.COOKING });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 创建厨房背景
        this.createKitchenBackground();
        
        // 创建UI
        this.createUI();
        
        // 创建烹饪区域
        this.createCookingArea();
        
        // 创建返回按钮
        this.createBackButton();
    }
    
    createKitchenBackground() {
        const graphics = this.add.graphics();
        
        // 墙壁
        graphics.fillStyle(0xFFE4C4, 1);
        graphics.fillRect(0, 0, 750, 800);
        
        // 地板
        graphics.fillStyle(0xD2B48C, 1);
        graphics.fillRect(0, 800, 750, 534);
        
        // 厨房台面
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(50, 600, 650, 200);
        
        // 灶台
        graphics.fillStyle(0x696969, 1);
        graphics.fillRect(200, 550, 150, 80);
        graphics.fillRect(400, 550, 150, 80);
        
        // 火焰效果（简化）
        graphics.fillStyle(0xFF4500, 0.8);
        graphics.fillCircle(275, 570, 20);
        graphics.fillCircle(475, 570, 20);
    }
    
    createUI() {
        // 标题
        this.add.text(375, 50, '烹饪厨房', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 当前菜谱
        this.recipeText = this.add.text(375, 120, '选择菜谱开始烹饪', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
    }
    
    createCookingArea() {
        // 烹饪区域
        const cookingArea = this.add.rectangle(375, 500, 500, 300, 0xFFFFFF, 0.5);
        
        // 选择菜谱按钮
        const selectRecipeBtn = this.add.image(375, 400, 'button')
            .setInteractive({ useHandCursor: true });
        
        this.add.text(375, 400, '选择菜谱', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        selectRecipeBtn.on('pointerdown', () => {
            this.showRecipeList();
        });
        
        // 开始烹饪按钮（初始禁用）
        this.startCookBtn = this.add.image(375, 500, 'button')
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5);
        
        this.startCookText = this.add.text(375, 500, '开始烹饪', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.startCookBtn.on('pointerdown', () => {
            if (this.selectedRecipe) {
                this.startCooking();
            }
        });
        
        // 食材展示区域
        this.ingredientsContainer = this.add.container(375, 650);
    }
    
    createBackButton() {
        const backBtn = this.add.text(50, 50, '← 返回', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
    }
    
    showRecipeList() {
        // 显示菜谱列表面板
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, '选择菜谱', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 示例菜谱
        const recipes = [
            { id: 'tomato_egg', name: '番茄炒蛋', difficulty: '⭐', ingredients: '鸡蛋×3, 西红柿×2' },
            { id: 'fried_rice', name: '蛋炒饭', difficulty: '⭐', ingredients: '米饭×1, 鸡蛋×2' },
            { id: 'noodles', name: '清汤面', difficulty: '⭐⭐', ingredients: '面条×1, 青菜×2' }
        ];
        
        let currentY = 600;
        const buttons = [];
        
        recipes.forEach(recipe => {
            const btn = this.add.image(375, currentY, 'button')
                .setInteractive({ useHandCursor: true });
            
            const btnText = this.add.text(375, currentY, `${recipe.name} ${recipe.difficulty}`, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            
            const ingredientsText = this.add.text(375, currentY + 25, recipe.ingredients, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            
            btn.on('pointerdown', () => {
                this.selectRecipe(recipe);
                panel.destroy();
                title.destroy();
                buttons.forEach(b => {
                    b.btn.destroy();
                    b.text.destroy();
                    b.ingredients.destroy();
                });
            });
            
            buttons.push({ btn, text: btnText, ingredients: ingredientsText });
            currentY += 80;
        });
        
        // 关闭按钮
        const closeBtn = this.add.image(375, currentY + 20, 'button')
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(375, currentY + 20, '取消', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            buttons.forEach(b => {
                b.btn.destroy();
                b.text.destroy();
                b.ingredients.destroy();
            });
            closeBtn.destroy();
            closeText.destroy();
        });
    }
    
    selectRecipe(recipe) {
        this.selectedRecipe = recipe;
        this.recipeText.setText(`当前菜谱: ${recipe.name}`);
        
        // 启用开始烹饪按钮
        this.startCookBtn.setAlpha(1);
        
        // 显示所需食材
        this.ingredientsContainer.removeAll(true);
        
        const ingredientsText = this.add.text(0, 0, `所需食材: ${recipe.ingredients}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        this.ingredientsContainer.add(ingredientsText);
    }
    
    startCooking() {
        // 开始烹饪流程
        this.recipeText.setText('烹饪中...');
        this.startCookBtn.setAlpha(0.5);
        
        // 模拟烹饪过程
        let progress = 0;
        const progressBar = this.add.graphics();
        
        const cookingInterval = setInterval(() => {
            progress += 10;
            
            progressBar.clear();
            progressBar.fillStyle(0xFF6B6B, 1);
            progressBar.fillRoundedRect(175, 750, 400 * (progress / 100), 30, 5);
            
            if (progress >= 100) {
                clearInterval(cookingInterval);
                this.completeCooking();
                progressBar.destroy();
            }
        }, 200);
    }
    
    completeCooking() {
        // 烹饪完成
        this.recipeText.setText('烹饪完成！');
        
        // 显示结果
        const resultPanel = this.add.image(375, 667, 'panel');
        
        const resultTitle = this.add.text(375, 550, '烹饪成功！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const resultText = this.add.text(375, 650, 
            `菜品: ${this.selectedRecipe.name}\n` +
            `味道: ⭐⭐⭐⭐\n` +
            `外观: ⭐⭐⭐\n` +
            `创意: ⭐⭐⭐⭐\n\n` +
            `获得: 50经验, 30金币`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);
        
        // 确定按钮
        const confirmBtn = this.add.image(375, 800, 'button')
            .setInteractive({ useHandCursor: true });
        
        const confirmText = this.add.text(375, 800, '确定', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        confirmBtn.on('pointerdown', () => {
            resultPanel.destroy();
            resultTitle.destroy();
            resultText.destroy();
            confirmBtn.destroy();
            confirmText.destroy();
            
            // 重置状态
            this.selectedRecipe = null;
            this.recipeText.setText('选择菜谱开始烹饪');
            this.ingredientsContainer.removeAll(true);
        });
    }
}
