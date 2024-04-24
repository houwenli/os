/**
 * 单元素全屏切换
 * 修改自https://github.com/mirari/vue-fullscreen
 * @returns {boolean|*}
 */
// 判断环境是否支持全屏API
function supportFullScreen() {
    const doc = document.documentElement;
    return (
        "requestFullscreen" in doc ||
        ("mozRequestFullScreen" in doc && document.mozFullScreenEnabled) ||
        ("msRequestFullscreen" in doc && document.msFullscreenEnabled) ||
        "webkitRequestFullScreen" in doc
    );
}
// 判断是否处于全屏状态
function fullScreenStatus() {
    if (
        document.fullscreen ||
        document.mozFullScreen ||
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.webkitIsFullScreen
    ) {
        return true;
    } else {
        return false;
    }
}
// 进入全屏模式
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else {
        console.log("不支持全屏API");
    }
}
// 退出全屏模式
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        console.log("不支持全屏API");
    }
}
// 全屏事件
function onFullScreenEvent(callback) {
    document.addEventListener("fullscreenchange", callback);
    document.addEventListener("mozfullscreenchange", callback);
    document.addEventListener("MSFullscreenChange", callback);
    document.addEventListener("webkitfullscreenchange", callback);
}
//退出全屏事件，执行回调
function offFullScreenEvent(callback) {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("mozfullscreenchange", callback);
    document.removeEventListener("MSFullscreenChange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
}

// 实现jquery对象继承，支持深拷贝,合并option参数
function extend() {
    const extended = {};
    let deep = false;
    let i = 0;
    const length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
        deep = arguments[0];
        i++;
    }

    function merge(obj) {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if (
                    deep &&
                    Object.prototype.toString.call(obj[prop]) ===
                        "[object Object]"
                ) {
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    }

    for (; i < length; i++) {
        var obj = arguments[i];
        merge(obj);
    }

    return extended;
}

const defaults = {
    wrap: true,
    exitOnClickWrapper: true,
    background: "#333",
    callback: () => {},
    fullscreenClass: "fullscreen"
};
// 判断环境是否支持全屏API
const support = supportFullScreen();
// 判断是否处于全屏状态
function getState() {
    return fullScreenStatus();
}
// 切换全屏模式
function toggle(target, options, force) {
    if (!support) {
        return;
    }
    if (force === undefined) {
        // 如果已经是全屏状态，则退出
        !getState() ? enter(target, options) : exit();
    } else {
        force ? enter(target, options) : exit();
    }
}
// 进入全屏模式
function enter(target = document.body, options) {
    if (!support) {
        return;
    }
    if (getState()) {
        return;
    }
    options = extend(true, {}, defaults, options);

    if (target === document.body) {
        options.wrap = false;
    }

    const el = target;
    let wrapper;
    if (options.wrap) {
        wrapper = document.createElement("div");
        wrapper.style["overflow-y"] = "auto";
        wrapper.style["background"] = options.background;
        wrapper.style["width"] = "100%";
        wrapper.style["height"] = "100%";

        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        if (options.exitOnClickWrapper) {
            wrapper.addEventListener("click", function(event) {
                if (event.target === this) {
                    exitFullscreen();
                }
            });
        }
    }

    el.classList.add(options.fullscreenClass);

    function fullScreenCallback() {
        const isFullscreen = getState();
        if (!isFullscreen) {
            // 退出全屏时解绑回调
            offFullScreenEvent(fullScreenCallback);
            el.classList.remove(options.fullscreenClass);
            if (options.wrap) {
                wrapper.parentNode.insertBefore(el, wrapper);
                wrapper.parentNode.removeChild(wrapper);
            }
        }

        if (options.callback) {
            options.callback(isFullscreen);
        }
    }

    onFullScreenEvent(fullScreenCallback);
    requestFullscreen(options.wrap ? wrapper : el);
}
// 退出全屏模式
function exit() {
    if (!support) {
        return;
    }
    if (!getState()) {
        return;
    }
    exitFullscreen();
}

export default {
    getState,
    support,
    toggle,
    enter,
    exit
};
