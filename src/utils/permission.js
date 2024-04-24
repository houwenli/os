import { mapGetters } from "vuex";
import { findParents } from '@/utils/commMethods'

const cachedFn = (fn) => {
    let cache = new Map();
    return str => {
        !cache.has(str) && cache.set(str, fn(str));
        return cache.get(str);
    };
}
//根据模块名查询当前模块下所有的权限
const getMenuList = cachedFn((modelName) => {
    let menuDataList = JSON.parse(sessionStorage.getItem('os-methodList')) || {};
    return menuDataList[modelName] || {};
});

const getPath = (item, pathName) => {
    let path = item.resourcesUrl || '';
    // 类型为菜单
    if (item.category == 1 && path && !path.startsWith('/')) {
        path = '/' + path;
    }

    // 类型为系统 为了区分系统归属与哪个页面下，配置系统都有当前页面前缀，例如：/technology，/businessSystem等
    if (item.category == 4 && path) {
        path = item.resourcesUrl.indexOf(pathName) !== -1 && item.resourcesUrl.substring(`/${pathName}`.length, item.resourcesUrl.length)
    }
    return path;
}
const dfsTraversalDefaultMenu = (menuData, _data = {
    name: '',
    menuList: []
}) => {
    for (let item of menuData) {
        if ((item.category == 1 || item.category == 4) && item.resourcesUrl === _data.path) {
            if (item.children && item.children.length > 0) {
                _data.menuList = [..._data.menuList, ...item.children]
            } else {
                _data.systemInfo = item
            }
        }
        if (item.children) {
            dfsTraversalDefaultMenu(item.children, _data);
        }
    }
    return _data
}

//全局注入权限组件选项
export const powerMixin = (Vue) => {
    Vue.mixin({
        beforeRouteEnter(to, from, next) {
                // 动态设置mate
                // let menuList = window.$vuex.$baseMethod.getStore('os-menuList')
                // let activeMenus = findParents(to, menuList)
                // if (activeMenus && activeMenus.length > 0) {
                //     let currentRoute = activeMenus[activeMenus.length - 1] // 当前路由配置菜单信息
                //     to.meta.activeMenu = activeMenus[0].resourcesUrl
                //     // to.meta.title = currentRoute.resourcesName
                //     currentRoute.category === 4 && (currentRoute.systemCode && (to.meta.subName = currentRoute.systemCode))
                // }
            next()
        },
        computed: {
            ...mapGetters('login', ['menuList','baseMenuMap']),
            oaPowerList() {
                if (!this.moduleName) {
                    return {};
                }
                let list = {};
                let menuDataList = getMenuList(this.moduleName);
                for (let [key, value] of Object.entries(menuDataList)) {
                    list = {
                        ...list,
                        ...{
                            [key]: value.resourcesUrl
                        }
                    }
                }
                list={...this.baseMenuMap,...list}
                return list;
            },
            defaultMenuOptions() {
                if (!this.$route.path) {
                    return {};
                }
                return dfsTraversalDefaultMenu(this.menuList, {
                    path: this.$route.path,
                    menuList: []
                })
            },
            powerControl() {
                return function (powers, methods = 'some', moduleName = '') {
                    let list = this.getModulePower(moduleName || this.moduleName);
                    list={...this.baseMenuMap,...list}
                    return powers[methods](item => list[item])
                };
            }
        },
        methods: {
            getModulePower(moduleName) {
                if (!moduleName) {
                    return {};
                }
                let obj = {};
                let menuDataList = getMenuList(moduleName);
                for (let [key, value] of Object.entries(menuDataList)) {
                    obj = {
                        ...obj,
                        ...{
                            [key]: value.resourcesUrl
                        }
                    }
                }
                obj={...this.baseMenuMap,...obj}
                return obj;
            },

            imgWhValidate(file, w = 80, h = 80) {
                let vm = this
                return new Promise(function (resolve, reject) {
                    const _URL = window.URL || window.webkitURL;
                    const img = new Image();
                    img.onload = function () {
                        let imgWidth = img.width;
                        let imgHight = img.height;
                        const valid = imgWidth === parseInt(w) && imgHight === parseInt(h);
                        !valid && vm.$message.error(`请上传尺寸为${w}px*${h}px的图片！`);
                        resolve(valid)
                    };
                    img.src = _URL.createObjectURL(file);
                });
            },

            getEnumVal(_enum, _val, _key = 'name') {
                let type = Object.prototype.toString.call(_val);
                let target
                if (type === '[object Array]') {
                    let value = _val.map(_str => _str * 1)
                    let result = _enum.filter(item => { if (value.map(_str => _str * 1).includes(item.id)) { return item } })
                    target = result.length > 0 ? result.map(res => res[_key]) : '--'
                }

                if (type === '[object Number]' || type === '[object String]') {
                    let result = _enum.filter(item => item.id === _val * 1)
                    target = result.length > 0 ? result[0][_key] : '--'
                }
                return target
            }
        },
    })
}
