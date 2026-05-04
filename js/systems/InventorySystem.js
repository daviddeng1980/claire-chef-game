// 背包系统
class InventorySystem {
    constructor() {
        this.items = {};
        this.maxSlots = 50;
    }
    
    // 添加物品
    addItem(itemId, quantity = 1, quality = 'common') {
        const key = `${itemId}_${quality}`;
        
        if (this.getTotalItems() >= this.maxSlots && !this.items[key]) {
            return false; // 背包已满
        }
        
        if (!this.items[key]) {
            this.items[key] = {
                itemId: itemId,
                quality: quality,
                quantity: 0
            };
        }
        
        this.items[key].quantity += quantity;
        return true;
    }
    
    // 移除物品
    removeItem(itemId, quantity = 1, quality = 'common') {
        const key = `${itemId}_${quality}`;
        
        if (!this.items[key] || this.items[key].quantity < quantity) {
            return false;
        }
        
        this.items[key].quantity -= quantity;
        
        if (this.items[key].quantity <= 0) {
            delete this.items[key];
        }
        
        return true;
    }
    
    // 获取物品数量
    getItemQuantity(itemId, quality = 'common') {
        const key = `${itemId}_${quality}`;
        return this.items[key] ? this.items[key].quantity : 0;
    }
    
    // 获取物品总数
    getTotalItems() {
        return Object.keys(this.items).length;
    }
    
    // 检查是否有足够物品
    hasEnough(itemId, quantity, quality = 'common') {
        return this.getItemQuantity(itemId, quality) >= quantity;
    }
    
    // 获取所有物品
    getAllItems() {
        return Helpers.deepClone(this.items);
    }
    
    // 按类型获取物品
    getItemsByType(type) {
        const result = {};
        for (const [key, item] of Object.entries(this.items)) {
            // 这里需要根据itemId查询物品类型
            // 简化处理，实际应该从物品数据库查询
            result[key] = Helpers.deepClone(item);
        }
        return result;
    }
    
    // 清空背包
    clear() {
        this.items = {};
    }
    
    // 获取背包空间信息
    getSpaceInfo() {
        const used = this.getTotalItems();
        return {
            used: used,
            max: this.maxSlots,
            remaining: this.maxSlots - used
        };
    }
}
