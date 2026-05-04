// 烹饪系统
class CookingSystem {
    constructor(player) {
        this.player = player;
        this.currentRecipe = null;
        this.currentStep = 0;
        this.steps = [];
        this.score = {
            taste: 0,
            appearance: 0,
            creativity: 0
        };
        this.isCooking = false;
    }
    
    // 开始烹饪
    startCooking(recipeId) {
        // 从菜谱数据库获取菜谱信息
        const recipe = this.getRecipe(recipeId);
        if (!recipe) return false;
        
        // 检查是否拥有菜谱
        if (!this.player.hasRecipe(recipeId)) {
            return false;
        }
        
        // 检查食材
        for (const ingredient of recipe.ingredients) {
            if (!this.player.inventory.hasEnough(ingredient.id, ingredient.quantity, ingredient.quality)) {
                return false;
            }
        }
        
        // 检查技能
        for (const skill of recipe.requiredSkills) {
            if (!this.player.hasSkill(skill)) {
                return false;
            }
        }
        
        // 消耗食材
        for (const ingredient of recipe.ingredients) {
            this.player.inventory.removeItem(ingredient.id, ingredient.quantity, ingredient.quality);
        }
        
        this.currentRecipe = recipe;
        this.currentStep = 0;
        this.steps = recipe.steps;
        this.score = { taste: 0, appearance: 0, creativity: 0 };
        this.isCooking = true;
        
        return true;
    }
    
    // 执行烹饪步骤
    performStep(performance) {
        if (!this.isCooking || this.currentStep >= this.steps.length) {
            return null;
        }
        
        const step = this.steps[this.currentStep];
        let stepScore = 0;
        
        // 根据操作表现计算分数
        switch (step.type) {
            case 'qte':
                stepScore = this.calculateQTEScore(performance);
                break;
            case 'timing':
                stepScore = this.calculateTimingScore(performance);
                break;
            case 'sequence':
                stepScore = this.calculateSequenceScore(performance);
                break;
            default:
                stepScore = performance || 50;
        }
        
        // 累加分数
        this.score.taste += stepScore * step.weight.taste;
        this.score.appearance += stepScore * step.weight.appearance;
        this.score.creativity += stepScore * step.weight.creativity;
        
        this.currentStep++;
        
        // 检查是否完成
        if (this.currentStep >= this.steps.length) {
            return this.completeCooking();
        }
        
        return {
            stepComplete: true,
            nextStep: this.steps[this.currentStep],
            progress: (this.currentStep / this.steps.length) * 100
        };
    }
    
    // 计算QTE分数
    calculateQTEScore(performance) {
        // performance: 0-100，表示QTE完成度
        if (performance >= 90) return 100;
        if (performance >= 70) return 80;
        if (performance >= 50) return 60;
        if (performance >= 30) return 40;
        return 20;
    }
    
    // 计算时机分数
    calculateTimingScore(performance) {
        // performance: 距离完美时机的偏移量（毫秒）
        if (performance <= 50) return 100;
        if (performance <= 100) return 80;
        if (performance <= 200) return 60;
        if (performance <= 300) return 40;
        return 20;
    }
    
    // 计算顺序分数
    calculateSequenceScore(performance) {
        // performance: 正确步骤数/总步骤数
        return performance * 100;
    }
    
    // 完成烹饪
    completeCooking() {
        this.isCooking = false;
        
        // 计算最终分数
        const finalScore = {
            taste: Math.min(Math.round(this.score.taste), 100),
            appearance: Math.min(Math.round(this.score.appearance), 100),
            creativity: Math.min(Math.round(this.score.creativity), 100)
        };
        
        const averageScore = (finalScore.taste + finalScore.appearance + finalScore.creativity) / 3;
        
        // 计算奖励
        const reward = this.calculateReward(averageScore);
        
        // 应用奖励
        this.player.gainExp(reward.exp);
        this.player.gainGold(reward.gold);
        this.player.data.statistics.totalCooking++;
        
        return {
            complete: true,
            score: finalScore,
            averageScore: Math.round(averageScore),
            reward: reward,
            recipe: this.currentRecipe
        };
    }
    
    // 计算奖励
    calculateReward(score) {
        const baseReward = this.currentRecipe.reward;
        const multiplier = score / 100;
        
        return {
            exp: Math.round(baseReward.exp * multiplier),
            gold: Math.round(baseReward.gold * multiplier)
        };
    }
    
    // 获取当前步骤
    getCurrentStep() {
        if (!this.isCooking || this.currentStep >= this.steps.length) {
            return null;
        }
        return this.steps[this.currentStep];
    }
    
    // 获取菜谱（简化版，实际应从数据库获取）
    getRecipe(recipeId) {
        // 这里应该查询菜谱数据库
        // 返回示例菜谱
        const recipes = {
            'tomato_egg': {
                id: 'tomato_egg',
                name: '番茄炒蛋',
                difficulty: 1,
                ingredients: [
                    { id: 'tomato', quantity: 2, quality: 'common' },
                    { id: 'egg', quantity: 3, quality: 'common' }
                ],
                requiredSkills: ['stir-fry'],
                steps: [
                    { type: 'qte', name: '打蛋', weight: { taste: 0.3, appearance: 0.2, creativity: 0.1 } },
                    { type: 'timing', name: '翻炒', weight: { taste: 0.4, appearance: 0.3, creativity: 0.2 } },
                    { type: 'sequence', name: '调味', weight: { taste: 0.3, appearance: 0.5, creativity: 0.7 } }
                ],
                reward: { exp: 50, gold: 30 }
            }
        };
        
        return recipes[recipeId] || null;
    }
    
    // 取消烹饪
    cancelCooking() {
        this.isCooking = false;
        this.currentRecipe = null;
        this.currentStep = 0;
        this.score = { taste: 0, appearance: 0, creativity: 0 };
    }
}
