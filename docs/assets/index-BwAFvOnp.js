(function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
    new MutationObserver((s) => {
        for (const r of s)
            if (r.type === "childList")
                for (const l of r.addedNodes) l.tagName === "LINK" && l.rel === "modulepreload" && i(l);
    }).observe(document, { childList: !0, subtree: !0 });
    function n(s) {
        const r = {};
        return (
            s.integrity && (r.integrity = s.integrity),
            s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
            s.crossOrigin === "use-credentials"
                ? (r.credentials = "include")
                : s.crossOrigin === "anonymous"
                  ? (r.credentials = "omit")
                  : (r.credentials = "same-origin"),
            r
        );
    }
    function i(s) {
        if (s.ep) return;
        s.ep = !0;
        const r = n(s);
        fetch(s.href, r);
    }
})();
function ks(e) {
    const t = Object.create(null);
    for (const n of e.split(",")) t[n] = 1;
    return (n) => n in t;
}
const ie = {},
    At = [],
    Qe = () => {},
    Hi = () => !1,
    Hn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    jn = (e) => e.startsWith("onUpdate:"),
    ge = Object.assign,
    Ns = (e, t) => {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
    },
    ll = Object.prototype.hasOwnProperty,
    Q = (e, t) => ll.call(e, t),
    N = Array.isArray,
    ht = (e) => cn(e) === "[object Map]",
    kt = (e) => cn(e) === "[object Set]",
    Qs = (e) => cn(e) === "[object Date]",
    H = (e) => typeof e == "function",
    ae = (e) => typeof e == "string",
    Ze = (e) => typeof e == "symbol",
    ee = (e) => e !== null && typeof e == "object",
    ji = (e) => (ee(e) || H(e)) && H(e.then) && H(e.catch),
    Bi = Object.prototype.toString,
    cn = (e) => Bi.call(e),
    ol = (e) => cn(e).slice(8, -1),
    Ui = (e) => cn(e) === "[object Object]",
    Rs = (e) => ae(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
    qt = ks(
        ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted",
    ),
    Bn = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    al = /-\w/g,
    Ce = Bn((e) => e.replace(al, (t) => t.slice(1).toUpperCase())),
    ul = /\B([A-Z])/g,
    Nt = Bn((e) => e.replace(ul, "-$1").toLowerCase()),
    Un = Bn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    ns = Bn((e) => (e ? `on${Un(e)}` : "")),
    Xe = (e, t) => !Object.is(e, t),
    Tn = (e, ...t) => {
        for (let n = 0; n < e.length; n++) e[n](...t);
    },
    Ki = (e, t, n, i = !1) => {
        Object.defineProperty(e, t, { configurable: !0, enumerable: !1, writable: i, value: n });
    },
    Kn = (e) => {
        const t = parseFloat(e);
        return isNaN(t) ? e : t;
    },
    cl = (e) => {
        const t = ae(e) ? Number(e) : NaN;
        return isNaN(t) ? e : t;
    };
let Zs;
const zn = () =>
    Zs ||
    (Zs =
        typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : typeof window < "u"
                ? window
                : typeof global < "u"
                  ? global
                  : {});
function fn(e) {
    if (N(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const i = e[n],
                s = ae(i) ? hl(i) : fn(i);
            if (s) for (const r in s) t[r] = s[r];
        }
        return t;
    } else if (ae(e) || ee(e)) return e;
}
const fl = /;(?![^(]*\))/g,
    dl = /:([^]+)/,
    pl = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function hl(e) {
    const t = {};
    return (
        e
            .replace(pl, (n) => (n.startsWith("/*") ? "" : n))
            .split(fl)
            .forEach((n) => {
                if (n) {
                    const i = n.split(dl);
                    i.length > 1 && (t[i[0].trim()] = i[1].trim());
                }
            }),
        t
    );
}
function fe(e) {
    let t = "";
    if (ae(e)) t = e;
    else if (N(e))
        for (let n = 0; n < e.length; n++) {
            const i = fe(e[n]);
            i && (t += i + " ");
        }
    else if (ee(e)) for (const n in e) e[n] && (t += n + " ");
    return t.trim();
}
const gl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly",
    vl = ks(gl);
function zi(e) {
    return !!e || e === "";
}
function ml(e, t, n) {
    if (e.length !== t.length) return !1;
    let i = !0;
    for (let s = 0; i && s < e.length; s++) i = vt(e[s], t[s], n);
    return i;
}
function ei(e, t, n) {
    if (e.size !== t.size) return !1;
    const i = Array.from(t),
        s = new Uint8Array(i.length);
    for (const r of e) {
        let l = -1;
        for (let o = 0; o < i.length; o++)
            if (!s[o] && vt(r, i[o], n)) {
                l = o;
                break;
            }
        if (l < 0) return !1;
        s[l] = 1;
    }
    return !0;
}
function yl(e, t, n) {
    let i = ht(e),
        s = ht(t);
    if (i || s || ((i = kt(e)), (s = kt(t)), i || s)) return i && s ? ei(e, t, n) : !1;
    const r = Object.keys(e).length,
        l = Object.keys(t).length;
    if (r !== l) return !1;
    for (const o in e) {
        const u = e.hasOwnProperty(o),
            g = t.hasOwnProperty(o);
        if ((u && !g) || (!u && g) || !vt(e[o], t[o], n)) return !1;
    }
    return String(e) === String(t);
}
function ti(e, t, n, i) {
    n || (n = [new Map(), new Map()]);
    const [s, r] = n;
    if (s.has(e) || r.has(t)) return s.get(e) === t && r.get(t) === e;
    (s.set(e, t), r.set(t, e));
    const l = i(e, t, n);
    return (s.delete(e), r.delete(t), l);
}
function vt(e, t, n) {
    if (e === t) return !0;
    let i = Qs(e),
        s = Qs(t);
    return i || s
        ? i && s
            ? e.getTime() === t.getTime()
            : !1
        : ((i = Ze(e)),
          (s = Ze(t)),
          i || s
              ? e === t
              : ((i = N(e)),
                (s = N(t)),
                i || s
                    ? i && s
                        ? ti(e, t, n, ml)
                        : !1
                    : ((i = ee(e)),
                      (s = ee(t)),
                      i || s ? (!i || !s ? !1 : ti(e, t, n, yl)) : String(e) === String(t))));
}
function bl(e, t) {
    return e.findIndex((n) => vt(n, t));
}
const Wi = (e) => !!(e && e.__v_isRef === !0),
    G = (e) =>
        ae(e)
            ? e
            : e == null
              ? ""
              : N(e) || (ee(e) && (e.toString === Bi || !H(e.toString)))
                ? Wi(e)
                    ? G(e.value)
                    : JSON.stringify(e, qi, 2)
                : String(e),
    qi = (e, t) =>
        Wi(t)
            ? qi(e, t.value)
            : ht(t)
              ? { [`Map(${t.size})`]: [...t.entries()].reduce((n, [i, s], r) => ((n[ss(i, r) + " =>"] = s), n), {}) }
              : kt(t)
                ? { [`Set(${t.size})`]: [...t.values()].map((n) => ss(n)) }
                : Ze(t)
                  ? ss(t)
                  : ee(t) && !N(t) && !Ui(t)
                    ? String(t)
                    : t,
    ss = (e, t = "") => {
        var n;
        return Ze(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
    };
let me;
class _l {
    constructor(t = !1) {
        ((this.detached = t),
            (this._active = !0),
            (this._on = 0),
            (this.effects = []),
            (this.cleanups = []),
            (this._isPaused = !1),
            (this._warnOnRun = !0),
            (this.__v_skip = !0),
            !t &&
                me &&
                (me.active
                    ? ((this.parent = me), (this.index = (me.scopes || (me.scopes = [])).push(this) - 1))
                    : ((this._active = !1), (this._warnOnRun = !1))));
    }
    get active() {
        return this._active;
    }
    pause() {
        if (this._active) {
            this._isPaused = !0;
            let t, n;
            if (this.scopes) {
                const i = this.scopes.slice();
                for (t = 0, n = i.length; t < n; t++) i[t].pause();
            }
            for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause();
        }
    }
    resume() {
        if (this._active && this._isPaused) {
            this._isPaused = !1;
            let t, n;
            if (this.scopes) {
                const s = this.scopes.slice();
                for (t = 0, n = s.length; t < n; t++) s[t].resume();
            }
            const i = this.effects.slice();
            for (t = 0, n = i.length; t < n; t++) i[t].resume();
        }
    }
    run(t) {
        if (this._active) {
            const n = me;
            try {
                return ((me = this), t());
            } finally {
                me = n;
            }
        }
    }
    on() {
        ++this._on === 1 && ((this.prevScope = me), (me = this));
    }
    off() {
        if (this._on > 0 && --this._on === 0) {
            if (me === this) me = this.prevScope;
            else {
                let t = me;
                for (; t; ) {
                    if (t.prevScope === this) {
                        t.prevScope = this.prevScope;
                        break;
                    }
                    t = t.prevScope;
                }
            }
            this.prevScope = void 0;
        }
    }
    stop(t) {
        if (this._active) {
            this._active = !1;
            let n, i;
            for (n = 0, i = this.effects.length; n < i; n++) this.effects[n].stop();
            for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++) this.cleanups[n]();
            if (((this.cleanups.length = 0), this.scopes)) {
                const s = this.scopes.slice();
                for (n = 0, i = s.length; n < i; n++) s[n].stop(!0);
                this.scopes.length = 0;
            }
            if (!this.detached && this.parent && !t) {
                const s = this.parent.scopes.pop();
                s && s !== this && ((this.parent.scopes[this.index] = s), (s.index = this.index));
            }
            this.parent = void 0;
        }
    }
}
function Sl() {
    return me;
}
let re;
const is = new WeakSet();
class Gi {
    constructor(t) {
        ((this.fn = t),
            (this.deps = void 0),
            (this.depsTail = void 0),
            (this.flags = 5),
            (this.next = void 0),
            (this.cleanup = void 0),
            (this.scheduler = void 0),
            me && (me.active ? me.effects.push(this) : (this.flags &= -2)));
    }
    pause() {
        this.flags |= 64;
    }
    resume() {
        this.flags & 64 && ((this.flags &= -65), is.has(this) && (is.delete(this), this.trigger()));
    }
    notify() {
        (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || Yi(this);
    }
    run() {
        if (!(this.flags & 1)) return this.fn();
        ((this.flags |= 2), ni(this), Xi(this));
        const t = re,
            n = Be;
        ((re = this), (Be = !0));
        try {
            return this.fn();
        } finally {
            (Qi(this), (re = t), (Be = n), (this.flags &= -3));
        }
    }
    stop() {
        if (this.flags & 1) {
            for (let t = this.deps; t; t = t.nextDep) Fs(t);
            ((this.deps = this.depsTail = void 0), ni(this), this.onStop && this.onStop(), (this.flags &= -2));
        }
    }
    trigger() {
        this.flags & 64 ? is.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
    }
    runIfDirty() {
        ms(this) && this.run();
    }
    get dirty() {
        return ms(this);
    }
}
let Ji = 0,
    Gt,
    Jt;
function Yi(e, t = !1) {
    if (((e.flags |= 8), t)) {
        ((e.next = Jt), (Jt = e));
        return;
    }
    ((e.next = Gt), (Gt = e));
}
function Ps() {
    Ji++;
}
function $s() {
    if (--Ji > 0) return;
    if (Jt) {
        let t = Jt;
        for (Jt = void 0; t; ) {
            const n = t.next;
            ((t.next = void 0), (t.flags &= -9), (t = n));
        }
    }
    let e;
    for (; Gt; ) {
        let t = Gt;
        for (Gt = void 0; t; ) {
            const n = t.next;
            if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
                try {
                    t.trigger();
                } catch (i) {
                    e || (e = i);
                }
            t = n;
        }
    }
    if (e) throw e;
}
function Xi(e) {
    for (let t = e.deps; t; t = t.nextDep)
        ((t.version = -1), (t.prevActiveLink = t.dep.activeLink), (t.dep.activeLink = t));
}
function Qi(e) {
    let t,
        n = e.depsTail,
        i = n;
    for (; i; ) {
        const s = i.prevDep;
        (i.version === -1 ? (i === n && (n = s), Fs(i), xl(i)) : (t = i),
            (i.dep.activeLink = i.prevActiveLink),
            (i.prevActiveLink = void 0),
            (i = s));
    }
    ((e.deps = t), (e.depsTail = n));
}
function ms(e) {
    for (let t = e.deps; t; t = t.nextDep)
        if (t.dep.version !== t.version || (t.dep.computed && (Zi(t.dep.computed) || t.dep.version !== t.version)))
            return !0;
    return !!e._dirty;
}
function Zi(e) {
    if (
        (e.flags & 4 && !(e.flags & 16)) ||
        ((e.flags &= -17), e.globalVersion === en) ||
        ((e.globalVersion = en), !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !ms(e)))
    )
        return;
    e.flags |= 2;
    const t = e.dep,
        n = re,
        i = Be;
    ((re = e), (Be = !0));
    try {
        Xi(e);
        const s = e.fn(e._value);
        (t.version === 0 || Xe(s, e._value)) && ((e.flags |= 128), (e._value = s), t.version++);
    } catch (s) {
        throw (t.version++, s);
    } finally {
        ((re = n), (Be = i), Qi(e), (e.flags &= -3));
    }
}
function Fs(e, t = !1) {
    const { dep: n, prevSub: i, nextSub: s } = e;
    if (
        (i && ((i.nextSub = s), (e.prevSub = void 0)),
        s && ((s.prevSub = i), (e.nextSub = void 0)),
        n.subs === e && ((n.subs = i), !i && n.computed))
    ) {
        n.computed.flags &= -5;
        for (let r = n.computed.deps; r; r = r.nextDep) Fs(r, !0);
    }
    !t && !--n.sc && n.map && n.map.delete(n.key);
}
function xl(e) {
    const { prevDep: t, nextDep: n } = e;
    (t && ((t.nextDep = n), (e.prevDep = void 0)), n && ((n.prevDep = t), (e.nextDep = void 0)));
}
let Be = !0;
const er = [];
function et() {
    (er.push(Be), (Be = !1));
}
function tt() {
    const e = er.pop();
    Be = e === void 0 ? !0 : e;
}
function ni(e) {
    const { cleanup: t } = e;
    if (((e.cleanup = void 0), t)) {
        const n = re;
        re = void 0;
        try {
            t();
        } finally {
            re = n;
        }
    }
}
let en = 0;
class wl {
    constructor(t, n) {
        ((this.sub = t),
            (this.dep = n),
            (this.version = n.version),
            (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0));
    }
}
class Ls {
    constructor(t) {
        ((this.computed = t),
            (this.version = 0),
            (this.activeLink = void 0),
            (this.subs = void 0),
            (this.map = void 0),
            (this.key = void 0),
            (this.sc = 0),
            (this.__v_skip = !0));
    }
    track(t) {
        if (!re || !Be || re === this.computed) return;
        let n = this.activeLink;
        if (n === void 0 || n.sub !== re)
            ((n = this.activeLink = new wl(re, this)),
                re.deps
                    ? ((n.prevDep = re.depsTail), (re.depsTail.nextDep = n), (re.depsTail = n))
                    : (re.deps = re.depsTail = n),
                tr(n));
        else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
            const i = n.nextDep;
            ((i.prevDep = n.prevDep),
                n.prevDep && (n.prevDep.nextDep = i),
                (n.prevDep = re.depsTail),
                (n.nextDep = void 0),
                (re.depsTail.nextDep = n),
                (re.depsTail = n),
                re.deps === n && (re.deps = i));
        }
        return n;
    }
    trigger(t) {
        (this.version++, en++, this.notify(t));
    }
    notify(t) {
        Ps();
        try {
            for (let n = this.subs; n; n = n.prevSub) n.sub.notify() && n.sub.dep.notify();
        } finally {
            $s();
        }
    }
}
function tr(e) {
    if ((e.dep.sc++, e.sub.flags & 4)) {
        const t = e.dep.computed;
        if (t && !e.dep.subs) {
            t.flags |= 20;
            for (let i = t.deps; i; i = i.nextDep) tr(i);
        }
        const n = e.dep.subs;
        (n !== e && ((e.prevSub = n), n && (n.nextSub = e)), (e.dep.subs = e));
    }
}
const ys = new WeakMap(),
    Ot = Symbol(""),
    bs = Symbol(""),
    tn = Symbol("");
function be(e, t, n) {
    if (Be && re) {
        let i = ys.get(e);
        i || ys.set(e, (i = new Map()));
        let s = i.get(n);
        (s || (i.set(n, (s = new Ls())), (s.map = i), (s.key = n)), s.track());
    }
}
function at(e, t, n, i, s, r) {
    const l = ys.get(e);
    if (!l) {
        en++;
        return;
    }
    const o = (u) => {
        u && u.trigger();
    };
    if ((Ps(), t === "clear")) l.forEach(o);
    else {
        const u = N(e),
            g = u && Rs(n);
        if (u && n === "length") {
            const d = Number(i);
            l.forEach((m, x) => {
                (x === "length" || x === tn || (!Ze(x) && x >= d)) && o(m);
            });
        } else
            switch (((n !== void 0 || l.has(void 0)) && o(l.get(n)), g && o(l.get(tn)), t)) {
                case "add":
                    u ? g && o(l.get("length")) : (o(l.get(Ot)), ht(e) && o(l.get(bs)));
                    break;
                case "delete":
                    u || (o(l.get(Ot)), ht(e) && o(l.get(bs)));
                    break;
                case "set":
                    ht(e) && o(l.get(Ot));
                    break;
            }
    }
    $s();
}
function $t(e) {
    const t = X(e);
    return t === e || (be(t, "iterate", tn), De(e))
        ? t
        : nt(e)
          ? gt(e)
              ? t.map((n) => mt(Ve(n)))
              : t.map(mt)
          : t.map(Ve);
}
function Wn(e) {
    return (be((e = X(e)), "iterate", tn), e);
}
function Ge(e, t) {
    return nt(e) ? mt(gt(e) ? Ve(t) : t) : Ve(t);
}
const Tl = {
    __proto__: null,
    [Symbol.iterator]() {
        return rs(this, Symbol.iterator, (e) => Ge(this, e));
    },
    concat(...e) {
        return $t(this).concat(...e.map((t) => (N(t) ? $t(t) : t)));
    },
    entries() {
        return rs(this, "entries", (e) => ((e[1] = Ge(this, e[1])), e));
    },
    every(e, t) {
        return it(this, "every", e, t, void 0, arguments);
    },
    filter(e, t) {
        return it(this, "filter", e, t, (n) => n.map((i) => Ge(this, i)), arguments);
    },
    find(e, t) {
        return it(this, "find", e, t, (n) => Ge(this, n), arguments);
    },
    findIndex(e, t) {
        return it(this, "findIndex", e, t, void 0, arguments);
    },
    findLast(e, t) {
        return it(this, "findLast", e, t, (n) => Ge(this, n), arguments);
    },
    findLastIndex(e, t) {
        return it(this, "findLastIndex", e, t, void 0, arguments);
    },
    forEach(e, t) {
        return it(this, "forEach", e, t, void 0, arguments);
    },
    includes(...e) {
        return ls(this, "includes", e);
    },
    indexOf(...e) {
        return ls(this, "indexOf", e);
    },
    join(e) {
        return $t(this).join(e);
    },
    lastIndexOf(...e) {
        return ls(this, "lastIndexOf", e);
    },
    map(e, t) {
        return it(this, "map", e, t, void 0, arguments);
    },
    pop() {
        return Bt(this, "pop");
    },
    push(...e) {
        return Bt(this, "push", e);
    },
    reduce(e, ...t) {
        return ii(this, "reduce", e, t);
    },
    reduceRight(e, ...t) {
        return ii(this, "reduceRight", e, t);
    },
    shift() {
        return Bt(this, "shift");
    },
    some(e, t) {
        return it(this, "some", e, t, void 0, arguments);
    },
    splice(...e) {
        return Bt(this, "splice", e);
    },
    toReversed() {
        return $t(this).toReversed();
    },
    toSorted(e) {
        return $t(this).toSorted(e);
    },
    toSpliced(...e) {
        return $t(this).toSpliced(...e);
    },
    unshift(...e) {
        return Bt(this, "unshift", e);
    },
    values() {
        return rs(this, "values", (e) => Ge(this, e));
    },
};
function rs(e, t, n) {
    const i = Wn(e),
        s = i[t],
        r = s.call(i);
    if (i !== e && !De(e)) {
        if (r[Symbol.toStringTag] === "Array Iterator") {
            const l = Object.create(Object.getPrototypeOf(r));
            return (
                (l.next = () => si(r.next(), n)),
                s !== nr[t] &&
                    Object.defineProperties(l, {
                        return: {
                            get() {
                                const o = r.return;
                                return typeof o == "function" ? o.bind(r) : o;
                            },
                        },
                        throw: {
                            get() {
                                const o = r.throw;
                                return typeof o == "function" ? o.bind(r) : o;
                            },
                        },
                    }),
                l
            );
        }
        ((r._next = r.next), (r.next = () => si(r._next(), n)));
    }
    return r;
}
function si(e, t) {
    return (e.done || (e.value = t(e.value)), e);
}
const nr = Array.prototype;
function it(e, t, n, i, s, r) {
    const l = Wn(e),
        o = l !== e && !De(e),
        u = l[t];
    if (u !== nr[t]) {
        const m = u.apply(e, r);
        return o ? Ve(m) : m;
    }
    let g = n;
    l !== e &&
        (o
            ? (g = function (m, x) {
                  return n.call(this, Ge(e, m), x, e);
              })
            : n.length > 2 &&
              (g = function (m, x) {
                  return n.call(this, m, x, e);
              }));
    const d = u.call(l, g, i);
    return o && s ? s(d) : d;
}
function ii(e, t, n, i) {
    const s = Wn(e),
        r = s !== e && !De(e);
    let l = n,
        o = !1;
    s !== e &&
        (r
            ? ((o = i.length === 0),
              (l = function (g, d, m) {
                  return (o && ((o = !1), (g = Ge(e, g))), n.call(this, g, Ge(e, d), m, e));
              }))
            : n.length > 3 &&
              (l = function (g, d, m) {
                  return n.call(this, g, d, m, e);
              }));
    const u = s[t](l, ...i);
    return o ? Ge(e, u) : u;
}
function ls(e, t, n) {
    const i = X(e);
    be(i, "iterate", tn);
    const s = i[t](...n);
    return (s === -1 || s === !1) && js(n[0]) ? ((n[0] = X(n[0])), i[t](...n)) : s;
}
function Bt(e, t, n = []) {
    (et(), Ps());
    const i = X(e)[t].apply(e, n);
    return ($s(), tt(), i);
}
const Cl = ks("__proto__,__v_isRef,__isVue"),
    sr = new Set(
        Object.getOwnPropertyNames(Symbol)
            .filter((e) => e !== "arguments" && e !== "caller")
            .map((e) => Symbol[e])
            .filter(Ze),
    );
function El(e) {
    Ze(e) || (e = String(e));
    const t = X(this);
    return (be(t, "has", e), t.hasOwnProperty(e));
}
class ir {
    constructor(t = !1, n = !1) {
        ((this._isReadonly = t), (this._isShallow = n));
    }
    get(t, n, i) {
        if (n === "__v_skip") return t.__v_skip;
        const s = this._isReadonly,
            r = this._isShallow;
        if (n === "__v_isReactive") return !s;
        if (n === "__v_isReadonly") return s;
        if (n === "__v_isShallow") return r;
        if (n === "__v_raw")
            return i === (s ? (r ? Fl : ar) : r ? or : lr).get(t) ||
                Object.getPrototypeOf(t) === Object.getPrototypeOf(i)
                ? t
                : void 0;
        const l = N(t);
        if (!s) {
            let u;
            if (l && (u = Tl[n])) return u;
            if (n === "hasOwnProperty") return El;
        }
        const o = Reflect.get(t, n, xe(t) ? t : i);
        if ((Ze(n) ? sr.has(n) : Cl(n)) || (s || be(t, "get", n), r)) return o;
        if (xe(o)) {
            const u = l && Rs(n) ? o : o.value;
            return s && ee(u) ? Ss(u) : u;
        }
        return ee(o) ? (s ? Ss(o) : Vs(o)) : o;
    }
}
class rr extends ir {
    constructor(t = !1) {
        super(!1, t);
    }
    set(t, n, i, s) {
        let r = t[n];
        const l = N(t) && Rs(n);
        if (!this._isShallow) {
            const g = nt(r);
            if ((!De(i) && !nt(i) && ((r = X(r)), (i = X(i))), !l && xe(r) && !xe(i))) return (g || (r.value = i), !0);
        }
        const o = l ? Number(n) < t.length : Q(t, n),
            u = Reflect.set(t, n, i, xe(t) ? t : s);
        return (t === X(s) && u && (o ? Xe(i, r) && at(t, "set", n, i) : at(t, "add", n, i)), u);
    }
    deleteProperty(t, n) {
        const i = Q(t, n);
        t[n];
        const s = Reflect.deleteProperty(t, n);
        return (s && i && at(t, "delete", n, void 0), s);
    }
    has(t, n) {
        const i = Reflect.has(t, n);
        return ((!Ze(n) || !sr.has(n)) && be(t, "has", n), i);
    }
    ownKeys(t) {
        return (be(t, "iterate", N(t) ? "length" : Ot), Reflect.ownKeys(t));
    }
}
class Al extends ir {
    constructor(t = !1) {
        super(!0, t);
    }
    set(t, n) {
        return !0;
    }
    deleteProperty(t, n) {
        return !0;
    }
}
const Ml = new rr(),
    Ol = new Al(),
    Il = new rr(!0);
