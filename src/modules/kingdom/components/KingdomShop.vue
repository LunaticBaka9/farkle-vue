<script setup>
import { computed } from "vue";
import AppIcon from "../../../shared/components/AppIcon.vue";

const props = defineProps({
    coins: { type: Number, required: true },
    ownedCounts: { type: Object, required: true },
    maxDiceCount: { type: Number, required: true },
    shopItems: { type: Array, required: true },
    refreshCost: { type: Number, required: true },
});

const emit = defineEmits(["purchase", "refresh"]);
const visibleOwnedCount = computed(() => props.shopItems.filter((item) => ownedCount(item) > 0).length);

// 卡片计数直接读取 kingdomStore 的 ownedCounts，支持骰子重复购买。
function ownedCount(item) {
    return props.ownedCounts[item.id] ?? 0;
}

function maxCount(item) {
    return item.category === "dice" ? props.maxDiceCount : 1;
}

function isMaxed(item) {
    return ownedCount(item) >= maxCount(item);
}

function isAffordable(item) {
    return props.coins >= item.price;
}

function buttonLabel(item) {
    if (isMaxed(item)) return item.category === "dice" ? `已满 ${maxCount(item)} 颗` : "已拥有";
    return `购买 · ${item.price} 金币`;
}
</script>

<template>
    <section class="shop-card" aria-labelledby="kingdom-shop-title">
        <div class="shop-head">
            <div>
                <span class="shop-eyebrow">KINGDOM MARKET</span>
                <h2 id="kingdom-shop-title" class="shop-title">古堡商店</h2>
            </div>
            <div class="shop-head-actions">
                <span class="shop-count">{{ visibleOwnedCount }}/{{ shopItems.length }} 已收藏</span>
                <button type="button" class="shop-refresh" :disabled="coins < refreshCost" @click="emit('refresh')">
                    <AppIcon name="restart" :size="15" />刷新 · {{ refreshCost }} 金币
                </button>
            </div>
        </div>
        <div class="shop-grid">
            <article v-for="item in shopItems" :key="item.id" class="shop-item">
                <div class="shop-item-main">
                    <span class="shop-icon"><AppIcon :name="item.icon" :size="29" /></span>
                    <div class="shop-item-text">
                        <strong class="shop-name">{{ item.name }}</strong>
                        <small class="shop-detail">{{ item.detail }}</small>
                        <small v-if="ownedCount(item) > 0" class="shop-owned">
                            已持有: {{ ownedCount(item) }} / {{ maxCount(item) }}
                            {{ item.category === "dice" ? "颗" : "件" }}
                        </small>
                    </div>
                </div>
                <button
                    type="button"
                    class="shop-buy"
                    :class="isMaxed(item) ? 'owned' : isAffordable(item) ? 'affordable' : 'unaffordable'"
                    :disabled="isMaxed(item) || !isAffordable(item)"
                    @click="emit('purchase', item)">
                    {{ buttonLabel(item) }}
                </button>
            </article>
        </div>
    </section>
</template>

<style scoped>
/* 商店卡片：深色玻璃质感底与金色描边。 */
.shop-card {
    overflow: hidden;
    border: 1px solid #b99b6140;
    border-radius: 18px;
    background: linear-gradient(145deg, #201d1355, #0d100b88);
    box-shadow:
        inset 0 1px 0 #dfcf9a12,
        0 12px 30px #0003;
}

/* 商店标题栏：左侧标题、右侧拥有数量。 */
.shop-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 27px 33px;
    border-bottom: 1px solid #b99b6120;
}

.shop-head-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.shop-refresh {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid #b99b6150;
    border-radius: 9999px;
    background: #b99b6112;
    color: #e3dbc8;
    cursor: pointer;
    white-space: nowrap;
}

.shop-refresh:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

