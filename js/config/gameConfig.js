const GAME_CONFIG = {
    // 屏幕设置
    width: 750,
    height: 1334,
    backgroundColor: '#FFF8E7',
    
    // 物理设置
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    
    // 游戏设置
    maxLevel: 100,
    energyRecoveryRate: 1, // 每5分钟恢复1点
    maxEnergy: 100,
    
    // 初始资源
    initialGold: 500,
    initialEnergy: 100,
    
    // 难度曲线
    expBase: 100,
    expMultiplier: 1.2,
    
    // 经济系统
    goldMultiplier: 1.0,
    
    // 调试
    debug: false
};

// 场景配置
const SCENE_CONFIG = {
    buildings: [
        { id: 'home', name: '家', x: 375, y: 800, icon: '🏠', unlockLevel: 1 },
        { id: 'restaurant', name: '饭店', x: 200, y: 600, icon: '🍜', unlockLevel: 1 },
        { id: 'barbershop', name: '理发店', x: 550, y: 600, icon: '💈', unlockLevel: 5 },
        { id: 'mall', name: '商场', x: 375, y: 400, icon: '🏬', unlockLevel: 10 },
        { id: 'cinema', name: '电影院', x: 150, y: 300, icon: '🎬', unlockLevel: 15 },
        { id: 'cooking_school', name: '烹饪学校', x: 600, y: 300, icon: '📚', unlockLevel: 20 }
    ]
};

// 等级配置
const LEVEL_CONFIG = {
    titles: [
        { min: 1, max: 5, title: '新手厨师' },
        { min: 6, max: 15, title: '初级厨师' },
        { min: 16, max: 30, title: '中级厨师' },
        { min: 31, max: 50, title: '高级厨师' },
        { min: 51, max: 80, title: '主厨' },
        { min: 81, max: 100, title: '五星级大厨' }
    ]
};
