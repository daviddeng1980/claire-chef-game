// 成就系统
class AchievementSystem {
    constructor() {
        this.achievements = this.initAchievements();
    }
    
    initAchievements() {
        return [
            // 烹饪类成就
            { id: 'first_cooking', name: '初次烹饪', desc: '完成第一次烹饪', icon: '🍳', condition: (p) => p.statistics.totalCooking >= 1, reward: { gold: 50, exp: 20 } },
            { id: 'cooking_10', name: '小试牛刀', desc: '完成10次烹饪', icon: '👨‍🍳', condition: (p) => p.statistics.totalCooking >= 10, reward: { gold: 100, exp: 50 } },
            { id: 'cooking_50', name: '烹饪达人', desc: '完成50次烹饪', icon: '🔥', condition: (p) => p.statistics.totalCooking >= 50, reward: { gold: 300, exp: 150 } },
            { id: 'cooking_100', name: '大厨风范', desc: '完成100次烹饪', icon: '🏆', condition: (p) => p.statistics.totalCooking >= 100, reward: { gold: 500, exp: 300 } },
            
            // 打工类成就
            { id: 'first_work', name: '第一次打工', desc: '完成第一次打工', icon: '💼', condition: (p) => p.statistics.totalWorkCount >= 1, reward: { gold: 30, exp: 15 } },
            { id: 'work_10', name: '勤劳员工', desc: '打工10次', icon: '💰', condition: (p) => p.statistics.totalWorkCount >= 10, reward: { gold: 80, exp: 40 } },
            { id: 'work_50', name: '打工皇帝', desc: '打工50次', icon: '👑', condition: (p) => p.statistics.totalWorkCount >= 50, reward: { gold: 200, exp: 100 } },
            
            // 成长类成就
            { id: 'level_5', name: '初级厨师', desc: '等级达到5级', icon: '⭐', condition: (p) => p.level >= 5, reward: { gold: 100, exp: 0 } },
            { id: 'level_10', name: '中级厨师', desc: '等级达到10级', icon: '⭐⭐', condition: (p) => p.level >= 10, reward: { gold: 200, exp: 0 } },
            { id: 'level_20', name: '高级厨师', desc: '等级达到20级', icon: '⭐⭐⭐', condition: (p) => p.level >= 20, reward: { gold: 500, exp: 0 } },
            { id: 'level_50', name: '主厨', desc: '等级达到50级', icon: '👨‍🍳', condition: (p) => p.level >= 50, reward: { gold: 1000, exp: 0 } },
            { id: 'level_100', name: '传奇大厨', desc: '等级达到100级', icon: '🏅', condition: (p) => p.level >= 100, reward: { gold: 5000, exp: 0 } },
            
            // 金币类成就
            { id: 'gold_1000', name: '小有积蓄', desc: '累计获得1000金币', icon: '💵', condition: (p) => p.statistics.totalGoldEarned >= 1000, reward: { gold: 0, exp: 50 } },
            { id: 'gold_10000', name: '富裕阶层', desc: '累计获得10000金币', icon: '💎', condition: (p) => p.statistics.totalGoldEarned >= 10000, reward: { gold: 0, exp: 200 } },
            { id: 'gold_50000', name: '富豪', desc: '累计获得50000金币', icon: '💰', condition: (p) => p.statistics.totalGoldEarned >= 50000, reward: { gold: 0, exp: 500 } },
            
            // 比赛类成就
            { id: 'first_competition', name: '首战告捷', desc: '参加第一次比赛', icon: '🎯', condition: (p) => p.statistics.totalCompetitions >= 1, reward: { gold: 50, exp: 30 } },
            { id: 'competition_win', name: '旗开得胜', desc: '赢得第一次比赛', icon: '🏅', condition: (p) => p.statistics.competitionWins >= 1, reward: { gold: 100, exp: 50 } },
            { id: 'competition_10', name: '比赛达人', desc: '参加10次比赛', icon: '🎖️', condition: (p) => p.statistics.totalCompetitions >= 10, reward: { gold: 200, exp: 100 } },
            
            // 收集类成就
            { id: 'learn_5_recipes', name: '初露锋芒', desc: '学会5个菜谱', icon: '📖', condition: (p) => (p.recipes?.length || 0) >= 5, reward: { gold: 100, exp: 50 } },
            { id: 'learn_10_recipes', name: '学识渊博', desc: '学会10个菜谱', icon: '📚', condition: (p) => (p.recipes?.length || 0) >= 10, reward: { gold: 200, exp: 100 } },
            { id: 'learn_all_recipes', name: '厨艺大师', desc: '学会所有菜谱', icon: '🎓', condition: (p) => (p.recipes?.length || 0) >= 20, reward: { gold: 500, exp: 300 } },
            
            // 技能类成就
            { id: 'learn_3_skills', name: '技能入门', desc: '学会3个技能', icon: '📝', condition: (p) => (p.skills?.length || 0) >= 3, reward: { gold: 100, exp: 50 } },
            { id: 'learn_5_skills', name: '技能熟练', desc: '学会5个技能', icon: '✏️', condition: (p) => (p.skills?.length || 0) >= 5, reward: { gold: 200, exp: 100 } }
        ];
    }
    
    checkAchievements(playerData) {
        const unlocked = [];
        const saveData = this.loadUnlocked();
        
        this.achievements.forEach(achievement => {
            if (saveData.includes(achievement.id)) return;
            
            if (achievement.condition(playerData)) {
                unlocked.push(achievement);
            }
        });
        
        return unlocked;
    }
    
    unlock(achievementId) {
        const saveData = this.loadUnlocked();
        if (!saveData.includes(achievementId)) {
            saveData.push(achievementId);
            localStorage.setItem('achievements', JSON.stringify(saveData));
        }
    }
    
    loadUnlocked() {
        try {
            const data = localStorage.getItem('achievements');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    getProgress() {
        const unlocked = this.loadUnlocked();
        return {
            unlocked: unlocked.length,
            total: this.achievements.length
        };
    }
    
    getAchievements() {
        const unlocked = this.loadUnlocked();
        return this.achievements.map(a => ({
            ...a,
            unlocked: unlocked.includes(a.id)
        }));
    }
}