/* 窄屏商店标题栏：收紧左右内边距。 */
@media (max-width: 520px) {
    .shop-head {
        padding-right: 14px;
        padding-left: 14px;
    }

    .shop-head-actions {
        align-items: flex-end;
        flex-direction: column;
        gap: 6px;
    }

    .shop-refresh {
        padding: 6px 9px;
        font-size: 11px;
    }
}

/* 商店英文眉题：金色小字。 */
.shop-eyebrow {
    color: #9d9273;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
}

/* 商店标题：米金色大字。 */
.shop-title {
    margin-top: 8px;
    color: #eee5cc;
    font-size: 30px;
    font-weight: 600;
}

/* 窄屏商店标题：缩小到 18px。 */
@media (max-width: 520px) {
    .shop-title {
        font-size: 18px;
    }
}

/* 拥有数量徽标：圆角金色描边。 */
.shop-count {
    padding: 8px 14px;
    border: 1px solid #b99b6138;
    border-radius: 9999px;
    color: #b7a879;
    font-size: 14px;
}

/* 商品网格：桌面端两列。 */
.shop-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding: 18px;
}

/* 中屏商品网格：右侧商店栏较窄时改为单列，避免文字挤压。 */
@media (max-width: 1180px) and (min-width: 1001px) {
    .shop-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 窄屏商品网格：改为单列。 */
@media (max-width: 520px) {
    .shop-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 商品卡片：默认暗金描边，悬停时上浮并提亮。 */
.shop-item {
    display: flex;
    flex-direction: column;
    padding: 18px;
    border: 1px solid #b99b6124;
    border-radius: 12px;
    background: #15140e66;
    transition-property: border-color, background, transform;
    transition-duration: 0.2s;
}

/* 商品卡片悬停：上浮 1px。 */
.shop-item:hover {
    border-color: #b99b6170;
    background: #2b271577;
    transform: translateY(-1px);
}

/* 商品主信息：图标与文字横向排列。 */
.shop-item-main {
    display: flex;
    flex: 1;
    align-items: flex-start;
    gap: 12px;
}

/* 商品图标：57px 的金色描边方块。 */
.shop-icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 52px;
    height: 52px;
    border: 1px solid #b99b6150;
    border-radius: 6px;
    background: radial-gradient(circle, #3b351e, #17160f);
    color: #d8c58b;
}

/* 商品文字区：允许长名称收缩。 */
.shop-item-text {
    min-width: 0;
}

/* 商品名称：空间不足时自动换行，完整显示长标题。 */
.shop-name {
    display: block;
    color: #e7dec4;
    font-size: 18px;
    overflow-wrap: anywhere;
    white-space: normal;
}

/* 商品说明：暖灰色小字。 */
.shop-owned {
    display: block;
    margin-top: 5px;
    color: #d8bd78;
    font-size: 11px;
}

.shop-detail {
    display: block;
    margin-top: 5px;
    color: #a89f86;
    font-size: 14px;
    line-height: 1.5;
}

/* 购买按钮骨架：占满卡片宽度。 */
.shop-buy {
    width: 100%;
    flex-shrink: 0;
    margin-top: auto;
    padding: 12px 15px;
    border: 1px solid #c6b4775c;
    font-size: 15px;
    transition-property: border-color, background;
    transition-duration: 0.2s;
}

/* 可购买状态：金色渐变底与米色文字。 */
.shop-buy.affordable {
    background: linear-gradient(145deg, #5a502f, #302916);
    color: #f0e5bf;
}

/* 可购买状态悬停：描边提亮。 */
.shop-buy.affordable:hover {
    border-color: #decf92;
}

/* 已拥有状态：橄榄绿底与浅绿文字，并恢复普通光标。 */
.shop-buy.owned {
    /* 已拥有状态使用绿色系边框，和可购买状态区分更明确。 */
    border-color: #91a5684a;
    background: #73804a22;
    color: #b7c795;
    cursor: default;
}

/* 金币不足状态：压暗底色与文字。 */
.shop-buy.unaffordable {
    background: #302d2366;
    color: #777561;
}
</style>
