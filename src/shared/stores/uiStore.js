// 全局 UI 状态：弹窗、Toast、音效和设置草稿；由 App 与各模块视图共同使用。
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { createAudioController } from "../game/audioController.js";
import { isEntryScoreInputValid, isTargetScoreInputValid } from "../game/setupValidation.js";
import { ENTRY_SCORE, TARGET_SCORE } from "../game/scoring.js";

export const useUiStore = defineStore("ui", () => {
    // modal 只保存当前弹窗类型；null 表示没有弹窗。
    const modal = ref(null);
    // toast 与 tone 控制短时提示的文案和语义颜色。
    const toast = ref("");
    const toastTone = ref("success");
    // sound 只影响当前运行时音效，不写入游戏存档。
    const sound = ref(true);

    // 新对局表单草稿：普通模式与天国对战共用，但由当前活动会话提交。
    const setupMode = ref("ai");
    const setupDifficulty = ref("balanced");
    const setupTargetScore = ref(TARGET_SCORE);
    const setupEntryScore = ref(ENTRY_SCORE);
    const setupNames = ref(["", ""]);
    const targetInputValid = computed(() => isTargetScoreInputValid(setupTargetScore.value));
    const entryInputValid = computed(() => isEntryScoreInputValid(setupEntryScore.value));

    const audio = createAudioController({ isEnabled: () => sound.value });
    let toastTimer;

    // 通知只用于短时 UI Toast；每次调用都会清除并重置原定时器。
    function notify(message, tone = "success") {
        clearTimeout(toastTimer);
        toast.value = message;
        toastTone.value = tone;
        toastTimer = setTimeout(() => {
            toast.value = "";
        }, 3200);
    }

    // 切换路由前清除 Toast，避免旧模块提示残留到新页面。
    function clearToast() {
        clearTimeout(toastTimer);
        toast.value = "";
    }

    function play(type) {
        audio.play(type);
    }

    function stopAudio() {
        audio.stop();
    }

    function disposeAudio() {
        clearTimeout(toastTimer);
        audio.dispose();
    }

    function toggleSound() {
        sound.value = !sound.value;
        if (sound.value) audio.play("bank");
    }

    // 打开设置弹窗；传入的默认值来自当前活动对局。
    function openSetup(defaults = {}) {
        setupMode.value = defaults.mode ?? setupMode.value;
        setupDifficulty.value = defaults.difficulty ?? setupDifficulty.value;
        setupTargetScore.value = defaults.targetScore ?? setupTargetScore.value;
        setupEntryScore.value = defaults.entryScore ?? setupEntryScore.value;
        setupNames.value = defaults.names ? [...defaults.names] : setupNames.value;
        modal.value = "setup";
    }

    function closeDialog() {
        modal.value = null;
    }

    return {
        modal,
        toast,
        toastTone,
        sound,
        setupMode,
        setupDifficulty,
        setupTargetScore,
        setupEntryScore,
        setupNames,
        targetInputValid,
        entryInputValid,
        notify,
        clearToast,
        play,
        stopAudio,
        disposeAudio,
        toggleSound,
        openSetup,
        closeDialog,
    };
});
