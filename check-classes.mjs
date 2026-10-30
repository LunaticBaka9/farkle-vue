import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else out.push(p);
    }
    return out;
};

const files = walk("src").filter((f) => f.endsWith(".vue"));
const css = walk("dist/assets")
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");

const tokens = new Set();
const addList = (value) => {
    for (const token of value.split(/\s+/)) {
        if (!token) continue;
        if (!/^[a-z0-9[!]/.test(token)) continue;
        if (/[()$='",;{}<>]/.test(token) && !/^\[.*\]$/.test(token) && !/[:\[]/.test(token)) continue;
        if (/^[0-9]/.test(token)) continue;
        tokens.add(token);
    }
};

for (const file of files) {
    const text = readFileSync(file, "utf8");
    // 静态 class 与各类动态 class 属性
    for (const m of text.matchAll(/(?:^|\s)(?:class|enter-from-class|enter-active-class|leave-from-class|leave-active-class|enter-to-class|leave-to-class)="([^"]*)"/g)) {
        addList(m[1]);
    }
    // :class / v-bind:class 表达式中的单引号字符串
    for (const m of text.matchAll(/:class="([\s\S]*?)"\s*\n/g)) {
        for (const s of m[1].matchAll(/'([^']*)'/g)) addList(s[1]);
    }
    // script 中定义的按钮/表单类常量
    for (const m of text.matchAll(/const\s+\w+\s*=\s*"([^"]*)"/g)) addList(m[1]);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patternFor = (token) => {
    let out = "\\.";
    for (const ch of token) {
        if (/[a-zA-Z0-9_-]/.test(ch)) out += ch;
        else out += "\\\\?" + escapeRe(ch);
    }
    return out;
};

const missing = [];
for (const token of tokens) {
    const re = new RegExp(patternFor(token));
    if (!re.test(css)) missing.push(token);
}
console.log("tokens:", tokens.size, "missing:", missing.length);
console.log(missing.sort().join("\n"));
