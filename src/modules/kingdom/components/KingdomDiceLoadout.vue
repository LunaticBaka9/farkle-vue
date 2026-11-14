<!-- 战前骰子装配：6 个槽位 + 库存列表，支持点击和拖拽更换骰子。 -->
<script setup>
import { computed, ref } from "vue";
import AppIcon from "../../../shared/components/AppIcon.vue";
import { useDiceLoadoutStore } from "../stores/useDiceLoadoutStore";

const loadout = useDiceLoadoutStore();
const activeSlot = ref(0);
const status = ref("");
const draggedDieId = ref("");

const equippedDice = computed(() => loadout.equippedDice);
const inventory = computed(() =>
    loadout.availableDice.filter((die) => die.ownedCount > 0 || die.isInfinite),
);

function selectSlot(index) {
    activeSlot.value = index;
    status.value = `已选中第 ${index + 1} 个槽位。`;
}

function equip(dieId) {
    const check = loadout.canEquipDie(activeSlot.value, dieId);
    if (!check.ok) {
        status.value = check.message;
        return;
    }
    loadout.equipDieToSlot(activeSlot.value, dieId);
    status.value = check.message;
}

function onDragStart(event, dieId) {
    draggedDieId.value = dieId;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dieId);
}

function onDrop(event, slotIndex) {
    event.preventDefault();
    activeSlot.value = slotIndex;
    const dieId = event.dataTransfer.getData("text/plain") || draggedDieId.value;
    if (dieId) equip(dieId);
    draggedDieId.value = "";
}

function resetLoadout() {
    loadout.resetLoadout();
    status.value = "已恢复默认骰子组合。";
}
</script>

<template>
    <section class="dice-loadout" aria-label="天国骰子装配">
        <div class="loadout-slots" role="list" aria-label="6 个出战槽位">
            <button
                v-for="(die, index) in equippedDice"
                :key="index"
                type="button"
                class="loadout-slot"
                :class="{ active: activeSlot === index }"
                role="listitem"
                :aria-label="`第 ${index + 1} 槽位：${die.name}`"
                @click="selectSlot(index)"
                @dragover.prevent
                @drop="onDrop($event, index)">
                <span class="loadout-slot-index">0{{ index + 1 }}</span>
                <span class="loadout-slot-icon"><AppIcon :name="die.icon" :size="19" /></span>
                <span class="loadout-slot-name">{{ die.name }}</span>
            </button>
        </div>

        <p class="loadout-hint">
            先点选一个槽位，再点击下方库存骰子；也可以直接把骰子拖到槽位上。
        </p>

        <div class="loadout-inventory" role="list" aria-label="骰子库存">
            <button
                v-for="die in inventory"
                :key="die.id"
                type="button"
                class="loadout-die"
                role="listitem"
                draggable="true"
                :disabled="die.available <= 0 && !loadout.equippedSlots.includes(die.id)"
                @dragstart="onDragStart($event, die.id)"
                @click="equip(die.id)">
                <span class="loadout-die-icon"><AppIcon :name="die.icon" :size="18" /></span>
                <span class="loadout-die-text">
                    <strong class="loadout-die-name">{{ die.name }}</strong>
                    <small class="loadout-die-meta">
                        <template v-if="die.isInfinite">无限库存</template>
                        <template v-else>已持有 {{ die.ownedCount }} / 6 颗</template>
                        · 可上 {{ die.isInfinite ? "∞" : die.available }}
                    </small>
                </span>
            </button>
        </div>

        <div class="loadout-footer">
            <button type="button" class="dlg-btn secondary loadout-reset" @click="resetLoadout">
                <AppIcon name="restart" :size="15" />恢复默认
            </button>
            <p v-if="status" class="loadout-status" role="status">{{ status }}</p>
        </div>
    </section>
</template>

<style scoped>
/* 装配区顶部：与弹窗标题保持固定间距。 */
.dice-loadout {
    margin-top: 22px;
}

/* 6 个槽位：桌面三列、窄屏两列，保证每格可以点击和接收拖拽。 */
.loadout-slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
}

/* 窄屏槽位：改为两列。 */
@media (max-width: 520px) {
    .loadout-slots {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* 槽位按钮：纵向展示序号、图标和骰子名。 */
.loadout-slot {
    position: relative;
    display: grid;
    gap: 4px;
    justify-items: start;
    min-height: 88px;
    padding: 11px 12px;
    border: 1px solid #b99b6140;
    border-radius: 8px;
    background: #b99b6108;
    color: #dfd4ad;
    text-align: left;
    transition: border-color 0.18s, background 0.18s;
}

/* 当前选中的槽位：金色描边和浅金底。 */
.loadout-slot.active {
    border-color: #d4b56a;
    background: #d4b56a18;
}

/* 槽位序号：右上角的小号数字。 */
.loadout-slot-index {
    position: absolute;
    top: 8px;
    right: 10px;
    color: #8f805c;
    font-size: 10px;
    letter-spacing: 0.12em;
}

/* 槽位图标：与骰子名同色系的强调色。 */
.loadout-slot-icon {
    color: #d4b56a;
}

/* 槽位骰子名：最多两行，避免长名称撑破格子。 */
.loadout-slot-name {
    overflow: hidden;
    font-size: 12px;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

/* 操作提示：弱化显示，说明点击和拖拽两种方式。 */
.loadout-hint {
    margin: 14px 0 0;
    color: #a99975;
    font-size: 12px;
    line-height: 1.6;
}

/* 库存列表：两列卡片，弹窗内部自然滚动。 */
.loadout-inventory {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    max-height: 236px;
    margin-top: 14px;
    padding-right: 4px;
    overflow-y: auto;
}

/* 窄屏库存：单列。 */
@media (max-width: 520px) {
    .loadout-inventory {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 库存骰子按钮：图标 + 名称 + 持有/可上数量。 */
.loadout-die {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
    border: 1px solid #b99b6130;
    border-radius: 7px;
    background: #b99b6107;
    color: #dfd4ad;
    text-align: left;
}

/* 库存骰子禁用态：库存耗尽且未装备时降低对比。 */
.loadout-die:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

/* 库存骰子图标：固定宽度，避免名称左右跳动。 */
.loadout-die-icon {
    flex-shrink: 0;
    color: #d4b56a;
}

/* 库存骰子文字块：允许名称换行。 */
.loadout-die-text {
    display: grid;
    min-width: 0;
    gap: 3px;
}

/* 库存骰子名称：小号强调。 */
.loadout-die-name {
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 库存骰子元信息：持有数量和可上数量。 */
.loadout-die-meta {
    color: #a99975;
    font-size: 10px;
}

/* 装配区底部：重置按钮与状态文案左右排列。 */
.loadout-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
}

/* 重置按钮：不占满整行。 */
.loadout-reset {
    flex-shrink: 0;
}

/* 状态文案：跟随操作反馈变化。 */
.loadout-status {
    margin: 0;
    color: #c9b47b;
    font-size: 11px;
    line-height: 1.5;
}
</style>
