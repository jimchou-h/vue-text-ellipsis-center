import { getCurrentScope as nt, onScopeDispose as rt, watch as H, computed as G, toValue as tt, shallowRef as ot, getCurrentInstance as it, onMounted as et, defineComponent as st, useTemplateRef as C, reactive as ut, nextTick as M, onBeforeUnmount as at, createElementBlock as A, openBlock as O, normalizeStyle as k, createCommentVNode as N, createTextVNode as U, renderSlot as $, toDisplayString as F, Fragment as q } from "vue";
var K = {}, Z;
function ct() {
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
    }(window.document), u = [], c = null, g = null;
    function w(t) {
      this.time = t.time, this.target = t.target, this.rootBounds = S(t.rootBounds), this.boundingClientRect = S(t.boundingClientRect), this.intersectionRect = S(t.intersectionRect || y()), this.isIntersecting = !!t.intersectionRect;
      var n = this.boundingClientRect, r = n.width * n.height, i = this.intersectionRect, s = i.width * i.height;
      r ? this.intersectionRatio = Number((s / r).toFixed(4)) : this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
    function l(t, n) {
      var r = n || {};
      if (typeof t != "function")
        throw new Error("callback must be a function");
      if (r.root && r.root.nodeType != 1 && r.root.nodeType != 9)
        throw new Error("root must be a Document or Element");
      this._checkForIntersections = R(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      ), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(r.rootMargin), this.thresholds = this._initThresholds(r.threshold), this.root = r.root || null, this.rootMargin = this._rootMarginValues.map(function(i) {
        return i.value + i.unit;
      }).join(" "), this._monitoringDocuments = [], this._monitoringUnsubscribes = [];
    }
    l.prototype.THROTTLE_TIMEOUT = 100, l.prototype.POLL_INTERVAL = null, l.prototype.USE_MUTATION_OBSERVER = !0, l._setupCrossOriginUpdater = function() {
      return c || (c = function(t, n) {
        !t || !n ? g = y() : g = h(t, n), u.forEach(function(r) {
          r._checkForIntersections();
        });
      }), c;
    }, l._resetCrossOriginUpdater = function() {
      c = null, g = null;
    }, l.prototype.observe = function(t) {
      var n = this._observationTargets.some(function(r) {
        return r.element == t;
      });
      if (!n) {
        if (!(t && t.nodeType == 1))
          throw new Error("target must be an Element");
        this._registerInstance(), this._observationTargets.push({ element: t, entry: null }), this._monitorIntersections(t.ownerDocument), this._checkForIntersections();
      }
    }, l.prototype.unobserve = function(t) {
      this._observationTargets = this._observationTargets.filter(function(n) {
        return n.element != t;
      }), this._unmonitorIntersections(t.ownerDocument), this._observationTargets.length == 0 && this._unregisterInstance();
    }, l.prototype.disconnect = function() {
      this._observationTargets = [], this._unmonitorAllIntersections(), this._unregisterInstance();
    }, l.prototype.takeRecords = function() {
      var t = this._queuedEntries.slice();
      return this._queuedEntries = [], t;
    }, l.prototype._initThresholds = function(t) {
      var n = t || [0];
      return Array.isArray(n) || (n = [n]), n.sort().filter(function(r, i, s) {
        if (typeof r != "number" || isNaN(r) || r < 0 || r > 1)
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        return r !== s[i - 1];
      });
    }, l.prototype._parseRootMargin = function(t) {
      var n = t || "0px", r = n.split(/\s+/).map(function(i) {
        var s = /^(-?\d*\.?\d+)(px|%)$/.exec(i);
        if (!s)
          throw new Error("rootMargin must be specified in pixels or percent");
        return { value: parseFloat(s[1]), unit: s[2] };
      });
      return r[1] = r[1] || r[0], r[2] = r[2] || r[0], r[3] = r[3] || r[1], r;
    }, l.prototype._monitorIntersections = function(t) {
      var n = t.defaultView;
      if (n && this._monitoringDocuments.indexOf(t) == -1) {
        var r = this._checkForIntersections, i = null, s = null;
        this.POLL_INTERVAL ? i = n.setInterval(r, this.POLL_INTERVAL) : (T(n, "resize", r, !0), T(t, "scroll", r, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in n && (s = new n.MutationObserver(r), s.observe(t, {
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
    }, l.prototype._unmonitorIntersections = function(t) {
      var n = this._monitoringDocuments.indexOf(t);
      if (n != -1) {
        var r = this.root && (this.root.ownerDocument || this.root) || a, i = this._observationTargets.some(function(f) {
          var p = f.element.ownerDocument;
          if (p == t)
            return !0;
          for (; p && p != r; ) {
            var I = e(p);
            if (p = I && I.ownerDocument, p == t)
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
    }, l.prototype._unmonitorAllIntersections = function() {
      var t = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0, this._monitoringUnsubscribes.length = 0;
      for (var n = 0; n < t.length; n++)
        t[n]();
    }, l.prototype._checkForIntersections = function() {
      if (!(!this.root && c && !g)) {
        var t = this._rootIsInDom(), n = t ? this._getRootRect() : y();
        this._observationTargets.forEach(function(r) {
          var i = r.element, s = D(i), d = this._rootContainsTarget(i), f = r.entry, p = t && d && this._computeTargetAndRootIntersection(i, s, n), I = null;
          this._rootContainsTarget(i) ? (!c || this.root) && (I = n) : I = y();
          var E = r.entry = new w({
            time: o(),
            target: i,
            boundingClientRect: s,
            rootBounds: I,
            intersectionRect: p
          });
          f ? t && d ? this._hasCrossedThreshold(f, E) && this._queuedEntries.push(E) : f && f.isIntersecting && this._queuedEntries.push(E) : this._queuedEntries.push(E);
        }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this);
      }
    }, l.prototype._computeTargetAndRootIntersection = function(t, n, r) {
      if (window.getComputedStyle(t).display != "none") {
        for (var i = n, s = v(t), d = !1; !d && s; ) {
          var f = null, p = s.nodeType == 1 ? window.getComputedStyle(s) : {};
          if (p.display == "none") return null;
          if (s == this.root || s.nodeType == /* DOCUMENT */
          9)
            if (d = !0, s == this.root || s == a)
              c && !this.root ? !g || g.width == 0 && g.height == 0 ? (s = null, f = null, i = null) : f = g : f = r;
            else {
              var I = v(s), E = I && D(I), W = I && this._computeTargetAndRootIntersection(I, E, r);
              E && W ? (s = I, f = h(E, W)) : (s = null, i = null);
            }
          else {
            var z = s.ownerDocument;
            s != z.body && s != z.documentElement && p.overflow != "visible" && (f = D(s));
          }
          if (f && (i = b(f, i)), !i) break;
          s = s && v(s);
        }
        return i;
      }
    }, l.prototype._getRootRect = function() {
      var t;
      if (this.root && !L(this.root))
        t = D(this.root);
      else {
        var n = L(this.root) ? this.root : a, r = n.documentElement, i = n.body;
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
    }, l.prototype._expandRectByRootMargin = function(t) {
      var n = this._rootMarginValues.map(function(i, s) {
        return i.unit == "px" ? i.value : i.value * (s % 2 ? t.width : t.height) / 100;
      }), r = {
        top: t.top - n[0],
        right: t.right + n[1],
        bottom: t.bottom + n[2],
        left: t.left - n[3]
      };
      return r.width = r.right - r.left, r.height = r.bottom - r.top, r;
    }, l.prototype._hasCrossedThreshold = function(t, n) {
      var r = t && t.isIntersecting ? t.intersectionRatio || 0 : -1, i = n.isIntersecting ? n.intersectionRatio || 0 : -1;
      if (r !== i)
        for (var s = 0; s < this.thresholds.length; s++) {
          var d = this.thresholds[s];
          if (d == r || d == i || d < r != d < i)
            return !0;
        }
    }, l.prototype._rootIsInDom = function() {
      return !this.root || _(a, this.root);
    }, l.prototype._rootContainsTarget = function(t) {
      var n = this.root && (this.root.ownerDocument || this.root) || a;
      return _(n, t) && (!this.root || n == t.ownerDocument);
    }, l.prototype._registerInstance = function() {
      u.indexOf(this) < 0 && u.push(this);
    }, l.prototype._unregisterInstance = function() {
      var t = u.indexOf(this);
      t != -1 && u.splice(t, 1);
    };
    function o() {
      return window.performance && performance.now && performance.now();
    }
    function R(t, n) {
      var r = null;
      return function() {
        r || (r = setTimeout(function() {
          t(), r = null;
        }, n));
      };
    }
    function T(t, n, r, i) {
      typeof t.addEventListener == "function" ? t.addEventListener(n, r, i) : typeof t.attachEvent == "function" && t.attachEvent("on" + n, r);
    }
    function m(t, n, r, i) {
      typeof t.removeEventListener == "function" ? t.removeEventListener(n, r, i) : typeof t.detachEvent == "function" && t.detachEvent("on" + n, r);
    }
    function b(t, n) {
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
    function D(t) {
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
      }), n) : y();
    }
    function y() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    function S(t) {
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
    function h(t, n) {
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
    function _(t, n) {
      for (var r = n; r; ) {
        if (r == t) return !0;
        r = v(r);
      }
      return !1;
    }
    function v(t) {
      var n = t.parentNode;
      return t.nodeType == /* DOCUMENT */
      9 && t != a ? e(t) : (n && n.assignedSlot && (n = n.assignedSlot.parentNode), n && n.nodeType == 11 && n.host ? n.host : n);
    }
    function L(t) {
      return t && t.nodeType === 9;
    }
    window.IntersectionObserver = l, window.IntersectionObserverEntry = w;
  }()), K;
}
ct();
let B = null;
const V = /* @__PURE__ */ new Map();
function lt(e) {
  e.forEach((a) => {
    const u = V.get(a.target);
    u && u(a);
  });
}
function j() {
  return B || (B = new IntersectionObserver(lt)), B;
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
  let u = 0, c = 0;
  for (; u < e.length; ) c += dt(u + c, e), wt(e[u + c]) && c++, _t(e[u + c]) && c++, mt(e[u + c]) && c++, Rt(e[u + c]) ? c++ : (a.push(e.substring(u, u + c)), u += c, c = 0);
  return a;
}
function dt(e, a) {
  const u = a[e];
  if (!pt(u) || e === a.length - 1) return 1;
  const c = u + a[e + 1];
  let g = a.substring(e + 2, e + 5);
  return X(c) && X(g) ? 4 : gt(c) && It(g) ? a.slice(e).indexOf(String.fromCodePoint(917631)) + 2 : vt(g) ? 4 : 2;
}
function pt(e) {
  return e && x(e[0].charCodeAt(0), 55296, 56319);
}
function X(e) {
  return x(P(e), 127462, 127487);
}
function gt(e) {
  return x(P(e), 127988, 127988);
}
function vt(e) {
  return x(P(e), 127995, 127999);
}
function _t(e) {
  return typeof e == "string" && x(e.charCodeAt(0), 65024, 65039);
}
function mt(e) {
  return typeof e == "string" && x(e.charCodeAt(0), 8400, 8447);
}
function It(e) {
  const a = e.codePointAt(0);
  return typeof e == "string" && typeof a == "number" && x(a, 917504, 917631);
}
function wt(e) {
  return typeof e == "string" && ht.includes(e.charCodeAt(0));
}
function Rt(e) {
  return typeof e == "string" && e.charCodeAt(0) === 8205;
}
function P(e) {
  return (e.charCodeAt(0) - 55296 << 10) + (e.charCodeAt(1) - 56320) + 65536;
}
function x(e, a, u) {
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
  return G(() => (a.value, !!e()));
}
function Ot(e, a, u = {}) {
  const { window: c = yt, ...g } = u;
  let w;
  const l = /* @__PURE__ */ At(() => c && "ResizeObserver" in c), o = () => {
    w && (w.disconnect(), w = void 0);
  }, R = H(G(() => {
    const m = tt(e);
    return Array.isArray(m) ? m.map((b) => Y(b)) : [Y(m)];
  }), (m) => {
    if (o(), l.value && c) {
      w = new ResizeObserver(a);
      for (const b of m) b && w.observe(b, g);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), T = () => {
    o(), R();
  };
  return Tt(T), {
    isSupported: l,
    stop: T
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
    const u = e, c = C("containerRef"), g = C("fullMeasureRef"), w = C("singleRowMeasureRef"), l = C("midMeasureRef");
    Ot(c, () => {
      o.status = 0, m();
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
    }), R = G(() => Math.ceil((o.walkingIndexes[0] + o.walkingIndexes[1]) / 2)), T = (h) => {
      const _ = o.contentChars.slice(0, h).join(""), v = o.contentChars.slice(-h).join("");
      switch (u.direction) {
        case "start":
          return `...${_}`;
        case "end":
          return `${v}...`;
        case "middle":
          return `${_}...${v}`;
        default:
          return "";
      }
    }, m = () => {
      o.status = 1, o.walkingIndexes = [
        0,
        u.direction === "middle" ? Math.ceil(o.contentChars.length / 2) : o.contentChars.length
      ];
    }, b = async () => {
      var h, _;
      if (o.status === 1) {
        const v = ((h = g.value) == null ? void 0 : h.offsetHeight) ?? 0, t = (((_ = w.value) == null ? void 0 : _.offsetHeight) ?? 0) * u.rows;
        v <= t ? o.status = 100 : (o.maxHeight = t, o.status = 2);
      }
    }, D = async () => {
      var h;
      if (o.status === 2) {
        const _ = o.walkingIndexes[1] - o.walkingIndexes[0], v = ((h = l.value) == null ? void 0 : h.offsetHeight) ?? 0;
        _ > 1 ? v > o.maxHeight ? o.walkingIndexes = [o.walkingIndexes[0], R.value] : o.walkingIndexes = [R.value, o.walkingIndexes[1]] : (v > o.maxHeight ? o.walkingIndexes = [
          o.walkingIndexes[0],
          o.walkingIndexes[0]
        ] : o.walkingIndexes = [
          o.walkingIndexes[1],
          o.walkingIndexes[1]
        ], o.status = 99);
      }
    }, y = async () => {
      await M();
      const h = c.value;
      if (!h) return;
      j().observe(h), V.set(h, (v) => {
        if (v.isIntersecting) {
          if (o.init) return;
          m(), o.status = 1, o.init = !0;
        }
      });
    }, S = () => {
      const h = c.value;
      if (!h) return;
      j().unobserve(h), V.delete(h);
    };
    return H(
      () => u.text,
      async (h) => {
        o.contentChars = ft(h), o.init && (o.init = !1, S(), await M(), y());
      },
      { immediate: !0 }
    ), H(
      () => o.status,
      async () => {
        await M(), b();
      }
    ), H([() => o.status, () => o.walkingIndexes], () => {
      o.status === 2 && M(() => {
        D();
      });
    }), et(() => {
      u.useObserver ? (o.status = 0, y()) : m(), u.autoResize;
    }), at(() => {
      u.useObserver && S();
    }), (h, _) => (O(), A("div", {
      ref_key: "containerRef",
      ref: c,
      style: k(o.containerStyle)
    }, [
      o.status === 1 ? (O(), A("div", {
        key: 0,
        ref_key: "fullMeasureRef",
        ref: g,
        style: k(o.measureStyle),
        "aria-hidden": "true"
      }, [
        U(F(u.text) + " ", 1),
        $(h.$slots, "expandNode")
      ], 4)) : N("", !0),
      o.status === 1 ? (O(), A("div", {
        key: 1,
        ref_key: "singleRowMeasureRef",
        ref: w,
        style: k(o.measureStyle),
        "aria-hidden": "true"
      }, "   ", 4)) : N("", !0),
      o.status === 2 ? (O(), A("div", {
        key: 2,
        ref_key: "midMeasureRef",
        ref: l,
        style: k([o.measureStyle, { "word-break": "break-all" }]),
        "aria-hidden": "true"
      }, F(T(R.value)), 5)) : (O(), A("div", xt, [
        u.expanded || o.status === 100 ? (O(), A(q, { key: 0 }, [
          U(F(u.text) + " ", 1),
          o.status === 99 ? $(h.$slots, "collapseNode", { key: 0 }) : N("", !0)
        ], 64)) : o.status === 99 ? (O(), A(q, { key: 1 }, [
          U(F(T(R.value)), 1)
        ], 64)) : N("", !0)
      ], 512))
    ], 4));
  }
});
function St(e) {
  e.component("TextEllipsisCenter", Dt);
}
const Mt = {
  install: St
};
export {
  Dt as TextEllipsisCenter,
  Mt as default
};
