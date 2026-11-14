<script setup>
// 天国大厅路由页面：消耗金币发起挑战，并把挑战元数据写入 kingdomStore。
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import KingdomHeader from "../components/KingdomHeader.vue";
import KingdomOpponents from "../components/KingdomOpponents.vue";
import KingdomShop from "../components/KingdomShop.vue";
import KingdomDialogs from "../components/dialogs/KingdomDialogs.vue";
import { useKingdomStore } from "../stores/kingdomStore.js";
import { useKingdomBattleStore } from "../stores/kingdomBattleStore.js";
import { useUiStore } from "../../../shared/stores/uiStore.js";
import { activateSession, deactivateSession } from "../../../shared/session/moduleSession.js";
import { ENTRY_SCORE } from "../../../shared/game/scoring.js";

const router = useRouter();
const kingdom = useKingdomStore();
const battle = useKingdomBattleStore();
const ui = useUiStore();
const notice = ref("");
let noticeTimer;

function showNotice(message) {
    clearTimeout(noticeTimer);
    notice.value = message;
    noticeTimer = setTimeout(() => {
        notice.value = "";
    }, 2600);
}

function purchaseItem(item) {
    const result = kingdom.purchase(item);
    showNotice(result.message);
}

function challengeOpponent(opponent) {
    const result = kingdom.startChallenge(opponent);
    if (!result.ok) {
        showNotice(result.message);
        return;
    }
    battle.newGame({
        mode: "ai",
        difficulty: opponent.difficulty,
        targetScore: opponent.target,
        entryScore: ENTRY_SCORE,
        names: ["你", opponent.name],
    });
    battle.setOpponentName(opponent.name);
    ui.closeDialog();
    // 对战页挂载时会 activateSession，自动停止大厅会话。
    router.push({ name: "kingdom-battle", params: { opponentId: opponent.id } });
}

function resetKingdomState() {
    kingdom.resetProgress();
    ui.closeDialog();
    showNotice("天国玩家状态已恢复初始设置。");
}

onMounted(() => {
    activateSession("kingdom-lobby", {
        start: () => {},
        stop: () => clearTimeout(noticeTimer),
        pause: () => {},
        resume: () => {},
    });
});
onBeforeUnmount(() => {
    clearTimeout(noticeTimer);
    deactivateSession("kingdom-lobby");
});
</script>

<template>
    <section class="kingdom-mode" aria-label="天国模式">
        <KingdomHeader
            :coins="kingdom.coins"
            @open-backpack="ui.modal = 'kingdom-backpack'"
            @open-dice-list="ui.modal = 'kingdom-dice-list'"
            @reset-player-state="ui.modal = 'kingdom-reset'"
        />

        <div class="kingdom-grid">
            <KingdomOpponents
                :coins="kingdom.coins"
                :opponents="kingdom.opponents"
                @challenge="challengeOpponent"
            />
            <KingdomShop
                :coins="kingdom.coins"
                :owned-ids="kingdom.ownedIds"
                :shop-items="kingdom.shopItems"
                @purchase="purchaseItem"
            />
        </div>

        <Transition name="fade">
            <div v-if="notice" class="kingdom-notice" role="status">
                {{ notice }}
            </div>
        </Transition>

        <KingdomDialogs
            :modal="ui.modal"
            theme="kingdom"
            @close="ui.closeDialog"
            @reset-kingdom-state="resetKingdomState"
        />
    </section>
</template>

<style scoped>
/* 天国模式容器：占据普通模式主内容的两列宽度。 */
.kingdom-mode {
    position: relative;
    grid-column: 2 / 4;
}

/* 平板天国容器：单列布局时占满整行。 */
@media (max-width: 1000px) {
    .kingdom-mode {
        grid-column: 1 / -1;
    }
}

/* 对手与商店的双栏布局，对手区略宽，卡片按内容高度对齐。 */
.kingdom-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
    align-items: start;
    gap: 18px;
    margin-top: 24px;
}

/* 平板及以下天国双栏：改为单列上下排列，避免商店卡过窄。 */
@media (max-width: 1000px) {
    .kingdom-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

/* 天国操作提示：固定在视口底部的短暂 toast。 */
.kingdom-notice {
    position: fixed;
    bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    z-index: 30;
    padding: 12px 18px;
    border: 1px solid #b99b6170;
    border-radius: 8px;
    background: #211c12f5;
    color: #eddfb4;
    font-size: 12px;
    box-shadow: 0 10px 30px #0008;
    transform: translateX(-50%);
    /* 提示条不拦截点击，避免遮挡牌桌或按钮。 */
    pointer-events: none;
}
</style>
