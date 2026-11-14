// 音效控制器：把音频实例的生命周期与 UI store 解耦。
import { createGameAudio } from "./audio.js";

export function createAudioController({ isEnabled }) {
    const audio = createGameAudio(isEnabled);
    return {
        play: (type) => audio.play(type),
        stop: () => audio.stop(),
        dispose: () => audio.dispose(),
    };
}
