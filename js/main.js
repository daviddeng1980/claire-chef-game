// 游戏主入口

// 全局游戏实例
let game;
let gamePlayer;
let gameInventory;
let gameCooking;
let gameQuest;

// 初始化游戏
function initGame() {
    // 创建游戏配置
    const config = {
        type: Phaser.AUTO,
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        parent: 'game-container',
        backgroundColor: GAME_CONFIG.backgroundColor,
        physics: GAME_CONFIG.physics,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 375,
                height: 667
            },
            max: {
                width: 750,
                height: 1334
            }
        },
        scene: [
            BootScene,
            MenuScene,
            StreetScene,
            CookingScene,
            ShopScene,
            CompetitionScene,
            MiniGameScene,
            WorkScene,
            SkillScene,
            InventoryScene
        ]
    };
    
    // 创建游戏实例
    game = new Phaser.Game(config);
    
    // 初始化游戏系统
    initGameSystems();
}

// 初始化游戏系统
function initGameSystems() {
    // 创建玩家系统
    gamePlayer = new PlayerSystem();
    
    // 创建背包系统
    gameInventory = new InventorySystem();
    
    // 创建烹饪系统
    gameCooking = new CookingSystem(gamePlayer);
    
    // 创建任务系统
    gameQuest = new QuestSystem(gamePlayer);
    
    // 尝试加载存档
    const saveData = SaveSystem.load();
    if (saveData) {
        if (saveData.player) {
            gamePlayer.loadData(saveData.player);
        }
        if (saveData.inventory) {
            gameInventory = new InventorySystem();
            gameInventory.items = saveData.inventory.items || {};
        }
        if (saveData.quests) {
            gameQuest.completedQuests = saveData.quests.completed || [];
        }
    }
    
    // 将系统挂载到全局，方便场景访问
    window.gamePlayer = gamePlayer;
    window.gameInventory = gameInventory;
    window.gameCooking = gameCooking;
    window.gameQuest = gameQuest;
}

// 保存游戏
function saveGame() {
    const gameState = {
        player: gamePlayer.getData(),
        inventory: {
            items: gameInventory.getAllItems()
        },
        quests: {
            completed: gameQuest.getCompletedQuests()
        },
        timestamp: Date.now()
    };
    
    return SaveSystem.save(gameState);
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 页面关闭前自动保存
window.addEventListener('beforeunload', () => {
    saveGame();
});

// 处理移动端触摸事件
document.addEventListener('touchstart', function(e) {
    // 防止双击缩放
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    // 防止页面滚动
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
