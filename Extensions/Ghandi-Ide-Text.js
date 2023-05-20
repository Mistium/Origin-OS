"use strict";
(self.webpackChunkscratch_extensions = self.webpackChunkscratch_extensions || []).push([[4085], {
    2805: (t,e,i)=>{
        i.d(e, {
            g: ()=>r,
            m: ()=>a
        });
        var r = {
            fzdlt: {
                name: "方正达利体",
                src: i(2222).Z
            },
            fzyzt: {
                name: "方正雅珠体",
                src: i(1142).Z
            },
            iPix: {
                name: "iPix（像素字体）",
                src: i(2435).Z
            },
            cexwz: {
                name: "仓耳小丸子",
                src: i(9909).Z
            },
            qtxtt: {
                name: "千图小兔体",
                src: i(5616).Z
            },
            aliLight: {
                name: "阿里普惠体 Light",
                src: i(3661).Z
            },
            aliLightB: {
                name: "阿里普惠体 Black",
                src: i(7990).Z
            },
            arkPixelJp: {
                name: "Ark Pixel Japanese",
                src: i(4703).Z
            },
            arkPixelCn: {
                name: "Ark Pixel Chinese",
                src: i(5977).Z
            },
            arkPixelKo: {
                name: "Ark Pixel Korean",
                src: i(8712).Z
            },
            california: {
                name: "Dealerplate California",
                src: i(6334).Z
            },
            minecraftBold: {
                name: "Minecraft Bold",
                src: i(2830).Z
            },
            minecraftRegular: {
                name: "Minecraft Regular",
                src: i(3255).Z
            }
        }
          , a = function(t) {
            var e = r[t];
            return e && !e.loaded && window.FontFace ? new FontFace(t,"url(".concat(e.src, ")")).load().then((function(t) {
                e.loaded = !0,
                document.fonts.add(t)
            }
            )) : Promise.resolve()
        }
    }
    ,
    3822: (t,e,i)=>{
        i.r(e),
        i.d(e, {
            default: ()=>k
        });
        var r = i(2805)
          , a = i(6707)
          , n = i.n(a);
        function s(t) {
            return s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
            ,
            s(t)
        }
        function o(t, e) {
            for (var i = 0; i < e.length; i++) {
                var r = e[i];
                r.enumerable = r.enumerable || !1,
                r.configurable = !0,
                "value"in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r)
            }
        }
        function l(t, e, i) {
            return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, i) {
                var r = function(t, e) {
                    for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = T(t)); )
                        ;
                    return t
                }(t, e);
                if (r) {
                    var a = Object.getOwnPropertyDescriptor(r, e);
                    return a.get ? a.get.call(i) : a.value
                }
            }
            ,
            l(t, e, i || t)
        }
        function u(t, e) {
            return u = Object.setPrototypeOf || function(t, e) {
                return t.__proto__ = e,
                t
            }
            ,
            u(t, e)
        }
        function x(t, e) {
            return !e || "object" !== s(e) && "function" != typeof e ? function(t) {
                if (void 0 === t)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }(t) : e
        }
        function T(t) {
            return T = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t)
            }
            ,
            T(t)
        }
        var c = i(3141)
          , M = i(3378)
          , d = i(6707)
          , h = function(t) {
            var e = t;
            !function(t, e) {
                if ("function" != typeof e && null !== e)
                    throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }),
                e && u(t, e)
            }(h, t);
            var i, r, a, n, s = (a = h,
            n = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct)
                    return !1;
                if (Reflect.construct.sham)
                    return !1;
                if ("function" == typeof Proxy)
                    return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                    ))),
                    !0
                } catch (t) {
                    return !1
                }
            }(),
            function() {
                var t, e = T(a);
                if (n) {
                    var i = T(this).constructor;
                    t = Reflect.construct(e, arguments, i)
                } else
                    t = e.apply(this, arguments);
                return x(this, t)
            }
            );
            function h(t, e) {
                var i;
                return function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, h),
                (i = s.call(this, t))._renderer = e,
                i._canvas = document.createElement("canvas"),
                i._texture = null,
                i._size = [0, 0],
                i._renderedScale = 0,
                i._lines = [],
                i._textAreaSize = {
                    width: 0,
                    height: 0
                },
                i._textDirty = !0,
                i._textureDirty = !0,
                i.measurementProvider = new d(i._canvas.getContext("2d", {
                    willReadFrequently: !0
                })),
                i.textWrapper = new M(i.measurementProvider),
                i.style = {},
                i
            }
            return i = h,
            (r = [{
                key: "dispose",
                value: function() {
                    this._texture && (this._renderer.gl.deleteTexture(this._texture),
                    this._texture = null),
                    this._canvas = null,
                    this.textWrapper = null,
                    this.measurementProvider = null,
                    l(T(h.prototype), "dispose", this).call(this)
                }
            }, {
                key: "setTextAndStyle",
                value: function(t) {
                    if (this._text = t.text,
                    this.style.FONT = t.font,
                    this.style.COLOR = t.color,
                    this.style.MAX_LINE_WIDTH = t.maxWidth,
                    this.style.FONT_SIZE = t.size,
                    this.style.LINE_HEIGHT = t.size + t.size / 7,
                    this.style.ALIGN = t.align,
                    this.style.STROKE_WIDTH = t.strokeWidth,
                    this.style.STROKE_COLOR = t.strokeColor,
                    this.style.VERTICAL_PADDING = t.size / 7,
                    this.style.RAINBOW = t.rainbow,
                    this.style.GRADIENT = t.gradient,
                    this.style.LINE_BREAK = t.lineBreak,
                    t.userDefinedLineHeight) {
                        var i = 1 / (t.userDefinedLineHeight - 1);
                        this.style.LINE_HEIGHT = t.size + t.size / i,
                        this.style.VERTICAL_PADDING = t.size / i
                    }
                    this.measurementProvider.setFontAndSize(this.style.FONT, this.style.FONT_SIZE),
                    this._textDirty = !0,
                    this._textureDirty = !0,
                    this.emit(e.Events.WasAltered)
                }
            }, {
                key: "_restyleCanvas",
                value: function() {
                    this._canvas.getContext("2d").font = "".concat(this.style.FONT_SIZE, "px ").concat(this.style.FONT, ", sans-serif")
                }
            }, {
                key: "calculateTextDimensions",
                value: function(t) {
                    var e = this._renderedScale
                      , i = this.style.MAX_LINE_WIDTH;
                    i *= this._renderer.gl.canvas.width / this._renderer.getNativeSize()[0],
                    i /= e || 1;
                    var r = this.textWrapper.wrapText(i, t, this.style.FONT_SIZE, this.style.FONT)
                      , a = 0
                      , n = 0;
                    this.style.LINE_BREAK && (r = t.split(this.style.LINE_BREAK));
                    for (var s = 0; s < r.length; s++) {
                        var o = r[s]
                          , l = this.measurementProvider.measureText(o);
                        l > a && (a = l)
                    }
                    return n = this.style.LINE_HEIGHT * r.length + 2 * this.style.VERTICAL_PADDING,
                    this.style.STROKE_WIDTH > 0 && (a += 2 * this.style.STROKE_WIDTH,
                    n += 2 * this.style.STROKE_WIDTH),
                    {
                        lines: r,
                        width: a,
                        height: n
                    }
                }
            }, {
                key: "_reflowLines",
                value: function(t) {
                    var e = this.style.MAX_LINE_WIDTH;
                    if (e *= this._renderer.gl.canvas.width / this._renderer.getNativeSize()[0],
                    e /= t || 1,
                    this._lines = this.textWrapper.wrapText(e, this._text, this.style.FONT_SIZE, this.style.FONT),
                    this.style.LINE_BREAK) {
                        this._lines = this._text.split(this.style.LINE_BREAK);
                        for (var i = this._lines, r = 0, a = 0; a < i.length; a++) {
                            var n = i[a]
                              , s = this.measurementProvider.measureText(n);
                            s > r && (r = s)
                        }
                        e = r
                    }
                    this._size[0] = e,
                    this._size[1] = this.style.LINE_HEIGHT * this._lines.length + 2 * this.style.VERTICAL_PADDING,
                    this.style.STROKE_WIDTH > 0 && (this._size[0] += 2 * this.style.STROKE_WIDTH,
                    this._size[1] += 2 * this.style.STROKE_WIDTH),
                    this._textDirty = !1
                }
            }, {
                key: "_renderText",
                value: function(t) {
                    var e = this._canvas.getContext("2d");
                    this._textDirty && this._reflowLines(t),
                    this._canvas.width = Math.ceil(this._size[0] * t),
                    this._canvas.height = Math.ceil(this._size[1] * t),
                    this._restyleCanvas(),
                    e.setTransform(1, 0, 0, 1, 0, 0),
                    e.clearRect(0, 0, this._canvas.width, this._canvas.height),
                    e.scale(t, t),
                    e.stroke(),
                    e.fill(),
                    e.fillStyle = this.style.COLOR,
                    e.font = "".concat(this.style.FONT_SIZE, "px ").concat(this.style.FONT, ", sans-serif");
                    for (var i = this._lines, r = this.style.STROKE_WIDTH + this.style.VERTICAL_PADDING, a = 0; a < i.length; a++) {
                        var n = i[a]
                          , s = this.measurementProvider.measureText(n) + 2 * this.style.STROKE_WIDTH
                          , o = 0;
                        "center" === this.style.ALIGN && (o = this._size[0] / 2 - s / 2),
                        "right" !== this.style.ALIGN && "abs_right" !== this.style.ALIGN || (o = this._size[0] - s);
                        var l = this.style.LINE_HEIGHT * a + .9 * this.style.FONT_SIZE + this.style.VERTICAL_PADDING;
                        if (this.style.STROKE_WIDTH > 0 && (l += this.style.STROKE_WIDTH,
                        o += this.style.STROKE_WIDTH,
                        e.lineWidth = 2 * this.style.STROKE_WIDTH,
                        e.strokeStyle = this.style.STROKE_COLOR,
                        e.strokeText(n, o, l)),
                        this.style.RAINBOW) {
                            for (var u = e.createLinearGradient(o, 0, o + s, 0), x = 0; x < 12; x++)
                                u.addColorStop(x / 12, "hsl(".concat(360 * x / 12, ", 100%, 50%)"));
                            e.fillStyle = u
                        }
                        if (this.style.GRADIENT) {
                            var T = this.style.GRADIENT.style || "updown"
                              , c = e.createLinearGradient(o, 0, o + s, 0);
                            "updown" === T && (c = e.createLinearGradient(o, r, o, l),
                            r = l + this.style.STROKE_WIDTH + this.style.VERTICAL_PADDING),
                            this.style.GRADIENT.colorStops.forEach((function(t) {
                                c.addColorStop(t[0], t[1])
                            }
                            )),
                            e.fillStyle = c
                        }
                        e.fillText(n, o, l)
                    }
                    var M = [this._size[0] / 2, .9 * this.style.FONT_SIZE];
                    "abs_left" === this.style.ALIGN && (M[0] = 0),
                    "abs_right" === this.style.ALIGN && (M[0] = this._size[0]),
                    this._rotationCenter = M,
                    this._renderedScale = t
                }
            }, {
                key: "getTexture",
                value: function(t) {
                    var e = (t ? Math.max(Math.abs(t[0]), Math.abs(t[1])) : 100) / 100;
                    if (this._textureDirty || this._renderedScale !== e) {
                        if (this._renderedScale !== e && (this._textDirty = !0),
                        this._renderText(e),
                        0 === this._canvas.width || 0 === this._canvas.height)
                            return l(T(h.prototype), "getTexture", this).call(this);
                        this._textureDirty = !1;
                        var i = this._canvas.getContext("2d", {
                            willReadFrequently: !0
                        }).getImageData(0, 0, this._canvas.width, this._canvas.height)
                          , r = this._renderer.gl;
                        if (null === this._texture) {
                            var a = {
                                auto: !1,
                                wrap: r.CLAMP_TO_EDGE
                            };
                            this._texture = c.createTexture(r, a)
                        }
                        this._setTexture(i)
                    }
                    return this._texture
                }
            }, {
                key: "size",
                get: function() {
                    return this._textDirty && this._reflowLines(this._renderedScale),
                    this._size
                }
            }, {
                key: "maxScale",
                get: function() {
                    return 10
                }
            }]) && o(i.prototype, r),
            h
        };
        function g(t) {
            return function(t) {
                if (Array.isArray(t))
                    return y(t)
            }(t) || function(t) {
                if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
                    return Array.from(t)
            }(t) || function(t, e) {
                if (t) {
                    if ("string" == typeof t)
                        return y(t, e);
                    var i = Object.prototype.toString.call(t).slice(8, -1);
                    return "Object" === i && t.constructor && (i = t.constructor.name),
                    "Map" === i || "Set" === i ? Array.from(t) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? y(t, e) : void 0
                }
            }(t) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function y(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var i = 0, r = new Array(e); i < e; i++)
                r[i] = t[i];
            return r
        }
        function I(t, e) {
            for (var i = 0; i < e.length; i++) {
                var r = e[i];
                r.enumerable = r.enumerable || !1,
                r.configurable = !0,
                "value"in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r)
            }
        }
        var D, f = i(673), A = i(9122), p = i(3392), L = i(9478), S = i(6659), m = (i(1949),
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMjcuODM0IDlhMyAzIDAgMDEyLjU0NiAxLjQxMmwuMDk3LjE2Ny4wNTQuMTEuMDUyLjExMi4wNDguMTEyIDYuMjIyIDE2YTMuMDAxIDMuMDAxIDAgMDEtMi4yNyA0LjA0MWwtLjE4LjAyNS0uMTE1LjAxMS0uMTE2LjAwNy0uMTE1LjAwM2gtMS44NTVhMyAzIDAgMDEtMi41NDUtMS40MTJsLS4wOTYtLjE2Ny0uMTA3LS4yMjItLjA0OC0uMTExTDI4Ljk4MyAyOGgtNC45M2wtLjQyMiAxLjA4N2EzLjAwMyAzLjAwMyAwIDAxLTIuNDEgMS44ODlsLS4xOTMuMDE4LS4xOTQuMDA2LTEuOTQtLjAwMi0uMDk2LjAwMkg3YTMgMyAwIDAxLTIuODctMy44NzJsLjA3Mi0uMjA5IDYuMTgzLTE2YTMuMDAxIDMuMDAxIDAgMDEyLjYwNC0xLjkxM0wxMy4xODQgOWwzLjkuMDAxLjA5OS0uMDAxIDMuOTI0LjAwMi4wOTUtLjAwMiAzLjkwNS4wMDIuMDk1LS4wMDJoMi42MzJ6IiBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0yNS42NjMgMjFsLjgxNi0yLjA5OS44MTYgMi4wOTloLTEuNjMyem0xMC4yNTggNi4yNzVsLTYuMjIzLTE2LS4wNzUtLjE2OC0uMDg1LS4xNDVjLS4zODctLjYxMS0xLjAxOS0uOTYyLTEuNzAzLS45NjJoLTIuNjMzbC0uMDk2LjAwMi0uMDYyLS4wMDFMMjEuMjAyIDEwbC0uMDk2LjAwMi0uMDYyLS4wMDFMMTcuMTgzIDEwbC0uMDg2LjAwMkwxMy4xODQgMTBsLS4xNjUuMDA3YTIuMDAzIDIuMDAzIDAgMDAtMS43MDIgMS4yNzJsLTYuMTgyIDE2LS4wNTkuMTc1QTIgMiAwIDAwNyAzMGgxMS43OThsLjA4OC0uMDAyIDEuOTQ5LjAwMi4xNjMtLjAwNy4xNjEtLjAxOWEyIDIgMCAwMDEuNTM5LTEuMjQ5bC42Ny0xLjcyNWg2LjI5OWwuNjcyIDEuNzI2LjA3NC4xNjcuMDg2LjE0NWMuMzg3LjYxMSAxLjAxOC45NjIgMS43MDMuOTYyaDEuODU1bC4xNzQtLjAwOS4xNjQtLjAyNGMuOTc2LS4xODcgMS42NjItMS4wMDMgMS42NjItMS45NjcgMC0uMjQ4LS4wNDYtLjQ5NC0uMTM2LS43MjV6IiBmaWxsLW9wYWNpdHk9Ii4yNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0xMy4xODMgMTFoMy44MThhMSAxIDAgMDEuOTQxIDEuMzM4bC01Ljc0MiAxNmExIDEgMCAwMS0uOTQuNjYySDdhMSAxIDAgMDEtLjkzMy0xLjM2bDYuMTgzLTE2YTEgMSAwIDAxLjkzMy0uNjR6IiBmaWxsPSIjNEM5N0ZGIi8+PHBhdGggZD0iTTE3LjE4MyAxMUgyMWExIDEgMCAwMS45NDIgMS4zMzhsLTUuNzQyIDE2YTEgMSAwIDAxLS45NDEuNjYyaC00LjI2YTEgMSAwIDAxLS45MzItMS4zNmw2LjE4My0xNmExIDEgMCAwMS45MzMtLjY0eiIgZmlsbD0iI0NGNjNDRiIvPjxwYXRoIGQ9Ik0yMS4yMDIgMTFIMjVhMSAxIDAgMDEuOTMzIDEuMzYxbC02LjIwMyAxNmExIDEgMCAwMS0uOTMyLjYzOUgxNWExIDEgMCAwMS0uOTMzLTEuMzYxbDYuMjAzLTE2YTEgMSAwIDAxLjkzMi0uNjM5eiIgZmlsbD0iI0ZGQkYwMCIvPjxwYXRoIGQ9Ik0yNy44MzQgMTFhMSAxIDAgMDEuOTMyLjYzOGw2LjIyMiAxNkExIDEgMCAwMTM0LjA1NiAyOWgtMS44NTRhMSAxIDAgMDEtLjkzMi0uNjM4TDMwLjM1MSAyNmgtNy42NjZsLS45MTkgMi4zNjJhMSAxIDAgMDEtLjkzMi42MzhIMTguOThhMSAxIDAgMDEtLjkzMi0xLjM2Mmw2LjIyMi0xNmExIDEgMCAwMS45MzItLjYzOHptLTEuMzE2IDUuMTQzTDI0LjI0IDIyaDQuNTU2bC0yLjI3OC01Ljg1N3oiIGZpbGw9IiNGRkYiLz48L2c+PC9zdmc+"), E = "Sans Serif", N = "Serif", w = "Handwriting", _ = "Marker", v = "Curly", O = "Pixel", j = "Random", b = Object.keys(r.g).map((function(t) {
            return {
                text: r.g[t].name,
                value: t
            }
        }
        ));
        const k = function() {
            function t(e) {
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                this.runtime = e,
                this._onTargetWillExit = this._onTargetWillExit.bind(this),
                this.runtime.on("targetWasRemoved", this._onTargetWillExit),
                this._onTargetCreated = this._onTargetCreated.bind(this),
                this.runtime.on("targetWasCreated", this._onTargetCreated),
                this.runtime.on("PROJECT_STOP_ALL", this.stopAll.bind(this)),
                D = e.getFormatMessage({
                    "zh-cn": {
                        name: "艺术字",
                        "text.doc": "文档",
                        "text.docUrl": "https://dev.ccw.site/extensions/text",
                        "text.setText": "显示文字 [TEXT]",
                        "text.animateText": "[ANIMATE] 效果显示文字 [TEXT]",
                        "text.DefaultText": "欢迎来到我的项目！",
                        "text.DefaultAnimateText": "我们开始吧！",
                        "text.animate.type": "打字机",
                        "text.animate.rainbow": "彩虹",
                        "text.animate.zoom": "放大",
                        "text.clearText": "显示角色",
                        "text.setFont": "将字体设置为 [FONT]",
                        "text.setColor": "将文字颜色设置为 [COLOR]",
                        "text.setWidth": "将宽度设置为 [WIDTH] 对齐方式为 [ALIGN]",
                        "text.font.randomFont": "随机字体",
                        "text.align.left": "靠左对齐",
                        "text.align.center": "中心对齐",
                        "text.align.right": "靠右对齐",
                        "text.align.abs_left": "以x 坐标为起点，靠左对齐",
                        "text.align.abs_right": "以x 坐标为终点，靠右对齐",
                        "text.warning": "---⚠️ 以下仅在 CCW 上有效",
                        "text.setStroke": "描边 [WIDTH] 颜色为 [COLOR]",
                        "text.animateTextAdv": "以每 [TICK]毫秒/字，打字 [TEXT]",
                        "text.setColorGradient": "将字体颜色设置为[DIRECTION]的渐变色 [COLOR] 到 [COLOR2]",
                        "text.setColorGradient.updown": "上下",
                        "text.setColorGradient.leftright": "左右",
                        "text.setLineBreakMode": "按 [MODE] 换行",
                        "text.wrapMode.width": "文本宽度",
                        "text.wrapMode.symbol": "\\n 换行符",
                        "text.setLineHeight": "将行高设置为 [H] 倍",
                        "text.whenFontLoaded": "当字体 [font] 载入时",
                        "text.calculateText": "计算 [PROP] [TEXT]",
                        "text.prop.lines": "行数",
                        "text.prop.width": "宽度",
                        "text.prop.height": "高度",
                        "text.speed.1x": "1x",
                        "text.speed.1_5x": "1.5x",
                        "text.speed.2x": "2x",
                        "text.speed.3x": "3x",
                        "text.speed.5x": "5x",
                        "text.speed.10x": "10x",
                        "text.speed.inf": "极速完成",
                        "text.speed.pause": "暂停",
                        "text.setAnimationSpeed": "设置打字速度为 [SPEED]",
                        "text.dispatchTextTyped": "当打字动画 [character] 输出, 已经输出:[typedString], 待输出:[restString]"
                    },
                    en: {
                        name: "Animated Text",
                        "text.doc": "Documentation",
                        "text.docUrl": "https://getgandi.com/extensions/text",
                        "text.setText": "show text [TEXT]",
                        "text.animateText": "[ANIMATE] text [TEXT]",
                        "text.DefaultText": "Welcome to my project!",
                        "text.DefaultAnimateText": "Here we go!",
                        "text.animate.type": "type",
                        "text.animate.rainbow": "rainbow",
                        "text.animate.zoom": "zoom",
                        "text.clearText": "show sprite",
                        "text.setFont": "set font to [FONT]",
                        "text.setColor": "set text color to [COLOR]",
                        "text.setWidth": "set width to [WIDTH] aligned [ALIGN]",
                        "text.font.randomFont": "random font",
                        "text.align.left": "left",
                        "text.align.center": "center",
                        "text.align.right": "right",
                        "text.align.abs_left": "left, start with sprite x",
                        "text.align.abs_right": "right, end with sprite x",
                        "text.warning": "---⚠️ The following only on Gandi IDE",
                        "text.setStroke": "set stroke [WIDTH] color [COLOR]",
                        "text.animateTextAdv": "type text [TEXT], every [TICK] ms a letter",
                        "text.setColorGradient": "set color gradient from [COLOR] to [COLOR2] with [DIRECTION]",
                        "text.setColorGradient.updown": "up to down",
                        "text.setColorGradient.leftright": "left to right",
                        "text.setLineBreakMode": "wrap line by [MODE]",
                        "text.wrapMode.width": "text width",
                        "text.wrapMode.symbol": "\\n symbol",
                        "text.setLineHeight": "set line height to [H]x",
                        "text.whenFontLoaded": "when font [font] loaded",
                        "text.calculateText": "calculate [PROP] of [TEXT]",
                        "text.prop.lines": "lines",
                        "text.prop.width": "width",
                        "text.prop.height": "height",
                        "text.speed.1x": "1x",
                        "text.speed.1_5x": "1.5x",
                        "text.speed.2x": "2x",
                        "text.speed.3x": "3x",
                        "text.speed.5x": "5x",
                        "text.speed.10x": "10x",
                        "text.speed.inf": "inf",
                        "text.speed.pause": "pause",
                        "text.setAnimationSpeed": "set type speed to [SPEED]",
                        "text.dispatchTextTyped": "when [character] typed, typed:[typedString], rest:[restString]"
                    }
                }),
                function(t) {
                    var e = t.constructor;
                    if (!e.prototype.updateTextCostumeSkin) {
                        var i = t.getSkinClass()
                          , r = h(i);
                        e.prototype.updateTextCostumeSkin = function() {
                            for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
                                e[i] = arguments[i];
                            var a = e[0];
                            if (a.skinId && this._allSkins[a.skinId]instanceof r)
                                return this._allSkins[a.skinId].setTextAndStyle(a),
                                a.skinId;
                            var n = this._nextSkinId++
                              , s = new r(n,this);
                            return this._allSkins[n] = s,
                            s.setTextAndStyle(a),
                            n
                        }
                        ,
                        n().prototype.setFontAndSize = function(t, e) {
                            this._font = t,
                            this._fontSize = e,
                            this._ctx.font = "".concat(e, "px ").concat(t, ", serif")
                        }
                    }
                }(e.renderer)
            }
            var e, i, a;
            return e = t,
            i = [{
                key: "getInfo",
                value: function() {
                    return {
                        id: "text",
                        name: D("name"),
                        blockIconURI: m,
                        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMjcuODM0IDlhMyAzIDAgMDEyLjU0NiAxLjQxMmwuMDk3LjE2Ny4wNTQuMTEuMDUyLjExMi4wNDguMTEyIDYuMjIyIDE2YTMuMDAxIDMuMDAxIDAgMDEtMi4yNyA0LjA0MWwtLjE4LjAyNS0uMTE1LjAxMS0uMTE2LjAwNy0uMTE1LjAwM2gtMS44NTVhMyAzIDAgMDEtMi41NDUtMS40MTJsLS4wOTYtLjE2Ny0uMTA3LS4yMjItLjA0OC0uMTExTDI4Ljk4MyAyOGgtNC45M2wtLjQyMiAxLjA4N2EzLjAwMyAzLjAwMyAwIDAxLTIuNDEgMS44ODlsLS4xOTMuMDE4LS4xOTQuMDA2LTEuOTQtLjAwMi0uMDk2LjAwMkg3YTMgMyAwIDAxLTIuODctMy44NzJsLjA3Mi0uMjA5IDYuMTgzLTE2YTMuMDAxIDMuMDAxIDAgMDEyLjYwNC0xLjkxM0wxMy4xODQgOWwzLjkuMDAxLjA5OS0uMDAxIDMuOTI0LjAwMi4wOTUtLjAwMiAzLjkwNS4wMDIuMDk1LS4wMDJoMi42MzJ6IiBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0yNS42NjMgMjFsLjgxNi0yLjA5OS44MTYgMi4wOTloLTEuNjMyem0xMC4yNTggNi4yNzVsLTYuMjIzLTE2LS4wNzUtLjE2OC0uMDg1LS4xNDVjLS4zODctLjYxMS0xLjAxOS0uOTYyLTEuNzAzLS45NjJoLTIuNjMzbC0uMDk2LjAwMi0uMDYyLS4wMDFMMjEuMjAyIDEwbC0uMDk2LjAwMi0uMDYyLS4wMDFMMTcuMTgzIDEwbC0uMDg2LjAwMkwxMy4xODQgMTBsLS4xNjUuMDA3YTIuMDAzIDIuMDAzIDAgMDAtMS43MDIgMS4yNzJsLTYuMTgyIDE2LS4wNTkuMTc1QTIgMiAwIDAwNyAzMGgxMS43OThsLjA4OC0uMDAyIDEuOTQ5LjAwMi4xNjMtLjAwNy4xNjEtLjAxOWEyIDIgMCAwMDEuNTM5LTEuMjQ5bC42Ny0xLjcyNWg2LjI5OWwuNjcyIDEuNzI2LjA3NC4xNjcuMDg2LjE0NWMuMzg3LjYxMSAxLjAxOC45NjIgMS43MDMuOTYyaDEuODU1bC4xNzQtLjAwOS4xNjQtLjAyNGMuOTc2LS4xODcgMS42NjItMS4wMDMgMS42NjItMS45NjcgMC0uMjQ4LS4wNDYtLjQ5NC0uMTM2LS43MjV6IiBmaWxsLW9wYWNpdHk9Ii4yNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0xMy4xODMgMTFoMy44MThhMSAxIDAgMDEuOTQxIDEuMzM4bC01Ljc0MiAxNmExIDEgMCAwMS0uOTQuNjYySDdhMSAxIDAgMDEtLjkzMy0xLjM2bDYuMTgzLTE2YTEgMSAwIDAxLjkzMy0uNjR6IiBmaWxsPSIjNEM5N0ZGIi8+PHBhdGggZD0iTTE3LjE4MyAxMUgyMWExIDEgMCAwMS45NDIgMS4zMzhsLTUuNzQyIDE2YTEgMSAwIDAxLS45NDEuNjYyaC00LjI2YTEgMSAwIDAxLS45MzItMS4zNmw2LjE4My0xNmExIDEgMCAwMS45MzMtLjY0eiIgZmlsbD0iI0NGNjNDRiIvPjxwYXRoIGQ9Ik0yMS4yMDIgMTFIMjVhMSAxIDAgMDEuOTMzIDEuMzYxbC02LjIwMyAxNmExIDEgMCAwMS0uOTMyLjYzOUgxNWExIDEgMCAwMS0uOTMzLTEuMzYxbDYuMjAzLTE2YTEgMSAwIDAxLjkzMi0uNjM5eiIgZmlsbD0iI0ZGQkYwMCIvPjxwYXRoIGQ9Ik0yNy44MzQgMTFhMSAxIDAgMDEuOTMyLjYzOGw2LjIyMiAxNkExIDEgMCAwMTM0LjA1NiAyOWgtMS44NTRhMSAxIDAgMDEtLjkzMi0uNjM4TDMwLjM1MSAyNmgtNy42NjZsLS45MTkgMi4zNjJhMSAxIDAgMDEtLjkzMi42MzhIMTguOThhMSAxIDAgMDEtLjkzMi0xLjM2Mmw2LjIyMi0xNmExIDEgMCAwMS45MzItLjYzOHptLTEuMzE2IDUuMTQzTDI0LjI0IDIyaDQuNTU2bC0yLjI3OC01Ljg1N3oiIGZpbGw9IiNGRkYiLz48L2c+PC9zdmc+",
                        blocks: [{
                            blockType: A.BUTTON,
                            text: D({
                                id: "text.doc",
                                default: "Document"
                            }),
                            onClick: function() {
                                var t = D({
                                    id: "text.docUrl",
                                    default: "https://getgandi.com/extensions/text"
                                });
                                window.open(t, "_blank")
                            }
                        }, "---", {
                            opcode: "setText",
                            text: D({
                                id: "text.setText",
                                default: "show text [TEXT]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                TEXT: {
                                    type: f.STRING,
                                    defaultValue: t.DefaultText
                                }
                            }
                        }, {
                            opcode: "animateText",
                            text: D({
                                id: "text.animateText",
                                default: "[ANIMATE] text [TEXT]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                ANIMATE: {
                                    type: f.STRING,
                                    menu: "ANIMATE",
                                    defaultValue: "rainbow"
                                },
                                TEXT: {
                                    type: f.STRING,
                                    defaultValue: D("text.DefaultAnimateText")
                                }
                            }
                        }, {
                            opcode: "clearText",
                            text: D({
                                id: "text.clearText",
                                default: "show sprite",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {}
                        }, "---", {
                            opcode: "setFont",
                            text: D({
                                id: "text.setFont",
                                default: "set font to [FONT]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                FONT: {
                                    type: f.STRING,
                                    menu: "FONT",
                                    defaultValue: "fzdlt"
                                }
                            }
                        }, {
                            opcode: "setColor",
                            text: D({
                                id: "text.setColor",
                                default: "set text color to [COLOR]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                COLOR: {
                                    type: f.COLOR
                                }
                            }
                        }, {
                            opcode: "setWidth",
                            text: D({
                                id: "text.setWidth",
                                default: "set width to [WIDTH] aligned [ALIGN]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                WIDTH: {
                                    type: f.NUMBER,
                                    defaultValue: 200
                                },
                                ALIGN: {
                                    type: f.STRING,
                                    defaultValue: "left",
                                    menu: "ALIGN"
                                }
                            }
                        }, D({
                            id: "text.warning"
                        }), {
                            opcode: "dispatchFontLoaded",
                            text: D({
                                id: "text.whenFontLoaded",
                                default: "when font [font] loaded"
                            }),
                            blockType: A.HAT,
                            isEdgeActivated: !1,
                            arguments: {
                                font: {
                                    type: "ccw_hat_parameter"
                                }
                            }
                        }, {
                            opcode: "setLineBreakMode",
                            text: D({
                                id: "text.setLineBreakMode",
                                default: "wrap line by [MODE]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                MODE: {
                                    type: f.STRING,
                                    menu: "WRAP_MODE",
                                    defaultValue: "width"
                                }
                            }
                        }, {
                            opcode: "setLineHeight",
                            text: D({
                                id: "text.setLineHeight",
                                default: "wrap line height: [H]x",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                H: {
                                    type: f.NUMBER,
                                    defaultValue: 1.25
                                }
                            }
                        }, {
                            opcode: "setColorGradient",
                            text: D({
                                id: "text.setColorGradient",
                                default: "set color gradient from [COLOR] to [COLOR2] with [DIRECTION]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                COLOR: {
                                    type: f.COLOR,
                                    defaultValue: "#8aec80"
                                },
                                COLOR2: {
                                    type: f.COLOR,
                                    defaultValue: "#5FC454"
                                },
                                DIRECTION: {
                                    type: f.STRING,
                                    menu: "DIRECTION",
                                    defaultValue: "updown"
                                }
                            }
                        }, {
                            opcode: "setStroke",
                            text: D({
                                id: "text.setStroke",
                                default: "set stroke [WIDTH] color [COLOR]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                WIDTH: {
                                    type: f.NUMBER,
                                    defaultValue: 1
                                },
                                COLOR: {
                                    type: f.COLOR,
                                    defaultValue: "#000000"
                                }
                            }
                        }, {
                            opcode: "calculateText",
                            text: D({
                                id: "text.calculateText",
                                default: "calculate [PROP] [TEXT]",
                                description: ""
                            }),
                            blockType: A.REPORTER,
                            arguments: {
                                TEXT: {
                                    type: f.STRING,
                                    defaultValue: D("text.DefaultAnimateText")
                                },
                                PROP: {
                                    type: f.STRING,
                                    menu: "PROP",
                                    defaultValue: "lines"
                                }
                            }
                        }, {
                            opcode: "animateTextAdv",
                            text: D({
                                id: "text.animateTextAdv",
                                default: "type text [TEXT], every [TICK] ms a letter",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                TICK: {
                                    type: f.NUMBER,
                                    defaultValue: 60
                                },
                                TEXT: {
                                    type: f.STRING,
                                    defaultValue: D("text.DefaultAnimateText")
                                }
                            }
                        }, {
                            opcode: "setAnimationSpeed",
                            text: D({
                                id: "text.setAnimationSpeed",
                                default: "set type speed to [SPEED]",
                                description: ""
                            }),
                            blockType: A.COMMAND,
                            arguments: {
                                SPEED: {
                                    type: f.NUMBER,
                                    defaultValue: 1,
                                    menu: "SPEED"
                                }
                            }
                        }, {
                            opcode: "dispatchTextTyped",
                            text: D({
                                id: "text.dispatchTextTyped",
                                default: "when [character] typed, typed:[typedString], rest:[restString]"
                            }),
                            blockType: A.HAT,
                            isEdgeActivated: !1,
                            arguments: {
                                character: {
                                    type: "ccw_hat_parameter"
                                },
                                typedString: {
                                    type: "ccw_hat_parameter"
                                },
                                restString: {
                                    type: "ccw_hat_parameter"
                                }
                            }
                        }],
                        menus: {
                            SPEED: {
                                items: [{
                                    text: D("text.speed.1x"),
                                    value: 1
                                }, {
                                    text: D("text.speed.1_5x"),
                                    value: 1.5
                                }, {
                                    text: D("text.speed.2x"),
                                    value: 2
                                }, {
                                    text: D("text.speed.3x"),
                                    value: 3
                                }, {
                                    text: D("text.speed.5x"),
                                    value: 5
                                }, {
                                    text: D("text.speed.10x"),
                                    value: 10
                                }, {
                                    text: D("text.speed.inf"),
                                    value: 1 / 0
                                }, {
                                    text: D("text.speed.pause"),
                                    value: -1
                                }]
                            },
                            PROP: {
                                items: [{
                                    text: D("text.prop.lines"),
                                    value: "lines"
                                }, {
                                    text: D("text.prop.width"),
                                    value: "width"
                                }, {
                                    text: D("text.prop.height"),
                                    value: "height"
                                }]
                            },
                            FONT: {
                                items: [].concat(g(b), [{
                                    text: "Sans Serif",
                                    value: E
                                }, {
                                    text: "Serif",
                                    value: N
                                }, {
                                    text: "Handwriting",
                                    value: w
                                }, {
                                    text: "Marker",
                                    value: _
                                }, {
                                    text: "Curly",
                                    value: v
                                }, {
                                    text: "Pixel",
                                    value: O
                                }, {
                                    text: D("text.font.randomFont"),
                                    value: j
                                }])
                            },
                            ALIGN: {
                                items: [{
                                    text: D("text.align.left"),
                                    value: "left"
                                }, {
                                    text: D("text.align.center"),
                                    value: "center"
                                }, {
                                    text: D("text.align.right"),
                                    value: "right"
                                }, {
                                    text: D("text.align.abs_left"),
                                    value: "abs_left"
                                }, {
                                    text: D("text.align.abs_right"),
                                    value: "abs_right"
                                }]
                            },
                            DIRECTION: {
                                items: [{
                                    text: D("text.setColorGradient.updown"),
                                    value: "updown"
                                }, {
                                    text: D("text.setColorGradient.leftright"),
                                    value: "leftright"
                                }]
                            },
                            WRAP_MODE: {
                                items: [{
                                    text: D("text.wrapMode.width"),
                                    value: "width"
                                }, {
                                    text: D("text.wrapMode.symbol"),
                                    value: "symbol"
                                }]
                            },
                            ANIMATE: {
                                items: [{
                                    text: D("text.animate.type"),
                                    value: "type"
                                }, {
                                    text: D("text.animate.rainbow"),
                                    value: "rainbow"
                                }, {
                                    text: D("text.animate.zoom"),
                                    value: "zoom"
                                }]
                            }
                        }
                    }
                }
            }, {
                key: "setText",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    return i.text = this._formatText(t.TEXT),
                    i.visible = !0,
                    i.animating = !1,
                    this._renderText(e.target),
                    Promise.resolve()
                }
            }, {
                key: "clearText",
                value: function(t, e) {
                    var i = e.target
                      , r = this._getTextState(i);
                    r.visible = !1,
                    r.animating = !1;
                    var a = i.getCostumes()[i.currentCostume];
                    return this.runtime.renderer.updateDrawableSkinId(i.drawableID, a.skinId),
                    Promise.resolve()
                }
            }, {
                key: "stopAll",
                value: function() {
                    var t = this;
                    this.runtime.targets.forEach((function(e) {
                        t.clearText({}, {
                            target: e
                        })
                    }
                    ))
                }
            }, {
                key: "addText",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    return i.text += this._formatText(t.TEXT),
                    i.visible = !0,
                    i.animating = !1,
                    this._renderText(e.target),
                    Promise.resolve()
                }
            }, {
                key: "addLine",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    return i.text += "\n".concat(this._formatText(t.TEXT)),
                    i.visible = !0,
                    i.animating = !1,
                    this._renderText(e.target),
                    Promise.resolve()
                }
            }, {
                key: "setFont",
                value: function(t, e) {
                    var i = this
                      , a = this._getTextState(e.target);
                    return t.FONT === j ? a.font = this._randomFontOtherThan(a.font) : a.font = t.FONT,
                    (0,
                    r.m)(a.font).then((function() {
                        e.startHatsWithParams("text_dispatchFontLoaded", {
                            parameters: {
                                font: a.font
                            }
                        }),
                        i._renderText(e.target)
                    }
                    ))
                }
            }, {
                key: "dispatchFontLoaded",
                value: function(t, e) {
                    return !0
                }
            }, {
                key: "dispatchTextTyped",
                value: function(t, e) {
                    return !0
                }
            }, {
                key: "_randomFontOtherThan",
                value: function(t) {
                    var e = this.FONT_IDS.filter((function(e) {
                        return e !== t
                    }
                    ));
                    return e[Math.floor(Math.random() * e.length)]
                }
            }, {
                key: "setColor",
                value: function(t, e) {
                    var i, r, a, n, s = this._getTextState(e.target), o = p.toRgbColorObject(t.COLOR);
                    s.color = "rgba(".concat(null !== (i = o.r) && void 0 !== i ? i : 0, ", ").concat(null !== (r = o.g) && void 0 !== r ? r : 0, ", ").concat(null !== (a = o.b) && void 0 !== a ? a : 0, ", ").concat(null !== (n = o.a) && void 0 !== n ? n : 255, ")"),
                    this._renderText(e.target)
                }
            }, {
                key: "setColorGradient",
                value: function(t, e) {
                    var i, r, a, n, s, o, l, u, x = this._getTextState(e.target), T = p.toRgbColorObject(t.COLOR), c = p.toRgbColorObject(t.COLOR2), M = p.toString(t.DIRECTION);
                    x.gradient = {
                        style: M,
                        colorStops: [[0, "rgba(".concat(null !== (i = T.r) && void 0 !== i ? i : 0, ", ").concat(null !== (r = T.g) && void 0 !== r ? r : 0, ", ").concat(null !== (a = T.b) && void 0 !== a ? a : 0, ", ").concat(null !== (n = T.a) && void 0 !== n ? n : 255, ")")], [1, "rgba(".concat(null !== (s = c.r) && void 0 !== s ? s : 0, ", ").concat(null !== (o = c.g) && void 0 !== o ? o : 0, ", ").concat(null !== (l = c.b) && void 0 !== l ? l : 0, ", ").concat(null !== (u = c.a) && void 0 !== u ? u : 255, ")")]]
                    },
                    this._renderText(e.target)
                }
            }, {
                key: "setLineHeight",
                value: function(t, e) {
                    var i = this._getTextState(e.target)
                      , r = p.toNumber(t.H);
                    i.userDefinedLineHeight = Math.max(.5, Math.min(2, r)),
                    this._renderText(e.target)
                }
            }, {
                key: "setStroke",
                value: function(t, e) {
                    var i, r, a, n, s = this._getTextState(e.target), o = p.toRgbColorObject(t.COLOR);
                    s.strokeWidth = p.toNumber(t.WIDTH),
                    s.strokeColor = "rgba(".concat(null !== (i = o.r) && void 0 !== i ? i : 0, ", ").concat(null !== (r = o.g) && void 0 !== r ? r : 0, ", ").concat(null !== (a = o.b) && void 0 !== a ? a : 0, ", ").concat(null !== (n = o.a) && void 0 !== n ? n : 255, ")"),
                    this._renderText(e.target)
                }
            }, {
                key: "setLineBreakMode",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    "width" === p.toString(t.MODE) ? i.lineBreak = void 0 : i.lineBreak = "\\n",
                    this._renderText(e.target)
                }
            }, {
                key: "setWidth",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    i.maxWidth = p.toNumber(t.WIDTH),
                    i.align = t.ALIGN,
                    this._renderText(e.target)
                }
            }, {
                key: "setSize",
                value: function(t, e) {
                    this._getTextState(e.target).size = p.toNumber(t.SIZE),
                    this._renderText(e.target)
                }
            }, {
                key: "setAlign",
                value: function(t, e) {
                    var i = this._getTextState(e.target);
                    i.maxWidth = p.toNumber(t.WIDTH),
                    i.align = t.ALIGN,
                    this._renderText(e.target)
                }
            }, {
                key: "setOutlineWidth",
                value: function(t, e) {
                    this._getTextState(e.target).strokeWidth = p.toNumber(t.WIDTH),
                    this._renderText(e.target)
                }
            }, {
                key: "setOutlineColor",
                value: function(t, e) {
                    var i, r, a, n, s = this._getTextState(e.target), o = p.toRgbColorObject(t.COLOR);
                    s.strokeColor = "rgba(".concat(null !== (i = o.r) && void 0 !== i ? i : 0, ", ").concat(null !== (r = o.g) && void 0 !== r ? r : 0, ", ").concat(null !== (a = o.b) && void 0 !== a ? a : 0, ", ").concat(null !== (n = o.a) && void 0 !== n ? n : 255, ")"),
                    s.visible = !0,
                    this._renderText(e.target)
                }
            }, {
                key: "_animateText",
                value: function(t, e) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 60
                      , r = this
                      , a = e.target
                      , n = this._getTextState(a);
                    if (null === n.fullText) {
                        n.fullText = this._formatText(t.TEXT),
                        n.text = n.fullText[0] || "",
                        n.visible = !0,
                        n.animating = !0,
                        e.startHatsWithParams("text_dispatchTextTyped", {
                            parameters: {
                                character: n.text,
                                typedString: n.text,
                                restString: n.fullText.substring(1)
                            }
                        }),
                        this._renderText(a),
                        this.runtime.requestRedraw();
                        var s = this;
                        return new Promise((function(t) {
                            var o = 0
                              , l = Math.round((i < 10 ? 10 : i) / (1e3 / 60));
                            requestAnimationFrame((function u() {
                                if (-1 !== s.typeSpeed) {
                                    o++;
                                    var x = s.typeSpeed || 1;
                                    if ((l = Math.round((i < 10 ? 10 : i) / (1e3 * x / 60))) < 1 && (l = 1),
                                    o % l == 0) {
                                        if (!n.animating || !n.visible || n.text === n.fullText)
                                            return n.fullText = null,
                                            t(),
                                            r._renderText(a),
                                            void r.runtime.requestRedraw();
                                        if (n.text = n.fullText.substring(0, n.text.length + 1),
                                        n.lineBreak && n.text.endsWith("\\") && (n.text = n.fullText.substring(0, n.text.length + 1)),
                                        n.text.length > 0) {
                                            var T = n.text[n.text.length - 1];
                                            e.startHatsWithParams("text_dispatchTextTyped", {
                                                parameters: {
                                                    character: T,
                                                    typedString: n.text,
                                                    restString: n.fullText.substring(n.text.length)
                                                }
                                            })
                                        }
                                        if (s.typeSpeed === 1 / 0) {
                                            n.text = n.fullText,
                                            n.fullText = null;
                                            var c = n.text[n.text.length - 1];
                                            return e.startHatsWithParams("text_dispatchTextTyped", {
                                                parameters: {
                                                    character: c,
                                                    typedString: n.text,
                                                    restString: ""
                                                }
                                            }),
                                            t(),
                                            r._renderText(a),
                                            void r.runtime.requestRedraw()
                                        }
                                        r._renderText(a),
                                        r.runtime.requestRedraw(),
                                        requestAnimationFrame(u)
                                    } else
                                        requestAnimationFrame(u)
                                } else
                                    requestAnimationFrame(u)
                            }
                            ))
                        }
                        ))
                    }
                }
            }, {
                key: "_zoomText",
                value: function(t, e) {
                    var i = this
                      , r = e.target
                      , a = this._getTextState(r);
                    if (null === a.targetSize) {
                        var n = new S
                          , s = 1e3 * p.toNumber(t.SECS || .5);
                        return a.text = this._formatText(t.TEXT),
                        a.visible = !0,
                        a.animating = !0,
                        a.targetSize = r.size,
                        r.setSize(0),
                        this._renderText(r),
                        this.runtime.requestRedraw(),
                        n.start(),
                        new Promise((function(t) {
                            var e = setInterval((function() {
                                var o = n.timeElapsed();
                                a.animating && a.visible && o < s ? r.setSize(a.targetSize * o / s) : (r.setSize(a.targetSize),
                                a.targetSize = null,
                                clearInterval(e),
                                t()),
                                i._renderText(r),
                                i.runtime.requestRedraw()
                            }
                            ), i.runtime.currentStepTime)
                        }
                        ))
                    }
                }
            }, {
                key: "animateText",
                value: function(t, e) {
                    switch (t.ANIMATE) {
                    case "rainbow":
                        return this.rainbow(t, e);
                    case "type":
                        return this._animateText(t, e);
                    case "zoom":
                        return this._zoomText(t, e)
                    }
                }
            }, {
                key: "animateTextAdv",
                value: function(t, e) {
                    return this._animateText(t, e, p.toNumber(t.TICK))
                }
            }, {
                key: "setAnimationSpeed",
                value: function(t, e) {
                    this._getTextState(e.target);
                    var i = p.toNumber(t.SPEED);
                    this.typeSpeed = i
                }
            }, {
                key: "calculateText",
                value: function(t, e) {
                    var i = this._getTextState(e.target)
                      , r = p.toString(t.PROP)
                      , a = this._formatText(t.TEXT)
                      , n = i.skinId
                      , s = this.runtime.renderer._allSkins[n];
                    s || (i.text = this._formatText(""),
                    i.visible = !0,
                    i.animating = !1,
                    this._renderText(e.target),
                    n = (i = this._getTextState(e.target)).skinId,
                    s = this.runtime.renderer._allSkins[n]);
                    var o = {};
                    s && s.calculateTextDimensions && (o = s.calculateTextDimensions(a));
                    var l = o[r];
                    return "lines" === r ? o.lines ? o.lines.length : 1 : l
                }
            }, {
                key: "rainbow",
                value: function(t, e) {
                    var i = this
                      , r = e.target
                      , a = this._getTextState(r);
                    if (!a.rainbow) {
                        var n = new S
                          , s = 1e3 * p.toNumber(t.SECS || 2);
                        return a.text = this._formatText(t.TEXT),
                        a.visible = !0,
                        a.animating = !0,
                        a.rainbow = !0,
                        this._renderText(r),
                        n.start(),
                        new Promise((function(t) {
                            var e = setInterval((function() {
                                var o = n.timeElapsed();
                                a.animating && a.visible && o < s ? (a.rainbow = !0,
                                r.setEffect("color", o / -5)) : (a.rainbow = !1,
                                r.setEffect("color", 0),
                                clearInterval(e),
                                t()),
                                i._renderText(r)
                            }
                            ), i.runtime.currentStepTime)
                        }
                        ))
                    }
                }
            }, {
                key: "_getTextState",
                value: function(e) {
                    var i = e.getCustomState(t.STATE_KEY);
                    return i || (i = L.simple(t.DEFAULT_TEXT_STATE),
                    e.setCustomState(t.STATE_KEY, i)),
                    i
                }
            }, {
                key: "_formatText",
                value: function(t) {
                    return "" === t ? t : ("number" == typeof t && Math.abs(t) >= .01 && t % 1 != 0 && (t = t.toFixed(2)),
                    t = p.toString(t))
                }
            }, {
                key: "_renderText",
                value: function(t) {
                    if (this.runtime.renderer) {
                        var e = this._getTextState(t);
                        e.visible && (e.skinId = this.runtime.renderer.updateTextCostumeSkin(e),
                        this.runtime.renderer.updateDrawableSkinId(t.drawableID, e.skinId))
                    }
                }
            }, {
                key: "_onTargetCreated",
                value: function(e, i) {
                    var r = this;
                    if (i) {
                        var a = i.getCustomState(t.STATE_KEY);
                        if (a) {
                            e.setCustomState(t.STATE_KEY, L.simple(a));
                            var n = e.getCustomState(t.STATE_KEY);
                            n.skinId = null,
                            n.rainbow = !1,
                            n.targetSize = null,
                            n.fullText = null,
                            n.animating = !1,
                            e.on("EVENT_TARGET_VISUAL_CHANGE", (function t() {
                                r._renderText(e),
                                e.off("EVENT_TARGET_VISUAL_CHANGE", t)
                            }
                            ))
                        }
                    }
                }
            }, {
                key: "_onTargetWillExit",
                value: function(t) {
                    var e = this._getTextState(t);
                    e.skinId && (this.runtime.renderer.destroySkin(e.skinId),
                    e.skinId = null)
                }
            }, {
                key: "FONT_IDS",
                get: function() {
                    return [E, N, w, _, v, O].concat(g(Object.keys(r.g)))
                }
            }],
            a = [{
                key: "DEFAULT_TEXT_STATE",
                get: function() {
                    return {
                        skinId: null,
                        text: D("text.DefaultText"),
                        font: "Handwriting",
                        color: "hsla(225, 15%, 40%, 1",
                        size: 24,
                        maxWidth: 480,
                        align: "center",
                        strokeWidth: 0,
                        strokeColor: "black",
                        rainbow: !1,
                        visible: !1,
                        targetSize: null,
                        fullText: null
                    }
                }
            }, {
                key: "STATE_KEY",
                get: function() {
                    return "Scratch.text"
                }
            }, {
                key: "DefaultText",
                get: function() {
                    return D("text.DefaultText")
                }
            }],
            i && I(e.prototype, i),
            a && I(e, a),
            t.getHats = function() {
                return {
                    text_dispatchFontLoaded: {},
                    text_dispatchTextTyped: {}
                }
            }
            ,
            t
        }()
    }
    ,
    7990: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/AliPuhuiBlack.a1fbec0b.ttf"
    }
    ,
    3661: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/AliPuhuiLight.f042c4a4.ttf"
    }
    ,
    2435: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/IPix.7fdfb10e.ttf"
    }
    ,
    2830: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/MinecraftBold.a9b3bc2a.otf"
    }
    ,
    3255: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/MinecraftRegular.82ba0891.otf"
    }
    ,
    4703: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/ark-pixel-12px-monospaced-ja.12c5d2b2.otf"
    }
    ,
    8712: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/ark-pixel-12px-monospaced-ko.f2dcb1e7.otf"
    }
    ,
    5977: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/ark-pixel-12px-monospaced-zh_cn.fca1a64f.otf"
    }
    ,
    6334: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/california.bfc37a17.otf"
    }
    ,
    9909: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/仓耳小丸子.bc187e1e.ttf"
    }
    ,
    5616: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/千图小兔体.762b64ff.ttf"
    }
    ,
    2222: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/方正达利体.9a2a8d65.ttf"
    }
    ,
    1142: (t,e,i)=>{
        i.d(e, {
            Z: ()=>r
        });
        const r = i.p + "static/assets/方正雅珠体.208cb4e9.ttf"
    }
}]);
