<!-- 展示最近收分和 Farkle 事件的对局动态列表。 -->
<script setup>
import AppIcon from "./AppIcon.vue";
defineProps({ history: Array, format: Function });
defineEmits(["openDetails"]);
</script>
<template>
    <section class="activity-section" aria-label="对局记录">
        <div class="section-title">
            <h2><AppIcon name="history" :size="17" />对局动态</h2>
            <button class="activity-details-button" type="button" @click="$emit('openDetails')">
                查看详情<AppIcon name="chevron" :size="13" />
            </button>
        </div>
        <div v-if="!history.length" class="activity-empty">
            <span class="empty-spark">✦</span>
            <p>故事还没开始。第一掷，交给你。</p>
            <span class="empty-line"></span>
        </div>
        <ol v-else class="activity-list">
            <li v-for="(event, index) in history.slice(0, 5)" :key="event.id">
                <span class="event-icon" :class="event.type">
                    <AppIcon :name="event.type === 'bank' ? 'check' : 'close'" :size="11" />
                </span>
                <span>
                    <strong>{{ event.name }}</strong
                    >{{ event.type === "bank" ? "落袋为安" : "遭遇 Farkle"
                    }}<small v-if="event.final" class="final-tag">触发最终回合</small></span
                >
                <b :class="event.type"
                    >{{
                        event.type === "bank"
                            ? "+" + format(event.points)
                            : event.points
                              ? "失去 " + format(event.points)
                              : "本回合归零"
                    }}<small v-if="event.type === 'bank'">分</small></b
                ><time>{{ index === 0 ? "刚刚" : `第 ${Math.ceil(event.turn / 2)} 轮` }}</time>
            </li>
        </ol>
    </section>
</template>
