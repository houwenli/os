<template>
    <div class="navbar main-box" v-show="hideTabs">
        <div class="tagsBox">
            <img v-if="isArrow" class="arBtn" style="margin-left: 20px" @click="tagsLeft" src="@/assets/images/arrowLeft.png" alt="" />
            <tags-view ref="tagsView" v-if="needTagsView" />
            <img v-if="isArrow" class="arBtn" @click="tagsRight" src="@/assets/images/arrowRight.png" alt="" />
        </div>

        <div class="right-menu">
            <el-select @change="roleChange" :disabled="roleDisabled" v-model="roleValue" placeholder="请选择" popper-class="uniqKeyClass" :popper-append-to-body="false">
                <el-option v-for="item in roleOption" :key="item.uniqKey" :label="item.name" :value="item.uniqKey"></el-option>
            </el-select>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img src="../../assets/images/ic_userpic@2x.png" class="user-avatar" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="modelVisible = true">
                        <span>修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logoutHandle">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>


        </div>

        <ws-update-password :visible.sync="modelVisible"></ws-update-password>

        <!-- 在切换职务的时候，避免用户快速点击任何菜单，进入菜单内后，有被reload重置出来，造成错觉， 直接等reload完毕，在进行所需要的业务操作 -->
        <div class="mask-prevent-click" v-show="showMask"></div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import TagsView from './TagsView';
export default {
    provide() {
        return {
            arrowInit: this.arrowInit
        }
    },
    components: {
        TagsView,
    },
    data() {
        return {
            userName: this.$baseMethod.getStore('_ccmUser').loginName,
            modelVisible: false,
            isResetSend: false,
            formKey: new Date().getTime(),
            isScroll: false,
            tagsWidth: 0,
            isArrow: true,
            roleValue: '',
            roleOption: [],
            roleDisabled: false,

            showMask: false
        };
    },
    computed: {
        ...mapGetters(['sidebar', 'avatar', 'device']),
        ...mapState({
            needTagsView: state => state.settings.tagsView,
        }),
        ...mapState('login', ['menuList']),
        hideTabs() {
            return this.$store.state.settings.hideTabs;
        },
    },
    mounted() {
        let vm = this;
        window.addEventListener('resize', function () {
            vm.arrowInit();
        });
        vm.getOrgList();
    },

    methods: {
        ...mapActions({
            getMenuList: 'login/getMenuList',
        }),

        // 获取个人部门职务列表
        async getOrgList() {
            try {
                let res = await this._axios({ op: 'getUserDeptInfo' }, '', '/authority/employ/select');
                if (res.code === 1) {
                    let { bo, userDeptInfoVos } = res.data || {};
                    if (userDeptInfoVos.length === 1 && userDeptInfoVos[0].deptId === null) {
                        this.roleOption = [
                            {
                                uniqKey: -1,
                                name: '超级管理员',
                            },
                        ];
                        this.roleValue = -1;
                        this.roleDisabled = true;
                        return;
                    }
                    this.roleOption = userDeptInfoVos;
                    this.roleOption.map(item => {
                        if (item.uniqKey) {
                            item.uniqKey = item.uniqKey * 1;
                            return item;
                        }
                    });
                    // 默认选中主职数据
                    this.roleValue = (bo || {}).uniqKey * 1;
                    // 存储账号信息到session
                    this.$baseMethod.setStore(
                        'roleOption',
                        JSON.stringify({
                            currentDepId: (bo || {}).deptId,
                            currentDepName: userDeptInfoVos.filter(v => v.deptId == bo.deptId)[0].name,
                            deptType: userDeptInfoVos.filter(v => v.deptId == bo.deptId)[0].deptType,
                            orgType: (bo || {}).orgType,
                            roleList: this.roleOption,
                        })
                    );
                }
            } catch (_err) {
                throw _err;
            }
        },

        async roleChange(val) {
            try {
                let { deptId, positionIds, orgType, name, deptType } = this.roleOption.filter(i => i.uniqKey == val)[0] || {};
                let param = {
                    deptId,
                    orgType,
                    positionIds,
                    op: 'deptSwitch',
                };
                let res = await this._axios(param, '', '/authority/employ/select');
                if (res.code == 1) {
                    this.$vuex.$baseMethod.removeStore('os-methodList');
                    this.$store.commit('breadcrumb/delAll')
                    this.$store.commit('loadMicroApp/clearSubApp');
                    this.showMask = true
                    // 清空methodsList后 getMenuList查菜单后默认跳已授权的第一个
                    this.getMenuList().then(async () => {

                        let { resourcesUrl } = this.menuList[0] || {}
                        if (this.$route.path != resourcesUrl && resourcesUrl) {
                          // 这里是一个Promise 如果路由不一致，则等这里先跳转正确后，再整个执行  reload刷新
                            await this.$router.replace(resourcesUrl)
                        }

                        // 整个页面刷新 - 主要是解决切换职务后 main\src\layout\components\Sidebar\index.vue 组件中的methodList值没刷新的问题
                        window.location.reload()
                    }).finally(() => {
                      this.showMask = false
                    })
                }
                // 存储账号信息到session
                this.$baseMethod.setStore(
                    'roleOption',
                    JSON.stringify({
                        currentDepId: deptId,
                        deptType: deptType,
                        currentDepName: name,
                        orgType: orgType,
                        roleList: this.roleOption,
                    })
                );
            } catch (_err) {
                throw _err;
            }
        },

        // 控制左右箭头根据宽度隐藏 / 展示
        arrowInit() {
            this.$nextTick(() => {
                let tagsBox = document.getElementById('tags-view-container').offsetWidth;
                let tags = Array.from(document.getElementsByClassName('tags-view-item'));
                let count = tags.reduce((total, cur) => {
                    return total + cur.offsetWidth;
                }, 0);
                this.isArrow = count + 35 > tagsBox;
            });
        },

        ...mapActions({
            requestLogout: 'login/requestLogout',
        }),
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar');
        },
        tagsLeft() {
            let scrollBox = this.$refs.tagsView.$refs.scrollPane.$refs.scrollContainer.$refs.wrap;
            let originScrollLeft = scrollBox.scrollLeft;
            if (!this.isScroll && scrollBox.scrollLeft !== 0) {
                let scrollSlowLeft = setInterval(function () {
                    this.isScroll = true;
                    scrollBox.scrollLeft = scrollBox.scrollLeft - 10;
                    if (scrollBox.scrollLeft <= originScrollLeft - scrollBox.clientWidth || scrollBox.scrollLeft == 0) {
                        clearInterval(scrollSlowLeft);
                        this.isScroll = false;
                    }
                }, 1);
            }
        },
        tagsRight() {
            let scrollBox = this.$refs.tagsView.$refs.scrollPane.$refs.scrollContainer.$refs.wrap;
            let originScrollLeft = scrollBox.scrollLeft;
            if (!this.isScroll && scrollBox.scrollLeft < scrollBox.scrollWidth) {
                let scrollSlowRight = setInterval(function () {
                    this.isScroll = true;
                    scrollBox.scrollLeft = scrollBox.scrollLeft + 10;
                    if (scrollBox.scrollLeft >= originScrollLeft + scrollBox.clientWidth || scrollBox.scrollLeft >= scrollBox.scrollWidth - scrollBox.clientWidth) {
                        clearInterval(scrollSlowRight);
                        this.isScroll = false;
                    }
                }, 1);
            }
        },
        logoutHandle() {
            this.requestLogout();
            this.$store.commit('breadcrumb/delAll');
            this.$store.commit('loadMicroApp/clearSubApp');
        },
    }
};
</script>

