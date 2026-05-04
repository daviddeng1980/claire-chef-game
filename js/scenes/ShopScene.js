// 商店场景
class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.SHOP });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 创建商店背景
        this.createShopBackground();
        
        // 创建UI
        this.createUI();
        
        // 创建商品列表
        this.createShopItems();
        
        // 创建返回按钮
        this.createBackButton();
    }
    
    createShopBackground() {
        const graphics = this.add.graphics();
        
        // 商店内部
        graphics.fillStyle(0xFFE4C4, 1);
        graphics.fillRect(0, 0, 750, 1334);
        
        // 货架
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(50, 300, 650, 20);
        graphics.fillRect(50, 500, 650, 20);
        graphics.fillRect(50, 700, 650, 20);
        
        // 货架支柱
        graphics.fillRect(80, 200, 20, 600);
        graphics.fillRect(650, 200, 20, 600);
    }
    
    createUI() {
        // 标题
        this.add.text(375, 50, '商场', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 金币显示
        this.goldText = this.add.text(650, 50, '💰 500', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(1, 0);
        
        // 分类标签
        const categories = ['全部', '蔬菜', '肉类', '海鲜', '水果', '调料'];
        let categoryX = 80;
        
        categories.forEach((category, index) => {
            const categoryBtn = this.add.text(categoryX, 130, category, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: index === 0 ? '#FF6B6B' : '#666666',
                backgroundColor: index === 0 ? '#FFE4E1' : '#FFFFFF',
                padding: { x: 15, y: 8 }
            }).setInteractive({ useHandCursor: true });
            
            categoryBtn.on('pointerdown', () => {
                this.filterItems(category);
            });
            
            categoryX += 110;
        });
    }
    
    createShopItems() {
        // 示例商品数据
        this.shopItems = [
            { id: 'tomato', name: '西红柿', price: 10, icon: '🍅', category: '蔬菜', quality: 'common' },
            { id: 'carrot', name: '胡萝卜', price: 8, icon: '🥕', category: '蔬菜', quality: 'common' },
            { id: 'potato', name: '土豆', price: 5, icon: '🥔', category: '蔬菜', quality: 'common' },
            { id: 'egg', name: '鸡蛋', price: 3, icon: '🥚', category: '肉类', quality: 'common' },
            { id: 'pork', name: '猪肉', price: 30, icon: '🥩', category: '肉类', quality: 'good' },
            { id: 'fish', name: '鱼', price: 25, icon: '🐟', category: '海鲜', quality: 'good' },
            { id: 'shrimp', name: '虾', price: 40, icon: '🦐', category: '海鲜', quality: 'fine' },
            { id: 'apple', name: '苹果', price: 5, icon: '🍎', category: '水果', quality: 'common' },
            { id: 'salt', name: '盐', price: 2, icon: '🧂', category: '调料', quality: 'common' },
            { id: 'sugar', name: '糖', price: 4, icon: '🍬', category: '调料', quality: 'common' }
        ];
        
        this.itemContainer = this.add.container(0, 0);
        this.displayItems(this.shopItems);
    }
    
    displayItems(items) {
        this.itemContainer.removeAll(true);
        
        const startX = 100;
        const startY = 220;
        const itemWidth = 150;
        const itemHeight = 180;
        const columns = 4;
        
        items.forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = startX + col * itemWidth;
            const y = startY + row * itemHeight;
            
            // 商品背景
            const bg = this.add.rectangle(x, y, 130, 160, 0xFFFFFF, 0.9);
            bg.setStrokeStyle(2, 0xFF6B6B, 0.5);
            
            // 商品图标
            const icon = this.add.text(x, y - 40, item.icon, {
                fontSize: '48px'
            }).setOrigin(0.5);
            
            // 商品名称
            const name = this.add.text(x, y + 10, item.name, {
                fontSize: '20px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333'
            }).setOrigin(0.5);
            
            // 商品价格
            const price = this.add.text(x, y + 40, `${item.price}金币`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FF6B6B'
            }).setOrigin(0.5);
            
            // 购买按钮
            const buyBtn = this.add.text(x, y + 65, '购买', {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF',
                backgroundColor: '#FF6B6B',
                padding: { x: 15, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            
            buyBtn.on('pointerdown', () => {
                this.buyItem(item);
            });
            
            this.itemContainer.add([bg, icon, name, price, buyBtn]);
        });
    }
    
    filterItems(category) {
        if (category === '全部') {
            this.displayItems(this.shopItems);
        } else {
            const filtered = this.shopItems.filter(item => item.category === category);
            this.displayItems(filtered);
        }
    }
    
    buyItem(item) {
        // 检查金币
        if (window.gamePlayer && window.gamePlayer.spendGold(item.price)) {
            // 添加到背包
            if (window.gameInventory) {
                window.gameInventory.addItem(item.id, 1, item.quality);
            }
            
            // 更新金币显示
            this.updateGoldDisplay();
            
            // 显示购买成功
            this.showPurchaseSuccess(item);
        } else {
            // 显示金币不足
            this.showInsufficientGold();
        }
    }
    
    updateGoldDisplay() {
        if (window.gamePlayer) {
            const gold = window.gamePlayer.data.gold;
            this.goldText.setText(`💰 ${gold}`);
        }
    }
    
    showPurchaseSuccess(item) {
        const toast = this.add.text(375, 1100, `购买成功: ${item.name}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: '#00AA00',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // 2秒后消失
        this.time.delayedCall(2000, () => {
            toast.destroy();
        });
    }
    
    showInsufficientGold() {
        const toast = this.add.text(375, 1100, '金币不足！', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: '#FF0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // 2秒后消失
        this.time.delayedCall(2000, () => {
            toast.destroy();
        });
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
}
