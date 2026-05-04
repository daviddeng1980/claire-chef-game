// 任务系统
class QuestSystem {
    constructor(player) {
        this.player = player;
        this.activeQuests = [];
        this.completedQuests = [];
        this.dailyQuests = [];
        this.lastDailyReset = Date.now();
    }
    
    // 初始化每日任务
    initDailyQuests() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        // 检查是否需要重置每日任务
        if (now - this.lastDailyReset >= oneDay) {
            this.dailyQuests = this.generateDailyQuests();
            this.lastDailyReset = now;
        }
    }
    
    // 生成每日任务
    generateDailyQuests() {
        const dailyQuestTemplates = [
            {
                id: 'daily_cook_3',
                name: '今日厨师',
                description: '完成3次烹饪',
                type: 'cooking',
                target: 3,
                reward: { exp: 100, gold: 50 }
            },
            {
                id: 'daily_work_5',
                name: '勤劳小蜜蜂',
                description: '完成5次打工',
                type: 'work',
                target: 5,
                reward: { exp: 80, gold: 100 }
            },
            {
                id: 'daily_compete_1',
                name: '挑战者',
                description: '参加1次比赛',
                type: 'competition',
                target: 1,
                reward: { exp: 150, gold: 80 }
            },
            {
                id: 'daily_buy_3',
                name: '购物达人',
                description: '购买3件物品',
                type: 'shopping',
                target: 3,
                reward: { exp: 60, gold: 30 }
            }
        ];
        
        // 随机选择3个每日任务
        const shuffled = dailyQuestTemplates.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map(template => ({
            ...template,
            progress: 0,
            completed: false,
            claimed: false
        }));
    }
    
    // 接受任务
    acceptQuest(quest) {
        if (this.activeQuests.length >= 10) {
            return false; // 任务列表已满
        }
        
        this.activeQuests.push({
            ...quest,
            progress: 0,
            completed: false,
            claimed: false,
            acceptedAt: Date.now()
        });
        
        return true;
    }
    
    // 更新任务进度
    updateProgress(type, amount = 1) {
        // 更新活跃任务
        for (const quest of this.activeQuests) {
            if (quest.type === type && !quest.completed) {
                quest.progress += amount;
                if (quest.progress >= quest.target) {
                    quest.progress = quest.target;
                    quest.completed = true;
                }
            }
        }
        
        // 更新每日任务
        for (const quest of this.dailyQuests) {
            if (quest.type === type && !quest.completed) {
                quest.progress += amount;
                if (quest.progress >= quest.target) {
                    quest.progress = quest.target;
                    quest.completed = true;
                }
            }
        }
    }
    
    // 领取奖励
    claimReward(questId, isDaily = false) {
        const quests = isDaily ? this.dailyQuests : this.activeQuests;
        const quest = quests.find(q => q.id === questId);
        
        if (!quest || !quest.completed || quest.claimed) {
            return false;
        }
        
        // 发放奖励
        this.player.gainExp(quest.reward.exp);
        this.player.gainGold(quest.reward.gold);
        quest.claimed = true;
        
        // 如果是活跃任务，移动到已完成
        if (!isDaily) {
            this.completedQuests.push(quest);
            this.activeQuests = this.activeQuests.filter(q => q.id !== questId);
        }
        
        return true;
    }
    
    // 获取活跃任务
    getActiveQuests() {
        return Helpers.deepClone(this.activeQuests);
    }
    
    // 获取每日任务
    getDailyQuests() {
        this.initDailyQuests();
        return Helpers.deepClone(this.dailyQuests);
    }
    
    // 获取已完成任务
    getCompletedQuests() {
        return Helpers.deepClone(this.completedQuests);
    }
    
    // 检查任务是否完成
    isQuestCompleted(questId) {
        return this.completedQuests.some(q => q.id === questId);
    }
    
    // 获取任务统计
    getStatistics() {
        return {
            active: this.activeQuests.length,
            completed: this.completedQuests.length,
            dailyCompleted: this.dailyQuests.filter(q => q.completed && q.claimed).length,
            dailyTotal: this.dailyQuests.length
        };
    }
}