const _s = (e) => e,
    yn = (e) => Reflect.getPrototypeOf(e);
function kl(e, t, n) {
    return function (...i) {
        const s = this.__v_raw,
            r = X(s),
            l = ht(r),
            o = e === "entries" || (e === Symbol.iterator && l),
            u = e === "keys" && l,
            g = s[e](...i),
            d = n ? _s : t ? mt : Ve;
        return (
            !t && be(r, "iterate", u ? bs : Ot),
            ge(Object.create(g), {
                next() {
                    const { value: m, done: x } = g.next();
                    return x ? { value: m, done: x } : { value: o ? [d(m[0]), d(m[1])] : d(m), done: x };
                },
            })
        );
    };
}
function bn(e) {
    return function (...t) {
        return e === "delete" ? !1 : e === "clear" ? void 0 : this;
    };
}
function Nl(e, t) {
    const n = {
        get(s) {
            const r = this.__v_raw,
                l = X(r),
                o = X(s);
            e || (Xe(s, o) && be(l, "get", s), be(l, "get", o));
            const { has: u } = yn(l),
                g = t ? _s : e ? mt : Ve;
            if (u.call(l, s)) return g(r.get(s));
            if (u.call(l, o)) return g(r.get(o));
            r !== l && r.get(s);
        },
        get size() {
            const s = this.__v_raw;
            return (!e && be(X(s), "iterate", Ot), s.size);
        },
        has(s) {
            const r = this.__v_raw,
                l = X(r),
                o = X(s);
            return (e || (Xe(s, o) && be(l, "has", s), be(l, "has", o)), s === o ? r.has(s) : r.has(s) || r.has(o));
        },
        forEach(s, r) {
            const l = this,
                o = l.__v_raw,
                u = X(o),
                g = t ? _s : e ? mt : Ve;
            return (!e && be(u, "iterate", Ot), o.forEach((d, m) => s.call(r, g(d), g(m), l)));
        },
    };
    return (
        ge(
            n,
            e
                ? { add: bn("add"), set: bn("set"), delete: bn("delete"), clear: bn("clear") }
                : {
                      add(s) {
                          const r = X(this),
                              l = yn(r),
                              o = X(s),
                              u = !t && !De(s) && !nt(s) ? o : s;
                          return (
                              l.has.call(r, u) ||
                                  (Xe(s, u) && l.has.call(r, s)) ||
                                  (Xe(o, u) && l.has.call(r, o)) ||
                                  (r.add(u), at(r, "add", u, u)),
                              this
                          );
                      },
                      set(s, r) {
                          !t && !De(r) && !nt(r) && (r = X(r));
                          const l = X(this),
                              { has: o, get: u } = yn(l);
                          let g = o.call(l, s);
                          g || ((s = X(s)), (g = o.call(l, s)));
                          const d = u.call(l, s);
                          return (l.set(s, r), g ? Xe(r, d) && at(l, "set", s, r) : at(l, "add", s, r), this);
                      },
                      delete(s) {
                          const r = X(this),
                              { has: l, get: o } = yn(r);
                          let u = l.call(r, s);
                          (u || ((s = X(s)), (u = l.call(r, s))), o && o.call(r, s));
                          const g = r.delete(s);
                          return (u && at(r, "delete", s, void 0), g);
                      },
                      clear() {
                          const s = X(this),
                              r = s.size !== 0,
                              l = s.clear();
                          return (r && at(s, "clear", void 0, void 0), l);
                      },
                  },
        ),
        ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
            n[s] = kl(s, e, t);
        }),
        n
    );
}
function Ds(e, t) {
    const n = Nl(e, t);
    return (i, s, r) =>
        s === "__v_isReactive"
            ? !e
            : s === "__v_isReadonly"
              ? e
              : s === "__v_isShallow"
                ? t
                : s === "__v_raw"
                  ? i
                  : Reflect.get(Q(n, s) && s in i ? n : i, s, r);
}
const Rl = { get: Ds(!1, !1) },
    Pl = { get: Ds(!1, !0) },
    $l = { get: Ds(!0, !1) };
const lr = new WeakMap(),
    or = new WeakMap(),
    ar = new WeakMap(),
    Fl = new WeakMap();
function Ll(e) {
    switch (e) {
        case "Object":
        case "Array":
            return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
            return 2;
        default:
            return 0;
    }
}
function Vs(e) {
    return nt(e) ? e : Hs(e, !1, Ml, Rl, lr);
}
function Dl(e) {
    return Hs(e, !1, Il, Pl, or);
}
function Ss(e) {
    return Hs(e, !0, Ol, $l, ar);
}
function Hs(e, t, n, i, s) {
    if (!ee(e) || (e.__v_raw && !(t && e.__v_isReactive)) || e.__v_skip || !Object.isExtensible(e)) return e;
    const r = s.get(e);
    if (r) return r;
    const l = Ll(ol(e));
    if (l === 0) return e;
    const o = new Proxy(e, l === 2 ? i : n);
    return (s.set(e, o), o);
}
function gt(e) {
    return nt(e) ? gt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function nt(e) {
    return !!(e && e.__v_isReadonly);
}
function De(e) {
    return !!(e && e.__v_isShallow);
}
function js(e) {
    return e ? !!e.__v_raw : !1;
}
function X(e) {
    const t = e && e.__v_raw;
    return t ? X(t) : e;
}
function Vl(e) {
    return (!Q(e, "__v_skip") && Object.isExtensible(e) && Ki(e, "__v_skip", !0), e);
}
const Ve = (e) => (ee(e) ? Vs(e) : e),
    mt = (e) => (ee(e) ? Ss(e) : e);
function xe(e) {
    return e ? e.__v_isRef === !0 : !1;
}
function $e(e) {
    return ur(e, !1);
}
function Hl(e) {
    return ur(e, !0);
}
function ur(e, t) {
    return xe(e) ? e : new jl(e, t);
}
class jl {
    constructor(t, n) {
        ((this.dep = new Ls()),
            (this.__v_isRef = !0),
            (this.__v_isShallow = !1),
            (this._rawValue = n ? t : X(t)),
            (this._value = n ? t : Ve(t)),
            (this.__v_isShallow = n));
    }
    get value() {
        return (this.dep.track(), this._value);
    }
    set value(t) {
        const n = this._rawValue,
            i = this.__v_isShallow || De(t) || nt(t);
        ((t = i ? t : X(t)), Xe(t, n) && ((this._rawValue = t), (this._value = i ? t : Ve(t)), this.dep.trigger()));
    }
}
function xs(e) {
    return xe(e) ? e.value : e;
}
const Bl = {
    get: (e, t, n) => (t === "__v_raw" ? e : xs(Reflect.get(e, t, n))),
    set: (e, t, n, i) => {
        const s = e[t];
        return xe(s) && !xe(n) ? ((s.value = n), !0) : Reflect.set(e, t, n, i);
    },
};
function cr(e) {
    return gt(e) ? e : new Proxy(e, Bl);
}
class Ul {
    constructor(t, n, i) {
        ((this.fn = t),
            (this.setter = n),
            (this._value = void 0),
            (this.dep = new Ls(this)),
            (this.__v_isRef = !0),
            (this.deps = void 0),
            (this.depsTail = void 0),
            (this.flags = 16),
            (this.globalVersion = en - 1),
            (this.next = void 0),
            (this.effect = this),
            (this.__v_isReadonly = !n),
            (this.isSSR = i));
    }
    notify() {
        if (((this.flags |= 16), !(this.flags & 8) && re !== this)) return (Yi(this, !0), !0);
    }
    get value() {
        const t = this.dep.track();
        return (Zi(this), t && (t.version = this.dep.version), this._value);
    }
    set value(t) {
        this.setter && this.setter(t);
    }
}
function Kl(e, t, n = !1) {
    let i, s;
    return (H(e) ? (i = e) : ((i = e.get), (s = e.set)), new Ul(i, s, n));
}
const _n = {},
    Mn = new WeakMap();
let Tt;
function zl(e, t = !1, n = Tt) {
    if (n) {
        let i = Mn.get(n);
        (i || Mn.set(n, (i = [])), i.push(e));
    }
}
function Wl(e, t, n = ie) {
    const { immediate: i, deep: s, once: r, scheduler: l, augmentJob: o, call: u } = n,
        g = (O) => (s ? O : De(O) || s === !1 || s === 0 ? ut(O, 1) : ut(O));
    let d,
        m,
        x,
        E,
        R = !1,
        M = !1;
    if (
        (xe(e)
            ? ((m = () => e.value), (R = De(e)))
            : gt(e)
              ? ((m = () => g(e)), (R = !0))
              : N(e)
                ? ((M = !0),
                  (R = e.some((O) => gt(O) || De(O))),
                  (m = () =>
                      e.map((O) => {
                          if (xe(O)) return O.value;
                          if (gt(O)) return g(O);
                          if (H(O)) return u ? u(O, 2) : O();
                      })))
                : H(e)
                  ? t
                      ? (m = u ? () => u(e, 2) : e)
                      : (m = () => {
                            if (x) {
                                et();
                                try {
                                    x();
                                } finally {
                                    tt();
                                }
                            }
                            const O = Tt;
                            Tt = d;
                            try {
                                return u ? u(e, 3, [E]) : e(E);
                            } finally {
                                Tt = O;
                            }
                        })
                  : (m = Qe),
        t && s)
    ) {
        const O = m,
            K = s === !0 ? 1 / 0 : s;
        m = () => ut(O(), K);
    }
    const z = Sl(),
        j = () => {
            (d.stop(), z && z.active && Ns(z.effects, d));
        };
    if (r && t) {
        const O = t;
        t = (...K) => {
            try {
                return O(...K);
            } finally {
                j();
            }
        };
    }
    let V = M ? new Array(e.length).fill(_n) : _n;
    const B = (O) => {
        if (!(!(d.flags & 1) || (!d.dirty && !O)))
            if (t) {
                const K = d.run();
                if (O || s || R || (M ? K.some((J, de) => Xe(J, V[de])) : Xe(K, V))) {
                    const J = Tt;
                    et();
                    try {
                        (x && x(), (Tt = d));
                        const de = [K, V === _n ? void 0 : M && V[0] === _n ? [] : V, E];
                        ((V = K), u ? u(t, 3, de) : t(...de));
                    } finally {
                        ((Tt = J), tt());
                    }
                }
            } else d.run();
    };
    return (
        o && o(B),
        (d = new Gi(m)),
        (d.scheduler = l ? () => l(B, !1) : B),
        (E = (O) => zl(O, !1, d)),
        (x = d.onStop =
            () => {
                const O = Mn.get(d);
                if (O) {
                    if (u) u(O, 4);
                    else for (const K of O) K();
                    Mn.delete(d);
                }
            }),
        t ? (i ? B(!0) : (V = d.run())) : l ? l(B.bind(null, !0), !0) : d.run(),
        (j.pause = d.pause.bind(d)),
        (j.resume = d.resume.bind(d)),
        (j.stop = j),
        j
    );
}
function ut(e, t = 1 / 0, n) {
    if (t <= 0 || !ee(e) || e.__v_skip || ((n = n || new Map()), (n.get(e) || 0) >= t)) return e;
    if ((n.set(e, t), t--, xe(e))) ut(e.value, t, n);
    else if (N(e)) for (let i = 0; i < e.length; i++) ut(e[i], t, n);
    else if (kt(e) || ht(e))
        e.forEach((i) => {
            ut(i, t, n);
        });
    else if (Ui(e)) {
        for (const i in e) ut(e[i], t, n);
        for (const i of Object.getOwnPropertySymbols(e))
            Object.prototype.propertyIsEnumerable.call(e, i) && ut(e[i], t, n);
    }
    return e;
}
function dn(e, t, n, i) {
    try {
        return i ? e(...i) : e();
    } catch (s) {
        qn(s, t, n);
    }
}
function He(e, t, n, i) {
    if (H(e)) {
        const s = dn(e, t, n, i);
        return (
            s &&
                ji(s) &&
                s.catch((r) => {
                    qn(r, t, n);
                }),
            s
        );
    }
    if (N(e)) {
        const s = [];
        for (let r = 0; r < e.length; r++) s.push(He(e[r], t, n, i));
        return s;
    }
}
function qn(e, t, n, i = !0) {
    const s = t ? t.vnode : null,
        { errorHandler: r, throwUnhandledErrorInProduction: l } = (t && t.appContext.config) || ie;
    if (t) {
        let o = t.parent;
        const u = t.proxy,
            g = `https://vuejs.org/error-reference/#runtime-${n}`;
        for (; o; ) {
            const d = o.ec;
            if (d) {
                for (let m = 0; m < d.length; m++) if (d[m](e, u, g) === !1) return;
            }
            o = o.parent;
        }
        if (r) {
            (et(), dn(r, null, 10, [e, u, g]), tt());
            return;
        }
    }
    ql(e, n, s, i, l);
}
function ql(e, t, n, i = !0, s = !1) {
    if (s) throw e;
    console.error(e);
}
const Te = [];
let je = -1;
const Je = [];
let pt = null,
    Lt = 0;
const fr = Promise.resolve();
let On = null;
function Bs(e) {
    const t = On || fr;
    return e ? t.then(this ? e.bind(this) : e) : t;
}
function Gl(e) {
    let t = je + 1,
        n = Te.length;
    for (; t < n; ) {
        const i = (t + n) >>> 1,
            s = Te[i],
            r = nn(s);
        r < e || (r === e && s.flags & 2) ? (t = i + 1) : (n = i);
    }
    return t;
}
function Us(e) {
    if (!(e.flags & 1)) {
        const t = nn(e),
            n = Te[Te.length - 1];
        (!n || (!(e.flags & 2) && t >= nn(n)) ? Te.push(e) : Te.splice(Gl(t), 0, e), (e.flags |= 1), dr());
    }
}
function dr() {
    On || (On = fr.then(gr));
}
function Jl(e) {
    if (!N(e)) pt && e.id === -1 ? pt.splice(Lt + 1, 0, e) : e.flags & 1 || (Je.push(e), (e.flags |= 1));
    else for (let t = 0; t < e.length; t++) Je.push(e[t]);
    dr();
}
function pr(e, t, n, i = je + 1) {
    for (; i < Te.length; i++) {
        const s = Te[i];
        if (s && s.flags & 2) {
            if ((e && s.id !== e.uid) || (t !== void 0 && !(s.id >= t))) continue;
            (Te.splice(i, 1),
                (i = e ? i - 1 : je),
                s.flags & 4 && (s.flags &= -2),
                s(),
                s.flags & 4 || (s.flags &= -2));
        }
    }
}
function hr(e, t, n = 0) {
    if (Je.length) {
        let i = Je,
            s = 0;
        if (t) {
            i = [];
            for (let l = 0; l < Je.length; l++) {
                const o = Je[l];
                (o.i !== void 0 ? !o.i || o.i.uid < n : t.has(o)) ? (Je[s++] = o) : i.push(o);
            }
        }
        const r = [...new Set(i)].sort((l, o) => nn(l) - nn(o));
        if (((Je.length = s), pt)) {
            for (let l = 0; l < r.length; l++) pt.push(r[l]);
            return;
        }
        for (pt = r, Lt = 0; Lt < pt.length; Lt++) {
            const l = pt[Lt];
            (l.flags & 4 && (l.flags &= -2), l.flags & 8 || l(), (l.flags &= -2));
        }
        ((pt = null), (Lt = 0));
    }
}
let os = !1;
function Yl(e, t) {
    if (os) {
        e();
        return;
    }
    const n = t === void 0 ? void 0 : new Set(Je);
    (e(), (os = !0));
    try {
        (pr(void 0, t), hr(void 0, n, t));
    } finally {
        os = !1;
    }
}
const nn = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function gr(e) {
    try {
        for (je = 0; je < Te.length; je++) {
            const t = Te[je];
            t &&
                !(t.flags & 8) &&
                (t.flags & 4 && (t.flags &= -2), dn(t, t.i, t.i ? 15 : 14), t.flags & 4 || (t.flags &= -2));
        }
    } finally {
        for (; je < Te.length; je++) {
            const t = Te[je];
            t && (t.flags &= -2);
        }
        ((je = -1), (Te.length = 0), hr(), (On = null), (Te.length || Je.length) && gr());
    }
}
let Ie = null,
    vr = null;
function In(e) {
    const t = Ie;
    return ((Ie = e), (vr = (e && e.type.__scopeId) || null), t);
}
function Ks(e, t = Ie, n) {
    if (!t || e._n) return e;
    const i = (...s) => {
        i._d && Pn(-1);
        const r = In(t),
            l = It.length;
        let o;
        try {
            o = e(...s);
        } finally {
            for (let u = It.length; u > l; u--) Ur();
            (In(r), i._d && Pn(1));
        }
        return o;
    };
    return ((i._n = !0), (i._c = !0), (i._d = !0), i);
}
function Sn(e, t) {
    if (Ie === null) return e;
    const n = Zn(Ie),
        i = e.dirs || (e.dirs = []);
    for (let s = 0; s < t.length; s++) {
        let [r, l, o, u = ie] = t[s];
        r &&
            (H(r) && (r = { mounted: r, updated: r }),
            r.deep && ut(l),
            i.push({ dir: r, instance: n, value: l, oldValue: void 0, arg: o, modifiers: u }));
    }
    return e;
}
function _t(e, t, n, i) {
    const s = e.dirs,
        r = t && t.dirs;
    for (let l = 0; l < s.length; l++) {
        const o = s[l];
        r && (o.oldValue = r[l].value);
        let u = o.dir[i];
        u && (et(), He(u, n, 8, [e.el, o, e, t]), tt());
    }
}
function Xl(e, t) {
    if (_e) {
        let n = _e.provides;
        const i = _e.parent && _e.parent.provides;
        (i === n && (n = _e.provides = Object.create(i)), (n[e] = t));
    }
}
function Cn(e, t, n = !1) {
    const i = qr();
    if (i || Vt) {
        let s = Vt
            ? Vt._context.provides
            : i
              ? i.parent == null || i.ce
                  ? i.vnode.appContext && i.vnode.appContext.provides
                  : i.parent.provides
              : void 0;
        if (s && e in s) return s[e];
        if (arguments.length > 1) return n && H(t) ? t.call(i && i.proxy) : t;
    }
}
const Ql = Symbol.for("v-scx"),
    Zl = () => Cn(Ql);
function Dt(e, t, n) {
    return mr(e, t, n);
}
function mr(e, t, n = ie) {
    const { immediate: i, deep: s, flush: r, once: l } = n,
        o = ge({}, n),
        u = (t && i) || (!t && r !== "post");
    let g;
    if (an) {
        if (r === "sync") {
            const E = Zl();
            g = E.__watcherHandles || (E.__watcherHandles = []);
        } else if (!u) {
            const E = () => {};
            return ((E.stop = Qe), (E.resume = Qe), (E.pause = Qe), E);
        }
    }
    const d = _e;
    o.call = (E, R, M) => He(E, d, R, M);
    let m = !1;
    (r === "post"
        ? (o.scheduler = (E) => {
              ((E.i = d), Ee(E, d && d.suspense));
          })
        : r !== "sync" &&
          ((m = !0),
          (o.scheduler = (E, R) => {
              R ? E() : Us(E);
          })),
        (o.augmentJob = (E) => {
            (t && (E.flags |= 4), m && ((E.flags |= 2), d && ((E.id = d.uid), (E.i = d))));
        }));
    const x = Wl(e, t, o);
    return (an && (g ? g.push(x) : u && x()), x);
}
function eo(e, t, n) {
    const i = this.proxy,
        s = ae(e) ? (e.includes(".") ? yr(i, e) : () => i[e]) : e.bind(i, i);
    let r;
    H(t) ? (r = t) : ((r = t.handler), (n = t));
    const l = pn(this),
        o = mr(s, r.bind(i), n);
    return (l(), o);
}
function yr(e, t) {
    const n = t.split(".");
    return () => {
        let i = e;
        for (let s = 0; s < n.length && i; s++) i = i[n[s]];
        return i;
    };
}
const to = Symbol("_vte"),
    Gn = (e) => e.__isTeleport,
    Le = Symbol("_leaveCb"),
    Ut = Symbol("_enterCb");
function no() {
    const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() };
    return (
        zs(() => {
            e.isMounted = !0;
        }),
        Ws(() => {
            e.isUnmounting = !0;
        }),
        e
    );
}
const Fe = [Function, Array],
    br = {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        onBeforeEnter: Fe,
        onEnter: Fe,
        onAfterEnter: Fe,
        onEnterCancelled: Fe,
        onBeforeLeave: Fe,
        onLeave: Fe,
        onAfterLeave: Fe,
        onLeaveCancelled: Fe,
        onBeforeAppear: Fe,
        onAppear: Fe,
        onAfterAppear: Fe,
        onAppearCancelled: Fe,
    },
    so = {
        name: "BaseTransition",
        props: br,
        setup(e, { slots: t }) {
            const n = qr(),
                i = no();
            return () => {
                const s = t.default && xr(t.default(), !0),
                    r = s && s.length ? _r(s) : n.subTree ? Oe() : void 0;
                if (!r) return;
                const l = X(e),
                    { mode: o } = l;
                if (i.isLeaving) return as(r);
                const u = kn(r);
                if (!u) return as(r);
                let g = ws(u, l, i, n, (m) => (g = m));
                u.type !== Se && Ht(u, g);
                let d = n.subTree && kn(n.subTree);
                if (d && d.type !== Se && !Ct(d, u) && sn(n.subTree)) {
                    let m = ws(d, l, i, n);
                    if ((Ht(d, m), o === "out-in" && u.type !== Se))
                        return (
                            (i.isLeaving = !0),
                            (m.afterLeave = () => {
                                ((i.isLeaving = !1), n.job.flags & 8 || n.update(), delete m.afterLeave, (d = void 0));
                            }),
                            as(r)
                        );
                    o === "in-out" && u.type !== Se
                        ? (m.delayLeave = (x, E, R) => {
                              const M = Sr(i, d);
                              ((M[String(d.key)] = d),
                                  (x[Le] = () => {
                                      (E(), (x[Le] = void 0), delete g.delayedLeave, (d = void 0));
                                  }),
                                  (g.delayedLeave = () => {
                                      (R(), delete g.delayedLeave, (d = void 0));
                                  }));
                          })
                        : (d = void 0);
                } else d && (d = void 0);
                return r;
            };
        },
    };
