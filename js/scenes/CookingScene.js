// 烹饪场景
class CookingScene extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.COOKING });
        this.recipes = null;
        this.selectedRecipe = null;
        this.currentStep = 0;
        this.cookingScore = { taste: 0, appearance: 0, creativity: 0 };
        this.isCooking = false;
    }

    preload() {
        // 加载菜谱数据
        this.load.json('recipes', 'assets/data/recipes.json');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 加载菜谱数据
        this.recipes = this.cache.json.get('recipes').recipes;

        // 创建厨房背景
        this.createKitchenBackground();

        // 创建UI
        this.createUI();

        // 创建烹饪区域
        this.createCookingArea();

        // 创建返回按钮
        this.createBackButton();
    }

    createKitchenBackground() {
        const graphics = this.add.graphics();

        // 墙壁
        graphics.fillStyle(0xFFE4C4, 1);
        graphics.fillRect(0, 0, 750, 800);

        // 地板
        graphics.fillStyle(0xD2B48C, 1);
        graphics.fillRect(0, 800, 750, 534);

        // 厨房台面
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(50, 600, 650, 200);

        // 灶台
        graphics.fillStyle(0x696969, 1);
        graphics.fillRect(200, 550, 150, 80);
        graphics.fillRect(400, 550, 150, 80);

        // 火焰效果（简化）
        graphics.fillStyle(0xFF4500, 0.8);
        graphics.fillCircle(275, 570, 20);
        graphics.fillCircle(475, 570, 20);
    }

    createUI() {
        // 标题
        this.add.text(375, 50, '烹饪厨房', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 当前菜谱
        this.recipeText = this.add.text(375, 120, '选择菜谱开始烹饪', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#666666'
        }).setOrigin(0.5);

        // 步骤显示
        this.stepText = this.add.text(375, 170, '', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);
    }

    createCookingArea() {
        // 烹饪区域
        const cookingArea = this.add.rectangle(375, 500, 500, 300, 0xFFFFFF, 0.5);

        // 选择菜谱按钮
        const selectRecipeBtn = this.add.image(375, 400, 'button')
            .setInteractive({ useHandCursor: true });

        this.add.text(375, 400, '选择菜谱', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        selectRecipeBtn.on('pointerdown', () => {
            if (!this.isCooking) {
                this.showRecipeList();
            }
        });

        // 开始烹饪按钮（初始禁用）
        this.startCookBtn = this.add.image(375, 500, 'button')
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.5);

        this.startCookText = this.add.text(375, 500, '开始烹饪', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.startCookBtn.on('pointerdown', () => {
            if (this.selectedRecipe && !this.isCooking) {
                this.startCooking();
            }
        });

        // 食材展示区域
        this.ingredientsContainer = this.add.container(375, 650);

        // QTE区域（初始隐藏）
        this.qteContainer = this.add.container(375, 750);
        this.qteContainer.setVisible(false);
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
            if (!this.isCooking) {
                this.scene.start(CONSTANTS.SCENES.STREET);
            }
        });
    }

    showRecipeList() {
        // 显示菜谱列表面板
        const panel = this.add.image(375, 667, 'panel');

        const title = this.add.text(375, 520, '选择菜谱', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 获取玩家等级
        const playerLevel = window.gamePlayer ? window.gamePlayer.data.level : 1;

        // 过滤可解锁的菜谱
        const availableRecipes = this.recipes.filter(r => r.unlockLevel <= playerLevel);

        let currentY = 600;
        const buttons = [];

        availableRecipes.forEach(recipe => {
            const btn = this.add.image(375, currentY, 'button')
                .setInteractive({ useHandCursor: true });

            const btnText = this.add.text(375, currentY, `${recipe.name} ${'⭐'.repeat(recipe.difficulty)}`, {
                fontSize: '24px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            const ingredientsText = this.add.text(375, currentY + 25, 
                recipe.ingredients.map(i => `${i.id}×${i.quantity}`).join(', '), {
                fontSize: '16px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                this.selectRecipe(recipe);
                panel.destroy();
                title.destroy();
                buttons.forEach(b => {
                    b.btn.destroy();
                    b.text.destroy();
                    b.ingredients.destroy();
                });
                closeBtn.destroy();
                closeText.destroy();
            });

            buttons.push({ btn, text: btnText, ingredients: ingredientsText });
            currentY += 80;
        });

        // 关闭按钮
        const closeBtn = this.add.image(375, currentY + 20, 'button')
            .setInteractive({ useHandCursor: true });

        const closeText = this.add.text(375, currentY + 20, '取消', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        closeBtn.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            buttons.forEach(b => {
                b.btn.destroy();
                b.text.destroy();
                b.ingredients.destroy();
            });
            closeBtn.destroy();
            closeText.destroy();
        });
    }

    selectRecipe(recipe) {
        this.selectedRecipe = recipe;
        this.recipeText.setText(`当前菜谱: ${recipe.name}`);

        // 启用开始烹饪按钮
        this.startCookBtn.setAlpha(1);

        // 显示所需食材
        this.ingredientsContainer.removeAll(true);

        const ingredientsText = this.add.text(0, 0, 
            `所需食材: ${recipe.ingredients.map(i => `${i.id}×${i.quantity}`).join(', ')}`, {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        this.ingredientsContainer.add(ingredientsText);
    }

    startCooking() {
        // 检查食材
        if (!this.checkIngredients()) {
            this.showMessage('食材不足！', 'error');
            return;
        }

        // 消耗食材
        this.consumeIngredients();

        // 开始烹饪流程
        this.isCooking = true;
        this.currentStep = 0;
        this.cookingScore = { taste: 0, appearance: 0, creativity: 0 };

        this.recipeText.setText('烹饪中...');
        this.startCookBtn.setAlpha(0.5);

        // 开始第一步
        this.executeStep();
    }

    checkIngredients() {
        if (!window.gameInventory) return false;

        for (const ingredient of this.selectedRecipe.ingredients) {
            if (!window.gameInventory.hasEnough(ingredient.id, ingredient.quantity, ingredient.quality || 'common')) {
                return false;
            }
        }
        return true;
    }

    consumeIngredients() {
        if (!window.gameInventory) return;

        for (const ingredient of this.selectedRecipe.ingredients) {
            window.gameInventory.removeItem(ingredient.id, ingredient.quantity, ingredient.quality || 'common');
        }
    }

    executeStep() {
        if (this.currentStep >= this.selectedRecipe.steps.length) {
            this.completeCooking();
            return;
        }

        const step = this.selectedRecipe.steps[this.currentStep];
        this.stepText.setText(`步骤 ${this.currentStep + 1}/${this.selectedRecipe.steps.length}: ${step.name}`);

        // 显示QTE
        this.showQTE(step);
    }

    showQTE(step) {
        this.qteContainer.removeAll(true);
        this.qteContainer.setVisible(true);

        switch (step.type) {
            case 'qte':
                this.createQTEChallenge(step);
                break;
            case 'timing':
                this.createTimingChallenge(step);
                break;
            case 'sequence':
                this.createSequenceChallenge(step);
                break;
            default:
                this.createQTEChallenge(step);
        }
    }

    createQTEChallenge(step) {
        // QTE挑战：快速点击
        const instruction = this.add.text(0, -50, step.description, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 点击区域
        const clickArea = this.add.circle(0, 50, 60, 0xFF6B6B)
            .setInteractive({ useHandCursor: true });

        const clickText = this.add.text(0, 50, '点击!', {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        let clickCount = 0;
        const targetClicks = 10;
        const timeLimit = 5000; // 5秒

        // 进度条
        const progressBar = this.add.graphics();

        clickArea.on('pointerdown', () => {
            clickCount++;

            // 更新进度条
            progressBar.clear();
            progressBar.fillStyle(0x00AA00, 1);
            progressBar.fillRoundedRect(-100, 120, 200 * (clickCount / targetClicks), 20, 5);

            // 点击动画
            this.tweens.add({
                targets: clickArea,
                scale: 1.2,
                duration: 100,
                yoyo: true
            });

            if (clickCount >= targetClicks) {
                this.completeStep(100);
            }
        });

        this.qteContainer.add([instruction, clickArea, clickText, progressBar]);

        // 倒计时
        this.qteTimer = this.time.delayedCall(timeLimit, () => {
            const score = Math.floor((clickCount / targetClicks) * 100);
            this.completeStep(score);
        });
    }

    createTimingChallenge(step) {
        // 时机挑战：在正确时机点击
        const instruction = this.add.text(0, -50, step.description, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 移动的目标
        const target = this.add.circle(-150, 50, 20, 0xFF6B6B);
        const sweetSpot = this.add.circle(0, 50, 30, 0x00AA00, 0.3);

        // 点击按钮
        const clickBtn = this.add.image(0, 150, 'button')
            .setInteractive({ useHandCursor: true });

        const clickText = this.add.text(0, 150, '点击!', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // 移动动画
        this.tweens.add({
            targets: target,
            x: 150,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        let clicked = false;

        clickBtn.on('pointerdown', () => {
            if (clicked) return;
            clicked = true;

            // 计算距离
            const distance = Math.abs(target.x - sweetSpot.x);
            let score = 0;

            if (distance < 20) {
                score = 100;
                this.showFeedback('完美!', '#00AA00');
            } else if (distance < 50) {
                score = 70;
                this.showFeedback('不错!', '#FFD700');
            } else if (distance < 100) {
                score = 40;
                this.showFeedback('一般', '#FF8C00');
            } else {
                score = 20;
                this.showFeedback(' missed!', '#FF0000');
            }

            this.time.delayedCall(1000, () => {
                this.completeStep(score);
            });
        });

        this.qteContainer.add([instruction, target, sweetSpot, clickBtn, clickText]);

        // 超时
        this.qteTimer = this.time.delayedCall(5000, () => {
            if (!clicked) {
                this.completeStep(0);
            }
        });
    }

    createSequenceChallenge(step) {
        // 顺序挑战：按正确顺序点击
        const instruction = this.add.text(0, -50, step.description, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 生成顺序
        const sequence = ['盐', '糖', '酱油', '醋'];
        const shuffled = [...sequence].sort(() => Math.random() - 0.5);

        const buttons = [];
        let currentIndex = 0;

        shuffled.forEach((item, index) => {
            const x = (index - 1.5) * 100;
            const btn = this.add.circle(x, 50, 35, 0xFF6B6B)
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(x, 50, item, {
                fontSize: '18px',
                fontFamily: 'Microsoft YaHei',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                if (item === sequence[currentIndex]) {
                    // 正确
                    btn.setFillStyle(0x00AA00);
                    currentIndex++;

                    if (currentIndex >= sequence.length) {
                        const score = Math.floor((currentIndex / sequence.length) * 100);
                        this.completeStep(score);
                    }
                } else {
                    // 错误
                    btn.setFillStyle(0xFF0000);
                    this.showFeedback('顺序错误!', '#FF0000');

                    this.time.delayedCall(1000, () => {
                        const score = Math.floor((currentIndex / sequence.length) * 100);
                        this.completeStep(score);
                    });
                }
            });

            buttons.push({ btn, text });
        });

        this.qteContainer.add([instruction, ...buttons.map(b => b.btn), ...buttons.map(b => b.text)]);

        // 超时
        this.qteTimer = this.time.delayedCall(10000, () => {
            const score = Math.floor((currentIndex / sequence.length) * 100);
            this.completeStep(score);
        });
    }

    completeStep(score) {
        // 清除计时器
        if (this.qteTimer) {
            this.qteTimer.remove();
            this.qteTimer = null;
        }

        // 计算分数
        const step = this.selectedRecipe.steps[this.currentStep];
        this.cookingScore.taste += score * step.weight.taste;
        this.cookingScore.appearance += score * step.weight.appearance;
        this.cookingScore.creativity += score * step.weight.creativity;

        this.currentStep++;

        // 隐藏QTE
        this.qteContainer.setVisible(false);

        // 执行下一步
        this.time.delayedCall(500, () => {
            this.executeStep();
        });
    }

    completeCooking() {
        this.isCooking = false;

        // 计算最终分数
        const finalScore = {
            taste: Math.min(Math.round(this.cookingScore.taste), 100),
            appearance: Math.min(Math.round(this.cookingScore.appearance), 100),
            creativity: Math.min(Math.round(this.cookingScore.creativity), 100)
        };

        const averageScore = (finalScore.taste + finalScore.appearance + finalScore.creativity) / 3;

        // 计算奖励
        const multiplier = averageScore / 100;
        const expReward = Math.round(this.selectedRecipe.reward.exp * multiplier);
        const goldReward = Math.round(this.selectedRecipe.reward.gold * multiplier);

        // 显示结果
        const resultPanel = this.add.image(375, 667, 'panel');

        const resultTitle = this.add.text(375, 520, '烹饪完成！', {
            fontSize: '48px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const scoreText = averageScore >= 80 ? '完美!' : averageScore >= 60 ? '不错!' : '还需要练习';
        const scoreColor = averageScore >= 80 ? '#00AA00' : averageScore >= 60 ? '#FFD700' : '#FF8C00';

        const resultText = this.add.text(375, 600,
            `${scoreText}\n\n` +
            `味道: ${finalScore.taste}分\n` +
            `外观: ${finalScore.appearance}分\n` +
            `创意: ${finalScore.creativity}分\n` +
            `平均分: ${Math.round(averageScore)}分`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: scoreColor,
            align: 'center'
        }).setOrigin(0.5);

        const rewardText = this.add.text(375, 750,
            `获得: ${expReward}经验, ${goldReward}金币`, {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333'
        }).setOrigin(0.5);

        // 发放奖励
        if (window.gamePlayer) {
            window.gamePlayer.gainExp(expReward);
            window.gamePlayer.gainGold(goldReward);
            window.gamePlayer.data.statistics.totalCooking++;
        }

        // 确定按钮
        const confirmBtn = this.add.image(375, 850, 'button')
            .setInteractive({ useHandCursor: true });

        const confirmText = this.add.text(375, 850, '确定', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        confirmBtn.on('pointerdown', () => {
            resultPanel.destroy();
            resultTitle.destroy();
            resultText.destroy();
            rewardText.destroy();
            confirmBtn.destroy();
            confirmText.destroy();

            // 重置状态
            this.selectedRecipe = null;
            this.recipeText.setText('选择菜谱开始烹饪');
            this.stepText.setText('');
            this.ingredientsContainer.removeAll(true);
            this.startCookBtn.setAlpha(0.5);
        });
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
}
