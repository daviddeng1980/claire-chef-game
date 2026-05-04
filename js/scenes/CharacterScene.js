// 角色信息场景
class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 标题
        this.add.text(width / 2, 80, '角色信息', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 创建角色信息面板
        this.createCharacterInfo();

        // 创建属性面板
        this.createStatsPanel();

        // 创建技能面板
        this.createSkillsPanel();

        // 创建统计面板
        this.createStatisticsPanel();

        // 创建返回按钮
        this.createBackButton();
    }

    createCharacterInfo() {
        const playerData = window.gamePlayer ? window.gamePlayer.getData() : {
            name: '克莱尔',
            level: 1,
            title: '新手厨师',
            exp: 0,
            expToNext: 100
        };

        // 角色卡片
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 0.95);
        card.fillRoundedRect(50, 150, 650, 200, 15);
        card.lineStyle(3, 0xFF6B6B, 1);
        card.strokeRoundedRect(50, 150, 650, 200, 15);

        // 角色头像
        const avatar = this.add.text(150, 250, '👩‍🍳', {
            fontSize: '80px'
        }).setOrigin(0.5);

        // 角色名称
        this.add.text(300, 200, playerData.name, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // 等级和称号
        this.add.text(300, 240, `Lv.${playerData.level} ${playerData.title}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B'
        }).setOrigin(0, 0.5);

        // 经验条背景
        const expBarBg = this.add.graphics();
        expBarBg.fillStyle(0xEEEEEE, 1);
        expBarBg.fillRoundedRect(300, 270, 300, 20, 5);

        // 经验条
        const expPercent = (playerData.exp / playerData.expToNext) * 100;
        const expBar = this.add.graphics();
        expBar.fillStyle(0xFFD700, 1);
        expBar.fillRoundedRect(300, 270, 300 * (expPercent / 100), 20, 5);

        // 经验值文字
        this.add.text(450, 295, `${playerData.exp}/${playerData.expToNext}`, {
            fontSize: '16px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 进度百分比
        this.add.text(600, 295, `${Math.round(expPercent)}%`, {
            fontSize: '16px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
    }

    createStatsPanel() {
        const playerData = window.gamePlayer ? window.gamePlayer.getData() : {
            gold: 500,
            energy: 100,
            maxEnergy: 100,
            reputation: 0
        };

        // 属性卡片
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 0.95);
        card.fillRoundedRect(50, 370, 650, 150, 15);
        card.lineStyle(2, 0xFF6B6B, 0.5);
        card.strokeRoundedRect(50, 370, 650, 150, 15);

        // 属性标题
        this.add.text(80, 395, '基础属性', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        });

        // 属性列表
        const stats = [
            { icon: '💰', name: '金币', value: playerData.gold },
            { icon: '⚡', name: '体力', value: `${playerData.energy}/${playerData.maxEnergy}` },
            { icon: '⭐', name: '声望', value: playerData.reputation }
        ];

        let startX = 100;
        stats.forEach(stat => {
            // 属性背景
            const statBg = this.add.graphics();
            statBg.fillStyle(0xFFF5F5, 1);
            statBg.fillRoundedRect(startX, 430, 180, 70, 10);

            // 属性图标
            this.add.text(startX + 20, 450, stat.icon, {
                fontSize: '30px'
            }).setOrigin(0, 0.5);

            // 属性名称
            this.add.text(startX + 60, 445, stat.name, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#666666'
            }).setOrigin(0, 0.5);

            // 属性值
            this.add.text(startX + 60, 475, stat.value.toString(), {
                fontSize: '20px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            startX += 200;
        });
    }

    createSkillsPanel() {
        const learnedSkills = window.gamePlayer ? window.gamePlayer.data.skills : [];

        // 技能卡片
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 0.95);
        card.fillRoundedRect(50, 540, 650, 150, 15);
        card.lineStyle(2, 0xFF6B6B, 0.5);
        card.strokeRoundedRect(50, 540, 650, 150, 15);

        // 技能标题
        this.add.text(80, 565, '已学技能', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        });

        if (learnedSkills.length === 0) {
            this.add.text(375, 620, '还没有学习任何技能，去烹饪学校学习吧！', {
                fontSize: '20px',
                fontFamily: 'Microsoft YaHei',
                color: '#999999'
            }).setOrigin(0.5);
        } else {
            const skillNames = {
                'fry': '煎',
                'stir-fry': '炒',
                'cook': '烹',
                'steam': '蒸',
                'boil': '煮',
                'deep-fry': '炸',
                'braise': '炖',
                'bake': '烘焙',
                'dessert': '甜品',
                'sauce': '酱汁',
                'plating': '摆盘'
            };

            let startX = 100;
            learnedSkills.forEach(skillId => {
                const skillName = skillNames[skillId] || skillId;

                // 技能标签
                const skillBg = this.add.graphics();
                skillBg.fillStyle(0xFF6B6B, 1);
                skillBg.fillRoundedRect(startX, 600, 80, 40, 20);

                this.add.text(startX + 40, 620, skillName, {
                    fontSize: '18px',
                    fontFamily: 'Microsoft YaHei',
                    color: '#FFFFFF'
                }).setOrigin(0.5);

                startX += 100;
            });
        }
    }

    createStatisticsPanel() {
        const statistics = window.gamePlayer ? window.gamePlayer.data.statistics : {
            totalCooking: 0,
            totalCompetitions: 0,
            totalGoldEarned: 0,
            totalExpEarned: 0
        };

        // 统计卡片
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 0.95);
        card.fillRoundedRect(50, 710, 650, 150, 15);
        card.lineStyle(2, 0xFF6B6B, 0.5);
        card.strokeRoundedRect(50, 710, 650, 150, 15);

        // 统计标题
        this.add.text(80, 735, '游戏统计', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        });

        // 统计数据
        const stats = [
            { icon: '🍳', name: '烹饪次数', value: statistics.totalCooking },
            { icon: '🏆', name: '比赛次数', value: statistics.totalCompetitions },
            { icon: '💰', name: '累计金币', value: statistics.totalGoldEarned },
            { icon: '⭐', name: '累计经验', value: statistics.totalExpEarned }
        ];

        let startX = 80;
        stats.forEach(stat => {
            // 统计背景
            const statBg = this.add.graphics();
            statBg.fillStyle(0xFFF5F5, 1);
            statBg.fillRoundedRect(startX, 770, 140, 70, 10);

            // 统计图标
            this.add.text(startX + 15, 790, stat.icon, {
                fontSize: '24px'
            }).setOrigin(0, 0.5);

            // 统计名称
            this.add.text(startX + 50, 785, stat.name, {
                fontSize: '14px',
                fontFamily: 'Microsoft YaHei',
                color: '#666666'
            }).setOrigin(0, 0.5);

            // 统计值
            this.add.text(startX + 50, 810, stat.value.toString(), {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            startX += 155;
        });
    }

    createBackButton() {
        const backBtn = this.add.text(50, 50, '← 返回', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
    }
}
