// 存档系统
class SaveSystem {
    static SAVE_KEY = 'claireChefSave';
    static BACKUP_KEY = 'claireChefBackup';
    
    // 保存游戏
    static save(gameState) {
        try {
            // 先备份现有存档
            const existingSave = localStorage.getItem(this.SAVE_KEY);
            if (existingSave) {
                localStorage.setItem(this.BACKUP_KEY, existingSave);
            }
            
            // 保存新存档
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                data: gameState
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('存档失败:', e);
            return false;
        }
    }
    
    // 读取存档
    static load() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            if (saveData) {
                const parsed = JSON.parse(saveData);
                return parsed.data || null;
            }
            return null;
        } catch (e) {
            console.error('读档失败:', e);
            return null;
        }
    }
    
    // 删除存档
    static delete() {
        localStorage.removeItem(this.SAVE_KEY);
        localStorage.removeItem(this.BACKUP_KEY);
    }
    
    // 恢复备份
    static restore() {
        const backup = localStorage.getItem(this.BACKUP_KEY);
        if (backup) {
            localStorage.setItem(this.SAVE_KEY, backup);
            return true;
        }
        return false;
    }
    
    // 检查是否有存档
    static hasSave() {
        return !!localStorage.getItem(this.SAVE_KEY);
    }
    
    // 获取存档信息
    static getSaveInfo() {
        const saveData = localStorage.getItem(this.SAVE_KEY);
        if (saveData) {
            const parsed = JSON.parse(saveData);
            return {
                version: parsed.version,
                timestamp: parsed.timestamp,
                date: new Date(parsed.timestamp).toLocaleString('zh-CN')
            };
        }
        return null;
    }
}
