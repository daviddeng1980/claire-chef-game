// 菜谱场景
class RecipeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RecipeScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 标题
        this.add.text(width/2, 50, '📖 菜谱大全', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 菜谱列表
        this.createRecipeList();
        
        // 返回按钮
        this.createBackButton();
    }
    
    createRecipeList() {
        const recipes = this.getRecipeData();
        const startY = 120;
        const itemHeight = 100;
        
        recipes.forEach((recipe, index) => {
            const y = startY + index * itemHeight;
            this.createRecipeItem(recipe, 375, y, index);
        });
        
        // 可滚动
        const totalHeight = startY + recipes.length * itemHeight + 100;
        if (totalHeight > 1334) {
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
                this.cameras.main.scrollY -= deltaY;
            });
        }
    }
    
    createRecipeItem(recipe, x, y, index) {
        const player = window.gamePlayer.data;
        const isUnlocked = player.recipes.includes(recipe.id);
        
        // 背景
        const panel = this.add.graphics();
        const bgColor = isUnlocked ? 0xFFFFFF : 0xEEEEEE;
        panel.fillStyle(bgColor, 1);
        panel.fillRoundedRect(x - 340, y - 40, 680, 80, 10);
        
        // 难度星级
        let stars = '';
        for (let i = 0; i < recipe.difficulty; i++) stars += '⭐';
        
        // 名称
        const nameColor = isUnlocked ? '#333333' : '#999999';
        this.add.text(x - 280, y - 15, recipe.name, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: nameColor
        }).setOrigin(0, 0.5);
        
        // 难度
        this.add.text(x - 280, y + 18, stars, {
            fontSize: '20px'
        }).setOrigin(0, 0.5);
        
        // 状态
        if (isUnlocked) {
            this.add.text(x + 250, y, '✓ 已解锁', {
                fontSize: '22px',
                fontFamily: 'Microsoft YaHei',
                color: '#00AA00'
            }).setOrigin(0.5);
        } else {
            this.add.text(x + 250, y, '🔒 未解锁', {
                fontSize: '22px',
                fontFamily: 'Microsoft YaHei',
                color: '#999999'
            }).setOrigin(0.5);
        }
    }
    
    getRecipeData() {
        return [
            { id: 'tomato_egg', name: '番茄炒蛋', difficulty: 1 },
            { id: 'egg_roll', name: '蛋卷', difficulty: 2 },
            { id: 'fried_rice', name: '炒饭', difficulty: 2 },
            { id: 'stir_fried_vegetables', name: '炒青菜', difficulty: 1 },
            { id: 'sweet_sour_pork', name: '糖醋里脊', difficulty: 4 },
            { id: 'mapo_tofu', name: '麻婆豆腐', difficulty: 3 },
            { id: 'kung_pao_chicken', name: '宫保鸡丁', difficulty: 4 },
            { id: 'twice_cooked_pork', name: '回锅肉', difficulty: 4 },
            { id: 'fish_flavor_eggplant', name: '鱼香茄子', difficulty: 3 },
            { id: 'steam_fish', name: '清蒸鱼', difficulty: 3 },
            { id: 'braised_pork', name: '红烧肉', difficulty: 3 },
            { id: 'peking_duck', name: '北京烤鸭', difficulty: 5 },
            { id: 'sushi', name: '寿司', difficulty: 3 },
            { id: 'sashimi', name: '刺身', difficulty: 4 },
            { id: 'tempura', name: '天妇罗', difficulty: 4 }
        ];
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