function _r(e) {
    let t = e[0];
    if (e.length > 1) {
        for (const n of e)
            if (n.type !== Se) {
                t = n;
                break;
            }
    }
    return t;
}
const io = so;
function Sr(e, t) {
    const { leavingVNodes: n } = e;
    let i = n.get(t.type);
    return (i || ((i = Object.create(null)), n.set(t.type, i)), i);
}
function ws(e, t, n, i, s) {
    const {
            appear: r,
            mode: l,
            persisted: o = !1,
            onBeforeEnter: u,
            onEnter: g,
            onAfterEnter: d,
            onEnterCancelled: m,
            onBeforeLeave: x,
            onLeave: E,
            onAfterLeave: R,
            onLeaveCancelled: M,
            onBeforeAppear: z,
            onAppear: j,
            onAfterAppear: V,
            onAppearCancelled: B,
        } = t,
        O = String(e.key),
        K = Sr(n, e),
        J = (F, W) => {
            F && He(F, i, 9, W);
        },
        de = (F, W) => {
            const Y = W[1];
            (J(F, W), N(F) ? F.every((A) => A.length <= 1) && Y() : F.length <= 1 && Y());
        },
        ye = {
            mode: l,
            persisted: o,
            beforeEnter(F) {
                let W = u;
                if (!n.isMounted)
                    if (r) W = z || u;
                    else return;
                F[Le] && F[Le](!0);
                const Y = K[O];
                if (Y && Ct(e, Y)) {
                    let A = Y.el[Le];
                    if (!A) {
                        const Z = sn(Y);
                        A = Z && Z.el[Le];
                    }
                    A && A();
                }
                J(W, [F]);
            },
            enter(F) {
                if (K[O] === e) return;
                let W = g,
                    Y = d,
                    A = m;
                if (!n.isMounted)
                    if (r) ((W = j || g), (Y = V || d), (A = B || m));
                    else return;
                let Z = !1;
                F[Ut] = (Ne) => {
                    Z || ((Z = !0), Ne ? J(A, [F]) : J(Y, [F]), ye.delayedLeave && ye.delayedLeave(), (F[Ut] = void 0));
                };
                const pe = F[Ut].bind(null, !1);
                W ? de(W, [F, pe]) : pe();
            },
            leave(F, W) {
                const Y = String(e.key);
                if ((F[Ut] && F[Ut](!0), n.isUnmounting)) return W();
                J(x, [F]);
                let A = !1;
                F[Le] = (pe) => {
                    A || ((A = !0), W(), pe ? J(M, [F]) : J(R, [F]), (F[Le] = void 0), K[Y] === e && delete K[Y]);
                };
                const Z = F[Le].bind(null, !1);
                ((K[Y] = e), E ? de(E, [F, Z]) : Z());
            },
            clone(F) {
                const W = ws(F, t, n, i, s);
                return (s && s(W), W);
            },
        };
    return ye;
}
function as(e) {
    if (Jn(e)) return ((e = yt(e)), (e.children = null), e);
}
function kn(e) {
    if (!Jn(e)) return Gn(e.type) && e.children ? _r(e.children) : e;
    if (e.component) return e.component.subTree;
    const { shapeFlag: t, children: n } = e;
    if (n) {
        if (t & 16) return n[0];
        if (t & 32 && H(n.default)) return n.default();
    }
}
function Ht(e, t) {
    if (e.shapeFlag & 6 && e.component) {
        e.transition = t;
        const n = e.component.subTree;
        Ht((Gn(n.type) && kn(n)) || n, t);
    } else if (e.shapeFlag & 128)
        ((e.ssContent.transition = t.clone(e.ssContent)), (e.ssFallback.transition = t.clone(e.ssFallback)));
    else if (((e.transition = t), e.type === oe && N(e.children))) {
        const n = Ir(e.children, !1);
        n && Ht(n, t);
    }
}
function xr(e, t = !1, n) {
    let i = [],
        s = 0;
    for (let r = 0; r < e.length; r++) {
        let l = e[r];
        const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : r);
        l.type === oe
            ? (l.patchFlag & 128 && s++, (i = i.concat(xr(l.children, t, o))))
            : (t || l.type !== Se) && i.push(o != null ? yt(l, { key: o }) : l);
    }
    if (s > 1) for (let r = 0; r < i.length; r++) i[r].patchFlag = -2;
    return i;
}
function sn(e) {
    if (e.component) return sn(e.component.subTree);
    if (e.type === oe) {
        const t = N(e.children) && Ir(e.children, !1);
        return t ? sn(t) : void 0;
    }
    if (e.type !== Se) return e;
}
function wr(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function ri(e, t) {
    let n;
    return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const Nn = new WeakMap();
function Yt(e, t, n, i, s = !1) {
    if (N(e)) {
        e.forEach((M, z) => Yt(M, t && (N(t) ? t[z] : t), n, i, s));
        return;
    }
    if (Xt(i) && !s) {
        i.shapeFlag & 512 &&
            i.type.__asyncResolved &&
            i.component.subTree.component &&
            Yt(e, t, n, i.component.subTree);
        return;
    }
    const r = i.shapeFlag & 4 ? Zn(i.component) : i.el,
        l = s ? null : r,
        { i: o, r: u } = e,
        g = t && t.r,
        d = o.refs === ie ? (o.refs = {}) : o.refs,
        m = o.setupState,
        x = X(m),
        E = m === ie ? Hi : (M) => (ri(d, M) ? !1 : Q(x, M)),
        R = (M, z) => !(z && ri(d, z));
    if (g != null && g !== u) {
        if ((li(t), ae(g))) ((d[g] = null), E(g) && (m[g] = null));
        else if (xe(g)) {
            const M = t;
            (R(g, M.k) && (g.value = null), M.k && (d[M.k] = null));
        }
    }
    if (H(u)) dn(u, o, 12, [l, d]);
    else {
        const M = ae(u),
            z = xe(u);
        if (M || z) {
            const j = () => {
                if (e.f) {
                    const V = M ? (E(u) ? m[u] : d[u]) : R() || !e.k ? u.value : d[e.k];
                    if (s) N(V) && Ns(V, r);
                    else if (N(V)) V.includes(r) || V.push(r);
                    else if (M) ((d[u] = [r]), E(u) && (m[u] = d[u]));
                    else {
                        const B = [r];
                        (R(u, e.k) && (u.value = B), e.k && (d[e.k] = B));
                    }
                } else M ? ((d[u] = l), E(u) && (m[u] = l)) : z && (R(u, e.k) && (u.value = l), e.k && (d[e.k] = l));
            };
            if (l) {
                const V = () => {
                    (j(), Nn.delete(e));
                };
                ((V.id = -1), Nn.set(e, V), Ee(V, n));
            } else (li(e), j());
        }
    }
}
function li(e) {
    const t = Nn.get(e);
    t && ((t.flags |= 8), Nn.delete(e));
}
zn().requestIdleCallback;
zn().cancelIdleCallback;
const Xt = (e) => !!e.type.__asyncLoader,
    Jn = (e) => e.type.__isKeepAlive;
function ro(e, t) {
    Tr(e, "a", t);
}
function lo(e, t) {
    Tr(e, "da", t);
}
function Tr(e, t, n = _e) {
    const i =
        e.__wdc ||
        (e.__wdc = () => {
            let s = n;
            for (; s; ) {
                if (s.isDeactivated) return;
                s = s.parent;
            }
            return e();
        });
    if ((Yn(t, i, n), n)) {
        let s = n.parent;
        for (; s && s.parent; ) (Jn(s.parent.vnode) && oo(i, t, n, s), (s = s.parent));
    }
}
function oo(e, t, n, i) {
    const s = Yn(t, e, i, !0);
    Cr(() => {
        Ns(i[t], s);
    }, n);
}
function Yn(e, t, n = _e, i = !1) {
    if (n) {
        const s = n[e] || (n[e] = []),
            r =
                t.__weh ||
                (t.__weh = (...l) => {
                    et();
                    const o = pn(n),
                        u = He(t, n, e, l);
                    return (o(), tt(), u);
                });
        return (i ? s.unshift(r) : s.push(r), r);
    }
}
const ct =
        (e) =>
        (t, n = _e) => {
            (!an || e === "sp") && Yn(e, (...i) => t(...i), n);
        },
    ao = ct("bm"),
    zs = ct("m"),
    uo = ct("bu"),
    co = ct("u"),
    Ws = ct("bum"),
    Cr = ct("um"),
    fo = ct("sp"),
    po = ct("rtg"),
    ho = ct("rtc");
function go(e, t = _e) {
    Yn("ec", e, t);
}
const vo = "components",
    mo = Symbol.for("v-ndc");
function yo(e) {
    return (ae(e) && bo(vo, e, !1)) || e;
}
function bo(e, t, n = !0, i = !1) {
    const s = Ie || _e;
    if (s) {
        const r = s.type;
        {
            const o = na(r, !1);
            if (o && (o === t || o === Ce(t) || o === Un(Ce(t)))) return r;
        }
        const l = oi(s[e] || r[e], t) || oi(s.appContext[e], t);
        return !l && i ? r : l;
    }
}
function oi(e, t) {
    return e && (e[t] || e[Ce(t)] || e[Un(Ce(t))]);
}
function qe(e, t, n, i) {
    let s;
    const r = n,
        l = N(e);
    if (l || ae(e)) {
        const o = l && gt(e);
        let u = !1,
            g = !1;
        (o && ((u = !De(e)), (g = nt(e)), (e = Wn(e))), (s = new Array(e.length)));
        for (let d = 0, m = e.length; d < m; d++) s[d] = t(u ? (g ? mt(Ve(e[d])) : Ve(e[d])) : e[d], d, void 0, r);
    } else if (typeof e == "number")
        if (!Number.isInteger(e) || e < 0) s = [];
        else {
            s = new Array(e);
            for (let o = 0; o < e; o++) s[o] = t(o + 1, o, void 0, r);
        }
    else if (ee(e))
        if (e[Symbol.iterator]) s = Array.from(e, (o, u) => t(o, u, void 0, r));
        else {
            const o = Object.keys(e);
            s = new Array(o.length);
            for (let u = 0, g = o.length; u < g; u++) {
                const d = o[u];
                s[u] = t(e[d], d, u, r);
            }
        }
    else s = [];
    return s;
}
const Ts = (e) => (e ? (Gr(e) ? Zn(e) : Ts(e.parent)) : null),
    Qt = ge(Object.create(null), {
        $: (e) => e,
        $el: (e) => e.vnode.el,
        $data: (e) => e.data,
        $props: (e) => e.props,
        $attrs: (e) => e.attrs,
        $slots: (e) => e.slots,
        $refs: (e) => e.refs,
        $parent: (e) => Ts(e.parent),
        $root: (e) => Ts(e.root),
        $host: (e) => e.ce,
        $emit: (e) => e.emit,
        $options: (e) => Ar(e),
        $forceUpdate: (e) =>
            e.f ||
            (e.f = () => {
                Us(e.update);
            }),
        $nextTick: (e) => e.n || (e.n = Bs.bind(e.proxy)),
        $watch: (e) => eo.bind(e),
    }),
    us = (e, t) => e !== ie && !e.__isScriptSetup && Q(e, t),
    _o = {
        get({ _: e }, t) {
            if (t === "__v_skip") return !0;
            const { ctx: n, setupState: i, data: s, props: r, accessCache: l, type: o, appContext: u } = e;
            if (t[0] !== "$") {
                const x = l[t];
                if (x !== void 0)
                    switch (x) {
                        case 1:
                            return i[t];
                        case 2:
                            return s[t];
                        case 4:
                            return n[t];
                        case 3:
                            return r[t];
                    }
                else {
                    if (us(i, t)) return ((l[t] = 1), i[t]);
                    if (s !== ie && Q(s, t)) return ((l[t] = 2), s[t]);
                    if (Q(r, t)) return ((l[t] = 3), r[t]);
                    if (n !== ie && Q(n, t)) return ((l[t] = 4), n[t]);
                    Cs && (l[t] = 0);
                }
            }
            const g = Qt[t];
            let d, m;
            if (g) return (t === "$attrs" && be(e.attrs, "get", ""), g(e));
            if ((d = o.__cssModules) && (d = d[t])) return d;
            if (n !== ie && Q(n, t)) return ((l[t] = 4), n[t]);
            if (((m = u.config.globalProperties), Q(m, t))) return m[t];
        },
        set({ _: e }, t, n) {
            const { data: i, setupState: s, ctx: r } = e;
            return us(s, t)
                ? ((s[t] = n), !0)
                : i !== ie && Q(i, t)
                  ? ((i[t] = n), !0)
                  : Q(e.props, t) || (t[0] === "$" && t.slice(1) in e)
                    ? !1
                    : ((r[t] = n), !0);
        },
        has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: s, props: r, type: l } }, o) {
            let u;
            return !!(
                n[o] ||
                (e !== ie && o[0] !== "$" && Q(e, o)) ||
                us(t, o) ||
                Q(r, o) ||
                Q(i, o) ||
                Q(Qt, o) ||
                Q(s.config.globalProperties, o) ||
                ((u = l.__cssModules) && u[o])
            );
        },
        defineProperty(e, t, n) {
            return (
                n.get != null ? (e._.accessCache[t] = 0) : Q(n, "value") && this.set(e, t, n.value, null),
                Reflect.defineProperty(e, t, n)
            );
        },
    };
