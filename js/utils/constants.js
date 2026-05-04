// 游戏常量
const CONSTANTS = {
    // 场景键名
    SCENES: {
        BOOT: 'BootScene',
        MENU: 'MenuScene',
        STREET: 'StreetScene',
        COOKING: 'CookingScene',
        SHOP: 'ShopScene',
        COMPETITION: 'CompetitionScene',
        MINIGAME: 'MiniGameScene'
    },
    
    // 事件名
    EVENTS: {
        GOLD_CHANGED: 'gold-changed',
        EXP_CHANGED: 'exp-changed',
        ENERGY_CHANGED: 'energy-changed',
        LEVEL_UP: 'level-up',
        ITEM_ADDED: 'item-added',
        ITEM_REMOVED: 'item-removed'
    },
    
    // 物品类型
    ITEM_TYPES: {
        VEGETABLE: 'vegetable',
        MEAT: 'meat',
        SEAFOOD: 'seafood',
        FRUIT: 'fruit',
        SEASONING: 'seasoning',
        SPECIAL: 'special'
    },
    
    // 物品品质
    ITEM_QUALITY: {
        COMMON: { id: 'common', name: '普通', color: '#FFFFFF' },
        GOOD: { id: 'good', name: '优质', color: '#00FF00' },
        FINE: { id: 'fine', name: '精品', color: '#0000FF' },
        EXCELLENT: { id: 'excellent', name: '极品', color: '#800080' },
        LEGENDARY: { id: 'legendary', name: '传说', color: '#FFD700' }
    },
    
    // 技能类型
    SKILL_TYPES: {
        CHINESE: 'chinese',
        WESTERN: 'western'
    },
    
    // 烹饪方式
    COOKING_METHODS: {
        FRY: { id: 'fry', name: '煎', unlockLevel: 1 },
        STIR_FRY: { id: 'stir-fry', name: '炒', unlockLevel: 5 },
        COOK: { id: 'cook', name: '烹', unlockLevel: 10 },
        STEAM: { id: 'steam', name: '蒸', unlockLevel: 15 },
        BOIL: { id: 'boil', name: '煮', unlockLevel: 20 },
        DEEP_FRY: { id: 'deep-fry', name: '炸', unlockLevel: 25 },
        BRAISE: { id: 'braise', name: '炖', unlockLevel: 30 },
        BAKE: { id: 'bake', name: '烘焙', unlockLevel: 15 },
        DESSERT: { id: 'dessert', name: '甜品', unlockLevel: 25 },
        SAUCE: { id: 'sauce', name: '酱汁', unlockLevel: 35 },
        PLATING: { id: 'plating', name: '摆盘', unlockLevel: 45 }
    },
    
    // 比赛类型
    COMPETITION_TYPES: {
        LOCAL: { id: 'local', name: '街区小厨赛', minLevel: 1, reward: { gold: 100, exp: 50 } },
        DISTRICT: { id: 'district', name: '区级烹饪赛', minLevel: 20, reward: { gold: 500, exp: 200 } },
        CITY: { id: 'city', name: '市级美食大赛', minLevel: 40, reward: { gold: 2000, exp: 500 } },
        NATIONAL: { id: 'national', name: '全国烹饪锦标赛', minLevel: 60, reward: { gold: 10000, exp: 2000 } },
        INTERNATIONAL: { id: 'international', name: '国际米其林挑战赛', minLevel: 80, reward: { gold: 50000, exp: 10000 } }
    }
};
