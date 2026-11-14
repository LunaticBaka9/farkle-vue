// 骰子目录转换：只负责把共享 ItemDef 映射为装备 store 使用的 DiceCatalogEntry。
import type { ItemDef } from "../../../shared/game/types";
import { UNIFORM_WEIGHTS } from "./diceConstants.js";
import type { DiceCatalogEntry } from "./diceTypes";

export function createDiceCatalog(items: readonly ItemDef[]): Record<string, DiceCatalogEntry> {
    const catalog: Record<string, DiceCatalogEntry> = {};
    for (const item of items) {
        if (item.type !== "dice") continue;
        catalog[item.id] = {
            id: item.id,
            name: item.name,
            description: item.desc ?? "",
            icon: item.icon,
            weights: item.weights ?? UNIFORM_WEIGHTS,
            isInfinite: Boolean(item.isInfinite),
        };
    }
    return catalog;
}
