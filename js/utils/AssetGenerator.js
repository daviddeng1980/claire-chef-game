// 游戏素材生成器 - 使用 Canvas 绘制精美图形
class AssetGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    // 生成克莱尔角色
    generateClaire() {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const size = 128;

        // 背景透明
        graphics.clear();

        // 身体（厨师服）
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(30, 50, 68, 60, 10);

        // 厨师服领子
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillTriangle(45, 50, 64, 70, 83, 50);

        // 纽扣
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillCircle(64, 75, 4);
        graphics.fillCircle(64, 90, 4);

        // 头部
        graphics.fillStyle(0xFFDBAC, 1);
        graphics.fillCircle(64, 35, 25);

        // 厨师帽
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(35, 5, 58, 25, 5);
        graphics.fillRoundedRect(25, -5, 78, 20, 5);

        // 帽子褶皱
        graphics.lineStyle(2, 0xEEEEEE, 1);
        graphics.lineBetween(45, 5, 45, 20);
        graphics.lineBetween(64, 5, 64, 20);
        graphics.lineBetween(83, 5, 83, 20);

        // 眼睛
        graphics.fillStyle(0x333333, 1);
        graphics.fillCircle(55, 32, 4);
        graphics.fillCircle(73, 32, 4);

        // 眼睛高光
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(56, 31, 1.5);
        graphics.fillCircle(74, 31, 1.5);

        // 腮红
        graphics.fillStyle(0xFFB6C1, 0.6);
        graphics.fillCircle(48, 40, 5);
        graphics.fillCircle(80, 40, 5);

        // 嘴巴（微笑）
        graphics.lineStyle(2, 0xFF6B6B, 1);
        graphics.beginPath();
        graphics.arc(64, 42, 6, 0.1 * Math.PI, 0.9 * Math.PI);
        graphics.strokePath();

        // 手臂
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(20, 60, 15, 40, 7);
        graphics.fillRoundedRect(93, 60, 15, 40, 7);

        // 手
        graphics.fillStyle(0xFFDBAC, 1);
        graphics.fillCircle(27, 105, 8);
        graphics.fillCircle(100, 105, 8);

        // 腿
        graphics.fillStyle(0x333333, 1);
        graphics.fillRoundedRect(45, 105, 15, 20, 5);
        graphics.fillRoundedRect(68, 105, 15, 20, 5);

        // 脚
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(40, 120, 20, 8, 4);
        graphics.fillRoundedRect(68, 120, 20, 8, 4);

        graphics.generateTexture('claire', size, size);
        return 'claire';
    }

    // 生成建筑
    generateBuilding(type) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const width = 120;
        const height = 120;

        switch (type) {
            case 'home':
                this.drawHome(graphics, width, height);
                break;
            case 'restaurant':
                this.drawRestaurant(graphics, width, height);
                break;
            case 'barbershop':
                this.drawBarbershop(graphics, width, height);
                break;
            case 'mall':
                this.drawMall(graphics, width, height);
                break;
            case 'cinema':
                this.drawCinema(graphics, width, height);
                break;
            case 'cooking_school':
                this.drawCookingSchool(graphics, width, height);
                break;
        }

        graphics.generateTexture(type, width, height);
        return type;
    }

    drawHome(graphics, w, h) {
        // 房子主体
        graphics.fillStyle(0xFFE4B5, 1);
        graphics.fillRect(20, 40, 80, 70);

        // 屋顶
        graphics.fillStyle(0xCD853F, 1);
        graphics.fillTriangle(10, 40, 60, 10, 110, 40);

        // 门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(45, 70, 30, 40, 5);

        // 窗户
        graphics.fillStyle(0x87CEEB, 1);
        graphics.fillRect(30, 55, 15, 15);
        graphics.fillRect(75, 55, 15, 15);

        // 窗户十字
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.lineBetween(37, 55, 37, 70);
        graphics.lineBetween(30, 62, 45, 62);
        graphics.lineBetween(82, 55, 82, 70);
        graphics.lineBetween(75, 62, 90, 62);

        // 烟囱
        graphics.fillStyle(0xA0522D, 1);
        graphics.fillRect(85, 20, 12, 25);

        // 烟雾
        graphics.fillStyle(0xCCCCCC, 0.5);
        graphics.fillCircle(91, 15, 5);
        graphics.fillCircle(95, 10, 7);
        graphics.fillCircle(100, 5, 9);
    }

    drawRestaurant(graphics, w, h) {
        // 建筑主体
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillRect(15, 30, 90, 80);

        // 屋顶
        graphics.fillStyle(0x8B0000, 1);
        graphics.fillTriangle(10, 30, 60, 10, 110, 30);

        // 门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(45, 70, 30, 40, 5);

        // 窗户
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillRect(25, 45, 20, 20);
        graphics.fillRect(75, 45, 20, 20);

        // 招牌
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(20, 15, 80, 20, 5);
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillCircle(35, 25, 5);
        graphics.fillCircle(50, 25, 5);
        graphics.fillCircle(65, 25, 5);
        graphics.fillCircle(80, 25, 5);
    }

    drawBarbershop(graphics, w, h) {
        // 建筑主体
        graphics.fillStyle(0x87CEEB, 1);
        graphics.fillRect(15, 30, 90, 80);

        // 屋顶
        graphics.fillStyle(0x4682B4, 1);
        graphics.fillTriangle(10, 30, 60, 10, 110, 30);

        // 门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(45, 70, 30, 40, 5);

        // 理发店转灯
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(50, 35, 20, 30);
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRect(50, 40, 20, 5);
        graphics.fillRect(50, 50, 20, 5);
        graphics.fillRect(50, 60, 20, 5);
    }

    drawMall(graphics, w, h) {
        // 建筑主体
        graphics.fillStyle(0x98FB98, 1);
        graphics.fillRect(10, 20, 100, 90);

        // 屋顶
        graphics.fillStyle(0x228B22, 1);
        graphics.fillTriangle(5, 20, 60, 5, 115, 20);

        // 大门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(40, 70, 40, 40, 5);

        // 窗户（多排）
        graphics.fillStyle(0x87CEEB, 1);
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                graphics.fillRect(20 + col * 30, 35 + row * 25, 20, 15);
            }
        }
    }

    drawCinema(graphics, w, h) {
        // 建筑主体
        graphics.fillStyle(0xDDA0DD, 1);
        graphics.fillRect(15, 30, 90, 80);

        // 屋顶
        graphics.fillStyle(0x8B008B, 1);
        graphics.fillTriangle(10, 30, 60, 10, 110, 30);

        // 门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(45, 70, 30, 40, 5);

        // 电影胶片装饰
        graphics.fillStyle(0x333333, 1);
        graphics.fillRect(25, 40, 70, 20);
        graphics.fillStyle(0xFFFFFF, 1);
        for (let i = 0; i < 5; i++) {
            graphics.fillCircle(30 + i * 15, 50, 3);
        }
    }

    drawCookingSchool(graphics, w, h) {
        // 建筑主体
        graphics.fillStyle(0xF0E68C, 1);
        graphics.fillRect(15, 30, 90, 80);

        // 屋顶
        graphics.fillStyle(0xB8860B, 1);
        graphics.fillTriangle(10, 30, 60, 10, 110, 30);

        // 门
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRoundedRect(45, 70, 30, 40, 5);

        // 厨师帽标志
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(45, 40, 30, 20, 3);
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillCircle(60, 35, 8);
    }

    // 生成食材图标
    generateFoodItem(type) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const size = 64;

        switch (type) {
            case 'tomato':
                this.drawTomato(graphics, size);
                break;
            case 'carrot':
                this.drawCarrot(graphics, size);
                break;
            case 'egg':
                this.drawEgg(graphics, size);
                break;
            case 'meat':
                this.drawMeat(graphics, size);
                break;
            case 'fish':
                this.drawFish(graphics, size);
                break;
            default:
                this.drawDefaultFood(graphics, size);
        }

        graphics.generateTexture(`food_${type}`, size, size);
        return `food_${type}`;
    }

    drawTomato(graphics, size) {
        const center = size / 2;

        // 番茄主体
        graphics.fillStyle(0xFF6347, 1);
        graphics.fillCircle(center, center + 5, 22);

        // 高光
        graphics.fillStyle(0xFF8C69, 0.6);
        graphics.fillCircle(center - 8, center - 2, 8);

        // 叶子
        graphics.fillStyle(0x228B22, 1);
        graphics.fillCircle(center, center - 18, 6);
        graphics.fillCircle(center - 8, center - 14, 5);
        graphics.fillCircle(center + 8, center - 14, 5);

        // 茎
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(center - 2, center - 22, 4, 8);
    }

    drawCarrot(graphics, size) {
        const center = size / 2;

        // 胡萝卜主体
        graphics.fillStyle(0xFF8C00, 1);
        graphics.fillTriangle(
            center, center - 25,
            center - 15, center + 20,
            center + 15, center + 20
        );

        // 胡萝卜纹理
        graphics.lineStyle(2, 0xFF6347, 0.5);
        graphics.lineBetween(center - 5, center, center + 5, center);
        graphics.lineBetween(center - 3, center + 10, center + 3, center + 10);

        // 叶子
        graphics.fillStyle(0x228B22, 1);
        graphics.fillCircle(center, center - 28, 5);
        graphics.fillCircle(center - 6, center - 24, 4);
        graphics.fillCircle(center + 6, center - 24, 4);
    }

    drawEgg(graphics, size) {
        const center = size / 2;

        // 鸡蛋主体
        graphics.fillStyle(0xFFE4B5, 1);
        graphics.fillEllipse(center, center + 5, 30, 38);

        // 高光
        graphics.fillStyle(0xFFFFFF, 0.4);
        graphics.fillEllipse(center - 5, center - 5, 12, 15);

        // 阴影
        graphics.fillStyle(0xDEB887, 0.3);
        graphics.fillEllipse(center + 3, center + 15, 15, 8);
    }

    drawMeat(graphics, size) {
        const center = size / 2;

        // 肉的主体
        graphics.fillStyle(0xCD5C5C, 1);
        graphics.fillRoundedRect(center - 20, center - 15, 40, 35, 10);

        // 肉的纹理
        graphics.lineStyle(2, 0x8B0000, 0.5);
        graphics.lineBetween(center - 15, center - 5, center + 10, center - 5);
        graphics.lineBetween(center - 10, center + 5, center + 15, center + 5);

        // 高光
        graphics.fillStyle(0xFFB6C1, 0.4);
        graphics.fillCircle(center - 10, center - 8, 6);
    }

    drawFish(graphics, size) {
        const center = size / 2;

        // 鱼身
        graphics.fillStyle(0x4682B4, 1);
        graphics.fillEllipse(center, center, 35, 20);

        // 鱼头
        graphics.fillStyle(0x5F9EA0, 1);
        graphics.fillTriangle(
            center - 15, center,
            center - 30, center - 10,
            center - 30, center + 10
        );

        // 鱼尾
        graphics.fillStyle(0x4682B4, 1);
        graphics.fillTriangle(
            center + 15, center,
            center + 30, center - 12,
            center + 30, center + 12
        );

        // 眼睛
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(center - 22, center - 3, 4);
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(center - 23, center - 3, 2);

        // 鱼鳞
        graphics.lineStyle(1, 0x87CEEB, 0.5);
        for (let i = 0; i < 3; i++) {
            graphics.beginPath();
            graphics.arc(center - 5 + i * 8, center, 4, 0, Math.PI);
            graphics.strokePath();
        }
    }

    drawDefaultFood(graphics, size) {
        const center = size / 2;
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(center, center, 20);
        graphics.fillStyle(0xFFA500, 1);
        graphics.fillCircle(center, center, 15);
    }

    // 生成按钮纹理
    generateButton(width = 200, height = 60) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });

        // 按钮主体
        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillRoundedRect(0, 0, width, height, 10);

        // 按钮高光
        graphics.fillStyle(0xFF8E8E, 0.5);
        graphics.fillRoundedRect(0, 0, width, height / 2, 10);

        // 按钮边框
        graphics.lineStyle(3, 0xFF4757, 1);
        graphics.strokeRoundedRect(0, 0, width, height, 10);

        graphics.generateTexture('button_new', width, height);
        return 'button_new';
    }

    // 生成背景纹理
    generateBackground(type) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const width = 750;
        const height = 1334;

        switch (type) {
            case 'street':
                this.drawStreetBackground(graphics, width, height);
                break;
            case 'kitchen':
                this.drawKitchenBackground(graphics, width, height);
                break;
            default:
                this.drawDefaultBackground(graphics, width, height);
        }

        graphics.generateTexture(`bg_${type}`, width, height);
        return `bg_${type}`;
    }

    drawStreetBackground(graphics, w, h) {
        // 天空
        graphics.fillStyle(0x87CEEB, 1);
        graphics.fillRect(0, 0, w, h / 2);

        // 云朵
        graphics.fillStyle(0xFFFFFF, 0.8);
        graphics.fillCircle(150, 150, 30);
        graphics.fillCircle(180, 140, 40);
        graphics.fillCircle(210, 150, 30);

        graphics.fillCircle(500, 100, 25);
        graphics.fillCircle(525, 90, 35);
        graphics.fillCircle(550, 100, 25);

        // 地面
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillRect(0, h / 2, w, h / 2);

        // 道路
        graphics.fillStyle(0xD3D3D3, 1);
        graphics.fillRect(100, h / 2 + 50, w - 200, h / 2 - 100);

        // 道路标线
        graphics.fillStyle(0xFFFFFF, 1);
        for (let y = h / 2 + 100; y < h - 100; y += 80) {
            graphics.fillRect(w / 2 - 5, y, 10, 40);
        }
    }

    drawKitchenBackground(graphics, w, h) {
        // 墙壁
        graphics.fillStyle(0xFFF8DC, 1);
        graphics.fillRect(0, 0, w, h / 2);

        // 瓷砖纹理
        graphics.lineStyle(1, 0xF0E68C, 0.5);
        for (let x = 0; x < w; x += 50) {
            graphics.lineBetween(x, 0, x, h / 2);
        }
        for (let y = 0; y < h / 2; y += 50) {
            graphics.lineBetween(0, y, w, y);
        }

        // 地板
        graphics.fillStyle(0xDEB887, 1);
        graphics.fillRect(0, h / 2, w, h / 2);

        // 地板纹理
        graphics.lineStyle(1, 0xCD853F, 0.5);
        for (let x = 0; x < w; x += 60) {
            graphics.lineBetween(x, h / 2, x, h);
        }
    }

    drawDefaultBackground(graphics, w, h) {
        // 渐变背景
        for (let y = 0; y < h; y++) {
            const ratio = y / h;
            const r = Math.floor(255 * (1 - ratio) + 255 * ratio);
            const g = Math.floor(248 * (1 - ratio) + 231 * ratio);
            const b = Math.floor(231 * (1 - ratio) + 200 * ratio);
            graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
            graphics.fillRect(0, y, w, 1);
        }
    }
}
