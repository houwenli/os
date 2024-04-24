<template>
    <div>
        <div class="main_content">
            <ws-table-el ref="table"  v-if="moduleName" v-bind="tableConfig" highlight-current-row
                :header-cell-style="{ background: '#F5F7FA' }">
                <template #search>
                    <search-group>
                        <label for>机构类型：</label>
                        <!-- <organization v-model="searchOptions.userName" :showSelect="true" :selectOptions="selectOptions"
                            ref="orgSelect" placeholder="请输入机构名称搜索" valueKey="agencyNumber"></organization> -->
                            <el-select v-model="searchOptions.orgType" clearable>
                            <el-option label="总部" :value="0"></el-option>
                            <el-option label="一级机构" :value="20"></el-option>
                            <el-option label="二级机构" :value="30"></el-option>
                            <el-option label="实体店" :value="40"></el-option>
                        </el-select>
                    </search-group>
                    <search-group>
                        <label for>用户姓名：</label>
                        <el-input v-model="searchOptions.userName" clearable placeholder="请输入用户姓名"></el-input>
                    </search-group>
                    <search-group>
                        <label for>用户手机号：</label>
                        <el-input v-model="searchOptions.userPhone" clearable maxlength="11"
                            placeholder="请输入用户手机号"></el-input>
                    </search-group>
                </template>
                <template #options>
                    <div class="right">
                        <el-button-group v-if='powerList.replyList'>
                            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                            <ws-throttle>
                                <el-button type="primary" icon="el-icon-refresh-left" @click="onReset"></el-button>
                            </ws-throttle>
                        </el-button-group>
                    </div>
                </template>

                <!-- 数据表格部分 -->
                <template>
                    <!-- <ws-table-column-el type="index" width="50" label="序号" :index="indexMethod" /> -->
                    <ws-table-column-el prop="orgType" label="机构类型" min-width="120px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orgType | orgTypeFilters }}</span>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="orgName" label="机构名称" min-width="120px"></ws-table-column-el>
                    <ws-table-column-el prop="userName" label="用户姓名" min-width="120px"></ws-table-column-el>
                    <ws-table-column-el prop="userPhone" label="用户手机号" min-width="120px"></ws-table-column-el>
                    <ws-table-column-el label="留言内容" min-width="200px">
                        <template #default="{ row }">
                            <template v-if="row.messageContent.length <= 30">{{ row.messageContent }}</template>

                            <el-popover v-else placement="top-start" title="" width="600" trigger="hover"
                                :content="row.messageContent">
                                <div slot="reference" style="padding: 10px 0">
                                    {{ getContent(row.messageContent) }}
                                </div>
                            </el-popover>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="createTime" label="留言时间" min-width="160px"></ws-table-column-el>
                    <ws-table-column-el label="操作" min-width="160px" fixed="right">
                        <template slot-scope="{ row }">
                            <el-button type="text" v-if="showReplyButton(row) && powerList.addReply" @click="openReplyModal(row)">回复</el-button>
                            <el-button type="text" v-if="powerList.updateReplyTop"  @click="onSetCommentTop(row)">
                                {{ row.top === 0 ? '置顶' : '取消置顶' }}
                            </el-button>
                            <el-button type="text" v-if="powerList.updateReplyHide" @click="onHidden(row)">
                                {{ row.hide === 0 ? '隐藏' : '取消隐藏' }}
                            </el-button>
                            <el-button type="text" v-if="powerList.replyDetail" @click="toDetail(row)">详情</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>

        <ws-footer>
            <el-button @click="onBack">返回</el-button>
        </ws-footer>
          <!-- 留言回复弹窗 -->
          <replyModal :value.sync="showReplyModal" v-if="showReplyModal" :info="row"  @updateData="onReply" />
    </div>
</template>

