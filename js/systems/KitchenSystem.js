// 厨房系统 - 用具升级
class KitchenSystem {
    constructor(player) {
        this.player = player;
        this.initUtensils();
    }
    
    initUtensils() {
        // 8种厨房用具，初始等级Lv.1
        this.utensils = [
            { id: 'pot', name: '锅', icon: '🍳', level: 1, maxLevel: 6 },
            { id: 'knife', name: '刀', icon: '🔪', level: 1, maxLevel: 6 },
            { id: 'cutting_board', name: '砧板', icon: '🪵', level: 1, maxLevel: 6 },
            { id: 'stove', name: '灶具', icon: '🔥', level: 1, maxLevel: 6 },
            { id: 'dishes', name: '餐具', icon: '🍽️', level: 1, maxLevel: 6 },
            { id: 'ladle', name: '勺子', icon: '🥄', level: 1, maxLevel: 6 },
            { id: 'fork', name: '叉子', icon: '🍴', level: 1, maxLevel: 6 },
            { id: 'cup', name: '杯子', icon: '🥛', level: 1, maxLevel: 6 }
        ];
    }
    
    getUtensil(id) {
        return this.utensils.find(u => u.id === id);
    }
    
    getAllUtensils() {
        return this.utensils;
    }
    
    getTotalStars() {
        return this.utensils.reduce((sum, u) => sum + u.level, 0);
    }
    
    getKitchenRating() {
        const stars = this.getTotalStars();
        if (stars <= 10) return { rating: '简陋厨房', stars: '⭐', color: '#999999' };
        if (stars <= 20) return { rating: '普通厨房', stars: '⭐⭐', color: '#00AA00' };
        if (stars <= 30) return { rating: '精致厨房', stars: '⭐⭐⭐', color: '#0088FF' };
        if (stars <= 40) return { rating: '豪华厨房', stars: '⭐⭐⭐⭐', color: '#8800FF' };
        return { rating: '传奇厨房', stars: '⭐⭐⭐⭐⭐', color: '#FFD700' };
    }
    
    getUpgradeCost(utensilId) {
        const utensil = this.getUtensil(utensilId);
        if (!utensil || utensil.level >= utensil.maxLevel) return null;
        
        const costs = { 1: 100, 2: 300, 3: 700, 4: 1500, 5: 3000 };
        return costs[utensil.level] || 3000;
    }
    
    upgradeUtensil(utensilId) {
        const utensil = this.getUtensil(utensilId);
        if (!utensil) return { success: false, message: '用具不存在' };
        if (utensil.level >= utensil.maxLevel) return { success: false, message: '已达最大等级' };
        
        const cost = this.getUpgradeCost(utensilId);
        if (this.player.data.gold < cost) return { success: false, message: '金币不足' };
        
        this.player.data.gold -= cost;
        utensil.level++;
        
        return { success: true, message: `${utensil.name}升级成功！现在是Lv.${utensil.level}` };
    }
    
    getSpeedBonus() {
        // 速度加成：每个用具等级提供+5%速度，最高+30% per utensil
        let totalBonus = 0;
        this.utensils.forEach(u => {
            totalBonus += Math.min(u.level * 5, 30);
        });
        return Math.min(totalBonus, 150); // 上限150%
    }
    
    save() {
        return {
            utensils: this.utensils
        };
    }
    
    load(data) {
        if (data && data.utensils) {
            this.utensils = data.utensils;
        }
    }
}