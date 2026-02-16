import { getCurrentScope as nt, onScopeDispose as rt, watch as G, computed as H, toValue as tt, shallowRef as ot, getCurrentInstance as it, onMounted as et, defineComponent as st, useTemplateRef as L, reactive as ut, nextTick as U, onBeforeUnmount as at, createElementBlock as I, openBlock as _, normalizeStyle as B, createCommentVNode as V, createTextVNode as T, renderSlot as O, toDisplayString as E, Fragment as S } from "vue";
var K = {}, Z;
function lt() {
  return Z || (Z = 1, function() {
    if (typeof window != "object")
      return;
    if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
      "isIntersecting" in window.IntersectionObserverEntry.prototype || Object.defineProperty(
        window.IntersectionObserverEntry.prototype,
        "isIntersecting",
        {
          get: function() {
            return this.intersectionRatio > 0;
          }
        }
      );
      return;
    }
    function n(t) {
      try {
        return t.defaultView && t.defaultView.frameElement || null;
      } catch {
        return null;
      }
    }
    var a = function(t) {
      for (var e = t, r = n(e); r; )
        e = r.ownerDocument, r = n(e);
      return e;
    }(window.document), u = [], l = null, v = null;
    function R(t) {
      this.time = t.time, this.target = t.target, this.rootBounds = N(t.rootBounds), this.boundingClientRect = N(t.boundingClientRect), this.intersectionRect = N(t.intersectionRect || k()), this.isIntersecting = !!t.intersectionRect;
      var e = this.boundingClientRect, r = e.width * e.height, i = this.intersectionRect, s = i.width * i.height;
      r ? this.intersectionRatio = Number((s / r).toFixed(4)) : this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
    function c(t, e) {
      var r = e || {};
      if (typeof t != "function")
        throw new Error("callback must be a function");
      if (r.root && r.root.nodeType != 1 && r.root.nodeType != 9)
        throw new Error("root must be a Document or Element");
      this._checkForIntersections = x(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      ), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(r.rootMargin), this.thresholds = this._initThresholds(r.threshold), this.root = r.root || null, this.rootMargin = this._rootMarginValues.map(function(i) {
        return i.value + i.unit;
      }).join(" "), this._monitoringDocuments = [], this._monitoringUnsubscribes = [];
    }
    c.prototype.THROTTLE_TIMEOUT = 100, c.prototype.POLL_INTERVAL = null, c.prototype.USE_MUTATION_OBSERVER = !0, c._setupCrossOriginUpdater = function() {
      return l || (l = function(t, e) {
        !t || !e ? v = k() : v = F(t, e), u.forEach(function(r) {
          r._checkForIntersections();
        });
      }), l;
    }, c._resetCrossOriginUpdater = function() {
      l = null, v = null;
    }, c.prototype.observe = function(t) {
      var e = this._observationTargets.some(function(r) {
        return r.element == t;
      });
      if (!e) {
        if (!(t && t.nodeType == 1))
          throw new Error("target must be an Element");
        this._registerInstance(), this._observationTargets.push({ element: t, entry: null }), this._monitorIntersections(t.ownerDocument), this._checkForIntersections();
      }
    }, c.prototype.unobserve = function(t) {
      this._observationTargets = this._observationTargets.filter(function(e) {
        return e.element != t;
      }), this._unmonitorIntersections(t.ownerDocument), this._observationTargets.length == 0 && this._unregisterInstance();
    }, c.prototype.disconnect = function() {
      this._observationTargets = [], this._unmonitorAllIntersections(), this._unregisterInstance();
    }, c.prototype.takeRecords = function() {
      var t = this._queuedEntries.slice();
      return this._queuedEntries = [], t;
    }, c.prototype._initThresholds = function(t) {
      var e = t || [0];
      return Array.isArray(e) || (e = [e]), e.sort().filter(function(r, i, s) {
        if (typeof r != "number" || isNaN(r) || r < 0 || r > 1)
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        return r !== s[i - 1];
      });
    }, c.prototype._parseRootMargin = function(t) {
      var e = t || "0px", r = e.split(/\s+/).map(function(i) {
        var s = /^(-?\d*\.?\d+)(px|%)$/.exec(i);
        if (!s)
          throw new Error("rootMargin must be specified in pixels or percent");
        return { value: parseFloat(s[1]), unit: s[2] };
      });
      return r[1] = r[1] || r[0], r[2] = r[2] || r[0], r[3] = r[3] || r[1], r;
    }, c.prototype._monitorIntersections = function(t) {
      var e = t.defaultView;
      if (e && this._monitoringDocuments.indexOf(t) == -1) {
        var r = this._checkForIntersections, i = null, s = null;
        this.POLL_INTERVAL ? i = e.setInterval(r, this.POLL_INTERVAL) : (b(e, "resize", r, !0), b(t, "scroll", r, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in e && (s = new e.MutationObserver(r), s.observe(t, {
          attributes: !0,
          childList: !0,
          characterData: !0,
          subtree: !0
        }))), this._monitoringDocuments.push(t), this._monitoringUnsubscribes.push(function() {
          var p = t.defaultView;
          p && (i && p.clearInterval(i), m(p, "resize", r, !0)), m(t, "scroll", r, !0), s && s.disconnect();
        });
        var d = this.root && (this.root.ownerDocument || this.root) || a;
        if (t != d) {
          var h = n(t);
          h && this._monitorIntersections(h.ownerDocument);
        }
      }
    }, c.prototype._unmonitorIntersections = function(t) {
      var e = this._monitoringDocuments.indexOf(t);
      if (e != -1) {
        var r = this.root && (this.root.ownerDocument || this.root) || a, i = this._observationTargets.some(function(h) {
          var p = h.element.ownerDocument;
          if (p == t)
            return !0;
          for (; p && p != r; ) {
            var w = n(p);
            if (p = w && w.ownerDocument, p == t)
              return !0;
          }
          return !1;
        });
        if (!i) {
          var s = this._monitoringUnsubscribes[e];
          if (this._monitoringDocuments.splice(e, 1), this._monitoringUnsubscribes.splice(e, 1), s(), t != r) {
            var d = n(t);
            d && this._unmonitorIntersections(d.ownerDocument);
          }
        }
      }
    }, c.prototype._unmonitorAllIntersections = function() {
      var t = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0, this._monitoringUnsubscribes.length = 0;
      for (var e = 0; e < t.length; e++)
        t[e]();
    }, c.prototype._checkForIntersections = function() {
      if (!(!this.root && l && !v)) {
        var t = this._rootIsInDom(), e = t ? this._getRootRect() : k();
        this._observationTargets.forEach(function(r) {
          var i = r.element, s = M(i), d = this._rootContainsTarget(i), h = r.entry, p = t && d && this._computeTargetAndRootIntersection(i, s, e), w = null;
          this._rootContainsTarget(i) ? (!l || this.root) && (w = e) : w = k();
          var D = r.entry = new R({
            time: o(),
            target: i,
            boundingClientRect: s,
            rootBounds: w,
            intersectionRect: p
          });
          h ? t && d ? this._hasCrossedThreshold(h, D) && this._queuedEntries.push(D) : h && h.isIntersecting && this._queuedEntries.push(D) : this._queuedEntries.push(D);
        }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this);
      }
    }, c.prototype._computeTargetAndRootIntersection = function(t, e, r) {
      if (window.getComputedStyle(t).display != "none") {
        for (var i = e, s = g(t), d = !1; !d && s; ) {
          var h = null, p = s.nodeType == 1 ? window.getComputedStyle(s) : {};
          if (p.display == "none") return null;
          if (s == this.root || s.nodeType == /* DOCUMENT */
          9)
            if (d = !0, s == this.root || s == a)
              l && !this.root ? !v || v.width == 0 && v.height == 0 ? (s = null, h = null, i = null) : h = v : h = r;
            else {
              var w = g(s), D = w && M(w), z = w && this._computeTargetAndRootIntersection(w, D, r);
              D && z ? (s = w, h = F(D, z)) : (s = null, i = null);
            }
          else {
            var q = s.ownerDocument;
            s != q.body && s != q.documentElement && p.overflow != "visible" && (h = M(s));
          }
          if (h && (i = y(h, i)), !i) break;
          s = s && g(s);
        }
        return i;
      }
    }, c.prototype._getRootRect = function() {
      var t;
      if (this.root && !A(this.root))
        t = M(this.root);
      else {
        var e = A(this.root) ? this.root : a, r = e.documentElement, i = e.body;
        t = {
          top: 0,
          left: 0,
          right: r.clientWidth || i.clientWidth,
          width: r.clientWidth || i.clientWidth,
          bottom: r.clientHeight || i.clientHeight,
          height: r.clientHeight || i.clientHeight
        };
      }
      return this._expandRectByRootMargin(t);
    }, c.prototype._expandRectByRootMargin = function(t) {
      var e = this._rootMarginValues.map(function(i, s) {
        return i.unit == "px" ? i.value : i.value * (s % 2 ? t.width : t.height) / 100;
      }), r = {
        top: t.top - e[0],
        right: t.right + e[1],
        bottom: t.bottom + e[2],
        left: t.left - e[3]
      };
      return r.width = r.right - r.left, r.height = r.bottom - r.top, r;
    }, c.prototype._hasCrossedThreshold = function(t, e) {
      var r = t && t.isIntersecting ? t.intersectionRatio || 0 : -1, i = e.isIntersecting ? e.intersectionRatio || 0 : -1;
      if (r !== i)
        for (var s = 0; s < this.thresholds.length; s++) {
          var d = this.thresholds[s];
          if (d == r || d == i || d < r != d < i)
            return !0;
        }
    }, c.prototype._rootIsInDom = function() {
      return !this.root || f(a, this.root);
    }, c.prototype._rootContainsTarget = function(t) {
      var e = this.root && (this.root.ownerDocument || this.root) || a;
      return f(e, t) && (!this.root || e == t.ownerDocument);
    }, c.prototype._registerInstance = function() {
      u.indexOf(this) < 0 && u.push(this);
    }, c.prototype._unregisterInstance = function() {
      var t = u.indexOf(this);
      t != -1 && u.splice(t, 1);
    };
    function o() {
      return window.performance && performance.now && performance.now();
    }
    function x(t, e) {
      var r = null;
      return function() {
        r || (r = setTimeout(function() {
          t(), r = null;
        }, e));
      };
    }
    function b(t, e, r, i) {
      typeof t.addEventListener == "function" ? t.addEventListener(e, r, i) : typeof t.attachEvent == "function" && t.attachEvent("on" + e, r);
    }
    function m(t, e, r, i) {
      typeof t.removeEventListener == "function" ? t.removeEventListener(e, r, i) : typeof t.detachEvent == "function" && t.detachEvent("on" + e, r);
    }
    function y(t, e) {
      var r = Math.max(t.top, e.top), i = Math.min(t.bottom, e.bottom), s = Math.max(t.left, e.left), d = Math.min(t.right, e.right), h = d - s, p = i - r;
      return h >= 0 && p >= 0 && {
        top: r,
        bottom: i,
        left: s,
        right: d,
        width: h,
        height: p
      } || null;
    }
    function M(t) {
      var e;
      try {
        e = t.getBoundingClientRect();
      } catch {
      }
      return e ? (e.width && e.height || (e = {
        top: e.top,
        right: e.right,
        bottom: e.bottom,
        left: e.left,
        width: e.right - e.left,
        height: e.bottom - e.top
      }), e) : k();
    }
    function k() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    function N(t) {
      return !t || "x" in t ? t : {
        top: t.top,
        y: t.top,
        bottom: t.bottom,
        left: t.left,
        x: t.left,
        right: t.right,
        width: t.width,
        height: t.height
      };
    }
    function F(t, e) {
      var r = e.top - t.top, i = e.left - t.left;
      return {
        top: r,
        left: i,
        height: e.height,
        width: e.width,
        bottom: r + e.height,
        right: i + e.width
      };
    }
    function f(t, e) {
      for (var r = e; r; ) {
        if (r == t) return !0;
        r = g(r);
      }
      return !1;
    }
    function g(t) {
      var e = t.parentNode;
      return t.nodeType == /* DOCUMENT */
      9 && t != a ? n(t) : (e && e.assignedSlot && (e = e.assignedSlot.parentNode), e && e.nodeType == 11 && e.host ? e.host : e);
    }
    function A(t) {
      return t && t.nodeType === 9;
    }
    window.IntersectionObserver = c, window.IntersectionObserverEntry = R;
  }()), K;
}
lt();
let P = null;
const W = /* @__PURE__ */ new Map();
function ct(n) {
  n.forEach((a) => {
    const u = W.get(a.target);
    u && u(a);
  });
}
function j() {
  return P || (P = new IntersectionObserver(ct)), P;
}
var J;
(function(n) {
  n[n.HIGH_SURROGATE_START = 55296] = "HIGH_SURROGATE_START", n[n.HIGH_SURROGATE_END = 56319] = "HIGH_SURROGATE_END", n[n.LOW_SURROGATE_START = 56320] = "LOW_SURROGATE_START", n[n.REGIONAL_INDICATOR_START = 127462] = "REGIONAL_INDICATOR_START", n[n.REGIONAL_INDICATOR_END = 127487] = "REGIONAL_INDICATOR_END", n[n.FITZPATRICK_MODIFIER_START = 127995] = "FITZPATRICK_MODIFIER_START", n[n.FITZPATRICK_MODIFIER_END = 127999] = "FITZPATRICK_MODIFIER_END", n[n.VARIATION_MODIFIER_START = 65024] = "VARIATION_MODIFIER_START", n[n.VARIATION_MODIFIER_END = 65039] = "VARIATION_MODIFIER_END", n[n.DIACRITICAL_MARKS_START = 8400] = "DIACRITICAL_MARKS_START", n[n.DIACRITICAL_MARKS_END = 8447] = "DIACRITICAL_MARKS_END", n[n.SUBDIVISION_INDICATOR_START = 127988] = "SUBDIVISION_INDICATOR_START", n[n.TAGS_START = 917504] = "TAGS_START", n[n.TAGS_END = 917631] = "TAGS_END", n[n.ZWJ = 8205] = "ZWJ";
})(J || (J = {}));
const ft = Object.freeze([776, 2359, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]);
var Q;
function ht(n) {
  if (typeof n != "string") throw new TypeError("string cannot be undefined or null");
  const a = [];
  let u = 0, l = 0;
  for (; u < n.length; ) l += dt(u + l, n), wt(n[u + l]) && l++, mt(n[u + l]) && l++, It(n[u + l]) && l++, Rt(n[u + l]) ? l++ : (a.push(n.substring(u, u + l)), u += l, l = 0);
  return a;
}
function dt(n, a) {
  const u = a[n];
  if (!pt(u) || n === a.length - 1) return 1;
  const l = u + a[n + 1];
  let v = a.substring(n + 2, n + 5);
  return X(l) && X(v) ? 4 : vt(l) && _t(v) ? a.slice(n).indexOf(String.fromCodePoint(917631)) + 2 : gt(v) ? 4 : 2;
}
function pt(n) {
  return n && C(n[0].charCodeAt(0), 55296, 56319);
}
function X(n) {
  return C($(n), 127462, 127487);
}
function vt(n) {
  return C($(n), 127988, 127988);
}
function gt(n) {
  return C($(n), 127995, 127999);
}
function mt(n) {
  return typeof n == "string" && C(n.charCodeAt(0), 65024, 65039);
}
function It(n) {
  return typeof n == "string" && C(n.charCodeAt(0), 8400, 8447);
}
function _t(n) {
  const a = n.codePointAt(0);
  return typeof n == "string" && typeof a == "number" && C(a, 917504, 917631);
}
function wt(n) {
  return typeof n == "string" && ft.includes(n.charCodeAt(0));
}
function Rt(n) {
  return typeof n == "string" && n.charCodeAt(0) === 8205;
}
function $(n) {
  return (n.charCodeAt(0) - 55296 << 10) + (n.charCodeAt(1) - 56320) + 65536;
}
function C(n, a, u) {
  return n >= a && n <= u;
}
(function(n) {
  n[n.unit_1 = 1] = "unit_1", n[n.unit_2 = 2] = "unit_2", n[n.unit_4 = 4] = "unit_4";
})(Q || (Q = {}));
function Tt(n, a) {
  return nt() ? (rt(n, a), !0) : !1;
}
const bt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const yt = bt ? window : void 0;
function Y(n) {
  var a;
  const u = tt(n);
  return (a = u == null ? void 0 : u.$el) !== null && a !== void 0 ? a : u;
}
// @__NO_SIDE_EFFECTS__
function Et() {
  const n = ot(!1), a = it();
  return a && et(() => {
    n.value = !0;
  }, a), n;
}
// @__NO_SIDE_EFFECTS__
function At(n) {
  const a = /* @__PURE__ */ Et();
  return H(() => (a.value, !!n()));
}
function Ot(n, a, u = {}) {
  const { window: l = yt, ...v } = u;
  let R;
  const c = /* @__PURE__ */ At(() => l && "ResizeObserver" in l), o = () => {
    R && (R.disconnect(), R = void 0);
  }, x = G(H(() => {
    const m = tt(n);
    return Array.isArray(m) ? m.map((y) => Y(y)) : [Y(m)];
  }), (m) => {
    if (o(), c.value && l) {
      R = new ResizeObserver(a);
      for (const y of m) y && R.observe(y, v);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), b = () => {
    o(), x();
  };
  return Tt(b), {
    isSupported: c,
    stop: b
  };
}
const xt = {
  key: 3,
  ref: "displayRef"
}, Dt = /* @__PURE__ */ st({
  __name: "text-ellipsis-center",
  props: {
    text: {},
    rows: { default: 1 },
    direction: { default: "middle" },
    expanded: { type: Boolean, default: !1 },
    useObserver: { type: Boolean, default: !1 },
    autoResize: { type: Boolean, default: !0 }
  },
  emits: ["update:expanded"],
  setup(n, { emit: a }) {
    const u = n, l = L("containerRef"), v = L("fullMeasureRef"), R = L("singleRowMeasureRef"), c = L("midMeasureRef");
    Ot(l, () => {
      o.status = 0, y();
    });
    const o = ut({
      contentChars: [],
      maxHeight: 0,
      walkingIndexes: [0, 0],
      status: 100,
      containerStyle: {
        overflow: "hidden",
        lineHeight: "1.5",
        wordBreak: "break-all"
      },
      measureStyle: {
        visibility: "hidden",
        whiteSpace: "inherit",
        lineHeight: "inherit",
        fontSize: "inherit"
      },
      init: !1
    }), x = H(() => Math.ceil((o.walkingIndexes[0] + o.walkingIndexes[1]) / 2)), b = H(
      () => o.contentChars.slice(0, x.value).join("")
    ), m = H(
      () => o.contentChars.slice(-x.value).join("")
    ), y = () => {
      o.status = 1, o.walkingIndexes = [
        0,
        u.direction === "middle" ? Math.ceil(o.contentChars.length / 2) : o.contentChars.length
      ];
    }, M = async () => {
      var f, g;
      if (o.status === 1) {
        const A = ((f = v.value) == null ? void 0 : f.offsetHeight) ?? 0, e = (((g = R.value) == null ? void 0 : g.offsetHeight) ?? 0) * u.rows;
        A <= e ? o.status = 100 : (o.maxHeight = e, o.status = 2);
      }
    }, k = async () => {
      var f;
      if (o.status === 2) {
        const g = o.walkingIndexes[1] - o.walkingIndexes[0], A = ((f = c.value) == null ? void 0 : f.offsetHeight) ?? 0;
        g > 1 ? A > o.maxHeight ? o.walkingIndexes = [o.walkingIndexes[0], x.value] : o.walkingIndexes = [x.value, o.walkingIndexes[1]] : (A > o.maxHeight ? o.walkingIndexes = [
          o.walkingIndexes[0],
          o.walkingIndexes[0]
        ] : o.walkingIndexes = [
          o.walkingIndexes[1],
          o.walkingIndexes[1]
        ], o.status = 99);
      }
    }, N = async () => {
      await U();
      const f = l.value;
      if (!f) return;
      j().observe(f), W.set(f, (A) => {
        if (A.isIntersecting) {
          if (o.init) return;
          y(), o.status = 1, o.init = !0;
        }
      });
    }, F = () => {
      const f = l.value;
      if (!f) return;
      j().unobserve(f), W.delete(f);
    };
    return G(
      () => u.text,
      async (f) => {
        o.contentChars = ht(f), o.init && (o.init = !1, F(), await U(), N());
      },
      { immediate: !0 }
    ), G(
      () => o.status,
      async () => {
        await U(), M();
      }
    ), G([() => o.status, () => o.walkingIndexes], () => {
      o.status === 2 && U(() => {
        k();
      });
    }), et(() => {
      u.useObserver ? (o.status = 0, N()) : y();
    }), at(() => {
      u.useObserver && F();
    }), (f, g) => (_(), I("div", {
      ref_key: "containerRef",
      ref: l,
      style: B(o.containerStyle)
    }, [
      o.status === 1 ? (_(), I("div", {
        key: 0,
        ref_key: "fullMeasureRef",
        ref: v,
        style: B(o.measureStyle),
        "aria-hidden": "true"
      }, [
        T(E(u.text) + " ", 1),
        O(f.$slots, "expandNode")
      ], 4)) : V("", !0),
      o.status === 1 ? (_(), I("div", {
        key: 1,
        ref_key: "singleRowMeasureRef",
        ref: R,
        style: B(o.measureStyle),
        "aria-hidden": "true"
      }, [
        g[0] || (g[0] = T("  ", -1)),
        O(f.$slots, "expandNode")
      ], 4)) : V("", !0),
      o.status === 2 ? (_(), I("div", {
        key: 2,
        ref_key: "midMeasureRef",
        ref: c,
        style: B([o.measureStyle, { "word-break": "break-all" }]),
        "aria-hidden": "true"
      }, [
        u.direction === "start" ? (_(), I(S, { key: 0 }, [
          O(f.$slots, "expandNode"),
          T("..." + E(m.value), 1)
        ], 64)) : u.direction === "end" ? (_(), I(S, { key: 1 }, [
          T(E(b.value) + "...", 1),
          O(f.$slots, "expandNode")
        ], 64)) : (_(), I(S, { key: 2 }, [
          T(E(b.value) + "...", 1),
          O(f.$slots, "expandNode"),
          T(E(m.value), 1)
        ], 64))
      ], 4)) : (_(), I("div", xt, [
        u.expanded || o.status === 100 ? (_(), I(S, { key: 0 }, [
          T(E(u.text) + " ", 1),
          o.status === 99 ? O(f.$slots, "collapseNode", { key: 0 }) : V("", !0)
        ], 64)) : o.status === 99 ? (_(), I(S, { key: 1 }, [
          u.direction === "start" ? (_(), I(S, { key: 0 }, [
            O(f.$slots, "expandNode"),
            T("..." + E(m.value), 1)
          ], 64)) : u.direction === "end" ? (_(), I(S, { key: 1 }, [
            T(E(b.value) + "...", 1),
            O(f.$slots, "expandNode")
          ], 64)) : (_(), I(S, { key: 2 }, [
            T(E(b.value) + "...", 1),
            O(f.$slots, "expandNode"),
            T(E(m.value), 1)
          ], 64))
        ], 64)) : V("", !0)
      ], 512))
    ], 4));
  }
});
function St(n) {
  n.component("TextEllipsisCenter", Dt);
}
const Ct = {
  install: St
};
export {
  Dt as TextEllipsisCenter,
  Ct as default
};
