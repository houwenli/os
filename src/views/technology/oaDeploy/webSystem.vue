<template>
    <div>
        <!-- 基础配置 -->
        <systemForm
            v-if="sysType==3"
            v-bind="$attrs"
            @pageInit="
                id => {
                    queryOasystem(id), (sysId = id);
                }
            "
            :moduleName="moduleName"
            :basicsOptions="basicsOptions"
            :systemInfo="{ ...systemInfo, orgType }"
            :isOperation="isOperation"
            :sysName="sysName"
            :sysCode="sysCode"
            :sysType="sysType"
        ></systemForm>

        <!-- 功能菜单配置 -->
        <section v-if="functionShow" :style="sysType!=3?'padding-top: 20px;':''">
            <h3 class="title" v-if="sysType==3">功能菜单配置</h3>
            <functionConfig
                ref="functionBox"
                :moduleName="moduleName"
                :titleName="titleName"
                :menuInfo="menuData"
                :menusList="menusList"
                @updateData="updateData"
                :systemInfo="{ ...systemInfo, orgType }"
                :isOperation="isOperation"
                :sysType="sysType"
                :requestConfig="sysType!=3?opList[0]:opList[1]"
            />
        </section>

    </div>
</template>

<script>
import systemForm from './components/systemForm.vue'; // 系统表单
import functionConfig from './components/functionConfig.vue'; // 菜单配置

export default {
    name: 'systemInfoForm',
    components: { systemForm, functionConfig },
    props: {
        orgType: {
            type: Number,
            default: 0
        },
        moduleName: {
            type: String,
            default: ''
        },
        sysName: {
            type: String,
            default: ''
        },
        sysCode:  {
            type: String,
            default: ''
        },
        //用来判断是否为小程序OP配置  3:小程序
        sysType: {
            type: [String,Number],
            default: ''
        },
    },
    data() {
        return {
            // moduleName: '/technology/oaDeploy',
            showDelete: false,
            functionShow: false,
            menuData: {}, // 功能配置
            basicsOptions: [], // 基础信息
            menusList: [], // 菜单list
            titleName: '新增一级菜单',
            systemInfo: {}, // 当前系统信息
            isOperation: false, // 是否能操作
            sysId: '',
            //0:子系统 OA  1:小程序
            opList: [
                {
                    add: 'saveOpMenu',
                    edit: 'updateOpMenu',
                    del: 'deleteOpMenu'
                },
                {
                    add: 'saveMenu',
                    edit: 'updateMenu',
                    del: 'deleteMenu'
                }
            ]
        };
    },
    watch: {
        '$route.query': {
            handler(val) {
                let { type, id } = val || {};
                type !== 'detail' && (this.isOperation = true);
                this.functionShow = (type !== 'add' || this.sysType !=3 )? true : false;
                switch (type) {
                    case 'add': // 新增系统
                        this.$nextTick(() => {
                            this.sysType!=3 && this.queryOasystem();
                            // 基础信息解除禁用
                            this.sysType==3 && (this.$children[0].isDisabled = false);
                        });
                        break;
                    case 'edit': // 编辑系统
                    case 'detail': // 系统详情
                        this.queryOasystem(id);
                        break;
                    default:
                        this.queryOasystem();
                        break;
                }
            },
            deep: true,
            immediate: true
        },
        orgType(val) {
            this.queryOasystem(this.$route.query.id);
        }
    },

    methods: {
        //设置新系统ID
        setSysId(val){
            this.sysId= val 
        },
        updateData(obj) {
            let { data, titleName } = obj || {};
            this.titleName = titleName && titleName;
            Object.keys(data).length > 0 ? (this.menuData = data) : this.sedInfo();
        },

        // 系统配置查询 没有id 默认查询oa系统
        async queryOasystem(id, type = 'reset') {
            try {

                //不为小程序时,功能菜单显示不受基础配置影响
                if(this.$route.query.type === 'add' && this.sysType!=3){
                    this.sedInfo();
                }

                // id 列表携带系统id || sysId新增保存服务返回系统id || oa系统不携带参数默认查询oa系统
                if (!id && !this.sysId && Object.keys(this.$route.query).length > 0 ) return;
                this.$route.query.type === 'add' && (this.functionShow = true);
                let param = {
                    id: id || this.sysId,
                    orgType: this.orgType,
                    op: 'selectSystemDetail'
                };
                let res = await this._axios(param, this.moduleName);
                if (res.code == 1) {
                    let { headFunctions, firstOrgFunctions, secondOrgFunctions, stationFunctions, menus, id, name, sysCode, createUserName, createTime, updateUserName, updateTime,port,activeMenu } = this.$judgeType(
                        res.data,
                        {}
                    );
                    // 系统信息
                    this.systemInfo = { id, name, sysCode };

                    // 系统名称回显，禁用输入
                    this.$parent.$parent.sysName = name;
                    this.$parent.$parent.sysCode = sysCode;
                    this.$parent.$parent.sysNameDisb = true;
                    this.$parent.$parent.port = port;
                    this.$parent.$parent.activeMenu = activeMenu;

                    // 基础信息
                    let datas = {
                        0: headFunctions, // 总部基础信息
                        20: firstOrgFunctions, // 一级机构基础信息
                        30: secondOrgFunctions, // 二级机构基础信息
                        40: stationFunctions // 实体店基础信息
                    };
                    this.basicsOptions = datas[this.orgType] || [];

                    // 菜单list
                    this.menusList = Object.keys(menus).length > 0 ? menus : [];

                    // 修改记录信息
                    this.$emit('editLog', { createUserName, createTime, updateUserName, updateTime });

                    if (type === 'reset') {
                        this.sedInfo();
                    }
                } else {
                    // 异常情况以及url未获取
                    this.basicsOptions = [];
                    this.menusList = [];
                    this.sedInfo();
                }
            } catch (_err) {
                throw _err;
            }
        },
        //菜单右侧显示
        sedInfo() {
            if (this.menusList.length === 0 || this.menusList[0].children == null || this.menusList[0].children.length == 0) {
                this.menuData = {
                    functions: [],
                    id: '',
                    menuDesc: '',
                    name: '',
                    parentId: '',
                    pic: '',
                    sort: '',
                    sysInfoId: this.systemInfo.id,
                    url: '',
                    category: 1
                };
                this.titleName = '新增一级菜单';
                this.$refs['functionBox'].isDisabled = this.$route.query.type == 'detail' || (this.sysType!=3 && this.orgType != -1 ) ? true : false;
                this.$refs['functionBox'].addType = 'addOneLevel';
            } else {
                this.menuData = this.menusList[0].children[0];
                this.titleName = this.menusList[0].children[0].name;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 32px 0 16px;
    font-size: 16px;
    font-weight: 600;
}

/deep/ .system_type {
    display: table;
    margin: 0 auto;
}

.mainForm {
    padding: 24px 40px;
    border-radius: 8px;
    margin-bottom: 56px;
}

/deep/ .el-radio-button__inner {
    width: 124px;
    padding: 12px 16px;
    background: #f0f2f5;
}
/deep/ .el-card__body {
    padding: 0;
}
/deep/ .el-table {
    border-radius: 8px;
}
</style>
