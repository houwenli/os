<template>
    <div ref="functionRef" class="function_box">
        <div class="function_Tree">
            <div class="searchBox">
                <el-input v-model.trim="filterText" placeholder="请搜索系统功能" :maxlength="20" clearable class="search"></el-input>
                <el-button v-if="isOperation && powerControl([requestConfig.add])" type="primary" @click="addFirstMenu" class="addNew">新增一级菜单</el-button>
            </div>
            <!-- tree -->
            <ws-tree
                :key="systemInfo.orgType"
                ref="tree"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                :treeData="menusList[0] && menusList[0].children"
                :defaultProps="defaultProps"
                :draggable="false"
                :filterable="false"
                :setNodeExpand="setNodeExpand"
                @node-add="handleNodeAdd"
                @node-delete="handleNodeDelete"
            ></ws-tree>
        </div>

        <div :key="copyMenuInfo.id" class="funciton_config">
            <div class="breadcrumb_name">{{ Object.keys(copyMenuInfo).length > 0 ? titleName : '--' }}</div>
            <!-- 内容填写 -->
            <section class="el_form_ws">
                <section class="type_select">
                    <span class="add_type">
                        <i>*</i>
                        新增类型：
                    </span>
                    <el-radio-group @change="typeChange()" :disabled="isDisabled || !!copyMenuInfo.id" v-model="copyMenuInfo.category">
                        <el-radio :label="1">菜单</el-radio>
                        <!-- oa功能配置入口进入不需要携带任何参数 oa功能配置才可以添加系统 -->
                        <el-radio v-if="Object.keys($route.query).length === 0 && isAddSys" :label="4">系统</el-radio>
                        <el-radio :label="2">功能</el-radio>
                    </el-radio-group>
                </section>
                <!-- 菜单 -->
                <el-form v-if="copyMenuInfo.category == 1" :rules="rules" ref="form" label-width="8rem" :model="copyMenuInfo" :disabled="isDisabled">
                    <el-form-item prop="name" label="菜单名称：">
                        <el-input v-model.trim="copyMenuInfo.name" placeholder="请输入菜单名称" maxlength="12"></el-input>
                    </el-form-item>

                    <el-form-item class="picLabel" label="选择图标类型：">
                        <el-radio-group v-model="copyMenuInfo.iconType">
                            <el-radio :label="1">字体图标</el-radio>
                            <el-radio :label="2">图片</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 字体图标上传 -->
                    <el-form-item v-if="copyMenuInfo.iconType === 1" prop="imgName" label="字体图标：">
                        <el-input v-model.trim="copyMenuInfo.imgName" placeholder="请输入字体图标名称" maxlength="50"></el-input>
                    </el-form-item>
                    <!-- 图片上传 -->
                    <el-form-item v-if="copyMenuInfo.iconType === 2" class="picLabel" label="请选择菜单图标：">
                        <div style="display: flex">
                            <ws-image-upload
                                :handleRemove="handleRemove"
                                :uploadValidate="file => imgWhValidate(file)"
                                :urlList="getUrlList(copyMenuInfo.pic)"
                                :inputReadyOnly="isDisabled"
                                :isDelete="!isDisabled"
                                style="display: inline-block; margin-right: 12px"
                                v-bind="options"
                            />
                            <div>
                                <div style="color: #f56c6c" class="picTips">固定尺寸80px*80px，png格式</div>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="菜单描述：">
                        <el-input maxlength="50" resize="none" type="textarea" :rows="3" v-model.trim="copyMenuInfo.menuDesc" placeholder="请输入菜单描述，不超过50个字符"></el-input>
                    </el-form-item>

                    <el-form-item prop="url" label="页面路径：">
                        <el-input maxlength="100" v-model.trim="copyMenuInfo.url" placeholder="请输入页面路径"></el-input>
                    </el-form-item>

                    <el-form-item prop="sort" label="展示优先级：">
                        <el-input @input="inputChange" v-model.trim="copyMenuInfo.sort" placeholder="请输入级别1-100"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 系统 -->
                <el-form v-if="copyMenuInfo.category == 4" :rules="rules" ref="form" label-width="8rem" :model="copyMenuInfo" :disabled="isDisabled">
                    <el-form-item prop="menuSysInfoId" label="选择系统：">
                      <!-- 系统不允许切换-只能删除重新创建一个 -->
                        <el-select :popper-append-to-body="false" v-if="!copyMenuInfo.id" v-model="sysId" @change="copyMenuInfo.menuSysInfoId = sysId" placeholder="请选择系统">
                            <el-option v-for="item in sysList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <el-input v-else disabled v-model.trim="copyMenuInfo.name"></el-input>
                    </el-form-item>

                    <el-form-item class="picLabel" label="选择图片类型：">
                        <el-radio-group v-model="copyMenuInfo.iconType">
                            <el-radio :label="1">ICON字体图标</el-radio>
                            <el-radio :label="2">图片上传</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 字体图标上传 -->
                    <el-form-item v-if="copyMenuInfo.iconType === 1" prop="imgName" label="ICON名称：">
                        <el-input v-model.trim="copyMenuInfo.imgName" placeholder="请输入字体图标名称" maxlength="50"></el-input>
                    </el-form-item>
                    <!-- 图片上传 -->
                    <el-form-item v-if="copyMenuInfo.iconType === 2" class="picLabel" label="选择菜单图标：">
                        <div style="display: flex">
                            <ws-image-upload
                                :handleRemove="handleRemove"
                                :uploadValidate="file => imgWhValidate(file)"
                                :urlList="getUrlList(copyMenuInfo.pic)"
                                :inputReadyOnly="isDisabled"
                                :isDelete="!isDisabled"
                                style="display: inline-block; margin-right: 12px"
                                v-bind="options"
                            />
                            <div>
                                <div style="color: #f56c6c" class="picTips">固定尺寸80px*80px，png格式</div>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item prop="url" label="页面路径：">
                        <el-input maxlength="100" v-model.trim="copyMenuInfo.url" placeholder="请输入页面路径"></el-input>
                    </el-form-item>

                    <el-form-item prop="sort" label="展示优先级：">
                        <el-input @input="inputChange" v-model.trim="copyMenuInfo.sort" placeholder="请输入级别1-100"></el-input>
                    </el-form-item>

                    <!-- 权限勾选 -->
                    <!-- <el-form-item label="使用机构：" class="orgType">
                        <div v-show="sysType!=3"  style="min-width: 100px;" >
                            <el-checkbox-group  v-if="copyMenuInfo.orgTypes" v-model="copyMenuInfo.orgTypes">
                                <el-checkbox v-for="item in orgTypeList"  :key="item.id" :label="item.id"><br>{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item> -->

                </el-form>

                <!-- 功能 -->
                <div v-if="copyMenuInfo.category == 2">
                    <el-form ref="form" :rules="rules" label-width="8rem" :model="copyMenuInfo">
                        <el-form-item prop="name" label="功能名称：">
                            <el-input :disabled="isDisabled" v-model.trim="copyMenuInfo.name" placeholder="请输功能名称" maxlength="10"></el-input>
                        </el-form-item>

                        <el-form-item prop="url" label="方法：">
                            <el-input :disabled="isDisabled" maxlength="100" v-model.trim="copyMenuInfo.url" placeholder="请输入方法"></el-input>
                        </el-form-item>

                        <el-form-item label="功能描述：">
                            <el-input
                                :disabled="isDisabled"
                                maxlength="50"
                                resize="none"
                                type="textarea"
                                :rows="3"
                                v-model.trim="copyMenuInfo.menuDesc"
                                placeholder="请输入功能描述，不超过50个字符"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="title">
                        <span>功能配置</span>
                        <el-button v-if="!isDisabled && copyMenuInfo.functions.length === 0 && isOperation && powerControl([requestConfig.add]) " @click="addRow()" type="primary" icon="el-icon-circle-plus" class="addBtn">新增</el-button>
                    </div>
                    <el-table ref="table" :data="copyMenuInfo.functions" border class="functionsTable" :header-cell-style="{ background: '#F5F7FA' }">
                        <el-table-column label="功能名称" width="180">
                            <template slot-scope="scope">
                                <el-input :ref="scope.$index === copyMenuInfo.functions.length-1?'funInput':''" :disabled="isDisabled" v-model.trim="scope.row.name" maxlength="20" clearable placeholder="请输入功能名称"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="op"  width="180">
                            <template slot-scope="scope">
                                <el-input :disabled="isDisabled" v-model.trim="scope.row.op" maxlength="60" clearable placeholder="请输入op"></el-input>
                            </template>
                        </el-table-column>
                        <!-- 权限勾选 -->
                        <!-- <el-table-column v-show="sysType!=3" v-for="item in orgTypeList" :key="item.id" prop="orgTypes" :label="item.name" width="80">
                            <template slot-scope="scope">
                                <el-checkbox-group v-model="scope.row.orgTypes">
                                    <el-checkbox :disabled="isDisabled" :key="item.id" :label="item.id"><br></el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </el-table-column> -->

                        <el-table-column prop="updateUserName" label="修改人" min-width="100"></el-table-column>

                        <el-table-column prop="updateTime" label="修改时间" min-width="170"></el-table-column>

                        <el-table-column v-if="!isDisabled" label="操作" width="170"  fixed="right">
                            <template slot-scope="scope">
                                <el-button @click="popConfirm(scope.$index)" slot="reference" size="mini" type="text">删除</el-button>
                                <el-button @click="addRow()" slot="reference" size="mini" type="text" style="color: #0088ff">新增</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </section>
            <!-- 按钮 -->
            <!-- <el-row v-if="isOperation && powerControl([requestConfig.edit, requestConfig.add])" type="flex" justify="center" class="btnBox">
                <el-button v-if="isDisabled" style="width: 160px" type="primary" @click="(isDisabled = false), (addType = 'edit')">修改</el-button>

                <template v-else> -->
                    <!-- 新增防止用户点击取消再点击编辑，改变 addType的状态 -->
                    <!-- <el-col v-if="!isDisabled && menusList.length > 0 && menusList[0].children && menusList[0].children.length > 0" :span="12">
                        <el-button :loading="btnLoading" style="width: 160px; float: right" @click="cancel()">取消</el-button>
                    </el-col>
                    <el-col :span="12" style="margin-left: 15px">
                        <el-button :loading="btnLoading" style="width: 160px" type="primary" @click="submitForm()">保存</el-button>
                    </el-col>
                </template>
            </el-row> -->
            <div class="btn_box" v-if="isOperation && powerControl([requestConfig.edit, requestConfig.add])">
                <el-button v-if="isDisabled" style="width: 160px" type="primary" @click="onEdit">修改</el-button>
                <el-button
                    v-if="!isDisabled && menusList.length > 0 && menusList[0].children && menusList[0].children.length > 0"
                    :loading="btnLoading"
                    style="width: 160px;"
                    @click="cancel()"
                >
                    取消
                </el-button>
                <el-button v-if="!isDisabled" :loading="btnLoading" style="width: 160px" type="primary" @click="submitForm()">保存</el-button>

                <!-- 本地测试可用 op新增过多场景要来回滑动 -->
                 <el-button v-if="isTest && !isDisabled" @click="addRow()" type="primary" icon="el-icon-circle-plus" class="addBtn">新增</el-button>
            </div>
        </div>

        <el-dialog append-to-body title="删除" :visible.sync="showDelete" width="30%" center :lock-scroll="false">
            <p style="text-align: center">{{ popText }}</p>
            <span slot="footer">
                <el-button style="width: 98px" :loading="btnLoading" @click="showDelete = false">取 消</el-button>
                <el-button style="width: 98px" :loading="btnLoading" type="primary" @click="confirmDel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import wsTree from '@/components/Tree'; //tree
export default {
    name: 'funcitonConfig',
    components: { wsTree },
    props: {
        menuInfo: {
            type: Object,
            default: () => {},
        },
        systemInfo: {
            type: Object,
            default: () => {},
        },
        menusList: {
            type: Array,
            default: () => [],
        },
        titleName: {
            type: String,
            default: '',
        },
        isOperation: {
            // 是否能操作
            type: Boolean,
            default: true,
        },
        requestConfig: {
            // 请求op，url，模块名称
            type: Object,
            default: () => {
                return {
                    add: 'saveMenu',
                    edit: 'updateMenu',
                    del: 'deleteMenu',
                };
            },
        },
        isAddSys: {
            // 能否添加系统
            type: Boolean,
            default: true,
        },
        moduleName: {
            type: String,
            default: '',
        },
        sysType: {
            type: [String,Number],
            default: ''
        }
    },
    data() {
        return {
            orgTypeList:[],
            // 本地添加op  过多， 要来回滑动
            isTest: false,
            rules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入菜单名称',
                    },
                ],
                sort: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入展示优先级',
                    },
                ],
                menuSysInfoId: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请选择系统',
                    },
                ],
                url: [
                    {
                        required: false,
                        trigger: 'blur',
                        message: '请输入方法',
                    },
                ],
            },
            // tree数据
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            selectNode: {},
            showDelete: false,
            filterText: '',
            breadList: [],

            //图片上传
            options: {
                quantity: 1,
                actions: {
                    url: '/file/upload', //上传地址，优先级高于moduleName
                    op: '', //上传op，优先级高于moduleName
                },
                afterUpload: this.afterUpload,
                fileExt: ['png'],
            },
            isDisabled: true,
            sysList: [],
            sysId: '',
            btnLoading: false,
            copyMenuInfo: { iconType: 1 },
            addType: 'addOneLevel',
            popText: '',
        };
    },
    watch: {
        //tree搜索监听方法
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        menuInfo: {
            handler(val) {
                 !val.functions?val.functions=[]:''
                // 备份基础信息数据,方便取消重置表格数据
                this.copyMenuInfo = { iconType: 1, ...this.$baseMethod.deepClone(val) };
            },
            deep: true,
            immediate: true,
        },
        'copyMenuInfo.category'(val) {
            val == 4 && this.querySysList();
            if (val == 2) return (this.rules['url'][0]['required'] = true);
            this.rules['url'][0]['required'] = false;
        },
        defaultMenuOptions: {
            handler: function (newV) {
                if(this.sysType!=3){
                    let arr=newV.menuList.filter(item=>{
                        return item.resourcesUrl=='/webSystem'
                    })[0].children

                    this.orgTypeList=this.$judgeType(arr, []).map(item => {
                        let moduleInfo = item.resourcesUrl.split('&');
                        return { id: moduleInfo[1] * 1, name: item.resourcesName, module: moduleInfo[0] };
                    }).filter(item=>{ return item.id!=-1});
                }
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.querySysList();
    },
    methods: {
        // 保存表单
        submitForm() {
            // console.log(this.copyMenuInfo, this.menusList, '==============================', this.selectNode);
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    //非小程序
                    if(!this.systemInfo.id && this.sysType!=3) return this.$message.error('请先输入系统名称与编码并保存')

                    // if (this.copyMenuInfo.iconType == 2 && !this.copyMenuInfo.pic) return this.$message.error('请上传菜单图标');
                    // 校验菜单下OP表格是否都填写
                    let isAdd = this.validateAddFields(this.$judgeType(this.copyMenuInfo.functions, []));
                    if (this.systemInfo.id && isAdd) {
                        /**
                         * @type menuType
                         *       子系统导航栏存在二级导航，公用组件根据type（menuType）筛选出左侧导航栏多层级菜单
                         *       oa系统子应用菜单判断字段 0：无页面菜单，1：功能菜单（方法）2：有页面菜单
                         *
                         * @type category
                         *       oa系统只存在一级导航，只需通过category来判断
                         *       oa系统菜单类型 1：菜单，2/3：功能方法，4：系统
                         */
                        let menuType;
                        switch (this.copyMenuInfo.category) {
                            case 1: // 菜单
                                menuType = this.copyMenuInfo.url ? 2 : 0;
                                break;
                            case 2: // 功能菜单
                            case 3:
                                menuType = 1;
                                break;
                        }

                        let operationType = {
                            edit: this.copyMenuInfo.parentId, // 编辑-取当前点击节点父级id
                            addOneLevel: this.menusList[0].id, // 添加一级菜单-取第一层id
                            addDownLevel: this.selectNode.data && this.selectNode.data.id, // 添加下级菜单-取当前点击节点id
                        };
                        let op = this.addType === 'edit' && this.copyMenuInfo.id ? this.requestConfig.edit : this.requestConfig.add;
                        this.copyMenuInfo.iconType == 1 && (this.copyMenuInfo.pic = '');
                        this.copyMenuInfo.iconType == 2 && (this.copyMenuInfo.imgName = '');
                        let param = {
                            orgType: this.systemInfo.orgType,
                            sysInfoId: this.systemInfo.id,
                            sysCode: this.systemInfo.sysCode,
                            ...this.copyMenuInfo,
                            menuSysInfoId: this.sysId || this.copyMenuInfo.menuSysInfoId, // 优先取下拉框选中的值，如果没有，取服务返回的id
                            parentId: operationType[this.addType],
                            menuType,
                            op,
                        };
                        this.btnLoading = true;
                        try {
                            let res = await this._axios(param, this.moduleName);
                            this.btnLoading = false;
                            if (res.code == 1) {
                                this.$message.success('保存成功!');
                                let data = res.data;
                                this.isDisabled = true;
                                this.sysId = '';
                                this.copyMenuInfo.category == 4 && this.querySysList();
                                this.selectNodeFun(data, op);
                            }
                        } catch (error) {
                            this.btnLoading = false;
                        }

                    }
                }
            });
        },

        handleRemove() {
            this.copyMenuInfo.pic = '';
        },

        inputChange() {
            if (this.copyMenuInfo.sort.length == 1) {
                this.copyMenuInfo.sort = this.copyMenuInfo.sort.replace(/[^1-9]/g, '');
            } else {
                if (this.copyMenuInfo.sort > 100) {
                    this.copyMenuInfo.sort = 100;
                } else {
                    this.copyMenuInfo.sort = this.copyMenuInfo.sort.replace(/\D/g, '');
                }
            }
        },

        typeChange() {
            this.$refs.form.clearValidate();
            let menuData = {
                functions: [],
                id: '',
                menuDesc: '',
                name: '',
                parentId: '',
                pic: '',
                sort: '',
                menuSysInfoId: '',
                url: '',
                imgName: '',
                pic: '',
                iconType: 1,
                orgTypes:[0]
            };
            this.copyMenuInfo = { ...this.copyMenuInfo, ...menuData };
        },

        // 查询系统列表
        async querySysList() {
            try {
                if (!this.isAddSys) return;
                let res = await this._axios({ op: 'selectAllBusSysInfo', orgType: this.systemInfo.orgType }, '', '/authority/systemInfo/select');
                res.code == 1 && (this.sysList = res.data);
            } catch (_err) {
                throw _err;
            }
        },

        // 添加一级菜单
        addFirstMenu() {
            this.sysId = '';
            this.addType = 'addOneLevel';
            this.addMenu('新增一级菜单');
        },

        //点击加号
        handleNodeAdd(node, data) {
            this.sysId = '';
            this.addType = 'addDownLevel';
            this.selectNode = { node, data };
            this.copyNode = this.$baseMethod.deepClone(node);
            this.copyData = this.$baseMethod.deepClone(data);
            this.addMenu('新增下级菜单');
        },

        // 添加菜单
        addMenu(titleName = '') {
            let menuData = {
                functions: [],
                id: '',
                menuDesc: '',
                name: '',
                parentId: '',
                pic: '',
                sort: '',
                menuSysInfoId: '',
                url: '',
                imgName: '',
                pic: '',
                iconType: 1,
                category: 1,
            };
            this.isDisabled = false;
            this.$emit('updateData', { data: menuData, titleName });
        },

        // 删除菜单弹窗
        handleNodeDelete(node, data) {
            this.selectNode = { node, data };
            this.delNodeId = data.id;
            this.popText = '确认删除菜单？';
            this.delType = 'nodeDel';
            this.showDelete = true;
        },

        // 删除功能配置OP
        popConfirm(index) {
            this.popText = '确认删除功能配置？';
            this.delType = 'functionDel';
            this.showDelete = true;
            this.functionIndex = index;
        },

        // 确认删除
        confirmDel() {
            // 菜单删除
            if (this.delType === 'nodeDel') return this.deleteMenu();

            // 功能OP删除
            this.copyMenuInfo.functions.splice(this.functionIndex, 1);
            this.showDelete = false;
        },

        //删除菜单接口
        async deleteMenu() {
            try {
                let param = {
                    id: this.delNodeId,
                    op: this.requestConfig.del,
                };
                this.btnLoading = true;
                let res = await this._axios(param, this.moduleName);
                this.btnLoading = false;
                if (res.code == 1) {
                    this.$message.success('删除成功!');
                    this.filterText = '';
                    this.showDelete = false;
                    this.isDisabled = true;
                    let parent = this.selectNode.node.parent;
                    let children = parent.data.children || parent.data;
                    let index = children.findIndex(d => d.id === this.delNodeId);
                    if (this.selectNode.node.level == 1) {
                        this.$refs.tree.data.splice(index, 1);
                    } else {
                        children.splice(index, 1);
                    }

                    // 删除之后没有菜单，显示添加一级菜单
                    if (this.$refs.tree.data.length === 0) return this.addFirstMenu();
                    // 删除成功之后，回显上级菜单
                    let nodeData = this.$refs.tree.$refs.tree.getNode(this.selectNode.data.parentId);
                    // 如果没有上级菜单，回显同级第一个菜单信息
                    if (this.selectNode.data.parentId == this.menusList[0].id) {
                        nodeData = this.$refs.tree.$refs.tree.getNode(this.$refs.tree.data[0].id);
                    }
                    this.clickReset(Object.assign({}, nodeData.data));
                }
            } catch (_err) {
                this.btnLoading = false;
                throw _err;
            }
        },

        // 取消编辑
        cancel() {
            // 有id = 编辑取消
            if (this.copyMenuInfo.id) {
                this.copyMenuInfo = { iconType: 1, ...this.$baseMethod.deepClone(this.menuInfo) };
            } else {
                // 没有id 优先取选中节点数据，没有节点数据则为页面初始化，获取树结构第一条数据
                let data = this.menusList[0].children[0];
                this.clickReset(this.selectNode.data || data);
            }
            this.$refs.form && this.$refs.form.resetFields();
            this.isDisabled = true;
        },
        //table新增
        addRow() {
            this.isDisabled = false
            this.copyMenuInfo.functions = this.copyMenuInfo.functions || [];
            let table = this.copyMenuInfo.functions;
            let data = table[table.length - 1] || {};
            let isAdd = this.validateAddFields(data);
            let rowKeys = { name: '', op: '' , orgTypes:[0]}
            isAdd && table.push(rowKeys);
            this.$nextTick(() => {
                let element = document.getElementsByClassName('el_form_ws')[0]
                element.scrollTop = element.scrollHeight;
                this.$refs.funInput.focus()
            })
        },

        // tree
        setNodeExpand(node, data) {
            this.selectNode = { node, data };
            if (this.$route.query.type == 'detail') {
                return false;
            }
            if (data.category != 1 || !this.powerControl([this.requestConfig.add])) {
                this.$set(data, 'banAdd', true);
            }
            if (!this.powerControl([this.requestConfig.del])) {
                this.$set(data, 'banDelete', true);
            }
            return true;
        },

        //面包屑
        getTreeNode(node) {
            //获取当前树节点和其父级节点
            if (Object.keys(node).length > 0 && node.label !== undefined) {
                this.breadList.unshift(node.label);
                this.getTreeNode(node.parent); //递归
            }
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        //配置验证
        validateAddFields(data) {
            if (Object.keys(data).length === 0) return true;

            let type = Object.prototype.toString.call(data);

            //验证必填项
            if (type === '[object Object]') {
                for (let key in data) {
                    if (!data[key] && ['name', 'op', 'url'].includes(key)) {
                        this.$message.error(`${{ name: '功能名称', op: 'op', url: 'url' }[key]}为必填项!`);
                        return false;
                    }
                }
            }

            if (type == '[object Array]') {
                for (let item of data) {
                    for (let key in item) {
                        if (!item[key] && ['name', 'op'].includes(key)) {
                            this.$message.error(`${{ name: '功能名称', op: 'op' }[key]}为必填项!`);
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        //新增修改菜单后调用
        selectNodeFun(data, type) {
            this.filterText = '';
            let treeData = this.$refs.tree.data || (this.$refs.tree.data = []);
            if (this.titleName == '新增一级菜单') {
                treeData.push(data);
            } else {
                // 修改
                if (type == this.requestConfig.edit) {
                    if (!this.selectNode.data) {
                        // 页面初始化，selectNode没有数据，默认显示的数据为首页
                        this.selectNode = this.$refs['tree'].$refs['tree'].getNode(treeData[0].id);
                    } else {
                        // 重复修改提交，无法更新tree，实时获取节点数据
                        this.selectNode = this.$refs['tree'].$refs['tree'].getNode(data.id);
                    }
                    Object.assign(this.selectNode.data, data);
                    return this.clickReset(data);
                }
                if (!this.selectNode.data.children) {
                    this.$set(this.selectNode.data, 'children', []);
                }
                this.selectNode.data.children.push(data);
            }
            this.clickReset(data);
        },

        clickReset(data) {
            this.$nextTick(() => {
                this.$refs.tree.$refs.tree.setCurrentKey(data.id);
                let node = this.$refs.tree.$refs.tree.getNode(data.id);
                this.selectNode = { node, data };
                this.handleNodeClick(data, node);
            });
        },

        handleNodeClick(data, node) {
            this.breadList = [];
            this.sysId = '';
            this.getTreeNode(node);
            this.isDisabled = true;
            let titleName = Object.keys(node).length > 0 ? this.breadList.join(' / ') : '首页';
            this.$emit('updateData', { data, titleName });
        },

        afterUpload(data) {
            this.urlList = [];
            this.urlList.push(data.data);
            this.copyMenuInfo.pic = data.data;
        },

        getUrlList(url) {
            // 图片地址集合，可用于修改返回图片地址
            if (url) {
                return [url];
            }
        },

        onEdit() {
          this.isDisabled = false
          this.addType = 'edit'
        }
    },

};
</script>

<style lang="scss" scoped>
.function_box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .function_Tree {
        width: 37%;
        height: 535px;
        margin-right: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin-right: 16px;
        display: flex;
        flex-direction: column;

        .searchBox {
            padding: 24px 24px 20px;
            flex-wrap: wrap;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .search {
            flex: 1;
            // min-width: 180px;
            box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
        }

        .addNew {
            width: 96px;
            background: #ffffff;
            color: #f05259;
            margin-left: 16px;
            padding: 10px 0px;
        }

        /deep/ .ws-tree-warp {
            padding: 0px 24px 12px;
            flex: 1;
            overflow-y: auto;
        }
    }

    .funciton_config {
        height: 535px;
        width: 63%;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        // overflow-y: auto;
        display: flex;
        flex-direction: column;

        .breadcrumb_name {
            font-size: 16px;
            display: flex;
            align-items: center;
            font-weight: 600;
            padding: 18px 24px 26px;
        }

        .type_select {
            display: flex;
            padding: 0px 0px 16px;

            .add_type {
                font-size: 14px;
                color: #606266;
                line-height: 14px;
                width: 8rem;
                text-align: right;
                padding-right: 12px;

                i {
                    color: #f56c6c;
                    margin-right: 4px;
                    font-style: normal;
                }
            }
        }

        .el_form_ws {
            flex: 1;
            overflow-y: auto;
            padding: 0px 24px;
            .el-form-item {
                margin-bottom: 16px;
            }
        }

        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 2px 0px 24px;
            font-size: 16px;
            height: 40px;
            font-weight: 600;
        }
        .addBtn {
            width: 95px;
            height: 36px;
            background: #ffffff;
            color: #f05259;
        }

        .functionsTable {
            margin-bottom: 16px;
            .el-input,
            .el-textarea {
                width: 100%;
            }
        }

        .btnBox {
            padding: 24px 0;
        }

        .btn_box {
            padding: 24px 0;
            display: flex;
            justify-content: center;
        }

        /deep/ .image-viewer {
            height: 80px;
            width: 80px;
        }

        /deep/ .el-input,
        .el-textarea {
            width: 58%;
        }

        /deep/ .el-select {
            width: 58%;

            .el-input {
                width: 100%;
            }
        }

        /deep/ .el-upload--picture-card {
            width: 80px;
            height: 80px;
            line-height: 90px;
            margin: 0px;
        }
    }

    /deep/ .node-content {
        font-size: 14px !important;
    }
    /deep/ .node-content-level1 {
        font-size: 14px !important;
    }
    /deep/ label {
        font-weight: 400 !important;
    }
    .orgType{
        /deep/ .el-form-item__content{
            display: flex;
        }
    }
}
</style>
