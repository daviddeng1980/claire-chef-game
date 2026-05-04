// 背包场景
class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
        this.currentCategory = 'all';
        this.selectedItem = null;
    }

    preload() {
        // 加载物品数据
        this.load.json('items', 'assets/data/items.json');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 加载物品数据
        this.itemsData = this.cache.json.get('items').items;

        // 创建UI
        this.createUI();

        // 创建分类标签
        this.createCategoryTabs();

        // 创建物品网格
        this.createItemGrid();

        // 创建物品详情面板
        this.createItemDetailPanel();

        // 创建返回按钮
        this.createBackButton();
    }

    createUI() {
        // 标题
        this.add.text(375, 50, '我的背包', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 背包容量
        const spaceInfo = window.gameInventory ? window.gameInventory.getSpaceInfo() : { used: 0, max: 50 };
        this.spaceText = this.add.text(375, 100, `容量: ${spaceInfo.used}/${spaceInfo.max}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
    }

    createCategoryTabs() {
        const categories = [
            { id: 'all', name: '全部', icon: '📦' },
            { id: 'vegetable', name: '蔬菜', icon: '🥬' },
            { id: 'meat', name: '肉类', icon: '🥩' },
            { id: 'seafood', name: '海鲜', icon: '🦐' },
            { id: 'fruit', name: '水果', icon: '🍎' },
            { id: 'seasoning', name: '调料', icon: '🧂' },
            { id: 'special', name: '特殊', icon: '✨' }
        ];

        let startX = 60;
        const tabWidth = 90;
        const tabHeight = 50;

        categories.forEach((category, index) => {
            const isActive = category.id === this.currentCategory;

            // 标签背景
            const bg = this.add.rectangle(
                startX + tabWidth / 2,
                160,
                tabWidth,
                tabHeight,
                isActive ? 0xFF6B6B : 0xFFFFFF,
                1
            );
            bg.setStrokeStyle(2, 0xFF6B6B, 1);
            bg.setInteractive({ useHandCursor: true });

            // 标签文字
            const text = this.add.text(
                startX + tabWidth / 2,
                160,
                `${category.icon} ${category.name}`,
                {
                    fontSize: '16px',
                    fontFamily: 'Microsoft YaHei',
                    color: isActive ? '#FFFFFF' : '#333333'
                }
            ).setOrigin(0.5);

            bg.on('pointerdown', () => {
                this.currentCategory = category.id;
                this.refreshItemGrid();
            });

            startX += tabWidth + 10;
        });
    }

    createItemGrid() {
        // 物品网格容器
        this.itemGridContainer = this.add.container(0, 0);
        this.refreshItemGrid();
    }

    refreshItemGrid() {
        this.itemGridContainer.removeAll(true);

        if (!window.gameInventory) return;

        const allItems = window.gameInventory.getAllItems();
        const itemEntries = Object.entries(allItems);

        // 过滤物品
        let filteredItems = itemEntries;
        if (this.currentCategory !== 'all') {
            filteredItems = itemEntries.filter(([key, item]) => {
                const itemData = this.itemsData.find(i => i.id === item.itemId);
                return itemData && itemData.category === this.currentCategory;
            });
        }

        // 显示物品
        const startX = 80;
        const startY = 240;
        const itemSize = 100;
        const gap = 20;
        const columns = 6;

        filteredItems.forEach(([key, item], index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = startX + col * (itemSize + gap);
            const y = startY + row * (itemSize + gap);

            const itemData = this.itemsData.find(i => i.id === item.itemId);
            if (!itemData) return;

            // 物品背景
            const qualityColors = {
                'common': 0xFFFFFF,
                'good': 0x90EE90,
                'fine': 0x87CEEB,
                'excellent': 0xDDA0DD,
                'legendary': 0xFFD700
            };

            const bg = this.add.rectangle(x, y, itemSize, itemSize, qualityColors[item.quality] || 0xFFFFFF, 1);
            bg.setStrokeStyle(2, 0xFF6B6B, 0.5);
            bg.setInteractive({ useHandCursor: true });

            // 物品图标
            const icon = this.add.text(x, y - 15, itemData.icon, {
                fontSize: '40px'
            }).setOrigin(0.5);

            // 物品数量
            const quantity = this.add.text(x, y + 25, `×${item.quantity}`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333'
            }).setOrigin(0.5);

            // 点击事件
            bg.on('pointerdown', () => {
                this.selectItem(item, itemData);
            });

            this.itemGridContainer.add([bg, icon, quantity]);
        });

        // 更新容量显示
        const spaceInfo = window.gameInventory.getSpaceInfo();
        this.spaceText.setText(`容量: ${spaceInfo.used}/${spaceInfo.max}`);
    }

    createItemDetailPanel() {
        // 详情面板（初始隐藏）
        this.detailPanel = this.add.container(375, 950);
        this.detailPanel.setVisible(false);

        // 面板背景
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0xFFFFFF, 0.95);
        panelBg.fillRoundedRect(-350, -100, 700, 200, 15);
        panelBg.lineStyle(3, 0xFF6B6B, 1);
        panelBg.strokeRoundedRect(-350, -100, 700, 200, 15);
        this.detailPanel.add(panelBg);

        // 物品图标
        this.detailIcon = this.add.text(-300, -50, '', {
            fontSize: '60px'
        }).setOrigin(0.5);
        this.detailPanel.add(this.detailIcon);

        // 物品名称
        this.detailName = this.add.text(-200, -70, '', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.detailPanel.add(this.detailName);

        // 物品品质
        this.detailQuality = this.add.text(-200, -35, '', {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0, 0.5);
        this.detailPanel.add(this.detailQuality);

        // 物品描述
        this.detailDesc = this.add.text(-200, 0, '', {
            fontSize: '18px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0, 0.5);
        this.detailPanel.add(this.detailDesc);

        // 数量
        this.detailQuantity = this.add.text(-200, 35, '', {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0, 0.5);
        this.detailPanel.add(this.detailQuantity);

        // 使用按钮
        this.useBtn = this.add.text(150, -30, '使用', {
            fontSize: '22px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: '#FF6B6B',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.useBtn.on('pointerdown', () => this.useSelectedItem());
        this.detailPanel.add(this.useBtn);

        // 丢弃按钮
        this.dropBtn = this.add.text(150, 30, '丢弃', {
            fontSize: '22px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: '#999999',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.dropBtn.on('pointerdown', () => this.dropSelectedItem());
        this.detailPanel.add(this.dropBtn);
    }

    selectItem(item, itemData) {
        this.selectedItem = { ...item, data: itemData };

        // 更新详情面板
        this.detailIcon.setText(itemData.icon);
        this.detailName.setText(itemData.name);

        const qualityNames = {
            'common': '普通',
            'good': '优质',
            'fine': '精品',
            'excellent': '极品',
            'legendary': '传说'
        };
        this.detailQuality.setText(`品质: ${qualityNames[item.quality] || item.quality}`);
        this.detailDesc.setText(itemData.description);
        this.detailQuantity.setText(`数量: ${item.quantity}`);

        // 显示面板
        this.detailPanel.setVisible(true);
    }

    useSelectedItem() {
        if (!this.selectedItem) return;

        // 这里可以实现物品使用逻辑
        this.showMessage(`使用了 ${this.selectedItem.data.name}`);

        // 消耗一个物品
        if (window.gameInventory) {
            window.gameInventory.removeItem(this.selectedItem.itemId, 1, this.selectedItem.quality);
        }

        // 刷新显示
        this.refreshItemGrid();
        this.detailPanel.setVisible(false);
        this.selectedItem = null;
    }

    dropSelectedItem() {
        if (!this.selectedItem) return;

        // 丢弃物品
        if (window.gameInventory) {
            window.gameInventory.removeItem(
                this.selectedItem.itemId,
                this.selectedItem.quantity,
                this.selectedItem.quality
            );
        }

        this.showMessage(`丢弃了 ${this.selectedItem.data.name}`);

        // 刷新显示
        this.refreshItemGrid();
        this.detailPanel.setVisible(false);
        this.selectedItem = null;
    }

    showMessage(message) {
        const toast = this.add.text(375, 1100, message, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: '#00AA00',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

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
