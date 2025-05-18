import { createElementBlock as v, openBlock as m, createCommentVNode as w, normalizeStyle as y, createTextVNode as O, renderSlot as H, toDisplayString as S, Fragment as B } from "vue";
var G = {}, V;
function Q() {
  return V || (V = 1, function() {
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
    var u = function(t) {
      for (var n = t, r = e(n); r; )
        n = r.ownerDocument, r = e(n);
      return n;
    }(window.document), s = [], a = null, h = null;
    function p(t) {
      this.time = t.time, this.target = t.target, this.rootBounds = b(t.rootBounds), this.boundingClientRect = b(t.boundingClientRect), this.intersectionRect = b(t.intersectionRect || E()), this.isIntersecting = !!t.intersectionRect;
      var n = this.boundingClientRect, r = n.width * n.height, i = this.intersectionRect, o = i.width * i.height;
      r ? this.intersectionRatio = Number((o / r).toFixed(4)) : this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
    function c(t, n) {
      var r = n || {};
      if (typeof t != "function")
        throw new Error("callback must be a function");
      if (r.root && r.root.nodeType != 1 && r.root.nodeType != 9)
        throw new Error("root must be a Document or Element");
      this._checkForIntersections = z(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      ), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(r.rootMargin), this.thresholds = this._initThresholds(r.threshold), this.root = r.root || null, this.rootMargin = this._rootMarginValues.map(function(i) {
        return i.value + i.unit;
      }).join(" "), this._monitoringDocuments = [], this._monitoringUnsubscribes = [];
    }
    c.prototype.THROTTLE_TIMEOUT = 100, c.prototype.POLL_INTERVAL = null, c.prototype.USE_MUTATION_OBSERVER = !0, c._setupCrossOriginUpdater = function() {
      return a || (a = function(t, n) {
        !t || !n ? h = E() : h = N(t, n), s.forEach(function(r) {
          r._checkForIntersections();
        });
      }), a;
    }, c._resetCrossOriginUpdater = function() {
      a = null, h = null;
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
      return Array.isArray(n) || (n = [n]), n.sort().filter(function(r, i, o) {
        if (typeof r != "number" || isNaN(r) || r < 0 || r > 1)
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        return r !== o[i - 1];
      });
    }, c.prototype._parseRootMargin = function(t) {
      var n = t || "0px", r = n.split(/\s+/).map(function(i) {
        var o = /^(-?\d*\.?\d+)(px|%)$/.exec(i);
        if (!o)
          throw new Error("rootMargin must be specified in pixels or percent");
        return { value: parseFloat(o[1]), unit: o[2] };
      });
      return r[1] = r[1] || r[0], r[2] = r[2] || r[0], r[3] = r[3] || r[1], r;
    }, c.prototype._monitorIntersections = function(t) {
      var n = t.defaultView;
      if (n && this._monitoringDocuments.indexOf(t) == -1) {
        var r = this._checkForIntersections, i = null, o = null;
        this.POLL_INTERVAL ? i = n.setInterval(r, this.POLL_INTERVAL) : (C(n, "resize", r, !0), C(t, "scroll", r, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in n && (o = new n.MutationObserver(r), o.observe(t, {
          attributes: !0,
          childList: !0,
          characterData: !0,
          subtree: !0
        }))), this._monitoringDocuments.push(t), this._monitoringUnsubscribes.push(function() {
          var d = t.defaultView;
          d && (i && d.clearInterval(i), L(d, "resize", r, !0)), L(t, "scroll", r, !0), o && o.disconnect();
        });
        var f = this.root && (this.root.ownerDocument || this.root) || u;
        if (t != f) {
          var l = e(t);
          l && this._monitorIntersections(l.ownerDocument);
        }
      }
    }, c.prototype._unmonitorIntersections = function(t) {
      var n = this._monitoringDocuments.indexOf(t);
      if (n != -1) {
        var r = this.root && (this.root.ownerDocument || this.root) || u, i = this._observationTargets.some(function(l) {
          var d = l.element.ownerDocument;
          if (d == t)
            return !0;
          for (; d && d != r; ) {
            var g = e(d);
            if (d = g && g.ownerDocument, d == t)
              return !0;
          }
          return !1;
        });
        if (!i) {
          var o = this._monitoringUnsubscribes[n];
          if (this._monitoringDocuments.splice(n, 1), this._monitoringUnsubscribes.splice(n, 1), o(), t != r) {
            var f = e(t);
            f && this._unmonitorIntersections(f.ownerDocument);
          }
        }
      }
    }, c.prototype._unmonitorAllIntersections = function() {
      var t = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0, this._monitoringUnsubscribes.length = 0;
      for (var n = 0; n < t.length; n++)
        t[n]();
    }, c.prototype._checkForIntersections = function() {
      if (!(!this.root && a && !h)) {
        var t = this._rootIsInDom(), n = t ? this._getRootRect() : E();
        this._observationTargets.forEach(function(r) {
          var i = r.element, o = R(i), f = this._rootContainsTarget(i), l = r.entry, d = t && f && this._computeTargetAndRootIntersection(i, o, n), g = null;
          this._rootContainsTarget(i) ? (!a || this.root) && (g = n) : g = E();
          var I = r.entry = new p({
            time: j(),
            target: i,
            boundingClientRect: o,
            rootBounds: g,
            intersectionRect: d
          });
          l ? t && f ? this._hasCrossedThreshold(l, I) && this._queuedEntries.push(I) : l && l.isIntersecting && this._queuedEntries.push(I) : this._queuedEntries.push(I);
        }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this);
      }
    }, c.prototype._computeTargetAndRootIntersection = function(t, n, r) {
      if (window.getComputedStyle(t).display != "none") {
        for (var i = n, o = A(t), f = !1; !f && o; ) {
          var l = null, d = o.nodeType == 1 ? window.getComputedStyle(o) : {};
          if (d.display == "none") return null;
          if (o == this.root || o.nodeType == /* DOCUMENT */
          9)
            if (f = !0, o == this.root || o == u)
              a && !this.root ? !h || h.width == 0 && h.height == 0 ? (o = null, l = null, i = null) : l = h : l = r;
            else {
              var g = A(o), I = g && R(g), P = g && this._computeTargetAndRootIntersection(g, I, r);
              I && P ? (o = g, l = N(I, P)) : (o = null, i = null);
            }
          else {
            var F = o.ownerDocument;
            o != F.body && o != F.documentElement && d.overflow != "visible" && (l = R(o));
          }
          if (l && (i = J(l, i)), !i) break;
          o = o && A(o);
        }
        return i;
      }
    }, c.prototype._getRootRect = function() {
      var t;
      if (this.root && !U(this.root))
        t = R(this.root);
      else {
        var n = U(this.root) ? this.root : u, r = n.documentElement, i = n.body;
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
      var n = this._rootMarginValues.map(function(i, o) {
        return i.unit == "px" ? i.value : i.value * (o % 2 ? t.width : t.height) / 100;
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
        for (var o = 0; o < this.thresholds.length; o++) {
          var f = this.thresholds[o];
          if (f == r || f == i || f < r != f < i)
            return !0;
        }
    }, c.prototype._rootIsInDom = function() {
      return !this.root || k(u, this.root);
    }, c.prototype._rootContainsTarget = function(t) {
      var n = this.root && (this.root.ownerDocument || this.root) || u;
      return k(n, t) && (!this.root || n == t.ownerDocument);
    }, c.prototype._registerInstance = function() {
      s.indexOf(this) < 0 && s.push(this);
    }, c.prototype._unregisterInstance = function() {
      var t = s.indexOf(this);
      t != -1 && s.splice(t, 1);
    };
    function j() {
      return window.performance && performance.now && performance.now();
    }
    function z(t, n) {
      var r = null;
      return function() {
        r || (r = setTimeout(function() {
          t(), r = null;
        }, n));
      };
    }
    function C(t, n, r, i) {
      typeof t.addEventListener == "function" ? t.addEventListener(n, r, i) : typeof t.attachEvent == "function" && t.attachEvent("on" + n, r);
    }
    function L(t, n, r, i) {
      typeof t.removeEventListener == "function" ? t.removeEventListener(n, r, i) : typeof t.detachEvent == "function" && t.detachEvent("on" + n, r);
    }
    function J(t, n) {
      var r = Math.max(t.top, n.top), i = Math.min(t.bottom, n.bottom), o = Math.max(t.left, n.left), f = Math.min(t.right, n.right), l = f - o, d = i - r;
      return l >= 0 && d >= 0 && {
        top: r,
        bottom: i,
        left: o,
        right: f,
        width: l,
        height: d
      } || null;
    }
    function R(t) {
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
      }), n) : E();
    }
    function E() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    function b(t) {
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
    function N(t, n) {
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
    function k(t, n) {
      for (var r = n; r; ) {
        if (r == t) return !0;
        r = A(r);
      }
      return !1;
    }
    function A(t) {
      var n = t.parentNode;
      return t.nodeType == /* DOCUMENT */
      9 && t != u ? e(t) : (n && n.assignedSlot && (n = n.assignedSlot.parentNode), n && n.nodeType == 11 && n.host ? n.host : n);
    }
    function U(t) {
      return t && t.nodeType === 9;
    }
    window.IntersectionObserver = c, window.IntersectionObserverEntry = p;
  }()), G;
}
Q();
let x = null;
const D = /* @__PURE__ */ new Map();
function X(e) {
  e.forEach((u) => {
    const s = D.get(u.target);
    s && s(u);
  });
}
function W() {
  return x || (x = new IntersectionObserver(X)), x;
}
var K;
(function(e) {
  e[e.HIGH_SURROGATE_START = 55296] = "HIGH_SURROGATE_START", e[e.HIGH_SURROGATE_END = 56319] = "HIGH_SURROGATE_END", e[e.LOW_SURROGATE_START = 56320] = "LOW_SURROGATE_START", e[e.REGIONAL_INDICATOR_START = 127462] = "REGIONAL_INDICATOR_START", e[e.REGIONAL_INDICATOR_END = 127487] = "REGIONAL_INDICATOR_END", e[e.FITZPATRICK_MODIFIER_START = 127995] = "FITZPATRICK_MODIFIER_START", e[e.FITZPATRICK_MODIFIER_END = 127999] = "FITZPATRICK_MODIFIER_END", e[e.VARIATION_MODIFIER_START = 65024] = "VARIATION_MODIFIER_START", e[e.VARIATION_MODIFIER_END = 65039] = "VARIATION_MODIFIER_END", e[e.DIACRITICAL_MARKS_START = 8400] = "DIACRITICAL_MARKS_START", e[e.DIACRITICAL_MARKS_END = 8447] = "DIACRITICAL_MARKS_END", e[e.SUBDIVISION_INDICATOR_START = 127988] = "SUBDIVISION_INDICATOR_START", e[e.TAGS_START = 917504] = "TAGS_START", e[e.TAGS_END = 917631] = "TAGS_END", e[e.ZWJ = 8205] = "ZWJ";
})(K || (K = {}));
const Y = Object.freeze([776, 2359, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]);
var q;
function $(e) {
  if (typeof e != "string") throw new TypeError("string cannot be undefined or null");
  const u = [];
  let s = 0, a = 0;
  for (; s < e.length; ) a += tt(s + a, e), ut(e[s + a]) && a++, it(e[s + a]) && a++, ot(e[s + a]) && a++, ht(e[s + a]) ? a++ : (u.push(e.substring(s, s + a)), s += a, a = 0);
  return u;
}
function tt(e, u) {
  const s = u[e];
  if (!et(s) || e === u.length - 1) return 1;
  const a = s + u[e + 1];
  let h = u.substring(e + 2, e + 5);
  return Z(a) && Z(h) ? 4 : nt(a) && st(h) ? u.slice(e).indexOf(String.fromCodePoint(917631)) + 2 : rt(h) ? 4 : 2;
}
function et(e) {
  return e && T(e[0].charCodeAt(0), 55296, 56319);
}
function Z(e) {
  return T(M(e), 127462, 127487);
}
function nt(e) {
  return T(M(e), 127988, 127988);
}
function rt(e) {
  return T(M(e), 127995, 127999);
}
function it(e) {
  return typeof e == "string" && T(e.charCodeAt(0), 65024, 65039);
}
function ot(e) {
  return typeof e == "string" && T(e.charCodeAt(0), 8400, 8447);
}
function st(e) {
  const u = e.codePointAt(0);
  return typeof e == "string" && typeof u == "number" && T(u, 917504, 917631);
}
function ut(e) {
  return typeof e == "string" && Y.includes(e.charCodeAt(0));
}
function ht(e) {
  return typeof e == "string" && e.charCodeAt(0) === 8205;
}
function M(e) {
  return (e.charCodeAt(0) - 55296 << 10) + (e.charCodeAt(1) - 56320) + 65536;
}
function T(e, u, s) {
  return e >= u && e <= s;
}
(function(e) {
  e[e.unit_1 = 1] = "unit_1", e[e.unit_2 = 2] = "unit_2", e[e.unit_4 = 4] = "unit_4";
})(q || (q = {}));
const at = (e, u) => {
  const s = e.__vccOpts || e;
  for (const [a, h] of u)
    s[a] = h;
  return s;
}, _ = {
  PREPARE: 1,
  MEASURE_WALKING: 2,
  STABLE_ELLIPSIS: 99,
  STABLE_NO_ELLIPSIS: 100
}, ct = {
  props: {
    text: {
      type: String,
      required: !0
    },
    rows: {
      type: Number,
      default: 1
    },
    direction: {
      type: String,
      default: "middle"
    },
    expanded: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      contentChars: [],
      maxHeight: 0,
      walkingIndexes: [0, 0],
      status: _.STABLE_NO_ELLIPSIS,
      measureStyle: {
        visibility: "hidden",
        whiteSpace: "inherit",
        lineHeight: "inherit",
        fontSize: "inherit"
      },
      init: !1,
      MEASURE_STATUS: _
    };
  },
  computed: {
    midIndex() {
      return Math.ceil((this.walkingIndexes[0] + this.walkingIndexes[1]) / 2);
    },
    // 根据 index 生成文本返回
    renderContent() {
      return function(e) {
        const u = this.contentChars.slice(0, e).join(""), s = this.contentChars.slice(-e).join("");
        return this.direction === "start" ? `...${u}` : this.direction === "end" ? `${s}...` : this.direction === "middle" ? `${u}...${s}` : "";
      };
    }
  },
  watch: {
    text: {
      immediate: !0,
      async handler(e) {
        this.contentChars = $(e), this.init && (this.init = !1, this.cancelObserver(), await this.$nextTick(), this.openObserver());
      }
    },
    async status() {
      await this.$nextTick(), this.measureHeights();
    }
  },
  methods: {
    startMeasure() {
      this.status = _.PREPARE, this.walkingIndexes = [
        0,
        this.direction === "middle" ? Math.ceil(this.contentChars.length / 2) : this.contentChars.length
      ];
    },
    async measureHeights() {
      var e, u;
      if (this.status === _.PREPARE) {
        const s = ((e = this.$refs.fullMeasureRef) == null ? void 0 : e.offsetHeight) || 0, h = (((u = this.$refs.singleRowMeasureRef) == null ? void 0 : u.offsetHeight) || 0) * this.rows;
        s <= h ? this.status = _.STABLE_NO_ELLIPSIS : (this.maxHeight = h, this.status = _.MEASURE_WALKING);
      }
    },
    async handleWalkingMeasure() {
      var e;
      if (this.status === _.MEASURE_WALKING) {
        const u = this.walkingIndexes[1] - this.walkingIndexes[0], s = ((e = this.$refs.midMeasureRef) == null ? void 0 : e.offsetHeight) || 0;
        u > 1 ? s > this.maxHeight ? this.walkingIndexes = [this.walkingIndexes[0], this.midIndex] : this.walkingIndexes = [this.midIndex, this.walkingIndexes[1]] : (s > this.maxHeight ? this.walkingIndexes = [
          this.walkingIndexes[0],
          this.walkingIndexes[0]
        ] : this.walkingIndexes = [
          this.walkingIndexes[1],
          this.walkingIndexes[1]
        ], this.status = _.STABLE_ELLIPSIS);
      }
    },
    // 增加 监听
    async openObserver() {
      const e = this.$refs.container;
      W().observe(e), D.set(e, (s) => {
        if (s.isIntersecting) {
          if (this.init)
            return;
          this.startMeasure(), this.init = !0;
        }
      });
    },
    // 移除 监听
    cancelObserver() {
      const e = this.$refs.container;
      W().unobserve(e), D.delete(e);
    }
  },
  mounted() {
    this.openObserver();
  },
  beforeDestroy() {
    this.cancelObserver();
  },
  updated() {
    setTimeout(() => {
      this.status === _.MEASURE_WALKING && this.handleWalkingMeasure();
    }, 0);
  }
}, lt = { ref: "container" }, ft = {
  key: 3,
  ref: "displayRef"
};
function dt(e, u, s, a, h, p) {
  return m(), v("div", lt, [
    h.status === h.MEASURE_STATUS.PREPARE ? (m(), v("div", {
      key: 0,
      ref: "fullMeasureRef",
      style: y(h.measureStyle),
      "aria-hidden": "true"
    }, [
      O(S(s.text) + " ", 1),
      H(e.$slots, "expandNode")
    ], 4)) : w("", !0),
    h.status === h.MEASURE_STATUS.PREPARE ? (m(), v("div", {
      key: 1,
      ref: "singleRowMeasureRef",
      style: y(h.measureStyle),
      "aria-hidden": "true"
    }, "   ", 4)) : w("", !0),
    h.status === h.MEASURE_STATUS.MEASURE_WALKING ? (m(), v("div", {
      key: 2,
      ref: "midMeasureRef",
      style: y([h.measureStyle, { "word-break": "break-all" }]),
      "aria-hidden": "true"
    }, S(p.renderContent(p.midIndex)), 5)) : (m(), v("div", ft, [
      s.expanded || h.status === h.MEASURE_STATUS.STABLE_NO_ELLIPSIS ? (m(), v(B, { key: 0 }, [
        O(S(s.text) + " ", 1),
        h.status === h.MEASURE_STATUS.STABLE_ELLIPSIS ? H(e.$slots, "collapseNode", { key: 0 }) : w("", !0)
      ], 64)) : h.status === h.MEASURE_STATUS.STABLE_ELLIPSIS ? (m(), v(B, { key: 1 }, [
        O(S(p.renderContent(p.midIndex)), 1)
      ], 64)) : w("", !0)
    ], 512))
  ], 512);
}
const gt = /* @__PURE__ */ at(ct, [["render", dt]]);
function _t(e) {
  e.component("TextEllipsisCenter", gt);
}
const pt = {
  install: _t
};
export {
  gt as TextEllipsisCenter,
  pt as default
};
