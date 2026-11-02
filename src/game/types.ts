export interface ItemDef {
    id: String;
    name: String;
    icon: string;
    type: "dice" | "medal";
    maxStack: number;
    desc?: string;
}

export interface ItemInstance {
    uid: string; // 唯一实例 id，作为 v-for 的 key
    defId: string; // 指向配置表
    count: number;
    extra?: Record<string, any>;
}
