// 技能学习场景
class SkillScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkillScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 标题
        this.add.text(width / 2, 80, '烹饪学校', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 副标题
        this.add.text(width / 2, 140, '学习烹饪技能，提升厨艺水平', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 创建技能列表
        this.createSkillList();

        // 创建返回按钮
        this.createBackButton();
    }

    createSkillList() {
        const skills = [
            { id: 'fry', name: '煎', description: '基础烹饪方式', unlockLevel: 1, cost: 100, icon: '🍳' },
            { id: 'stir-fry', name: '炒', description: '提升菜品口感', unlockLevel: 5, cost: 200, icon: '🥘' },
            { id: 'cook', name: '烹', description: '增加菜品香气', unlockLevel: 10, cost: 300, icon: '🔥' },
            { id: 'steam', name: '蒸', description: '保留食材营养', unlockLevel: 15, cost: 400, icon: '♨️' },
            { id: 'boil', name: '煮', description: '制作汤类菜品', unlockLevel: 20, cost: 500, icon: '🍲' },
            { id: 'deep-fry', name: '炸', description: '制作酥脆口感', unlockLevel: 25, cost: 600, icon: '🍟' },
            { id: 'braise', name: '炖', description: '制作浓郁口味', unlockLevel: 30, cost: 700, icon: '🍖' },
            { id: 'bake', name: '烘焙', description: '制作面包蛋糕', unlockLevel: 15, cost: 400, icon: '🍰' },
            { id: 'dessert', name: '甜品', description: '制作精致甜点', unlockLevel: 25, cost: 600, icon: '🍮' },
            { id: 'sauce', name: '酱汁', description: '提升菜品层次', unlockLevel: 35, cost: 800, icon: '🍶' },
            { id: 'plating', name: '摆盘', description: '提升菜品颜值', unlockLevel: 45, cost: 1000, icon: '🎨' }
        ];

        const playerLevel = window.gamePlayer ? window.gamePlayer.data.level : 1;
        const learnedSkills = window.gamePlayer ? window.gamePlayer.data.skills : [];

        let currentY = 220;
        const startX = 80;

        skills.forEach((skill, index) => {
            const isUnlocked = playerLevel >= skill.unlockLevel;
            const isLearned = learnedSkills.includes(skill.id);

            // 技能卡片背景
            const cardColor = isLearned ? 0x90EE90 : isUnlocked ? 0xFFFFFF : 0xEEEEEE;
            const card = this.add.rectangle(375, currentY, 700, 80, cardColor, 0.9);
            card.setStrokeStyle(2, isLearned ? 0x00AA00 : isUnlocked ? 0xFF6B6B : 0xCCCCCC, 1);

            // 技能图标
            const icon = this.add.text(startX, currentY, skill.icon, {
                fontSize: '40px'
            }).setOrigin(0, 0.5);

            // 技能名称
            const nameText = this.add.text(startX + 60, currentY - 15, skill.name, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: isUnlocked ? '#333333' : '#999999',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            // 技能描述
            const descText = this.add.text(startX + 60, currentY + 15, skill.description, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: isUnlocked ? '#666666' : '#999999'
            }).setOrigin(0, 0.5);

            // 等级要求
            const levelText = this.add.text(500, currentY - 15, `Lv.${skill.unlockLevel}`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: isUnlocked ? '#00AA00' : '#FF0000'
            }).setOrigin(0, 0.5);

            // 学习费用
            const costText = this.add.text(500, currentY + 15, `${skill.cost}金币`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: isUnlocked ? '#FF6B6B' : '#999999'
            }).setOrigin(0, 0.5);

            // 学习按钮
            if (isLearned) {
                const learnedText = this.add.text(650, currentY, '已学会', {
                    fontSize: '20px',
                    fontFamily: 'Microsoft YaHei',
                    color: '#00AA00',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            } else if (isUnlocked) {
                const learnBtn = this.add.text(650, currentY, '学习', {
                    fontSize: '20px',
                    fontFamily: 'Microsoft YaHei',
                    color: '#FFFFFF',
                    backgroundColor: '#FF6B6B',
                    padding: { x: 15, y: 8 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                learnBtn.on('pointerdown', () => {
                    this.learnSkill(skill);
                });
            } else {
                const lockedText = this.add.text(650, currentY, '锁定', {
                    fontSize: '20px',
                    fontFamily: 'Microsoft YaHei',
                    color: '#999999'
                }).setOrigin(0.5);
            }

            currentY += 100;
        });
    }

    learnSkill(skill) {
        if (!window.gamePlayer) return;

        // 检查金币
        if (window.gamePlayer.data.gold < skill.cost) {
            this.showMessage('金币不足！', 'error');
            return;
        }

        // 扣除金币
        window.gamePlayer.spendGold(skill.cost);

        // 学习技能
        window.gamePlayer.learnSkill(skill.id);

        // 显示成功
        this.showMessage(`学会了 ${skill.name}！`, 'success');

        // 刷新场景
        this.time.delayedCall(1500, () => {
            this.scene.restart();
        });
    }

    showMessage(message, type) {
        const color = type === 'error' ? '#FF0000' : '#00AA00';

        const toast = this.add.text(375, 1100, message, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF',
            backgroundColor: color,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            toast.destroy();
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
