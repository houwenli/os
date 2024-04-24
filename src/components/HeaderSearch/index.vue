<template>
    <div :class="{ show: show }" class="header-search">
        <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
        <el-select ref="headerSearchSelect" v-model="search" :remote-method="querySearch" filterable default-first-option remote placeholder="Search" class="header-search-select" @change="change">
            <el-option v-for="option in options" :key="option.item.path" :value="option.item" :label="option.item.title" />
        </el-select>
    </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js/dist/fuse.min.js';
import path from 'path';
import { mapGetters } from 'vuex';

export default {
    name: 'HeaderSearch',
    data() {
        return {
            search: '',
            options: [],
            searchPool: [],
            show: false,
            fuse: undefined
        };
    },
    computed: {
        ...mapGetters('login', ['menuList'])
    },
    watch: {
        menuList(val) {
            if (val.length) {
                this.searchPool = this.generateRoutes(val);
            }
        },
        searchPool(list) {
            this.initFuse(list);
        },
        show(value) {
            if (value) {
                document.body.addEventListener('click', this.close);
            } else {
                document.body.removeEventListener('click', this.close);
            }
        }
    },
    methods: {
        click() {
            this.show = !this.show;
            if (this.show) {
                this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
            }
        },
        close() {
            this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
            this.options = [];
            this.show = false;
        },
        change(val) {
            if (this.ishttp(val.path)) {
                // http(s):// 路径新窗口打开
                window.open(val.path, '_blank');
            } else {
                this.$router.push(val.path);
            }
            this.search = '';
            this.options = [];
            this.$nextTick(() => {
                this.show = false;
            });
        },
        initFuse(list) {
            this.fuse = new Fuse(list, {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    {
                        name: 'title',
                        weight: 0.7
                    },
                    {
                        name: 'path',
                        weight: 0.3
                    }
                ]
            });
        },
        generateRoutes(routes, res = []) {
            routes.forEach(router => {
                if (router.type == 2) {
                    res.push({
                        path: router.resourcesUrl,
                        title: router.resourcesName
                    });
                }

                router.children && router.type !== 1 && this.generateRoutes(router.children, res);
            });
            return res;
        },
        querySearch(query) {
            if (query !== '') {
                this.options = this.fuse.search(query);
            } else {
                this.options = [];
            }
        },
        ishttp(url) {
            return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1;
        }
    }
};
</script>

<style lang="scss" scoped>
.header-search {
    font-size: 0 !important;

    .search-icon {
        cursor: pointer;
        font-size: 18px;
        vertical-align: middle;
    }

    .header-search-select {
        font-size: 18px;
        transition: width 0.2s;
        width: 0;
        overflow: hidden;
        background: transparent;
        border-radius: 0;
        display: inline-block;
        vertical-align: middle;

        /deep/ .el-input__inner {
            border-radius: 0;
            border: 0;
            padding-left: 5px;
            padding-right: 5px;
            box-shadow: none !important;
            border-bottom: 1px solid #d9d9d9;
            vertical-align: middle;
        }
    }

    &.show {
        .header-search-select {
            width: 210px;
            margin-left: 10px;
        }
    }
}
</style>
