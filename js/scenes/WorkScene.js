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
            case 'dishwashing':
                this.createDishwashingGame();
                break;
            case 'balancing':
                this.createBalancingGame();
                break;
            case 'cashier':
                this.createCashierGame();
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
        this.add.text(width / 2, 180, '回答正确的算术题赚取金币！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 游戏数据
        this.score = 0;
        this.questionCount = 0;
        this.maxQuestions = 10;
        this.currentAnswer = 0;

        // 分数显示
        this.scoreText = this.add.text(width / 2, 250, `得分: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 题目显示
        this.questionText = this.add.text(width / 2, 400, '', {
            fontSize: '64px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 答案输入框
        this.answerInput = this.add.text(width / 2, 550, '点击输入答案', {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999',
            backgroundColor: '#FFFFFF',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // 创建数字键盘
        this.createNumberPad();

        // 当前输入的答案
        this.currentInput = '';

        // 生成第一题
        this.generateQuestion();

        // 提交按钮
        const submitBtn = this.add.image(width / 2, 900, 'button')
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 900, '提交答案', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        submitBtn.on('pointerdown', () => {
            this.checkAnswer();
        });
    }

    createNumberPad() {
        const startX = 200;
        const startY = 650;
        const buttonSize = 80;
        const gap = 20;

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
                    fontSize: '32px',
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
        const level = window.gamePlayer ? window.gamePlayer.data.level : 1;
        let num1, num2, operator;

        if (level <= 5) {
            // 初级：简单加减法
            num1 = Helpers.randomInt(1, 20);
            num2 = Helpers.randomInt(1, 20);
            operator = Math.random() > 0.5 ? '+' : '-';
            if (operator === '-' && num1 < num2) {
                [num1, num2] = [num2, num1];
            }
        } else if (level <= 15) {
            // 中级：加减乘
            num1 = Helpers.randomInt(1, 50);
            num2 = Helpers.randomInt(1, 12);
            const operators = ['+', '-', '×'];
            operator = operators[Helpers.randomInt(0, 2)];
        } else {
            // 高级：混合运算
            num1 = Helpers.randomInt(10, 100);
            num2 = Helpers.randomInt(2, 20);
            const operators = ['+', '-', '×', '÷'];
            operator = operators[Helpers.randomInt(0, 3)];
            if (operator === '÷') {
                num1 = num2 * Helpers.randomInt(2, 10);
            }
        }

        switch (operator) {
            case '+':
                this.currentAnswer = num1 + num2;
                break;
            case '-':
                this.currentAnswer = num1 - num2;
                break;
            case '×':
                this.currentAnswer = num1 * num2;
                break;
            case '÷':
                this.currentAnswer = num1 / num2;
                break;
        }

        this.questionText.setText(`${num1} ${operator} ${num2} = ?`);
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
            this.showFeedback(`错误！答案是${this.currentAnswer}`, '#FF0000');
        }

        this.questionCount++;
        this.scoreText.setText(`得分: ${this.score} (${this.questionCount}/${this.maxQuestions})`);

        if (this.questionCount >= this.maxQuestions) {
            this.endGame();
        } else {
            this.time.delayedCall(1500, () => {
                this.generateQuestion();
            });
        }
    }

    showFeedback(text, color) {
        const feedback = this.add.text(375, 350, text, {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 300,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    endGame() {
        // 计算奖励
        const goldEarned = Math.floor(this.score * 0.5);
        const expEarned = Math.floor(this.score * 0.3);

        // 显示结果
        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            `最终得分: ${this.score}\n` +
            `获得金币: ${goldEarned}\n` +
            `获得经验: ${expEarned}`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(5);
        }

        // 返回按钮
        const backBtn = this.add.image(375, 800, 'button')
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

    // 洗碗游戏
    createDishwashingGame() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 标题
        this.add.text(width / 2, 100, '洗碗挑战', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 说明
        this.add.text(width / 2, 180, '快速点击泡沫清洗碗碟！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 游戏数据
        this.dishesCleaned = 0;
        this.targetDishes = 20;
        this.timeLeft = 30;
        this.gameActive = true;

        // 分数显示
        this.scoreText = this.add.text(width / 2, 250, `已洗: ${this.dishesCleaned}/${this.targetDishes}`, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 时间显示
        this.timeText = this.add.text(width / 2, 300, `时间: ${this.timeLeft}秒`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B'
        }).setOrigin(0.5);

        // 创建碗
        this.createDish();

        // 倒计时
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timeText.setText(`时间: ${this.timeLeft}秒`);

                if (this.timeLeft <= 0) {
                    this.endDishwashingGame();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    createDish() {
        if (!this.gameActive) return;

        const x = Helpers.randomInt(150, 600);
        const y = Helpers.randomInt(400, 900);

        // 碗
        const dish = this.add.text(x, y, '🍽️', {
            fontSize: '60px'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // 泡沫
        const bubble = this.add.text(x, y, '🫧', {
            fontSize: '80px'
        }).setOrigin(0.5).setAlpha(0.8);

        dish.on('pointerdown', () => {
            // 清洗动画
            this.tweens.add({
                targets: [dish, bubble],
                scale: 1.3,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    dish.destroy();
                    bubble.destroy();
                    this.dishesCleaned++;
                    this.scoreText.setText(`已洗: ${this.dishesCleaned}/${this.targetDishes}`);

                    if (this.dishesCleaned >= this.targetDishes) {
                        this.endDishwashingGame();
                    } else {
                        this.createDish();
                    }
                }
            });
        });
    }

    endDishwashingGame() {
        this.gameActive = false;
        if (this.timeEvent) {
            this.timeEvent.remove();
        }

        // 计算奖励
        const goldEarned = Math.floor(this.dishesCleaned * 3);
        const expEarned = Math.floor(this.dishesCleaned * 2);

        // 显示结果
        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            `清洗碗碟: ${this.dishesCleaned}个\n` +
            `获得金币: ${goldEarned}\n` +
            `获得经验: ${expEarned}`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(8);
        }

        // 返回按钮
        const backBtn = this.add.image(375, 800, 'button')
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

    // 端盘子游戏
    createBalancingGame() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 标题
        this.add.text(width / 2, 100, '端盘子挑战', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 说明
        this.add.text(width / 2, 180, '左右倾斜保持平衡！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        this.add.text(width / 2, 220, '点击左右屏幕控制方向', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);

        // 游戏数据
        this.balance = 50; // 0-100，50为平衡
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = true;

        // 分数显示
        this.scoreText = this.add.text(width / 2, 280, `得分: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 时间显示
        this.timeText = this.add.text(width / 2, 330, `时间: ${this.timeLeft}秒`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B'
        }).setOrigin(0.5);

        // 平衡条背景
        const barBg = this.add.graphics();
        barBg.fillStyle(0xEEEEEE, 1);
        barBg.fillRoundedRect(175, 400, 400, 40, 5);

        // 平衡条
        this.balanceBar = this.add.graphics();

        // 平衡点
        this.balanceIndicator = this.add.circle(375, 420, 15, 0xFF6B6B);

        // 盘子
        this.plate = this.add.text(375, 600, '🍽️', {
            fontSize: '80px'
        }).setOrigin(0.5);

        // 左右控制区域
        const leftZone = this.add.rectangle(187, 800, 375, 400, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        const rightZone = this.add.rectangle(562, 800, 375, 400, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        leftZone.on('pointerdown', () => {
            if (this.gameActive) this.balance -= 5;
        });

        rightZone.on('pointerdown', () => {
            if (this.gameActive) this.balance += 5;
        });

        // 倒计时
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timeText.setText(`时间: ${this.timeLeft}秒`);

                if (this.timeLeft <= 0) {
                    this.endBalancingGame();
                }
            },
            callbackScope: this,
            loop: true
        });

        // 游戏循环
        this.updateEvent = this.time.addEvent({
            delay: 100,
            callback: this.updateBalance,
            callbackScope: this,
            loop: true
        });
    }

    updateBalance() {
        if (!this.gameActive) return;

        // 随机扰动
        this.balance += Helpers.random(-2, 2);

        // 限制范围
        this.balance = Math.max(0, Math.min(100, this.balance));

        // 更新平衡条
        this.balanceBar.clear();

        // 绿色区域（安全区）
        this.balanceBar.fillStyle(0x00AA00, 0.3);
        this.balanceBar.fillRoundedRect(325, 400, 100, 40, 5);

        // 黄色区域（警告区）
        this.balanceBar.fillStyle(0xFFD700, 0.3);
        this.balanceBar.fillRoundedRect(250, 400, 75, 40, 5);
        this.balanceBar.fillRoundedRect(425, 400, 75, 40, 5);

        // 红色区域（危险区）
        this.balanceBar.fillStyle(0xFF0000, 0.3);
        this.balanceBar.fillRoundedRect(175, 400, 75, 40, 5);
        this.balanceBar.fillRoundedRect(500, 400, 75, 40, 5);

        // 更新指示器位置
        const indicatorX = 175 + (this.balance / 100) * 400;
        this.balanceIndicator.setPosition(indicatorX, 420);

        // 更新盘子倾斜
        const tilt = (this.balance - 50) * 0.8;
        this.plate.setAngle(tilt);

        // 检查平衡
        if (this.balance >= 40 && this.balance <= 60) {
            this.score += 1;
            this.scoreText.setText(`得分: ${this.score}`);
        }

        // 检查失败
        if (this.balance <= 10 || this.balance >= 90) {
            this.endBalancingGame();
        }
    }

    endBalancingGame() {
        this.gameActive = false;
        if (this.timeEvent) this.timeEvent.remove();
        if (this.updateEvent) this.updateEvent.remove();

        // 计算奖励
        const goldEarned = Math.floor(this.score * 0.8);
        const expEarned = Math.floor(this.score * 0.5);

        // 显示结果
        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            `最终得分: ${this.score}\n` +
            `获得金币: ${goldEarned}\n` +
            `获得经验: ${expEarned}`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(10);
        }

        // 返回按钮
        const backBtn = this.add.image(375, 800, 'button')
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
        const height = this.cameras.main.height;

        // 标题
        this.add.text(width / 2, 100, '收银挑战', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 说明
        this.add.text(width / 2, 180, '计算正确的找零金额！', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 游戏数据
        this.score = 0;
        this.questionCount = 0;
        this.maxQuestions = 10;
        this.currentChange = 0;

        // 分数显示
        this.scoreText = this.add.text(width / 2, 250, `得分: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 题目显示
        this.questionText = this.add.text(width / 2, 400, '', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        // 答案选项
        this.optionButtons = [];

        // 生成第一题
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

        this.questionText.setText(`消费: ${total}元\n支付: ${paid}元\n找零: ?`);

        // 生成选项
        const options = [this.currentChange];
        while (options.length < 4) {
            const offset = Helpers.randomInt(-20, 20);
            const option = this.currentChange + offset;
            if (option > 0 && !options.includes(option)) {
                options.push(option);
            }
        }

        // 打乱选项
        options.sort(() => Math.random() - 0.5);

        // 清除旧按钮
        this.optionButtons.forEach(btn => btn.destroy());
        this.optionButtons = [];

        // 创建选项按钮
        const startY = 550;
        const gap = 80;

        options.forEach((option, index) => {
            const btn = this.add.image(375, startY + index * gap, 'button')
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(375, startY + index * gap, `${option}元`, {
                fontSize: '28px',
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
            this.showFeedback(`错误！正确答案是${this.currentChange}元`, '#FF0000');
        }

        this.questionCount++;
        this.scoreText.setText(`得分: ${this.score} (${this.questionCount}/${this.maxQuestions})`);

        if (this.questionCount >= this.maxQuestions) {
            this.endCashierGame();
        } else {
            this.time.delayedCall(1500, () => {
                this.generateCashierQuestion();
            });
        }
    }

    endCashierGame() {
        // 计算奖励
        const goldEarned = Math.floor(this.score * 0.5);
        const expEarned = Math.floor(this.score * 0.3);

        // 清除选项按钮
        this.optionButtons.forEach(btn => btn.destroy());

        // 显示结果
        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 550, '打工完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resultText = this.add.text(375, 650,
            `最终得分: ${this.score}\n` +
            `获得金币: ${goldEarned}\n` +
            `获得经验: ${expEarned}`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);

        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainGold(goldEarned);
            window.gamePlayer.gainExp(expEarned);
            window.gamePlayer.consumeEnergy(10);
        }

        // 返回按钮
        const backBtn = this.add.image(375, 800, 'button')
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
