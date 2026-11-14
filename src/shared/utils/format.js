// 数值格式化：所有模式、弹窗和页脚共用同一套千分位规则。
export function format(value) {
    return Number(value ?? 0).toLocaleString("en-US");
}
