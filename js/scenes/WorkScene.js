// 打工场景
class WorkScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorkScene' });
    }

    init(data) {
        this.workType = data.workType || 'math';
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 创建返回按钮
        this.createBackButton();

        // 根据打工类型创建不同的小游戏
        switch (this.workType) {
            case 'math':
                this.createMathGame();
                break;
            default:
                this.createMathGame();
        }
    }

    // 算术题游戏
    createMathGame() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 标题
        this.add.text(width / 2, 100, '算术挑战', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 说明
        this.add.text(width / 2, 160, '回答正确的算术题赚取金币！', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 游戏数据
        this.score = 0;
        this.questionCount = 0;
        this.maxQuestions = 5;
        this.currentAnswer = 0;

        // 分数显示
        this.scoreText = this.add.text(width / 2, 220, '得分: 0 (0/5)', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 题目显示
        this.questionText = this.add.text(width / 2, 320, '', {
            fontSize: '56px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 答案输入框 - 改小一些，位置上调
        this.answerInput = this.add.text(width / 2, 430, '点击输入答案', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999',
            backgroundColor: '#FFFFFF',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // 创建数字键盘 - 往上移，减小尺寸
        this.createNumberPad();

        // 当前输入的答案
        this.currentInput = '';

        // 生成第一题
        this.generateQuestion();

        // 提交按钮 - 放到数字键盘下方
        const submitBtn = this.add.image(width / 2, 1050, 'button_new')
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 1050, '提交答案', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        submitBtn.on('pointerdown', () => {
            this.checkAnswer();
        });
    }

    createNumberPad() {
        const startX = 180;
        const startY = 500;
        const buttonSize = 90;
        const gap = 15;

        const numbers = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['C', '0', '←']
        ];

        numbers.forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                const x = startX + colIndex * (buttonSize + gap);
                const y = startY + rowIndex * (buttonSize + gap);

                const btn = this.add.rectangle(x, y, buttonSize, buttonSize, 0xFF6B6B, 1)
                    .setInteractive({ useHandCursor: true });

                const text = this.add.text(x, y, num, {
                    fontSize: '28px',
                    fontFamily: 'Microsoft YaHei',
                    color: '#FFFFFF'
                }).setOrigin(0.5);

                btn.on('pointerdown', () => {
                    this.handleNumberInput(num);
                });
            });
        });
    }

    handleNumberInput(input) {
        if (input === 'C') {
            this.currentInput = '';
        } else if (input === '←') {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            if (this.currentInput.length < 4) {
                this.currentInput += input;
            }
        }

        this.answerInput.setText(this.currentInput || '点击输入答案');
        this.answerInput.setColor(this.currentInput ? '#333333' : '#999999');
    }

    generateQuestion() {
        // 简化为100以内的加减法
        let num1, num2, operator;

        num1 = Helpers.randomInt(1, 100);
        num2 = Helpers.randomInt(1, 100);
        operator = Math.random() > 0.5 ? '+' : '-';
        
        // 确保结果是正数
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        this.currentAnswer = operator === '+' ? num1 + num2 : num1 - num2;

        this.questionText.setText(num1 + ' ' + operator + ' ' + num2 + ' = ?');
        this.currentInput = '';
        this.answerInput.setText('点击输入答案');
        this.answerInput.setColor('#999999');
    }

    checkAnswer() {
        const userAnswer = parseInt(this.currentInput);

        if (userAnswer === this.currentAnswer) {
            this.score += 10;
            this.showFeedback('正确！', '#00AA00');
        } else {
            this.showFeedback('错误！答案是' + this.currentAnswer, '#FF0000');
        }

        this.questionCount++;
        this.scoreText.setText('得分: ' + this.score + ' (' + this.questionCount + '/' + this.maxQuestions + ')');

        if (this.questionCount >= this.maxQuestions) {
            this.endGame();
        } else {
            this.time.delayedCall(1500, () => {
                this.generateQuestion();
            });
        }
    }

    showFeedback(text, color) {
        const feedback = this.add.text(375, 280, text, {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 230,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    endGame() {
        const goldEarned = Math.floor(this.score * 0.5);
        const expEarned = Math.floor(this.score * 0.3);

        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            '最终得分: ' + this.score + '\n' +
            '获得金币: ' + goldEarned + '\n' +
            '获得经验: ' + expEarned, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(5);
        }

        const backBtn = this.add.image(375, 800, 'button_new')
            .setInteractive({ useHandCursor: true });

        this.add.text(375, 800, '返回街区', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
    }

    // 收银游戏
    createCashierGame() {
        const width = this.cameras.main.width;

        this.add.text(width / 2, 100, '收银挑战', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 180, '计算正确的找零金额！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        this.score = 0;
        this.questionCount = 0;
        this.maxQuestions = 5;
        this.currentChange = 0;

        this.scoreText = this.add.text(width / 2, 250, '得分: 0 (0/5)', {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        this.questionText = this.add.text(width / 2, 400, '', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        this.optionButtons = [];
        this.generateCashierQuestion();
    }

    generateCashierQuestion() {
        const level = window.gamePlayer ? window.gamePlayer.data.level : 1;

        let total, paid;
        if (level <= 10) {
            total = Helpers.randomInt(5, 50);
            paid = Math.ceil(total / 10) * 10;
            if (paid === total) paid += 10;
        } else if (level <= 30) {
            total = Helpers.randomInt(10, 100);
            paid = Math.ceil(total / 20) * 20;
            if (paid === total) paid += 20;
        } else {
            total = Helpers.randomInt(20, 200);
            paid = Math.ceil(total / 50) * 50;
            if (paid === total) paid += 50;
        }

        this.currentChange = paid - total;
        this.questionText.setText('消费: ' + total + '元\n支付: ' + paid + '元\n找零: ?');

        const options = [this.currentChange];
        while (options.length < 4) {
            const offset = Helpers.randomInt(-20, 20);
            const option = this.currentChange + offset;
            if (option > 0 && !options.includes(option)) {
                options.push(option);
            }
        }

        options.sort(() => Math.random() - 0.5);
        this.optionButtons.forEach(btn => btn.destroy());
        this.optionButtons = [];

        const startY = 550;
        const gap = 80;

        options.forEach((option, index) => {
            const btn = this.add.image(375, startY + index * gap, 'button_new')
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(375, startY + index * gap, option + '元', {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.checkCashierAnswer(option);
            });

            this.optionButtons.push(btn);
            this.optionButtons.push(text);
        });
    }

    checkCashierAnswer(answer) {
        if (answer === this.currentChange) {
            this.score += 10;
            this.showFeedback('正确！', '#00AA00');
        } else {
            this.showFeedback('错误！正确答案是' + this.currentChange + '元', '#FF0000');
        }

        this.questionCount++;
        this.scoreText.setText('得分: ' + this.score + ' (' + this.questionCount + '/' + this.maxQuestions + ')');

        if (this.questionCount >= this.maxQuestions) {
            this.endCashierGame();
        } else {
            this.time.delayedCall(1500, () => {
                this.generateCashierQuestion();
            });
        }
    }

    endCashierGame() {
        const goldEarned = Math.floor(this.score * 0.5);
        const expEarned = Math.floor(this.score * 0.3);

        this.optionButtons.forEach(btn => btn.destroy());

        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            '最终得分: ' + this.score + '\n' +
            '获得金币: ' + goldEarned + '\n' +
            '获得经验: ' + expEarned, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(10);
        }

        const backBtn = this.add.image(375, 800, 'button_new')
            .setInteractive({ useHandCursor: true });

        this.add.text(375, 800, '返回街区', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        backBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
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
