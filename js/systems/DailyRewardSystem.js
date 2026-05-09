// 每日签到系统
class DailyRewardSystem {
    constructor() {
        this.rewards = [
            { day: 1, gold: 20, exp: 10 },
            { day: 2, gold: 30, exp: 15 },
            { day: 3, gold: 40, exp: 20 },
            { day: 4, gold: 50, exp: 25 },
            { day: 5, gold: 60, exp: 30 },
            { day: 6, gold: 70, exp: 35 },
            { day: 7, gold: 100, exp: 50 }
        ];
    }
    
    getTodayReward() {
        const day = this.getConsecutiveDays() % 7 || 7;
        return this.rewards[day - 1];
    }
    
    getConsecutiveDays() {
        const saveData = localStorage.getItem('dailyReward');
        if (!saveData) return 0;
        
        try {
            const data = JSON.parse(saveData);
            const lastCheck = new Date(data.lastCheck);
            const now = new Date();
            
            // 检查是否是同一天
            if (this.isSameDay(lastCheck, now)) return data.consecutiveDays;
            
            // 检查是否是昨天
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.isSameDay(lastCheck, yesterday)) {
                return data.consecutiveDays;
            }
            
            // 中断了
            return 0;
        } catch (e) {
            return 0;
        }
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    canClaim() {
        const saveData = localStorage.getItem('dailyReward');
        if (!saveData) return true;
        
        try {
            const data = JSON.parse(saveData);
            const lastCheck = new Date(data.lastCheck);
            const now = new Date();
            
            // 今天还没签到
            return !this.isSameDay(lastCheck, now);
        } catch (e) {
            return true;
        }
    }
    
    claim(player) {
        if (!this.canClaim()) return { success: false, message: '今日已签到' };
        
        const reward = this.getTodayReward();
        const consecutiveDays = this.getConsecutiveDays() + 1;
        
        player.gainGold(reward.gold);
        player.gainExp(reward.exp);
        
        // 保存签到数据
        localStorage.setItem('dailyReward', JSON.stringify({
            lastCheck: new Date().toISOString(),
            consecutiveDays: consecutiveDays
        }));
        
        return {
            success: true,
            day: consecutiveDays,
            gold: reward.gold,
            exp: reward.exp,
            message: `签到成功！连续${consecutiveDays}天，获得${reward.gold}金币+${reward.exp}经验`
        };
    }
}