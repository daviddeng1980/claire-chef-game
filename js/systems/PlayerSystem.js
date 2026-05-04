// 玩家系统
class PlayerSystem {
    constructor() {
        this.data = {
            name: '克莱尔',
            level: 1,
            exp: 0,
            expToNext: Helpers.calculateExpToNext(1),
            gold: GAME_CONFIG.initialGold,
            energy: GAME_CONFIG.initialEnergy,
            maxEnergy: GAME_CONFIG.maxEnergy,
            reputation: 0,
            title: '新手厨师',
            skills: [],
            recipes: ['tomato_egg'],
            completedQuests: [],
            statistics: {
                totalCooking: 0,
                totalCompetitions: 0,
                totalGoldEarned: 0,
                totalExpEarned: 0
            }
        };
        
        this.lastEnergyUpdate = Date.now();
    }
    
    // 获得经验
    gainExp(amount) {
        this.data.exp += amount;
        this.data.statistics.totalExpEarned += amount;
        
        // 检查升级
        while (this.data.exp >= this.data.expToNext) {
            this.levelUp();
        }
        
        return this.data.exp;
    }
    
    // 升级
    levelUp() {
        this.data.exp -= this.data.expToNext;
        this.data.level++;
        this.data.expToNext = Helpers.calculateExpToNext(this.data.level);
        this.data.title = Helpers.getTitleByLevel(this.data.level);
        
        // 恢复体力
        this.data.energy = this.data.maxEnergy;
        
        return this.data.level;
    }
    
    // 获得金币
    gainGold(amount) {
        this.data.gold += amount;
        this.data.statistics.totalGoldEarned += amount;
        return this.data.gold;
    }
    
    // 消费金币
    spendGold(amount) {
        if (this.data.gold >= amount) {
            this.data.gold -= amount;
            return true;
        }
        return false;
    }
    
    // 消耗体力
    consumeEnergy(amount) {
        this.updateEnergy();
        if (this.data.energy >= amount) {
            this.data.energy -= amount;
            return true;
        }
        return false;
    }
    
    // 恢复体力
    recoverEnergy(amount) {
        this.data.energy = Math.min(this.data.energy + amount, this.data.maxEnergy);
        return this.data.energy;
    }
    
    // 更新体力（根据时间自动恢复）
    updateEnergy() {
        const now = Date.now();
        const elapsed = now - this.lastEnergyUpdate;
        const recoverAmount = Math.floor(elapsed / (5 * 60 * 1000)) * GAME_CONFIG.energyRecoveryRate;
        
        if (recoverAmount > 0) {
            this.recoverEnergy(recoverAmount);
            this.lastEnergyUpdate = now;
        }
    }
    
    // 学习技能
    learnSkill(skillId) {
        if (!this.data.skills.includes(skillId)) {
            this.data.skills.push(skillId);
            return true;
        }
        return false;
    }
    
    // 检查是否拥有技能
    hasSkill(skillId) {
        return this.data.skills.includes(skillId);
    }
    
    // 添加菜谱
    addRecipe(recipeId) {
        if (!this.data.recipes.includes(recipeId)) {
            this.data.recipes.push(recipeId);
            return true;
        }
        return false;
    }
    
    // 检查是否拥有菜谱
    hasRecipe(recipeId) {
        return this.data.recipes.includes(recipeId);
    }
    
    // 获得声望
    gainReputation(amount) {
        this.data.reputation += amount;
        return this.data.reputation;
    }
    
    // 获取玩家数据
    getData() {
        this.updateEnergy();
        return Helpers.deepClone(this.data);
    }
    
    // 加载玩家数据
    loadData(data) {
        this.data = Helpers.deepClone(data);
        this.lastEnergyUpdate = Date.now();
    }
    
    // 获取进度百分比
    getProgressPercent() {
        return (this.data.exp / this.data.expToNext) * 100;
    }
}
