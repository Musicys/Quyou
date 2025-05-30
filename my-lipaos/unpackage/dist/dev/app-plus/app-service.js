if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  class AbortablePromise {
    constructor(executor) {
      this._reject = null;
      this.promise = new Promise((resolve, reject) => {
        executor(resolve, reject);
        this._reject = reject;
      });
    }
    // 提供abort方法来中止Promise
    abort(error) {
      if (this._reject) {
        this._reject(error);
      }
    }
    then(onfulfilled, onrejected) {
      return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.promise.catch(onrejected);
    }
  }
  function uuid() {
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  }
  function addUnit(num) {
    return Number.isNaN(Number(num)) ? `${num}` : `${num}px`;
  }
  function isObj(value) {
    return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
  }
  function getType(target) {
    const typeStr = Object.prototype.toString.call(target);
    const match = typeStr.match(/\[object (\w+)\]/);
    const type = match && match.length ? match[1].toLowerCase() : "";
    return type;
  }
  const isDef = (value) => value !== void 0 && value !== null;
  const checkNumRange = (num, label = "value") => {
    if (num < 0) {
      throw new Error(`${label} shouldn't be less than zero`);
    }
  };
  function rgbToHex(r, g, b) {
    const hex = (r << 16 | g << 8 | b).toString(16);
    const paddedHex = "#" + "0".repeat(Math.max(0, 6 - hex.length)) + hex;
    return paddedHex;
  }
  function hexToRgb(hex) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2), 16));
    }
    return rgb;
  }
  const gradient = (startColor, endColor, step = 2) => {
    const sColor = hexToRgb(startColor);
    const eColor = hexToRgb(endColor);
    const rStep = (eColor[0] - sColor[0]) / step;
    const gStep = (eColor[1] - sColor[1]) / step;
    const bStep = (eColor[2] - sColor[2]) / step;
    const gradientColorArr = [];
    for (let i = 0; i < step; i++) {
      gradientColorArr.push(
        rgbToHex(parseInt(String(rStep * i + sColor[0])), parseInt(String(gStep * i + sColor[1])), parseInt(String(bStep * i + sColor[2])))
      );
    }
    return gradientColorArr;
  };
  const context = {
    id: 1e3
  };
  function getRect(selector, all, scope, useFields) {
    return new Promise((resolve, reject) => {
      let query = null;
      if (scope) {
        query = uni.createSelectorQuery().in(scope);
      } else {
        query = uni.createSelectorQuery();
      }
      const method = all ? "selectAll" : "select";
      const callback = (rect) => {
        if (all && isArray(rect) && rect.length > 0) {
          resolve(rect);
        } else if (!all && rect) {
          resolve(rect);
        } else {
          reject(new Error("No nodes found"));
        }
      };
      if (useFields) {
        query[method](selector).fields({ size: true, node: true }, callback).exec();
      } else {
        query[method](selector).boundingClientRect(callback).exec();
      }
    });
  }
  function kebabCase(word) {
    const newWord = word.replace(/[A-Z]/g, function(match) {
      return "-" + match;
    }).toLowerCase();
    return newWord;
  }
  function camelCase(word) {
    return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
  function isArray(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === "[object Array]";
  }
  function isFunction(value) {
    return getType(value) === "function" || getType(value) === "asyncfunction";
  }
  function isString(value) {
    return getType(value) === "string";
  }
  function isNumber(value) {
    return getType(value) === "number";
  }
  function isPromise$1(value) {
    if (isObj(value) && isDef(value)) {
      return isFunction(value.then) && isFunction(value.catch);
    }
    return false;
  }
  function objToStyle(styles) {
    if (isArray(styles)) {
      return styles.filter(function(item) {
        return item != null && item !== "";
      }).map(function(item) {
        return objToStyle(item);
      }).join(";");
    }
    if (isString(styles)) {
      return styles;
    }
    if (isObj(styles)) {
      return Object.keys(styles).filter(function(key) {
        return styles[key] != null && styles[key] !== "";
      }).map(function(key) {
        return [kebabCase(key), styles[key]].join(":");
      }).join(";");
    }
    return "";
  }
  const pause = (ms = 1e3 / 30) => {
    return new AbortablePromise((resolve) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve(true);
      }, ms);
    });
  };
  function deepAssign(target, source) {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const newObjValue = source[key];
      if (isObj(targetValue) && isObj(newObjValue)) {
        deepAssign(targetValue, newObjValue);
      } else {
        target[key] = newObjValue;
      }
    });
    return target;
  }
  function debounce$1(func, wait, options = {}) {
    let timeoutId = null;
    let lastArgs;
    let lastThis;
    let result;
    const leading = isDef(options.leading) ? options.leading : false;
    const trailing = isDef(options.trailing) ? options.trailing : true;
    function invokeFunc() {
      if (lastArgs !== void 0) {
        result = func.apply(lastThis, lastArgs);
        lastArgs = void 0;
      }
    }
    function startTimer() {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (trailing) {
          invokeFunc();
        }
      }, wait);
    }
    function cancelTimer() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
    function debounced(...args) {
      lastArgs = args;
      lastThis = this;
      if (timeoutId === null) {
        if (leading) {
          invokeFunc();
        }
        startTimer();
      } else if (trailing) {
        cancelTimer();
        startTimer();
      }
      return result;
    }
    return debounced;
  }
  const getPropByPath = (obj, path) => {
    const keys = path.split(".");
    try {
      return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
    } catch (error) {
      return void 0;
    }
  };
  function isImageUrl(url) {
    const imageRegex = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i;
    return imageRegex.test(url);
  }
  const numericProp = [Number, String];
  const makeRequiredProp = (type) => ({
    type,
    required: true
  });
  const makeArrayProp = () => ({
    type: Array,
    default: () => []
  });
  const makeBooleanProp = (defaultVal) => ({
    type: Boolean,
    default: defaultVal
  });
  const makeNumberProp = (defaultVal) => ({
    type: Number,
    default: defaultVal
  });
  const makeNumericProp = (defaultVal) => ({
    type: numericProp,
    default: defaultVal
  });
  const makeStringProp = (defaultVal) => ({
    type: String,
    default: defaultVal
  });
  const baseProps = {
    /**
     * 自定义根节点样式
     */
    customStyle: makeStringProp(""),
    /**
     * 自定义根节点样式类
     */
    customClass: makeStringProp("")
  };
  const iconProps = {
    ...baseProps,
    /**
     * 使用的图标名字，可以使用链接图片
     */
    name: makeRequiredProp(String),
    /**
     * 图标的颜色
     */
    color: String,
    /**
     * 图标的字体大小
     */
    size: String,
    /**
     * 类名前缀，用于使用自定义图标
     */
    classPrefix: makeStringProp("wd-icon")
  };
  const __default__$h = {
    name: "wd-icon",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$z = /* @__PURE__ */ vue.defineComponent({
    ...__default__$h,
    props: iconProps,
    emits: ["click", "touch"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isImage = vue.computed(() => {
        return isDef(props.name) && isImageUrl(props.name);
      });
      const rootClass = vue.computed(() => {
        const prefix = props.classPrefix;
        return `${prefix} ${props.customClass} ${isImage.value ? "wd-icon--image" : prefix + "-" + props.name}`;
      });
      const rootStyle = vue.computed(() => {
        const style = {};
        if (props.color) {
          style["color"] = props.color;
        }
        if (props.size) {
          style["font-size"] = addUnit(props.size);
        }
        return `${objToStyle(style)}; ${props.customStyle}`;
      });
      function handleClick(event) {
        emit("click", event);
      }
      const __returned__ = { props, emit, isImage, rootClass, rootStyle, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        onClick: $setup.handleClick,
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        $setup.isImage ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "wd-icon__image",
          src: _ctx.name
        }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-24906af6"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-icon/wd-icon.vue"]]);
  const transitionProps = {
    ...baseProps,
    /**
     * 是否展示组件
     * 类型：boolean
     * 默认值：false
     */
    show: makeBooleanProp(false),
    /**
     * 动画执行时间
     * 类型：number | boolean | Record<string, number>
     * 默认值：300 (毫秒)
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * 类型：boolean
     * 默认值：false
     */
    lazyRender: makeBooleanProp(false),
    /**
     * 动画类型
     * 类型：string
     * 可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in
     * 默认值：'fade'
     */
    name: [String, Array],
    /**
     * 是否在动画结束时销毁子节点（display: none)
     * 类型：boolean
     * 默认值：false
     */
    destroy: makeBooleanProp(true),
    /**
     * 进入过渡的开始状态
     * 类型：string
     */
    enterClass: makeStringProp(""),
    /**
     * 进入过渡的激活状态
     * 类型：string
     */
    enterActiveClass: makeStringProp(""),
    /**
     * 进入过渡的结束状态
     * 类型：string
     */
    enterToClass: makeStringProp(""),
    /**
     * 离开过渡的开始状态
     * 类型：string
     */
    leaveClass: makeStringProp(""),
    /**
     * 离开过渡的激活状态
     * 类型：string
     */
    leaveActiveClass: makeStringProp(""),
    /**
     * 离开过渡的结束状态
     * 类型：string
     */
    leaveToClass: makeStringProp("")
  };
  const __default__$g = {
    name: "wd-transition",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$y = /* @__PURE__ */ vue.defineComponent({
    ...__default__$g,
    props: transitionProps,
    emits: ["click", "before-enter", "enter", "before-leave", "leave", "after-leave", "after-enter"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const getClassNames = (name) => {
        let enter2 = `${props.enterClass} ${props.enterActiveClass}`;
        let enterTo = `${props.enterToClass} ${props.enterActiveClass}`;
        let leave2 = `${props.leaveClass} ${props.leaveActiveClass}`;
        let leaveTo = `${props.leaveToClass} ${props.leaveActiveClass}`;
        if (Array.isArray(name)) {
          for (let index = 0; index < name.length; index++) {
            enter2 = `wd-${name[index]}-enter wd-${name[index]}-enter-active ${enter2}`;
            enterTo = `wd-${name[index]}-enter-to wd-${name[index]}-enter-active ${enterTo}`;
            leave2 = `wd-${name[index]}-leave wd-${name[index]}-leave-active ${leave2}`;
            leaveTo = `wd-${name[index]}-leave-to wd-${name[index]}-leave-active ${leaveTo}`;
          }
        } else if (name) {
          enter2 = `wd-${name}-enter wd-${name}-enter-active ${enter2}`;
          enterTo = `wd-${name}-enter-to wd-${name}-enter-active ${enterTo}`;
          leave2 = `wd-${name}-leave wd-${name}-leave-active ${leave2}`;
          leaveTo = `wd-${name}-leave-to wd-${name}-leave-active ${leaveTo}`;
        }
        return {
          enter: enter2,
          "enter-to": enterTo,
          leave: leave2,
          "leave-to": leaveTo
        };
      };
      const props = __props;
      const emit = __emit;
      const inited = vue.ref(false);
      const display = vue.ref(false);
      const status = vue.ref("");
      const transitionEnded = vue.ref(false);
      const currentDuration = vue.ref(300);
      const classes = vue.ref("");
      const enterPromise = vue.ref(null);
      const enterLifeCyclePromises = vue.ref(null);
      const leaveLifeCyclePromises = vue.ref(null);
      const style = vue.computed(() => {
        return `-webkit-transition-duration:${currentDuration.value}ms;transition-duration:${currentDuration.value}ms;${display.value || !props.destroy ? "" : "display: none;"}${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-transition ${props.customClass}  ${classes.value}`;
      });
      vue.onBeforeMount(() => {
        if (props.show) {
          enter();
        }
      });
      vue.watch(
        () => props.show,
        (newVal) => {
          handleShow(newVal);
        },
        { deep: true }
      );
      function handleClick() {
        emit("click");
      }
      function handleShow(value) {
        if (value) {
          handleAbortPromise();
          enter();
        } else {
          leave();
        }
      }
      function handleAbortPromise() {
        isPromise$1(enterPromise.value) && enterPromise.value.abort();
        isPromise$1(enterLifeCyclePromises.value) && enterLifeCyclePromises.value.abort();
        isPromise$1(leaveLifeCyclePromises.value) && leaveLifeCyclePromises.value.abort();
        enterPromise.value = null;
        enterLifeCyclePromises.value = null;
        leaveLifeCyclePromises.value = null;
      }
      function enter() {
        enterPromise.value = new AbortablePromise(async (resolve) => {
          try {
            const classNames = getClassNames(props.name);
            const duration = isObj(props.duration) ? props.duration.enter : props.duration;
            status.value = "enter";
            emit("before-enter");
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            emit("enter");
            classes.value = classNames.enter;
            currentDuration.value = duration;
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            inited.value = true;
            display.value = true;
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            enterLifeCyclePromises.value = null;
            transitionEnded.value = false;
            classes.value = classNames["enter-to"];
            resolve();
          } catch (error) {
          }
        });
      }
      async function leave() {
        if (!enterPromise.value) {
          transitionEnded.value = false;
          return onTransitionEnd();
        }
        try {
          await enterPromise.value;
          if (!display.value)
            return;
          const classNames = getClassNames(props.name);
          const duration = isObj(props.duration) ? props.duration.leave : props.duration;
          status.value = "leave";
          emit("before-leave");
          currentDuration.value = duration;
          leaveLifeCyclePromises.value = pause();
          await leaveLifeCyclePromises.value;
          emit("leave");
          classes.value = classNames.leave;
          leaveLifeCyclePromises.value = pause();
          await leaveLifeCyclePromises.value;
          transitionEnded.value = false;
          classes.value = classNames["leave-to"];
          leaveLifeCyclePromises.value = setPromise(currentDuration.value);
          await leaveLifeCyclePromises.value;
          leaveLifeCyclePromises.value = null;
          onTransitionEnd();
          enterPromise.value = null;
        } catch (error) {
        }
      }
      function setPromise(duration) {
        return new AbortablePromise((resolve) => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            resolve();
          }, duration);
        });
      }
      function onTransitionEnd() {
        if (transitionEnded.value)
          return;
        transitionEnded.value = true;
        if (status.value === "leave") {
          emit("after-leave");
        } else if (status.value === "enter") {
          emit("after-enter");
        }
        if (!props.show && display.value) {
          display.value = false;
        }
      }
      const __returned__ = { getClassNames, props, emit, inited, display, status, transitionEnded, currentDuration, classes, enterPromise, enterLifeCyclePromises, leaveLifeCyclePromises, style, rootClass, handleClick, handleShow, handleAbortPromise, enter, leave, setPromise, onTransitionEnd };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return !_ctx.lazyRender || $setup.inited ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.style),
        onTransitionend: $setup.onTransitionEnd,
        onClick: $setup.handleClick
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    )) : vue.createCommentVNode("v-if", true);
  }
  const wdTransition = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-af59a128"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-transition/wd-transition.vue"]]);
  const overlayProps = {
    ...baseProps,
    /**
     * 是否展示遮罩层
     */
    show: makeBooleanProp(false),
    /**
     * 动画时长，单位毫秒
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 是否锁定滚动
     */
    lockScroll: makeBooleanProp(true),
    /**
     * 层级
     */
    zIndex: makeNumberProp(10)
  };
  const __default__$f = {
    name: "wd-overlay",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
    ...__default__$f,
    props: overlayProps,
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function handleClick() {
        emit("click");
      }
      function noop() {
      }
      const __returned__ = { props, emit, handleClick, noop, wdTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["wdTransition"], {
      show: _ctx.show,
      name: "fade",
      "custom-class": "wd-overlay",
      duration: _ctx.duration,
      "custom-style": `z-index: ${_ctx.zIndex}; ${_ctx.customStyle}`,
      onClick: $setup.handleClick,
      onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers(($event) => _ctx.lockScroll ? $setup.noop : "", ["stop", "prevent"]))
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "duration", "custom-style"]);
  }
  const wdOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-6e0d1141"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-overlay/wd-overlay.vue"]]);
  const popupProps = {
    ...baseProps,
    /**
     * 动画类型，参见 wd-transition 组件的name
     * 类型：string
     * 可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in
     */
    transition: String,
    /**
     * 关闭按钮
     * 类型：boolean
     * 默认值：false
     */
    closable: makeBooleanProp(false),
    /**
     * 弹出框的位置
     * 类型：string
     * 默认值：center
     * 可选值：center / top / right / bottom / left
     */
    position: makeStringProp("center"),
    /**
     * 点击遮罩是否关闭
     * 类型：boolean
     * 默认值：true
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 动画持续时间
     * 类型：number | boolean
     * 默认值：300
     */
    duration: {
      type: [Number, Boolean],
      default: 300
    },
    /**
     * 是否显示遮罩
     * 类型：boolean
     * 默认值：true
     */
    modal: makeBooleanProp(true),
    /**
     * 设置层级
     * 类型：number
     * 默认值：10
     */
    zIndex: makeNumberProp(10),
    /**
     * 是否当关闭时将弹出层隐藏（display: none)
     * 类型：boolean
     * 默认值：true
     */
    hideWhenClose: makeBooleanProp(true),
    /**
     * 遮罩样式
     * 类型：string
     * 默认值：''
     */
    modalStyle: makeStringProp(""),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     * 类型：boolean
     * 默认值：false
     */
    safeAreaInsetBottom: makeBooleanProp(false),
    /**
     * 弹出层是否显示
     */
    modelValue: makeBooleanProp(false),
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * 类型：boolean
     * 默认值：true
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 是否锁定滚动
     * 类型：boolean
     * 默认值：true
     */
    lockScroll: makeBooleanProp(true)
  };
  const __default__$e = {
    name: "wd-popup",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    ...__default__$e,
    props: popupProps,
    emits: [
      "update:modelValue",
      "before-enter",
      "enter",
      "before-leave",
      "leave",
      "after-leave",
      "after-enter",
      "click-modal",
      "close"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const transitionName = vue.computed(() => {
        if (props.transition) {
          return props.transition;
        }
        if (props.position === "center") {
          return ["zoom-in", "fade"];
        }
        if (props.position === "left") {
          return "slide-left";
        }
        if (props.position === "right") {
          return "slide-right";
        }
        if (props.position === "bottom") {
          return "slide-up";
        }
        if (props.position === "top") {
          return "slide-down";
        }
        return "slide-up";
      });
      const safeBottom = vue.ref(0);
      const style = vue.computed(() => {
        return `z-index:${props.zIndex}; padding-bottom: ${safeBottom.value}px;${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-popup wd-popup--${props.position} ${!props.transition && props.position === "center" ? "is-deep" : ""} ${props.customClass || ""}`;
      });
      vue.onBeforeMount(() => {
        if (props.safeAreaInsetBottom) {
          const { safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();
          if (safeArea) {
            safeBottom.value = safeAreaInsets ? safeAreaInsets.bottom : 0;
          } else {
            safeBottom.value = 0;
          }
        }
      });
      function handleClickModal() {
        emit("click-modal");
        if (props.closeOnClickModal) {
          close();
        }
      }
      function close() {
        emit("close");
        emit("update:modelValue", false);
      }
      function noop() {
      }
      const __returned__ = { props, emit, transitionName, safeBottom, style, rootClass, handleClickModal, close, noop, wdIcon: __easycom_0$5, wdOverlay, wdTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "wd-popup-wrapper" }, [
      _ctx.modal ? (vue.openBlock(), vue.createBlock($setup["wdOverlay"], {
        key: 0,
        show: _ctx.modelValue,
        "z-index": _ctx.zIndex,
        "lock-scroll": _ctx.lockScroll,
        duration: _ctx.duration,
        "custom-style": _ctx.modalStyle,
        onClick: $setup.handleClickModal,
        onTouchmove: $setup.noop
      }, null, 8, ["show", "z-index", "lock-scroll", "duration", "custom-style"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode($setup["wdTransition"], {
        "lazy-render": _ctx.lazyRender,
        "custom-class": $setup.rootClass,
        "custom-style": $setup.style,
        duration: _ctx.duration,
        show: _ctx.modelValue,
        name: $setup.transitionName,
        destroy: _ctx.hideWhenClose,
        onBeforeEnter: _cache[0] || (_cache[0] = ($event) => $setup.emit("before-enter")),
        onEnter: _cache[1] || (_cache[1] = ($event) => $setup.emit("enter")),
        onAfterEnter: _cache[2] || (_cache[2] = ($event) => $setup.emit("after-enter")),
        onBeforeLeave: _cache[3] || (_cache[3] = ($event) => $setup.emit("before-leave")),
        onLeave: _cache[4] || (_cache[4] = ($event) => $setup.emit("leave")),
        onAfterLeave: _cache[5] || (_cache[5] = ($event) => $setup.emit("after-leave"))
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
          _ctx.closable ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
            key: 0,
            "custom-class": "wd-popup__close",
            name: "add",
            onClick: $setup.close
          })) : vue.createCommentVNode("v-if", true)
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["lazy-render", "custom-class", "custom-style", "duration", "show", "name", "destroy"])
    ]);
  }
  const wdPopup = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-25a8a9f7"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-popup/wd-popup.vue"]]);
  const _b64chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"];
  const _mkUriSafe = (src) => src.replace(/[+/]/g, (m0) => m0 === "+" ? "-" : "_").replace(/=+\$/m, "");
  const fromUint8Array = (src, rfc4648 = false) => {
    let b64 = "";
    for (let i = 0, l = src.length; i < l; i += 3) {
      const [a0, a1, a2] = [src[i], src[i + 1], src[i + 2]];
      const ord = a0 << 16 | a1 << 8 | a2;
      b64 += _b64chars[ord >>> 18];
      b64 += _b64chars[ord >>> 12 & 63];
      b64 += typeof a1 !== "undefined" ? _b64chars[ord >>> 6 & 63] : "=";
      b64 += typeof a2 !== "undefined" ? _b64chars[ord & 63] : "=";
    }
    return rfc4648 ? _mkUriSafe(b64) : b64;
  };
  const _btoa = typeof btoa === "function" ? (s) => btoa(s) : (s) => {
    if (s.charCodeAt(0) > 255) {
      throw new RangeError("The string contains invalid characters.");
    }
    return fromUint8Array(Uint8Array.from(s, (c) => c.charCodeAt(0)));
  };
  const utob = (src) => unescape(encodeURIComponent(src));
  function encode(src, rfc4648 = false) {
    const b64 = _btoa(utob(src));
    return rfc4648 ? _mkUriSafe(b64) : b64;
  }
  const loadingProps = {
    ...baseProps,
    /**
     * 加载指示器类型，可选值：'outline' | 'ring'
     */
    type: makeStringProp("ring"),
    /**
     * 设置加载指示器颜色
     */
    color: makeStringProp("#4D80F0"),
    /**
     * 设置加载指示器大小
     */
    size: makeNumericProp("")
  };
  const __default__$d = {
    name: "wd-loading",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$v = /* @__PURE__ */ vue.defineComponent({
    ...__default__$d,
    props: loadingProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const svgDefineId = context.id++;
      const svgDefineId1 = context.id++;
      const svgDefineId2 = context.id++;
      const icon = {
        outline(color = "#4D80F0") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="${svgDefineId}"><stop stop-color="#FFF" offset="0%" stop-opacity="0"/><stop stop-color="#FFF" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#${svgDefineId}) " stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
        },
        ring(color = "#4D80F0", intermediateColor2 = "#a6bff7") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="${svgDefineId1}" gradientUnits="userSpaceOnUse" x1="50" x2="50" y2="180"><stop offset="0" stop-color="${color}"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId1})" d="M20 100c0-44.1 35.9-80 80-80V0C44.8 0 0 44.8 0 100s44.8 100 100 100v-20c-44.1 0-80-35.9-80-80z"></path> <linearGradient id="${svgDefineId2}" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180"><stop offset="0" stop-color="#fff" stop-opacity="0"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId2})" d="M100 0v20c44.1 0 80 35.9 80 80s-35.9 80-80 80v20c55.2 0 100-44.8 100-100S155.2 0 100 0z"></path> <circle cx="100" cy="10" r="10" fill="${color}"></circle></svg>`;
        }
      };
      const props = __props;
      const svg = vue.ref("");
      const intermediateColor = vue.ref("");
      const iconSize = vue.ref(null);
      vue.watch(
        () => props.size,
        (newVal) => {
          iconSize.value = addUnit(newVal);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.type,
        () => {
          buildSvg();
        },
        {
          deep: true,
          immediate: true
        }
      );
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(iconSize.value)) {
          style.height = addUnit(iconSize.value);
          style.width = addUnit(iconSize.value);
        }
        return `${objToStyle(style)}; ${props.customStyle}`;
      });
      vue.onBeforeMount(() => {
        intermediateColor.value = gradient(props.color, "#ffffff", 2)[1];
        buildSvg();
      });
      function buildSvg() {
        const { type, color } = props;
        let ringType = isDef(type) ? type : "ring";
        const svgStr = `"data:image/svg+xml;base64,${encode(ringType === "ring" ? icon[ringType](color, intermediateColor.value) : icon[ringType](color))}"`;
        svg.value = svgStr;
      }
      const __returned__ = { svgDefineId, svgDefineId1, svgDefineId2, icon, props, svg, intermediateColor, iconSize, rootStyle, buildSvg };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-loading ${$setup.props.customClass}`),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createElementVNode("view", { class: "wd-loading__body" }, [
          vue.createElementVNode(
            "view",
            {
              class: "wd-loading__svg",
              style: vue.normalizeStyle(`background-image: url(${$setup.svg});`)
            },
            null,
            4
            /* STYLE */
          )
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdLoading = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-f2b508ee"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-loading/wd-loading.vue"]]);
  const actionSheetProps = {
    ...baseProps,
    /**
     * header 头部样式
     * @default ''
     * @type {string}
     */
    customHeaderClass: makeStringProp(""),
    /**
     * 设置菜单显示隐藏
     * @default false
     * @type {boolean}
     */
    modelValue: { ...makeBooleanProp(false), ...makeRequiredProp(Boolean) },
    /**
     * 菜单选项
     * @default []
     * @type {Action[]}
     */
    actions: makeArrayProp(),
    /**
     * 自定义面板项,可以为字符串数组，也可以为对象数组，如果为二维数组，则为多行展示
     * @default []
     * @type {Array<Panel | Panel[]>}
     */
    panels: makeArrayProp(),
    /**
     * 标题
     * @type {string}
     */
    title: String,
    /**
     * 取消按钮文案
     * @type {string}
     */
    cancelText: String,
    /**
     * 点击选项后是否关闭菜单
     * @default true
     * @type {boolean}
     */
    closeOnClickAction: makeBooleanProp(true),
    /**
     * 点击遮罩是否关闭
     * @default true
     * @type {boolean}
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 弹框动画持续时间
     * @default 200
     * @type {number}
     */
    duration: makeNumberProp(200),
    /**
     * 菜单层级
     * @default 10
     * @type {number}
     */
    zIndex: makeNumberProp(10),
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * @default true
     * @type {boolean}
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     * @default true
     * @type {boolean}
     */
    safeAreaInsetBottom: makeBooleanProp(true)
  };
  const __default__$c = {
    name: "wd-action-sheet",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
    ...__default__$c,
    props: actionSheetProps,
    emits: ["select", "click-modal", "cancel", "closed", "close", "open", "opened", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const formatPanels = vue.ref([]);
      const showPopup = vue.ref(false);
      vue.watch(() => props.panels, computedValue, { deep: true, immediate: true });
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          showPopup.value = newValue;
        },
        { deep: true, immediate: true }
      );
      function isPanelArray() {
        return props.panels.length && !isArray(props.panels[0]);
      }
      function computedValue() {
        formatPanels.value = isPanelArray() ? [props.panels] : props.panels;
      }
      function select(rowIndex, type, colIndex) {
        if (type === "action") {
          if (props.actions[rowIndex].disabled || props.actions[rowIndex].loading) {
            return;
          }
          emit("select", {
            item: props.actions[rowIndex],
            index: rowIndex
          });
        } else if (isPanelArray()) {
          emit("select", {
            item: props.panels[Number(colIndex)],
            index: colIndex
          });
        } else {
          emit("select", {
            item: props.panels[rowIndex][Number(colIndex)],
            rowIndex,
            colIndex
          });
        }
        if (props.closeOnClickAction) {
          close();
        }
      }
      function handleClickModal() {
        emit("click-modal");
      }
      function handleCancel() {
        emit("cancel");
        close();
      }
      function close() {
        emit("update:modelValue", false);
        emit("close");
      }
      function handleOpen() {
        emit("open");
      }
      function handleOpened() {
        emit("opened");
      }
      function handleClosed() {
        emit("closed");
      }
      const __returned__ = { props, emit, formatPanels, showPopup, isPanelArray, computedValue, select, handleClickModal, handleCancel, close, handleOpen, handleOpened, handleClosed, wdPopup, wdIcon: __easycom_0$5, wdLoading };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode($setup["wdPopup"], {
        "custom-class": "wd-action-sheet__popup",
        "custom-style": `${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? "background: transparent;" : ""}`,
        modelValue: $setup.showPopup,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showPopup = $event),
        duration: _ctx.duration,
        position: "bottom",
        "close-on-click-modal": _ctx.closeOnClickModal,
        "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
        "lazy-render": _ctx.lazyRender,
        onEnter: $setup.handleOpen,
        onClose: $setup.close,
        onAfterEnter: $setup.handleOpened,
        onAfterLeave: $setup.handleClosed,
        onClickModal: $setup.handleClickModal,
        "z-index": _ctx.zIndex
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(`wd-action-sheet ${_ctx.customClass}`),
              style: vue.normalizeStyle(`${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? "margin: 0 10px calc(var(--window-bottom) + 10px) 10px; border-radius: 16px;" : "margin-bottom: var(--window-bottom);"} ${_ctx.customStyle}`)
            },
            [
              _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: vue.normalizeClass(`wd-action-sheet__header ${_ctx.customHeaderClass}`)
                },
                [
                  vue.createTextVNode(
                    vue.toDisplayString(_ctx.title) + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createVNode($setup["wdIcon"], {
                    "custom-class": "wd-action-sheet__close",
                    name: "add",
                    onClick: $setup.close
                  })
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true),
              _ctx.actions && _ctx.actions.length ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "wd-action-sheet__actions"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(_ctx.actions, (action, rowIndex) => {
                    return vue.openBlock(), vue.createElementBlock("button", {
                      key: rowIndex,
                      class: vue.normalizeClass(`wd-action-sheet__action ${action.disabled ? "wd-action-sheet__action--disabled" : ""}  ${action.loading ? "wd-action-sheet__action--loading" : ""}`),
                      style: vue.normalizeStyle(`color: ${action.color}`),
                      onClick: ($event) => $setup.select(rowIndex, "action")
                    }, [
                      action.loading ? (vue.openBlock(), vue.createBlock($setup["wdLoading"], {
                        key: 0,
                        "custom-class": "`wd-action-sheet__action-loading"
                      })) : (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 1,
                          class: "wd-action-sheet__name"
                        },
                        vue.toDisplayString(action.name),
                        1
                        /* TEXT */
                      )),
                      !action.loading && action.subname ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 2,
                          class: "wd-action-sheet__subname"
                        },
                        vue.toDisplayString(action.subname),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.formatPanels && $setup.formatPanels.length ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.formatPanels, (panel, rowIndex) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: rowIndex,
                      class: "wd-action-sheet__panels"
                    }, [
                      vue.createElementVNode("view", { class: "wd-action-sheet__panels-content" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(panel, (col, colIndex) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              key: colIndex,
                              class: "wd-action-sheet__panel",
                              onClick: ($event) => $setup.select(rowIndex, "panels", colIndex)
                            }, [
                              vue.createElementVNode("image", {
                                class: "wd-action-sheet__panel-img",
                                src: col.iconUrl
                              }, null, 8, ["src"]),
                              vue.createElementVNode(
                                "view",
                                { class: "wd-action-sheet__panel-title" },
                                vue.toDisplayString(col.title),
                                1
                                /* TEXT */
                              )
                            ], 8, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
              _ctx.cancelText ? (vue.openBlock(), vue.createElementBlock(
                "button",
                {
                  key: 3,
                  class: "wd-action-sheet__cancel",
                  onClick: $setup.handleCancel
                },
                vue.toDisplayString(_ctx.cancelText),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ],
            6
            /* CLASS, STYLE */
          )
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["custom-style", "modelValue", "duration", "close-on-click-modal", "safe-area-inset-bottom", "lazy-render", "z-index"])
    ]);
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-03619ba9"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-action-sheet/wd-action-sheet.vue"]]);
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = { ...defaultSettings };
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        }
      };
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && pluginDescriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(pluginDescriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * vuex v4.1.0
   * (c) 2022 Evan You
   * @license MIT
   */
  var storeKey = "store";
  function useStore(key) {
    if (key === void 0)
      key = null;
    return vue.inject(key !== null ? key : storeKey);
  }
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key) {
      return fn(obj[key], key);
    });
  }
  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
  function isPromise(val) {
    return val && typeof val.then === "function";
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }
  function partial(fn, arg) {
    return function() {
      return fn(arg);
    };
  }
  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }
    return function() {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  }
  function resetStore(store, hot) {
    store._actions = /* @__PURE__ */ Object.create(null);
    store._mutations = /* @__PURE__ */ Object.create(null);
    store._wrappedGetters = /* @__PURE__ */ Object.create(null);
    store._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    var state = store.state;
    installModule(store, state, [], store._modules.root, true);
    resetStoreState(store, state, hot);
  }
  function resetStoreState(store, state, hot) {
    var oldState = store._state;
    var oldScope = store._scope;
    store.getters = {};
    store._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    var wrappedGetters = store._wrappedGetters;
    var computedObj = {};
    var computedCache = {};
    var scope = vue.effectScope(true);
    scope.run(function() {
      forEachValue(wrappedGetters, function(fn, key) {
        computedObj[key] = partial(fn, store);
        computedCache[key] = vue.computed(function() {
          return computedObj[key]();
        });
        Object.defineProperty(store.getters, key, {
          get: function() {
            return computedCache[key].value;
          },
          enumerable: true
          // for local getters
        });
      });
    });
    store._state = vue.reactive({
      data: state
    });
    store._scope = scope;
    if (store.strict) {
      enableStrictMode(store);
    }
    if (oldState) {
      if (hot) {
        store._withCommit(function() {
          oldState.data = null;
        });
      }
    }
    if (oldScope) {
      oldScope.stop();
    }
  }
  function installModule(store, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store._modules.getNamespace(path);
    if (module.namespaced) {
      if (store._modulesNamespaceMap[namespace] && true) {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
      }
      store._modulesNamespaceMap[namespace] = module;
    }
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store._withCommit(function() {
        {
          if (moduleName in parentState) {
            console.warn(
              '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
            );
          }
        }
        parentState[moduleName] = module.state;
      });
    }
    var local = module.context = makeLocalContext(store, namespace, path);
    module.forEachMutation(function(mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, local);
    });
    module.forEachAction(function(action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store, type, handler, local);
    });
    module.forEachGetter(function(getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local);
    });
    module.forEachChild(function(child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }
  function makeLocalContext(store, namespace, path) {
    var noNamespace = namespace === "";
    var local = {
      dispatch: noNamespace ? store.dispatch : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }
        return store.dispatch(type, payload);
      },
      commit: noNamespace ? store.commit : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }
        store.commit(type, payload, options);
      }
    };
    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function() {
          return store.getters;
        } : function() {
          return makeLocalGetters(store, namespace);
        }
      },
      state: {
        get: function() {
          return getNestedState(store.state, path);
        }
      }
    });
    return local;
  }
  function makeLocalGetters(store, namespace) {
    if (!store._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store.getters).forEach(function(type) {
        if (type.slice(0, splitPos) !== namespace) {
          return;
        }
        var localType = type.slice(splitPos);
        Object.defineProperty(gettersProxy, localType, {
          get: function() {
            return store.getters[type];
          },
          enumerable: true
        });
      });
      store._makeLocalGettersCache[namespace] = gettersProxy;
    }
    return store._makeLocalGettersCache[namespace];
  }
  function registerMutation(store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store, local.state, payload);
    });
  }
  function registerAction(store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch(function(err) {
          store._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  function registerGetter(store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }
      return;
    }
    store._wrappedGetters[type] = function wrappedGetter(store2) {
      return rawGetter(
        local.state,
        // local state
        local.getters,
        // local getters
        store2.state,
        // root state
        store2.getters
        // root getters
      );
    };
  }
  function enableStrictMode(store) {
    vue.watch(function() {
      return store._state.data;
    }, function() {
      {
        assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: "sync" });
  }
  function getNestedState(state, path) {
    return path.reduce(function(state2, key) {
      return state2[key];
    }, state);
  }
  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    {
      assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
    }
    return { type, payload, options };
  }
  var LABEL_VUEX_BINDINGS = "vuex bindings";
  var MUTATIONS_LAYER_ID = "vuex:mutations";
  var ACTIONS_LAYER_ID = "vuex:actions";
  var INSPECTOR_ID = "vuex";
  var actionId = 0;
  function addDevtools(app, store) {
    setupDevtoolsPlugin(
      {
        id: "org.vuejs.vuex",
        app,
        label: "Vuex",
        homepage: "https://next.vuex.vuejs.org/",
        logo: "https://vuejs.org/images/icons/favicon-96x96.png",
        packageName: "vuex",
        componentStateTypes: [LABEL_VUEX_BINDINGS]
      },
      function(api) {
        api.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: "Vuex Mutations",
          color: COLOR_LIME_500
        });
        api.addTimelineLayer({
          id: ACTIONS_LAYER_ID,
          label: "Vuex Actions",
          color: COLOR_LIME_500
        });
        api.addInspector({
          id: INSPECTOR_ID,
          label: "Vuex",
          icon: "storage",
          treeFilterPlaceholder: "Filter stores..."
        });
        api.on.getInspectorTree(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            if (payload.filter) {
              var nodes = [];
              flattenStoreForInspectorTree(nodes, store._modules.root, payload.filter, "");
              payload.rootNodes = nodes;
            } else {
              payload.rootNodes = [
                formatStoreForInspectorTree(store._modules.root, "")
              ];
            }
          }
        });
        api.on.getInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            makeLocalGetters(store, modulePath);
            payload.state = formatStoreForInspectorState(
              getStoreModule(store._modules, modulePath),
              modulePath === "root" ? store.getters : store._makeLocalGettersCache,
              modulePath
            );
          }
        });
        api.on.editInspectorState(function(payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            var path = payload.path;
            if (modulePath !== "root") {
              path = modulePath.split("/").filter(Boolean).concat(path);
            }
            store._withCommit(function() {
              payload.set(store._state.data, path, payload.state.value);
            });
          }
        });
        store.subscribe(function(mutation, state) {
          var data = {};
          if (mutation.payload) {
            data.payload = mutation.payload;
          }
          data.state = state;
          api.notifyComponentUpdate();
          api.sendInspectorTree(INSPECTOR_ID);
          api.sendInspectorState(INSPECTOR_ID);
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: mutation.type,
              data
            }
          });
        });
        store.subscribeAction({
          before: function(action, state) {
            var data = {};
            if (action.payload) {
              data.payload = action.payload;
            }
            action._id = actionId++;
            action._time = Date.now();
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: action._time,
                title: action.type,
                groupId: action._id,
                subtitle: "start",
                data
              }
            });
          },
          after: function(action, state) {
            var data = {};
            var duration = Date.now() - action._time;
            data.duration = {
              _custom: {
                type: "duration",
                display: duration + "ms",
                tooltip: "Action duration",
                value: duration
              }
            };
            if (action.payload) {
              data.payload = action.payload;
            }
            data.state = state;
            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: Date.now(),
                title: action.type,
                groupId: action._id,
                subtitle: "end",
                data
              }
            });
          }
        });
      }
    );
  }
  var COLOR_LIME_500 = 8702998;
  var COLOR_DARK = 6710886;
  var COLOR_WHITE = 16777215;
  var TAG_NAMESPACED = {
    label: "namespaced",
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };
  function extractNameFromPath(path) {
    return path && path !== "root" ? path.split("/").slice(-2, -1)[0] : "Root";
  }
  function formatStoreForInspectorTree(module, path) {
    return {
      id: path || "root",
      // all modules end with a `/`, we want the last segment only
      // cart/ -> cart
      // nested/cart/ -> cart
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(
        function(moduleName) {
          return formatStoreForInspectorTree(
            module._children[moduleName],
            path + moduleName + "/"
          );
        }
      )
    };
  }
  function flattenStoreForInspectorTree(result, module, filter, path) {
    if (path.includes(filter)) {
      result.push({
        id: path || "root",
        label: path.endsWith("/") ? path.slice(0, path.length - 1) : path || "Root",
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function(moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + "/");
    });
  }
  function formatStoreForInspectorState(module, getters, path) {
    getters = path === "root" ? getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
      state: Object.keys(module.state).map(function(key) {
        return {
          key,
          editable: true,
          value: module.state[key]
        };
      })
    };
    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters);
      storeState.getters = Object.keys(tree).map(function(key) {
        return {
          key: key.endsWith("/") ? extractNameFromPath(key) : key,
          editable: false,
          value: canThrow(function() {
            return tree[key];
          })
        };
      });
    }
    return storeState;
  }
  function transformPathsToObjectTree(getters) {
    var result = {};
    Object.keys(getters).forEach(function(key) {
      var path = key.split("/");
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function(p) {
          if (!target[p]) {
            target[p] = {
              _custom: {
                value: {},
                display: p,
                tooltip: "Module",
                abstract: true
              }
            };
          }
          target = target[p]._custom.value;
        });
        target[leafKey] = canThrow(function() {
          return getters[key];
        });
      } else {
        result[key] = canThrow(function() {
          return getters[key];
        });
      }
    });
    return result;
  }
  function getStoreModule(moduleMap, path) {
    var names = path.split("/").filter(function(n) {
      return n;
    });
    return names.reduce(
      function(module, moduleName, i) {
        var child = module[moduleName];
        if (!child) {
          throw new Error('Missing module "' + moduleName + '" for path "' + path + '".');
        }
        return i === names.length - 1 ? child : child._children;
      },
      path === "root" ? moduleMap : moduleMap.root._children
    );
  }
  function canThrow(cb) {
    try {
      return cb();
    } catch (e) {
      return e;
    }
  }
  var Module = function Module2(rawModule, runtime) {
    this.runtime = runtime;
    this._children = /* @__PURE__ */ Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  };
  var prototypeAccessors$1 = { namespaced: { configurable: true } };
  prototypeAccessors$1.namespaced.get = function() {
    return !!this._rawModule.namespaced;
  };
  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };
  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };
  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };
  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };
  Module.prototype.update = function update(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };
  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };
  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };
  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };
  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };
  Object.defineProperties(Module.prototype, prototypeAccessors$1);
  var ModuleCollection = function ModuleCollection2(rawRootModule) {
    this.register([], rawRootModule, false);
  };
  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function(module, key) {
      return module.getChild(key);
    }, this.root);
  };
  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function(namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + "/" : "");
    }, "");
  };
  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update2([], this.root, rawRootModule);
  };
  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1$1 = this;
    if (runtime === void 0)
      runtime = true;
    {
      assertRawModule(path, rawModule);
    }
    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function(rawChildModule, key) {
        this$1$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };
  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);
    if (!child) {
      {
        console.warn(
          "[vuex] trying to unregister module '" + key + "', which is not registered"
        );
      }
      return;
    }
    if (!child.runtime) {
      return;
    }
    parent.removeChild(key);
  };
  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (parent) {
      return parent.hasChild(key);
    }
    return false;
  };
  function update2(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }
    targetModule.update(newModule);
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed"
            );
          }
          return;
        }
        update2(
          path.concat(key),
          targetModule.getChild(key),
          newModule.modules[key]
        );
      }
    }
  }
  var functionAssert = {
    assert: function(value) {
      return typeof value === "function";
    },
    expected: "function"
  };
  var objectAssert = {
    assert: function(value) {
      return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };
  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function(key) {
      if (!rawModule[key]) {
        return;
      }
      var assertOptions = assertTypes[key];
      forEachValue(rawModule[key], function(value, type) {
        assert(
          assertOptions.assert(value),
          makeAssertionMessage(path, key, type, value, assertOptions.expected)
        );
      });
    });
  }
  function makeAssertionMessage(path, key, type, value, expected) {
    var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
    if (path.length > 0) {
      buf += ' in module "' + path.join(".") + '"';
    }
    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }
  function createStore(options) {
    return new Store$1(options);
  }
  var Store$1 = function Store2(options) {
    var this$1$1 = this;
    if (options === void 0)
      options = {};
    {
      assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store2, "store must be called with the new operator.");
    }
    var plugins = options.plugins;
    if (plugins === void 0)
      plugins = [];
    var strict = options.strict;
    if (strict === void 0)
      strict = false;
    var devtools = options.devtools;
    this._committing = false;
    this._actions = /* @__PURE__ */ Object.create(null);
    this._actionSubscribers = [];
    this._mutations = /* @__PURE__ */ Object.create(null);
    this._wrappedGetters = /* @__PURE__ */ Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    this._scope = null;
    this._devtools = devtools;
    var store = this;
    var ref = this;
    var dispatch2 = ref.dispatch;
    var commit2 = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch2.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options2) {
      return commit2.call(store, type, payload, options2);
    };
    this.strict = strict;
    var state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    plugins.forEach(function(plugin) {
      return plugin(this$1$1);
    });
  };
  var prototypeAccessors = { state: { configurable: true } };
  Store$1.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
    var useDevtools = this._devtools !== void 0 ? this._devtools : true;
    if (useDevtools) {
      addDevtools(app, this);
    }
  };
  prototypeAccessors.state.get = function() {
    return this._state.data;
  };
  prototypeAccessors.state.set = function(v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };
  Store$1.prototype.commit = function commit(_type, _payload, _options) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = { type, payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }
      return;
    }
    this._withCommit(function() {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.slice().forEach(function(sub) {
      return sub(mutation, this$1$1.state);
    });
    if (options && options.silent) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
      );
    }
  };
  Store$1.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = { type, payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }
      return;
    }
    try {
      this._actionSubscribers.slice().filter(function(sub) {
        return sub.before;
      }).forEach(function(sub) {
        return sub.before(action, this$1$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }
    var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function(resolve, reject) {
      result.then(function(res) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.after;
          }).forEach(function(sub) {
            return sub.after(action, this$1$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function(error) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.error;
          }).forEach(function(sub) {
            return sub.error(action, this$1$1.state, error);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject(error);
      });
    });
  };
  Store$1.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };
  Store$1.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };
  Store$1.prototype.watch = function watch$1(getter, cb, options) {
    var this$1$1 = this;
    {
      assert(typeof getter === "function", "store.watch only accepts a function.");
    }
    return vue.watch(function() {
      return getter(this$1$1.state, this$1$1.getters);
    }, cb, Object.assign({}, options));
  };
  Store$1.prototype.replaceState = function replaceState(state) {
    var this$1$1 = this;
    this._withCommit(function() {
      this$1$1._state.data = state;
    });
  };
  Store$1.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0)
      options = {};
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, "cannot register the root module by using registerModule.");
    }
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    resetStoreState(this, this.state);
  };
  Store$1.prototype.unregisterModule = function unregisterModule(path) {
    var this$1$1 = this;
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    this._modules.unregister(path);
    this._withCommit(function() {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };
  Store$1.prototype.hasModule = function hasModule(path) {
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    return this._modules.isRegistered(path);
  };
  Store$1.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };
  Store$1.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };
  Object.defineProperties(Store$1.prototype, prototypeAccessors);
  const ACCESS_ENUM = {
    NO_LOGIN: "notLogin",
    USER: "user"
    // ADMIN: "admin"
  };
  const BASE_URL = "http://172.19.54.194:8080/api/";
  const StorageName = "USERNAME";
  const _imports_0 = "/static/login.png";
  const _sfc_main$t = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const store = useStore();
      const IslDing = vue.ref(false);
      const Isyuedu = vue.ref(false);
      const show = vue.ref(false);
      let bye = 1;
      const change = () => {
        Isyuedu.value = !Isyuedu.value;
        formatAppLog("log", "at pages/Login/index.vue:89", Isyuedu.value);
      };
      const goLoginform = (e) => {
        if (!Isyuedu.value) {
          show.value = true;
          bye = e;
          return;
        }
        if (e == 1) {
          uni.navigateTo({
            url: "/pages/Login/LoginEmail"
          });
        } else {
          uni.navigateTo({
            url: "/pages/Login/Loginform"
          });
        }
      };
      const gohede = () => {
        Isyuedu.value = true;
        goLoginform(bye);
        show.value = false;
      };
      const inInt = () => {
        if (store.state.user.user == ACCESS_ENUM.USER) {
          IslDing.value = true;
          formatAppLog("log", "at pages/Login/index.vue:137", "用户已经登录");
          uni.navigateTo({
            url: "/pages/Homefriend/index"
          });
        }
      };
      vue.onMounted(() => {
        inInt();
      });
      const __returned__ = { store, IslDing, Isyuedu, show, get bye() {
        return bye;
      }, set bye(v) {
        bye = v;
      }, change, goLoginform, gohede, inInt, onMounted: vue.onMounted, ref: vue.ref, get useStore() {
        return useStore;
      }, get ACCESS_ENUM() {
        return ACCESS_ENUM;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$5);
    const _component_wd_action_sheet = resolveEasycom(vue.resolveDynamicComponent("wd-action-sheet"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "page" }, [
          vue.createElementVNode("view", { class: "page-top" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              mode: "widthFix"
            }),
            vue.createElementVNode("h1", null, "趣友"),
            vue.createElementVNode("text", null, "这是个兴趣爱号的交友平台")
          ]),
          vue.createElementVNode("view", { class: "page-butom" }, [
            vue.createElementVNode("view", {
              class: "green",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.goLoginform(1))
            }, [
              vue.createVNode(_component_wd_icon, {
                name: "mail",
                size: "22px"
              }),
              vue.createElementVNode("text", null, "邮箱注册")
            ]),
            vue.createElementVNode("view", {
              class: "word",
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.goLoginform(2))
            }, [
              vue.createVNode(_component_wd_icon, {
                name: "mail",
                size: "22px"
              }),
              vue.createElementVNode("text", null, "账号登录")
            ]),
            vue.createElementVNode("view", { class: "box" }, [
              vue.createElementVNode("label", null, [
                vue.createElementVNode("checkbox", {
                  class: "box-check",
                  checked: $setup.Isyuedu,
                  onClick: $setup.change
                }, null, 8, ["checked"]),
                vue.createElementVNode("text", null, [
                  vue.createTextVNode(" 我已经阅读趣友的 "),
                  vue.createElementVNode("text", null, "《用户协议》"),
                  vue.createTextVNode(" 和 "),
                  vue.createElementVNode("text", null, "《隐私策略》")
                ])
              ])
            ])
          ])
        ]),
        vue.createVNode(_component_wd_action_sheet, {
          modelValue: $setup.show,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.show = $event),
          title: "提示",
          onClose: _ctx.close
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "cart" }, [
              vue.createElementVNode("h1", null, "请阅读以下条款"),
              vue.createElementVNode("text", null, [
                vue.createTextVNode(" 我已经阅读趣友的 "),
                vue.createElementVNode("text", null, "《用户协议》"),
                vue.createTextVNode(" 和 "),
                vue.createElementVNode("text", null, "《隐私策略》")
              ]),
              vue.createElementVNode("view", {
                class: "but",
                onClick: $setup.gohede
              }, " 同意并继续 ")
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue", "onClose"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesLoginIndex = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-410d8166"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Login/index.vue"]]);
  const imgProps = {
    ...baseProps,
    customImage: makeStringProp(""),
    /**
     * 图片链接
     */
    src: String,
    /**
     * 预览图片链接
     */
    previewSrc: String,
    /**
     * 是否显示为圆形
     */
    round: makeBooleanProp(false),
    /**
     * 填充模式：'top left' / 'top right' / 'bottom left' / 'bottom right' / 'right' / 'left' / 'center' / 'bottom' / 'top' / 'heightFix' / 'widthFix' / 'aspectFill' / 'aspectFit' / 'scaleToFill'
     */
    mode: makeStringProp("scaleToFill"),
    /**
     * 是否懒加载
     */
    lazyLoad: makeBooleanProp(false),
    /**
     * 宽度，默认单位为px
     */
    width: numericProp,
    /**
     * 高度，默认单位为px
     */
    height: numericProp,
    /**
     * 圆角大小，默认单位为px
     */
    radius: numericProp,
    /**
     * 是否允许预览
     */
    enablePreview: makeBooleanProp(false),
    /**
     * 开启长按图片显示识别小程序码菜单，仅在微信小程序平台有效
     */
    showMenuByLongpress: makeBooleanProp(false)
  };
  const __default__$b = {
    name: "wd-img",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: imgProps,
    emits: ["error", "click", "load"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.height)) {
          style["height"] = addUnit(props.height);
        }
        if (isDef(props.width)) {
          style["width"] = addUnit(props.width);
        }
        if (isDef(props.radius)) {
          style["border-radius"] = addUnit(props.radius);
          style["overflow"] = "hidden";
        }
        return `${objToStyle(style)};${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-img  ${props.round ? "is-round" : ""} ${props.customClass}`;
      });
      const status = vue.ref("loading");
      function handleError(event) {
        status.value = "error";
        emit("error", event);
      }
      function handleClick(event) {
        if (props.enablePreview && props.src && status.value == "success") {
          uni.previewImage({
            urls: [props.previewSrc || props.src]
          });
        }
        emit("click", event);
      }
      function handleLoad(event) {
        status.value = "success";
        emit("load", event);
      }
      const __returned__ = { props, emit, rootStyle, rootClass, status, handleError, handleClick, handleLoad };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        onClick: $setup.handleClick,
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createElementVNode("image", {
          class: vue.normalizeClass(`wd-img__image ${_ctx.customImage}`),
          style: vue.normalizeStyle($setup.status !== "success" ? "width: 0;height: 0;" : ""),
          src: _ctx.src,
          mode: _ctx.mode,
          "show-menu-by-longpress": _ctx.showMenuByLongpress,
          "lazy-load": _ctx.lazyLoad,
          onLoad: $setup.handleLoad,
          onError: $setup.handleError
        }, null, 46, ["src", "mode", "show-menu-by-longpress", "lazy-load"]),
        $setup.status === "loading" ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }, void 0, true) : vue.createCommentVNode("v-if", true),
        $setup.status === "error" ? vue.renderSlot(_ctx.$slots, "error", { key: 1 }, void 0, true) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-cb0c5dbc"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-img/wd-img.vue"]]);
  const zhCN = {
    calendar: {
      placeholder: "请选择",
      title: "选择日期",
      day: "日",
      week: "周",
      month: "月",
      confirm: "确定",
      startTime: "开始时间",
      endTime: "结束时间",
      to: "至",
      timeFormat: "YY年MM月DD日 HH:mm:ss",
      dateFormat: "YYYY年MM月DD日",
      weekFormat: (year, week) => `${year} 第 ${week} 周`,
      startWeek: "开始周",
      endWeek: "结束周",
      startMonth: "开始月",
      endMonth: "结束月",
      monthFormat: "YYYY年MM月"
    },
    calendarView: {
      startTime: "开始",
      endTime: "结束",
      weeks: {
        sun: "日",
        mon: "一",
        tue: "二",
        wed: "三",
        thu: "四",
        fri: "五",
        sat: "六"
      },
      rangePrompt: (maxRange) => `选择天数不能超过${maxRange}天`,
      rangePromptWeek: (maxRange) => `选择周数不能超过${maxRange}周`,
      rangePromptMonth: (maxRange) => `选择月份不能超过${maxRange}个月`,
      monthTitle: "YYYY年M月",
      yearTitle: "YYYY年",
      month: "M月",
      hour: (value) => `${value}时`,
      minute: (value) => `${value}分`,
      second: (value) => `${value}秒`
    },
    collapse: {
      expand: "展开",
      retract: "收起"
    },
    colPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择"
    },
    datetimePicker: {
      start: "开始时间",
      end: "结束时间",
      to: "至",
      placeholder: "请选择",
      confirm: "完成",
      cancel: "取消"
    },
    loadmore: {
      loading: "正在努力加载中...",
      finished: "已加载完毕",
      error: "加载失败",
      retry: "点击重试"
    },
    messageBox: {
      inputPlaceholder: "请输入",
      confirm: "确定",
      cancel: "取消",
      inputNoValidate: "输入的数据不合法"
    },
    numberKeyboard: {
      confirm: "完成"
    },
    pagination: {
      prev: "上一页",
      next: "下一页",
      page: (value) => `当前页：${value}`,
      total: (total) => `当前数据：${total}条`,
      size: (size) => `分页大小：${size}`
    },
    picker: {
      cancel: "取消",
      done: "完成",
      placeholder: "请选择"
    },
    imgCropper: {
      confirm: "完成",
      cancel: "取消"
    },
    search: {
      search: "搜索",
      cancel: "取消"
    },
    steps: {
      wait: "未开始",
      finished: "已完成",
      process: "进行中",
      failed: "失败"
    },
    tabs: {
      all: "全部"
    },
    upload: {
      error: "上传失败"
    },
    input: {
      placeholder: "请输入..."
    },
    selectPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择",
      confirm: "确认",
      filterPlaceholder: "搜索"
    },
    tag: {
      placeholder: "请输入",
      add: "新增标签"
    },
    textarea: {
      placeholder: "请输入..."
    },
    tableCol: {
      indexLabel: "序号"
    },
    signature: {
      confirmText: "确认",
      clearText: "清空",
      revokeText: "撤销",
      restoreText: "恢复"
    }
  };
  const lang = vue.ref("zh-CN");
  const messages = vue.reactive({
    "zh-CN": zhCN
  });
  const Locale = {
    messages() {
      return messages[lang.value];
    },
    use(newLang, newMessage) {
      lang.value = newLang;
      if (newMessage) {
        this.add({ [newLang]: newMessage });
      }
    },
    add(newMessages = {}) {
      deepAssign(messages, newMessages);
    }
  };
  const useTranslate = (name) => {
    const prefix = name ? camelCase(name) + "." : "";
    const translate = (key, ...args) => {
      const currentMessages = Locale.messages();
      const message = getPropByPath(currentMessages, prefix + key);
      return isFunction(message) ? message(...args) : message;
    };
    return { translate };
  };
  const tagProps = {
    ...baseProps,
    /**
     * 是否开启图标插槽
     * 类型：boolean
     * 默认值：false
     */
    useIconSlot: makeBooleanProp(false),
    /**
     * 标签类型
     * 类型：string
     * 可选值：'default' / 'primary' / 'danger' / 'warning' / 'success'
     * 默认值：'default'
     */
    type: makeStringProp("default"),
    /**
     * 左侧图标
     * 类型：string
     * 默认值：空字符串
     */
    icon: makeStringProp(""),
    /**
     * 是否可关闭（只对圆角类型支持）
     * 类型：boolean
     * 默认值：false
     */
    closable: makeBooleanProp(false),
    /**
     * 幽灵类型
     * 类型：boolean
     * 默认值：false
     */
    plain: makeBooleanProp(false),
    /**
     * 是否为新增标签
     * 类型：boolean
     * 默认值：false
     */
    dynamic: makeBooleanProp(false),
    /**
     * 文字颜色
     * 类型：string
     * 默认值：空字符串
     */
    color: makeStringProp(""),
    /**
     * 背景色和边框色
     * 类型：string
     * 默认值：空字符串
     */
    bgColor: makeStringProp(""),
    /**
     * 圆角类型
     * 类型：boolean
     * 默认值：false
     */
    round: makeBooleanProp(false),
    /**
     * 标记类型
     * 类型：boolean
     * 默认值：false
     */
    mark: makeBooleanProp(false)
  };
  const __default__$a = {
    name: "wd-tag",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: tagProps,
    emits: ["click", "close", "confirm"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("tag");
      const tagClass = vue.ref("");
      const dynamicValue = vue.ref("");
      const dynamicInput = vue.ref(false);
      vue.watch(
        [() => props.useIconSlot, () => props.icon, () => props.plain, () => props.dynamic, () => props.round, () => props.mark],
        () => {
          computeTagClass();
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.type,
        (newValue) => {
          if (!newValue)
            return;
          const type = ["primary", "danger", "warning", "success", "default"];
          if (type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tag/wd-tag.vue:73", `type must be one of ${type.toString()}`);
          computeTagClass();
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => dynamicInput.value,
        () => {
          computeTagClass();
        },
        { deep: true, immediate: true }
      );
      const rootClass = vue.computed(() => {
        return `wd-tag ${props.customClass} ${tagClass.value}`;
      });
      const rootStyle = vue.computed(() => {
        const rootStyle2 = {};
        if (!props.plain && props.bgColor) {
          rootStyle2["background"] = props.bgColor;
        }
        if (props.bgColor) {
          rootStyle2["border-color"] = props.bgColor;
        }
        return `${objToStyle(rootStyle2)};${props.customStyle}`;
      });
      const textStyle = vue.computed(() => {
        const textStyle2 = {};
        if (props.color) {
          textStyle2["color"] = props.color;
        }
        return objToStyle(textStyle2);
      });
      function computeTagClass() {
        const { type, plain, round, mark, dynamic, icon, useIconSlot } = props;
        let tagClassList = [];
        type && tagClassList.push(`is-${type}`);
        plain && tagClassList.push("is-plain");
        round && tagClassList.push("is-round");
        mark && tagClassList.push("is-mark");
        dynamic && tagClassList.push("is-dynamic");
        dynamicInput.value && tagClassList.push("is-dynamic-input");
        if (icon || useIconSlot)
          tagClassList.push("is-icon");
        tagClass.value = tagClassList.join(" ");
      }
      function handleClick(event) {
        emit("click", event);
      }
      function handleClose(event) {
        emit("close", event);
      }
      function handleAdd() {
        dynamicInput.value = true;
        dynamicValue.value = "";
      }
      function handleBlur() {
        setDynamicInput();
      }
      function handleConfirm(event) {
        setDynamicInput();
        emit("confirm", {
          value: event.detail.value
        });
      }
      function setDynamicInput() {
        dynamicInput.value = false;
      }
      const __returned__ = { props, emit, translate, tagClass, dynamicValue, dynamicInput, rootClass, rootStyle, textStyle, computeTagClass, handleClick, handleClose, handleAdd, handleBlur, handleConfirm, setDynamicInput, wdIcon: __easycom_0$5 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.rootStyle),
        onClick: $setup.handleClick
      },
      [
        _ctx.useIconSlot ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-tag__icon"
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {}, void 0, true)
        ])) : _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
          key: 1,
          name: _ctx.icon,
          "custom-class": "wd-tag__icon"
        }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: "wd-tag__text",
            style: vue.normalizeStyle($setup.textStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          4
          /* STYLE */
        ),
        _ctx.closable && _ctx.round ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "wd-tag__close",
          onClick: vue.withModifiers($setup.handleClose, ["stop"])
        }, [
          vue.createVNode($setup["wdIcon"], { name: "error-fill" })
        ])) : vue.createCommentVNode("v-if", true),
        $setup.dynamicInput && _ctx.dynamic ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
          key: 3,
          class: "wd-tag__add-text",
          placeholder: $setup.translate("placeholder"),
          type: "text",
          focus: true,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.dynamicValue = $event),
          onBlur: $setup.handleBlur,
          onConfirm: $setup.handleConfirm
        }, null, 40, ["placeholder"])), [
          [vue.vModelText, $setup.dynamicValue]
        ]) : _ctx.dynamic ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 4,
            class: "wd-tag__text",
            style: vue.normalizeStyle($setup.textStyle),
            onClick: vue.withModifiers($setup.handleAdd, ["stop"])
          },
          [
            _ctx.$slots.add ? vue.renderSlot(_ctx.$slots, "add", { key: 0 }, void 0, true) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                vue.createVNode($setup["wdIcon"], {
                  name: "add",
                  "custom-class": "wd-tag__add wd-tag__icon"
                }),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($setup.translate("add")),
                  1
                  /* TEXT */
                )
              ],
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-97328e6e"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-tag/wd-tag.vue"]]);
  function useParent(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance = vue.getCurrentInstance();
      const { link, unlink, internalChildren } = parent;
      link(instance);
      vue.onUnmounted(() => unlink(instance));
      const index = vue.computed(() => internalChildren.indexOf(instance));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  const TABS_KEY = Symbol("wd-tabs");
  const tabsProps = {
    ...baseProps,
    /**
     * 绑定值
     */
    modelValue: makeNumericProp(0),
    /**
     * 标签数超过阈值可滑动
     */
    slidableNum: makeNumberProp(6),
    /**
     * 标签数超过阈值显示导航地图
     */
    mapNum: makeNumberProp(10),
    /**
     * 导航地图的标题
     */
    mapTitle: String,
    /**
     * 粘性布局
     */
    sticky: makeBooleanProp(false),
    /**
     * 粘性布局吸顶位置
     */
    offsetTop: makeNumberProp(0),
    /**
     * 开启手势滑动
     */
    swipeable: makeBooleanProp(false),
    /**
     * 自动调整底部条宽度，设置了 lineWidth 后无效
     */
    autoLineWidth: makeBooleanProp(false),
    /**
     * 底部条宽度，单位像素
     */
    lineWidth: numericProp,
    /**
     * 底部条高度，单位像素
     */
    lineHeight: numericProp,
    /**
     * 颜色
     */
    color: makeStringProp(""),
    /**
     * 非活动状态颜色
     */
    inactiveColor: makeStringProp(""),
    /**
     * 是否开启切换标签内容时的过渡动画
     */
    animated: makeBooleanProp(false),
    /**
     * 切换动画过渡时间，单位毫秒
     */
    duration: makeNumberProp(300),
    /**
     * 是否开启滚动导航
     * 可选值：'auto' | 'always'
     * @default auto
     */
    slidable: makeStringProp("auto")
  };
  const tabProps = {
    ...baseProps,
    /**
     * 唯一标识符
     */
    name: numericProp,
    /**
     * tab的标题
     */
    title: String,
    /**
     *  是否禁用，无法点击
     */
    disabled: makeBooleanProp(false),
    /**
     * 是否懒加载，切换到该tab时才加载内容
     * @default true
     */
    lazy: makeBooleanProp(true),
    /**
     * 徽标属性，透传给 Badge 组件
     */
    badgeProps: Object
  };
  const __default__$9 = {
    name: "wd-tab",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: tabProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { proxy } = vue.getCurrentInstance();
      const { parent: tabs, index } = useParent(TABS_KEY);
      const active = vue.computed(() => {
        return isDef(tabs) ? tabs.state.activeIndex === index.value : false;
      });
      const painted = vue.ref(active.value);
      const tabBodyStyle = vue.computed(() => {
        const style = {};
        if (!active.value && (!isDef(tabs) || !tabs.props.animated)) {
          style.display = "none";
        }
        return objToStyle(style);
      });
      const shouldBeRender = vue.computed(() => !props.lazy || painted.value || active.value);
      vue.watch(active, (val) => {
        if (val)
          painted.value = true;
      });
      vue.watch(
        () => props.name,
        (newValue) => {
          if (isDef(newValue) && !isNumber(newValue) && !isString(newValue)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tab/wd-tab.vue:56", "[wot design] error(wd-tab): the type of name should be number or string");
            return;
          }
          if (tabs) {
            checkName(proxy);
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      function checkName(self) {
        const { name: myName } = props;
        if (myName === void 0 || myName === null || myName === "") {
          return;
        }
        tabs && tabs.children.forEach((child) => {
          if (child.$.uid !== self.$.uid && child.name === myName) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tab/wd-tab.vue:81", `The tab's bound value: ${myName} has been used`);
          }
        });
      }
      const __returned__ = { props, proxy, tabs, index, active, painted, tabBodyStyle, shouldBeRender, checkName };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-tab ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        $setup.shouldBeRender ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["wd-tab__body", { "wd-tab__body--inactive": !$setup.active }]),
            style: vue.normalizeStyle($setup.tabBodyStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-0ac60957"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-tab/wd-tab.vue"]]);
  const badgeProps = {
    ...baseProps,
    /**
     * 显示值
     */
    modelValue: numericProp,
    /** 当数值为 0 时，是否展示徽标 */
    showZero: makeBooleanProp(false),
    bgColor: String,
    /**
     * 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型
     */
    max: Number,
    /**
     * 是否为红色点状标注
     */
    isDot: Boolean,
    /**
     * 是否隐藏 badge
     */
    hidden: Boolean,
    /**
     * badge类型，可选值primary / success / warning / danger / info
     */
    type: makeStringProp(void 0),
    /**
     * 为正时，角标向下偏移对应的像素
     */
    top: numericProp,
    /**
     * 为正时，角标向左偏移对应的像素
     */
    right: numericProp
  };
  const __default__$8 = {
    name: "wd-badge",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: badgeProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const content = vue.computed(() => {
        const { modelValue, max, isDot } = props;
        if (isDot)
          return "";
        let value = modelValue;
        if (value && max && isNumber(value) && !Number.isNaN(value) && !Number.isNaN(max)) {
          value = max < value ? `${max}+` : value;
        }
        return value;
      });
      const contentStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.bgColor)) {
          style.backgroundColor = props.bgColor;
        }
        if (isDef(props.top)) {
          style.top = addUnit(props.top);
        }
        if (isDef(props.right)) {
          style.right = addUnit(props.right);
        }
        return objToStyle(style);
      });
      const shouldShowBadge = vue.computed(() => !props.hidden && (content.value || content.value === 0 && props.showZero || props.isDot));
      const __returned__ = { props, content, contentStyle, shouldShowBadge };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["wd-badge", _ctx.customClass]),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        $setup.shouldShowBadge ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["wd-badge__content", "is-fixed", _ctx.type ? "wd-badge__content--" + _ctx.type : "", _ctx.isDot ? "is-dot" : ""]),
            style: vue.normalizeStyle($setup.contentStyle)
          },
          vue.toDisplayString($setup.content),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-6ea9b0eb"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-badge/wd-badge.vue"]]);
  const resizeProps = {
    ...baseProps,
    customContainerClass: makeStringProp("")
  };
  const __default__$7 = {
    name: "wd-resize",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: resizeProps,
    emits: ["resize"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const expandScrollTop = vue.ref(0);
      const shrinkScrollTop = vue.ref(0);
      const expandScrollLeft = vue.ref(0);
      const shrinkScrollLeft = vue.ref(0);
      const height = vue.ref(0);
      const width = vue.ref(0);
      const scrollEventCount = vue.ref(0);
      const rootStyle = vue.computed(() => {
        const style = {
          width: addUnit(width.value),
          height: addUnit(height.value)
        };
        return `${objToStyle(style)};${props.customStyle}`;
      });
      let onScrollHandler = () => {
      };
      const { proxy } = vue.getCurrentInstance();
      const resizeId = vue.ref(`resize${uuid()}`);
      vue.onMounted(() => {
        const query = uni.createSelectorQuery().in(proxy).select(`#${resizeId.value}`).boundingClientRect();
        query.exec(([res]) => {
          let lastHeight = res.height;
          let lastWidth = res.width;
          height.value = lastHeight;
          width.value = lastWidth;
          onScrollHandler = () => {
            const query2 = uni.createSelectorQuery().in(proxy).select(`#${resizeId.value}`).boundingClientRect();
            query2.exec(([res2]) => {
              if (scrollEventCount.value++ === 0) {
                const result = {};
                ["bottom", "top", "left", "right", "height", "width"].forEach((propName) => {
                  result[propName] = res2[propName];
                });
                emit("resize", result);
              }
              if (scrollEventCount.value < 3)
                return;
              const newHeight = res2.height;
              const newWidth = res2.width;
              height.value = newHeight;
              width.value = newWidth;
              const emitStack = [];
              if (newHeight !== lastHeight) {
                lastHeight = newHeight;
                emitStack.push(1);
              }
              if (newWidth !== lastWidth) {
                lastWidth = newWidth;
                emitStack.push(1);
              }
              if (emitStack.length !== 0) {
                const result = {};
                ["bottom", "top", "left", "right", "height", "width"].forEach((propName) => {
                  result[propName] = res2[propName];
                });
                emit("resize", result);
              }
              scrollToBottom({
                lastWidth,
                lastHeight
              });
            });
          };
          scrollToBottom({
            lastWidth,
            lastHeight
          });
        });
      });
      function scrollToBottom({ lastWidth, lastHeight }) {
        expandScrollTop.value = 1e5 + lastHeight;
        shrinkScrollTop.value = 3 * height.value + lastHeight;
        expandScrollLeft.value = 1e5 + lastWidth;
        shrinkScrollLeft.value = 3 * width.value + lastWidth;
      }
      const __returned__ = { props, emit, expandScrollTop, shrinkScrollTop, expandScrollLeft, shrinkScrollLeft, height, width, scrollEventCount, rootStyle, get onScrollHandler() {
        return onScrollHandler;
      }, set onScrollHandler(v) {
        onScrollHandler = v;
      }, proxy, resizeId, scrollToBottom };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-resize ${_ctx.customClass}`),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createCommentVNode("插槽需要脱离父容器文档流，防止父容器固宽固高，进而导致插槽大小被被父容器限制"),
        vue.createElementVNode("view", {
          id: $setup.resizeId,
          class: vue.normalizeClass(`wd-resize__container ${_ctx.customContainerClass}`)
        }, [
          vue.createCommentVNode("被监听的插槽"),
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
          vue.createCommentVNode("监听插槽变大"),
          vue.createElementVNode("scroll-view", {
            class: "wd-resize__wrapper",
            "scroll-y": true,
            "scroll-top": $setup.expandScrollTop,
            "scroll-x": true,
            "scroll-left": $setup.expandScrollLeft,
            onScroll: _cache[0] || (_cache[0] = (...args) => $setup.onScrollHandler && $setup.onScrollHandler(...args))
          }, [
            vue.createElementVNode("view", {
              class: "wd-resize__wrapper--placeholder",
              style: { "height": "100000px", "width": "100000px" }
            })
          ], 40, ["scroll-top", "scroll-left"]),
          vue.createCommentVNode("监听插槽变小"),
          vue.createElementVNode("scroll-view", {
            class: "wd-resize__wrapper",
            "scroll-y": true,
            "scroll-top": $setup.shrinkScrollTop,
            "scroll-x": true,
            "scroll-left": $setup.shrinkScrollLeft,
            onScroll: _cache[1] || (_cache[1] = (...args) => $setup.onScrollHandler && $setup.onScrollHandler(...args))
          }, [
            vue.createElementVNode("view", {
              class: "wd-resize__wrapper--placeholder",
              style: { "height": "250%", "width": "250%" }
            })
          ], 40, ["scroll-top", "scroll-left"])
        ], 10, ["id"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdResize = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-3d3c1eae"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-resize/wd-resize.vue"]]);
  const stickyProps = {
    ...baseProps,
    /**
     * 层级
     */
    zIndex: makeNumberProp(1),
    /**
     * 吸顶距离
     */
    offsetTop: makeNumberProp(0)
  };
  const STICKY_BOX_KEY = Symbol("wd-sticky-box");
  const __default__$6 = {
    name: "wd-sticky",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: stickyProps,
    setup(__props, { expose: __expose }) {
      const props = __props;
      const styckyId = vue.ref(`wd-sticky${uuid()}`);
      const observerList = vue.ref([]);
      const stickyState = vue.reactive({
        position: "absolute",
        boxLeaved: false,
        top: 0,
        height: 0,
        width: 0,
        state: ""
      });
      const { parent: stickyBox } = useParent(STICKY_BOX_KEY);
      const { proxy } = vue.getCurrentInstance();
      const rootStyle = vue.computed(() => {
        const style = {
          "z-index": props.zIndex,
          height: addUnit(stickyState.height),
          width: addUnit(stickyState.width)
        };
        if (!stickyState.boxLeaved) {
          style["position"] = "relative";
        }
        return `${objToStyle(style)};${props.customStyle}`;
      });
      const stickyStyle = vue.computed(() => {
        const style = {
          "z-index": props.zIndex,
          height: addUnit(stickyState.height),
          width: addUnit(stickyState.width)
        };
        if (!stickyState.boxLeaved) {
          style["position"] = "relative";
        }
        return `${objToStyle(style)};`;
      });
      const containerStyle = vue.computed(() => {
        const style = {
          position: stickyState.position,
          top: addUnit(stickyState.top)
        };
        return objToStyle(style);
      });
      const innerOffsetTop = vue.computed(() => {
        let top = 0;
        return top + props.offsetTop;
      });
      function clearObserver() {
        while (observerList.value.length !== 0) {
          observerList.value.pop().disconnect();
        }
      }
      function createObserver() {
        const observer = uni.createIntersectionObserver(proxy, { thresholds: [0, 0.5] });
        observerList.value.push(observer);
        return observer;
      }
      async function handleResize(detail) {
        stickyState.width = detail.width;
        stickyState.height = detail.height;
        await pause();
        observerContentScroll();
        if (!stickyBox || !stickyBox.observerForChild)
          return;
        stickyBox.observerForChild(proxy);
      }
      function observerContentScroll() {
        if (stickyState.height === 0 && stickyState.width === 0)
          return;
        const offset = innerOffsetTop.value + stickyState.height;
        clearObserver();
        createObserver().relativeToViewport({
          top: -offset
        }).observe(`#${styckyId.value}`, (result) => {
          handleRelativeTo(result);
        });
        getRect(`#${styckyId.value}`, false, proxy).then((res) => {
          if (Number(res.bottom) <= offset)
            handleRelativeTo({ boundingClientRect: res });
        });
      }
      function handleRelativeTo({ boundingClientRect }) {
        if (stickyBox && stickyState.height >= stickyBox.boxStyle.height) {
          stickyState.position = "absolute";
          stickyState.top = 0;
          return;
        }
        let isStycky = boundingClientRect.top <= innerOffsetTop.value;
        isStycky = boundingClientRect.top < innerOffsetTop.value;
        if (isStycky) {
          stickyState.state = "sticky";
          stickyState.boxLeaved = false;
          stickyState.position = "fixed";
          stickyState.top = innerOffsetTop.value;
        } else {
          stickyState.state = "normal";
          stickyState.boxLeaved = false;
          stickyState.position = "absolute";
          stickyState.top = 0;
        }
      }
      function setPosition(boxLeaved, position, top) {
        stickyState.boxLeaved = boxLeaved;
        stickyState.position = position;
        stickyState.top = top;
      }
      __expose({
        setPosition,
        stickyState,
        offsetTop: props.offsetTop
      });
      const __returned__ = { props, styckyId, observerList, stickyState, stickyBox, proxy, rootStyle, stickyStyle, containerStyle, innerOffsetTop, clearObserver, createObserver, handleResize, observerContentScroll, handleRelativeTo, setPosition, wdResize };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle(`${$setup.rootStyle};display: inline-block;`)
      },
      [
        vue.createElementVNode("view", {
          class: vue.normalizeClass(`wd-sticky ${_ctx.customClass}`),
          style: vue.normalizeStyle($setup.stickyStyle),
          id: $setup.styckyId
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "wd-sticky__container",
              style: vue.normalizeStyle($setup.containerStyle)
            },
            [
              vue.createVNode($setup["wdResize"], {
                onResize: $setup.handleResize,
                "custom-style": "display: inline-block;"
              }, {
                default: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                ]),
                _: 3
                /* FORWARDED */
              })
            ],
            4
            /* STYLE */
          )
        ], 14, ["id"])
      ],
      4
      /* STYLE */
    );
  }
  const wdSticky = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-2722b5fd"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-sticky/wd-sticky.vue"]]);
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function flattenVNodes(children) {
    const result = [];
    const traverse = (children2) => {
      if (Array.isArray(children2)) {
        children2.forEach((child) => {
          var _a;
          if (isVNode(child)) {
            result.push(child);
            if ((_a = child.component) == null ? void 0 : _a.subTree) {
              result.push(child.component.subTree);
              traverse(child.component.subTree.children);
            }
            if (child.children) {
              traverse(child.children);
            }
          }
        });
      }
    };
    traverse(children);
    return result;
  }
  const findVNodeIndex = (vnodes, vnode) => {
    const index = vnodes.indexOf(vnode);
    if (index === -1) {
      return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
    }
    return index;
  };
  function sortChildren(parent, publicChildren, internalChildren) {
    const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree.children) : [];
    internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
    const orderedPublicChildren = internalChildren.map((item) => item.proxy);
    publicChildren.sort((a, b) => {
      const indexA = orderedPublicChildren.indexOf(a);
      const indexB = orderedPublicChildren.indexOf(b);
      return indexA - indexB;
    });
  }
  function useChildren(key) {
    const publicChildren = vue.reactive([]);
    const internalChildren = vue.reactive([]);
    const parent = vue.getCurrentInstance();
    const linkChildren = (value) => {
      const link = (child) => {
        if (child.proxy) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      };
      const unlink = (child) => {
        const index = internalChildren.indexOf(child);
        publicChildren.splice(index, 1);
        internalChildren.splice(index, 1);
      };
      vue.provide(
        key,
        Object.assign(
          {
            link,
            unlink,
            children: publicChildren,
            internalChildren
          },
          value
        )
      );
    };
    return {
      children: publicChildren,
      linkChildren
    };
  }
  const __default__$5 = {
    name: "wd-sticky-box",
    options: {
      addGlobalClass: true,
      // virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: baseProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const styckyBoxId = vue.ref(`wd-sticky-box${uuid()}`);
      const observerMap = vue.ref(/* @__PURE__ */ new Map());
      const boxStyle = vue.reactive({
        height: 0,
        width: 0
      });
      const { proxy } = vue.getCurrentInstance();
      const { children: stickyList, linkChildren } = useChildren(STICKY_BOX_KEY);
      linkChildren({
        boxStyle,
        observerForChild
      });
      vue.onBeforeMount(() => {
        observerMap.value = /* @__PURE__ */ new Map();
      });
      function handleResize(detail) {
        boxStyle.width = detail.width;
        boxStyle.height = detail.height;
        const temp = observerMap.value;
        observerMap.value = /* @__PURE__ */ new Map();
        for (const [uid] of temp) {
          const child = stickyList.find((sticky) => {
            return sticky.$.uid === uid;
          });
          observerForChild(child);
        }
        temp.forEach((observer) => {
          observer.disconnect();
        });
        temp.clear();
      }
      function deleteObserver(child) {
        const observer = observerMap.value.get(child.$.uid);
        if (!observer)
          return;
        observer.disconnect();
        observerMap.value.delete(child.$.uid);
      }
      function createObserver(child) {
        const observer = uni.createIntersectionObserver(proxy, { thresholds: [0, 0.5] });
        observerMap.value.set(child.$.uid, observer);
        return observer;
      }
      function observerForChild(child) {
        deleteObserver(child);
        const observer = createObserver(child);
        const exposed = child.$.exposed;
        let offset = exposed.stickyState.height + exposed.offsetTop;
        if (boxStyle.height <= exposed.stickyState.height) {
          exposed.setPosition(false, "absolute", 0);
        }
        observer.relativeToViewport({ top: -offset }).observe(`#${styckyBoxId.value}`, (result) => {
          handleRelativeTo(exposed, result);
        });
        getRect(`#${styckyBoxId.value}`, false, proxy).then((res) => {
          if (Number(res.bottom) <= offset)
            handleRelativeTo(exposed, { boundingClientRect: res });
        }).catch((res) => {
          formatAppLog("log", "at uni_modules/wot-design-uni/components/wd-sticky-box/wd-sticky-box.vue:125", res);
        });
      }
      function handleRelativeTo(exposed, { boundingClientRect }) {
        let childOffsetTop = exposed.offsetTop;
        const offset = exposed.stickyState.height + childOffsetTop;
        let isAbsolute = boundingClientRect.bottom <= offset;
        isAbsolute = boundingClientRect.bottom < offset;
        if (isAbsolute) {
          exposed.setPosition(true, "absolute", boundingClientRect.height - exposed.stickyState.height);
        } else if (boundingClientRect.top <= offset && !isAbsolute) {
          if (exposed.stickyState.state === "normal")
            return;
          exposed.setPosition(false, "fixed", childOffsetTop);
        }
      }
      const __returned__ = { props, styckyBoxId, observerMap, boxStyle, proxy, stickyList, linkChildren, handleResize, deleteObserver, createObserver, observerForChild, handleRelativeTo, wdResize };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { style: { "position": "relative" } }, [
      vue.createElementVNode("view", {
        class: vue.normalizeClass(`wd-sticky-box ${$setup.props.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle),
        id: $setup.styckyBoxId
      }, [
        vue.createVNode($setup["wdResize"], { onResize: $setup.handleResize }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          _: 3
          /* FORWARDED */
        })
      ], 14, ["id"])
    ]);
  }
  const wdStickyBox = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-0667b36f"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-sticky-box/wd-sticky-box.vue"]]);
  function useTouch() {
    const direction = vue.ref("");
    const deltaX = vue.ref(0);
    const deltaY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    function touchStart(event) {
      const touch = event.touches[0];
      direction.value = "";
      deltaX.value = 0;
      deltaY.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      startX.value = touch.clientX;
      startY.value = touch.clientY;
    }
    function touchMove(event) {
      const touch = event.touches[0];
      deltaX.value = touch.clientX - startX.value;
      deltaY.value = touch.clientY - startY.value;
      offsetX.value = Math.abs(deltaX.value);
      offsetY.value = Math.abs(deltaY.value);
      direction.value = offsetX.value > offsetY.value ? "horizontal" : offsetX.value < offsetY.value ? "vertical" : "";
    }
    return {
      touchStart,
      touchMove,
      direction,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      startX,
      startY
    };
  }
  const __default__$4 = {
    name: "wd-tabs",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: tabsProps,
    emits: ["change", "disabled", "click", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const $item = ".wd-tabs__nav-item";
      const $itemText = ".wd-tabs__nav-item-text";
      const $container = ".wd-tabs__nav-container";
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("tabs");
      const state = vue.reactive({
        activeIndex: 0,
        // 选中值的索引，默认第一个
        lineStyle: "display:none;",
        // 激活项边框线样式
        useInnerLine: false,
        // 是否使用内部激活项边框线，当外部激活下划线未成功渲染时显示内部定位的
        inited: false,
        // 是否初始化
        animating: false,
        // 是否动画中
        mapShow: false,
        // map的开关
        scrollLeft: 0
        // scroll-view偏移量
      });
      const { children, linkChildren } = useChildren(TABS_KEY);
      linkChildren({ state, props });
      const { proxy } = vue.getCurrentInstance();
      const touch = useTouch();
      const innerSlidable = vue.computed(() => {
        return props.slidable === "always" || children.length > props.slidableNum;
      });
      const bodyStyle = vue.computed(() => {
        if (!props.animated) {
          return "";
        }
        return objToStyle({
          left: -100 * state.activeIndex + "%",
          "transition-duration": props.duration + "ms",
          "-webkit-transition-duration": props.duration + "ms"
        });
      });
      const getTabName = (tab, index) => {
        return isDef(tab.name) ? tab.name : index;
      };
      const updateActive = (value = 0, init = false, setScroll = true) => {
        if (children.length === 0)
          return;
        value = getActiveIndex(value);
        if (children[value].disabled)
          return;
        state.activeIndex = value;
        if (setScroll) {
          updateLineStyle(init === false);
          scrollIntoView();
        }
        setActiveTab();
      };
      const setActive = debounce$1(updateActive, 100, { leading: true });
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          if (!isNumber(newValue) && !isString(newValue)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue:228", "[wot design] error(wd-tabs): the type of value should be number or string");
          }
          if (newValue === "" || !isDef(newValue)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue:233", "[wot design] error(wd-tabs): tabs's value cannot be '' null or undefined");
          }
          if (typeof newValue === "number" && newValue < 0) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue:237", "[wot design] error(wd-tabs): tabs's value cannot be less than zero");
          }
        },
        {
          immediate: true,
          deep: true
        }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          const index = getActiveIndex(newValue);
          setActive(newValue, false, index !== state.activeIndex);
        },
        {
          immediate: false,
          deep: true
        }
      );
      vue.watch(
        () => children.length,
        () => {
          if (state.inited) {
            vue.nextTick(() => {
              setActive(props.modelValue);
            });
          }
        }
      );
      vue.watch(
        () => props.slidableNum,
        (newValue) => {
          checkNumRange(newValue, "slidableNum");
        }
      );
      vue.watch(
        () => props.mapNum,
        (newValue) => {
          checkNumRange(newValue, "mapNum");
        }
      );
      vue.onMounted(() => {
        state.inited = true;
        vue.nextTick(() => {
          updateActive(props.modelValue, true);
          state.useInnerLine = true;
        });
      });
      function toggleMap() {
        if (state.mapShow) {
          state.animating = false;
          setTimeout(() => {
            state.mapShow = false;
          }, 300);
        } else {
          state.mapShow = true;
          setTimeout(() => {
            state.animating = true;
          }, 100);
        }
      }
      async function updateLineStyle(animation = true) {
        if (!state.inited)
          return;
        const { autoLineWidth, lineWidth, lineHeight } = props;
        try {
          const lineStyle = {};
          if (isDef(lineWidth)) {
            lineStyle.width = addUnit(lineWidth);
          } else {
            if (autoLineWidth) {
              const textRects = await getRect($itemText, true, proxy);
              const textWidth = Number(textRects[state.activeIndex].width);
              lineStyle.width = addUnit(textWidth);
            }
          }
          if (isDef(lineHeight)) {
            lineStyle.height = addUnit(lineHeight);
            lineStyle.borderRadius = `calc(${addUnit(lineHeight)} / 2)`;
          }
          const rects = await getRect($item, true, proxy);
          const rect = rects[state.activeIndex];
          let left = rects.slice(0, state.activeIndex).reduce((prev, curr) => prev + Number(curr.width), 0) + Number(rect.width) / 2;
          if (left) {
            lineStyle.transform = `translateX(${left}px) translateX(-50%)`;
            if (animation) {
              lineStyle.transition = "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);";
            }
            state.useInnerLine = false;
            state.lineStyle = objToStyle(lineStyle);
          }
        } catch (error) {
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue:339", "[wot design] error(wd-tabs): update line style failed", error);
        }
      }
      function setActiveTab() {
        if (!state.inited)
          return;
        const name = getTabName(children[state.activeIndex], state.activeIndex);
        if (name !== props.modelValue) {
          emit("change", {
            index: state.activeIndex,
            name
          });
          emit("update:modelValue", name);
        }
      }
      function scrollIntoView() {
        if (!state.inited)
          return;
        Promise.all([getRect($item, true, proxy), getRect($container, false, proxy)]).then(([navItemsRects, navRect]) => {
          const selectItem = navItemsRects[state.activeIndex];
          const offsetLeft = navItemsRects.slice(0, state.activeIndex).reduce((prev, curr) => prev + curr.width, 0);
          const left = offsetLeft - (navRect.width - Number(selectItem.width)) / 2;
          if (left === state.scrollLeft) {
            state.scrollLeft = left + Math.random() / 1e4;
          } else {
            state.scrollLeft = left;
          }
        });
      }
      function handleSelect(index) {
        if (index === void 0)
          return;
        const { disabled } = children[index];
        const name = getTabName(children[index], index);
        if (disabled) {
          emit("disabled", {
            index,
            name
          });
          return;
        }
        state.mapShow && toggleMap();
        setActive(index);
        emit("click", {
          index,
          name
        });
      }
      function onTouchStart(event) {
        if (!props.swipeable)
          return;
        touch.touchStart(event);
      }
      function onTouchMove(event) {
        if (!props.swipeable)
          return;
        touch.touchMove(event);
      }
      function onTouchEnd() {
        if (!props.swipeable)
          return;
        const { direction, deltaX, offsetX } = touch;
        const minSwipeDistance = 50;
        if (direction.value === "horizontal" && offsetX.value >= minSwipeDistance) {
          if (deltaX.value > 0 && state.activeIndex !== 0) {
            setActive(state.activeIndex - 1);
          } else if (deltaX.value < 0 && state.activeIndex !== children.length - 1) {
            setActive(state.activeIndex + 1);
          }
        }
      }
      function getActiveIndex(value) {
        if (isNumber(value) && value >= children.length) {
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue:419", "[wot design] warning(wd-tabs): the type of tabs' value is Number shouldn't be less than its children");
          value = 0;
        }
        if (isString(value)) {
          const index = children.findIndex((item) => item.name === value);
          value = index === -1 ? 0 : index;
        }
        return value;
      }
      __expose({
        setActive,
        scrollIntoView,
        updateLineStyle
      });
      const __returned__ = { $item, $itemText, $container, props, emit, translate, state, children, linkChildren, proxy, touch, innerSlidable, bodyStyle, getTabName, updateActive, setActive, toggleMap, updateLineStyle, setActiveTab, scrollIntoView, handleSelect, onTouchStart, onTouchMove, onTouchEnd, getActiveIndex, wdIcon: __easycom_0$5, wdSticky, wdStickyBox };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_badge = resolveEasycom(vue.resolveDynamicComponent("wd-badge"), __easycom_0$3);
    return _ctx.sticky ? (vue.openBlock(), vue.createBlock($setup["wdStickyBox"], { key: 0 }, {
      default: vue.withCtx(() => [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-tabs ${_ctx.customClass} ${$setup.innerSlidable ? "is-slide" : ""} ${_ctx.mapNum < $setup.children.length && _ctx.mapNum !== 0 ? "is-map" : ""}`),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            vue.createVNode($setup["wdSticky"], { "offset-top": _ctx.offsetTop }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "wd-tabs__nav wd-tabs__nav--sticky" }, [
                  vue.createElementVNode("view", { class: "wd-tabs__nav--wrap" }, [
                    vue.createElementVNode("scroll-view", {
                      "scroll-x": $setup.innerSlidable,
                      "scroll-with-animation": "",
                      "scroll-left": $setup.state.scrollLeft
                    }, [
                      vue.createElementVNode("view", { class: "wd-tabs__nav-container" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($setup.children, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              onClick: ($event) => $setup.handleSelect(index),
                              key: index,
                              class: vue.normalizeClass(`wd-tabs__nav-item  ${$setup.state.activeIndex === index ? "is-active" : ""} ${item.disabled ? "is-disabled" : ""}`),
                              style: vue.normalizeStyle($setup.state.activeIndex === index ? _ctx.color ? "color:" + _ctx.color : "" : _ctx.inactiveColor ? "color:" + _ctx.inactiveColor : "")
                            }, [
                              item.badgeProps ? (vue.openBlock(), vue.createBlock(
                                _component_wd_badge,
                                vue.normalizeProps(vue.mergeProps({ key: 0 }, item.badgeProps)),
                                {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode(
                                      "text",
                                      { class: "wd-tabs__nav-item-text" },
                                      vue.toDisplayString(item.title),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1040
                                /* FULL_PROPS, DYNAMIC_SLOTS */
                              )) : (vue.openBlock(), vue.createElementBlock(
                                "text",
                                {
                                  key: 1,
                                  class: "wd-tabs__nav-item-text"
                                },
                                vue.toDisplayString(item.title),
                                1
                                /* TEXT */
                              )),
                              $setup.state.activeIndex === index && $setup.state.useInnerLine ? (vue.openBlock(), vue.createElementBlock("view", {
                                key: 2,
                                class: "wd-tabs__line wd-tabs__line--inner"
                              })) : vue.createCommentVNode("v-if", true)
                            ], 14, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        )),
                        vue.createElementVNode(
                          "view",
                          {
                            class: "wd-tabs__line",
                            style: vue.normalizeStyle($setup.state.lineStyle)
                          },
                          null,
                          4
                          /* STYLE */
                        )
                      ])
                    ], 8, ["scroll-x", "scroll-left"])
                  ]),
                  _ctx.mapNum < $setup.children.length && _ctx.mapNum !== 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "wd-tabs__map"
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(`wd-tabs__map-btn  ${$setup.state.animating ? "is-open" : ""}`),
                        onClick: $setup.toggleMap
                      },
                      [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(`wd-tabs__map-arrow  ${$setup.state.animating ? "is-open" : ""}`)
                          },
                          [
                            vue.createVNode($setup["wdIcon"], { name: "arrow-down" })
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: "wd-tabs__map-header",
                        style: vue.normalizeStyle(`${$setup.state.mapShow ? "" : "display:none;"}  ${$setup.state.animating ? "opacity:1;" : ""}`)
                      },
                      vue.toDisplayString(_ctx.mapTitle || $setup.translate("all")),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(`wd-tabs__map-body  ${$setup.state.animating ? "is-open" : ""}`),
                        style: vue.normalizeStyle($setup.state.mapShow ? "" : "display:none")
                      },
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($setup.children, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              class: "wd-tabs__map-nav-item",
                              key: index,
                              onClick: ($event) => $setup.handleSelect(index)
                            }, [
                              vue.createElementVNode(
                                "view",
                                {
                                  class: vue.normalizeClass(`wd-tabs__map-nav-btn ${$setup.state.activeIndex === index ? "is-active" : ""}  ${item.disabled ? "is-disabled" : ""}`),
                                  style: vue.normalizeStyle(
                                    $setup.state.activeIndex === index ? _ctx.color ? "color:" + _ctx.color + ";border-color:" + _ctx.color : "" : _ctx.inactiveColor ? "color:" + _ctx.inactiveColor : ""
                                  )
                                },
                                vue.toDisplayString(item.title),
                                7
                                /* TEXT, CLASS, STYLE */
                              )
                            ], 8, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ],
                      6
                      /* CLASS, STYLE */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["offset-top"]),
            vue.createElementVNode(
              "view",
              {
                class: "wd-tabs__container",
                onTouchstart: $setup.onTouchStart,
                onTouchmove: $setup.onTouchMove,
                onTouchend: $setup.onTouchEnd,
                onTouchcancel: $setup.onTouchEnd
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["wd-tabs__body", _ctx.animated ? "is-animated" : ""]),
                    style: vue.normalizeStyle($setup.bodyStyle)
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ],
              32
              /* NEED_HYDRATION */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "wd-tabs__mask",
                style: vue.normalizeStyle(`${$setup.state.mapShow ? "" : "display:none;"} ${$setup.state.animating ? "opacity:1;" : ""}`),
                onClick: $setup.toggleMap
              },
              null,
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        )
      ]),
      _: 3
      /* FORWARDED */
    })) : (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 1,
        class: vue.normalizeClass(`wd-tabs ${_ctx.customClass} ${$setup.innerSlidable ? "is-slide" : ""} ${_ctx.mapNum < $setup.children.length && _ctx.mapNum !== 0 ? "is-map" : ""}`)
      },
      [
        vue.createElementVNode("view", { class: "wd-tabs__nav" }, [
          vue.createElementVNode("view", { class: "wd-tabs__nav--wrap" }, [
            vue.createElementVNode("scroll-view", {
              "scroll-x": $setup.innerSlidable,
              "scroll-with-animation": "",
              "scroll-left": $setup.state.scrollLeft
            }, [
              vue.createElementVNode("view", { class: "wd-tabs__nav-container" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.children, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      onClick: ($event) => $setup.handleSelect(index),
                      key: index,
                      class: vue.normalizeClass(`wd-tabs__nav-item ${$setup.state.activeIndex === index ? "is-active" : ""} ${item.disabled ? "is-disabled" : ""}`),
                      style: vue.normalizeStyle($setup.state.activeIndex === index ? _ctx.color ? "color:" + _ctx.color : "" : _ctx.inactiveColor ? "color:" + _ctx.inactiveColor : "")
                    }, [
                      item.badgeProps ? (vue.openBlock(), vue.createBlock(
                        _component_wd_badge,
                        vue.mergeProps({
                          key: 0,
                          "custom-class": "wd-tabs__nav-item-badge"
                        }, item.badgeProps),
                        {
                          default: vue.withCtx(() => [
                            vue.createElementVNode(
                              "text",
                              { class: "wd-tabs__nav-item-text" },
                              vue.toDisplayString(item.title),
                              1
                              /* TEXT */
                            )
                          ]),
                          _: 2
                          /* DYNAMIC */
                        },
                        1040
                        /* FULL_PROPS, DYNAMIC_SLOTS */
                      )) : (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 1,
                          class: "wd-tabs__nav-item-text"
                        },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      )),
                      $setup.state.activeIndex === index && $setup.state.useInnerLine ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 2,
                        class: "wd-tabs__line wd-tabs__line--inner"
                      })) : vue.createCommentVNode("v-if", true)
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                vue.createElementVNode(
                  "view",
                  {
                    class: "wd-tabs__line",
                    style: vue.normalizeStyle($setup.state.lineStyle)
                  },
                  null,
                  4
                  /* STYLE */
                )
              ])
            ], 8, ["scroll-x", "scroll-left"])
          ]),
          _ctx.mapNum < $setup.children.length && _ctx.mapNum !== 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "wd-tabs__map"
          }, [
            vue.createElementVNode("view", {
              class: "wd-tabs__map-btn",
              onClick: $setup.toggleMap
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(`wd-tabs__map-arrow ${$setup.state.animating ? "is-open" : ""}`)
                },
                [
                  vue.createVNode($setup["wdIcon"], { name: "arrow-down" })
                ],
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode(
              "view",
              {
                class: "wd-tabs__map-header",
                style: vue.normalizeStyle(`${$setup.state.mapShow ? "" : "display:none;"}  ${$setup.state.animating ? "opacity:1;" : ""}`)
              },
              vue.toDisplayString(_ctx.mapTitle || $setup.translate("all")),
              5
              /* TEXT, STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(`wd-tabs__map-body ${$setup.state.animating ? "is-open" : ""}`),
                style: vue.normalizeStyle($setup.state.mapShow ? "" : "display:none")
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.children, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "wd-tabs__map-nav-item",
                      key: index,
                      onClick: ($event) => $setup.handleSelect(index)
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(`wd-tabs__map-nav-btn ${$setup.state.activeIndex === index ? "is-active" : ""}  ${item.disabled ? "is-disabled" : ""}`)
                        },
                        vue.toDisplayString(item.title),
                        3
                        /* TEXT, CLASS */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              6
              /* CLASS, STYLE */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode(
          "view",
          {
            class: "wd-tabs__container",
            onTouchstart: $setup.onTouchStart,
            onTouchmove: $setup.onTouchMove,
            onTouchend: $setup.onTouchEnd,
            onTouchcancel: $setup.onTouchEnd
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["wd-tabs__body", _ctx.animated ? "is-animated" : ""]),
                style: vue.normalizeStyle($setup.bodyStyle)
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ],
              6
              /* CLASS, STYLE */
            )
          ],
          32
          /* NEED_HYDRATION */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "wd-tabs__mask",
            style: vue.normalizeStyle(`${$setup.state.mapShow ? "" : "display:none;"}  ${$setup.state.animating ? "opacity:1" : ""}`),
            onClick: $setup.toggleMap
          },
          null,
          4
          /* STYLE */
        )
      ],
      2
      /* CLASS */
    ));
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-4388d15d"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.vue"]]);
  const navbarProps = {
    ...baseProps,
    /**
     * 标题文字
     */
    title: String,
    /**
     * 左侧文案
     */
    leftText: String,
    /**
     * 右侧文案
     */
    rightText: String,
    /**
     * 是否显示左侧箭头
     */
    leftArrow: makeBooleanProp(false),
    /**
     * 是否显示下边框
     */
    bordered: makeBooleanProp(true),
    /**
     * 是否固定到顶部
     */
    fixed: makeBooleanProp(false),
    /**
     * 固定在顶部时，是否在标签位置生成一个等高的占位元素
     */
    placeholder: makeBooleanProp(false),
    /**
     * 导航栏 z-index
     */
    zIndex: makeNumberProp(500),
    /**
     * 是否开启顶部安全区适配
     */
    safeAreaInsetTop: makeBooleanProp(false),
    /**
     * 是否禁用左侧按钮，禁用时透明度降低，且无法点击
     */
    leftDisabled: makeBooleanProp(false),
    /**
     * 是否禁用右侧按钮，禁用时透明度降低，且无法点击
     */
    rightDisabled: makeBooleanProp(false)
  };
  const __default__$3 = {
    name: "wd-navbar",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: navbarProps,
    emits: ["click-left", "click-right"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const height = vue.ref("");
      const { statusBarHeight } = uni.getSystemInfoSync();
      vue.watch(
        [() => props.fixed, () => props.placeholder],
        () => {
          setPlaceholderHeight();
        },
        { deep: true, immediate: false }
      );
      const rootStyle = vue.computed(() => {
        const style = {};
        if (props.fixed && isDef(props.zIndex)) {
          style["z-index"] = props.zIndex;
        }
        if (props.safeAreaInsetTop) {
          style["padding-top"] = addUnit(statusBarHeight || 0);
        }
        return `${objToStyle(style)};${props.customStyle}`;
      });
      vue.onMounted(() => {
        if (props.fixed && props.placeholder) {
          vue.nextTick(() => {
            setPlaceholderHeight();
          });
        }
      });
      function handleClickLeft() {
        if (!props.leftDisabled) {
          emit("click-left");
        }
      }
      function handleClickRight() {
        if (!props.rightDisabled) {
          emit("click-right");
        }
      }
      const { proxy } = vue.getCurrentInstance();
      function setPlaceholderHeight() {
        if (!props.fixed || !props.placeholder) {
          return;
        }
        getRect(".wd-navbar", false, proxy).then((res) => {
          height.value = res.height;
        });
      }
      const __returned__ = { props, emit, height, statusBarHeight, rootStyle, handleClickLeft, handleClickRight, proxy, setPlaceholderHeight, wdIcon: __easycom_0$5, get addUnit() {
        return addUnit;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle({ height: $setup.addUnit($setup.height) })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-navbar ${_ctx.customClass} ${_ctx.fixed ? "is-fixed" : ""} ${_ctx.bordered ? "is-border" : ""}`),
            style: vue.normalizeStyle($setup.rootStyle)
          },
          [
            vue.createElementVNode("view", { class: "wd-navbar__content" }, [
              _ctx.$slots.capsule ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "wd-navbar__capsule"
              }, [
                vue.renderSlot(_ctx.$slots, "capsule", {}, void 0, true)
              ])) : !_ctx.$slots.left ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  class: vue.normalizeClass(`wd-navbar__left ${_ctx.leftDisabled ? "is-disabled" : ""}`),
                  onClick: $setup.handleClickLeft
                },
                [
                  _ctx.leftArrow ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                    key: 0,
                    name: "arrow-left",
                    "custom-class": "wd-navbar__arrow"
                  })) : vue.createCommentVNode("v-if", true),
                  _ctx.leftText ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 1,
                      class: "wd-navbar__text"
                    },
                    vue.toDisplayString(_ctx.leftText),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              )) : (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 2,
                  class: vue.normalizeClass(`wd-navbar__left ${_ctx.leftDisabled ? "is-disabled" : ""}`),
                  onClick: $setup.handleClickLeft
                },
                [
                  vue.renderSlot(_ctx.$slots, "left", {}, void 0, true)
                ],
                2
                /* CLASS */
              )),
              vue.createElementVNode("view", { class: "wd-navbar__title" }, [
                vue.renderSlot(_ctx.$slots, "title", {}, void 0, true),
                !_ctx.$slots.title && _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  [
                    vue.createTextVNode(
                      vue.toDisplayString(_ctx.title),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              _ctx.$slots.right || _ctx.rightText ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 3,
                  class: vue.normalizeClass(`wd-navbar__right ${_ctx.rightDisabled ? "is-disabled" : ""}`),
                  onClick: $setup.handleClickRight
                },
                [
                  vue.renderSlot(_ctx.$slots, "right", {}, void 0, true),
                  !_ctx.$slots.right && _ctx.rightText ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "wd-navbar__text",
                      "hover-class": "wd-navbar__text--hover",
                      "hover-stay-time": 70
                    },
                    vue.toDisplayString(_ctx.rightText),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-089e80c4"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-navbar/wd-navbar.vue"]]);
  const _sfc_main$j = {
    __name: "Navbar",
    props: ["lefttitle", "title", "Isleft"],
    emits: ["fun"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const pops = __props;
      const emit = __emit;
      const initail = () => {
        emit("fun");
      };
      function handleClickLeft() {
        if (pops.Isleft) {
          return;
        }
        uni.navigateBack();
      }
      const __returned__ = { pops, emit, initail, handleClickLeft, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_navbar = resolveEasycom(vue.resolveDynamicComponent("wd-navbar"), __easycom_1$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "nav" }, [
      vue.createVNode(_component_wd_navbar, {
        fixed: "",
        placeholder: "",
        safeAreaInsetTop: "",
        onClickLeft: $setup.handleClickLeft,
        "left-arrow": !$setup.pops.Isleft
      }, vue.createSlots({
        title: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "search-box" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              mode: "heightFix"
            })
          ])
        ]),
        right: vue.withCtx(() => [
          vue.createElementVNode(
            "view",
            {
              class: "size",
              onClick: $setup.initail
            },
            vue.toDisplayString($setup.pops.title),
            1
            /* TEXT */
          )
        ]),
        _: 2
        /* DYNAMIC */
      }, [
        $setup.pops.Isleft ? {
          name: "left",
          fn: vue.withCtx(() => [
            vue.createElementVNode(
              "view",
              { class: "size" },
              vue.toDisplayString($setup.pops.lefttitle),
              1
              /* TEXT */
            )
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["left-arrow"]),
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  const NavbarVue = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-35616072"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/components/Navbar.vue"]]);
  const _sfc_main$i = {
    __name: "UserHome",
    setup(__props, { expose: __expose }) {
      __expose();
      const tab = vue.ref(0);
      const wdtabs = vue.ref([
        { id: 1, title: "动态" },
        { id: 2, title: "照片墙" }
      ]);
      const setTabid = (e) => {
        tab.value = e.detail.current;
      };
      const srctop = async (fun) => {
        await new Promise((res, rje) => {
          setTimeout(() => {
            alert("测试");
            res("as");
          }, 1e3);
        });
        fun();
      };
      const srcbut = async (fun) => {
        await new Promise((res, rje) => {
          setTimeout(() => {
            alert("测试");
          }, 1e3);
        });
        fun();
      };
      const __returned__ = { tab, wdtabs, setTabid, srctop, srcbut, NavbarVue, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_img = resolveEasycom(vue.resolveDynamicComponent("wd-img"), __easycom_0$4);
    const _component_wd_tag = resolveEasycom(vue.resolveDynamicComponent("wd-tag"), __easycom_2$1);
    const _component_wd_tab = resolveEasycom(vue.resolveDynamicComponent("wd-tab"), __easycom_2);
    const _component_wd_tabs = resolveEasycom(vue.resolveDynamicComponent("wd-tabs"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode($setup["NavbarVue"], {
        Isleft: false,
        onFun: _cache[0] || (_cache[0] = ($event) => $setup.setTabid())
      }),
      vue.createElementVNode("view", { class: "img-src" }, [
        vue.createVNode(_component_wd_img, {
          width: 100,
          height: 100,
          round: "",
          "enable-preview": true,
          src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain"
        })
      ]),
      vue.createElementVNode("view", { class: "userxx" }, [
        vue.createElementVNode("view", { class: "title-name" }, " 呆呆小萌兽 "),
        vue.createElementVNode("view", { class: "xires" }, [
          vue.createVNode(_component_wd_tag, {
            "custom-class": "space",
            type: "success"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("20")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_wd_tag, {
            "custom-class": "space",
            type: "warning"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("宜春")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_wd_tag, {
            "custom-class": "space",
            type: "warning"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("刚刚在线")
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        vue.createElementVNode("view", { class: "desc" }, " 我时一个帅气的人， 我时一个帅气的人，想找个男人一起学java 我时一个帅气的人，想找个男人一起学java想找个男人一起学java "),
        vue.createElementVNode("view", { class: "flex-list-tag" }, [
          (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(20, (i) => {
              return vue.createVNode(_component_wd_tag, {
                class: "tag",
                color: "#966E6E",
                "bg-color": "#F5F5F5",
                mark: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("标签")
                ]),
                _: 1
                /* STABLE */
              });
            }),
            64
            /* STABLE_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "img-list" }, [
          (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(5, (i) => {
              return vue.createVNode(_component_wd_img, {
                class: "img",
                src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain",
                "enable-preview": true
              });
            }),
            64
            /* STABLE_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("hr"),
        vue.createElementVNode("view", { class: "top" }, [
          vue.createVNode(_component_wd_tabs, {
            modelValue: $setup.tab,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.tab = $event),
            style: { "width": "50%" }
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.wdtabs, (item) => {
                  return vue.openBlock(), vue.createBlock(_component_wd_tab, {
                    key: item,
                    title: `${item.title}`
                  }, null, 8, ["title"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        vue.createElementVNode("swiper", {
          "indicator-dots": false,
          duration: 300,
          class: "nr",
          current: $setup.tab,
          onChange: $setup.setTabid
        }, [
          vue.createElementVNode("swiper-item"),
          vue.createElementVNode("swiper-item")
        ], 40, ["current"])
      ])
    ]);
  }
  const PagesHomefriendUserHome = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-a598043d"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Homefriend/UserHome.vue"]]);
  const searchProps = {
    ...baseProps,
    customInputClass: makeStringProp(""),
    /**
     * 输入框内容，双向绑定
     * 类型: string
     * 默认值: ''
     */
    modelValue: makeStringProp(""),
    /**
     * 是否使用输入框右侧插槽
     * 类型: boolean
     * 默认值: false
     * @deprecated 该属性已废弃，将在下一个minor版本被移除，直接使用插槽即可
     */
    useSuffixSlot: makeBooleanProp(false),
    /**
     * 搜索框占位文本
     * 类型: string
     */
    placeholder: String,
    /**
     * 搜索框右侧文本
     * 类型: string
     */
    cancelTxt: String,
    /**
     * 搜索框亮色（白色）
     * 类型: boolean
     * 默认值: false
     */
    light: makeBooleanProp(false),
    /**
     * 是否隐藏右侧文本
     * 类型: boolean
     * 默认值: false
     */
    hideCancel: makeBooleanProp(false),
    /**
     * 是否禁用搜索框
     * 类型: boolean
     * 默认值: false
     */
    disabled: makeBooleanProp(false),
    /**
     * 原生属性，设置最大长度。-1 表示无限制
     * 类型: string / number
     * 默认值: -1
     */
    maxlength: makeNumberProp(-1),
    /**
     * placeholder 居左边
     * 类型: boolean
     * 默认值: false
     */
    placeholderLeft: makeBooleanProp(false),
    /**
     * 是否自动聚焦
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focus: makeBooleanProp(false),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focusWhenClear: makeBooleanProp(false),
    /**
     * 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight
     */
    placeholderStyle: String,
    /**
     * 原生属性，指定 placeholder 的样式类
     */
    placeholderClass: makeStringProp("")
  };
  const __default__$2 = {
    name: "wd-search",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: searchProps,
    emits: ["update:modelValue", "change", "clear", "search", "focus", "blur", "cancel"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("search");
      const isFocused = vue.ref(false);
      const showInput = vue.ref(false);
      const str = vue.ref("");
      const showPlaceHolder = vue.ref(true);
      const clearing = vue.ref(false);
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          str.value = newValue;
          if (newValue) {
            showInput.value = true;
          }
        },
        { immediate: true }
      );
      vue.watch(
        () => props.focus,
        (newValue) => {
          if (newValue) {
            if (props.disabled)
              return;
            closeCover();
          }
        }
      );
      vue.onMounted(() => {
        if (props.focus) {
          closeCover();
        }
      });
      const rootClass = vue.computed(() => {
        return `wd-search  ${props.light ? "is-light" : ""}  ${props.hideCancel ? "is-without-cancel" : ""} ${props.customClass}`;
      });
      const coverStyle = vue.computed(() => {
        const coverStyle2 = {
          display: str.value === "" && showPlaceHolder.value ? "flex" : "none"
        };
        return objToStyle(coverStyle2);
      });
      async function hackFocus(focus) {
        showInput.value = focus;
        await pause();
        isFocused.value = focus;
      }
      async function closeCover() {
        if (props.disabled)
          return;
        await pause(100);
        showPlaceHolder.value = false;
        hackFocus(true);
      }
      function inputValue(event) {
        str.value = event.detail.value;
        emit("update:modelValue", event.detail.value);
        emit("change", {
          value: event.detail.value
        });
      }
      async function clearSearch() {
        str.value = "";
        clearing.value = true;
        if (props.focusWhenClear) {
          isFocused.value = false;
        }
        await pause(100);
        if (props.focusWhenClear) {
          showPlaceHolder.value = false;
          hackFocus(true);
        } else {
          showPlaceHolder.value = true;
          hackFocus(false);
        }
        emit("change", {
          value: ""
        });
        emit("update:modelValue", "");
        emit("clear");
      }
      function search({ detail: { value } }) {
        emit("search", {
          value
        });
      }
      function searchFocus() {
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        showPlaceHolder.value = false;
        emit("focus", {
          value: str.value
        });
      }
      function searchBlur() {
        if (clearing.value)
          return;
        showPlaceHolder.value = !str.value;
        showInput.value = !showPlaceHolder.value;
        isFocused.value = false;
        emit("blur", {
          value: str.value
        });
      }
      function handleCancel() {
        emit("cancel", {
          value: str.value
        });
      }
      const __returned__ = { props, emit, translate, isFocused, showInput, str, showPlaceHolder, clearing, rootClass, coverStyle, hackFocus, closeCover, inputValue, clearSearch, search, searchFocus, searchBlur, handleCancel, wdIcon: __easycom_0$5 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.createElementVNode("view", { class: "wd-search__block" }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true),
          vue.createElementVNode("view", { class: "wd-search__field" }, [
            !_ctx.placeholderLeft ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                style: vue.normalizeStyle($setup.coverStyle),
                class: "wd-search__cover",
                onClick: $setup.closeCover
              },
              [
                vue.createVNode($setup["wdIcon"], {
                  name: "search",
                  "custom-class": "wd-search__search-icon"
                }),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(`wd-search__placeholder-txt ${_ctx.placeholderClass}`)
                  },
                  vue.toDisplayString(_ctx.placeholder || $setup.translate("search")),
                  3
                  /* TEXT, CLASS */
                )
              ],
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true),
            $setup.showInput || $setup.str || _ctx.placeholderLeft ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 1,
              name: "search",
              "custom-class": "wd-search__search-left-icon"
            })) : vue.createCommentVNode("v-if", true),
            $setup.showInput || $setup.str || _ctx.placeholderLeft ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              placeholder: _ctx.placeholder || $setup.translate("search"),
              "placeholder-class": `wd-search__placeholder-txt ${_ctx.placeholderClass}`,
              "placeholder-style": _ctx.placeholderStyle,
              "confirm-type": "search",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.str = $event),
              class: vue.normalizeClass(["wd-search__input", _ctx.customInputClass]),
              onFocus: $setup.searchFocus,
              onInput: $setup.inputValue,
              onBlur: $setup.searchBlur,
              onConfirm: $setup.search,
              disabled: _ctx.disabled,
              maxlength: _ctx.maxlength,
              focus: $setup.isFocused
            }, null, 42, ["placeholder", "placeholder-class", "placeholder-style", "disabled", "maxlength", "focus"])), [
              [vue.vModelText, $setup.str]
            ]) : vue.createCommentVNode("v-if", true),
            $setup.str ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 3,
              "custom-class": "wd-search__clear wd-search__clear-icon",
              name: "error-fill",
              onClick: $setup.clearSearch
            })) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        !_ctx.hideCancel ? vue.renderSlot(_ctx.$slots, "suffix", { key: 0 }, () => [
          vue.createElementVNode(
            "view",
            {
              class: "wd-search__cancel",
              onClick: $setup.handleCancel
            },
            vue.toDisplayString(_ctx.cancelTxt || $setup.translate("cancel")),
            1
            /* TEXT */
          )
        ], true) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-cc0202be"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-search/wd-search.vue"]]);
  const _sfc_main$g = {
    __name: "UserList",
    props: ["data"],
    setup(__props, { expose: __expose }) {
      __expose();
      const store = useStore();
      const porps = __props;
      const count = vue.ref(0);
      const gochat = () => {
        uni.navigateTo({
          url: `/pages/Chat/index?sendId=${porps.data.id}`
        });
      };
      vue.watch(porps.data, () => {
        setcount();
      });
      const setcount = () => {
        let arr = porps.data.sendList;
        let number = 0;
        arr.map((item) => {
          if (item.yeslook == 0 && item.sendid == store.state.user.user.id) {
            number += 1;
          }
        });
        count.value = number;
      };
      vue.onMounted(() => {
        setcount();
      });
      const __returned__ = { store, porps, count, gochat, setcount, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch, get useStore() {
        return useStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "userlist",
      onClick: $setup.gochat
    }, [
      vue.createElementVNode("view", { class: "left" }, [
        vue.createElementVNode("image", {
          src: $setup.porps.data.avatarUrl,
          mode: ""
        }, null, 8, ["src"]),
        $setup.porps.data.login == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "aft"
        })) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", { class: "right" }, [
        vue.createElementVNode("view", { class: "userlist-right-top" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.porps.data.username),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", null, vue.toDisplayString(""))
        ]),
        vue.createElementVNode("view", { class: "userlist-right-but" }, [
          vue.createElementVNode(
            "text",
            { style: { "flex-wrap": "nowrap", "line-height": "1em", "margin-top": "1em" } },
            vue.toDisplayString($setup.porps.data.sendList[$setup.porps.data.sendList.length - 1].context || "快开始聊天把"),
            1
            /* TEXT */
          ),
          $setup.count != 0 ? (vue.openBlock(), vue.createElementBlock(
            "text",
            { key: 0 },
            vue.toDisplayString($setup.count),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const UserListVue = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-045d234b"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Userlist/util/UserList.vue"]]);
  function toast(title, icon = "none", duration = 1500) {
    if (title) {
      uni.showToast({
        title,
        icon,
        duration
      });
    }
  }
  function getStorageSync(key) {
    return uni.getStorageSync(key);
  }
  class RequestManager {
    constructor() {
      this.idMap = /* @__PURE__ */ new Map();
    }
    /**
     * 生成唯一ID，并将ID和请求信息存储到map对象中
     * @param {string} method - 请求方法
     * @param {string} url - 请求URL
     * @param {object} params - 请求参数
     * @returns {string|boolean} - 生成的唯一ID，如果存在相同请求则返回false
     */
    generateId(method, url, params) {
      const id = this.generateUniqueId(method, url, params);
      if (this.idMap.has(id)) {
        return false;
      }
      this.idMap.set(id, { method, url, params });
      return id;
    }
    /**
     * 根据ID删除map对象中的请求信息
     * @param {string} id - 要删除的唯一ID
     */
    deleteById(id) {
      this.idMap.delete(id);
    }
    /**
     * 生成唯一ID的方法
     * @param {string} method - 请求方法
     * @param {string} url - 请求URL
     * @param {object} params - 请求参数
     * @returns {string} - 生成的唯一ID
     */
    generateUniqueId(method, url, params) {
      const idString = `${method}-${url}-${this.serializeObject(params)}`;
      let id = 0;
      for (let i = 0; i < idString.length; i++) {
        id = (id << 5) - id + idString.charCodeAt(i);
        id |= 0;
      }
      return id.toString();
    }
    /**
     * 序列化对象为字符串
     * @param {object} obj - 要序列化的对象
     * @returns {string} - 序列化后的字符串
     */
    serializeObject(obj) {
      const keys = Object.keys(obj).sort();
      const serializedObj = {};
      for (let key of keys) {
        const value = obj[key];
        if (value !== null && typeof value === "object") {
          serializedObj[key] = this.serializeObject(value);
        } else {
          serializedObj[key] = value;
        }
      }
      return JSON.stringify(serializedObj);
    }
  }
  let cookie = null;
  const manager = new RequestManager();
  const baseRequest = async (url, method, data = {}, loading = true) => {
    let requestId = manager.generateId(method, url, data);
    if (!requestId) {
      formatAppLog("log", "at util/request.js:12", "重复请求");
    }
    if (!requestId)
      return false;
    const header = {};
    header.token = getStorageSync("token") || "";
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + url,
        method: method || "GET",
        header: { ...header, "Cookie": cookie },
        timeout: 1e4,
        data: data || {},
        withCredentials: true,
        // 允许携带 Cookie
        complete: () => {
          manager.deleteById(requestId);
        },
        success: (successData) => {
          if (url == "/user/login") {
            cookie = successData.cookies[0] ? successData.cookies[0] : null;
          }
          const res = successData.data;
          if (res.code == 0) {
            resolve(res);
          } else {
            toast("网络连接失败，请稍后重试");
            reject(res);
          }
        },
        fail: (msg) => {
          toast("网络连接失败，请稍后重试");
          reject(msg);
        }
      });
    });
  };
  const request = {};
  ["options", "get", "post", "put", "head", "delete", "trace", "connect"].forEach((method) => {
    request[method] = (api, data, loading) => baseRequest(api, method, data, loading);
  });
  const debounce = (fn, delay) => {
    let timer = null;
    return function(i) {
      let context2 = this;
      let args = arguments;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context2, args);
      }, delay);
    };
  };
  const throttle = (fn, delay) => {
    let timer = null;
    return function(i) {
      let context2 = this;
      let args = arguments;
      if (!timer) {
        timer = setTimeout(function() {
          fn.apply(context2, args);
          timer = null;
        }, delay);
      }
    };
  };
  const loding = (str) => {
    formatAppLog("log", "at util/index.js:53", str);
  };
  const addStorage = (obj) => {
    let res = uni.getStorageSync(StorageName) || [];
    let user2 = Store.state.user.user || {};
    let bool = true;
    res = res.map((item) => {
      if (item.id == user2.id) {
        bool = false;
        return { ...Store.state.user.user, from: obj, Isloding: true };
      }
      item.Isloding = false;
      return item;
    });
    if (bool) {
      res.push({ ...Store.state.user.user, from: obj, Isloding: true });
    }
    uni.setStorageSync(StorageName, res);
  };
  const getStoage = () => {
    return uni.getStorageSync(StorageName);
  };
  const IsLogin = () => {
    return Store.state.user.user.userRole == ACCESS_ENUM.USER;
  };
  const zdongdl = async () => {
    if (IsLogin()) {
      return;
    }
    let res = getStoage();
    for (let i = 0; i < res.length; i++) {
      if (res[i].Isloding) {
        let req = await login({ ...res[i].from });
        if (req.data) {
          await Store.dispatch("increment");
        } else {
          loding("用户信息失效");
        }
      }
    }
  };
  const formatTime = (inputTime) => {
    const now = /* @__PURE__ */ new Date();
    const input = new Date(inputTime);
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();
    const inputYear = input.getFullYear();
    const inputMonth = input.getMonth();
    const inputDate = input.getDate();
    function padZero(num) {
      return num < 10 ? "0" + num : num;
    }
    if (inputYear === nowYear && inputMonth === nowMonth && inputDate === nowDate) {
      const hours = padZero(input.getHours());
      const minutes = padZero(input.getMinutes());
      return `${hours}:${minutes}`;
    } else if (inputYear === nowYear) {
      const month = padZero(input.getMonth() + 1);
      const date = padZero(input.getDate());
      const hours = padZero(input.getHours());
      const minutes = padZero(input.getMinutes());
      return `${month}-${date} ${hours}:${minutes}`;
    } else {
      const year = inputYear;
      const month = padZero(input.getMonth() + 1);
      const date = padZero(input.getDate());
      const hours = padZero(input.getHours());
      const minutes = padZero(input.getMinutes());
      return `${year}-${month}-${date} ${hours}:${minutes}`;
    }
  };
  const login = (obj) => request.post("/user/login", obj);
  const current = () => request.get("/user/current");
  const getCurresUser = () => request.get("/user/current", {});
  const lntuserList = (obj) => request.post("/user/userList", obj);
  const recommendList = (obj) => request.get(`/user/recommend?pageNum=${obj.page}&pageSize=${obj.pageSize}`);
  const user = {
    state: () => ({
      user: {
        "userName": "未登录",
        "userRole": "notLogin"
      }
    }),
    mutations: {
      // @ts-ignore
      increment(state, user2) {
        state.user = user2;
      }
    },
    actions: {
      // @ts-ignore
      async increment(context2) {
        const loginuser = await current();
        if (loginuser.code == 0 && loginuser.data != null) {
          context2.commit("increment", { ...loginuser.data, "userRole": ACCESS_ENUM.USER });
        } else {
          context2.commit("increment", {
            "userName": "未登录",
            "userRole": ACCESS_ENUM.NO_LOGIN
          });
        }
      }
    }
  };
  const Store = createStore({
    modules: {
      user
    }
  });
  vue.ref([]);
  const listarr = vue.ref([]);
  let SocketTask = null;
  const websocke = () => {
    if (SocketTask) {
      SocketTask.close();
    }
    if (IsLogin()) {
      SocketTask = uni.connectSocket({
        url: `ws://192.168.14.1:8080/api/websocket/${Store.state.user.user.id}`,
        // WebSocket 地址
        success: () => {
          formatAppLog("log", "at util/websocke.js:43", "WebSocket 连接创建成功");
        },
        fail: (err) => {
          formatAppLog("error", "at util/websocke.js:46", "WebSocket 连接创建失败", err);
        }
      });
      SocketTask.onError((err) => {
        formatAppLog("error", "at util/websocke.js:55", "WebSocket 错误", err);
      });
      SocketTask.onClose(() => {
        formatAppLog("log", "at util/websocke.js:63", "WebSocket 已关闭");
      });
      SocketTask.onMessage((res) => {
        formatAppLog("log", "at util/websocke.js:69", res.data);
        let resd = JSON.parse(`${res.data}`);
        if (resd.type == 1) {
          listarr.value = resd.data;
        }
        if (resd.type == 2) {
          for (let i = 0; i < listarr.value.length; i++) {
            if (listarr.value[i].id == resd.data.id) {
              listarr.value[i].login = resd.data.login;
            }
          }
        }
        if (resd.type == 3) {
          for (let i = 0; i < listarr.value.length; i++) {
            if (listarr.value[i].id == resd.data.userid || listarr.value[i].id == resd.data.sendid) {
              formatAppLog("log", "at util/websocke.js:127", typeof listarr.value[i].sendList, listarr.value[i].sendList);
              listarr.value[i].sendList.push(resd.data);
            }
          }
        }
        if (resd.type == 4) {
          listarr.value.push(resd.data);
        }
      });
      formatAppLog("log", "at util/websocke.js:163", "连接了");
    }
  };
  const send = (obj) => {
    SocketTask.send({
      data: obj,
      success: () => {
        formatAppLog("log", "at util/websocke.js:176", "发送成功");
      },
      fail: (err) => {
        formatAppLog("error", "at util/websocke.js:179", "发送失败", err);
      }
    });
  };
  const _sfc_main$f = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const sotre = useStore();
      vue.onMounted(() => {
        formatAppLog("log", "at pages/Userlist/index.vue:60", listarr.value);
      });
      const __returned__ = { sotre, UserListVue, get listarr() {
        return listarr;
      }, get useStore() {
        return useStore;
      }, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_search = resolveEasycom(vue.resolveDynamicComponent("wd-search"), __easycom_0$2);
    const _component_wd_img = resolveEasycom(vue.resolveDynamicComponent("wd-img"), __easycom_0$4);
    const _component_wd_navbar = resolveEasycom(vue.resolveDynamicComponent("wd-navbar"), __easycom_1$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_wd_navbar, { class: "nav" }, {
          left: vue.withCtx(() => [
            vue.createElementVNode(
              "view",
              { style: { "font-size": ".7em", "display": "flex", "justify-content": "center", "align-items": "center", "margin-top": ".8em" } },
              vue.toDisplayString($setup.sotre.state.user.user.username),
              1
              /* TEXT */
            )
          ]),
          title: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.createVNode(_component_wd_search, {
                modelValue: _ctx.keyword,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.keyword = $event),
                "hide-cancel": "",
                "placeholder-left": ""
              }, null, 8, ["modelValue"])
            ])
          ]),
          right: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "page-right" }, [
              vue.createVNode(_component_wd_img, {
                class: "img",
                round: "",
                "enable-preview": true,
                src: $setup.sotre.state.user.user.avatarUrl
              }, null, 8, ["src"])
            ])
          ]),
          _: 1
          /* STABLE */
        }),
        vue.createElementVNode("view", { class: "page-title" }, " 消息 "),
        vue.createElementVNode("scroll-view", {
          class: "srcollview",
          "scroll-y": "true",
          "refresher-enabled": "true",
          "refresher-triggered": _ctx.triggered,
          "refresher-threshold": 100,
          "refresher-background": "lightgreen",
          onRefresherpulling: _cache[1] || (_cache[1] = (...args) => _ctx.onPulling && _ctx.onPulling(...args)),
          onRefresherrefresh: _cache[2] || (_cache[2] = (...args) => _ctx.onRefresh && _ctx.onRefresh(...args)),
          onRefresherrestore: _cache[3] || (_cache[3] = (...args) => _ctx.onRestore && _ctx.onRestore(...args)),
          onRefresherabort: _cache[4] || (_cache[4] = (...args) => _ctx.onAbort && _ctx.onAbort(...args))
        }, [
          vue.createElementVNode("view", { class: "cart" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.listarr, (i) => {
                return vue.openBlock(), vue.createBlock($setup["UserListVue"], {
                  key: i,
                  data: i
                }, null, 8, ["data"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ], 40, ["refresher-triggered"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesUserlistIndex = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-07b1d372"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Userlist/index.vue"]]);
  const _sfc_main$e = {
    __name: "Loginform",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabrigfun = () => {
        formatAppLog("log", "at pages/Login/Loginform.vue:14", "测试");
      };
      const __returned__ = { tabrigfun, NavbarVue, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "" }, [
      vue.createVNode($setup["NavbarVue"], {
        title: "测试",
        onFun: $setup.tabrigfun
      })
    ]);
  }
  const PagesLoginLoginform = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Login/Loginform.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$d = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-d31e1c47"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  function obj2strClass(obj) {
    let classess = "";
    for (let key in obj) {
      const val = obj[key];
      if (val) {
        classess += `${key} `;
      }
    }
    return classess;
  }
  function obj2strStyle(obj) {
    let style = "";
    for (let key in obj) {
      const val = obj[key];
      style += `${key}:${val};`;
    }
    return style;
  }
  const _sfc_main$c = {
    name: "uni-easyinput",
    emits: [
      "click",
      "iconClick",
      "update:modelValue",
      "input",
      "focus",
      "blur",
      "confirm",
      "clear",
      "eyes",
      "change",
      "keyboardheightchange"
    ],
    model: {
      prop: "modelValue",
      event: "update:modelValue"
    },
    options: {
      virtualHost: true
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      },
      formItem: {
        from: "uniFormItem",
        default: null
      }
    },
    props: {
      name: String,
      value: [Number, String],
      modelValue: [Number, String],
      type: {
        type: String,
        default: "text"
      },
      clearable: {
        type: Boolean,
        default: true
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: " "
      },
      placeholderStyle: String,
      focus: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      confirmType: {
        type: String,
        default: "done"
      },
      clearSize: {
        type: [Number, String],
        default: 24
      },
      inputBorder: {
        type: Boolean,
        default: true
      },
      prefixIcon: {
        type: String,
        default: ""
      },
      suffixIcon: {
        type: String,
        default: ""
      },
      trim: {
        type: [Boolean, String],
        default: false
      },
      cursorSpacing: {
        type: Number,
        default: 0
      },
      passwordIcon: {
        type: Boolean,
        default: true
      },
      adjustPosition: {
        type: Boolean,
        default: true
      },
      primaryColor: {
        type: String,
        default: "#2979ff"
      },
      styles: {
        type: Object,
        default() {
          return {
            color: "#333",
            backgroundColor: "#fff",
            disableColor: "#F7F6F6",
            borderColor: "#e5e5e5"
          };
        }
      },
      errorMessage: {
        type: [String, Boolean],
        default: ""
      }
    },
    data() {
      return {
        focused: false,
        val: "",
        showMsg: "",
        border: false,
        isFirstBorder: false,
        showClearIcon: false,
        showPassword: false,
        focusShow: false,
        localMsg: "",
        isEnter: false
        // 用于判断当前是否是使用回车操作
      };
    },
    computed: {
      // 输入框内是否有值
      isVal() {
        const val = this.val;
        if (val || val === 0) {
          return true;
        }
        return false;
      },
      msg() {
        return this.localMsg || this.errorMessage;
      },
      // 因为uniapp的input组件的maxlength组件必须要数值，这里转为数值，用户可以传入字符串数值
      inputMaxlength() {
        return Number(this.maxlength);
      },
      // 处理外层样式的style
      boxStyle() {
        return `color:${this.inputBorder && this.msg ? "#e43d33" : this.styles.color};`;
      },
      // input 内容的类和样式处理
      inputContentClass() {
        return obj2strClass({
          "is-input-border": this.inputBorder,
          "is-input-error-border": this.inputBorder && this.msg,
          "is-textarea": this.type === "textarea",
          "is-disabled": this.disabled,
          "is-focused": this.focusShow
        });
      },
      inputContentStyle() {
        const focusColor = this.focusShow ? this.primaryColor : this.styles.borderColor;
        const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
        return obj2strStyle({
          "border-color": borderColor || "#e5e5e5",
          "background-color": this.disabled ? this.styles.disableColor : this.styles.backgroundColor
        });
      },
      // input右侧样式
      inputStyle() {
        const paddingRight = this.type === "password" || this.clearable || this.prefixIcon ? "" : "10px";
        return obj2strStyle({
          "padding-right": paddingRight,
          "padding-left": this.prefixIcon ? "" : "10px"
        });
      }
    },
    watch: {
      value(newVal) {
        if (newVal === null) {
          this.val = "";
          return;
        }
        this.val = newVal;
      },
      modelValue(newVal) {
        if (newVal === null) {
          this.val = "";
          return;
        }
        this.val = newVal;
      },
      focus(newVal) {
        this.$nextTick(() => {
          this.focused = this.focus;
          this.focusShow = this.focus;
        });
      }
    },
    created() {
      this.init();
      if (this.form && this.formItem) {
        this.$watch("formItem.errMsg", (newVal) => {
          this.localMsg = newVal;
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.focused = this.focus;
        this.focusShow = this.focus;
      });
    },
    methods: {
      /**
       * 初始化变量值
       */
      init() {
        if (this.value || this.value === 0) {
          this.val = this.value;
        } else if (this.modelValue || this.modelValue === 0 || this.modelValue === "") {
          this.val = this.modelValue;
        } else {
          this.val = "";
        }
      },
      /**
       * 点击图标时触发
       * @param {Object} type
       */
      onClickIcon(type) {
        this.$emit("iconClick", type);
      },
      /**
       * 显示隐藏内容，密码框时生效
       */
      onEyes() {
        this.showPassword = !this.showPassword;
        this.$emit("eyes", this.showPassword);
      },
      /**
       * 输入时触发
       * @param {Object} event
       */
      onInput(event) {
        let value = event.detail.value;
        if (this.trim) {
          if (typeof this.trim === "boolean" && this.trim) {
            value = this.trimStr(value);
          }
          if (typeof this.trim === "string") {
            value = this.trimStr(value, this.trim);
          }
        }
        if (this.errMsg)
          this.errMsg = "";
        this.val = value;
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
      },
      /**
       * 外部调用方法
       * 获取焦点时触发
       * @param {Object} event
       */
      onFocus() {
        this.$nextTick(() => {
          this.focused = true;
        });
        this.$emit("focus", null);
      },
      _Focus(event) {
        this.focusShow = true;
        this.$emit("focus", event);
      },
      /**
       * 外部调用方法
       * 失去焦点时触发
       * @param {Object} event
       */
      onBlur() {
        this.focused = false;
        this.$emit("blur", null);
      },
      _Blur(event) {
        event.detail.value;
        this.focusShow = false;
        this.$emit("blur", event);
        if (this.isEnter === false) {
          this.$emit("change", this.val);
        }
        if (this.form && this.formItem) {
          const { validateTrigger } = this.form;
          if (validateTrigger === "blur") {
            this.formItem.onFieldChange();
          }
        }
      },
      /**
       * 按下键盘的发送键
       * @param {Object} e
       */
      onConfirm(e) {
        this.$emit("confirm", this.val);
        this.isEnter = true;
        this.$emit("change", this.val);
        this.$nextTick(() => {
          this.isEnter = false;
        });
      },
      /**
       * 清理内容
       * @param {Object} event
       */
      onClear(event) {
        this.val = "";
        this.$emit("input", "");
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      },
      /**
       * 键盘高度发生变化的时候触发此事件
       * 兼容性：微信小程序2.7.0+、App 3.1.0+
       * @param {Object} event
       */
      onkeyboardheightchange(event) {
        this.$emit("keyboardheightchange", event);
      },
      /**
       * 去除空格
       */
      trimStr(str, pos = "both") {
        if (pos === "both") {
          return str.trim();
        } else if (pos === "left") {
          return str.trimLeft();
        } else if (pos === "right") {
          return str.trimRight();
        } else if (pos === "start") {
          return str.trimStart();
        } else if (pos === "end") {
          return str.trimEnd();
        } else if (pos === "all") {
          return str.replace(/\s+/g, "");
        } else if (pos === "none") {
          return str;
        }
        return str;
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-easyinput", { "uni-easyinput-error": $options.msg }]),
        style: vue.normalizeStyle($options.boxStyle)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-easyinput__content", $options.inputContentClass]),
            style: vue.normalizeStyle($options.inputContentStyle)
          },
          [
            $props.prefixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
              key: 0,
              class: "content-clear-icon",
              type: $props.prefixIcon,
              color: "#c0c4cc",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.onClickIcon("prefix")),
              size: "22"
            }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "left", {}, void 0, true),
            $props.type === "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
              key: 1,
              class: vue.normalizeClass(["uni-easyinput__content-textarea", { "input-padding": $props.inputBorder }]),
              name: $props.name,
              value: $data.val,
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              disabled: $props.disabled,
              "placeholder-class": "uni-easyinput__placeholder-class",
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              autoHeight: $props.autoHeight,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
              onBlur: _cache[2] || (_cache[2] = (...args) => $options._Blur && $options._Blur(...args)),
              onFocus: _cache[3] || (_cache[3] = (...args) => $options._Focus && $options._Focus(...args)),
              onConfirm: _cache[4] || (_cache[4] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[5] || (_cache[5] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 42, ["name", "value", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "autoHeight", "cursor-spacing", "adjust-position"])) : (vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              type: $props.type === "password" ? "text" : $props.type,
              class: "uni-easyinput__content-input",
              style: vue.normalizeStyle($options.inputStyle),
              name: $props.name,
              value: $data.val,
              password: !$data.showPassword && $props.type === "password",
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              "placeholder-class": "uni-easyinput__placeholder-class",
              disabled: $props.disabled,
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              confirmType: $props.confirmType,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onFocus: _cache[6] || (_cache[6] = (...args) => $options._Focus && $options._Focus(...args)),
              onBlur: _cache[7] || (_cache[7] = (...args) => $options._Blur && $options._Blur(...args)),
              onInput: _cache[8] || (_cache[8] = (...args) => $options.onInput && $options.onInput(...args)),
              onConfirm: _cache[9] || (_cache[9] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[10] || (_cache[10] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 44, ["type", "name", "value", "password", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "confirmType", "cursor-spacing", "adjust-position"])),
            $props.type === "password" && $props.passwordIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 3 },
              [
                vue.createCommentVNode(" 开启密码时显示小眼睛 "),
                $options.isVal ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: $data.showPassword ? "eye-slash-filled" : "eye-filled",
                  size: 22,
                  color: $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onEyes
                }, null, 8, ["class", "type", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            $props.suffixIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 4 },
              [
                $props.suffixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: "content-clear-icon",
                  type: $props.suffixIcon,
                  color: "#c0c4cc",
                  onClick: _cache[11] || (_cache[11] = ($event) => $options.onClickIcon("suffix")),
                  size: "22"
                }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 5 },
              [
                $props.clearable && $options.isVal && !$props.disabled && $props.type !== "textarea" ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: "clear",
                  size: $props.clearSize,
                  color: $options.msg ? "#dd524d" : $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onClear
                }, null, 8, ["class", "size", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )),
            vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-09fd5285"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue"]]);
  const buttonProps = {
    ...baseProps,
    /**
     * 幽灵按钮
     */
    plain: makeBooleanProp(false),
    /**
     * 圆角按钮
     */
    round: makeBooleanProp(true),
    /**
     * 禁用按钮
     */
    disabled: makeBooleanProp(false),
    /**
     * 是否细边框
     */
    hairline: makeBooleanProp(false),
    /**
     * 块状按钮
     */
    block: makeBooleanProp(false),
    /**
     * 按钮类型，可选值：primary / success / info / warning / error / text / icon
     */
    type: makeStringProp("primary"),
    /**
     * 按钮尺寸，可选值：small / medium / large
     */
    size: makeStringProp("medium"),
    /**
     * 图标类名
     */
    icon: String,
    /**
     * 类名前缀，用于使用自定义图标，用法参考Icon组件
     */
    classPrefix: makeStringProp("wd-icon"),
    /**
     * 加载中按钮
     */
    loading: makeBooleanProp(false),
    /**
     * 加载图标颜色
     */
    loadingColor: String,
    /**
     * 开放能力
     */
    openType: String,
    /**
     * 指定是否阻止本节点的祖先节点出现点击态
     */
    hoverStopPropagation: Boolean,
    /**
     * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
     */
    lang: String,
    /**
     * 会话来源，open-type="contact"时有效
     */
    sessionFrom: String,
    /**
     * 会话内消息卡片标题，open-type="contact"时有效
     */
    sendMessageTitle: String,
    /**
     * 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
     */
    sendMessagePath: String,
    /**
     * 会话内消息卡片图片，open-type="contact"时有效
     */
    sendMessageImg: String,
    /**
     * 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
     */
    appParameter: String,
    /**
     * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效
     */
    showMessageCard: Boolean,
    /**
     * 按钮的唯一标识，可用于设置隐私同意授权按钮的id
     */
    buttonId: String,
    /**
     * 支付宝小程序，当 open-type 为 getAuthorize 时有效。
     * 可选值：'phoneNumber' | 'userInfo'
     */
    scope: String
  };
  const __default__$1 = {
    name: "wd-button",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: buttonProps,
    emits: [
      "click",
      "getuserinfo",
      "contact",
      "getphonenumber",
      "error",
      "launchapp",
      "opensetting",
      "chooseavatar",
      "agreeprivacyauthorization"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const loadingIcon = (color = "#4D80F0", reverse = true) => {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="a"><stop stop-color="${reverse ? color : "#fff"}" offset="0%" stop-opacity="0"/><stop stop-color="${reverse ? color : "#fff"}" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${reverse ? "#fff" : color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#a)" stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
      };
      const props = __props;
      const emit = __emit;
      const hoverStartTime = vue.ref(20);
      const hoverStayTime = vue.ref(70);
      const loadingIconSvg = vue.ref("");
      const loadingStyle = vue.computed(() => {
        return `background-image: url(${loadingIconSvg.value});`;
      });
      vue.watch(
        () => props.loading,
        () => {
          buildLoadingSvg();
        },
        { deep: true, immediate: true }
      );
      function handleClick(event) {
        if (!props.disabled && !props.loading) {
          emit("click", event);
        }
      }
      function handleGetAuthorize(event) {
        if (props.scope === "phoneNumber") {
          handleGetphonenumber(event);
        } else if (props.scope === "userInfo") {
          handleGetuserinfo(event);
        }
      }
      function handleGetuserinfo(event) {
        emit("getuserinfo", event.detail);
      }
      function handleConcat(event) {
        emit("contact", event.detail);
      }
      function handleGetphonenumber(event) {
        emit("getphonenumber", event.detail);
      }
      function handleError(event) {
        emit("error", event.detail);
      }
      function handleLaunchapp(event) {
        emit("launchapp", event.detail);
      }
      function handleOpensetting(event) {
        emit("opensetting", event.detail);
      }
      function handleChooseavatar(event) {
        emit("chooseavatar", event.detail);
      }
      function handleAgreePrivacyAuthorization(event) {
        emit("agreeprivacyauthorization", event.detail);
      }
      function buildLoadingSvg() {
        const { loadingColor, type, plain } = props;
        let color = loadingColor;
        if (!color) {
          switch (type) {
            case "primary":
              color = "#4D80F0";
              break;
            case "success":
              color = "#34d19d";
              break;
            case "info":
              color = "#333";
              break;
            case "warning":
              color = "#f0883a";
              break;
            case "error":
              color = "#fa4350";
              break;
            case "default":
              color = "#333";
              break;
          }
        }
        const svg = loadingIcon(color, !plain);
        loadingIconSvg.value = `"data:image/svg+xml;base64,${encode(svg)}"`;
      }
      const __returned__ = { loadingIcon, props, emit, hoverStartTime, hoverStayTime, loadingIconSvg, loadingStyle, handleClick, handleGetAuthorize, handleGetuserinfo, handleConcat, handleGetphonenumber, handleError, handleLaunchapp, handleOpensetting, handleChooseavatar, handleAgreePrivacyAuthorization, buildLoadingSvg, wdIcon: __easycom_0$5 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      id: _ctx.buttonId,
      "hover-class": `${_ctx.disabled || _ctx.loading ? "" : "wd-button--active"}`,
      style: vue.normalizeStyle(_ctx.customStyle),
      class: vue.normalizeClass([
        "wd-button",
        "is-" + _ctx.type,
        "is-" + _ctx.size,
        _ctx.round ? "is-round" : "",
        _ctx.hairline ? "is-hairline" : "",
        _ctx.plain ? "is-plain" : "",
        _ctx.disabled ? "is-disabled" : "",
        _ctx.block ? "is-block" : "",
        _ctx.loading ? "is-loading" : "",
        _ctx.customClass
      ]),
      "hover-start-time": $setup.hoverStartTime,
      "hover-stay-time": $setup.hoverStayTime,
      "open-type": _ctx.disabled || _ctx.loading ? void 0 : _ctx.openType,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      "send-message-img": _ctx.sendMessageImg,
      "app-parameter": _ctx.appParameter,
      "show-message-card": _ctx.showMessageCard,
      "session-from": _ctx.sessionFrom,
      lang: _ctx.lang,
      "hover-stop-propagation": _ctx.hoverStopPropagation,
      scope: _ctx.scope,
      onClick: $setup.handleClick,
      "on:getAuthorize": $setup.handleGetAuthorize,
      onGetuserinfo: $setup.handleGetuserinfo,
      onContact: $setup.handleConcat,
      onGetphonenumber: $setup.handleGetphonenumber,
      onError: $setup.handleError,
      onLaunchapp: $setup.handleLaunchapp,
      onOpensetting: $setup.handleOpensetting,
      onChooseavatar: $setup.handleChooseavatar,
      onAgreeprivacyauthorization: $setup.handleAgreePrivacyAuthorization
    }, [
      vue.createElementVNode("view", { class: "wd-button__content" }, [
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-button__loading"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "wd-button__loading-svg",
              style: vue.normalizeStyle($setup.loadingStyle)
            },
            null,
            4
            /* STYLE */
          )
        ])) : _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
          key: 1,
          "custom-class": "wd-button__icon",
          name: _ctx.icon,
          classPrefix: _ctx.classPrefix
        }, null, 8, ["name", "classPrefix"])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "wd-button__text" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ])
    ], 46, ["id", "hover-class", "hover-start-time", "hover-stay-time", "open-type", "send-message-title", "send-message-path", "send-message-img", "app-parameter", "show-message-card", "session-from", "lang", "hover-stop-propagation", "scope"]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-d858c170"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-button/wd-button.vue"]]);
  const _sfc_main$a = {
    __name: "LoginEmail",
    setup(__props, { expose: __expose }) {
      __expose();
      const store = useStore();
      const form = vue.ref({
        "userAccount": "",
        "userPassword": ""
      });
      const tabrigfun = () => {
      };
      const gohome = throttle(async () => {
        if (!form.value.userAccount && !form.value.userPassword) {
          return loding("输入为空");
        }
        let res = await login({ ...form.value });
        if (res.data) {
          await store.dispatch("increment");
          addStorage(form.value);
          uni.switchTab({
            url: "/pages/Homefriend/index"
          });
        } else {
          loding("密码错误");
        }
      }, 1e3);
      const __returned__ = { store, form, tabrigfun, gohome, NavbarVue, ref: vue.ref, get login() {
        return login;
      }, get getCurresUser() {
        return getCurresUser;
      }, get throttle() {
        return throttle;
      }, get debounce() {
        return debounce;
      }, get useStore() {
        return useStore;
      }, get addStorage() {
        return addStorage;
      }, get getStoage() {
        return getStoage;
      }, get loding() {
        return loding;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0);
    const _component_uni_section = vue.resolveComponent("uni-section");
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "" }, [
      vue.createVNode($setup["NavbarVue"], {
        title: "验证码登录",
        onFun: $setup.tabrigfun
      }),
      vue.createElementVNode("view", { class: "top" }, [
        vue.createElementVNode("h3", null, "密码登录"),
        vue.createVNode(_component_uni_section, {
          title: "自定义样式",
          subTitle: "使用 styles 属性 ,可以自定义输入框样式",
          type: "line",
          padding: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_easyinput, {
              style: { "margin-top": "1em" },
              modelValue: $setup.form.userAccount,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.userAccount = $event),
              styles: _ctx.styles,
              placeholderStyle: _ctx.placeholderStyle,
              placeholder: "请输入内容",
              onInput: _ctx.input
            }, null, 8, ["modelValue", "styles", "placeholderStyle", "onInput"])
          ]),
          _: 1
          /* STABLE */
        }),
        vue.createVNode(_component_uni_section, {
          title: "密码框",
          subTitle: "指定属性 type=password 使用密码框,右侧会显示眼睛图标",
          type: "line",
          padding: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_easyinput, {
              style: { "margin-top": "1em" },
              type: "password",
              modelValue: $setup.form.userPassword,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.userPassword = $event),
              placeholder: "请输入密码"
            }, null, 8, ["modelValue"])
          ]),
          _: 1
          /* STABLE */
        }),
        vue.createVNode(_component_wd_button, {
          style: { "margin-top": "1em" },
          type: "success",
          plain: "",
          block: "",
          hairline: "",
          onClick: $setup.gohome
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(" 登录")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"]),
        vue.createTextVNode(
          " " + vue.toDisplayString($setup.store.state.user.user),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PagesLoginLoginEmail = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-1af4d65a"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Login/LoginEmail.vue"]]);
  const _sfc_main$9 = {
    __name: "Scrview",
    emits: ["srctop", "srcbut"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const triggered = vue.ref(false);
      const bom = vue.ref(false);
      const emit = __emit;
      const Isbut = vue.ref(false);
      const onRefresh = () => {
        triggered.value = true;
        emit("srctop", () => {
          triggered.value = false;
          Isbut.value = false;
        });
      };
      const onPulling = () => {
        formatAppLog("log", "at components/Scrview.vue:49", "拉取");
      };
      const scrbotm = () => {
        if (Isbut.value) {
          formatAppLog("log", "at components/Scrview.vue:56", "加载数据了完毕了...");
          return;
        }
        bom.value = true;
        emit("srcbut", (bool) => {
          bom.value = false;
          Isbut.value = bool || false;
          formatAppLog("log", "at components/Scrview.vue:64", "fuzuj", bool);
        });
      };
      const __returned__ = { triggered, bom, emit, Isbut, onRefresh, onPulling, scrbotm, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      class: "srcollview",
      "scroll-y": "true",
      "refresher-enabled": "true",
      "refresher-triggered": $setup.triggered,
      "refresher-threshold": 50,
      "refresher-background": "#00ced1",
      onRefresherpulling: $setup.onPulling,
      onRefresherrefresh: $setup.onRefresh,
      onScrolltolower: $setup.scrbotm
    }, [
      vue.createElementVNode("view", { class: "cart" }, [
        $setup.triggered ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "refresh-text"
        }, " 数据刷新中 ")) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        $setup.bom ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "load-text"
        }, " 数据加载中 ")) : vue.createCommentVNode("v-if", true),
        $setup.Isbut ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "text"
        }, " 数据加载完成 ")) : vue.createCommentVNode("v-if", true)
      ])
    ], 40, ["refresher-triggered"]);
  }
  const ScrviewVue = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-6987a492"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/components/Scrview.vue"]]);
  const _sfc_main$8 = {
    __name: "Cart",
    props: ["data"],
    setup(__props, { expose: __expose }) {
      __expose();
      const IsAdd = vue.ref(false);
      const store = useStore();
      const pops = __props;
      const gosach = async (e) => {
        if (e == 1) {
          uni.navigateTo({
            url: "/pages/Homefriend/UserHome"
          });
        } else {
          if (IsAdd.value) {
            uni.navigateTo({
              url: `/pages/Chat/index?sendId=${pops.data.id}`
            });
          } else {
            send(JSON.stringify({
              "id": store.state.user.user.id,
              "type": 4,
              "sendid": pops.data.id,
              "sendteam": null,
              "context": "你好啊，我们开始聊天把-.-",
              "sendTime": /* @__PURE__ */ new Date()
            }));
            IsAdd.value = true;
            setTimeout(() => {
              gosach();
            }, 500);
          }
        }
      };
      vue.onMounted(() => {
        setTimeout(() => {
          listarr.value.map((item) => {
            if (item.id == pops.data.id) {
              IsAdd.value = true;
            }
          });
        }, 500);
      });
      const __returned__ = { IsAdd, store, pops, gosach, onMounted: vue.onMounted, ref: vue.ref, get send() {
        return send;
      }, get useStore() {
        return useStore;
      }, get listarr() {
        return listarr;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "carts" }, [
      vue.createElementVNode("view", {
        class: "cart-left",
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.gosach(1))
      }, [
        vue.createElementVNode("image", {
          src: $setup.pops.data.avatarUrl,
          mode: ""
        }, null, 8, ["src"]),
        $setup.pops.data.login == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "aft"
        })) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", { class: "cart-right" }, [
        vue.createElementVNode("view", { class: "cart-right-top" }, [
          vue.createElementVNode(
            "text",
            { class: "cart-right-top-title" },
            vue.toDisplayString($setup.pops.data.username),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass($setup.IsAdd ? "cart-right-top-but2" : "cart-right-top-but"),
              onClick: $setup.gosach
            },
            vue.toDisplayString(!$setup.IsAdd ? "打招呼" : "发消息"),
            3
            /* TEXT, CLASS */
          )
        ]),
        vue.createElementVNode("view", {
          class: "cart-right-center",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.gosach(1))
        }, [
          vue.createElementVNode("text", null, [
            $setup.pops.data.gender == 0 ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
              key: 0,
              class: "icon",
              color: "#FF69B4",
              name: "gender-female"
            })) : (vue.openBlock(), vue.createBlock(_component_wd_icon, {
              key: 1,
              class: "icon",
              color: "#0074D9",
              name: "gender-male"
            })),
            vue.createTextVNode(
              " " + vue.toDisplayString($setup.pops.data.age) + "岁",
              1
              /* TEXT */
            )
          ]),
          vue.createTextVNode(" · "),
          vue.createElementVNode("text", null, "宜春市（1km）")
        ]),
        vue.createElementVNode("view", {
          class: "cart-right-bottom",
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.gosach(1))
        }, [
          vue.createElementVNode(
            "view",
            { class: "desc" },
            vue.toDisplayString($setup.pops.data.introductory),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const CartVue$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-517896f9"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Homefriend/util/Cart.vue"]]);
  const _sfc_main$7 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const store = useStore();
      const tab = vue.ref(0);
      const wdtabs = vue.ref([
        { id: 1, title: "兴趣" },
        { id: 2, title: "距离" }
      ]);
      const lntdata = vue.ref([]);
      const page1 = vue.ref({
        "page": 1,
        "pageSize": 10
      });
      const jlcount = vue.ref(0);
      const aidata = vue.ref([]);
      const page2 = vue.ref({
        "lat": store.state.user.user.lat,
        "lng": store.state.user.user.lng,
        "page": 1,
        "pageSize": 10
      });
      const aihcount = vue.ref(0);
      const setdata0 = async () => {
        let res = await recommendList({
          "page": 1,
          "pageSize": 10
        });
        formatAppLog("log", "at pages/Homefriend/index.vue:89", "0", res);
        if (res.code == 0) {
          aidata.value = res.data.records;
          aihcount.value = res.data.total;
        } else {
          return;
        }
      };
      const setdata = async () => {
        let res = await lntuserList({
          "lat": store.state.user.user.lat,
          "lng": store.state.user.user.lng,
          "page": 1,
          "pageSize": 10
        });
        formatAppLog("log", "at pages/Homefriend/index.vue:122", "1", res);
        if (res.code == 0) {
          lntdata.value = res.data.userVOS;
          jlcount.value = res.data.count;
        } else {
          return;
        }
      };
      const setTabid = (e) => {
        tab.value = e.detail.current;
      };
      const initaidata = async () => {
        page1.value.page = 1;
        await setdata0();
      };
      const addaidata = async () => {
        let res = await recommendList({
          "page": page1.value.page + 1,
          "pageSize": page1.value.pageSize
        });
        if (res.code == 0) {
          aidata.value = [...aidata.value, ...res.data.records];
          page1.value.page = page1.value.page + 1;
        }
        if (aihcount.value <= page1.value.page * page1.value.pageSize) {
          return true;
        }
        return false;
      };
      const srctop = throttle(async (fun) => {
        await new Promise(async (res, rje) => {
          await initaidata();
          res();
        });
        fun();
      }, 1e3);
      const srcbut = throttle(
        async (fun) => {
          let resd = false;
          await new Promise(async (res, rje) => {
            resd = await addaidata();
            res("");
          });
          fun(resd);
        },
        1e3
      );
      const initaidata1 = async () => {
        page2.value.page = 1;
        await setdata0();
      };
      const addaidata1 = async () => {
        let res = await lntuserList({
          "lat": store.state.user.user.lat,
          "lng": store.state.user.user.lng,
          "page": page2.value.page + 1,
          "pageSize": page2.value.pageSize
        });
        if (res.code == 0) {
          formatAppLog("log", "at pages/Homefriend/index.vue:244", res);
          lntdata.value = [...lntdata.value, ...res.data.userVOS];
          page2.value.page = page2.value.page + 1;
        }
        if (jlcount.value <= page2.value.page * page2.value.pageSize) {
          return true;
        }
        return false;
      };
      const srctop1 = throttle(async (fun) => {
        await new Promise(async (res, rje) => {
          await initaidata1();
          res();
        });
        fun();
      }, 1e3);
      const srcbut1 = throttle(async (fun) => {
        let resd = false;
        await new Promise(async (res, rje) => {
          resd = await addaidata1();
          res("");
        });
        fun(resd);
      }, 1e3);
      vue.onMounted(() => {
        setdata();
        setdata0();
      });
      const __returned__ = { store, tab, wdtabs, lntdata, page1, jlcount, aidata, page2, aihcount, setdata0, setdata, setTabid, initaidata, addaidata, srctop, srcbut, initaidata1, addaidata1, srctop1, srcbut1, NavbarVue, ScrviewVue, onMounted: vue.onMounted, ref: vue.ref, CartVue: CartVue$1, get useStore() {
        return useStore;
      }, get lntuserList() {
        return lntuserList;
      }, get recommendList() {
        return recommendList;
      }, get throttle() {
        return throttle;
      }, get debounce() {
        return debounce;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_tab = resolveEasycom(vue.resolveDynamicComponent("wd-tab"), __easycom_2);
    const _component_wd_tabs = resolveEasycom(vue.resolveDynamicComponent("wd-tabs"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode($setup["NavbarVue"], {
        lefttitle: "主页",
        title: "删选",
        Isleft: true,
        onFun: _cache[1] || (_cache[1] = ($event) => $setup.setTabid())
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", {
            class: "top",
            style: { "width": "100%", "background": "white" }
          }, [
            vue.createVNode(_component_wd_tabs, {
              modelValue: $setup.tab,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.tab = $event),
              style: { "width": "50%" }
            }, {
              default: vue.withCtx(() => [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.wdtabs, (item) => {
                    return vue.openBlock(), vue.createBlock(_component_wd_tab, {
                      key: item,
                      title: `${item.title}`
                    }, null, 8, ["title"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createElementVNode("swiper", {
        "indicator-dots": false,
        duration: 300,
        class: "nr",
        current: $setup.tab,
        onChange: $setup.setTabid
      }, [
        vue.createElementVNode("swiper-item", null, [
          vue.createVNode($setup["ScrviewVue"], {
            onSrctop: $setup.srctop,
            onSrcbut: $setup.srcbut
          }, {
            default: vue.withCtx(() => [
              vue.createCommentVNode(" 卡槽 "),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.aidata, (i) => {
                  return vue.openBlock(), vue.createBlock($setup["CartVue"], {
                    key: i.id,
                    data: i
                  }, null, 8, ["data"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          }, 8, ["onSrctop", "onSrcbut"])
        ]),
        vue.createElementVNode("swiper-item", null, [
          vue.createVNode($setup["ScrviewVue"], {
            onSrctop: $setup.srctop1,
            onSrcbut: $setup.srcbut1
          }, {
            default: vue.withCtx(() => [
              vue.createCommentVNode(" 卡槽 "),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.lntdata, (i) => {
                  return vue.openBlock(), vue.createBlock($setup["CartVue"], {
                    key: i.id,
                    data: i
                  }, null, 8, ["data"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          }, 8, ["onSrctop", "onSrcbut"])
        ])
      ], 40, ["current"])
    ]);
  }
  const PagesHomefriendIndex = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-9eea4fc3"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Homefriend/index.vue"]]);
  const _sfc_main$6 = {
    __name: "cart",
    props: {
      title: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      userAvatars: {
        type: Array,
        default: () => []
      },
      onlineCount: {
        type: Number,
        default: 0
      }
    },
    emits: ["join"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const randomGradient = vue.computed(() => {
        const colors = [
          "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
          "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
          "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
          "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      });
      const handleJoin = () => {
        emit("join", props.title);
      };
      const __returned__ = { props, emit, randomGradient, handleJoin, computed: vue.computed, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "chat-group-card",
        style: vue.normalizeStyle({ background: $setup.randomGradient })
      },
      [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode(
            "text",
            { class: "card-title" },
            vue.toDisplayString($props.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "online-count" },
            "在线人数: " + vue.toDisplayString($props.onlineCount),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card-description" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.description),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "avatars-and-button" }, [
          vue.createElementVNode("view", { class: "user-avatars" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.userAvatars.slice(0, 3), (avatar, index) => {
                return vue.openBlock(), vue.createElementBlock("image", {
                  key: index,
                  src: avatar,
                  class: "avatar"
                }, null, 8, ["src"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", {
            class: "join-button",
            onClick: $setup.handleJoin
          }, "加入")
        ])
      ],
      4
      /* STYLE */
    );
  }
  const CartVue = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-d614009e"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Group/components/cart.vue"]]);
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const chatGroups = vue.ref([
        {
          title: "聊天群1",
          description: "这是第一个聊天群的描述",
          userAvatars: ["https://example.com/avatar1.jpg", "https://example.com/avatar2.jpg", "https://example.com/avatar3.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        },
        {
          title: "聊天群2",
          description: "这是第二个聊天群的描述",
          userAvatars: ["https://example.com/avatar4.jpg", "https://example.com/avatar5.jpg", "https://example.com/avatar6.jpg"]
        }
        // 可以添加更多聊天群数据
      ]);
      const srctop = async (fun) => {
        await new Promise((res, rje) => {
          setTimeout(() => {
            alert("测试");
            res("as");
          }, 1e3);
        });
        fun();
      };
      const srcbut = async (fun) => {
        await new Promise((res, rje) => {
          setTimeout(() => {
            alert("测试");
          }, 1e3);
        });
        fun();
      };
      const tab = vue.ref(0);
      const wdtabs = vue.ref([
        { id: 1, title: "兴趣" },
        { id: 2, title: "距离" }
      ]);
      const setTabid = (e) => {
        tab.value = e.detail.current;
      };
      const __returned__ = { chatGroups, srctop, srcbut, tab, wdtabs, setTabid, NavbarVue, ScrviewVue, CartVue, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_tab = resolveEasycom(vue.resolveDynamicComponent("wd-tab"), __easycom_2);
    const _component_wd_tabs = resolveEasycom(vue.resolveDynamicComponent("wd-tabs"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode($setup["NavbarVue"], {
          lefttitle: "趣味群",
          title: "删选",
          Isleft: true,
          onFun: _cache[0] || (_cache[0] = ($event) => $setup.setTabid())
        }),
        vue.createVNode(_component_wd_tabs, {
          modelValue: $setup.tab,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.tab = $event),
          swipeable: "",
          animated: ""
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.wdtabs, (item) => {
                return vue.openBlock(), vue.createBlock(_component_wd_tab, {
                  key: item.id,
                  title: item.title
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "content" }, [
                      vue.createVNode($setup["ScrviewVue"], {
                        onSrctop: $setup.srctop,
                        onSrcbut: $setup.srcbut
                      }, {
                        default: vue.withCtx(() => [
                          vue.createCommentVNode(" 卡槽 "),
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList($setup.chatGroups, (group, index) => {
                              return vue.openBlock(), vue.createBlock($setup["CartVue"], {
                                key: index,
                                title: group.title,
                                description: group.description,
                                userAvatars: group.userAvatars
                              }, null, 8, ["title", "description", "userAvatars"]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["title"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesGroupIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-c0f49048"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Group/index.vue"]]);
  const _sfc_main$4 = {};
  function _sfc_render$3(_ctx, _cache) {
    return null;
  }
  const PagesDynamicIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Dynamic/index.vue"]]);
  const _sfc_main$3 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const tags = vue.ref(["标签1", "标签2", "标签3"]);
      const description = vue.ref("这是一段个人简介，可以在这里修改。");
      const tab = vue.ref(0);
      const wdtabs = vue.ref([
        { id: 1, title: "动态" },
        { id: 2, title: "相册" }
      ]);
      const addTag = () => {
        formatAppLog("log", "at pages/Mine/index.vue:64", "点击添加标签");
      };
      const modifyDescription = () => {
        formatAppLog("log", "at pages/Mine/index.vue:69", "点击修改简介");
        uni.navigateTo({
          url: "/pages/Login/LoginEmail"
        });
      };
      const setTabid = (e) => {
        tab.value = e.detail.current;
      };
      const __returned__ = { tags, description, tab, wdtabs, addTag, modifyDescription, setTabid, ref: vue.ref, NavbarVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_img = resolveEasycom(vue.resolveDynamicComponent("wd-img"), __easycom_0$4);
    const _component_wd_tag = resolveEasycom(vue.resolveDynamicComponent("wd-tag"), __easycom_2$1);
    const _component_wd_tab = resolveEasycom(vue.resolveDynamicComponent("wd-tab"), __easycom_2);
    const _component_wd_tabs = resolveEasycom(vue.resolveDynamicComponent("wd-tabs"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode($setup["NavbarVue"], {
          lefttitle: "我的",
          title: "删选",
          Isleft: true,
          onFun: _cache[0] || (_cache[0] = ($event) => $setup.setTabid())
        }),
        vue.createElementVNode("view", { class: "page" }, [
          vue.createCommentVNode(" 前三层卡片 "),
          vue.createElementVNode("view", { class: "info-card" }, [
            vue.createCommentVNode(" 第一层：头像、名称、年龄 "),
            vue.createElementVNode("view", { class: "first-layer" }, [
              vue.createVNode(_component_wd_img, {
                width: 100,
                height: 100,
                round: "",
                "enable-preview": true,
                src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain"
              }),
              vue.createElementVNode("view", { class: "name-age" }, [
                vue.createElementVNode("text", { class: "name" }, "呆呆小萌兽"),
                vue.createElementVNode("text", { class: "age" }, "20")
              ])
            ]),
            vue.createCommentVNode(" 第二层：标签和添加标签 "),
            vue.createElementVNode("view", { class: "second-layer" }, [
              vue.createElementVNode("view", { class: "tags" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.tags, (tag, index) => {
                    return vue.openBlock(), vue.createBlock(
                      _component_wd_tag,
                      {
                        "custom-class": "space",
                        type: "warning",
                        key: index
                      },
                      {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(
                            vue.toDisplayString(tag),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 2
                        /* DYNAMIC */
                      },
                      1024
                      /* DYNAMIC_SLOTS */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("button", {
                class: "add-tag-btn",
                onClick: $setup.addTag
              }, "添加标签")
            ]),
            vue.createCommentVNode(" 第三层：简介和修改按钮 "),
            vue.createElementVNode("view", { class: "third-layer" }, [
              vue.createElementVNode(
                "text",
                { class: "description" },
                vue.toDisplayString($setup.description),
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                class: "modify-btn",
                onClick: $setup.modifyDescription
              }, "修改")
            ])
          ]),
          vue.createCommentVNode(" 动态和相册标签栏切换 "),
          vue.createElementVNode("view", { class: "top" }, [
            vue.createVNode(_component_wd_tabs, {
              modelValue: $setup.tab,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.tab = $event),
              style: { "width": "50%" }
            }, {
              default: vue.withCtx(() => [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.wdtabs, (item) => {
                    return vue.openBlock(), vue.createBlock(_component_wd_tab, {
                      key: item.id,
                      title: item.title
                    }, null, 8, ["title"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ]),
          vue.createElementVNode("swiper", {
            "indicator-dots": false,
            duration: 300,
            class: "nr",
            current: $setup.tab,
            onChange: $setup.setTabid
          }, [
            vue.createElementVNode("swiper-item"),
            vue.createElementVNode("swiper-item")
          ], 40, ["current"])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMineIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-63155f31"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Mine/index.vue"]]);
  const CELL_GROUP_KEY = Symbol("wd-cell-group");
  ({
    ...baseProps,
    /**
     * 分组标题
     */
    title: String,
    /**
     * 分组右侧内容
     */
    value: String,
    /**
     * 分组启用插槽
     */
    useSlot: makeBooleanProp(false),
    /**
     * 是否展示边框线
     */
    border: makeBooleanProp(false)
  });
  function useCell() {
    const { parent: cellGroup, index } = useParent(CELL_GROUP_KEY);
    const border = vue.computed(() => {
      return cellGroup && cellGroup.props.border && index.value;
    });
    return { border };
  }
  const FORM_KEY = Symbol("wd-form");
  ({
    ...baseProps,
    /**
     * 表单数据对象
     */
    model: makeRequiredProp(Object),
    /**
     * 表单验证规则
     */
    rules: {
      type: Object,
      default: () => ({})
    },
    /**
     * 是否在输入时重置表单校验信息
     */
    resetOnChange: makeBooleanProp(true),
    /**
     * 错误提示类型
     */
    errorType: {
      type: String,
      default: "message"
    }
  });
  const textareaProps = {
    ...baseProps,
    /**
     * * 自定义文本域容器class名称。
     * 类型：string
     */
    customTextareaContainerClass: makeStringProp(""),
    /**
     * * 自定义文本域class名称。
     * 类型：string
     */
    customTextareaClass: makeStringProp(""),
    /**
     * * 自定义标签class名称。
     * 类型：string
     */
    customLabelClass: makeStringProp(""),
    // 原生属性
    /**
     * * 绑定值。
     * 类型：string | number
     */
    modelValue: makeNumericProp(""),
    /**
     * * 占位文本。
     * 类型：string
     * 默认值：'请输入...'
     */
    placeholder: String,
    /**
     * 指定placeholder的样式。
     * 类型：string
     */
    placeholderStyle: String,
    /**
     * * 指定placeholder的样式类。
     * 类型：string
     * 默认值：空字符串
     */
    placeholderClass: makeStringProp(""),
    /**
     * * 禁用输入框。
     * 类型：boolean
     * 默认值：false
     */
    disabled: makeBooleanProp(false),
    /**
     * * 最大输入长度，设置为-1表示不限制最大长度。
     * 类型：number
     * 默认值：-1
     */
    maxlength: makeNumberProp(-1),
    /**
     * * 自动聚焦并拉起键盘。
     * 类型：boolean
     * 默认值：false
     */
    autoFocus: makeBooleanProp(false),
    /**
     * * 获取焦点。
     * 类型：boolean
     * 默认值：false
     */
    focus: makeBooleanProp(false),
    /**
     * * 是否自动增高输入框高度，style.height属性在auto-height生效时不生效。
     * 类型：boolean
     * 默认值：false
     */
    autoHeight: makeBooleanProp(false),
    /**
     * * 如果textarea处于position:fixed区域，需要设置此属性为true。
     * 类型：boolean
     * 默认值：false
     */
    fixed: makeBooleanProp(false),
    /**
     * * 指定光标与键盘的距离，取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为实际距离。
     * 类型：number
     * 默认值：0
     */
    cursorSpacing: makeNumberProp(0),
    /**
     * * 指定focus时的光标位置。
     * 类型：number
     * 默认值：-1
     */
    cursor: makeNumberProp(-1),
    /**
     * * 设置键盘右下角按钮的文字。
     * 类型：string
     * 默认值：'done'
     * 可选值有'done', 'go', 'next', 'search', 'send'
     */
    confirmType: String,
    /**
     * * 点击键盘右下角按钮时是否保持键盘不收起。
     * 类型：boolean
     * 默认值：false
     */
    confirmHold: makeBooleanProp(false),
    /**
     * * 是否显示键盘上方带有“完成”按钮那一栏。
     * 类型：boolean
     * 默认值：true
     */
    showConfirmBar: makeBooleanProp(true),
    /**
     * * 光标起始位置，自动聚集时有效，需与selection-end搭配使用。
     * 类型：number
     * 默认值：-1
     */
    selectionStart: makeNumberProp(-1),
    /**
     * * 光标结束位置，自动聚集时有效，需与selection-start搭配使用。
     * 类型：number
     * 默认值：-1
     */
    selectionEnd: makeNumberProp(-1),
    /**
     * * 键盘弹起时是否自动上推页面。
     * 类型：boolean
     * 默认值：true
     */
    adjustPosition: makeBooleanProp(true),
    /**
     * * 是否去掉iOS下的默认内边距。
     * 类型：boolean
     * 默认值：false
     */
    disableDefaultPadding: makeBooleanProp(false),
    /**
     * * focus状态下点击页面时是否不收起键盘。
     * 类型：boolean
     * 默认值：false
     */
    holdKeyboard: makeBooleanProp(false),
    // 非原生属性
    /**
     * * 显示为密码框。
     * 类型：boolean
     * 默认值：false
     */
    showPassword: makeBooleanProp(false),
    /**
     * * 是否显示清空按钮。
     * 类型：boolean
     * 默认值：false
     */
    clearable: makeBooleanProp(false),
    /**
     * * 输入框只读状态。
     * 类型：boolean
     * 默认值：false
     */
    readonly: makeBooleanProp(false),
    /**
     * * 前置图标，icon组件中的图标类名。
     * 类型：string
     */
    prefixIcon: String,
    /**
     * * 是否显示字数限制，需要同时设置maxlength。
     * 类型：boolean
     * 默认值：false
     */
    showWordLimit: makeBooleanProp(false),
    /**
     * 设置左侧标题。
     * 类型：string
     */
    label: String,
    /**
     * 设置左侧标题宽度。
     * 类型：string
     */
    labelWidth: makeStringProp(""),
    /**
     * * 设置输入框大小。
     * 类型：string
     */
    size: String,
    /**
     * * 设置输入框错误状态（红色）。
     * 类型：boolean
     * 默认值：false
     */
    error: makeBooleanProp(false),
    /**
     * * 当存在label属性时，设置标题和输入框垂直居中，默认为顶部居中。
     * 类型：boolean
     * 默认值：false
     */
    center: makeBooleanProp(false),
    /**
     * * 非cell类型下是否隐藏下划线。
     * 类型：boolean
     * 默认值：false
     */
    noBorder: makeBooleanProp(false),
    /**
     * * cell类型下必填样式。
     * 类型：boolean
     * 默认值：false
     */
    required: makeBooleanProp(false),
    /**
     * * 表单域model字段名，在使用表单校验功能的情况下，该属性是必填的。
     * 类型：string
     */
    prop: makeStringProp(""),
    /**
     * * 表单验证规则。
     * 类型：FormItemRule[]
     * 默认值：[]
     */
    rules: makeArrayProp(),
    /**
     * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
     * 类型: "focus" | "always"
     * 默认值: "always"
     */
    clearTrigger: makeStringProp("always"),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: true
     */
    focusWhenClear: makeBooleanProp(true),
    /**
     * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
     * 类型: boolean
     * 默认值: true
     */
    ignoreCompositionEvent: makeBooleanProp(true),
    /**
     * 它提供了用户在编辑元素或其内容时可能输入的数据类型的提示。在符合条件的高版本webview里，uni-app的web和app-vue平台中可使用本属性。
     * 类型: InputMode
     * 可选值: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | "password"
     * 默认值: "text"
     */
    inputmode: makeStringProp("text")
  };
  const __default__ = {
    name: "wd-textarea",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: textareaProps,
    emits: [
      "update:modelValue",
      "clear",
      "blur",
      "focus",
      "input",
      "keyboardheightchange",
      "confirm",
      "linechange",
      "clickprefixicon",
      "click"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const { translate } = useTranslate("textarea");
      const props = __props;
      const emit = __emit;
      const slots = vue.useSlots();
      const placeholderValue = vue.computed(() => {
        return isDef(props.placeholder) ? props.placeholder : translate("placeholder");
      });
      const clearing = vue.ref(false);
      const focused = vue.ref(false);
      const focusing = vue.ref(false);
      const inputValue = vue.ref("");
      const cell = useCell();
      vue.watch(
        () => props.focus,
        (newValue) => {
          focused.value = newValue;
        },
        { immediate: true, deep: true }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          inputValue.value = isDef(newValue) ? String(newValue) : "";
        },
        { immediate: true, deep: true }
      );
      const { parent: form } = useParent(FORM_KEY);
      const showClear = vue.computed(() => {
        const { disabled, readonly, clearable, clearTrigger } = props;
        if (clearable && !readonly && !disabled && inputValue.value && (clearTrigger === "always" || props.clearTrigger === "focus" && focusing.value)) {
          return true;
        } else {
          return false;
        }
      });
      const showWordCount = vue.computed(() => {
        const { disabled, readonly, maxlength, showWordLimit } = props;
        return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit);
      });
      const errorMessage = vue.computed(() => {
        if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
          return form.errorMessages[props.prop];
        } else {
          return "";
        }
      });
      const isRequired = vue.computed(() => {
        let formRequired = false;
        if (form && form.props.rules) {
          const rules = form.props.rules;
          for (const key in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
              formRequired = rules[key].some((rule) => rule.required);
            }
          }
        }
        return props.required || props.rules.some((rule) => rule.required) || formRequired;
      });
      const currentLength = vue.computed(() => {
        return Array.from(String(formatValue(props.modelValue) || "")).length;
      });
      const rootClass = vue.computed(() => {
        return `wd-textarea   ${props.label || slots.label ? "is-cell" : ""} ${props.center ? "is-center" : ""} ${cell.border.value ? "is-border" : ""} ${props.size ? "is-" + props.size : ""} ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""} ${props.autoHeight ? "is-auto-height" : ""} ${currentLength.value > 0 ? "is-not-empty" : ""}  ${props.noBorder ? "is-no-border" : ""} ${props.customClass}`;
      });
      const labelClass = vue.computed(() => {
        return `wd-textarea__label ${props.customLabelClass} ${isRequired.value ? "is-required" : ""}`;
      });
      const inputPlaceholderClass = vue.computed(() => {
        return `wd-textarea__placeholder  ${props.placeholderClass}`;
      });
      const countClass = vue.computed(() => {
        return `${currentLength.value > 0 ? "wd-textarea__count-current" : ""} ${currentLength.value > props.maxlength ? "is-error" : ""}`;
      });
      const labelStyle = vue.computed(() => {
        return props.labelWidth ? objToStyle({
          "min-width": props.labelWidth,
          "max-width": props.labelWidth
        }) : "";
      });
      vue.onBeforeMount(() => {
        initState();
      });
      function initState() {
        inputValue.value = formatValue(inputValue.value);
        emit("update:modelValue", inputValue.value);
      }
      function formatValue(value) {
        const { maxlength, showWordLimit } = props;
        if (showWordLimit && maxlength !== -1 && String(value).length > maxlength) {
          return value.toString().substring(0, maxlength);
        }
        return `${value}`;
      }
      async function handleClear() {
        clearing.value = true;
        focusing.value = false;
        inputValue.value = "";
        if (props.focusWhenClear) {
          focused.value = false;
        }
        await pause();
        if (props.focusWhenClear) {
          focused.value = true;
          focusing.value = true;
        }
        emit("update:modelValue", inputValue.value);
        emit("clear");
      }
      async function handleBlur({ detail }) {
        await pause(150);
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        focusing.value = false;
        emit("blur", {
          value: inputValue.value,
          cursor: detail.cursor ? detail.cursor : null
        });
      }
      function handleFocus({ detail }) {
        focusing.value = true;
        emit("focus", detail);
      }
      function handleInput({ detail }) {
        inputValue.value = formatValue(inputValue.value);
        emit("update:modelValue", inputValue.value);
        emit("input", detail);
      }
      function handleKeyboardheightchange({ detail }) {
        emit("keyboardheightchange", detail);
      }
      function handleConfirm({ detail }) {
        emit("confirm", detail);
      }
      function handleLineChange({ detail }) {
        emit("linechange", detail);
      }
      function onClickPrefixIcon() {
        emit("clickprefixicon");
      }
      const __returned__ = { translate, props, emit, slots, placeholderValue, clearing, focused, focusing, inputValue, cell, form, showClear, showWordCount, errorMessage, isRequired, currentLength, rootClass, labelClass, inputPlaceholderClass, countClass, labelStyle, initState, formatValue, handleClear, handleBlur, handleFocus, handleInput, handleKeyboardheightchange, handleConfirm, handleLineChange, onClickPrefixIcon, wdIcon: __easycom_0$5 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        _ctx.label || _ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass($setup.labelClass),
            style: vue.normalizeStyle($setup.labelStyle)
          },
          [
            _ctx.prefixIcon || _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "wd-textarea__prefix"
            }, [
              _ctx.prefixIcon && !_ctx.$slots.prefix ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-textarea__icon",
                name: _ctx.prefixIcon,
                onClick: $setup.onClickPrefixIcon
              }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "prefix", { key: 1 }, void 0, true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "wd-textarea__label-inner" }, [
              _ctx.label && !_ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
                "text",
                { key: 0 },
                vue.toDisplayString(_ctx.label),
                1
                /* TEXT */
              )) : vue.renderSlot(_ctx.$slots, "label", { key: 1 }, void 0, true)
            ])
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 文本域 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-textarea__value ${$setup.showClear ? "is-suffix" : ""} ${_ctx.customTextareaContainerClass} ${$setup.showWordCount ? "is-show-limit" : ""}`)
          },
          [
            vue.withDirectives(vue.createElementVNode("textarea", {
              class: vue.normalizeClass(`wd-textarea__inner ${_ctx.customTextareaClass}`),
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
              "show-count": false,
              placeholder: $setup.placeholderValue,
              disabled: _ctx.disabled || _ctx.readonly,
              maxlength: _ctx.maxlength,
              focus: $setup.focused,
              "auto-focus": _ctx.autoFocus,
              "placeholder-style": _ctx.placeholderStyle,
              "placeholder-class": $setup.inputPlaceholderClass,
              "auto-height": _ctx.autoHeight,
              "cursor-spacing": _ctx.cursorSpacing,
              fixed: _ctx.fixed,
              cursor: _ctx.cursor,
              "show-confirm-bar": _ctx.showConfirmBar,
              "selection-start": _ctx.selectionStart,
              "selection-end": _ctx.selectionEnd,
              "adjust-position": _ctx.adjustPosition,
              "hold-keyboard": _ctx.holdKeyboard,
              "confirm-type": _ctx.confirmType,
              "confirm-hold": _ctx.confirmHold,
              "disable-default-padding": _ctx.disableDefaultPadding,
              ignoreCompositionEvent: _ctx.ignoreCompositionEvent,
              inputmode: _ctx.inputmode,
              onInput: $setup.handleInput,
              onFocus: $setup.handleFocus,
              onBlur: $setup.handleBlur,
              onConfirm: $setup.handleConfirm,
              onLinechange: $setup.handleLineChange,
              onKeyboardheightchange: $setup.handleKeyboardheightchange
            }, null, 42, ["placeholder", "disabled", "maxlength", "focus", "auto-focus", "placeholder-style", "placeholder-class", "auto-height", "cursor-spacing", "fixed", "cursor", "show-confirm-bar", "selection-start", "selection-end", "adjust-position", "hold-keyboard", "confirm-type", "confirm-hold", "disable-default-padding", "ignoreCompositionEvent", "inputmode"]), [
              [vue.vModelText, $setup.inputValue]
            ]),
            $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "wd-textarea__error-message"
              },
              vue.toDisplayString($setup.errorMessage),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            $setup.props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-textarea__readonly-mask"
            })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "wd-textarea__suffix" }, [
              $setup.showClear ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-textarea__clear",
                name: "error-fill",
                onClick: $setup.handleClear
              })) : vue.createCommentVNode("v-if", true),
              $setup.showWordCount ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "wd-textarea__count"
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass($setup.countClass)
                  },
                  vue.toDisplayString($setup.currentLength),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createTextVNode(
                  " /" + vue.toDisplayString(_ctx.maxlength),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ],
          2
          /* CLASS */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-7d71e04e"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/uni_modules/wot-design-uni/components/wd-textarea/wd-textarea.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const childrenId = vue.ref();
      const xxList = vue.ref(null);
      const Isjiaz = vue.ref(false);
      vue.watch(listarr.value, () => {
        listarr.value.map((item) => {
          if (item.id == sendid.value) {
            data.value = item.sendList;
          }
        });
        setTimeout(() => {
          childrenId.value = `id${data.value.length - 1}`;
        }, 300);
      });
      const store = useStore();
      const data = vue.ref([]);
      const sendid = vue.ref();
      const tocart = vue.ref();
      const senform = vue.ref({
        "id": store.state.user.user.id,
        "type": 3,
        "sendid": null,
        "sendteam": null,
        "context": "",
        "sendTime": /* @__PURE__ */ new Date()
      });
      const tabrigfun = () => {
        formatAppLog("log", "at pages/Chat/index.vue:172", "测试");
      };
      const dosend = throttle((e) => {
        if (senform.value.context == "") {
          return "";
        }
        senform.value.context = JSON.stringify(senform.value.context).slice(1, -1);
        send(JSON.stringify(senform.value));
        senform.value.context = "";
      }, 500);
      const gohome = () => {
        uni.navigateTo({
          url: "/pages/Homefriend/index"
        });
      };
      function handleClickLeft() {
        uni.navigateBack();
      }
      vue.onMounted(() => {
        formatAppLog("log", "at pages/Chat/index.vue:211", "123");
      });
      onLoad((options) => {
        sendid.value = Number(options.sendId);
        senform.value.sendid = Number(options.sendId);
        listarr.value.map((item) => {
          if (item.id == Number(options.sendId)) {
            tocart.value = item;
            data.value = item.sendList;
          }
        });
        setTimeout(() => {
          childrenId.value = `id${data.value.length - 1}`;
          setTimeout(() => {
            Isjiaz.value = true;
          }, 500);
        }, 300);
      });
      const __returned__ = { childrenId, xxList, Isjiaz, store, data, sendid, tocart, senform, tabrigfun, dosend, gohome, handleClickLeft, get formatTime() {
        return formatTime;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$5);
    const _component_viwe = vue.resolveComponent("viwe");
    const _component_wd_navbar = resolveEasycom(vue.resolveDynamicComponent("wd-navbar"), __easycom_1$1);
    const _component_wd_tag = resolveEasycom(vue.resolveDynamicComponent("wd-tag"), __easycom_2$1);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "chart" }, [
      vue.createElementVNode("view", { class: "page" }, [
        vue.createElementVNode("view", { class: "top" }, [
          vue.createVNode(_component_wd_navbar, {
            "custom-style": "background: #FEF6DD;",
            fixed: "",
            placeholder: "",
            safeAreaInsetTop: "",
            "custom-class": "nav",
            "left-arrow": ""
          }, {
            left: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "search-box" }, [
                vue.createVNode(_component_wd_icon, {
                  onClick: $setup.handleClickLeft,
                  name: "thin-arrow-left",
                  style: { "margin": "auto .5em" },
                  size: "16px"
                }),
                vue.createElementVNode("view", { class: "name" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "" },
                    vue.toDisplayString($setup.tocart.username),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ]),
            title: vue.withCtx(() => [
              vue.createVNode(_component_viwe, { class: "tile" })
            ]),
            right: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "hex" }, [
                vue.createElementVNode("image", {
                  src: $setup.tocart.avatarUrl,
                  mode: ""
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "aft" })
              ])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createElementVNode("view", { class: "cartxx" }, [
            vue.createElementVNode("view", { class: "cartxx-top" }, [
              vue.createElementVNode("image", {
                src: $setup.tocart.avatarUrl,
                mode: ""
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.tocart.username),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode(
              "view",
              { class: "cartxx-cnter" },
              vue.toDisplayString($setup.tocart.introductory),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "cartxx-but" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.tocart.tags, (i) => {
                  return vue.openBlock(), vue.createBlock(
                    _component_wd_tag,
                    {
                      class: "tag",
                      color: "#966E6E",
                      "bg-color": "#F5F5F5",
                      mark: ""
                    },
                    {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString(i),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 2
                      /* DYNAMIC */
                    },
                    1024
                    /* DYNAMIC_SLOTS */
                  );
                }),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("scroll-view", {
            "show-scrollbar": false,
            "scroll-with-animation": $setup.Isjiaz,
            "scroll-y": true,
            "scroll-into-view": $setup.childrenId,
            class: "xx-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.data, (i, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  id: `id${index}`,
                  key: i.id
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "list-time" },
                    vue.toDisplayString($setup.formatTime(i.createtime)),
                    1
                    /* TEXT */
                  ),
                  Number(i.userid) == $setup.sendid ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "to"
                  }, [
                    vue.createElementVNode("image", {
                      src: $setup.tocart.avatarUrl,
                      mode: ""
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(i.context),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  Number(i.userid) == $setup.store.state.user.user.id ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "mine"
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(i.context),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      src: $setup.store.state.user.user.avatarUrl,
                      mode: ""
                    }, null, 8, ["src"])
                  ])) : vue.createCommentVNode("v-if", true)
                ], 8, ["id"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ], 8, ["scroll-with-animation", "scroll-into-view"])
        ]),
        vue.createElementVNode("view", { class: "btom" }, [
          vue.createElementVNode("view", { class: "shurk" }, [
            vue.createVNode(_component_wd_textarea, {
              focus: "",
              "custom-style": "padding: 10rpx;  padding-right:3.5em ;	max-height: 50vh;	border-radius: 15rpx;  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);",
              modelValue: $setup.senform.context,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.senform.context = $event),
              maxlength: 512,
              "auto-height": ""
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("view", {
              class: "btom-but",
              onClick: _cache[1] || (_cache[1] = (...args) => $setup.dosend && $setup.dosend(...args))
            }, " 发送 ")
          ])
        ])
      ])
    ]);
  }
  const PagesChatIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-c868fe04"], ["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/pages/Chat/index.vue"]]);
  __definePage("pages/Login/index", PagesLoginIndex);
  __definePage("pages/Homefriend/UserHome", PagesHomefriendUserHome);
  __definePage("pages/Userlist/index", PagesUserlistIndex);
  __definePage("pages/Login/Loginform", PagesLoginLoginform);
  __definePage("pages/Login/LoginEmail", PagesLoginLoginEmail);
  __definePage("pages/Homefriend/index", PagesHomefriendIndex);
  __definePage("pages/Group/index", PagesGroupIndex);
  __definePage("pages/Dynamic/index", PagesDynamicIndex);
  __definePage("pages/Mine/index", PagesMineIndex);
  __definePage("pages/Chat/index", PagesChatIndex);
  const _sfc_main = {
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      const initail = async () => {
        await zdongdl();
        if (IsLogin()) {
          websocke();
          uni.switchTab({
            url: "/pages/Homefriend/index"
          });
        } else {
          uni.navigateTo({
            url: "/pages/Login/index"
          });
        }
      };
      vue.onMounted(() => {
        initail();
        formatAppLog("log", "at App.vue:35", "这是趣友app");
      });
      const __returned__ = { initail, onMounted: vue.onMounted, get zdongdl() {
        return zdongdl;
      }, get IsLogin() {
        return IsLogin;
      }, get websocke() {
        return websocke;
      }, get SocketTask() {
        return SocketTask;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/黎旺/Documents/HBuilderProjects/my-lipaos/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(Store);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
