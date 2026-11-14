<!-- 页面底部品牌、说明和局数规格展示。 -->
<script setup>
// targetScore 控制页脚显示的本局目标分数；format 负责统一千分位等数字文本格式。
defineProps({ targetScore: Number, format: Function });
</script>
<template>
    <footer class="site-footer">
        <span class="footer-brand"
            >farkle <span class="footer-dot">.</span>
            <small class="footer-tagline">ROLL. RISK. REPEAT.</small>
        </span>
        <span class="footer-note">为每一个「再来一次」的瞬间而作。</span>
        <span class="footer-meta">
            6 DICE <i class="footer-slash">/</i> 2 PLAYERS <i class="footer-slash">/</i>
            {{ format(targetScore) }} POINTS
        </span>
    </footer>
</template>

<style scoped>
/* 页脚：品牌、说明与规则信息三段分布，顶部细线与正文分隔。 */
.site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 38px;
    padding-top: 24px;
    padding-bottom: 28px;
    border-top: 1px solid var(--color-line);
}

/* 平板页脚：缩小上边距。 */
@media (max-width: 1000px) {
    .site-footer {
        margin-top: 30px;
    }
}

/* 窄屏页脚：进一步收紧上边距、间距与上下留白。 */
@media (max-width: 520px) {
    .site-footer {
        gap: 12px;
        margin-top: 24px;
        padding-top: 21px;
        padding-bottom: 21px;
    }
}

/* 页脚品牌字：比正文略大，保持低调。 */
.footer-brand {
    color: #a3b293;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.7px;
}

/* 窄屏页脚品牌：略减字号。 */
@media (max-width: 520px) {
    .footer-brand {
        font-size: 17px;
    }
}

/* 页脚品牌句点：浅黄绿色。 */
.footer-dot {
    color: #bad18e;
}

/* 品牌右侧口号：小号宽字距英文。 */
.footer-tagline {
    margin-left: 14px;
    vertical-align: middle;
    color: #8a9a83;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 1.4px;
}

/* 手机端口号：收紧边距，保留可读的小字号。 */
@media (max-width: 700px) {
    .footer-tagline {
        margin-left: 10px;
        font-size: 8px;
    }
}

/* 窄屏隐藏口号，避免和右侧信息挤在一起。 */
@media (max-width: 520px) {
    .footer-tagline {
        display: none;
    }
}

/* 页脚说明文字：中等灰度的小字。 */
.footer-note {
    color: #8a9a83;
    font-size: 12px;
    letter-spacing: 0.6px;
}

/* 手机端隐藏说明文字。 */
@media (max-width: 700px) {
    .footer-note {
        display: none;
    }
}

/* 页脚规则信息：局数、人数与目标分数。 */
.footer-meta {
    color: #8a9a83;
    font-size: 12px;
    letter-spacing: 1.7px;
}

/* 手机端规则信息：缩小字号与字距，但不低于 9px。 */
@media (max-width: 700px) {
    .footer-meta {
        font-size: 9px;
        letter-spacing: 0.8px;
    }
}

/* 信息之间的斜杠：更淡的绿色且不倾斜。 */
.footer-slash {
    margin: 0 7px;
    color: #a5ba8370;
    font-style: normal;
}

/* 手机端斜杠：收紧左右边距。 */
@media (max-width: 700px) {
    .footer-slash {
        margin: 0 4px;
    }
}
</style>
