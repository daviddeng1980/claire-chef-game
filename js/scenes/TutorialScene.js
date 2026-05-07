// 新手引导场景
class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        this.step = 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.cameras.main.setBackgroundColor('#FFF8E7');

        // 创建引导内容
        this.createTutorialContent();

        // 创建下一步按钮
        this.createNextButton();

        // 创建跳过按钮
        this.createSkipButton();
    }

    createTutorialContent() {
        const tutorials = [
            {
                title: '欢迎来到烹饪世界！',
                content: '我是克莱尔，梦想成为五星级大厨！\n\n在这个街区里，我可以：\n• 去饭店打工赚钱\n• 在商店购买食材\n• 学习烹饪技能\n• 参加比赛提升等级',
                icon: '👩‍🍳'
            },
            {
                title: '打工赚钱',
                content: '点击「饭店」可以打工：\n• 算术题 - 考验数学能力\n• 洗碗 - 快速点击挑战\n• 端盘子 - 平衡控制\n• 收银 - 计算找零\n\n打工消耗体力，赚取金币！',
                icon: '💰'
            },
            {
                title: '购买食材',
                content: '点击「商场」购买食材：\n• 蔬菜、肉类、海鲜\n• 水果、调料、特殊食材\n\n不同品质影响菜品评分！',
                icon: '🛒'
            },
            {
                title: '学习技能',
                content: '点击「烹饪学校」学习：\n• 煎、炒、烹、蒸、煮\n• 炸、炖、烘焙、甜品\n• 酱汁、摆盘\n\n技能越多，能做的菜越多！',
                icon: '📚'
            },
            {
                title: '烹饪菜品',
                content: '点击「家」开始烹饪：\n• 选择菜谱\n• 完成QTE挑战\n• 获得评分和奖励\n\n评分越高，奖励越丰厚！',
                icon: '🍳'
            },
            {
                title: '参加比赛',
                content: '等级足够后可以参赛：\n• 街区小厨赛\n• 区级烹饪赛\n• 市级美食大赛\n• 全国烹饪锦标赛\n\n赢得比赛获得大奖！',
                icon: '🏆'
            },
            {
                title: '开始冒险吧！',
                content: '记住：\n• 体力会自然恢复\n• 每天完成任务\n• 提升等级解锁新内容\n\n让我们一起成为五星级大厨！',
                icon: '⭐'
            }
        ];

        this.tutorials = tutorials;
        this.showStep(0);
    }

    showStep(stepIndex) {
        // 清除旧内容
        if (this.contentContainer) {
            this.contentContainer.destroy();
        }

        this.step = stepIndex;
        const tutorial = this.tutorials[stepIndex];

        this.contentContainer = this.add.container(375, 400);

        // 图标
        const icon = this.add.text(0, -150, tutorial.icon, {
            fontSize: '80px'
        }).setOrigin(0.5);

        // 标题
        const title = this.add.text(0, -50, tutorial.title, {
            fontSize: '36px',
            fontFamily: 'Microsoft YaHei',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 内容
        const content = this.add.text(0, 80, tutorial.content, {
            fontSize: '24px',
            fontFamily: 'Microsoft YaHei',
            color: '#333333',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // 步骤指示器
        const stepIndicator = this.add.text(0, 200, 
            `${stepIndex + 1} / ${this.tutorials.length}`, {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5);

        this.contentContainer.add([icon, title, content, stepIndicator]);

        // 更新按钮文字
        if (this.nextBtnText) {
            if (stepIndex >= this.tutorials.length - 1) {
                this.nextBtnText.setText('开始游戏！');
            } else {
                this.nextBtnText.setText('下一步');
            }
        }
    }

    createNextButton() {
        const nextBtn = this.add.image(375, 700, 'button_new')
            .setInteractive({ useHandCursor: true });

        this.nextBtnText = this.add.text(375, 700, '下一步', {
            fontSize: '28px',
            fontFamily: 'Microsoft YaHei',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        nextBtn.on('pointerdown', () => {
            if (this.step >= this.tutorials.length - 1) {
                // 完成引导，开始游戏
                this.scene.start(CONSTANTS.SCENES.STREET);
            } else {
                this.showStep(this.step + 1);
            }
        });
    }

    createSkipButton() {
        const skipBtn = this.add.text(375, 780, '跳过引导', {
            fontSize: '20px',
            fontFamily: 'Microsoft YaHei',
            color: '#999999'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        skipBtn.on('pointerdown', () => {
            this.scene.start(CONSTANTS.SCENES.STREET);
        });
    }
}
