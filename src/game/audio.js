// 对局音效适配层：由 stores/farkle.js 创建一次，并在用户动作或回合结果时调用。
import diceFallSound from "@/assets/sounds/the-dice-fell.mp3";

export function createGameAudio(isEnabled) {
    let audioContext;
    let diceFallAudio;

    // Pinia 动作传入事件类型；音频能力不可用时静默降级，不影响规则流程。
    function play(type) {
        if (!isEnabled()) return;
        if (type === "roll") {
            try {
                diceFallAudio ||= new Audio(diceFallSound);
                diceFallAudio.pause();
                diceFallAudio.currentTime = 0;
                diceFallAudio.volume = 0.75;
                void diceFallAudio.play().catch(() => {});
            } catch {
                return;
            }
            return;
        }
        try {
            audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
            audioContext.resume().catch(() => {});
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            const now = audioContext.currentTime;
            oscillator.type = type === "farkle" ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(type === "bank" ? 660 : type === "farkle" ? 180 : 350, now);
            oscillator.frequency.exponentialRampToValueAtTime(type === "bank" ? 990 : 130, now + 0.15);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            oscillator.start();
            oscillator.stop(now + 0.22);
        } catch {
            // Web Audio 不可用时忽略提示音，保留完整游戏交互。
        }
    }

    // Pinia store 卸载时调用，释放解码后的音频上下文及媒体实例。
    function dispose() {
        diceFallAudio?.pause();
        audioContext?.close();
    }

    return { play, dispose };
}
