export const KINGDOM_SHOP_ITEM_COUNT = 6;
export const KINGDOM_SHOP_REFRESH_COST = 50;

// 天国商店 store 调用；输入为完整商品目录，返回随机且不重复的限时商品列表。
export function chooseShopItems(items, random = Math.random, count = KINGDOM_SHOP_ITEM_COUNT) {
    if (!Number.isInteger(count) || count < 0 || items.length < count) {
        throw new RangeError("商品目录不足以生成商店列表");
    }

    const shuffled = [...items];
    for (let index = 0; index < count; index += 1) {
        const swapIndex = index + Math.floor(random() * (shuffled.length - index));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, count);
}
