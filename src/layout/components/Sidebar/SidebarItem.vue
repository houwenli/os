<template>
    <div>
        <template
            v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)">
            <app-link v-if="onlyOneChild.resourcesUrl || defaultUrl[onlyOneChild.resourcesName]"
                      :to="defaultUrl[onlyOneChild.resourcesName] || resolvePath(onlyOneChild.resourcesUrl)">
                <el-menu-item
                    :index="item.resourcesUrl?(!item.resourcesUrl.startsWith('/')?'/'+item.resourcesUrl:item.resourcesUrl):defaultUrl[onlyOneChild.resourcesName]"
                    :class="{'submenu-title-noDropdown':!isNest}">
                    <item :icon="onlyOneChild.imgName" :title="onlyOneChild.resourcesName"/>
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu"
                    :index="item.resourcesUrl?(!item.resourcesUrl.startsWith('/')?'/'+item.resourcesUrl:item.resourcesUrl):onlyOneChild.resourcesName"
                    popper-append-to-body>
            <template slot="title">
                <item :icon="item.imgName ? item.imgName : ''" :title="item.resourcesName"/>
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.resourcesUrl"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.resourcesUrl)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import {isExternal} from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
    name: 'SidebarItem',
    components: {Item, AppLink},
    mixins: [FixiOSBug],
    props: {
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data () {
        this.onlyOneChild = null
        return {
            defaultUrl: {
                '首页': '/index',
                '工作台': '/workbench',
                '业务系统': '/businessSystem',
                '技术中台': '/technology',
                '数据中心': '/dataServer',
                '系统管理': '/systemManage',
                '个人中心': '/personalCenter',
                '通讯录': '/mailList',
                '我要投诉':'/personalComplaint'
            }
        }
    },
    methods: {
        hasOneShowingChild (children = [], parent) {
            if (!children) {
                children = [];
            }
            if (this.defaultUrl[parent.resourcesName]) {
                this.onlyOneChild = {...parent, noShowingChildren: true}
                return true
            }
            const showingChildren = children.filter(item => {
                if (parent.type !== 2) {
                    this.onlyOneChild = item
                    return true
                } else {
                    return false
                }
            })

            if (showingChildren.length === 1) {
                return true
            }

            if (showingChildren.length === 0) {
                this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
                return true
            }

            return false
        },
        resolvePath (routePath) {
            if (isExternal(routePath)) {
                return routePath
            }
            if (isExternal(this.basePath)) {
                return this.basePath
            }
            return routePath
        }
    }
}
</script>
