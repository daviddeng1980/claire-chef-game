// 工具函数
const Helpers = {
    // 生成随机整数
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 生成随机数
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    
    // 计算升级所需经验
    calculateExpToNext: (level) => {
        return Math.floor(GAME_CONFIG.expBase * Math.pow(GAME_CONFIG.expMultiplier, level - 1));
    },
    
    // 获取等级称号
    getTitleByLevel: (level) => {
        for (const config of LEVEL_CONFIG.titles) {
            if (level >= config.min && level <= config.max) {
                return config.title;
            }
        }
        return LEVEL_CONFIG.titles[LEVEL_CONFIG.titles.length - 1].title;
    },
    
    // 格式化数字
    formatNumber: (num) => {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
    },
    
    // 格式化时间
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 深度克隆对象
    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 检查对象是否为空
    isEmpty: (obj) => {
        return Object.keys(obj).length === 0;
    },
    
    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
