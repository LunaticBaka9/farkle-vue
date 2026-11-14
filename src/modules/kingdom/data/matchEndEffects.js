// 对局结束经济道具表：新增金币袋类道具时只在这里登记，不修改结算流程。
export const MATCH_END_ITEM_EFFECTS = Object.freeze({
    "item-bag": Object.freeze({
        id: "item-bag",
        name: "古堡金币袋",
        coinsOnWin: 120,
        message: "古堡金币袋生效：胜利额外获得 120 金币。",
    }),
});
