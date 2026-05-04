// 比赛场景
class CompetitionScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.COMPETITION });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 创建比赛场地背景
        this.createCompetitionBackground();
        
        // 创建UI
        this.createUI();
        
        // 创建比赛列表
        this.createCompetitionList();
        
        // 创建返回按钮
        this.createBackButton();
    }
    
    createCompetitionBackground() {
        const graphics = this.add.graphics();
        
        // 舞台背景
        graphics.fillStyle(0xFFE4C4, 1);
        graphics.fillRect(0, 0, 750, 1334);
        
        // 舞台
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(50, 400, 650, 400);
        
        // 评委席
        graphics.fillStyle(0xA0522D, 1);
        graphics.fillRect(100, 200, 550, 100);
        
        // 评委
        const judgeColors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1];
        judgeColors.forEach((color, index) => {
            graphics.fillStyle(color, 1);
            graphics.fillCircle(200 + index * 175, 180, 30);
        });
    }
    
    createUI() {
        // 标题
        this.add.text(375, 50, '烹饪比赛', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 当前声望
        this.reputationText = this.add.text(650, 50, '声望: 0', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(1, 0);
    }
    
    createCompetitionList() {
        // 比赛列表
        const competitions = [
            {
                id: 'local',
                name: '街区小厨赛',
                level: 1,
                entryFee: 50,
                reward: { gold: 100, exp: 50, reputation: 10 },
                description: '面向新手的入门级比赛'
            },
            {
                id: 'district',
                name: '区级烹饪赛',
                level: 20,
                entryFee: 200,
                reward: { gold: 500, exp: 200, reputation: 30 },
                description: '需要一定实力的区级赛事'
            },
            {
                id: 'city',
                name: '市级美食大赛',
                level: 40,
                entryFee: 1000,
                reward: { gold: 2000, exp: 500, reputation: 100 },
                description: '全市最高水平的烹饪对决'
            },
            {
                id: 'national',
                name: '全国烹饪锦标赛',
                level: 60,
                entryFee: 5000,
                reward: { gold: 10000, exp: 2000, reputation: 500 },
                description: '全国顶尖厨师的巅峰之战'
            },
            {
                id: 'international',
                name: '国际米其林挑战赛',
                level: 80,
                entryFee: 20000,
                reward: { gold: 50000, exp: 10000, reputation: 2000 },
                description: '世界最高荣誉的烹饪挑战'
            }
        ];
        
        let currentY = 200;
        
        competitions.forEach(comp => {
            // 比赛卡片背景
            const card = this.add.rectangle(375, currentY, 700, 120, 0xFFFFFF, 0.95);
            card.setStrokeStyle(2, 0xFF6B6B, 0.3);
            
            // 比赛名称
            const nameText = this.add.text(80, currentY - 30, comp.name, {
                fontSize: '28px',
                fontFamily: 'Microsoft YaHei',
                color: '#FF6B6B',
                fontStyle: 'bold'
            });
            
            // 等级要求
            const levelText = this.add.text(80, currentY + 5, `等级要求: Lv.${comp.level}`, {
                fontSize: '20px',
                fontFamily: 'Microsoft YaHei',
                color: '#666666'
            });
            
            // 报名费
            const feeText = this.add.text(80, currentY + 30, `报名费: ${comp.entryFee}金币`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FF6B6B'
            });
            
            // 奖励
            const rewardText = this.add.text(400, currentY - 10, 
                `奖励: ${comp.reward.gold}金币 | ${comp.reward.exp}经验 | ${comp.reward.reputation}声望`, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#333333'
            });
            
            // 描述
            const descText = this.add.text(400, currentY + 20, comp.description, {
                fontSize: '16px',
                fontFamily: 'Microsoft YaHei',
                color: '#999999'
            });
            
            // 报名按钮
            const joinBtn = this.add.text(650, currentY, '报名', {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF',
                backgroundColor: '#FF6B6B',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            
            joinBtn.on('pointerdown', () => {
                this.joinCompetition(comp);
            });
            
            currentY += 140;
        });
    }
    
    joinCompetition(competition) {
        // 检查等级
        if (window.gamePlayer && window.gamePlayer.data.level < competition.level) {
            this.showMessage('等级不足！', 'error');
            return;
        }
        
        // 检查报名费
        if (window.gamePlayer && !window.gamePlayer.spendGold(competition.entryFee)) {
            this.showMessage('金币不足！', 'error');
            return;
        }
        
        // 开始比赛
        this.startCompetition(competition);
    }
    
    startCompetition(competition) {
        // 创建比赛界面
        const panel = this.add.image(375, 667, 'panel');
        
        const title = this.add.text(375, 520, competition.name, {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 比赛进行中
        const statusText = this.add.text(375, 620, '比赛进行中...', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 进度条
        const progressBar = this.add.graphics();
        let progress = 0;
        
        const competitionInterval = setInterval(() => {
            progress += 5;
            
            progressBar.clear();
            progressBar.fillStyle(0xFF6B6B, 1);
            progressBar.fillRoundedRect(175, 700, 400 * (progress / 100), 30, 5);
            
            if (progress >= 100) {
                clearInterval(competitionInterval);
                this.completeCompetition(competition, panel, title, statusText, progressBar);
            }
        }, 100);
    }
    
    completeCompetition(competition, panel, title, statusText, progressBar) {
        // 计算比赛结果
        const playerScore = this.calculateScore();
        const opponentScore = this.calculateOpponentScore(competition);
        
        const isWin = playerScore > opponentScore;
        
        // 显示结果
        statusText.setText(isWin ? '比赛胜利！' : '比赛失败');
        statusText.setColor(isWin ? '#00AA00' : '#FF0000');
        
        // 结果详情
        const resultText = this.add.text(375, 750, 
            `你的得分: ${playerScore}\n` +
            `对手得分: ${opponentScore}\n\n` +
            (isWin ? 
                `获得奖励:\n` +
                `${competition.reward.gold}金币\n` +
                `${competition.reward.exp}经验\n` +
                `${competition.reward.reputation}声望` :
                '下次再接再厉！'), {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);
        
        // 发放奖励
        if (isWin && window.gamePlayer) {
            window.gamePlayer.gainGold(competition.reward.gold);
            window.gamePlayer.gainExp(competition.reward.exp);
            window.gamePlayer.gainReputation(competition.reward.reputation);
        }
        
        // 确定按钮
        const confirmBtn = this.add.image(375, 900, 'button')
            .setInteractive({ useHandCursor: true });
        
        const confirmText = this.add.text(375, 900, '确定', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        confirmBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            statusText.destroy();
            progressBar.destroy();
            resultText.destroy();
            confirmBtn.destroy();
            confirmText.destroy();
        });
    }
    
    calculateScore() {
        // 根据玩家等级和技能计算分数
        const baseScore = 50;
        const levelBonus = window.gamePlayer ? window.gamePlayer.data.level * 2 : 0;
        const skillBonus = window.gamePlayer ? window.gamePlayer.data.skills.length * 10 : 0;
        const randomBonus = Math.random() * 20;
        
        return Math.min(Math.round(baseScore + levelBonus + skillBonus + randomBonus), 100);
    }
    
    calculateOpponentScore(competition) {
        // 根据比赛等级计算对手分数
        const baseScore = 40 + competition.level;
        const randomBonus = Math.random() * 30;
        
        return Math.min(Math.round(baseScore + randomBonus), 100);
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
        
        // 2秒后消失
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
