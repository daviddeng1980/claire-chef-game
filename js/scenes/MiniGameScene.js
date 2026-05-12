// 小游戏场景
class MiniGameScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.MINIGAME });
    }
    
    init(data) {
        this.gameType = data.gameType || 'rock_paper_scissors';
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');
        
        // 创建返回按钮
        this.createBackButton();
        
        // 根据游戏类型初始化不同的小游戏
        switch (this.gameType) {
            case 'rock_paper_scissors':
                this.createRockPaperScissors();
                break;
            case 'memory':
                this.createMemoryGame();
                break;
            default:
                this.createRockPaperScissors();
        }
    }
    
    // 石头剪刀布
    createRockPaperScissors() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 标题
        this.add.text(width / 2, 100, '石头剪刀布', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 说明
        this.add.text(width / 2, 180, '三局两胜制！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 分数
        this.playerScore = 0;
        this.opponentScore = 0;
        
        this.scoreText = this.add.text(width / 2, 250, '你: 0 - 对手: 0', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 对手选择显示
        this.opponentChoiceText = this.add.text(width / 2, 400, '🤔', {
            fontSize: '80px'
        }).setOrigin(0.5);
        
        // 结果文字
        this.resultText = this.add.text(width / 2, 550, '请选择...', {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 选择按钮
        const choices = [
            { emoji: '✊', name: '石头', x: 150 },
            { emoji: '✋', name: '布', x: 375 },
            { emoji: '✌️', name: '剪刀', x: 600 }
        ];
        
        this.choiceButtons = [];
        
        choices.forEach(choice => {
            const btn = this.add.text(choice.x, 700, choice.emoji, {
                fontSize: '80px'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            
            const nameText = this.add.text(choice.x, 800, choice.name, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#666666'
            }).setOrigin(0.5);
            
            btn.on('pointerover', () => {
                btn.setScale(1.2);
            });
            
            btn.on('pointerout', () => {
                btn.setScale(1);
            });
            
            btn.on('pointerdown', () => {
                this.playRound(choice.name);
            });
            
            this.choiceButtons.push({ btn, name: nameText });
        });
        
        // 奖励信息
        this.rewardText = this.add.text(width / 2, 900, '胜利奖励: 50金币 + 30经验', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);
    }
    
    playRound(playerChoice) {
        // 禁用按钮
        this.choiceButtons.forEach(cb => {
            cb.btn.disableInteractive();
        });
        
        // 对手选择
        const choices = ['石头', '布', '剪刀'];
        const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // 显示对手选择
        const choiceEmojis = { '石头': '✊', '布': '✋', '剪刀': '✌️' };
        this.opponentChoiceText.setText(choiceEmojis[opponentChoice]);
        
        // 判断胜负
        let result = '';
        if (playerChoice === opponentChoice) {
            result = '平局！';
        } else if (
            (playerChoice === '石头' && opponentChoice === '剪刀') ||
            (playerChoice === '布' && opponentChoice === '石头') ||
            (playerChoice === '剪刀' && opponentChoice === '布')
        ) {
            result = '你赢了！';
            this.playerScore++;
        } else {
            result = '你输了！';
            this.opponentScore++;
        }
        
        // 更新分数
        this.scoreText.setText(`你: ${this.playerScore} - 对手: ${this.opponentScore}`);
        this.resultText.setText(result);
        
        // 检查游戏结束
        if (this.playerScore >= 2 || this.opponentScore >= 2) {
            this.endGame();
        } else {
            // 启用按钮继续
            this.time.delayedCall(1500, () => {
                this.choiceButtons.forEach(cb => {
                    cb.btn.setInteractive({ useHandCursor: true });
                });
                this.opponentChoiceText.setText('🤔');
                this.resultText.setText('请选择...');
            });
        }
    }
    
    endGame() {
        const isWin = this.playerScore >= 2;
        
        // 显示最终结果
        this.resultText.setText(isWin ? '🎉 恭喜你赢了！' : '😢 很遗憾你输了');
        this.resultText.setColor(isWin ? '#00AA00' : '#FF0000');
        
        // 发放奖励
        if (isWin && window.gamePlayer) {
            window.gamePlayer.gainGold(50);
            window.gamePlayer.gainExp(30);
            this.rewardText.setText('获得奖励: 50金币 + 30经验');
            this.rewardText.setColor('#00AA00');
        }
        
        // 返回按钮
        const replayBtn = this.add.image(250, 1000, 'button_new')            .setInteractive({ useHandCursor: true });        const replayText = this.add.text(250, 1000, '再玩一次', {            fontSize: '24px',            fontFamily: 'Microsoft YaHei',            color: '#FFFFFF'        }).setOrigin(0.5);        const backBtn = this.add.image(500, 1000, 'button_new')
            .setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(500, 1000, '返回街区', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
        
        replayBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }
    
    // 记忆翻牌游戏
    createMemoryGame() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 标题
        this.add.text(width / 2, 100, '记忆翻牌', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 说明
        this.add.text(width / 2, 180, '找出相同的食材配对！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);
        
        // 游戏数据
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 6;
        this.attempts = 0;
        
        // 创建卡片
        const cardEmojis = ['🍅', '🥕', '🥚', '🥩', '🦐', '🍎'];
        const cardValues = [...cardEmojis, ...cardEmojis];
        
        // 洗牌
        for (let i = cardValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
        }
        
        // 创建卡片网格
        const cols = 4;
        const rows = 3;
        const cardWidth = 120;
        const cardHeight = 140;
        const startX = (width - (cols * cardWidth + (cols - 1) * 20)) / 2 + cardWidth / 2;
        const startY = 300;
        
        for (let i = 0; i < cardValues.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardWidth + 20);
            const y = startY + row * (cardHeight + 20);
            
            // 卡片背景
            const card = this.add.rectangle(x, y, cardWidth, cardHeight, 0xFF6B6B, 1)
                .setInteractive({ useHandCursor: true });
            
            // 卡片内容（初始隐藏）
            const content = this.add.text(x, y, cardValues[i], {
                fontSize: '60px'
            }).setOrigin(0.5).setVisible(false);
            
            // 问号
            const questionMark = this.add.text(x, y, '?', {
                fontSize: '48px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);
            
            card.on('pointerdown', () => {
                this.flipCard(i);
            });
            
            this.cards.push({
                card,
                content,
                questionMark,
                value: cardValues[i],
                isFlipped: false,
                isMatched: false
            });
        }
        
        // 分数
        this.scoreText = this.add.text(width / 2, 950, `配对: 0/${this.totalPairs} | 尝试: 0`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);
        
        // 奖励信息
        this.rewardText = this.add.text(width / 2, 1000, '完成奖励: 80金币 + 50经验', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);
    }
    
    flipCard(index) {
        const card = this.cards[index];
        
        // 检查是否可以翻牌
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        // 翻牌
        card.isFlipped = true;
        card.card.setFillStyle(0xFFFFFF, 1);
        card.content.setVisible(true);
        card.questionMark.setVisible(false);
        
        this.flippedCards.push(index);
        
        // 检查是否翻了两张
        if (this.flippedCards.length === 2) {
            this.attempts++;
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        if (card1.value === card2.value) {
            // 匹配成功
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            // 标记匹配
            card1.card.setStrokeStyle(4, 0x00AA00, 1);
            card2.card.setStrokeStyle(4, 0x00AA00, 1);
            
            this.flippedCards = [];
            
            // 检查游戏结束
            if (this.matchedPairs >= this.totalPairs) {
                this.endMemoryGame();
            }
        } else {
            // 匹配失败，翻回去
            this.time.delayedCall(1000, () => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                card1.card.setFillStyle(0xFF6B6B, 1);
                card2.card.setFillStyle(0xFF6B6B, 1);
                card1.content.setVisible(false);
                card2.content.setVisible(false);
                card1.questionMark.setVisible(true);
                card2.questionMark.setVisible(true);
                this.flippedCards = [];
            });
        }
        
        // 更新分数
        this.scoreText.setText(`配对: ${this.matchedPairs}/${this.totalPairs} | 尝试: ${this.attempts}`);
    }
    
    endMemoryGame() {
        // 显示胜利
        const victoryText = this.add.text(375, 1050, '🎉 恭喜完成！', {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#00AA00'
        }).setOrigin(0.5);
        
        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainGold(80);
            window.gamePlayer.gainExp(50);
            this.rewardText.setText('获得奖励: 80金币 + 50经验');
            this.rewardText.setColor('#00AA00');
        }
        
        // 返回按钮
        const backBtn = this.add.image(500, 1150, 'button_new')
            .setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(500, 1150, '返回街区', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
        
        // 再玩一次按钮
        const replayBtn = this.add.image(250, 1150, 'button_new')
            .setInteractive({ useHandCursor: true });
        
        const replayText = this.add.text(250, 1150, '再玩一次', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        replayBtn.on('pointerdown', () => {
            this.scene.restart();
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