<style lang="scss" scoped>
.arBtn {
    width: 20px;
    height: 40px;
    margin-top: 14px;
    cursor: pointer;
}
.tagsBox {
    display: flex;
    width: 100%;
    padding-right: 60px;
    overflow: hidden;
}
/deep/ .ws-table-warp .fixed_header_warp {
    top: 84px !important;
}
.navbar {
    display: flex;
    justify-content: space-between;
    height: 56px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: none;
    padding-left: 10px;

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        margin-left: 36px;
        float: right;
        height: 100%;
        line-height: 56px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;
            }
        }

        .avatar-container {
            margin-right: 8px;

            .avatar-wrapper {
                position: relative;

                .user-name {
                    display: block;
                    margin: 0 0 0 7px;
                    float: right;
                    font-size: 14px;
                    font-weight: 500;
                    color: #303133;
                    div {
                        font-size: 16px;
                        display: inline-block;
                        max-width: 64px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    img {
                        margin-left: 2px;
                        width: 24px;
                        height: 24px;
                        position: relative;
                        bottom: 16px;
                    }
                }

                .user-avatar {
                    cursor: pointer;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    position: relative;
                    top: 10px;
                    color: #909399;
                }

                .el-icon-caret-bottom {
                    margin-left: 6px;
                    cursor: pointer;
                    position: relative;
                    bottom: 35px;
                    color: #909399;
                }
            }
        }
    }
    /deep/ .el-input__inner {
        background: #f5f7fa;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        text-overflow: ellipsis;
    }
}
/deep/.uniqKeyClass {
    position: fixed !important;
    margin-right: 50px !important;
    top: 51px !important;
    margin-top: 0px !important;
    .popper__arrow {
        left: auto !important;
        right: 7px !important;
    }
}
.el-select-dropdown__item {
    /deep/ span {
        float: right;
    }
}
/deep/ .el-icon-arrow-up:before {
    content: '\e790';
    display: inline-block;
    transform: rotate(180deg);
}
.el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided:before {
    height: 0px !important;
}
.el-dropdown-menu {
    background: #fff !important;
    border: solid 1px #dfe4ed !important;
    margin-top: 0px !important;
    top: 51px !important;
    li {
        color: #606266;
    }
    li:hover {
        background: #f5f7fa;
        color: #f05259;
    }
    .popper__arrow::after {
    }
    .el-dropdown-menu__item--divided {
        border-top: none;
    }
}
/deep/.el-dropdown-menu {
    margin-top: 0px !important;
}
/deep/.el-popper {
}
.el-dropdown-menu.el-popper {
    /deep/.popper__arrow {
        border-bottom-color: #e6ebf5 !important;
    }
}

.el-dropdown-menu {
    /deep/.popper__arrow::after {
        border-bottom-color: rgb(255, 255, 255) !important;
    }
}
// /deep/  .el-icon-arrow-up:after {
//     content: '\e790';
// }
// /deep/ .el-dialog .el-dialog__body {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
// }
// /deep/ .el-input--medium .el-input__inner{
//     height: 40px;
//     line-height: 40px;
// }

.mask-prevent-click {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
</style>
