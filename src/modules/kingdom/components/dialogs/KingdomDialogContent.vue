<script setup>
import AppIcon from "../../../../shared/components/AppIcon.vue";
import { KINGDOM_DICE } from "../../data/kingdomItems";

// KingdomDialogs 根据 modal 状态挂载本视图；按钮事件交回天国大厅流程。
defineProps({ modal: String, theme: String });
const emit = defineEmits(["close", "resetKingdomState"]);
const kingdomItems = [
    { name: "皇家十字印记", detail: "中世纪对局中的稀有护符", icon: "shield" },
    { name: "古堡金币袋", detail: "可在天国模式中携带入场", icon: "bank" },
    { name: "幸运火花", detail: "正在等待下一次奇遇", icon: "spark" },
];
// 骰子列表直接读特殊骰子目录，避免弹窗再维护一份名称和效果文案。
const kingdomDice = KINGDOM_DICE;
</script>

<template>
    <section v-if="modal === 'kingdom-backpack'" class="kh-section">
        <div class="dlg-eyebrow">KINGDOM INVENTORY</div>
        <h2 id="kingdom-backpack-title" class="dlg-h2 kh-heading">天国背包</h2>
        <p class="dlg-lede">查看你在天国骰子旅途中的随身物品。</p>
        <div class="kh-list">
            <div v-for="item in kingdomItems" :key="item.name" class="kh-item">
                <span class="kh-icon"><AppIcon :name="item.icon" :size="21" /></span>
                <span class="kh-text">
                    <strong class="kh-name">{{ item.name }}</strong>
                    <small class="kh-detail">{{ item.detail }}</small>
                </span>
            </div>
        </div>
        <button class="dlg-btn primary kh-close" @click="emit('close')">
            收起背包<AppIcon name="close" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-dice-list'" class="kh-section">
        <div class="dlg-eyebrow">COLLECTION OF KINGDOM</div>
        <h2 id="kingdom-dice-list-title" class="dlg-h2 kh-heading">天国骰子列表</h2>
        <p class="dlg-lede">当前收藏的主题骰子会在天国模式中使用。</p>
        <div class="kh-list">
            <div v-for="(dice, index) in kingdomDice" :key="dice.id" class="kh-item">
                <span class="kh-icon"><AppIcon :name="dice.icon" :size="21" /></span>
                <span class="kh-text kh-text-grow">
                    <strong class="kh-name">{{ dice.name }}</strong>
                    <small class="kh-detail">{{ dice.desc }}</small>
                </span>
                <small class="kh-index">{{ String(index + 1).padStart(2, "0") }}</small>
            </div>
        </div>
        <button class="dlg-btn primary kh-close" @click="emit('close')">
            返回天国<AppIcon name="arrow" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-reset'" class="kh-section">
        <div class="dlg-eyebrow">KINGDOM PLAYER RECORD</div>
        <h2 id="kingdom-reset-title" class="dlg-h2 kh-heading">重置天国状态？</h2>
        <p class="dlg-lede">
            金币与收藏将恢复为初始状态：1,250 金币，以及皇家骰子、皇家十字印记和古堡金币袋。此操作无法撤销。
        </p>
        <div class="kh-actions">
            <button type="button" class="dlg-btn secondary kh-action" @click="emit('close')">
                保留当前状态
            </button>
            <button type="button" class="dlg-btn primary kh-action" @click="emit('resetKingdomState')">
                <AppIcon name="restart" :size="17" />重置状态
            </button>
        </div>
    </section>
</template>

<style scoped>
/* 每个天国弹窗区块的顶部留白。 */
.kh-section {
    padding-top: 5px;
}

/* 天国弹窗大标题：与眉题拉开 17px。 */
.kh-heading {
    margin-top: 17px;
}

/* 物品/骰子列表：纵向排列，每项间隔 10px。 */
.kh-list {
    display: grid;
    gap: 10px;
    margin-top: 24px;
}

/* 列表项：图标与文字横向排列，金棕色描边区分卡片。 */
.kh-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 16px;
    border: 1px solid #b99b6138;
    border-radius: 8px;
    background: #b99b6108;
}

/* 列表图标容器：固定 42px 的金色描边方块。 */
.kh-icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 1px solid #b99b6138;
    border-radius: 6px;
    background: #b99b610a;
    color: #d0bd8a;
}

/* 列表文字块：允许长名称收缩换行。 */
.kh-text {
    min-width: 0;
}

/* 骰子列表的文字块占满剩余宽度，把序号推到最右。 */
.kh-text-grow {
    flex: 1;
}

/* 物品/骰子名称：米色小标题。 */
.kh-name {
    display: block;
    color: #e3dbc8;
    font-size: 14px;
    font-weight: 500;
}

/* 物品/骰子说明：更小的暖灰文字。 */
.kh-detail {
    display: block;
    margin-top: 4px;
    color: #948b76;
    font-size: 12px;
    line-height: 1.6;
}

/* 骰子序号：右侧的金色编号。 */
.kh-index {
    color: #b99b61;
    font-size: 10px;
    letter-spacing: 1px;
}

/* 重置确认按钮组：双列排列。 */
.kh-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 25px;
}

/* 窄屏重置按钮：改为单列，避免文字拥挤。 */
@media (max-width: 520px) {
    .kh-actions {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 重置确认按钮：统一居中文字。 */
.kh-action {
    justify-content: center;
}

/* 弹窗底部关闭按钮：占满宽度并居中。 */
.kh-close {
    justify-content: center;
    width: 100%;
    margin-top: 25px;
}

/* 底部按钮尾部图标：推到最右侧。 */
.kh-close > svg:last-child {
    margin-left: auto;
}
</style>
