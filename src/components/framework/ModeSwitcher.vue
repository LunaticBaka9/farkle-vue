<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
    modelValue: {
        type: String,
        default: "classic",
    },
});

defineEmits(["update:modelValue"]);

const modes = [
    { id: "classic", label: "普通", subtitle: "CLASSIC", icon: "dice" },
    { id: "kingdom", label: "天国", subtitle: "KINGDOM", icon: "shield" },
    { id: "adventure", label: "冒险", subtitle: "ADVENTURE", icon: "map" },
];
</script>

<template>
    <nav class="mode-switcher" aria-label="游戏模式">
        <span class="mode-switcher-label">MODE</span>
        <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            class="mode-button"
            :class="{ active: modelValue === mode.id }"
            :aria-current="modelValue === mode.id ? 'page' : undefined"
            :aria-label="`${mode.label}模式`"
            @click="$emit('update:modelValue', mode.id)"
        >
            <span class="mode-button-icon"><AppIcon :name="mode.icon" :size="20" /></span>
            <span class="mode-button-text">
                <strong>{{ mode.label }}</strong>
                <small>{{ mode.subtitle }}</small>
            </span>
        </button>
    </nav>
</template>
