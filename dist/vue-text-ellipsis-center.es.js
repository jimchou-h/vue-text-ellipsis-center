import { getCurrentScope as nt, onScopeDispose as rt, watch as V, computed as H, toValue as tt, shallowRef as ot, getCurrentInstance as it, onMounted as et, defineComponent as st, useTemplateRef as L, reactive as ut, nextTick as U, onBeforeUnmount as at, createElementBlock as I, openBlock as _, normalizeStyle as B, createCommentVNode as G, createTextVNode as T, renderSlot as O, toDisplayString as E, Fragment as S } from "vue";
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
    function e(t) {
      try {
        return t.defaultView && t.defaultView.frameElement || null;
      } catch {
        return null;
      }
    }
    var a = function(t) {
      for (var n = t, r = e(n); r; )
        n = r.ownerDocument, r = e(n);
      return n;
    }(window.document), u = [], l = null, v = null;
    function R(t) {
      this.time = t.time, this.target = t.target, this.rootBounds = N(t.rootBounds), this.boundingClientRect = N(t.boundingClientRect), this.intersectionRect = N(t.intersectionRect || k()), this.isIntersecting = !!t.intersectionRect;
      var n = this.boundingClientRect, r = n.width * n.height, i = this.intersectionRect, s = i.width * i.height;
      r ? this.intersectionRatio = Number((s / r).toFixed(4)) : this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
    function c(t, n) {
      var r = n || {};
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
      return l || (l = function(t, n) {
        !t || !n ? v = k() : v = F(t, n), u.forEach(function(r) {
          r._checkForIntersections();
        });
      }), l;
    }, c._resetCrossOriginUpdater = function() {
      l = null, v = null;
    }, c.prototype.observe = function(t) {
      var n = this._observationTargets.some(function(r) {
        return r.element == t;
      });
      if (!n) {
        if (!(t && t.nodeType == 1))
          throw new Error("target must be an Element");
        this._registerInstance(), this._observationTargets.push({ element: t, entry: null }), this._monitorIntersections(t.ownerDocument), this._checkForIntersections();
      }
    }, c.prototype.unobserve = function(t) {
      this._observationTargets = this._observationTargets.filter(function(n) {
        return n.element != t;
      }), this._unmonitorIntersections(t.ownerDocument), this._observationTargets.length == 0 && this._unregisterInstance();
    }, c.prototype.disconnect = function() {
      this._observationTargets = [], this._unmonitorAllIntersections(), this._unregisterInstance();
    }, c.prototype.takeRecords = function() {
      var t = this._queuedEntries.slice();
      return this._queuedEntries = [], t;
    }, c.prototype._initThresholds = function(t) {
      var n = t || [0];
      return Array.isArray(n) || (n = [n]), n.sort().filter(function(r, i, s) {
        if (typeof r != "number" || isNaN(r) || r < 0 || r > 1)
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        return r !== s[i - 1];
      });
    }, c.prototype._parseRootMargin = function(t) {
      var n = t || "0px", r = n.split(/\s+/).map(function(i) {
        var s = /^(-?\d*\.?\d+)(px|%)$/.exec(i);
        if (!s)
          throw new Error("rootMargin must be specified in pixels or percent");
        return { value: parseFloat(s[1]), unit: s[2] };
      });
      return r[1] = r[1] || r[0], r[2] = r[2] || r[0], r[3] = r[3] || r[1], r;
    }, c.prototype._monitorIntersections = function(t) {
      var n = t.defaultView;
      if (n && this._monitoringDocuments.indexOf(t) == -1) {
        var r = this._checkForIntersections, i = null, s = null;
        this.POLL_INTERVAL ? i = n.setInterval(r, this.POLL_INTERVAL) : (b(n, "resize", r, !0), b(t, "scroll", r, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in n && (s = new n.MutationObserver(r), s.observe(t, {
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
          var f = e(t);
          f && this._monitorIntersections(f.ownerDocument);
        }
      }
    }, c.prototype._unmonitorIntersections = function(t) {
      var n = this._monitoringDocuments.indexOf(t);
      if (n != -1) {
        var r = this.root && (this.root.ownerDocument || this.root) || a, i = this._observationTargets.some(function(f) {
          var p = f.element.ownerDocument;
          if (p == t)
            return !0;
          for (; p && p != r; ) {
            var w = e(p);
            if (p = w && w.ownerDocument, p == t)
              return !0;
          }
          return !1;
        });
        if (!i) {
          var s = this._monitoringUnsubscribes[n];
          if (this._monitoringDocuments.splice(n, 1), this._monitoringUnsubscribes.splice(n, 1), s(), t != r) {
            var d = e(t);
            d && this._unmonitorIntersections(d.ownerDocument);
          }
        }
      }
    }, c.prototype._unmonitorAllIntersections = function() {
      var t = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0, this._monitoringUnsubscribes.length = 0;
      for (var n = 0; n < t.length; n++)
        t[n]();
    }, c.prototype._checkForIntersections = function() {
      if (!(!this.root && l && !v)) {
        var t = this._rootIsInDom(), n = t ? this._getRootRect() : k();
        this._observationTargets.forEach(function(r) {
          var i = r.element, s = M(i), d = this._rootContainsTarget(i), f = r.entry, p = t && d && this._computeTargetAndRootIntersection(i, s, n), w = null;
          this._rootContainsTarget(i) ? (!l || this.root) && (w = n) : w = k();
          var D = r.entry = new R({
            time: o(),
            target: i,
            boundingClientRect: s,
            rootBounds: w,
            intersectionRect: p
          });
          f ? t && d ? this._hasCrossedThreshold(f, D) && this._queuedEntries.push(D) : f && f.isIntersecting && this._queuedEntries.push(D) : this._queuedEntries.push(D);
        }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this);
      }
    }, c.prototype._computeTargetAndRootIntersection = function(t, n, r) {
      if (window.getComputedStyle(t).display != "none") {
        for (var i = n, s = g(t), d = !1; !d && s; ) {
          var f = null, p = s.nodeType == 1 ? window.getComputedStyle(s) : {};
          if (p.display == "none") return null;
          if (s == this.root || s.nodeType == /* DOCUMENT */
          9)
            if (d = !0, s == this.root || s == a)
              l && !this.root ? !v || v.width == 0 && v.height == 0 ? (s = null, f = null, i = null) : f = v : f = r;
            else {
              var w = g(s), D = w && M(w), z = w && this._computeTargetAndRootIntersection(w, D, r);
              D && z ? (s = w, f = F(D, z)) : (s = null, i = null);
            }
          else {
            var q = s.ownerDocument;
            s != q.body && s != q.documentElement && p.overflow != "visible" && (f = M(s));
          }
          if (f && (i = y(f, i)), !i) break;
          s = s && g(s);
        }
        return i;
      }
    }, c.prototype._getRootRect = function() {
      var t;
      if (this.root && !A(this.root))
        t = M(this.root);
      else {
        var n = A(this.root) ? this.root : a, r = n.documentElement, i = n.body;
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
      var n = this._rootMarginValues.map(function(i, s) {
        return i.unit == "px" ? i.value : i.value * (s % 2 ? t.width : t.height) / 100;
      }), r = {
        top: t.top - n[0],
        right: t.right + n[1],
        bottom: t.bottom + n[2],
        left: t.left - n[3]
      };
      return r.width = r.right - r.left, r.height = r.bottom - r.top, r;
    }, c.prototype._hasCrossedThreshold = function(t, n) {
      var r = t && t.isIntersecting ? t.intersectionRatio || 0 : -1, i = n.isIntersecting ? n.intersectionRatio || 0 : -1;
      if (r !== i)
        for (var s = 0; s < this.thresholds.length; s++) {
          var d = this.thresholds[s];
          if (d == r || d == i || d < r != d < i)
            return !0;
        }
    }, c.prototype._rootIsInDom = function() {
      return !this.root || h(a, this.root);
    }, c.prototype._rootContainsTarget = function(t) {
      var n = this.root && (this.root.ownerDocument || this.root) || a;
      return h(n, t) && (!this.root || n == t.ownerDocument);
    }, c.prototype._registerInstance = function() {
      u.indexOf(this) < 0 && u.push(this);
    }, c.prototype._unregisterInstance = function() {
      var t = u.indexOf(this);
      t != -1 && u.splice(t, 1);
    };
    function o() {
      return window.performance && performance.now && performance.now();
    }
    function x(t, n) {
      var r = null;
      return function() {
        r || (r = setTimeout(function() {
          t(), r = null;
        }, n));
      };
    }
    function b(t, n, r, i) {
      typeof t.addEventListener == "function" ? t.addEventListener(n, r, i) : typeof t.attachEvent == "function" && t.attachEvent("on" + n, r);
    }
    function m(t, n, r, i) {
      typeof t.removeEventListener == "function" ? t.removeEventListener(n, r, i) : typeof t.detachEvent == "function" && t.detachEvent("on" + n, r);
    }
    function y(t, n) {
      var r = Math.max(t.top, n.top), i = Math.min(t.bottom, n.bottom), s = Math.max(t.left, n.left), d = Math.min(t.right, n.right), f = d - s, p = i - r;
      return f >= 0 && p >= 0 && {
        top: r,
        bottom: i,
        left: s,
        right: d,
        width: f,
        height: p
      } || null;
    }
    function M(t) {
      var n;
      try {
        n = t.getBoundingClientRect();
      } catch {
      }
      return n ? (n.width && n.height || (n = {
        top: n.top,
        right: n.right,
        bottom: n.bottom,
        left: n.left,
        width: n.right - n.left,
        height: n.bottom - n.top
      }), n) : k();
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
    function F(t, n) {
      var r = n.top - t.top, i = n.left - t.left;
      return {
        top: r,
        left: i,
        height: n.height,
        width: n.width,
        bottom: r + n.height,
        right: i + n.width
      };
    }
    function h(t, n) {
      for (var r = n; r; ) {
        if (r == t) return !0;
        r = g(r);
      }
      return !1;
    }
    function g(t) {
      var n = t.parentNode;
      return t.nodeType == /* DOCUMENT */
      9 && t != a ? e(t) : (n && n.assignedSlot && (n = n.assignedSlot.parentNode), n && n.nodeType == 11 && n.host ? n.host : n);
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
function ct(e) {
  e.forEach((a) => {
    const u = W.get(a.target);
    if (u)
      try {
        u(a);
      } catch (l) {
        console.error("IntersectionObserver callback error:", l);
      }
  });
}
function j() {
  if (!P) {
    const e = {
      root: null,
      // 相对于视口
      rootMargin: "0px",
      threshold: 0.1
      // 当10%的元素可见时触发
    };
    P = new IntersectionObserver(ct, e);
  }
  return P;
}
var J;
(function(e) {
  e[e.HIGH_SURROGATE_START = 55296] = "HIGH_SURROGATE_START", e[e.HIGH_SURROGATE_END = 56319] = "HIGH_SURROGATE_END", e[e.LOW_SURROGATE_START = 56320] = "LOW_SURROGATE_START", e[e.REGIONAL_INDICATOR_START = 127462] = "REGIONAL_INDICATOR_START", e[e.REGIONAL_INDICATOR_END = 127487] = "REGIONAL_INDICATOR_END", e[e.FITZPATRICK_MODIFIER_START = 127995] = "FITZPATRICK_MODIFIER_START", e[e.FITZPATRICK_MODIFIER_END = 127999] = "FITZPATRICK_MODIFIER_END", e[e.VARIATION_MODIFIER_START = 65024] = "VARIATION_MODIFIER_START", e[e.VARIATION_MODIFIER_END = 65039] = "VARIATION_MODIFIER_END", e[e.DIACRITICAL_MARKS_START = 8400] = "DIACRITICAL_MARKS_START", e[e.DIACRITICAL_MARKS_END = 8447] = "DIACRITICAL_MARKS_END", e[e.SUBDIVISION_INDICATOR_START = 127988] = "SUBDIVISION_INDICATOR_START", e[e.TAGS_START = 917504] = "TAGS_START", e[e.TAGS_END = 917631] = "TAGS_END", e[e.ZWJ = 8205] = "ZWJ";
})(J || (J = {}));
const ht = Object.freeze([776, 2359, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]);
var Q;
function ft(e) {
  if (typeof e != "string") throw new TypeError("string cannot be undefined or null");
  const a = [];
  let u = 0, l = 0;
  for (; u < e.length; ) l += dt(u + l, e), wt(e[u + l]) && l++, mt(e[u + l]) && l++, It(e[u + l]) && l++, Rt(e[u + l]) ? l++ : (a.push(e.substring(u, u + l)), u += l, l = 0);
  return a;
}
function dt(e, a) {
  const u = a[e];
  if (!pt(u) || e === a.length - 1) return 1;
  const l = u + a[e + 1];
  let v = a.substring(e + 2, e + 5);
  return X(l) && X(v) ? 4 : vt(l) && _t(v) ? a.slice(e).indexOf(String.fromCodePoint(917631)) + 2 : gt(v) ? 4 : 2;
}
function pt(e) {
  return e && C(e[0].charCodeAt(0), 55296, 56319);
}
function X(e) {
  return C($(e), 127462, 127487);
}
function vt(e) {
  return C($(e), 127988, 127988);
}
function gt(e) {
  return C($(e), 127995, 127999);
}
function mt(e) {
  return typeof e == "string" && C(e.charCodeAt(0), 65024, 65039);
}
function It(e) {
  return typeof e == "string" && C(e.charCodeAt(0), 8400, 8447);
}
function _t(e) {
  const a = e.codePointAt(0);
  return typeof e == "string" && typeof a == "number" && C(a, 917504, 917631);
}
function wt(e) {
  return typeof e == "string" && ht.includes(e.charCodeAt(0));
}
function Rt(e) {
  return typeof e == "string" && e.charCodeAt(0) === 8205;
}
function $(e) {
  return (e.charCodeAt(0) - 55296 << 10) + (e.charCodeAt(1) - 56320) + 65536;
}
function C(e, a, u) {
  return e >= a && e <= u;
}
(function(e) {
  e[e.unit_1 = 1] = "unit_1", e[e.unit_2 = 2] = "unit_2", e[e.unit_4 = 4] = "unit_4";
})(Q || (Q = {}));
function Tt(e, a) {
  return nt() ? (rt(e, a), !0) : !1;
}
const bt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const yt = bt ? window : void 0;
function Y(e) {
  var a;
  const u = tt(e);
  return (a = u == null ? void 0 : u.$el) !== null && a !== void 0 ? a : u;
}
// @__NO_SIDE_EFFECTS__
function Et() {
  const e = ot(!1), a = it();
  return a && et(() => {
    e.value = !0;
  }, a), e;
}
// @__NO_SIDE_EFFECTS__
function At(e) {
  const a = /* @__PURE__ */ Et();
  return H(() => (a.value, !!e()));
}
function Ot(e, a, u = {}) {
  const { window: l = yt, ...v } = u;
  let R;
  const c = /* @__PURE__ */ At(() => l && "ResizeObserver" in l), o = () => {
    R && (R.disconnect(), R = void 0);
  }, x = V(H(() => {
    const m = tt(e);
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
  setup(e, { emit: a }) {
    const u = e, l = L("containerRef"), v = L("fullMeasureRef"), R = L("singleRowMeasureRef"), c = L("midMeasureRef");
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
      var h, g;
      if (o.status === 1) {
        const A = ((h = v.value) == null ? void 0 : h.offsetHeight) ?? 0, n = (((g = R.value) == null ? void 0 : g.offsetHeight) ?? 0) * u.rows;
        A <= n ? o.status = 100 : (o.maxHeight = n, o.status = 2);
      }
    }, k = async () => {
      var h;
      if (o.status === 2) {
        const g = o.walkingIndexes[1] - o.walkingIndexes[0], A = ((h = c.value) == null ? void 0 : h.offsetHeight) ?? 0;
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
      const h = l.value;
      if (!h) return;
      j().observe(h), W.set(h, (A) => {
        if (A.isIntersecting) {
          if (o.init) return;
          y(), o.status = 1, o.init = !0;
        }
      });
    }, F = () => {
      const h = l.value;
      if (!h) return;
      j().unobserve(h), W.delete(h);
    };
    return V(
      () => u.text,
      async (h) => {
        o.contentChars = ft(h), o.init && (o.init = !1, F(), await U(), N());
      },
      { immediate: !0 }
    ), V(
      () => o.status,
      async () => {
        await U(), M();
      }
    ), V([() => o.status, () => o.walkingIndexes], () => {
      o.status === 2 && U(() => {
        k();
      });
    }), et(() => {
      u.useObserver ? (o.status = 0, N()) : y();
    }), at(() => {
      u.useObserver && F();
    }), (h, g) => (_(), I("div", {
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
        O(h.$slots, "expandNode")
      ], 4)) : G("", !0),
      o.status === 1 ? (_(), I("div", {
        key: 1,
        ref_key: "singleRowMeasureRef",
        ref: R,
        style: B(o.measureStyle),
        "aria-hidden": "true"
      }, [
        g[0] || (g[0] = T("  ", -1)),
        O(h.$slots, "expandNode")
      ], 4)) : G("", !0),
      o.status === 2 ? (_(), I("div", {
        key: 2,
        ref_key: "midMeasureRef",
        ref: c,
        style: B([o.measureStyle, { "word-break": "break-all" }]),
        "aria-hidden": "true"
      }, [
        u.direction === "start" ? (_(), I(S, { key: 0 }, [
          O(h.$slots, "expandNode"),
          T("..." + E(m.value), 1)
        ], 64)) : u.direction === "end" ? (_(), I(S, { key: 1 }, [
          T(E(b.value) + "...", 1),
          O(h.$slots, "expandNode")
        ], 64)) : (_(), I(S, { key: 2 }, [
          T(E(b.value) + "...", 1),
          O(h.$slots, "expandNode"),
          T(E(m.value), 1)
        ], 64))
      ], 4)) : (_(), I("div", xt, [
        u.expanded || o.status === 100 ? (_(), I(S, { key: 0 }, [
          T(E(u.text) + " ", 1),
          o.status === 99 ? O(h.$slots, "collapseNode", { key: 0 }) : G("", !0)
        ], 64)) : o.status === 99 ? (_(), I(S, { key: 1 }, [
          u.direction === "start" ? (_(), I(S, { key: 0 }, [
            O(h.$slots, "expandNode"),
            T("..." + E(m.value), 1)
          ], 64)) : u.direction === "end" ? (_(), I(S, { key: 1 }, [
            T(E(b.value) + "...", 1),
            O(h.$slots, "expandNode")
          ], 64)) : (_(), I(S, { key: 2 }, [
            T(E(b.value) + "...", 1),
            O(h.$slots, "expandNode"),
            T(E(m.value), 1)
          ], 64))
        ], 64)) : G("", !0)
      ], 512))
    ], 4));
  }
});
function kt(e) {
  return e.component("TextEllipsisCenter", Dt), e;
}
export {
  Dt as TextEllipsisCenter,
  kt as default
};
