<script setup>
import { computed } from "vue";
import AppIcon from "../../../../shared/components/AppIcon.vue";
import KingdomDiceLoadout from "../KingdomDiceLoadout.vue";
import { useInventoryStore } from "../../stores/useInventoryStore";

// KingdomDialogs 根据 modal 状态挂载本视图；按钮事件交回天国大厅流程。
defineProps({ modal: String, theme: String });
const emit = defineEmits(["close", "resetKingdomState"]);
const inventory = useInventoryStore();
const ownedItems = computed(() =>
    inventory.inventorySlots
        .filter((slot) => slot.count > 0)
        .map((slot) => ({
            ...inventory.itemDefinitions.find((item) => item.id === slot.itemId),
            count: slot.count,
        })),
);

function isEquipped(itemId) {
    return inventory.equippedSlots.includes(itemId);
}

function equipItem(itemId) {
    if (isEquipped(itemId)) {
        const index = inventory.equippedSlots.indexOf(itemId);
        inventory.unequipItem(index);
        return;
    }
    const emptySlot = inventory.equippedSlots.indexOf(null);
    if (emptySlot >= 0) inventory.equipItem(emptySlot, itemId);
}

// 背包弹窗调用；按物品类型选择展示图标。
function itemIcon(type) {
    return type === "badge" ? "shield" : "spark";
}
</script>

<template>
    <section v-if="modal === 'kingdom-backpack'" class="kh-section">
        <div class="dlg-eyebrow">KINGDOM INVENTORY</div>
        <h2 id="kingdom-backpack-title" class="dlg-h2 kh-heading">天国背包</h2>
        <p class="dlg-lede">最多装备 3 枚徽章；每枚徽章的等级与效果详见物品说明。</p>
        <div class="kh-slots" aria-label="背包装备槽">
            <div v-for="(itemId, index) in inventory.equippedSlots" :key="index" class="kh-slot">
                <span class="kh-slot-index">槽位 {{ index + 1 }}</span>
                <strong v-if="itemId" class="kh-name">
                    {{ inventory.itemDefinitions.find((item) => item.id === itemId)?.name }}
                </strong>
                <span v-else class="kh-detail">空槽位</span>
                <button
                    v-if="itemId"
                    type="button"
                    class="kh-equip"
                    :aria-label="`卸下槽位 ${index + 1} 的物品`"
                    @click="inventory.unequipItem(index)">
                    卸下
                </button>
            </div>
        </div>
        <h3 class="kh-subheading">持有物品</h3>
        <div class="kh-list">
            <div v-for="item in ownedItems" :key="item.id" class="kh-item">
                <span class="kh-icon"><AppIcon :name="itemIcon(item.type)" :size="21" /></span>
                <span class="kh-text">
                    <strong class="kh-name">{{ item.name }} ×{{ item.count }}</strong>
                    <small class="kh-detail">{{ item.description }}</small>
                    <small class="kh-detail">{{ item.effect }}</small>
                </span>
                <button
                    type="button"
                    class="kh-equip"
                    :disabled="!isEquipped(item.id) && !inventory.equippedSlots.includes(null)"
                    @click="equipItem(item.id)">
                    {{ isEquipped(item.id) ? "卸下" : "装备" }}
                </button>
            </div>
            <p v-if="ownedItems.length === 0" class="kh-empty">背包为空，可在古堡商店购买物品。</p>
        </div>
        <button class="dlg-btn primary kh-close" @click="emit('close')">
            收起背包<AppIcon name="close" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-dice-list'" class="kh-section">
        <div class="dlg-eyebrow">COLLECTION OF KINGDOM</div>
        <h2 id="kingdom-dice-list-title" class="dlg-h2 kh-heading">天国骰子列表</h2>
        <p class="dlg-lede">选择一个槽位，再从库存中装配骰子；6 个槽位会整组带入下一场挑战。</p>
        <KingdomDiceLoadout />
        <button class="dlg-btn primary kh-close" @click="emit('close')">
            收起列表<AppIcon name="arrow" :size="17" />
        </button>
    </section>

    <section v-else-if="modal === 'kingdom-reset'" class="kh-section">
        <div class="dlg-eyebrow">KINGDOM PLAYER RECORD</div>
        <h2 id="kingdom-reset-title" class="dlg-h2 kh-heading">重置天国状态？</h2>
        <p class="dlg-lede">金币与收藏将恢复为初始状态：1,250 金币，以及清除物品。此操作无法撤销。</p>
        <div class="kh-actions">
            <button type="button" class="dlg-btn secondary kh-action" @click="emit('close')">保留当前状态</button>
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

/* 背包装备槽：以三列显示装备状态。 */
.kh-slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 20px;
}

.kh-slot {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 11px;
    border: 1px solid #b99b6138;
    border-radius: 8px;
    background: #b99b6108;
}

.kh-slot-index,
.kh-subheading {
    color: #b7a879;
    font-size: 12px;
}

.kh-subheading {
    margin: 22px 0 -12px;
    font-size: 14px;
}

.kh-equip {
    flex-shrink: 0;
    padding: 6px 10px;
    border: 1px solid #b99b6150;
    border-radius: 5px;
    background: #b99b6112;
    color: #e3dbc8;
    cursor: pointer;
}

.kh-equip:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.kh-empty {
    margin: 0;
    padding: 16px;
    color: #aaa18a;
    text-align: center;
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
    flex: 1;
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
