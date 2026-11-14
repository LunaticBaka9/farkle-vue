export interface IDiceConfig {
    id: string;
    name: string;
    description: string;
    // 1 到 6 点各自的权重（不需要是 100 或 1，程序会自动计算总和归一化）
    weights: [number, number, number, number, number, number];
}

export class Dice {
    instanceId: string; // 唯一实例 ID（因为可能有多个同种骰子）
    id: string;
    name: string;
    description: string;
    weights: [number, number, number, number, number, number];
    currentValue: number = 1;
    isLocked: boolean = false; // 在 Farkle 中，玩家可以选择保留某些骰子，重掷剩下的

    constructor(config: IDiceConfig) {
        this.instanceId = Math.random().toString(36).substring(2, 9);
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.weights = config.weights;
    }

    roll(): number {
        if (this.isLocked) return this.currentValue;

        const totalWeight = this.weights.reduce((sum, w) => sum + w, 0);
        let randomVal = Math.random() * totalWeight;

        for (let i = 0; i < 6; i++) {
            if (randomVal < this.weights[i]) {
                this.currentValue = i + 1; // 点数 1-6
                break;
            }
            randomVal -= this.weights[i];
        }
        return this.currentValue;
    }
}