<script>
import { getCommentModuleName, orgTypeMap } from './data.js'
import organization from '@/components/orgSelect/organization-options.vue';
import replyModal from '../components/replyModal.vue'
export default {
    name: 'commentDialog',
    components: {
        organization,
        replyModal
    },
    props: {
        value: {
            type: Boolean,
            require: true
        },
        // id: {
        //     type: [String, Number],
        //     require: true
        // },
        /**
         * 哪一种类型的留言记录
         * 1-消息通知, 2-政策文件, 3-知识园地
         */
        type: {
            type: Number,
            require: true
        },
        status: {
            type: Number
        }
    },
    data() {
        return {
            moduleName: '',
            searchOptions: {
                userName: '',
                userPhone: '',
                orgType: '',
                idNumber: ''
            },
            id:'',
            tableConfig: {
                loading: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: '',
                    op: {
                        selectList: 'replyList',
                        selectCount: 'replyCount'
                    }
                },
            },
            list: [],
            orgTypeList: [
                {
                    value: '0',
                    label: '总部'
                },
                {
                    value: '20',
                    label: '一级机构'
                },
                {
                    value: '30',
                    label: '二级机构'
                },
                {
                    value: '40',
                    label: '实体店'
                }
            ],

            // 回复弹窗
            showReplyModal: false,

            // 当前行的留言记录
            row: {},

            page: {
                currentPage: 1,
                total: 0,
                pageSize: 20
            }
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('update:value', val)
            },

        },
        selectOptions() {
            let arr = [
                { value: '20', label: '城市分公司' },
                { value: '30', label: '区县分公司' },
                { value: '40', label: '实体店' }
            ]
            if (this.roleType === 20) {
                arr = [
                    { value: '30', label: '区县分公司' },
                    { value: '40', label: '实体店' }
                ]
            }
            if (this.roleType === 30) {
                arr = [
                    { value: '40', label: '实体店' }
                ]
            }
            return arr
        },
        // policyModuleName(){
        //     return sessionStorage.getItem('policyModuleName')
        // }
    },
    filters: {
        orgTypeFilters(val) {
            if (val == 0) {
                return '总部'
            } else if (val == 10) {
                return '省区'
            } else if (val == 20) {
                return '一级机构'
            } else if (val == 30) {
                return '二级机构'
            } else {
                return '实体店'
            }
        }
    },
    created() {
       
        let { noticeType, noticeId } = this.$route.query

        if (noticeType !== undefined && noticeId !== undefined) {
            this.moduleName = getCommentModuleName(noticeType*1)
            this.tableConfig.lazyQuery.moduleName=this.moduleName
            this.searchOptions.orgNoticeId = noticeId*1
            this.id=noticeId*1
        }
        
        // this.getTableCount()
    },
    methods: {
        /**
         * 回复按钮通过按钮权限控制
         */
        showReplyButton(row) {
            if (!this.$getModuleUrl(this.moduleName, 'addReply')) return false

            //  3-已失效  状态的不能进行回复操作
            if (this.status === 3) return false

            return row.hide === 0
        },
        handleSearch() {
            // this.tableConfig.lazyQuery.moduleName=this.policyModuleName
            // console.log(this.moduleName,this.$getModuleUrl(this.moduleName, 'replyList'),this.$refs.table.search(),'88888');
            this.$refs.table.search();
        },
        async getTableData() {
            let params = {
                data: {
                    body: {
                        ...this.searchOptions,
                        noticeType: this.type,
                        orgNoticeId: this.id
                    },
                    currentPage: this.page.currentPage,
                    pageSize: this.page.pageSize
                },

                op: 'replyList'
            }

            try {
                let url = this.$getModuleUrl(this.moduleName, 'replyList')
                let res = await this.$axios(url, params)

                if (res.code === 1) {
                    let list = JSON.parse(res.data) || []
                    list.forEach(item => {
                        item.orgTypeText = this.orgTypeList.find(p => Number(p.value) === item.orgType).label
                    })

                    this.list = list
                }
            } catch (error) {
                console.log('留言记录 --报错', error)
            }
        },

        async getTableCount() {
            let params = {
                data: {
                    body: {
                        ...this.searchOptions,
                        noticeType: this.type,
                        orgNoticeId: this.id
                    },
                    currentPage: this.page.currentPage,
                    pageSize: this.page.pageSize
                },

                op: 'replyCount'
            }

            try {
                let url = this.$getModuleUrl(this.moduleName, 'replyCount')
                let res = await this.$axios(url, params)

                if (res.code === 1) {
                    this.page.total = Number(res.data)
                }
            } catch (error) {
                console.log('留言记录 --报错', error)
            }
        },

        handleSizeChange(size) {
            this.page.currentPage = 1
            this.page.pageSize = size
            this.handleSearch()
        },

        handleCurrentChange(currentPage) {
            this.page.currentPage = currentPage
            this.handleSearch()
        },

        orgTypeChange(e) {
            this.searchOptions.orgType = e
        },
        onSeach(init) {
            if (init) {
                this.page.currentPage = 1
            }
        },
        onReset() {
            this.$refs.table.reset();
        },

        getContent(text) {
            return text.length > 30 ? text.substring(0, 30) + '...' : text
        },
        onBack() {
            this.$router.go(-1)
        },
        async onHidden(row) {
            let url = this.$getModuleUrl(this.moduleName, 'updateReplyHide')

            let params = {
                op: 'updateReplyHide',
                data: {
                    noticeType: row.noticeType,
                    id: row.id,
                    hide: row.hide === 0 ? 1 : 0
                }
            }
            try {
                await this.$axios(url, params)
                let msg = row.hide === 0 ? '隐藏成功' : '取消隐藏成功'
                this.$message.success(msg)

                this.handleSearch()
            } catch (error) { }
        },
        toDetail(row) {
            this.dialogVisible = false

            this.$router.push({
                name: 'orgNewsInfoNoticeCommentDetail',
                query: {
                    id: row.id,
                    type: this.type,
                    moduleName:this.moduleName
                }
            })
        },

        /**
         * 置顶
         */
        async onSetCommentTop(row) {
            console.log(this.moduleName,this.$getModuleUrl(this.moduleName, 'updateReplyTop'),'99');
            let url = this.$getModuleUrl(this.moduleName, 'updateReplyTop')

            let params = {
                op: 'updateReplyTop',
                data: {
                    noticeType: row.noticeType,
                    id: row.id,
                    top: row.top === 0 ? 1 : 0
                }
            }
            try {
                await this.$axios(url, params)
                this.$message.success('置顶成功')

                this.handleSearch()
            } catch (error) { }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        openReplyModal(row) {
            this.row = row
            this.showReplyModal = true
        },
        /**
         * 回复
         */
        async onReply(data) {
            let url = this.$getModuleUrl(this.moduleName, 'addReply')

            let params = {
                op: 'addReply',
                data: {
                    // 公告的id
                    orgNoticeId: this.id,
                    noticeType: this.row.noticeType,
                    // 留言的id
                    parentId: this.row.id,
                    messageContent: data.message,
                    replyType: 2
                }
            }
            try {
                await this.$axios(url, params)
                this.$message.success('回复成功')

                this.showReplyModal = false

                this.handleSearch()
            } catch (error) { }
        },
        closeModal() {
            this.dialogVisible = false
        },
        indexMethod(index) {
            return index + 1 + (this.page.currentPage - 1) * this.page.pageSize
        }
    }
}
</script>

<style lang="scss" scoped>
.main_content {
    margin-bottom: 64px;
}

.right {
    display: flex;
    justify-content: flex-end;
}

/deep/ .option-box {
    display: flex;
    align-content: stretch;
    justify-content: flex-end;
}
</style>

