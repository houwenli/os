/*
 * @Author: DaiYu
 * @Date: 2022-09-09 16:48:24
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-09 16:49:26
 * @FilePath: \main\src\utils\loadScript.js
 */
// 单例模式，只加载一次
// loadScript(url).then(e => {});
const loadScript = (function () {
    let instances = {};
    return function (src) {
        if (!instances[src]) {
            instances[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            // 提供一个删除instace的接口
            instances[src].deleteInstance = function () {
                delete instances[src];
            };
        }
        return instances[src];
    };
})();
export default loadScript;

