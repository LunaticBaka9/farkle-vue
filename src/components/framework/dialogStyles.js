// 弹窗色板与控件规格：GameDialogs 及各内容组件根据当前页面主题共同调用。
export function createDialogStyles(theme) {
    const kingdom = theme === "kingdom";
    return {
        button: "flex min-h-[49px] items-center gap-[10px] rounded-[7px] border px-[18px] py-[14px] text-[clamp(12px,1vw,13px)] font-semibold transition-[background,transform,box-shadow] duration-200 max-mob:text-[12px] max-nar:min-h-[47px] max-nar:gap-2 max-nar:px-3 max-nar:py-[13px]",
        primary: kingdom
            ? "border-[#dfd29d] bg-[#d6c484] text-[#3a321f] shadow-[0_3px_0_#8c7544] enabled:hover:-translate-y-px enabled:hover:bg-[#e2d29a] enabled:hover:shadow-[0_4px_0_#8c7544,0_8px_20px_#07060422] enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_#8c7544] disabled:border-[#917d4f50] disabled:bg-[#74663f] disabled:text-[#c7ba8e] disabled:opacity-65 disabled:shadow-[0_3px_0_#57492a]"
            : "border-[#d2edaf] bg-lime text-[#26351c] shadow-[0_3px_0_#8ba65e] enabled:hover:-translate-y-px enabled:hover:bg-[#d3f1ac] enabled:hover:shadow-[0_4px_0_#8ba65e,0_8px_20px_#07180722] enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_#8ba65e] disabled:border-[#8aa66a50] disabled:bg-[#638251] disabled:text-[#bdd3ab] disabled:opacity-65 disabled:shadow-[0_3px_0_#455f36]",
        secondary: kingdom
            ? "border-[#b99b6155] bg-[#493f27] text-[#e7ddb9] enabled:hover:border-[#d8c58b] enabled:hover:bg-[#655633] disabled:border-[#77705240] disabled:bg-[#302d2366] disabled:text-[#918861] disabled:opacity-70"
            : "border-[#a3c07f54] bg-[#49613b28] text-[#c4d5b3] enabled:hover:border-[#a3c07f90] enabled:hover:bg-[#77935935] disabled:border-[#86a06d30] disabled:bg-[#94b47808] disabled:text-[#829a72] disabled:opacity-70",
        field: kingdom
            ? "mt-[9px] w-full rounded-md border border-[#b99b6155] bg-[#17150f] p-3 text-[clamp(12px,1vw,13px)] text-[#e3dbc8] placeholder:text-[#897d5d] max-mob:text-[12px]"
            : "mt-[9px] w-full rounded-md border border-[#c5e9952c] bg-[#152016] p-3 text-[clamp(12px,1vw,13px)] text-[#d9e6c7] placeholder:text-[#6e8060] max-mob:text-[12px]",
        h2: "mb-3 text-[25px] font-semibold tracking-[-0.4px] max-nar:text-[23px]",
        eyebrow: kingdom
            ? "flex items-center gap-2 text-[clamp(8px,0.7vw,9px)] font-semibold tracking-[2px] text-[#b99b61] max-mob:text-[8px] max-nar:gap-1.5 max-nar:tracking-[1.4px]"
            : "flex items-center gap-2 text-[clamp(8px,0.7vw,9px)] font-semibold tracking-[2px] text-[#acbf97] max-mob:text-[8px] max-nar:gap-1.5 max-nar:tracking-[1.4px]",
        preset: "rounded-[5px] border px-[10px] py-[5px] text-[clamp(11px,0.95vw,12px)] max-mob:text-[12px]",
        fieldHint: "mt-[7px] text-[clamp(11px,0.95vw,12px)] leading-[1.6] max-mob:text-[12px]",
        finalTagBase:
            "ml-[7px] inline-block rounded-[3px] border border-[#b8a26b26] px-1 py-0.5 text-[clamp(9px,0.75vw,10px)] max-nar:ml-1 max-nar:text-[6px]",
    };
}