function ai(e) {
    return N(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let Cs = !0;
function So(e) {
    const t = Ar(e),
        n = e.proxy,
        i = e.ctx;
    ((Cs = !1), t.beforeCreate && ui(t.beforeCreate, e, "bc"));
    const {
        data: s,
        computed: r,
        methods: l,
        watch: o,
        provide: u,
        inject: g,
        created: d,
        beforeMount: m,
        mounted: x,
        beforeUpdate: E,
        updated: R,
        activated: M,
        deactivated: z,
        beforeDestroy: j,
        beforeUnmount: V,
        destroyed: B,
        unmounted: O,
        render: K,
        renderTracked: J,
        renderTriggered: de,
        errorCaptured: ye,
        serverPrefetch: F,
        expose: W,
        inheritAttrs: Y,
        components: A,
        directives: Z,
        filters: pe,
    } = t;
    if ((g && xo(g, i, null), l))
        for (const le in l) {
            const te = l[le];
            H(te) && (i[le] = te.bind(n));
        }
    if (s) {
        const le = s.call(n, n);
        ee(le) && (e.data = Vs(le));
    }
    if (((Cs = !0), r))
        for (const le in r) {
            const te = r[le],
                Re = H(te) ? te.bind(n, n) : H(te.get) ? te.get.bind(n, n) : Qe,
                Rt = !H(te) && H(te.set) ? te.set.bind(n) : Qe,
                st = he({ get: Re, set: Rt });
            Object.defineProperty(i, le, {
                enumerable: !0,
                configurable: !0,
                get: () => st.value,
                set: (Ae) => (st.value = Ae),
            });
        }
    if (o) for (const le in o) Er(o[le], i, n, le);
    if (u) {
        const le = H(u) ? u.call(n) : u;
        Reflect.ownKeys(le).forEach((te) => {
            Xl(te, le[te]);
        });
    }
    d && ui(d, e, "c");
    function ue(le, te) {
        N(te) ? te.forEach((Re) => le(Re.bind(n))) : te && le(te.bind(n));
    }
    if (
        (ue(ao, m),
        ue(zs, x),
        ue(uo, E),
        ue(co, R),
        ue(ro, M),
        ue(lo, z),
        ue(go, ye),
        ue(ho, J),
        ue(po, de),
        ue(Ws, V),
        ue(Cr, O),
        ue(fo, F),
        N(W))
    )
        if (W.length) {
            const le = e.exposed || (e.exposed = {});
            W.forEach((te) => {
                Object.defineProperty(le, te, { get: () => n[te], set: (Re) => (n[te] = Re), enumerable: !0 });
            });
        } else e.exposed || (e.exposed = {});
    (K && e.render === Qe && (e.render = K),
        Y != null && (e.inheritAttrs = Y),
        A && (e.components = A),
        Z && (e.directives = Z),
        F && wr(e));
}
function xo(e, t, n = Qe) {
    N(e) && (e = Es(e));
    for (const i in e) {
        const s = e[i];
        let r;
        (ee(s) ? ("default" in s ? (r = Cn(s.from || i, s.default, !0)) : (r = Cn(s.from || i))) : (r = Cn(s)),
            xe(r)
                ? Object.defineProperty(t, i, {
                      enumerable: !0,
                      configurable: !0,
                      get: () => r.value,
                      set: (l) => (r.value = l),
                  })
                : (t[i] = r));
    }
}
function ui(e, t, n) {
    He(N(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Er(e, t, n, i) {
    let s = i.includes(".") ? yr(n, i) : () => n[i];
    if (ae(e)) {
        const r = t[e];
        H(r) && Dt(s, r);
    } else if (H(e)) Dt(s, e.bind(n));
    else if (ee(e))
        if (N(e)) e.forEach((r) => Er(r, t, n, i));
        else {
            const r = H(e.handler) ? e.handler.bind(n) : t[e.handler];
            H(r) && Dt(s, r, e);
        }
}
function Ar(e) {
    const t = e.type,
        { mixins: n, extends: i } = t,
        {
            mixins: s,
            optionsCache: r,
            config: { optionMergeStrategies: l },
        } = e.appContext,
        o = r.get(t);
    let u;
    return (
        o
            ? (u = o)
            : !s.length && !n && !i
              ? (u = t)
              : ((u = {}), s.length && s.forEach((g) => Rn(u, g, l, !0)), Rn(u, t, l)),
        ee(t) && r.set(t, u),
        u
    );
}
function Rn(e, t, n, i = !1) {
    const { mixins: s, extends: r } = t;
    (r && Rn(e, r, n, !0), s && s.forEach((l) => Rn(e, l, n, !0)));
    for (const l in t)
        if (!(i && l === "expose")) {
            const o = wo[l] || (n && n[l]);
            e[l] = o ? o(e[l], t[l]) : t[l];
        }
    return e;
}
const wo = {
    data: ci,
    props: fi,
    emits: fi,
    methods: zt,
    computed: zt,
    beforeCreate: we,
    created: we,
    beforeMount: we,
    mounted: we,
    beforeUpdate: we,
    updated: we,
    beforeDestroy: we,
    beforeUnmount: we,
    destroyed: we,
    unmounted: we,
    activated: we,
    deactivated: we,
    errorCaptured: we,
    serverPrefetch: we,
    components: zt,
    directives: zt,
    watch: Co,
    provide: ci,
    inject: To,
};
function ci(e, t) {
    return t
        ? e
            ? function () {
                  return ge(H(e) ? e.call(this, this) : e, H(t) ? t.call(this, this) : t);
              }
            : t
        : e;
}
function To(e, t) {
    return zt(Es(e), Es(t));
}
function Es(e) {
    if (N(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
        return t;
    }
    return e;
}
function we(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
}
function zt(e, t) {
    return e ? ge(Object.create(null), e, t) : t;
}
function fi(e, t) {
    return e ? (N(e) && N(t) ? [...new Set([...e, ...t])] : ge(Object.create(null), ai(e), ai(t ?? {}))) : t;
}
function Co(e, t) {
    if (!e) return t;
    if (!t) return e;
    const n = ge(Object.create(null), e);
    for (const i in t) n[i] = we(e[i], t[i]);
    return n;
}
function Mr() {
    return {
        app: null,
        config: {
            isNativeTag: Hi,
            performance: !1,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {},
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap(),
    };
}
let Eo = 0;
function Ao(e, t) {
    return function (i, s = null) {
        (H(i) || (i = ge({}, i)), s != null && !ee(s) && (s = null));
        const r = Mr(),
            l = new WeakSet(),
            o = [];
        let u = !1;
        const g = (r.app = {
            _uid: Eo++,
            _component: i,
            _props: s,
            _container: null,
            _context: r,
            _instance: null,
            version: ra,
            get config() {
                return r.config;
            },
            set config(d) {},
            use(d, ...m) {
                return (
                    l.has(d) || (d && H(d.install) ? (l.add(d), d.install(g, ...m)) : H(d) && (l.add(d), d(g, ...m))),
                    g
                );
            },
            mixin(d) {
                return (r.mixins.includes(d) || r.mixins.push(d), g);
            },
            component(d, m) {
                return m ? ((r.components[d] = m), g) : r.components[d];
            },
            directive(d, m) {
                return m ? ((r.directives[d] = m), g) : r.directives[d];
            },
            mount(d, m, x) {
                if (!u) {
                    const E = g._ceVNode || k(i, s);
                    return (
                        (E.appContext = r),
                        x === !0 ? (x = "svg") : x === !1 && (x = void 0),
                        e(E, d, x),
                        (u = !0),
                        (g._container = d),
                        (d.__vue_app__ = g),
                        Zn(E.component)
                    );
                }
            },
            onUnmount(d) {
                o.push(d);
            },
            unmount() {
                u && (He(o, g._instance, 16), e(null, g._container), delete g._container.__vue_app__);
            },
            provide(d, m) {
                return ((r.provides[d] = m), g);
            },
            runWithContext(d) {
                const m = Vt;
                Vt = g;
                try {
                    return d();
                } finally {
                    Vt = m;
                }
            },
        });
        return g;
    };
}
let Vt = null;
const Mo = (e, t) =>
    t === "modelValue" || t === "model-value"
        ? e.modelModifiers
        : e[`${t}Modifiers`] || e[`${Ce(t)}Modifiers`] || e[`${Nt(t)}Modifiers`];
function Oo(e, t, ...n) {
    if (e.isUnmounted) return;
    const i = e.vnode.props || ie;
    let s = n;
    const r = t.startsWith("update:"),
        l = r && Mo(i, t.slice(7));
    l && (l.trim && (s = n.map((d) => (ae(d) ? d.trim() : d))), l.number && (s = s.map(Kn)));
    let o,
        u = i[(o = ns(t))] || i[(o = ns(Ce(t)))];
    (!u && r && (u = i[(o = ns(Nt(t)))]), u && He(u, e, 6, s));
    const g = i[o + "Once"];
    if (g) {
        if (!e.emitted) e.emitted = {};
        else if (e.emitted[o]) return;
        ((e.emitted[o] = !0), He(g, e, 6, s));
    }
}
const Io = new WeakMap();
function Or(e, t, n = !1) {
    const i = n ? Io : t.emitsCache,
        s = i.get(e);
    if (s !== void 0) return s;
    const r = e.emits;
    let l = {},
        o = !1;
    if (!H(e)) {
        const u = (g) => {
            const d = Or(g, t, !0);
            d && ((o = !0), ge(l, d));
        };
        (!n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u));
    }
    return !r && !o
        ? (ee(e) && i.set(e, null), null)
        : (N(r) ? r.forEach((u) => (l[u] = null)) : ge(l, r), ee(e) && i.set(e, l), l);
}
function Xn(e, t) {
    return !e || !Hn(t)
        ? !1
        : ((t = t.slice(2)),
          (t = t === "Once" ? t : t.replace(/Once$/, "")),
          Q(e, t[0].toLowerCase() + t.slice(1)) || Q(e, Nt(t)) || Q(e, t));
}
function di(e) {
    const {
            type: t,
            vnode: n,
            proxy: i,
            withProxy: s,
            propsOptions: [r],
            slots: l,
            attrs: o,
            emit: u,
            render: g,
            renderCache: d,
            props: m,
            data: x,
            setupState: E,
            ctx: R,
            inheritAttrs: M,
        } = e,
        z = In(e);
    let j, V;
    try {
        if (n.shapeFlag & 4) {
            const O = s || i,
                K = O;
            ((j = Ye(g.call(K, O, d, m, E, x, R))), (V = o));
        } else {
            const O = t;
            ((j = Ye(O.length > 1 ? O(m, { attrs: o, slots: l, emit: u }) : O(m, null))), (V = t.props ? o : ko(o)));
        }
    } catch (O) {
        ((It.length = 0), qn(O, e, 1), (j = k(Se)));
    }
    let B = j;
    if (V && M !== !1) {
        const O = Object.keys(V),
            { shapeFlag: K } = B;
        O.length && K & 7 && (r && O.some(jn) && (V = No(V, r)), (B = yt(B, V, !1, !0)));
    }
    if ((n.dirs && ((B = yt(B, null, !1, !0)), (B.dirs = B.dirs ? B.dirs.concat(n.dirs) : n.dirs)), n.transition)) {
        const O = (Gn(B.type) && kn(B)) || B;
        Ht(O, n.transition);
    }
    return ((j = B), In(z), j);
}
function Ir(e, t = !0) {
    let n;
    for (let i = 0; i < e.length; i++) {
        const s = e[i];
        if (ln(s)) {
            if (s.type !== Se || s.children === "v-if") {
                if (n) return;
                n = s;
            }
        } else return;
    }
    return n;
}
const ko = (e) => {
        let t;
        for (const n in e) (n === "class" || n === "style" || Hn(n)) && ((t || (t = {}))[n] = e[n]);
        return t;
    },
    No = (e, t) => {
        const n = {};
        for (const i in e) (!jn(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
        return n;
    };
function Ro(e, t, n) {
    const { props: i, children: s, component: r } = e,
        { props: l, children: o, patchFlag: u } = t,
        g = r.emitsOptions;
    if (t.dirs || t.transition) return !0;
    if (n && u >= 0) {
        if (u & 1024) return !0;
        if (u & 16) return i ? pi(i, l, g) : !!l;
        if (u & 8) {
            const d = t.dynamicProps;
            for (let m = 0; m < d.length; m++) {
                const x = d[m];
                if (kr(l, i, x) && !Xn(g, x)) return !0;
            }
        }
    } else return (s || o) && (!o || !o.$stable) ? !0 : i === l ? !1 : i ? (l ? pi(i, l, g) : !0) : !!l;
    return !1;
}
function pi(e, t, n) {
    const i = Object.keys(t);
    if (i.length !== Object.keys(e).length) return !0;
    for (let s = 0; s < i.length; s++) {
        const r = i[s];
        if (!Q(e, r) || (kr(t, e, r) && !Xn(n, r))) return !0;
    }
    return !1;
}
function kr(e, t, n) {
    const i = e[n],
        s = t[n];
    return n === "style" && ee(i) && ee(s) ? !vt(i, s) : i !== s;
}
function Po({ vnode: e, parent: t, suspense: n }, i) {
    for (; t; ) {
        const s = t.subTree;
        if ((s.suspense && s.suspense.activeBranch === e && ((s.suspense.vnode.el = s.el = i), (e = s)), s === e))
            (((e = t.vnode).el = i), (t = t.parent));
        else break;
    }
    n && n.activeBranch === e && (n.vnode.el = i);
}
const Nr = {},
    Rr = () => Object.create(Nr),
    Pr = (e) => Object.getPrototypeOf(e) === Nr;
function $o(e, t, n, i = !1) {
    const s = {},
        r = Rr();
    ((e.propsDefaults = Object.create(null)), $r(e, t, s, r));
    for (const l in e.propsOptions[0]) l in s || (s[l] = void 0);
    (n ? (e.props = i ? s : Dl(s)) : e.type.props ? (e.props = s) : (e.props = r), (e.attrs = r));
}
function Fo(e, t, n, i) {
    const {
            props: s,
            attrs: r,
            vnode: { patchFlag: l },
        } = e,
        o = X(s),
        [u] = e.propsOptions;
    let g = !1;
    if ((i || l > 0) && !(l & 16)) {
        if (l & 8) {
            const d = e.vnode.dynamicProps;
            for (let m = 0; m < d.length; m++) {
                let x = d[m];
                if (Xn(e.emitsOptions, x)) continue;
                const E = t[x];
                if (u)
                    if (Q(r, x)) E !== r[x] && ((r[x] = E), (g = !0));
                    else {
                        const R = Ce(x);
                        s[R] = As(u, o, R, E, e, !1);
                    }
                else E !== r[x] && ((r[x] = E), (g = !0));
            }
        }
    } else {
        $r(e, t, s, r) && (g = !0);
        let d;
        for (const m in o)
            (!t || (!Q(t, m) && ((d = Nt(m)) === m || !Q(t, d)))) &&
                (u ? n && (n[m] !== void 0 || n[d] !== void 0) && (s[m] = As(u, o, m, void 0, e, !0)) : delete s[m]);
        if (r !== o) for (const m in r) (!t || !Q(t, m)) && (delete r[m], (g = !0));
    }
    g && at(e.attrs, "set", "");
}
function $r(e, t, n, i) {
    const [s, r] = e.propsOptions;
    let l = !1,
        o;
    if (t)
        for (let u in t) {
            if (qt(u)) continue;
            const g = t[u];
            let d;
            s && Q(s, (d = Ce(u)))
                ? !r || !r.includes(d)
                    ? (n[d] = g)
                    : ((o || (o = {}))[d] = g)
                : Xn(e.emitsOptions, u) || ((!(u in i) || g !== i[u]) && ((i[u] = g), (l = !0)));
        }
    if (r) {
        const u = X(n),
            g = o || ie;
        for (let d = 0; d < r.length; d++) {
            const m = r[d];
            n[m] = As(s, u, m, g[m], e, !Q(g, m));
        }
    }
    return l;
}
function As(e, t, n, i, s, r) {
    const l = e[n];
    if (l != null) {
        const o = Q(l, "default");
        if (o && i === void 0) {
            const u = l.default;
            if (l.type !== Function && !l.skipFactory && H(u)) {
                const { propsDefaults: g } = s;
                if (n in g) i = g[n];
                else {
                    const d = pn(s);
                    ((i = g[n] = u.call(null, t)), d());
                }
            } else i = u;
            s.ce && s.ce._setProp(n, i);
        }
        l[0] && (r && !o ? (i = !1) : l[1] && (i === "" || i === Nt(n)) && (i = !0));
    }
    return i;
}
const Lo = new WeakMap();
function Fr(e, t, n = !1) {
    const i = n ? Lo : t.propsCache,
        s = i.get(e);
    if (s) return s;
    const r = e.props,
        l = {},
        o = [];
    let u = !1;
    if (!H(e)) {
        const d = (m) => {
            u = !0;
            const [x, E] = Fr(m, t, !0);
            (ge(l, x), E && o.push(...E));
        };
        (!n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d));
    }
    if (!r && !u) return (ee(e) && i.set(e, At), At);
    if (N(r))
        for (let d = 0; d < r.length; d++) {
            const m = Ce(r[d]);
            hi(m) && (l[m] = ie);
        }
    else if (r)
        for (const d in r) {
            const m = Ce(d);
            if (hi(m)) {
                const x = r[d],
                    E = (l[m] = N(x) || H(x) ? { type: x } : ge({}, x)),
                    R = E.type;
                let M = !1,
                    z = !0;
                if (N(R))
                    for (let j = 0; j < R.length; ++j) {
                        const V = R[j],
                            B = H(V) && V.name;
                        if (B === "Boolean") {
                            M = !0;
                            break;
                        } else B === "String" && (z = !1);
                    }
                else M = H(R) && R.name === "Boolean";
                ((E[0] = M), (E[1] = z), (M || Q(E, "default")) && o.push(m));
            }
        }
    const g = [l, o];
    return (ee(e) && i.set(e, g), g);
}
function hi(e) {
    return e[0] !== "$" && !qt(e);
}
const qs = (e) => e === "_" || e === "_ctx" || e === "$stable",
    Gs = (e) => (N(e) ? e.map(Ye) : [Ye(e)]),
    Do = (e, t, n) => {
        if (t._n) return t;
        const i = Ks((...s) => Gs(t(...s)), n);
        return ((i._c = !1), i);
    },
    Lr = (e, t, n) => {
        const i = e._ctx;
        for (const s in e) {
            if (qs(s)) continue;
            const r = e[s];
            if (H(r)) t[s] = Do(s, r, i);
            else if (r != null) {
                const l = Gs(r);
                t[s] = () => l;
            }
        }
    },
    Dr = (e, t) => {
        const n = Gs(t);
        e.slots.default = () => n;
    },
    Vr = (e, t, n) => {
        for (const i in t) (n || !qs(i)) && (e[i] = t[i]);
    },
    Vo = (e, t, n) => {
        const i = (e.slots = Rr());
        if (e.vnode.shapeFlag & 32) {
            const s = t._;
            s ? (Vr(i, t, n), n && Ki(i, "_", s, !0)) : Lr(t, i);
        } else t && Dr(e, t);
    },
    Ho = (e, t, n) => {
        const { vnode: i, slots: s } = e;
        let r = !0,
            l = ie;
        if (i.shapeFlag & 32) {
            const o = t._;
            (o ? (n && o === 1 ? (r = !1) : Vr(s, t, n)) : ((r = !t.$stable), Lr(t, s)), (l = t));
        } else t && (Dr(e, t), (l = { default: 1 }));
        if (r) for (const o in s) !qs(o) && l[o] == null && delete s[o];
    },
    Ee = zo;
function jo(e) {
    return Bo(e);
}
function Bo(e, t) {
    const n = zn();
    n.__VUE__ = !0;
    const {
            insert: i,
            remove: s,
            patchProp: r,
            createElement: l,
            createText: o,
            createComment: u,
            setText: g,
            setElementText: d,
            parentNode: m,
            nextSibling: x,
            setScopeId: E = Qe,
            insertStaticContent: R,
        } = e,
        M = (c, p, y, S = null, b = null, _ = null, T = void 0, v = null, a = !!p.dynamicChildren) => {
            if (c === p) return;
            (c && !Ct(c, p) && ((S = Pt(c)), Ae(c, b, _, !0), (c = null)),
                p.patchFlag === -2 && ((a = !1), (p.dynamicChildren = null)),
                p.dynamicChildren &&
                    c &&
                    c.dynamicChildren &&
                    c.dynamicChildren.hasOnce &&
                    (p.dynamicChildren === At && (p.dynamicChildren = []), (p.dynamicChildren.hasOnce = !0)));
            const { type: f, ref: w, shapeFlag: C } = p;
            switch (f) {
                case Qn:
                    z(c, p, y, S);
                    break;
                case Se:
                    j(c, p, y, S);
                    break;
                case En:
                    c == null && V(p, y, S, T);
                    break;
                case oe:
                    A(c, p, y, S, b, _, T, v, a);
                    break;
                default:
                    C & 1
                        ? K(c, p, y, S, b, _, T, v, a)
                        : C & 6
                          ? Z(c, p, y, S, b, _, T, v, a)
                          : (C & 64 || C & 128) && f.process(c, p, y, S, b, _, T, v, a, bt);
            }
            w != null && b
                ? Yt(w, c && c.ref, _, p || c, !p)
                : w == null && c && c.ref != null && Yt(c.ref, null, _, c, !0);
        },
        z = (c, p, y, S) => {
            if (c == null) i((p.el = o(p.children)), y, S);
            else {
                const b = (p.el = c.el);
                p.children !== c.children && g(b, p.children);
            }
        },
        j = (c, p, y, S) => {
            c == null ? i((p.el = u(p.children || "")), y, S) : (p.el = c.el);
        },
        V = (c, p, y, S) => {
            [c.el, c.anchor] = R(c.children, p, y, S, c.el, c.anchor);
        },
        B = ({ el: c, anchor: p }, y, S) => {
            let b;
            for (; c && c !== p; ) ((b = x(c)), i(c, y, S), (c = b));
            i(p, y, S);
        },
        O = ({ el: c, anchor: p }) => {
            let y;
            for (; c && c !== p; ) ((y = x(c)), s(c), (c = y));
            s(p);
        },
        K = (c, p, y, S, b, _, T, v, a) => {
            if ((p.type === "svg" ? (T = "svg") : p.type === "math" && (T = "mathml"), c == null))
                J(p, y, S, b, _, T, v, a);
            else {
                const f = c.el && c.el._isVueCE ? c.el : null;
                try {
                    (f && f._beginPatch(), F(c, p, b, _, T, v, a));
                } finally {
                    f && f._endPatch();
                }
            }
        },
        J = (c, p, y, S, b, _, T, v) => {
            let a, f;
            const { props: w, shapeFlag: C, transition: I, dirs: L } = c;
            if (
                ((a = c.el = l(c.type, _, w && w.is, w)),
                C & 8 ? d(a, c.children) : C & 16 && ye(c.children, a, null, S, b, cs(c, _), T, v),
                L && _t(c, null, S, "created"),
                de(a, c, c.scopeId, T, S),
                w)
            ) {
                for (const se in w) se !== "value" && !qt(se) && r(a, se, null, w[se], _, S);
                ("value" in w && r(a, "value", null, w.value, _), (f = w.onVnodeBeforeMount) && We(f, S, c));
            }
            L && _t(c, null, S, "beforeMount");
            const q = Uo(b, I);
            (q && I.beforeEnter(a),
                i(a, p, y),
                ((f = w && w.onVnodeMounted) || q || L) &&
                    Ee(() => {
                        (f && We(f, S, c), q && I.enter(a), L && _t(c, null, S, "mounted"));
                    }, b));
        },
        de = (c, p, y, S, b) => {
            if ((y && E(c, y), S)) for (let _ = 0; _ < S.length; _++) E(c, S[_]);
            if (b) {
                let _ = b.subTree;
                if (p === _ || (Br(_.type) && (_.ssContent === p || _.ssFallback === p))) {
                    const T = b.vnode;
                    de(c, T, T.scopeId, T.slotScopeIds, b.parent);
                }
            }
        },
        ye = (c, p, y, S, b, _, T, v, a = 0) => {
            for (let f = a; f < c.length; f++) {
                const w = (c[f] = v ? ot(c[f]) : Ye(c[f]));
                M(null, w, p, y, S, b, _, T, v);
            }
        },
        F = (c, p, y, S, b, _, T) => {
            const v = (p.el = c.el);
            let { patchFlag: a, dynamicChildren: f, dirs: w } = p;
            a |= c.patchFlag & 16;
            const C = c.props || ie,
                I = p.props || ie;
            let L;
            if (
                (y && St(y, !1),
                (L = I.onVnodeBeforeUpdate) && We(L, y, p, c),
                w && _t(p, c, y, "beforeUpdate"),
                y && St(y, !0),
                f && (!c.dynamicChildren || c.dynamicChildren.length !== f.length) && ((a = 0), (T = !1), (f = null)),
                ((C.innerHTML && I.innerHTML == null) || (C.textContent && I.textContent == null)) && d(v, ""),
                f ? W(c.dynamicChildren, f, v, y, S, cs(p, b), _) : T || te(c, p, v, null, y, S, cs(p, b), _, !1),
                a > 0)
            ) {
                if (a & 16) Y(v, C, I, y, b);
                else if (
                    (a & 2 && C.class !== I.class && r(v, "class", null, I.class, b),
                    a & 4 && r(v, "style", C.style, I.style, b),
                    a & 8)
                ) {
                    const q = p.dynamicProps;
                    for (let se = 0; se < q.length; se++) {
                        const ne = q[se],
                            ce = C[ne],
                            ve = I[ne];
                        (ve !== ce || ne === "value") && r(v, ne, ce, ve, b, y);
                    }
                }
                a & 1 && c.children !== p.children && d(v, p.children);
            } else !T && f == null && Y(v, C, I, y, b);
            ((L = I.onVnodeUpdated) || w) &&
                Ee(() => {
                    (L && We(L, y, p, c), w && _t(p, c, y, "updated"));
                }, S);
        },
        W = (c, p, y, S, b, _, T) => {
            for (let v = 0; v < p.length; v++) {
                const a = c[v],
                    f = p[v],
                    w = a.el || Ms(a),
                    C = w && (a.type === oe || !Ct(a, f) || a.shapeFlag & 198) ? m(w) : y;
                M(a, f, C, null, S, b, _, T, !0);
            }
        },
        Y = (c, p, y, S, b) => {
            if (p !== y) {
                if (p !== ie) for (const _ in p) !qt(_) && !(_ in y) && r(c, _, p[_], null, b, S);
                for (const _ in y) {
                    if (qt(_)) continue;
                    const T = y[_],
                        v = p[_];
                    T !== v && _ !== "value" && r(c, _, v, T, b, S);
                }
                "value" in y && r(c, "value", p.value, y.value, b);
            }
        },
        A = (c, p, y, S, b, _, T, v, a) => {
            const f = (p.el = c ? c.el : o("")),
                w = (p.anchor = c ? c.anchor : o(""));
            let { patchFlag: C, dynamicChildren: I, slotScopeIds: L } = p;
            (L && (v = v ? v.concat(L) : L),
                c == null
                    ? (i(f, y, S), i(w, y, S), ye(p.children || [], y, w, b, _, T, v, a))
                    : C > 0 && C & 64 && I && c.dynamicChildren && c.dynamicChildren.length === I.length
                      ? (W(c.dynamicChildren, I, y, b, _, T, v),
                        (p.key != null || (b && p === b.subTree)) && Hr(c, p, !0))
                      : te(c, p, y, w, b, _, T, v, a));
        },
        Z = (c, p, y, S, b, _, T, v, a) => {
            ((p.slotScopeIds = v),
                c == null
                    ? p.shapeFlag & 512
                        ? b.ctx.activate(p, y, S, T, a)
                        : pe(p, y, S, b, _, T, a)
                    : Ne(c, p, a));
        },
        pe = (c, p, y, S, b, _, T) => {
            const v = (c.component = Xo(c, S, b));
            if ((Jn(c) && (v.ctx.renderer = bt), Qo(v, !1, T), v.asyncDep)) {
                if ((b && b.registerDep(v, ue, T, _), !c.el)) {
                    const a = (v.subTree = k(Se));
                    (j(null, a, p, y), (c.placeholder = a.el));
                }
            } else ue(v, c, p, y, b, _, T);
        },
        Ne = (c, p, y) => {
            const S = (p.component = c.component);
            if (Ro(c, p, y))
                if (S.asyncDep && !S.asyncResolved) {
                    ((p.el = c.el), (p.placeholder = c.placeholder), le(S, p, y));
                    return;
                } else ((S.next = p), S.update());
            else ((p.el = c.el), (p.placeholder = c.placeholder), (S.vnode = p));
        },
        ue = (c, p, y, S, b, _, T) => {
            const v = () => {
                if (c.isMounted) {
                    let { next: C, bu: I, u: L, parent: q, vnode: se } = c;
                    {
                        const Ke = jr(c);
                        if (Ke) {
                            (C && ((C.el = se.el), le(c, C, T)),
                                Ke.asyncDep.then(() => {
                                    Ee(() => {
                                        c.isUnmounted || f();
                                    }, b);
                                }));
                            return;
                        }
                    }
                    let ne = C,
                        ce;
                    (St(c, !1),
                        C ? ((C.el = se.el), le(c, C, T)) : (C = se),
                        I && Tn(I),
                        (ce = C.props && C.props.onVnodeBeforeUpdate) && We(ce, q, C, se),
                        St(c, !0));
                    const ve = di(c),
                        Ue = c.subTree;
                    ((c.subTree = ve),
                        M(Ue, ve, m(Ue.el), Pt(Ue), c, b, _),
                        (C.el = ve.el),
                        ne === null && Po(c, ve.el),
                        L && Ee(L, b),
                        (ce = C.props && C.props.onVnodeUpdated) && Ee(() => We(ce, q, C, se), b));
                } else {
                    let C;
                    const { el: I, props: L } = p,
                        { bm: q, m: se, parent: ne, root: ce, type: ve } = c,
                        Ue = Xt(p);
                    (St(c, !1), q && Tn(q), !Ue && (C = L && L.onVnodeBeforeMount) && We(C, ne, p), St(c, !0));
                    {
                        ce.ce &&
                            ce.ce._hasShadowRoot() &&
                            ce.ce._injectChildStyle(ve, c.parent ? c.parent.type : void 0);
                        const Ke = (c.subTree = di(c));
                        (M(null, Ke, y, S, c, b, _), (p.el = Ke.el));
                    }
                    if ((se && Ee(se, b), !Ue && (C = L && L.onVnodeMounted))) {
                        const Ke = p;
                        Ee(() => We(C, ne, Ke), b);
                    }
                    ((p.shapeFlag & 256 || (ne && Xt(ne.vnode) && ne.vnode.shapeFlag & 256)) && c.a && Ee(c.a, b),
                        (c.isMounted = !0),
                        (p = y = S = null));
                }
            };
            c.scope.on();
            const a = (c.effect = new Gi(v));
            c.scope.off();
            const f = (c.update = a.run.bind(a)),
                w = (c.job = a.runIfDirty.bind(a));
            ((w.i = c), (w.id = c.uid), (a.scheduler = () => Us(w)), St(c, !0), f());
        },
        le = (c, p, y) => {
            p.component = c;
            const S = c.vnode.props;
            ((c.vnode = p), (c.next = null), Fo(c, p.props, S, y), Ho(c, p.children, y), et(), pr(c), tt());
        },
        te = (c, p, y, S, b, _, T, v, a = !1) => {
            const f = c && c.children,
                w = c ? c.shapeFlag : 0,
                C = p.children,
                { patchFlag: I, shapeFlag: L } = p;
            if (I > 0) {
                if (I & 128) {
                    Rt(f, C, y, S, b, _, T, v, a);
                    return;
                } else if (I & 256) {
                    Re(f, C, y, S, b, _, T, v, a);
                    return;
                }
            }
            L & 8
                ? (w & 16 && Pe(f, b, _), C !== f && d(y, C))
                : w & 16
                  ? L & 16
                      ? Rt(f, C, y, S, b, _, T, v, a)
                      : Pe(f, b, _, !0)
                  : (w & 8 && d(y, ""), L & 16 && ye(C, y, S, b, _, T, v, a));
        },
        Re = (c, p, y, S, b, _, T, v, a) => {
            ((c = c || At), (p = p || At));
            const f = c.length,
                w = p.length,
                C = Math.min(f, w);
            let I;
            for (I = 0; I < C; I++) {
                const L = (p[I] = a ? ot(p[I]) : Ye(p[I]));
                M(c[I], L, y, null, b, _, T, v, a);
            }
            f > w ? Pe(c, b, _, !0, !1, C) : ye(p, y, S, b, _, T, v, a, C);
        },
        Rt = (c, p, y, S, b, _, T, v, a) => {
            let f = 0;
            const w = p.length;
            let C = c.length - 1,
                I = w - 1;
            for (; f <= C && f <= I; ) {
                const L = c[f],
                    q = (p[f] = a ? ot(p[f]) : Ye(p[f]));
                if (Ct(L, q)) M(L, q, y, null, b, _, T, v, a);
                else break;
                f++;
            }
            for (; f <= C && f <= I; ) {
                const L = c[C],
                    q = (p[I] = a ? ot(p[I]) : Ye(p[I]));
                if (Ct(L, q)) M(L, q, y, null, b, _, T, v, a);
                else break;
                (C--, I--);
            }
            if (f > C) {
                if (f <= I) {
                    const L = I + 1,
                        q = L < w ? p[L].el : S;
                    for (; f <= I; ) (M(null, (p[f] = a ? ot(p[f]) : Ye(p[f])), y, q, b, _, T, v, a), f++);
                }
            } else if (f > I) for (; f <= C; ) (Ae(c[f], b, _, !0), f++);
            else {
                const L = f,
                    q = f,
                    se = new Map();
                for (f = q; f <= I; f++) {
                    const Me = (p[f] = a ? ot(p[f]) : Ye(p[f]));
                    Me.key != null && se.set(Me.key, f);
                }
                let ne,
                    ce = 0;
                const ve = I - q + 1;
                let Ue = !1,
                    Ke = 0;
                const jt = new Array(ve);
                for (f = 0; f < ve; f++) jt[f] = 0;
                for (f = L; f <= C; f++) {
                    const Me = c[f];
                    if (ce >= ve) {
                        Ae(Me, b, _, !0);
                        continue;
                    }
                    let ze;
                    if (Me.key != null) ze = se.get(Me.key);
                    else
                        for (ne = q; ne <= I; ne++)
                            if (jt[ne - q] === 0 && Ct(Me, p[ne])) {
                                ze = ne;
                                break;
                            }
                    ze === void 0
                        ? Ae(Me, b, _, !0)
                        : ((jt[ze - q] = f + 1),
                          ze >= Ke ? (Ke = ze) : (Ue = !0),
                          M(Me, p[ze], y, null, b, _, T, v, a),
                          ce++);
                }
                const Js = Ue ? Ko(jt) : At;
                for (ne = Js.length - 1, f = ve - 1; f >= 0; f--) {
                    const Me = q + f,
                        ze = p[Me],
                        Ys = p[Me + 1],
                        Xs = Me + 1 < w ? Ys.el || Ms(Ys) : S;
                    jt[f] === 0
                        ? M(null, ze, y, Xs, b, _, T, v, a)
                        : Ue && (ne < 0 || f !== Js[ne] ? st(ze, y, Xs, 2) : ne--);
                }
            }
        },
        st = (c, p, y, S, b = null) => {
            const { el: _, type: T, transition: v, children: a, shapeFlag: f } = c;
            if (f & 6) {
                st(c.component.subTree, p, y, S);
                return;
            }
            if (f & 128) {
                c.suspense.move(p, y, S);
                return;
            }
            if (f & 64) {
                T.move(c, p, y, bt);
                return;
            }
            if (T === oe) {
                i(_, p, y);
                for (let C = 0; C < a.length; C++) st(a[C], p, y, S);
                i(c.anchor, p, y);
                return;
            }
            if (T === En) {
                B(c, p, y);
                return;
            }
            if (S !== 2 && f & 1 && v)
                if (S === 0)
                    v.persisted && !_[Le] ? i(_, p, y) : (v.beforeEnter(_), i(_, p, y), Ee(() => v.enter(_), b));
                else {
                    const { leave: C, delayLeave: I, afterLeave: L } = v,
                        q = () => {
                            c.ctx.isUnmounted ? s(_) : i(_, p, y);
                        },
                        se = () => {
                            const ne = _._isLeaving || !!_[Le];
                            (_._isLeaving && _[Le](!0),
                                v.persisted && !ne
                                    ? q()
                                    : C(_, () => {
                                          (q(), L && L());
                                      }));
                        };
                    I ? I(_, q, se) : se();
                }
            else i(_, p, y);
        },
        Ae = (c, p, y, S = !1, b = !1) => {
            const {
                type: _,
                props: T,
                ref: v,
                children: a,
                dynamicChildren: f,
                shapeFlag: w,
                patchFlag: C,
                dirs: I,
                cacheIndex: L,
                memo: q,
            } = c;
            if (
                ((C === -2 || (f && f.hasOnce)) && (b = !1),
                v != null && (et(), Yt(v, null, y, c, !0), tt()),
                L != null && (!c.ctx || c.ctx === p) && (p.renderCache[L] = void 0),
                w & 256)
            ) {
                p.ctx.deactivate(c);
                return;
            }
            const se = w & 1 && I,
                ne = !Xt(c);
            let ce;
            if ((ne && (ce = T && T.onVnodeBeforeUnmount) && We(ce, p, c), w & 6)) ft(c.component, y, S);
            else {
                if (w & 128) {
                    c.suspense.unmount(y, S);
                    return;
                }
                (se && _t(c, null, p, "beforeUnmount"),
                    w & 64
                        ? c.type.remove(c, p, y, bt, S)
                        : f && !f.hasOnce && (_ !== oe || (C > 0 && C & 64))
                          ? Pe(f, p, y, !1, !0)
                          : ((_ === oe && C & 384) || (!b && w & 16)) && Pe(a, p, y),
                    S && hn(c));
            }
            const ve = q != null && L == null;
            ((ne && (ce = T && T.onVnodeUnmounted)) || se || ve) &&
                Ee(() => {
                    (ce && We(ce, p, c), se && _t(c, null, p, "unmounted"), ve && (c.el = null));
                }, y);
        },
        hn = (c) => {
            const { type: p, el: y, anchor: S, transition: b } = c,
                _ = p === oe;
            if (_ && !b) {
                gn(y, S);
                return;
            }
            if (p === En) {
                (O(c), b && !b.persisted && b.afterLeave && b.afterLeave());
                return;
            }
            const T = _ ? sn(c) : c,
                v = () => {
                    (_ ? m(y) && gn(y, S) : s(y), b && !b.persisted && b.afterLeave && b.afterLeave());
                };
            if (T && T.shapeFlag & 1 && b && !b.persisted) {
                const { leave: a, delayLeave: f } = b,
                    w = T.el,
                    C = () => a(w, v);
                f ? f(w, v, C) : C();
            } else v();
        },
        gn = (c, p) => {
            let y;
            for (; c !== p; ) ((y = x(c)), s(c), (c = y));
            s(p);
        },
        ft = (c, p, y) => {
            const { bum: S, scope: b, job: _, subTree: T, um: v, m: a, a: f } = c;
            (gi(a),
                gi(f),
                S && Tn(S),
                b.stop(),
                _
                    ? ((_.flags |= 8), Ae(T, c, p, y))
                    : c.vnode.el && T && ((T.transition = c.vnode.transition), Ae(T, c, p, y)),
                v && Ee(v, p),
                Ee(() => {
                    c.isUnmounted = !0;
                }, p));
        },
        Pe = (c, p, y, S = !1, b = !1, _ = 0) => {
            for (let T = _; T < c.length; T++) Ae(c[T], p, y, S, b);
        },
        Pt = (c) => {
            if (c.shapeFlag & 6) return Pt(c.component.subTree);
            if (c.shapeFlag & 128) return c.suspense.next();
            const p = x(c.anchor || c.el),
                y = p && p[to];
            return y ? x(y) : p;
        },
        vn = (c, p, y) => {
            const S = c && p._vnode ? void 0 : c && c.component ? c.component.uid : Yo();
            Yl(() => {
                (c == null ? p._vnode && Ae(p._vnode, null, null, !0) : M(p._vnode || null, c, p, null, null, null, y),
                    (p._vnode = c));
            }, S);
        },
        bt = { p: M, um: Ae, m: st, r: hn, mt: pe, mc: ye, pc: te, pbc: W, n: Pt, o: e };
    return { render: vn, hydrate: void 0, createApp: Ao(vn) };
}
function cs({ type: e, props: t }, n) {
    return (n === "svg" && e === "foreignObject") ||
        (n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html"))
        ? void 0
        : n;
}
function St({ effect: e, job: t }, n) {
    n ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function Uo(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Hr(e, t, n = !1) {
    const i = e.children,
        s = t.children;
    if (N(i) && N(s))
        for (let r = 0; r < i.length; r++) {
            const l = i[r];
            let o = s[r];
            (o.shapeFlag & 1 &&
                !o.dynamicChildren &&
                ((o.patchFlag <= 0 || o.patchFlag === 32) && ((o = s[r] = ot(s[r])), (o.el = l.el)),
                !n && o.patchFlag !== -2 && Hr(l, o)),
                o.type === Qn && (o.patchFlag === -1 && (o = s[r] = ot(o)), (o.el = l.el)),
                o.type === Se && !o.el && (o.el = l.el));
        }
}
function Ko(e) {
    const t = e.slice(),
        n = [0];
    let i, s, r, l, o;
    const u = e.length;
    for (i = 0; i < u; i++) {
        const g = e[i];
        if (g !== 0) {
            if (((s = n[n.length - 1]), e[s] < g)) {
                ((t[i] = s), n.push(i));
                continue;
            }
            for (r = 0, l = n.length - 1; r < l; ) ((o = (r + l) >> 1), e[n[o]] < g ? (r = o + 1) : (l = o));
            g < e[n[r]] && (r > 0 && (t[i] = n[r - 1]), (n[r] = i));
        }
    }
    for (r = n.length, l = n[r - 1]; r-- > 0; ) ((n[r] = l), (l = t[l]));
    return n;
}
function jr(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : jr(t);
}
function gi(e) {
    if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ms(e) {
    if (e.placeholder) return e.placeholder;
    const t = e.component;
    return t ? Ms(t.subTree) : null;
}
const Br = (e) => e.__isSuspense;
function zo(e, t) {
    t && t.pendingBranch ? (N(e) ? t.effects.push(...e) : t.effects.push(e)) : Jl(e);
}
const oe = Symbol.for("v-fgt"),
    Qn = Symbol.for("v-txt"),
    Se = Symbol.for("v-cmt"),
    En = Symbol.for("v-stc"),
    It = [];
let ke = null;
function P(e = !1) {
    It.push((ke = e ? null : []));
}
function Ur() {
    (It.pop(), (ke = It[It.length - 1] || null));
}
let rn = 1;
function Pn(e, t = !1) {
    ((rn += e), e < 0 && ke && t && (ke.hasOnce = !0));
}
function Kr(e) {
    return ((e.dynamicChildren = rn > 0 ? ke || At : null), Ur(), rn > 0 && ke && ke.push(e), e);
}
function D(e, t, n, i, s, r) {
    return Kr(h(e, t, n, i, s, r, !0));
}
function Zt(e, t, n, i, s) {
    return Kr(k(e, t, n, i, s, !0));
}
function ln(e) {
    return e ? e.__v_isVNode === !0 : !1;
}
function Ct(e, t) {
    return e.type === t.type && e.key === t.key;
}
const zr = ({ key: e }) => e ?? null,
    An = ({ ref: e, ref_key: t, ref_for: n }) => (
        typeof e == "number" && (e = "" + e),
        e != null ? (ae(e) || xe(e) || H(e) ? { i: Ie, r: e, k: t, f: !!n } : e) : null
    );
function h(e, t = null, n = null, i = 0, s = null, r = e === oe ? 0 : 1, l = !1, o = !1) {
    const u = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && zr(t),
        ref: t && An(t),
        scopeId: vr,
        slotScopeIds: null,
        children: n,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetStart: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag: r,
        patchFlag: i,
        dynamicProps: s,
        dynamicChildren: null,
        appContext: null,
        ctx: Ie,
    };
    return (
        o ? ($n(u, n), r & 128 && e.normalize(u)) : n && (u.shapeFlag |= ae(n) ? 8 : 16),
        rn > 0 && !l && ke && (u.patchFlag > 0 || r & 6) && u.patchFlag !== 32 && ke.push(u),
        u
    );
}
const k = Wo;
function Wo(e, t = null, n = null, i = 0, s = null, r = !1) {
    if (((!e || e === mo) && (e = Se), ln(e))) {
        const o = yt(e, t, !0);
        return (
            n && $n(o, n),
            rn > 0 && !r && ke && (o.shapeFlag & 6 ? (ke[ke.indexOf(e)] = o) : ke.push(o)),
            (o.patchFlag = -2),
            o
        );
    }
    if ((sa(e) && (e = e.__vccOpts), t)) {
        t = qo(t);
        let { class: o, style: u } = t;
        (o && !ae(o) && (t.class = fe(o)), ee(u) && (js(u) && !N(u) && (u = ge({}, u)), (t.style = fn(u))));
    }
    const l = ae(e) ? 1 : Br(e) ? 128 : Gn(e) ? 64 : ee(e) ? 4 : H(e) ? 2 : 0;
    return h(e, t, n, i, s, l, r, !0);
}
function qo(e) {
    return e ? (js(e) || Pr(e) ? ge({}, e) : e) : null;
}
function yt(e, t, n = !1, i = !1) {
    const { props: s, ref: r, patchFlag: l, children: o, transition: u } = e,
        g = t ? Go(s || {}, t) : s,
        d = {
            __v_isVNode: !0,
            __v_skip: !0,
            type: e.type,
            props: g,
            key: g && zr(g),
            ref: t && t.ref ? (n && r ? (N(r) ? r.concat(An(t)) : [r, An(t)]) : An(t)) : r,
            scopeId: e.scopeId,
            slotScopeIds: e.slotScopeIds,
            children: o,
            target: e.target,
            targetStart: e.targetStart,
            targetAnchor: e.targetAnchor,
            staticCount: e.staticCount,
            shapeFlag: e.shapeFlag,
            patchFlag: t && e.type !== oe ? (l === -1 ? 16 : l | 16) : l,
            dynamicProps: e.dynamicProps,
            dynamicChildren: e.dynamicChildren,
            appContext: e.appContext,
            dirs: e.dirs,
            transition: u,
            component: e.component,
            suspense: e.suspense,
            ssContent: e.ssContent && yt(e.ssContent),
            ssFallback: e.ssFallback && yt(e.ssFallback),
            placeholder: e.placeholder,
            el: e.el,
            anchor: e.anchor,
            ctx: e.ctx,
            ce: e.ce,
            cacheIndex: e.cacheIndex,
        };
    return (u && i && Ht(d, u.clone(d)), d);
}
function $(e = " ", t = 0) {
    return k(Qn, null, e, t);
}
function vi(e, t) {
    const n = k(En, null, e);
    return ((n.staticCount = t), n);
}
function Oe(e = "", t = !1) {
    return t ? (P(), Zt(Se, null, e)) : k(Se, null, e);
}
function Ye(e) {
    return e == null || typeof e == "boolean"
        ? k(Se)
        : N(e)
          ? k(oe, null, e.slice())
          : ln(e)
            ? ot(e)
            : k(Qn, null, String(e));
}
function ot(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : yt(e);
}
function $n(e, t) {
    let n = 0;
    const { shapeFlag: i } = e;
    if (t == null) t = null;
    else if (N(t)) n = 16;
    else if (typeof t == "object")
        if (i & 65) {
            const s = t.default;
            s && (s._c && (s._d = !1), $n(e, s()), s._c && (s._d = !0));
            return;
        } else {
            n = 32;
            const s = t._;
            !s && !Pr(t)
                ? (t._ctx = Ie)
                : s === 3 && Ie && (Ie.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
        }
    else if (H(t)) {
        if (i & 65) {
            $n(e, { default: t });
            return;
        }
        ((t = { default: t, _ctx: Ie }), (n = 32));
    } else ((t = String(t)), i & 64 ? ((n = 16), (t = [$(t)])) : (n = 8));
    ((e.children = t), (e.shapeFlag |= n));
}
function Go(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
        const i = e[n];
        for (const s in i)
            if (s === "class") t.class !== i.class && (t.class = fe([t.class, i.class]));
            else if (s === "style") t.style = fn([t.style, i.style]);
            else if (Hn(s)) {
                const r = t[s],
                    l = i[s];
                l && r !== l && !(N(r) && r.includes(l))
                    ? (t[s] = r ? [].concat(r, l) : l)
                    : l == null && r == null && !jn(s) && (t[s] = l);
            } else s !== "" && (t[s] = i[s]);
    }
    return t;
}
function We(e, t, n, i = null) {
    He(e, t, 7, [n, i]);
}
const Jo = Mr();
let Wr = 0;
function Yo() {
    return Wr;
}
function Xo(e, t, n) {
    const i = e.type,
        s = (t ? t.appContext : e.appContext) || Jo,
        r = {
            uid: Wr++,
            vnode: e,
            type: i,
            parent: t,
            appContext: s,
            root: null,
            next: null,
            subTree: null,
            effect: null,
            update: null,
            job: null,
            scope: new _l(!0),
            render: null,
            proxy: null,
            exposed: null,
            exposeProxy: null,
            withProxy: null,
            provides: t ? t.provides : Object.create(s.provides),
            ids: t ? t.ids : ["", 0, 0],
            accessCache: null,
            renderCache: [],
            components: null,
            directives: null,
            propsOptions: Fr(i, s),
            emitsOptions: Or(i, s),
            emit: null,
            emitted: null,
            propsDefaults: ie,
            inheritAttrs: i.inheritAttrs,
            ctx: ie,
            data: ie,
            props: ie,
            attrs: ie,
            slots: ie,
            refs: ie,
            setupState: ie,
            setupContext: null,
            suspense: n,
            suspenseId: n ? n.pendingId : 0,
            asyncDep: null,
            asyncResolved: !1,
            isMounted: !1,
            isUnmounted: !1,
            isDeactivated: !1,
            bc: null,
            c: null,
            bm: null,
            m: null,
            bu: null,
            u: null,
            um: null,
            bum: null,
            da: null,
            a: null,
            rtg: null,
            rtc: null,
            ec: null,
            sp: null,
        };
    return ((r.ctx = { _: r }), (r.root = t ? t.root : r), (r.emit = Oo.bind(null, r)), e.ce && e.ce(r), r);
}
let _e = null;
const qr = () => _e || Ie;
let Fn, on;
{
    const e = zn(),
        t = (n, i) => {
            let s;
            return (
                (s = e[n]) || (s = e[n] = []),
                s.push(i),
                (r) => {
                    s.length > 1 ? s.forEach((l) => l(r)) : s[0](r);
                }
            );
        };
    ((Fn = t("__VUE_INSTANCE_SETTERS__", (n) => (_e = n))), (on = t("__VUE_SSR_SETTERS__", (n) => (an = n))));
}
const pn = (e) => {
        const t = _e;
        return (
            Fn(e),
            e.scope.on(),
            () => {
                (e.scope.off(), Fn(t));
            }
        );
    },
    mi = () => {
        (_e && _e.scope.off(), Fn(null));
    };
function Gr(e) {
    return e.vnode.shapeFlag & 4;
}
let an = !1;
function Qo(e, t = !1, n = !1) {
    t && on(t);
    const { props: i, children: s } = e.vnode,
        r = Gr(e);
    ($o(e, i, r, t), Vo(e, s, n || t));
    const l = r ? Zo(e, t) : void 0;
    return (t && on(!1), l);
}
function Zo(e, t) {
    const n = e.type;
    ((e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, _o)));
    const { setup: i } = n;
    if (i) {
        et();
        const s = (e.setupContext = i.length > 1 ? ta(e) : null),
            r = pn(e),
            l = dn(i, e, 0, [e.props, s]),
            o = ji(l);
        if ((tt(), r(), (o || e.sp) && !Xt(e) && wr(e), o)) {
            if ((l.then(mi, mi), t))
                return l
                    .then((u) => {
                        on(!0);
                        try {
                            yi(e, u, t);
                        } finally {
                            on(!1);
                        }
                    })
                    .catch((u) => {
                        qn(u, e, 0);
                    });
            e.asyncDep = l;
        } else yi(e, l);
    } else Jr(e);
}
function yi(e, t, n) {
    (H(t) ? (e.type.__ssrInlineRender ? (e.ssrRender = t) : (e.render = t)) : ee(t) && (e.setupState = cr(t)), Jr(e));
}
function Jr(e, t, n) {
    const i = e.type;
    e.render || (e.render = i.render || Qe);
    {
        const s = pn(e);
        et();
        try {
            So(e);
        } finally {
            (tt(), s());
        }
    }
}
const ea = {
    get(e, t) {
        return (be(e, "get", ""), e[t]);
    },
};
function ta(e) {
    const t = (n) => {
        e.exposed = n || {};
    };
    return { attrs: new Proxy(e.attrs, ea), slots: e.slots, emit: e.emit, expose: t };
}
function Zn(e) {
    return e.exposed
        ? e.exposeProxy ||
              (e.exposeProxy = new Proxy(cr(Vl(e.exposed)), {
                  get(t, n) {
                      if (n in t) return t[n];
                      if (n in Qt) return Qt[n](e);
                  },
                  has(t, n) {
                      return n in t || n in Qt;
                  },
              }))
        : e.proxy;
}
function na(e, t = !0) {
    return H(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function sa(e) {
    return H(e) && "__vccOpts" in e;
}
const he = (e, t) => Kl(e, t, an);
function ia(e, t, n) {
    try {
        Pn(-1);
        const i = arguments.length;
        return i === 2
            ? ee(t) && !N(t)
                ? ln(t)
                    ? k(e, null, [t])
                    : k(e, t)
                : k(e, null, t)
            : (i > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : i === 3 && ln(n) && (n = [n]), k(e, t, n));
    } finally {
        Pn(1);
    }
}
const ra = "3.5.44";
let Os;
const bi = typeof window < "u" && window.trustedTypes;
if (bi)
    try {
        Os = bi.createPolicy("vue", { createHTML: (e) => e });
    } catch {}
const Yr = Os ? (e) => Os.createHTML(e) : (e) => e,
    la = "http://www.w3.org/2000/svg",
    oa = "http://www.w3.org/1998/Math/MathML",
    lt = typeof document < "u" ? document : null,
    _i = lt && lt.createElement("template"),
    aa = {
        insert: (e, t, n) => {
            t.insertBefore(e, n || null);
        },
        remove: (e) => {
            const t = e.parentNode;
            t && t.removeChild(e);
        },
        createElement: (e, t, n, i) => {
            const s =
                t === "svg"
                    ? lt.createElementNS(la, e)
                    : t === "mathml"
                      ? lt.createElementNS(oa, e)
                      : n
                        ? lt.createElement(e, { is: n })
                        : lt.createElement(e);
            return (e === "select" && i && i.multiple != null && s.setAttribute("multiple", i.multiple), s);
        },
        createText: (e) => lt.createTextNode(e),
        createComment: (e) => lt.createComment(e),
        setText: (e, t) => {
            e.nodeValue = t;
        },
        setElementText: (e, t) => {
            e.textContent = t;
        },
        parentNode: (e) => e.parentNode,
        nextSibling: (e) => e.nextSibling,
        querySelector: (e) => lt.querySelector(e),
        setScopeId(e, t) {
            e.setAttribute(t, "");
        },
        insertStaticContent(e, t, n, i, s, r) {
            const l = n ? n.previousSibling : t.lastChild;
            if (s && (s === r || s.nextSibling))
                for (; t.insertBefore(s.cloneNode(!0), n), !(s === r || !(s = s.nextSibling)); );
            else {
                _i.innerHTML = Yr(i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e);
                const o = _i.content;
                if (i === "svg" || i === "mathml") {
                    const u = o.firstChild;
                    for (; u.firstChild; ) o.appendChild(u.firstChild);
                    o.removeChild(u);
                }
                t.insertBefore(o, n);
            }
            return [l ? l.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
        },
    },
    dt = "transition",
    Kt = "animation",
    un = Symbol("_vtc"),
    Xr = {
        name: String,
        type: String,
        css: { type: Boolean, default: !0 },
        duration: [String, Number, Object],
        enterFromClass: String,
        enterActiveClass: String,
        enterToClass: String,
        appearFromClass: String,
        appearActiveClass: String,
        appearToClass: String,
        leaveFromClass: String,
        leaveActiveClass: String,
        leaveToClass: String,
    },
    ua = ge({}, br, Xr),
    ca = (e) => ((e.displayName = "Transition"), (e.props = ua), e),
    fa = ca((e, { slots: t }) => ia(io, da(e), t)),
    xt = (e, t = []) => {
        N(e) ? e.forEach((n) => n(...t)) : e && e(...t);
    },
    Si = (e) => (e ? (N(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function da(e) {
    const t = {};
    for (const A in e) A in Xr || (t[A] = e[A]);
    if (e.css === !1) return t;
    const {
            name: n = "v",
            type: i,
            duration: s,
            enterFromClass: r = `${n}-enter-from`,
            enterActiveClass: l = `${n}-enter-active`,
            enterToClass: o = `${n}-enter-to`,
            appearFromClass: u = r,
            appearActiveClass: g = l,
            appearToClass: d = o,
            leaveFromClass: m = `${n}-leave-from`,
            leaveActiveClass: x = `${n}-leave-active`,
            leaveToClass: E = `${n}-leave-to`,
        } = e,
        R = pa(s),
        M = R && R[0],
        z = R && R[1],
        {
            onBeforeEnter: j,
            onEnter: V,
            onEnterCancelled: B,
            onLeave: O,
            onLeaveCancelled: K,
            onBeforeAppear: J = j,
            onAppear: de = V,
            onAppearCancelled: ye = B,
        } = t,
        F = (A, Z, pe, Ne) => {
            ((A._enterCancelled = Ne), wt(A, Z ? d : o), wt(A, Z ? g : l), pe && pe());
        },
        W = (A, Z) => {
            ((A._isLeaving = !1), wt(A, m), wt(A, E), wt(A, x), Z && Z());
        },
        Y = (A) => (Z, pe) => {
            const Ne = A ? de : V,
                ue = () => F(Z, A, pe);
            (xt(Ne, [Z, ue]),
                xi(() => {
                    (wt(Z, A ? u : r), rt(Z, A ? d : o), Si(Ne) || wi(Z, i, M, ue));
                }));
        };
    return ge(t, {
        onBeforeEnter(A) {
            (xt(j, [A]), rt(A, r), rt(A, l));
        },
        onBeforeAppear(A) {
            (xt(J, [A]), rt(A, u), rt(A, g));
        },
        onEnter: Y(!1),
        onAppear: Y(!0),
        onLeave(A, Z) {
            A._isLeaving = !0;
            const pe = () => W(A, Z);
            (rt(A, m),
                A._enterCancelled ? (rt(A, x), Ei(A)) : (Ei(A), rt(A, x)),
                xi(() => {
                    A._isLeaving && (wt(A, m), rt(A, E), Si(O) || wi(A, i, z, pe));
                }),
                xt(O, [A, pe]));
        },
        onEnterCancelled(A) {
            (F(A, !1, void 0, !0), xt(B, [A]));
        },
        onAppearCancelled(A) {
            (F(A, !0, void 0, !0), xt(ye, [A]));
        },
        onLeaveCancelled(A) {
            (W(A), xt(K, [A]));
        },
    });
}
function pa(e) {
    if (e == null) return null;
    if (ee(e)) return [fs(e.enter), fs(e.leave)];
    {
        const t = fs(e);
        return [t, t];
    }
}
function fs(e) {
    return cl(e);
}
function rt(e, t) {
    (t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[un] || (e[un] = new Set())).add(t));
}
function wt(e, t) {
    t.split(/\s+/).forEach((i) => i && e.classList.remove(i));
    const n = e[un];
    n && (n.delete(t), n.size || (e[un] = void 0));
}
function xi(e) {
    requestAnimationFrame(() => {
        requestAnimationFrame(e);
    });
}
let ha = 0;
function wi(e, t, n, i) {
    const s = (e._endId = ++ha),
        r = () => {
            s === e._endId && i();
        };
    if (n != null) return setTimeout(r, n);
    const { type: l, timeout: o, propCount: u } = ga(e, t);
    if (!l) return i();
    const g = l + "end";
    let d = 0;
    const m = () => {
            (e.removeEventListener(g, x), r());
        },
        x = (E) => {
            E.target === e && ++d >= u && m();
        };
    (setTimeout(() => {
        d < u && m();
    }, o + 1),
        e.addEventListener(g, x));
}
function ga(e, t) {
    const n = window.getComputedStyle(e),
        i = (R) => (n[R] || "").split(", "),
        s = i(`${dt}Delay`),
        r = i(`${dt}Duration`),
        l = Ti(s, r),
        o = i(`${Kt}Delay`),
        u = i(`${Kt}Duration`),
        g = Ti(o, u);
    let d = null,
        m = 0,
        x = 0;
    t === dt
        ? l > 0 && ((d = dt), (m = l), (x = r.length))
        : t === Kt
          ? g > 0 && ((d = Kt), (m = g), (x = u.length))
          : ((m = Math.max(l, g)),
            (d = m > 0 ? (l > g ? dt : Kt) : null),
            (x = d ? (d === dt ? r.length : u.length) : 0));
    const E = d === dt && /\b(?:transform|all)(?:,|$)/.test(i(`${dt}Property`).toString());
    return { type: d, timeout: m, propCount: x, hasTransform: E };
}
function Ti(e, t) {
    for (; e.length < t.length; ) e = e.concat(e);
    return Math.max(...t.map((n, i) => Ci(n) + Ci(e[i])));
}
function Ci(e) {
    return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Ei(e) {
    return (e ? e.ownerDocument : document).body.offsetHeight;
}
function va(e, t, n) {
    const i = e[un];
    (i && (t = (t ? [t, ...i] : [...i]).join(" ")),
        t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : (e.className = t));
}
const Ai = Symbol("_vod"),
    ma = Symbol("_vsh"),
    ya = Symbol(""),
    ba = /(?:^|;)\s*display\s*:/;
function _a(e, t, n) {
    const i = e.style,
        s = ae(n);
    let r = !1;
    if (n && !s) {
        if (t)
            if (ae(t))
                for (const l of t.split(";")) {
                    const o = l.slice(0, l.indexOf(":")).trim();
                    n[o] == null && Wt(i, o, "");
                }
            else for (const l in t) n[l] == null && Wt(i, l, "");
        for (const l in n) {
            l === "display" && (r = !0);
            const o = n[l];
            o != null ? xa(e, l, !ae(t) && t ? t[l] : void 0, o) || Wt(i, l, o) : Wt(i, l, "");
        }
    } else if (s) {
        if (t !== n) {
            const l = i[ya];
            (l && (n += ";" + l), (i.cssText = n), (r = ba.test(n)));
        }
    } else t && e.removeAttribute("style");
    Ai in e && ((!s || t !== n) && (e[Ai] = r ? i.display : ""), e[ma] && (i.display = "none"));
}
const xn = /\s*!important$/;
function Wt(e, t, n) {
    if (N(n)) n.forEach((i) => Wt(e, t, i));
    else if ((n == null && (n = ""), t.startsWith("--")))
        xn.test(n) ? e.setProperty(t, n.replace(xn, ""), "important") : e.setProperty(t, n);
    else {
        const i = Sa(e, t);
        xn.test(n) ? e.setProperty(Nt(i), n.replace(xn, ""), "important") : (e[i] = n);
    }
}
const Mi = ["Webkit", "Moz", "ms"],
    ds = {};
function Sa(e, t) {
    const n = ds[t];
    if (n) return n;
    let i = Ce(t);
    if (i !== "filter" && i in e) return (ds[t] = i);
    i = Un(i);
    for (let s = 0; s < Mi.length; s++) {
        const r = Mi[s] + i;
        if (r in e) return (ds[t] = r);
    }
    return t;
}
function xa(e, t, n, i) {
    return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ae(i) && n === i;
}
const Oi = "http://www.w3.org/1999/xlink";
function Ii(e, t, n, i, s, r = vl(t)) {
    i && t.startsWith("xlink:")
        ? n == null
            ? e.removeAttributeNS(Oi, t.slice(6, t.length))
            : e.setAttributeNS(Oi, t, n)
        : n == null || (r && !zi(n))
          ? e.removeAttribute(t)
          : e.setAttribute(t, r ? "" : Ze(n) ? String(n) : n);
}
function ki(e, t, n, i, s) {
    if (t === "innerHTML" || t === "textContent") {
        n != null && (e[t] = t === "innerHTML" ? Yr(n) : n);
        return;
    }
    const r = e.tagName;
    if (t === "value" && r !== "PROGRESS" && !r.includes("-")) {
        const o = r === "OPTION" ? e.getAttribute("value") || "" : e.value,
            u = n == null ? (e.type === "checkbox" ? "on" : "") : String(n);
        ((o !== u || !("_value" in e)) && (e.value = u), n == null && e.removeAttribute(t), (e._value = n));
        return;
    }
    let l = !1;
    if (n === "" || n == null) {
        const o = typeof e[t];
        o === "boolean"
            ? (n = zi(n))
            : n == null && o === "string"
              ? ((n = ""), (l = !0))
              : o === "number" && ((n = 0), (l = !0));
    }
    try {
        e[t] = n;
    } catch {}
    l && e.removeAttribute(s || t);
}
function Et(e, t, n, i) {
    e.addEventListener(t, n, i);
}
function wa(e, t, n, i) {
    e.removeEventListener(t, n, i);
}
const Ni = Symbol("_vei");
function Ta(e, t, n, i, s = null) {
    const r = e[Ni] || (e[Ni] = {}),
        l = r[t];
    if (i && l) l.value = i;
    else {
        const [o, u] = Aa(t);
        if (i) {
            const g = (r[t] = Ia(i, s));
            Et(e, o, g, u);
        } else l && (wa(e, o, l, u), (r[t] = void 0));
    }
}
const Ca = /(Once|Passive|Capture)$/,
    Ea = /^on:?(?:Once|Passive|Capture)$/;
function Aa(e) {
    let t, n;
    for (; (n = e.match(Ca)) && !Ea.test(e); )
        (t || (t = {}), (e = e.slice(0, e.length - n[1].length)), (t[n[1].toLowerCase()] = !0));
    return [e[2] === ":" ? e.slice(3) : Nt(e.slice(2)), t];
}
let ps = 0;
const Ma = Promise.resolve(),
    Oa = () => ps || (Ma.then(() => (ps = 0)), (ps = Date.now()));
function Ia(e, t) {
    const n = (i) => {
        if (!i._vts) i._vts = Date.now();
        else if (i._vts <= n.attached) return;
        const s = n.value;
        if (N(s)) {
            const r = i.stopImmediatePropagation;
            i.stopImmediatePropagation = () => {
                (r.call(i), (i._stopped = !0));
            };
            const l = s.slice(),
                o = [i];
            for (let u = 0; u < l.length && !i._stopped; u++) {
                const g = l[u];
                g && He(g, t, 5, o);
            }
        } else He(s, t, 5, [i]);
    };
    return ((n.value = e), (n.attached = Oa()), n);
}
const Ri = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123,
    ka = (e, t, n, i, s, r) => {
        const l = s === "svg";
        t === "class"
            ? va(e, i, l)
            : t === "style"
              ? _a(e, n, i)
              : Hn(t)
                ? jn(t) || Ta(e, t, n, i, r)
                : (t[0] === "." ? ((t = t.slice(1)), !0) : t[0] === "^" ? ((t = t.slice(1)), !1) : Na(e, t, i, l))
                  ? (ki(e, t, i),
                    !e.tagName.includes("-") &&
                        (t === "value" || t === "checked" || t === "selected") &&
                        Ii(e, t, i, l, r, t !== "value"))
                  : e._isVueCE && (Ra(e, t) || (e._def.__asyncLoader && (/[A-Z]/.test(t) || !ae(i))))
                    ? ki(e, Ce(t), i, r, t)
                    : (t === "true-value" ? (e._trueValue = i) : t === "false-value" && (e._falseValue = i),
                      Ii(e, t, i, l));
    };
function Na(e, t, n, i) {
    if (i) return !!(t === "innerHTML" || t === "textContent" || (t in e && Ri(t) && H(n)));
    if (
        t === "spellcheck" ||
        t === "draggable" ||
        t === "translate" ||
        t === "autocorrect" ||
        (t === "sandbox" && e.tagName === "IFRAME") ||
        t === "form" ||
        (t === "list" && e.tagName === "INPUT") ||
        (t === "type" && e.tagName === "TEXTAREA")
    )
        return !1;
    if (t === "width" || t === "height") {
        const s = e.tagName;
        if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE") return !1;
    }
    return Ri(t) && ae(n) ? !1 : t in e;
}
function Ra(e, t) {
    const n = e._def.props;
    if (!n) return !1;
    const i = Ce(t);
    return Array.isArray(n) ? n.some((s) => Ce(s) === i) : Object.keys(n).some((s) => Ce(s) === i);
}
const Ln = (e) => {
    const t = e.props["onUpdate:modelValue"] || !1;
    return N(t) ? (n) => Tn(t, n) : t;
};
function Pa(e) {
    e.target.composing = !0;
}
function Pi(e) {
    const t = e.target;
    t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
}
const Mt = Symbol("_assign"),
    wn = Symbol("_initialValue");
function hs(e, t, n) {
    return (t && (e = e.trim()), n && (e = Kn(e)), e);
}
const gs = {
        created(e, { modifiers: { lazy: t, trim: n, number: i } }, s) {
            (e.parentNode &&
                (e.type === "text"
                    ? (e[wn] = e.defaultValue.replace(/[\r\n]/g, ""))
                    : e.type === "textarea" &&
                      (e[wn] = e.defaultValue.replace(
                          /\r\n?/g,
                          `
`,
                      ))),
                (e[Mt] = Ln(s)));
            const r = i || (s.props && s.props.type === "number");
            (Et(e, t ? "change" : "input", (l) => {
                l.target.composing || e[Mt](hs(e.value, n, r));
            }),
                (n || r) &&
                    Et(e, "change", () => {
                        e.value = hs(e.value, n, r);
                    }),
                t || (Et(e, "compositionstart", Pa), Et(e, "compositionend", Pi), Et(e, "change", Pi)));
        },
        mounted(e, { value: t, modifiers: { trim: n, number: i } }) {
            const s = t ?? "",
                r = e[wn];
            (delete e[wn],
                r !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== r
                    ? e[Mt](hs(e.value, n, i))
                    : (e.value = s));
        },
        beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: i, trim: s, number: r } }, l) {
            if (((e[Mt] = Ln(l)), e.composing)) return;
            const o = (r || e.type === "number") && !/^0\d/.test(e.value) ? Kn(e.value) : e.value,
                u = t ?? "";
            if (o === u) return;
            const g = e.getRootNode();
            ((g instanceof Document || g instanceof ShadowRoot) &&
                g.activeElement === e &&
                e.type !== "range" &&
                ((i && t === n) || (s && e.value.trim() === u))) ||
                (e.value = u);
        },
    },
    $a = {
        deep: !0,
        created(e, { value: t, modifiers: { number: n } }, i) {
            ((e._modelValue = t),
                Et(e, "change", () => {
                    const s = Array.prototype.filter
                            .call(e.options, (u) => u.selected)
                            .map((u) => (n ? Kn(Dn(u)) : Dn(u))),
                        r = e.multiple,
                        l = r ? (kt(e._modelValue) ? new Set(s) : s) : s[0],
                        o = (e._pendingValue = [r, r ? (N(l) ? s.slice() : s) : l]);
                    try {
                        e[Mt](l);
                    } finally {
                        Bs(() => {
                            e._pendingValue === o && (e._pendingValue = void 0);
                        });
                    }
                }),
                (e[Mt] = Ln(i)));
        },
        mounted(e, { value: t }) {
            $i(e, t);
        },
        beforeUpdate(e, { value: t }, n) {
            ((e._modelValue = t), (e[Mt] = Ln(n)));
        },
        updated(e, { value: t }) {
            const n = e._pendingValue;
            ((e._pendingValue = void 0), (!n || n[0] !== e.multiple || !Fa(t, n[1], n[0])) && $i(e, t));
        },
    };
function Fa(e, t, n) {
    if (!n || N(e)) return vt(e, t);
    if (kt(e)) {
        if (e.size !== t.length) return !1;
        for (const i of t) if (!e.has(i)) return !1;
        return !0;
    }
    return !1;
}
function $i(e, t) {
    const n = e.multiple,
        i = N(t);
    if (!(n && !i && !kt(t))) {
        for (let s = 0, r = e.options.length; s < r; s++) {
            const l = e.options[s],
                o = Dn(l);
            if (n)
                if (i) {
                    const u = typeof o;
                    u === "string" || u === "number"
                        ? (l.selected = t.some((g) => String(g) === String(o)))
                        : (l.selected = bl(t, o) > -1);
                } else l.selected = t.has(o);
            else if (vt(Dn(l), t)) {
                e.selectedIndex !== s && (e.selectedIndex = s);
                return;
            }
        }
        !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
    }
}
function Dn(e) {
    return "_value" in e ? e._value : e.value;
}
const La = ["ctrl", "shift", "alt", "meta"],
    Da = {
        stop: (e) => e.stopPropagation(),
        prevent: (e) => e.preventDefault(),
        self: (e) => e.target !== e.currentTarget,
        ctrl: (e) => !e.ctrlKey,
        shift: (e) => !e.shiftKey,
        alt: (e) => !e.altKey,
        meta: (e) => !e.metaKey,
        left: (e) => "button" in e && e.button !== 0,
        middle: (e) => "button" in e && e.button !== 1,
        right: (e) => "button" in e && e.button !== 2,
        exact: (e, t) => La.some((n) => e[`${n}Key`] && !t.includes(n)),
    },
    Fi = (e, t) => {
        if (!e) return e;
        const n = e._withMods || (e._withMods = {}),
            i = t.join(".");
        return (
            n[i] ||
            (n[i] = (s, ...r) => {
                for (let l = 0; l < t.length; l++) {
                    const o = Da[t[l]];
                    if (o && o(s, t)) return;
                }
                return e(s, ...r);
            })
        );
    },
    Va = ge({ patchProp: ka }, aa);
let Li;
function Ha() {
    return Li || (Li = jo(Va));
}
const ja = (...e) => {
    const t = Ha().createApp(...e),
        { mount: n } = t;
    return (
        (t.mount = (i) => {
            const s = Ua(i);
            if (!s) return;
            const r = t._component;
            (!H(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = ""));
            const l = n(s, !1, Ba(s));
            return (s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), l);
        }),
        t
    );
};
function Ba(e) {
    if (e instanceof SVGElement) return "svg";
    if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ua(e) {
    return ae(e) ? document.querySelector(e) : e;
}
const Ka = ["width", "height", "stroke-width"],
    za = ["d"],
    U = {
        __name: "AppIcon",
        props: { name: { type: String, default: "dice" }, size: { type: [Number, String], default: 20 } },
        setup(e) {
            const t = {
                dice: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01",
                arrow: "M5 12h14m-6-6 6 6-6 6",
                diagonal: "M6 18 18 6M6 6h12v12",
                user: "M20 21v-2a7 7 0 0 0-14 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
                users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-7a4 4 0 0 1 0 8m5 9v-2a4 4 0 0 0-3-3.87",
                bot: "M12 3v3m-2-3h4M6 7h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3M7 12h.01M17 12h.01m-8 4h6M1 12v3m22-3v3",
                restart: "M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6",
                book: "M12 5C8 2 4 3 2 4v16c3-2 6-2 10 0 4-2 7-2 10 0V4c-3-2-6-2-10 1m0 0v15",
                sound: "M11 5 6 9H3v6h3l5 4V5m5 3a6 6 0 0 1 0 8m4-11a10 10 0 0 1 0 14",
                mute: "M11 5 6 9H3v6h3l5 4V5m5 4 6 6m0-6-6 6",
                trophy: "M8 3h8v6a4 4 0 0 1-8 0V3m0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4v3",
                spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3",
                check: "m5 12 4 4L19 6",
                close: "m6 6 12 12M6 18 18 6",
                bank: "M3 10h18L12 3 3 10m2 3v6m7-6v6m7-6v6M3 22h18",
                history: "M4 6v5h5m-5-1a9 9 0 1 1 1 8m7-12v6l4 2",
                shield: "M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7l-9-4m-4 9 3 3 5-5",
                flame: "M12 3c1 6 7 7 7 12a7 7 0 1 1-14 0c0-3 2-5 4-7 0 3 2 3 3 4 2-3 0-6 0-9m0 12c-2 1-3 2-3 4a3 3 0 0 0 6 0c0-2-2-3-3-4",
                info: "M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
                chevron: "m9 5 7 7-7 7",
            };
            return (n, i) => (
                P(),
                D(
                    "svg",
                    {
                        width: e.size,
                        height: e.size,
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": e.name === "dice" ? 2.2 : 1.6,
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-hidden": "true",
                    },
                    [h("path", { d: t[e.name] || t.dice }, null, 8, za)],
                    8,
                    Ka,
                )
            );
        },
    },
    Wa = { key: 0, class: "die-check" },
    Ft = {
        __name: "Die",
        props: {
            value: { type: Number, default: 1 },
            selected: Boolean,
            rolling: Boolean,
            disabled: Boolean,
            decorative: Boolean,
            small: Boolean,
            index: { type: Number, default: 0 },
        },
        emits: ["select"],
        setup(e) {
            const t = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
            return (n, i) => (
                P(),
                Zt(
                    yo(e.decorative ? "span" : "button"),
                    {
                        type: "button",
                        class: fe([
                            "die",
                            {
                                selected: e.selected,
                                rolling: e.rolling,
                                "die-small": e.small,
                                decorative: e.decorative,
                            },
                        ]),
                        disabled: e.decorative ? void 0 : e.disabled,
                        style: fn({
                            "--die-rotation": `${[-7, 5, -3, 7, -5, 3][e.index % 6]}deg`,
                            "--die-delay": `${e.index * 45}ms`,
                        }),
                        "aria-label": e.decorative ? void 0 : `${e.value} 点骰子${e.selected ? "，已选择" : ""}`,
                        "aria-pressed": e.decorative ? void 0 : e.selected,
                        "aria-hidden": e.decorative ? !0 : void 0,
                        onClick: i[0] || (i[0] = (s) => !e.decorative && n.$emit("select")),
                    },
                    {
                        default: Ks(() => [
                            (P(),
                            D(
                                oe,
                                null,
                                qe(9, (s) =>
                                    h(
                                        "span",
                                        { key: s, class: fe(["pip", { visible: t[e.value].includes(s) }]) },
                                        null,
                                        2,
                                    ),
                                ),
                                64,
                            )),
                            e.selected && !e.small
                                ? (P(), D("span", Wa, [k(U, { name: "check", size: 12 })]))
                                : Oe("", !0),
                        ]),
                        _: 1,
                    },
                    8,
                    ["class", "disabled", "style", "aria-label", "aria-pressed", "aria-hidden"],
                )
            );
        },
    },
    Qr = 1e4,
    Vn = 500,
    qa = "https://www.playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf";
function Zr(e) {
    if (!e.length || e.length > 6 || e.some((i) => !Number.isInteger(i) || i < 1 || i > 6)) return 0;
    const t = Array(6).fill(0);
    for (const i of e) t[i - 1]++;
    if (e.length === 6) {
        if (t.every((i) => i === 1) || t.filter((i) => i === 2).length === 3 || (t.includes(4) && t.includes(2)))
            return 1500;
        if (t.filter((i) => i === 3).length === 2) return 2500;
    }
    let n = 0;
    for (let i = 0; i < 6; i++) {
        const s = t[i];
        if (s >= 3) n += s === 6 ? 3e3 : s === 5 ? 2e3 : s === 4 ? 1e3 : i === 0 ? 300 : (i + 1) * 100;
        else if (i === 0) n += s * 100;
        else if (i === 4) n += s * 50;
        else if (s > 0) return 0;
    }
    return n;
}
function el(e) {
    const t = [];
    for (let n = 1; n < 2 ** e.length; n++) {
        const i = e.filter((r, l) => n & (1 << l)),
            s = Zr(i.map((r) => r.value));
        s && t.push({ ids: i.map((r) => r.id), score: s, remaining: e.length - i.length });
    }
    return t.sort((n, i) => i.score - n.score || n.remaining - i.remaining);
}
function tl(e) {
    if (e.includes(1) || e.includes(5)) return !0;
    const t = Array(6).fill(0);
    for (const n of e) t[n - 1]++;
    return t.some((n) => n >= 3) || (e.length === 6 && t.filter((n) => n === 2).length === 3);
}
const vs = new Map();
function nl(e) {
    if (!Number.isInteger(e) || e < 1 || e > 6) throw new RangeError("Dice count must be 1–6");
    if (vs.has(e)) return vs.get(e);
    let t = 0;
    function n(s) {
        if (s.length === e) {
            tl(s) || t++;
            return;
        }
        for (let r = 1; r <= 6; r++) n([...s, r]);
    }
    n([]);
    const i = t / 6 ** e;
    return (vs.set(e, i), i);
}
function Is(e) {
    return Number.isSafeInteger(e) && e >= 1e3 && e <= 1e5 && e % 500 === 0;
}
function Di(e = "ai", t = "balanced", n = Qr) {
    if (!Is(n)) throw new RangeError("获胜分数必须为 1,000–100,000 之间的 500 倍数");
    return {
        version: 1,
        mode: e,
        difficulty: t,
        targetScore: n,
        players: [
            { name: e === "ai" ? "你" : "玩家一", score: 0 },
            { name: e === "ai" ? "NOVA" : "玩家二", score: 0 },
        ],
        active: 0,
        turn: 1,
        turnScore: 0,
        rollNumber: 0,
        dice: [],
        kept: [],
        phase: "ready",
        finalStarter: null,
        winner: null,
        history: [],
        lastEvent: null,
    };
}
function es(e) {
    return JSON.parse(JSON.stringify(e));
}
function sl(e, t, n = 0) {
    const i = {
        id: `${e.turn}-${e.rollNumber}-${e.history.length}`,
        type: t,
        player: e.active,
        name: e.players[e.active].name,
        points: n,
        turn: e.turn,
    };
    ((e.lastEvent = i), e.history.unshift(i), (e.history = e.history.slice(0, 30)));
}
function ts(e, t) {
    if (!t.length || new Set(t).size !== t.length) return 0;
    const n = e.dice.filter((i) => t.includes(i.id));
    return n.length === t.length ? Zr(n.map((i) => i.value)) : 0;
}
function il(e, t = []) {
    if (e.phase !== "selecting") return !1;
    const n = ts(e, t);
    if (!n) return !1;
    const i = e.turnScore + n;
    return i > 0 && (e.players[e.active].score > 0 || i >= Vn);
}
function Ga(e, t = [], n = Math.random) {
    if (!["ready", "selecting"].includes(e.phase)) throw new Error("当前不能掷骰");
    const i = es(e);
    let s = 6,
        r = !1;
    if (e.phase === "selecting") {
        const l = ts(e, t);
        if (!l) throw new Error("请先选出至少一组可计分骰子");
        const o = e.dice.filter((u) => t.includes(u.id));
        (i.kept.push({ roll: e.rollNumber, values: o.map((u) => u.value), score: l }),
            (i.turnScore += l),
            (s = e.dice.length - o.length),
            s === 0 && ((s = 6), (i.kept = []), (r = !0)));
    }
    return (
        i.rollNumber++,
        (i.dice = Array.from({ length: s }, (l, o) => ({
            id: `${i.rollNumber}-${o}`,
            value: Math.min(6, Math.max(1, Math.floor(n() * 6) + 1)),
        }))),
        tl(i.dice.map((l) => l.value))
            ? ((i.phase = "selecting"), (i.lastEvent = r ? { type: "hot" } : null))
            : (sl(i, "farkle", i.turnScore), (i.turnScore = 0), (i.phase = "farkle")),
        i
    );
}
function rl(e) {
    if (e.finalStarter !== null && e.active !== e.finalStarter) {
        e.phase = "finished";
        const [t, n] = e.players.map((i) => i.score);
        e.winner = t === n ? "tie" : t > n ? 0 : 1;
    } else e.phase = "handoff";
    return e;
}
function Ja(e, t = []) {
    if (!il(e, t)) throw new Error("首次收分需达到 500 分，且所选骰子必须全部可计分");
    const n = es(e),
        i = n.turnScore + ts(n, t);
    return (
        (n.players[n.active].score += i),
        sl(n, "bank", i),
        n.finalStarter === null &&
            n.players[n.active].score >= n.targetScore &&
            ((n.finalStarter = n.active), (n.lastEvent.final = !0)),
        (n.turnScore = 0),
        rl(n)
    );
}
function Ya(e) {
    if (e.phase !== "farkle") throw new Error("尚未出现 Farkle");
    return rl(es(e));
}
function Xa(e) {
    if (e.phase !== "handoff") throw new Error("当前无需交接回合");
    const t = es(e);
    return (
        (t.active = 1 - t.active),
        t.turn++,
        (t.turnScore = 0),
        (t.dice = []),
        (t.kept = []),
        (t.phase = "ready"),
        (t.lastEvent = null),
        t
    );
}
function Qa(e) {
    if (e.phase === "ready") return { type: "roll", ids: [] };
    if (e.phase !== "selecting") return null;
    const t = el(e.dice),
        n = e.players[e.active],
        i = e.players[1 - e.active],
        s = e.finalStarter !== null && e.active !== e.finalStarter,
        r = { cautious: 0.72, balanced: 1, bold: 1.38 }[e.difficulty] || 1,
        l = t.map((o) => {
            const u = e.turnScore + o.score,
                g = o.remaining || 6,
                d = nl(g),
                m = n.score > 0 || u >= Vn,
                x = s && n.score + u > i.score,
                E = !s && n.score + u >= e.targetScore,
                R = [0, 25, 65, 110, 180, 280, 450][g],
                M = Math.min(1.3, 1 + Math.max(0, i.score - n.score) / 16e3),
                z = (1 - d) * R * r * M - d * u,
                j = s && n.score + u <= i.score,
                V = m && !j && (x || E || z <= 0);
            return { ...o, type: V ? "bank" : "roll", utility: o.score + (V ? 0 : z), winsFinal: x, reachesTarget: E };
        });
    return (
        l.sort(
            (o, u) =>
                Number(u.winsFinal) - Number(o.winsFinal) ||
                Number(u.reachesTarget) - Number(o.reachesTarget) ||
                u.utility - o.utility,
        ),
        l[0]
    );
}
const Za = { class: "site-shell" },
    eu = { class: "site-header" },
    tu = { class: "brand", href: "./", "aria-label": "Farkle 首页" },
    nu = { class: "brand-mark" },
    su = { "aria-label": "游戏工具" },
    iu = ["aria-label", "aria-pressed"],
    ru = { class: "main-content" },
    lu = { class: "page-heading" },
    ou = { class: "target-badge" },
    au = { class: "target-icon" },
    uu = { class: "game-layout" },
    cu = { class: "main-column", "aria-label": "Farkle 对局" },
    fu = { class: "game-toolbar" },
    du = { class: "mode-tabs", role: "group", "aria-label": "游戏模式" },
    pu = ["aria-pressed"],
    hu = ["aria-pressed"],
    gu = { class: "scoreboard" },
    vu = ["aria-label"],
    mu = { class: "player-card-top" },
    yu = { class: "player-avatar" },
    bu = { class: "player-identity" },
    _u = { key: 0, class: "ai-label" },
    Su = { key: 0, class: "current-badge" },
    xu = { key: 1, class: "waiting-label" },
    wu = { class: "score-number" },
    Tu = ["aria-label", "aria-valuenow", "aria-valuemax"],
    Cu = { class: "table-topline" },
    Eu = { key: 0, class: "final-notice" },
    Au = { class: "turn-summary" },
    Mu = { class: "table-overline" },
    Ou = { key: 0 },
    Iu = { class: "turn-description", role: "status", "aria-live": "polite" },
    ku = { key: 0, class: "selection-points" },
    Nu = { class: "kept-tray" },
    Ru = { class: "kept-label" },
    Pu = { key: 0, class: "kept-groups" },
    $u = ["title"],
    Fu = { key: 1, class: "kept-placeholder" },
    Lu = { key: 1, class: "handoff-actions" },
    Du = { key: 0, class: "auto-handoff" },
    Vu = { key: 2, class: "finished-actions" },
    Hu = { key: 3, class: "table-actions" },
    ju = ["disabled"],
    Bu = { key: 0, class: "button-count" },
    Uu = ["disabled", "title"],
    Ku = { key: 0 },
    zu = { class: "table-footnote" },
    Wu = { class: "activity-section", "aria-label": "对局记录" },
    qu = { class: "section-title" },
    Gu = { key: 0, class: "activity-empty" },
    Ju = { key: 1, class: "activity-list" },
    Yu = { key: 0, class: "final-tag" },
    Xu = { key: 0 },
    Qu = { class: "sidebar", "aria-label": "计分与玩法提示" },
    Zu = { class: "score-guide" },
    ec = { class: "section-title" },
    tc = { class: "single-scoring" },
    nc = { class: "hot-dice-card" },
    sc = { class: "hot-dice-icon" },
    ic = { class: "entry-note" },
    rc = { class: "site-footer" },
    lc = { class: "footer-spec" },
    oc = { key: 0, class: "toast-message", role: "status" },
    ac = ["aria-labelledby"],
    uc = { key: 0, class: "rules-content" },
    cc = { class: "example-note" },
    fc = { class: "rules-source" },
    dc = ["href"],
    pc = { class: "setup-mode-options" },
    hc = ["aria-pressed"],
    gc = ["aria-pressed"],
    vc = { class: "target-setup" },
    mc = { class: "target-input-wrap" },
    yc = ["aria-invalid"],
    bc = { class: "target-presets", "aria-label": "常用目标分数" },
    _c = ["aria-pressed", "onClick"],
    Sc = { key: 1, class: "name-fields" },
    xc = { class: "field-label" },
    wc = { class: "field-label" },
    Tc = { class: "setup-notice" },
    Cc = ["disabled"],
    Ec = { key: 2, class: "winner-content" },
    Ac = { class: "winner-emblem" },
    Mc = { id: "winner-title" },
    Oc = { class: "dialog-intro" },
    Ic = { class: "final-scores" },
    Vi = "farkle.table.v1",
    kc = {
        __name: "App",
        setup(e) {
            const t = (v) => v.toLocaleString("en-US");
            function n() {
                try {
                    const v = JSON.parse(localStorage.getItem(Vi));
                    if (v?.version !== 1 || !["ai", "local"].includes(v.mode) || ![0, 1].includes(v.active))
                        return null;
                    const a = v.targetScore ?? Qr;
                    return !Is(a) ||
                        !Array.isArray(v.players) ||
                        v.players.length !== 2 ||
                        !v.players.every(
                            (f) =>
                                typeof f.name == "string" &&
                                f.name.length <= 24 &&
                                Number.isInteger(f.score) &&
                                f.score >= 0,
                        ) ||
                        !["ready", "selecting", "farkle", "handoff", "finished"].includes(v.phase) ||
                        !Number.isInteger(v.turnScore) ||
                        v.turnScore < 0 ||
                        !Array.isArray(v.dice) ||
                        v.dice.length > 6 ||
                        !v.dice.every(
                            (f) => typeof f.id == "string" && Number.isInteger(f.value) && f.value >= 1 && f.value <= 6,
                        ) ||
                        !Array.isArray(v.history) ||
                        !Array.isArray(v.kept) ||
                        !Number.isInteger(v.turn) ||
                        v.turn < 1 ||
                        !Number.isInteger(v.rollNumber) ||
                        v.rollNumber < 0 ||
                        !["cautious", "balanced", "bold"].includes(v.difficulty) ||
                        !v.history.every(
                            (f) =>
                                f &&
                                ["bank", "farkle"].includes(f.type) &&
                                typeof f.name == "string" &&
                                Number.isInteger(f.points) &&
                                f.points >= 0 &&
                                Number.isInteger(f.turn),
                        ) ||
                        !v.kept.every(
                            (f) =>
                                f &&
                                Array.isArray(f.values) &&
                                f.values.length <= 6 &&
                                f.values.every((w) => Number.isInteger(w) && w >= 1 && w <= 6) &&
                                Number.isInteger(f.score),
                        ) ||
                        (["selecting", "farkle"].includes(v.phase) && !v.dice.length) ||
                        ![null, 0, 1].includes(v.finalStarter) ||
                        ![null, 0, 1, "tie"].includes(v.winner) ||
                        (v.phase === "finished" && v.winner === null)
                        ? null
                        : { ...v, targetScore: a };
                } catch {
                    return null;
                }
            }
            const i = n(),
                s = Hl(i || Di()),
                r = $e([]),
                l = $e(!1),
                o = $e([]),
                u = $e(!1),
                g = $e(null),
                d = $e(null),
                m = $e(""),
                x = $e(s.value.mode),
                E = $e(s.value.difficulty),
                R = $e(s.value.targetScore),
                M = $e(["", ""]),
                z = $e("");
            let j, V, B, O, K;
            const J = he(() => s.value.mode === "ai" && s.value.active === 1),
                de = he(() => s.value.players[s.value.active]),
                ye = he(() => Math.ceil(s.value.turn / 2)),
                F = he(() => s.value.targetScore),
                W = he(() => Is(Number(R.value))),
                Y = he(() => ts(s.value, r.value)),
                A = he(() => s.value.turnScore + Y.value),
                Z = he(() => Y.value > 0),
                pe = he(
                    () =>
                        !l.value &&
                        !J.value &&
                        (s.value.phase === "ready" || (s.value.phase === "selecting" && Z.value)),
                ),
                Ne = he(() => !l.value && !J.value && il(s.value, r.value)),
                ue = he(() => (s.value.phase === "ready" ? 6 : s.value.dice.length - r.value.length || 6)),
                le = he(() => Math.round(nl(ue.value) * 100)),
                te = he(() => s.value.players[s.value.active].score === 0 && A.value < Vn),
                Re = he(() => ["farkle", "handoff"].includes(s.value.phase)),
                Rt = (v) => `${Math.min((v / F.value) * 100, 100)}%`,
                st = { cautious: "稳健型", balanced: "均衡型", bold: "冒险型" },
                Ae = he(() =>
                    l.value
                        ? "骰子落定之前，一切皆有可能。"
                        : s.value.phase === "finished"
                          ? s.value.winner === "tie"
                              ? "势均力敌，平分秋色。"
                              : `${s.value.players[s.value.winner].name}赢得了这场冒险！`
                          : s.value.phase === "farkle"
                            ? "这一掷没有得分组合，本回合得分归零。"
                            : s.value.phase === "handoff"
                              ? `漂亮！${de.value.name}已收下 ${t(s.value.lastEvent?.points || 0)} 分。`
                              : J.value
                                ? z.value || "NOVA 正在权衡，下一掷值得冒险吗？"
                                : s.value.lastEvent?.type === "hot"
                                  ? "HOT DICE！六骰全中，带着得分再来一轮。"
                                  : s.value.phase === "ready"
                                    ? `${de.value.name}的回合，掷出骰子，开启你的冒险。`
                                    : "选出可计分的骰子，继续冒险，或见好就收。",
                ),
                hn = he(() =>
                    l.value
                        ? "好运，正在路上…"
                        : s.value.phase !== "selecting"
                          ? "每一颗骰子，都藏着新的可能。"
                          : r.value.length && !Y.value
                            ? "所选骰子中含有不能计分的骰子，请重新选择。"
                            : Y.value
                              ? `已选择 ${r.value.length} 颗骰子`
                              : J.value
                                ? "NOVA 正在寻找得分组合…"
                                : "点击骰子，选择你的得分组合",
                ),
                gn = he(() =>
                    s.value.winner === "tie"
                        ? "这次，平分秋色。"
                        : `${s.value.players[s.value.winner ?? 0].name}获胜！`,
                );
            function ft(v) {
                (clearTimeout(O),
                    (m.value = v),
                    (O = setTimeout(() => {
                        m.value = "";
                    }, 3200)));
            }
            function Pe(v) {
                if (u.value)
                    try {
                        ((K ||= new (window.AudioContext || window.webkitAudioContext)()), K.resume().catch(() => {}));
                        const a = K.createOscillator(),
                            f = K.createGain();
                        (a.connect(f), f.connect(K.destination));
                        const w = K.currentTime;
                        ((a.type = v === "farkle" ? "triangle" : "sine"),
                            a.frequency.setValueAtTime(v === "bank" ? 660 : v === "farkle" ? 180 : 350, w),
                            a.frequency.exponentialRampToValueAtTime(v === "bank" ? 990 : 130, w + 0.15),
                            f.gain.setValueAtTime(0.045, w),
                            f.gain.exponentialRampToValueAtTime(0.001, w + 0.2),
                            a.start(),
                            a.stop(w + 0.22));
                    } catch {}
            }
            function Pt() {
                ((u.value = !u.value), u.value && Pe("bank"));
            }
            function vn(v) {
                l.value ||
                    J.value ||
                    s.value.phase !== "selecting" ||
                    ((r.value = r.value.includes(v) ? r.value.filter((a) => a !== v) : [...r.value, v]), Pe("select"));
            }
            function bt() {
                l.value || J.value || s.value.phase !== "selecting" || (r.value = el(s.value.dice)[0]?.ids || []);
            }
            function mn(v = r.value, a = !1) {
                if (!(l.value || (J.value && !a)))
                    try {
                        const f = Ga(s.value, v),
                            w = f.dice.length;
                        ((l.value = !0),
                            (z.value = ""),
                            (r.value = []),
                            (o.value = Array.from({ length: w }, () => Math.floor(Math.random() * 6) + 1)),
                            Pe("roll"),
                            (B = setInterval(() => {
                                o.value = o.value.map(() => Math.floor(Math.random() * 6) + 1);
                            }, 85)));
                        const C = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 650;
                        V = setTimeout(() => {
                            (clearInterval(B),
                                (s.value = f),
                                (l.value = !1),
                                f.phase === "farkle"
                                    ? Pe("farkle")
                                    : f.lastEvent?.type === "hot" &&
                                      (Pe("bank"), ft("HOT DICE · 六颗骰子全部计分，火热再掷！")));
                        }, C);
                    } catch (f) {
                        ft(f.message);
                    }
            }
            function c(v = r.value, a = !1) {
                if (!(l.value || (J.value && !a)))
                    try {
                        ((s.value = Ja(s.value, v)), (r.value = []), (z.value = ""), Pe("bank"));
                    } catch (f) {
                        ft(f.message);
                    }
            }
            function p() {
                (s.value.phase === "farkle" && (s.value = Ya(s.value)),
                    s.value.phase === "handoff" && (s.value = Xa(s.value)),
                    (r.value = []),
                    (z.value = ""));
            }
            function y() {
                if ((clearTimeout(j), !(l.value || g.value || s.value.phase === "finished" || s.value.mode !== "ai"))) {
                    if (Re.value) {
                        j = setTimeout(p, s.value.phase === "farkle" ? 1800 : 1400);
                        return;
                    }
                    if (J.value) {
                        if (s.value.phase === "ready") {
                            j = setTimeout(() => mn([], !0), 850);
                            return;
                        }
                        j = setTimeout(() => {
                            const v = Qa(s.value);
                            v &&
                                ((r.value = v.ids),
                                (z.value = `NOVA 选择了 ${v.ids.length} 颗骰子，准备${v.type === "bank" ? "收分" : "继续掷骰"}。`),
                                (j = setTimeout(() => {
                                    v.type === "bank" ? c(v.ids, !0) : mn(v.ids, !0);
                                }, 1e3)));
                        }, 1e3);
                    }
                }
            }
            function S(v = s.value.mode) {
                ((x.value = v),
                    (E.value = s.value.difficulty),
                    (R.value = s.value.targetScore),
                    (M.value = s.value.mode === "local" ? s.value.players.map((a) => a.name) : ["", ""]),
                    (g.value = "setup"));
            }
            function b(v) {
                s.value.mode !== v && S(v);
            }
            function _() {
                if ((clearTimeout(j), clearTimeout(V), clearInterval(B), !W.value)) {
                    ft("获胜分数须为 1,000–100,000 之间的 500 倍数。");
                    return;
                }
                const v = Di(x.value, E.value, Number(R.value));
                (x.value === "local" &&
                    v.players.forEach((a, f) => {
                        a.name = M.value[f].trim().slice(0, 24) || `玩家${f === 0 ? "一" : "二"}`;
                    }),
                    (l.value = !1),
                    (r.value = []),
                    (z.value = ""),
                    (s.value = v),
                    (g.value = null),
                    ft("新对局已开始，祝你好运！"));
            }
            function T() {
                g.value = null;
            }
            return (
                Dt([s, l, g], y),
                Dt(s, (v) => {
                    try {
                        localStorage.setItem(Vi, JSON.stringify(v));
                    } catch {}
                    v.phase === "finished" && (g.value = "winner");
                }),
                Dt(g, async (v) => {
                    (await Bs(), v && !d.value.open ? d.value.showModal() : !v && d.value.open && d.value.close());
                }),
                zs(() => {
                    (i && ft("已恢复上次的对局"), s.value.phase === "finished" && (g.value = "winner"), y());
                }),
                Ws(() => {
                    (clearTimeout(j), clearTimeout(V), clearInterval(B), clearTimeout(O), K?.close());
                }),
                (v, a) => (
                    P(),
                    D("div", Za, [
                        h("header", eu, [
                            h("a", tu, [
                                h("span", nu, [k(U, { name: "dice", size: 27 })]),
                                a[17] || (a[17] = $("farkle", -1)),
                                a[18] || (a[18] = h("span", { class: "brand-period" }, ".", -1)),
                            ]),
                            a[21] ||
                                (a[21] = h("span", { class: "header-motto" }, "A LITTLE LUCK. A LOT OF NERVE.", -1)),
                            h("nav", su, [
                                h(
                                    "button",
                                    {
                                        class: "sound-toggle",
                                        "aria-label": u.value ? "关闭音效" : "开启音效",
                                        "aria-pressed": u.value,
                                        onClick: Pt,
                                    },
                                    [
                                        k(U, { name: u.value ? "sound" : "mute", size: 18 }, null, 8, ["name"]),
                                        h("span", null, G(u.value ? "音效开启" : "音效关闭"), 1),
                                    ],
                                    8,
                                    iu,
                                ),
                                a[20] || (a[20] = h("span", { class: "nav-divider" }, null, -1)),
                                h(
                                    "button",
                                    { class: "rules-button", onClick: a[0] || (a[0] = (f) => (g.value = "rules")) },
                                    [k(U, { name: "book", size: 17 }), a[19] || (a[19] = $("玩法规则 ", -1))],
                                ),
                            ]),
                        ]),
                        h("main", ru, [
                            h("section", lu, [
                                a[24] ||
                                    (a[24] = h(
                                        "div",
                                        null,
                                        [
                                            h("div", { class: "eyebrow" }, [
                                                h("span", { class: "green-dot" }),
                                                $(" ROLL THE DICE. OWN THE MOMENT."),
                                            ]),
                                            h("h1", null, [$("再掷一次，"), h("span", null, "好运在手。")]),
                                            h("p", null, "是落袋为安，还是放手一搏？让每一次选择，都值得心跳。"),
                                        ],
                                        -1,
                                    )),
                                h("div", ou, [
                                    h("span", au, [k(U, { name: "trophy", size: 24 })]),
                                    h("div", null, [
                                        a[23] || (a[23] = h("small", null, "本局目标", -1)),
                                        h("strong", null, [
                                            $(G(t(F.value)), 1),
                                            a[22] || (a[22] = h("span", null, "分", -1)),
                                        ]),
                                    ]),
                                ]),
                            ]),
                            h("div", uu, [
                                h("section", cu, [
                                    h("div", fu, [
                                        h("div", du, [
                                            h(
                                                "button",
                                                {
                                                    class: fe({ active: s.value.mode === "ai" }),
                                                    "aria-pressed": s.value.mode === "ai",
                                                    onClick: a[1] || (a[1] = (f) => b("ai")),
                                                },
                                                [
                                                    k(U, { name: "bot", size: 16 }),
                                                    a[25] || (a[25] = $("单人对战 ", -1)),
                                                    a[26] || (a[26] = h("span", { class: "mode-tag" }, "AI", -1)),
                                                ],
                                                10,
                                                pu,
                                            ),
                                            h(
                                                "button",
                                                {
                                                    class: fe({ active: s.value.mode === "local" }),
                                                    "aria-pressed": s.value.mode === "local",
                                                    onClick: a[2] || (a[2] = (f) => b("local")),
                                                },
                                                [
                                                    k(U, { name: "users", size: 16 }),
                                                    a[27] || (a[27] = $("本地双人 ", -1)),
                                                ],
                                                10,
                                                hu,
                                            ),
                                        ]),
                                        h(
                                            "button",
                                            {
                                                class: "text-button new-game-button",
                                                onClick: a[3] || (a[3] = (f) => S()),
                                            },
                                            [
                                                k(U, { name: "restart", size: 16 }),
                                                a[28] || (a[28] = h("span", null, "新对局", -1)),
                                            ],
                                        ),
                                    ]),
                                    h("div", gu, [
                                        (P(!0),
                                        D(
                                            oe,
                                            null,
                                            qe(
                                                s.value.players,
                                                (f, w) => (
                                                    P(),
                                                    D(
                                                        "article",
                                                        {
                                                            key: w,
                                                            class: fe([
                                                                "player-card",
                                                                {
                                                                    "is-active":
                                                                        s.value.active === w &&
                                                                        s.value.phase !== "finished",
                                                                    "player-two": w === 1,
                                                                },
                                                            ]),
                                                            "aria-label": `${f.name}，总分 ${f.score}`,
                                                        },
                                                        [
                                                            h("div", mu, [
                                                                h("div", yu, [
                                                                    k(
                                                                        U,
                                                                        {
                                                                            name:
                                                                                w === 1 && s.value.mode === "ai"
                                                                                    ? "bot"
                                                                                    : "user",
                                                                            size: 21,
                                                                        },
                                                                        null,
                                                                        8,
                                                                        ["name"],
                                                                    ),
                                                                ]),
                                                                h("div", bu, [
                                                                    h("h2", null, [
                                                                        $(G(f.name), 1),
                                                                        w === 1 && s.value.mode === "ai"
                                                                            ? (P(), D("span", _u, "AI"))
                                                                            : Oe("", !0),
                                                                    ]),
                                                                    h(
                                                                        "span",
                                                                        null,
                                                                        G(
                                                                            w === 1 && s.value.mode === "ai"
                                                                                ? st[s.value.difficulty] + "对手"
                                                                                : "PLAYER 0" + (w + 1),
                                                                        ),
                                                                        1,
                                                                    ),
                                                                ]),
                                                                s.value.active === w && s.value.phase !== "finished"
                                                                    ? (P(),
                                                                      D("span", Su, [
                                                                          ...(a[29] ||
                                                                              (a[29] = [
                                                                                  h("i", null, null, -1),
                                                                                  $("当前回合", -1),
                                                                              ])),
                                                                      ]))
                                                                    : (P(),
                                                                      D(
                                                                          "span",
                                                                          xu,
                                                                          G(
                                                                              s.value.phase === "finished"
                                                                                  ? "对局结束"
                                                                                  : "等待中",
                                                                          ),
                                                                          1,
                                                                      )),
                                                            ]),
                                                            h("div", wu, [
                                                                $(G(t(f.score)), 1),
                                                                h("span", null, "/ " + G(t(F.value)), 1),
                                                            ]),
                                                            h(
                                                                "div",
                                                                {
                                                                    class: "score-progress",
                                                                    role: "progressbar",
                                                                    "aria-label": `${f.name}的目标进度`,
                                                                    "aria-valuenow": Math.min(f.score, F.value),
                                                                    "aria-valuemin": 0,
                                                                    "aria-valuemax": F.value,
                                                                },
                                                                [
                                                                    h(
                                                                        "div",
                                                                        { style: fn({ width: Rt(f.score) }) },
                                                                        null,
                                                                        4,
                                                                    ),
                                                                ],
                                                                8,
                                                                Tu,
                                                            ),
                                                        ],
                                                        10,
                                                        vu,
                                                    )
                                                ),
                                            ),
                                            128,
                                        )),
                                    ]),
                                    h(
                                        "section",
                                        {
                                            class: fe([
                                                "game-table",
                                                {
                                                    "table-farkle": s.value.phase === "farkle",
                                                    "table-final": s.value.finalStarter !== null,
                                                },
                                            ]),
                                            "aria-label": "骰子牌桌",
                                        },
                                        [
                                            a[40] || (a[40] = h("div", { class: "table-corner corner-tl" }, null, -1)),
                                            a[41] || (a[41] = h("div", { class: "table-corner corner-tr" }, null, -1)),
                                            a[42] || (a[42] = h("div", { class: "table-corner corner-bl" }, null, -1)),
                                            a[43] || (a[43] = h("div", { class: "table-corner corner-br" }, null, -1)),
                                            h("div", Cu, [
                                                h("span", null, [
                                                    a[30] || (a[30] = h("span", { class: "green-dot" }, null, -1)),
                                                    $(
                                                        G(
                                                            s.value.finalStarter !== null
                                                                ? "最后一回合 · FINAL ROUND"
                                                                : `第 ${String(ye.value).padStart(2, "0")} 轮`,
                                                        ),
                                                        1,
                                                    ),
                                                ]),
                                                a[31] ||
                                                    (a[31] = h(
                                                        "span",
                                                        { class: "table-caption" },
                                                        "SIX DICE. INFINITE POSSIBILITIES.",
                                                        -1,
                                                    )),
                                            ]),
                                            s.value.finalStarter !== null && s.value.phase !== "finished"
                                                ? (P(),
                                                  D("div", Eu, [
                                                      k(U, { name: "trophy", size: 13 }),
                                                      $(
                                                          G(s.value.players[s.value.finalStarter].name) +
                                                              "已达目标，对手还有最后一次机会。 ",
                                                          1,
                                                      ),
                                                  ]))
                                                : Oe("", !0),
                                            h("div", Au, [
                                                h(
                                                    "div",
                                                    Mu,
                                                    G(
                                                        s.value.phase === "farkle"
                                                            ? "这一掷，运气暂时离场"
                                                            : s.value.phase === "finished"
                                                              ? "THANKS FOR PLAYING"
                                                              : "本回合累计",
                                                    ),
                                                    1,
                                                ),
                                                h(
                                                    "div",
                                                    {
                                                        class: fe([
                                                            "turn-score",
                                                            { "farkle-title": s.value.phase === "farkle" },
                                                        ]),
                                                    },
                                                    [
                                                        $(
                                                            G(
                                                                s.value.phase === "farkle"
                                                                    ? "FARKLE!"
                                                                    : t(s.value.turnScore),
                                                            ),
                                                            1,
                                                        ),
                                                        s.value.phase !== "farkle"
                                                            ? (P(), D("span", Ou, "pts"))
                                                            : Oe("", !0),
                                                    ],
                                                    2,
                                                ),
                                                h("p", Iu, G(Ae.value), 1),
                                            ]),
                                            h(
                                                "div",
                                                {
                                                    class: fe([
                                                        "dice-zone",
                                                        {
                                                            "waiting-dice": s.value.phase === "ready" || Re.value,
                                                            "farkle-dice": s.value.phase === "farkle",
                                                        },
                                                    ]),
                                                },
                                                [
                                                    l.value
                                                        ? (P(!0),
                                                          D(
                                                              oe,
                                                              { key: 0 },
                                                              qe(
                                                                  o.value,
                                                                  (f, w) => (
                                                                      P(),
                                                                      Zt(
                                                                          Ft,
                                                                          {
                                                                              key: w,
                                                                              value: f,
                                                                              index: w,
                                                                              rolling: "",
                                                                              disabled: "",
                                                                          },
                                                                          null,
                                                                          8,
                                                                          ["value", "index"],
                                                                      )
                                                                  ),
                                                              ),
                                                              128,
                                                          ))
                                                        : s.value.dice.length
                                                          ? (P(!0),
                                                            D(
                                                                oe,
                                                                { key: 1 },
                                                                qe(
                                                                    s.value.dice,
                                                                    (f, w) => (
                                                                        P(),
                                                                        Zt(
                                                                            Ft,
                                                                            {
                                                                                key: f.id,
                                                                                value: f.value,
                                                                                index: w,
                                                                                selected: r.value.includes(f.id),
                                                                                disabled:
                                                                                    J.value ||
                                                                                    s.value.phase !== "selecting",
                                                                                onSelect: (C) => vn(f.id),
                                                                            },
                                                                            null,
                                                                            8,
                                                                            [
                                                                                "value",
                                                                                "index",
                                                                                "selected",
                                                                                "disabled",
                                                                                "onSelect",
                                                                            ],
                                                                        )
                                                                    ),
                                                                ),
                                                                128,
                                                            ))
                                                          : (P(),
                                                            D(
                                                                oe,
                                                                { key: 2 },
                                                                qe([1, 5, 3, 6, 2, 4], (f, w) =>
                                                                    k(
                                                                        Ft,
                                                                        { key: w, value: f, index: w, decorative: "" },
                                                                        null,
                                                                        8,
                                                                        ["value", "index"],
                                                                    ),
                                                                ),
                                                                64,
                                                            )),
                                                ],
                                                2,
                                            ),
                                            h(
                                                "div",
                                                {
                                                    class: fe([
                                                        "selection-line",
                                                        { "invalid-selection": r.value.length && !Y.value },
                                                    ]),
                                                },
                                                [
                                                    h("span", null, G(hn.value), 1),
                                                    Y.value
                                                        ? (P(), D("span", ku, "+" + G(t(Y.value)) + " 分", 1))
                                                        : Oe("", !0),
                                                    s.value.phase === "selecting" && !J.value && !l.value
                                                        ? (P(),
                                                          D(
                                                              "button",
                                                              { key: 1, class: "suggest-button", onClick: bt },
                                                              [
                                                                  k(U, { name: "spark", size: 12 }),
                                                                  a[32] || (a[32] = $("帮我选 ", -1)),
                                                              ],
                                                          ))
                                                        : Oe("", !0),
                                                ],
                                                2,
                                            ),
                                            h("div", Nu, [
                                                h("span", Ru, [
                                                    k(U, { name: "shield", size: 13 }),
                                                    a[33] || (a[33] = $("已保留", -1)),
                                                ]),
                                                s.value.kept.length
                                                    ? (P(),
                                                      D("div", Pu, [
                                                          (P(!0),
                                                          D(
                                                              oe,
                                                              null,
                                                              qe(
                                                                  s.value.kept,
                                                                  (f, w) => (
                                                                      P(),
                                                                      D(
                                                                          "span",
                                                                          {
                                                                              key: w,
                                                                              class: "kept-group",
                                                                              title: `第 ${f.roll} 次投掷，${f.score} 分`,
                                                                          },
                                                                          [
                                                                              (P(!0),
                                                                              D(
                                                                                  oe,
                                                                                  null,
                                                                                  qe(
                                                                                      f.values,
                                                                                      (C, I) => (
                                                                                          P(),
                                                                                          Zt(
                                                                                              Ft,
                                                                                              {
                                                                                                  key: I,
                                                                                                  value: C,
                                                                                                  index: I,
                                                                                                  small: "",
                                                                                                  decorative: "",
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              ["value", "index"],
                                                                                          )
                                                                                      ),
                                                                                  ),
                                                                                  128,
                                                                              )),
                                                                          ],
                                                                          8,
                                                                          $u,
                                                                      )
                                                                  ),
                                                              ),
                                                              128,
                                                          )),
                                                      ]))
                                                    : (P(), D("span", Fu, "等待你的第一个得分组合")),
                                                a[34] ||
                                                    (a[34] = h(
                                                        "span",
                                                        { class: "kept-note" },
                                                        "组合仅限同一次投掷",
                                                        -1,
                                                    )),
                                            ]),
                                            Re.value
                                                ? (P(),
                                                  D("div", Lu, [
                                                      s.value.mode === "ai"
                                                          ? (P(),
                                                            D("div", Du, [
                                                                ...(a[35] ||
                                                                    (a[35] = [
                                                                        h(
                                                                            "span",
                                                                            { class: "thinking-dots" },
                                                                            [h("i"), h("i"), h("i")],
                                                                            -1,
                                                                        ),
                                                                        $(" 正在交接回合 ", -1),
                                                                    ])),
                                                            ]))
                                                          : (P(),
                                                            D(
                                                                "button",
                                                                { key: 1, class: "button button-primary", onClick: p },
                                                                [
                                                                    $(
                                                                        G(
                                                                            s.value.finalStarter !== null &&
                                                                                s.value.active !== s.value.finalStarter
                                                                                ? "查看最终结果"
                                                                                : `交给${s.value.players[1 - s.value.active].name}`,
                                                                        ),
                                                                        1,
                                                                    ),
                                                                    k(U, { name: "arrow", size: 18 }),
                                                                ],
                                                            )),
                                                  ]))
                                                : s.value.phase === "finished"
                                                  ? (P(),
                                                    D("div", Vu, [
                                                        h(
                                                            "button",
                                                            {
                                                                class: "button button-primary",
                                                                onClick: a[4] || (a[4] = (f) => S()),
                                                            },
                                                            [
                                                                k(U, { name: "restart", size: 18 }),
                                                                a[36] || (a[36] = $("再来一局", -1)),
                                                            ],
                                                        ),
                                                        h(
                                                            "button",
                                                            {
                                                                class: "button button-secondary",
                                                                onClick: a[5] || (a[5] = (f) => (g.value = "winner")),
                                                            },
                                                            [
                                                                a[37] || (a[37] = $(" 查看结果", -1)),
                                                                k(U, { name: "trophy", size: 17 }),
                                                            ],
                                                        ),
                                                    ]))
                                                  : (P(),
                                                    D("div", Hu, [
                                                        h(
                                                            "button",
                                                            {
                                                                class: "button button-primary roll-button",
                                                                disabled: !pe.value,
                                                                onClick: a[6] || (a[6] = (f) => mn()),
                                                            },
                                                            [
                                                                k(U, { name: "dice", size: 21 }),
                                                                h(
                                                                    "span",
                                                                    null,
                                                                    G(
                                                                        l.value
                                                                            ? "掷骰中…"
                                                                            : J.value
                                                                              ? "NOVA 思考中…"
                                                                              : s.value.phase === "ready"
                                                                                ? "掷出骰子"
                                                                                : "继续掷骰",
                                                                    ),
                                                                    1,
                                                                ),
                                                                s.value.phase === "selecting" && !l.value && !J.value
                                                                    ? (P(), D("span", Bu, G(ue.value) + " 颗", 1))
                                                                    : Oe("", !0),
                                                                k(U, { name: "arrow", size: 17 }),
                                                            ],
                                                            8,
                                                            ju,
                                                        ),
                                                        h(
                                                            "button",
                                                            {
                                                                class: "button button-secondary bank-button",
                                                                disabled: !Ne.value,
                                                                title: te.value
                                                                    ? "首次收分需在同一回合累计至少 500 分"
                                                                    : "把本回合得分加入总分",
                                                                onClick: a[7] || (a[7] = (f) => c()),
                                                            },
                                                            [
                                                                k(U, { name: "bank", size: 18 }),
                                                                a[38] ||
                                                                    (a[38] = h("span", null, "收分 · 结束回合", -1)),
                                                                Ne.value
                                                                    ? (P(), D("strong", Ku, "+" + G(t(A.value)), 1))
                                                                    : Oe("", !0),
                                                            ],
                                                            8,
                                                            Uu,
                                                        ),
                                                    ])),
                                            h("div", zu, [
                                                Z.value && !Re.value && !l.value
                                                    ? (P(),
                                                      D(
                                                          oe,
                                                          { key: 0 },
                                                          [
                                                              k(U, { name: "info", size: 12 }),
                                                              h(
                                                                  "span",
                                                                  null,
                                                                  G(
                                                                      te.value
                                                                          ? `首次收分还差 ${xs(Vn) - A.value} 分，需继续掷骰。`
                                                                          : `下次掷 ${ue.value} 颗，爆骰概率约 ${le.value}%。冒险还是收手？`,
                                                                  ),
                                                                  1,
                                                              ),
                                                          ],
                                                          64,
                                                      ))
                                                    : (P(),
                                                      D(
                                                          oe,
                                                          { key: 1 },
                                                          [
                                                              k(U, { name: "info", size: 12 }),
                                                              a[39] ||
                                                                  (a[39] = h(
                                                                      "span",
                                                                      null,
                                                                      "没有得分组合即爆骰，本回合未收分得分全部归零。",
                                                                      -1,
                                                                  )),
                                                          ],
                                                          64,
                                                      )),
                                            ]),
                                        ],
                                        2,
                                    ),
                                    h("section", Wu, [
                                        h("div", qu, [
                                            h("h2", null, [
                                                k(U, { name: "history", size: 17 }),
                                                a[44] || (a[44] = $("对局动态", -1)),
                                            ]),
                                            a[45] || (a[45] = h("span", null, "THE STORY SO FAR", -1)),
                                        ]),
                                        s.value.history.length
                                            ? (P(),
                                              D("ol", Ju, [
                                                  (P(!0),
                                                  D(
                                                      oe,
                                                      null,
                                                      qe(
                                                          s.value.history.slice(0, 5),
                                                          (f, w) => (
                                                              P(),
                                                              D("li", { key: f.id }, [
                                                                  h(
                                                                      "span",
                                                                      { class: fe(["event-icon", f.type]) },
                                                                      [
                                                                          k(
                                                                              U,
                                                                              {
                                                                                  name:
                                                                                      f.type === "bank"
                                                                                          ? "check"
                                                                                          : "close",
                                                                                  size: 11,
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ["name"],
                                                                          ),
                                                                      ],
                                                                      2,
                                                                  ),
                                                                  h("span", null, [
                                                                      h("strong", null, G(f.name), 1),
                                                                      $(
                                                                          G(
                                                                              f.type === "bank"
                                                                                  ? "落袋为安"
                                                                                  : "遭遇 Farkle",
                                                                          ),
                                                                          1,
                                                                      ),
                                                                      f.final
                                                                          ? (P(), D("small", Yu, "触发最终回合"))
                                                                          : Oe("", !0),
                                                                  ]),
                                                                  h(
                                                                      "b",
                                                                      { class: fe(f.type) },
                                                                      [
                                                                          $(
                                                                              G(
                                                                                  f.type === "bank"
                                                                                      ? "+" + t(f.points)
                                                                                      : f.points
                                                                                        ? "失去 " + t(f.points)
                                                                                        : "本回合归零",
                                                                              ),
                                                                              1,
                                                                          ),
                                                                          f.type === "bank"
                                                                              ? (P(), D("small", Xu, "分"))
                                                                              : Oe("", !0),
                                                                      ],
                                                                      2,
                                                                  ),
                                                                  h(
                                                                      "time",
                                                                      null,
                                                                      G(
                                                                          w === 0
                                                                              ? "刚刚"
                                                                              : `第 ${Math.ceil(f.turn / 2)} 轮`,
                                                                      ),
                                                                      1,
                                                                  ),
                                                              ])
                                                          ),
                                                      ),
                                                      128,
                                                  )),
                                              ]))
                                            : (P(),
                                              D("div", Gu, [
                                                  ...(a[46] ||
                                                      (a[46] = [
                                                          h("span", { class: "empty-spark" }, "✦", -1),
                                                          h("p", null, "故事还没开始。第一掷，交给你。", -1),
                                                          h("span", { class: "empty-line" }, null, -1),
                                                      ])),
                                              ])),
                                    ]),
                                ]),
                                h("aside", Qu, [
                                    h("section", Zu, [
                                        h("div", ec, [
                                            h("h2", null, [
                                                k(U, { name: "dice", size: 17 }),
                                                a[47] || (a[47] = $("计分速查", -1)),
                                            ]),
                                            a[48] ||
                                                (a[48] = h("span", { class: "reference-badge" }, "QUICK GUIDE", -1)),
                                        ]),
                                        a[54] ||
                                            (a[54] = h(
                                                "p",
                                                { class: "guide-description" },
                                                "记住这些组合，让每一掷更有把握。",
                                                -1,
                                            )),
                                        h("div", tc, [
                                            h("div", null, [
                                                k(Ft, { value: 1, decorative: "", small: "" }),
                                                a[49] || (a[49] = h("span", null, "单个 1", -1)),
                                                a[50] ||
                                                    (a[50] = h("strong", null, [$("100"), h("small", null, "分")], -1)),
                                            ]),
                                            h("div", null, [
                                                k(Ft, { value: 5, decorative: "", small: "" }),
                                                a[51] || (a[51] = h("span", null, "单个 5", -1)),
                                                a[52] ||
                                                    (a[52] = h("strong", null, [$("50"), h("small", null, "分")], -1)),
                                            ]),
                                        ]),
                                        a[55] ||
                                            (a[55] = vi(
                                                '<div class="guide-divider"></div><div class="score-rule"><span>三个 1</span><strong>300<small>分</small></strong></div><div class="score-rule"><span>三个 2 — 6</span><strong>点数 × 100</strong></div><div class="score-rule"><span>四 / 五 / 六同</span><strong class="compact-score">1,000 / 2,000 / 3,000</strong></div><div class="guide-divider"></div><div class="score-rule"><span>1–6 顺子</span><strong>1,500<small>分</small></strong></div><div class="score-rule"><span>三对<span class="rule-hint">2 + 2 + 2</span></span><strong>1,500<small>分</small></strong></div><div class="score-rule"><span>四同 + 一对</span><strong>1,500<small>分</small></strong></div><div class="score-rule"><span>两组三同</span><strong>2,500<small>分</small></strong></div>',
                                                9,
                                            )),
                                        h(
                                            "button",
                                            {
                                                class: "full-rules-link",
                                                onClick: a[8] || (a[8] = (f) => (g.value = "rules")),
                                            },
                                            [
                                                a[53] || (a[53] = $(" 查看完整规则与示例", -1)),
                                                k(U, { name: "diagonal", size: 15 }),
                                            ],
                                        ),
                                    ]),
                                    h("section", nc, [
                                        h("div", sc, [k(U, { name: "flame", size: 25 })]),
                                        a[56] ||
                                            (a[56] = h(
                                                "div",
                                                null,
                                                [
                                                    h("span", { class: "hot-eyebrow" }, "WHEN THE DICE ARE HOT"),
                                                    h("h3", null, "六骰全中，好运加码。"),
                                                    h(
                                                        "p",
                                                        null,
                                                        "六颗骰子全部计分？保留累计得分，重新掷出全部六颗骰子。冒险继续。",
                                                    ),
                                                    h("span", { class: "hot-tag" }, [
                                                        h("span", { class: "green-dot" }),
                                                        $(" HOT DICE · 火热再掷"),
                                                    ]),
                                                ],
                                                -1,
                                            )),
                                    ]),
                                    h("div", ic, [
                                        k(U, { name: "shield", size: 16 }),
                                        a[57] ||
                                            (a[57] = h(
                                                "p",
                                                null,
                                                [
                                                    $("首次收分，至少累计 "),
                                                    h("strong", null, "500 分"),
                                                    $("。"),
                                                    h("br"),
                                                    $("之后每回合随时可以见好就收。"),
                                                ],
                                                -1,
                                            )),
                                    ]),
                                    a[58] ||
                                        (a[58] = h(
                                            "div",
                                            { class: "sidebar-quote" },
                                            [
                                                h("span", null, "✧"),
                                                h("p", null, [
                                                    $("运气决定点数"),
                                                    h("br"),
                                                    h("strong", null, "勇气决定下一掷"),
                                                ]),
                                            ],
                                            -1,
                                        )),
                                ]),
                            ]),
                        ]),
                        h("footer", rc, [
                            a[63] ||
                                (a[63] = h(
                                    "span",
                                    { class: "footer-brand" },
                                    [$("farkle"), h("span", null, "."), h("small", null, "ROLL. RISK. REPEAT.")],
                                    -1,
                                )),
                            a[64] || (a[64] = h("span", null, "为每一个「再来一次」的瞬间而作。", -1)),
                            h("span", lc, [
                                a[59] || (a[59] = $("6 DICE ", -1)),
                                a[60] || (a[60] = h("i", null, "/", -1)),
                                a[61] || (a[61] = $(" 2 PLAYERS ", -1)),
                                a[62] || (a[62] = h("i", null, "/", -1)),
                                $(" " + G(t(F.value)) + " POINTS", 1),
                            ]),
                        ]),
                        k(
                            fa,
                            { name: "toast" },
                            {
                                default: Ks(() => [
                                    m.value
                                        ? (P(), D("div", oc, [k(U, { name: "check", size: 15 }), $(G(m.value), 1)]))
                                        : Oe("", !0),
                                ]),
                                _: 1,
                            },
                        ),
                        h(
                            "dialog",
                            {
                                ref_key: "dialog",
                                ref: d,
                                class: "game-dialog",
                                "aria-labelledby":
                                    g.value === "rules"
                                        ? "rules-title"
                                        : g.value === "setup"
                                          ? "setup-title"
                                          : "winner-title",
                                onCancel: Fi(T, ["prevent"]),
                                onClick:
                                    a[16] ||
                                    (a[16] = (f) => {
                                        f.target === d.value && T();
                                    }),
                            },
                            [
                                h("button", { class: "dialog-close", "aria-label": "关闭弹窗", onClick: T }, [
                                    k(U, { name: "close", size: 20 }),
                                ]),
                                g.value === "rules"
                                    ? (P(),
                                      D("section", uc, [
                                          a[70] ||
                                              (a[70] = vi(
                                                  '<div class="eyebrow">A QUICK GUIDE TO GOOD TIMES</div><h2 id="rules-title">六颗骰子，一场冒险。</h2><p class="dialog-intro">两位玩家轮流掷骰，争取先达到本局自定义获胜分数。</p><ol class="rules-steps"><li><span>01</span><div><h3>掷骰，选出得分组合</h3><p> 每回合从六颗骰子开始。每次投掷后，选出至少一颗可计分骰子；不计分的 2、3、4、6 不能单独保留。组合必须来自同一次投掷。 </p></div></li><li><span>02</span><div><h3>继续冒险，还是落袋为安？</h3><p> 继续掷剩余骰子，或点击「收分」将本回合得分加入总分。首次上分需要在同一回合累计至少 500 分，以后没有最低门槛。 </p></div></li><li><span>03</span><div><h3>小心 Farkle，也期待 Hot Dice</h3><p> 新掷的骰子完全没有计分组合，即爆骰：本回合未收分得分归零。若六颗骰子全部计分，则可以保留本回合得分，重新掷全部六颗。 </p></div></li><li><span>04</span><div><h3>最后一次机会，最后一搏</h3><p>有人达到本局目标分数后，对手还有最后一回合。最终总分较高者获胜；同分则平局。</p></div></li></ol>',
                                                  4,
                                              )),
                                          h("div", cc, [
                                              k(U, { name: "spark", size: 18 }),
                                              a[65] ||
                                                  (a[65] = h(
                                                      "p",
                                                      null,
                                                      [
                                                          $(" 例如掷出 "),
                                                          h("strong", null, "1、5、2、3、4、6"),
                                                          $("，你可以选 1 和 5 得 150 分，或选择全部六颗以顺子获得 "),
                                                          h("strong", null, "1,500 分"),
                                                          $("。不同次投掷的同点数不能拼成三同。 "),
                                                      ],
                                                      -1,
                                                  )),
                                          ]),
                                          h("p", fc, [
                                              a[67] || (a[67] = $(" 本作采用 ", -1)),
                                              h(
                                                  "a",
                                                  { href: xs(qa), target: "_blank", rel: "noopener noreferrer" },
                                                  [
                                                      a[66] || (a[66] = $("PlayMonster Farkle 规则", -1)),
                                                      k(U, { name: "diagonal", size: 11 }),
                                                  ],
                                                  8,
                                                  dc,
                                              ),
                                              a[68] ||
                                                  (a[68] = $("。不同版本的计分可能有所差异，以本页速查表为准。 ", -1)),
                                          ]),
                                          h(
                                              "button",
                                              { class: "button button-primary dialog-main-action", onClick: T },
                                              [
                                                  a[69] || (a[69] = $(" 明白了，骰子交给我", -1)),
                                                  k(U, { name: "arrow", size: 17 }),
                                              ],
                                          ),
                                      ]))
                                    : g.value === "setup"
                                      ? (P(),
                                        D(
                                            "form",
                                            { key: 1, class: "setup-content", onSubmit: Fi(_, ["prevent"]) },
                                            [
                                                a[83] || (a[83] = h("div", { class: "eyebrow" }, "A FRESH START", -1)),
                                                a[84] ||
                                                    (a[84] = h(
                                                        "h2",
                                                        { id: "setup-title" },
                                                        "新的对局，新的可能。",
                                                        -1,
                                                    )),
                                                a[85] ||
                                                    (a[85] = h(
                                                        "p",
                                                        { class: "dialog-intro" },
                                                        "选择对手和目标分数，开始一场为你定制的对决。",
                                                        -1,
                                                    )),
                                                h("div", pc, [
                                                    h(
                                                        "button",
                                                        {
                                                            type: "button",
                                                            class: fe({ chosen: x.value === "ai" }),
                                                            "aria-pressed": x.value === "ai",
                                                            onClick: a[9] || (a[9] = (f) => (x.value = "ai")),
                                                        },
                                                        [
                                                            k(U, { name: "bot", size: 26 }),
                                                            a[71] || (a[71] = h("strong", null, "挑战 NOVA", -1)),
                                                            a[72] || (a[72] = h("span", null, "单人 · 与 AI 对战", -1)),
                                                        ],
                                                        10,
                                                        hc,
                                                    ),
                                                    h(
                                                        "button",
                                                        {
                                                            type: "button",
                                                            class: fe({ chosen: x.value === "local" }),
                                                            "aria-pressed": x.value === "local",
                                                            onClick: a[10] || (a[10] = (f) => (x.value = "local")),
                                                        },
                                                        [
                                                            k(U, { name: "users", size: 26 }),
                                                            a[73] || (a[73] = h("strong", null, "和朋友来一局", -1)),
                                                            a[74] ||
                                                                (a[74] = h("span", null, "双人 · 本地轮流游玩", -1)),
                                                        ],
                                                        10,
                                                        gc,
                                                    ),
                                                ]),
                                                h("div", vc, [
                                                    a[76] ||
                                                        (a[76] = h(
                                                            "label",
                                                            { class: "field-label", for: "target-score" },
                                                            "获胜分数",
                                                            -1,
                                                        )),
                                                    h("div", mc, [
                                                        Sn(
                                                            h(
                                                                "input",
                                                                {
                                                                    id: "target-score",
                                                                    "onUpdate:modelValue":
                                                                        a[11] || (a[11] = (f) => (R.value = f)),
                                                                    type: "number",
                                                                    inputmode: "numeric",
                                                                    min: "1000",
                                                                    max: "100000",
                                                                    step: "500",
                                                                    required: "",
                                                                    "aria-invalid": !W.value,
                                                                    "aria-describedby": "target-score-hint",
                                                                },
                                                                null,
                                                                8,
                                                                yc,
                                                            ),
                                                            [[gs, R.value, void 0, { number: !0 }]],
                                                        ),
                                                        a[75] || (a[75] = h("span", null, "分", -1)),
                                                    ]),
                                                    h("div", bc, [
                                                        (P(),
                                                        D(
                                                            oe,
                                                            null,
                                                            qe([5e3, 1e4, 15e3], (f) =>
                                                                h(
                                                                    "button",
                                                                    {
                                                                        key: f,
                                                                        type: "button",
                                                                        class: fe({ chosen: Number(R.value) === f }),
                                                                        "aria-pressed": Number(R.value) === f,
                                                                        onClick: (w) => (R.value = f),
                                                                    },
                                                                    G(t(f)),
                                                                    11,
                                                                    _c,
                                                                ),
                                                            ),
                                                            64,
                                                        )),
                                                    ]),
                                                    h(
                                                        "p",
                                                        {
                                                            id: "target-score-hint",
                                                            class: fe(["field-hint", { "hint-error": !W.value }]),
                                                        },
                                                        G(
                                                            W.value
                                                                ? "可设为 1,000–100,000 分，每次递增 500 分。默认 10,000 分。"
                                                                : "请输入 1,000–100,000 之间的 500 倍数。",
                                                        ),
                                                        3,
                                                    ),
                                                ]),
                                                x.value === "ai"
                                                    ? (P(),
                                                      D(
                                                          oe,
                                                          { key: 0 },
                                                          [
                                                              a[78] ||
                                                                  (a[78] = h(
                                                                      "label",
                                                                      { class: "field-label", for: "ai-difficulty" },
                                                                      "AI 风格",
                                                                      -1,
                                                                  )),
                                                              Sn(
                                                                  h(
                                                                      "select",
                                                                      {
                                                                          id: "ai-difficulty",
                                                                          "onUpdate:modelValue":
                                                                              a[12] || (a[12] = (f) => (E.value = f)),
                                                                      },
                                                                      [
                                                                          ...(a[77] ||
                                                                              (a[77] = [
                                                                                  h(
                                                                                      "option",
                                                                                      { value: "cautious" },
                                                                                      "稳健型 — 见好就收",
                                                                                      -1,
                                                                                  ),
                                                                                  h(
                                                                                      "option",
                                                                                      { value: "balanced" },
                                                                                      "均衡型 — 权衡风险与回报",
                                                                                      -1,
                                                                                  ),
                                                                                  h(
                                                                                      "option",
                                                                                      { value: "bold" },
                                                                                      "冒险型 — 让好运再飞一会",
                                                                                      -1,
                                                                                  ),
                                                                              ])),
                                                                      ],
                                                                      512,
                                                                  ),
                                                                  [[$a, E.value]],
                                                              ),
                                                          ],
                                                          64,
                                                      ))
                                                    : (P(),
                                                      D("div", Sc, [
                                                          h("label", xc, [
                                                              a[79] || (a[79] = $("玩家一", -1)),
                                                              Sn(
                                                                  h(
                                                                      "input",
                                                                      {
                                                                          "onUpdate:modelValue":
                                                                              a[13] ||
                                                                              (a[13] = (f) => (M.value[0] = f)),
                                                                          maxlength: "24",
                                                                          placeholder: "玩家一",
                                                                          autocomplete: "off",
                                                                      },
                                                                      null,
                                                                      512,
                                                                  ),
                                                                  [[gs, M.value[0]]],
                                                              ),
                                                          ]),
                                                          h("label", wc, [
                                                              a[80] || (a[80] = $("玩家二", -1)),
                                                              Sn(
                                                                  h(
                                                                      "input",
                                                                      {
                                                                          "onUpdate:modelValue":
                                                                              a[14] ||
                                                                              (a[14] = (f) => (M.value[1] = f)),
                                                                          maxlength: "24",
                                                                          placeholder: "玩家二",
                                                                          autocomplete: "off",
                                                                      },
                                                                      null,
                                                                      512,
                                                                  ),
                                                                  [[gs, M.value[1]]],
                                                              ),
                                                          ]),
                                                      ])),
                                                h("p", Tc, [
                                                    k(U, { name: "info", size: 14 }),
                                                    a[81] || (a[81] = $("开始新对局将重置当前得分及对局记录。", -1)),
                                                ]),
                                                h(
                                                    "button",
                                                    {
                                                        type: "submit",
                                                        class: "button button-primary dialog-main-action",
                                                        disabled: !W.value,
                                                    },
                                                    [
                                                        a[82] || (a[82] = $(" 开始新对局", -1)),
                                                        k(U, { name: "arrow", size: 18 }),
                                                    ],
                                                    8,
                                                    Cc,
                                                ),
                                            ],
                                            32,
                                        ))
                                      : g.value === "winner"
                                        ? (P(),
                                          D("section", Ec, [
                                              h("div", Ac, [k(U, { name: "trophy", size: 45 })]),
                                              a[87] ||
                                                  (a[87] = h(
                                                      "div",
                                                      { class: "eyebrow" },
                                                      "WHAT A GAME. WHAT A JOURNEY.",
                                                      -1,
                                                  )),
                                              h("h2", Mc, G(gn.value), 1),
                                              h(
                                                  "p",
                                                  Oc,
                                                  G(
                                                      s.value.winner === "tie"
                                                          ? "旗鼓相当的对手，值得再来一局。"
                                                          : "每一次果断收手，每一次勇敢再掷，都算数。",
                                                  ),
                                                  1,
                                              ),
                                              h("div", Ic, [
                                                  (P(!0),
                                                  D(
                                                      oe,
                                                      null,
                                                      qe(
                                                          s.value.players,
                                                          (f, w) => (
                                                              P(),
                                                              D(
                                                                  "div",
                                                                  {
                                                                      key: w,
                                                                      class: fe({ victorious: s.value.winner === w }),
                                                                  },
                                                                  [
                                                                      h("span", null, G(f.name), 1),
                                                                      h("strong", null, G(t(f.score)), 1),
                                                                      h(
                                                                          "small",
                                                                          null,
                                                                          G(s.value.winner === w ? "WINNER" : "POINTS"),
                                                                          1,
                                                                      ),
                                                                  ],
                                                                  2,
                                                              )
                                                          ),
                                                      ),
                                                      128,
                                                  )),
                                              ]),
                                              h(
                                                  "button",
                                                  {
                                                      class: "button button-primary dialog-main-action",
                                                      onClick: a[15] || (a[15] = (f) => S()),
                                                  },
                                                  [
                                                      a[86] || (a[86] = $(" 再来一局", -1)),
                                                      k(U, { name: "restart", size: 17 }),
                                                  ],
                                              ),
                                              h(
                                                  "button",
                                                  { class: "text-button return-table", onClick: T },
                                                  "回到牌桌查看记录",
                                              ),
                                          ]))
                                        : Oe("", !0),
                            ],
                            40,
                            ac,
                        ),
                    ])
                )
            );
        },
    };
ja(kc).mount("#app");
