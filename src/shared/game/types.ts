export interface ItemDef {
    id: string;
    name: string;
    icon: string;
    type: "dice" | "medal";
    maxStack: number;
    desc?: string;
    /** 骰子六点相对权重，下标 0 对应 1 点；仅 type 为 dice 时使用。 */
    weights?: readonly [number, number, number, number, number, number];
    /** 癞子点数：可与任意计分组合搭配，但不能单独成数。 */
    wildFace?: number;
    /** 无限供应：普通骰子可随时补足 6 颗，不占用背包数量。 */
    isInfinite?: boolean;
    /** 效果表备注，例如系列归属或造型说明。 */
    note?: string;
    /** 系列标签，例如 DLC、恶魔三骰、垃圾系列。 */
    series?: string;
}

export interface ItemInstance {
    uid: string; // 唯一实例 id，作为 v-for 的 key
    defId: string; // 指向配置表
    count: number;
    extra?: Record<string, any>;
}
