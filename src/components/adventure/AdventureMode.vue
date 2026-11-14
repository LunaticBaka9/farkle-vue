<script setup>
import AppIcon from "../framework/AppIcon.vue";
</script>

<template>
    <section
        class="adventure"
        aria-label="冒险模式">
        <div class="adventure-copy">
            <span class="adventure-eyebrow">ADVENTURE MAP</span>
            <h1 class="adventure-title">冒险模式</h1>
            <p class="adventure-subtitle">探索地图、遭遇事件，逐步展开另类 RPG 对局。</p>
            <div class="adventure-meta">
                <span class="adventure-status">预览版</span>
                <span class="adventure-status-note">地图事件与分支路线开发中</span>
            </div>
        </div>
        <div class="adventure-map" aria-hidden="true">
            <span class="trail trail-a"></span>
            <span class="trail trail-b"></span>
            <span class="map-node node-a"></span>
            <span class="map-node node-b"></span>
            <span class="map-node node-c"></span>
            <div class="adventure-coming">
                <span class="adventure-coming-title">即将开放</span>
                <p>地图事件、分支路线与装备成长正在筹备中。</p>
            </div>
            <AppIcon class="adventure-map-icon" name="map" :size="54" />
        </div>
    </section>
</template>

<style scoped>
/*
 * 冒险页容器：草地色底叠加斜向渐变、光斑与横向纹理。
 * 原类名 min-h-155rflow-hidden 是 min-h-155 与 overflow-hidden 粘连的笔误，
 * 这里还原为 620px 最小高度 + 隐藏溢出，避免桌面端地图溢出牌面。
 */
.adventure {
    position: relative;
    grid-column: 2 / 4;
    min-height: 620px;
    overflow: hidden;
    border: 1px solid #87905d4a;
    border-radius: 14px;
    background-color: #263023;
    background-image:
        linear-gradient(145deg, #26321cdd, transparent 55%),
        radial-gradient(circle at 30% 75%, #7d8a4e38, transparent 26%),
        repeating-linear-gradient(0deg, #6c754018 0 1px, transparent 1px 24px);
    color: #dce4bd;
}

/* 平板冒险页：单列布局并降低最小高度。 */
@media (max-width: 1000px) {
    .adventure {
        grid-column: 1 / -1;
        min-height: 560px;
    }
}

/* 窄屏冒险页：降低最小高度并缩小圆角。 */
@media (max-width: 520px) {
    .adventure {
        min-height: 500px;
        border-radius: 10px;
    }
}

/* 冒险页文案区：置于地图层之上，并加柔和文字阴影提升可读性。 */
.adventure-copy {
    position: relative;
    z-index: 2;
    padding: 42px 44px 30px;
    text-shadow: 0 2px 18px #000;
}

/* 窄屏文案区：压缩四周内边距。 */
@media (max-width: 520px) {
    .adventure-copy {
        padding: 30px 24px 24px;
    }
}

/* 冒险页英文眉题：小号宽字距。 */
.adventure-eyebrow {
    display: block;
    margin-bottom: 12px;
    color: #abb77d;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 4px;
}

/* 冒险页标题：衬线字体与宽字距，营造奇幻感。 */
.adventure-title {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: 38px;
    letter-spacing: 2px;
}

/* 窄屏冒险页标题：缩小到 30px。 */
@media (max-width: 520px) {
    .adventure-title {
        font-size: 30px;
    }
}

/* 冒险页副标题：略透明，弱化于标题。 */
.adventure-subtitle {
    font-size: 13px;
    line-height: 1.8;
    opacity: 0.78;
}

/* 窄屏冒险页副标题：固定 12px。 */
@media (max-width: 520px) {
    .adventure-subtitle {
        font-size: 12px;
    }
}

/* 冒险页状态行：预览标签与开发说明。 */
.adventure-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
}

/* 预览版标签：低饱和黄绿色小胶囊。 */
.adventure-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 9px;
    border: 1px solid #b2b77b66;
    border-radius: 9999px;
    background: #b2b77b0f;
    color: #d4ddb0;
    font-size: 10px;
    letter-spacing: 1px;
}

/* 开发说明：比副标题更弱的小字。 */
.adventure-status-note {
    color: #aebc8f;
    font-size: 11px;
}

/* 地图区域：绝对定位铺在文案下方，用两层径向光斑模拟地形。 */
.adventure-map {
    position: absolute;
    inset: 175px 42px 42px;
    border: 1px solid #9da66e42;
    border-radius: 9px;
    background-image:
        radial-gradient(ellipse at 30% 40%, #b0a86b18 0 8%, transparent 9%),
        radial-gradient(ellipse at 72% 65%, #75845422 0 12%, transparent 13%);
}

/* 窄屏地图区域：收紧四周定位。 */
@media (max-width: 520px) {
    .adventure-map {
        inset: 145px 24px 24px;
    }
}

/* 路线基础样式：虚线连接地图节点。 */
.trail {
    position: absolute;
    height: 1px;
    border-top: 2px dashed #aab28066;
    transform-origin: left;
}

/* 第一条路线：从左侧节点向右下方延伸。 */
.trail-a {
    top: 52%;
    left: 18%;
    width: 42%;
    transform: rotate(-18deg);
}

/* 第二条路线：从中部节点向右上方延伸。 */
.trail-b {
    top: 42%;
    left: 57%;
    width: 31%;
    transform: rotate(28deg);
}

/* 地图节点：圆点外圈加浅色光晕。 */
.map-node {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 3px solid #b2b77b;
    border-radius: 50%;
    background: #38422e;
    box-shadow: 0 0 0 5px #aeb47a18;
}

/* 左侧起始节点位置。 */
.node-a {
    top: 48%;
    left: 16%;
}

/* 中部节点位置。 */
.node-b {
    top: 34%;
    left: 56%;
}

/* 右下终点位置。 */
.node-c {
    right: 18%;
    bottom: 24%;
}

/* 地图中央的开发中提示：说明当前模式还不是可玩状态。 */
.adventure-coming {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(280px, calc(100% - 32px));
    padding: 14px 18px;
    border: 1px dashed #aab28055;
    border-radius: 10px;
    background: #1b241a99;
    color: #c8d4a4;
    text-align: center;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(4px);
}

/* 开发中提示标题。 */
.adventure-coming-title {
    display: block;
    color: #dbe5b8;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
}

/* 开发中提示正文。 */
.adventure-coming p {
    margin-top: 6px;
    color: #aebc8f;
    font-size: 11px;
    line-height: 1.7;
}

/* 右下角地图图标：低对比度作为背景装饰。 */
.adventure-map-icon {
    position: absolute;
    right: 24px;
    bottom: 20px;
    color: #a7ad7b66;
}
</style>
