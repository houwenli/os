<template>
    <!-- 推荐人员信息 -->
    <div class="reference-detail">
        <div class="reference-title">
            <span>推荐人员信息</span>
            <el-button @click="onAddRow" plain icon="el-icon-plus">
                添加推荐人员
            </el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%; border-radius: 8px" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column label="姓名">
                <template slot-scope="{ row }">
                    <div v-if="row.name">
                        {{ row.name }}
                    </div>
                    <el-button type="primary" v-else @click="onOpenPersonDialog">请选择推荐人员</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="deptName" label="分支机构"></el-table-column>
            <el-table-column prop="positionName" label="职位"></el-table-column>
            <el-table-column label="入学推荐信">
                <!-- 根据状态，有就是查看，没有就是请填写 -->
                <template slot-scope="{ row, $index }">
                    <div v-if="row.name">
                        <el-button type="text" style="color: #0088FF;" @click="onOpenCurrentPersonDialog(row, $index)">
                          {{ row.recommendId || row.reason ? '查看' : '请填写' }}
                        </el-button>
                    </div>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="{ row, $index }">
                    <el-button type="text" v-if='row.recommendId === undefined' @click="delRow($index)">删除</el-button>
                    <span v-else>-</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="search-footer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="20"
                layout="total,sizes, prev, pager, next, jumper"
                :total="total"
            />
        </div>

        <div class="reference-btn">
            <el-button class="cancel-btn" @click="cancel">取消</el-button>
            <el-button class="confirm-btn" @click="onSubmit">提交名单</el-button>
        </div>

        <!-- 添加推荐人弹窗 -->
        <addPersonDialog v-if="showPersonDialog" :value.sync="showPersonDialog" @update="onUpdateSelectedPerson" :deptId="deptId"/>

        <!-- 入学推荐信弹窗 -->
        <entranceSchoolLetterDialog v-if="showEntranceSchoolLetterDialog" :value.sync="showEntranceSchoolLetterDialog" :info="row" @update="onUpdateRow" />
    </div>
</template>

<script>

import addPersonDialog from './addPersonDialog.vue'
import entranceSchoolLetterDialog from './entranceSchoolLetterDialog.vue'
import { cloneDeep } from 'lodash-es'
/**
 * 初始化一条空的数据
 */
const getTempItem = () => {
  return {
    name: '',
    phone: '',
    // 分支机构
    deptName: '',
    // 职务
    positionName: '',
    id: '',
    // 原因
    reason: '',
    // 优势字段
    advantage: '',
    // 劣势
    disadvantage: '',
    age: '',
    gender: '',
    // 前端自己用的
    disabled: false
  }
}

export default {
  name: 'referenceDetail',

  props: {
    /**
     * 会议id - 这是消息详情中的一个子属性
     */
    confId: {
      type: Number,
      require: true
    },

    /**
     * 职位id
     */
    deptId: {
      type: Number,
      require: true
    }
  },

  components: {
    addPersonDialog,
    entranceSchoolLetterDialog
  },

  data () {
    return {
      tipsText: '',
      tableData: [],

      id: null,

      showPersonDialog: false,

      // 填写个人推荐信弹窗
      showEntranceSchoolLetterDialog: false,

      row: {},
      // 当前正在操作哪一条数据
      activeIndex: null,

      page: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,

      // 由于推荐人员信息 存在分页 - 切换分页势必会重新查询接口，在做操作之前，将未保存的用户信息临时存储到这里
      unSaveList: [],

      template: {
        // 模版id在提交名单的时候，需要带回给后端
        templateId: '',
        templateContent: ''
      }
    };
  },
  async created () {
    let id = this.$route.query.id

    await this.getTagTips()

    if (id !== undefined) {
      // 消息id
      this.id = id

      this.getRecommondList()
    }
  },
  methods: {
    /**
     * 获取入学推荐信弹窗标签内容
     */
    async getTagTips() {
      try {
        let params = {
          op: 'selectTemplate',
          // 模板类型: 1.原因文案，2.推荐信文案，3.结业信文案
          type: 2
        }
        let res = await this._axios(params, "", "/conference/select")

        if (res.data && res.data.length) {
          this.template = res.data[0]
        }
      } catch (error) {

      }
    },

    /**
     * 查询已经推荐过的人员列表
     */
    async getRecommondList () {
      let url = this.$getModuleUrl('/index/conference', 'recommendUserList')

      if (!url) return
      try {
        let res = await this.$axios(url, {
          data: {
            body: { confId: this.confId },
            pageSize: this.page.pageSize,
            currentPage: this.page.currentPage
          },
          op: 'recommendUserList'
        })

        let data = JSON.parse(res.data)
        let list = data.body || []

        if (this.unSaveList.length) {
          list = list.concat(this.unSaveList)

          this.total = data.count + this.unSaveList.length
        } else {
          this.total = data.count
        }

        if (list.length) {
          list.push(getTempItem())
        }
        this.tableData = list
      } catch (error) {
      }
    },

    onAddRow () {
      if (this.tableData.length) {
        let lastItem = this.tableData[this.tableData.length-1]

        if (lastItem.name === '') {
          return
        }
      }

      let item = getTempItem()
      this.tableData.push(item)
    },
    delRow (index) {
      this.$confirm('是否确定删除本学员？', '提示', {
        center: true,
        type: 'danger'
      }).then(() => {
        this.tableData.splice(index, 1)
      }).catch(() => { })
    },

    onOpenCurrentPersonDialog (row, index) {
      row.confId = this.confId

      row.templateId = this.template.templateId
      row.templateContent = this.template.templateContent

      this.row = row
      this.activeIndex = index

      this.showEntranceSchoolLetterDialog = true
    },

    /**
     * 提交推荐人员名单
     */
    async onSubmit () {
      let list = cloneDeep(this.tableData)

      let unSaveList = list.filter(p => p.recommendId === undefined && p.name.length !== 0)

      if (unSaveList.length === 0) {
        this.$message.warning('请添加推荐人员')
        return
      }

      // 信息没有完善的人员列表
      let unFull = unSaveList.filter(p => p.reason.length === 0 || p.advantage.length === 0 || p.disadvantage.length === 0)

      if (unFull.length) {
        this.$message.warning('请完善学员的入学推荐信')
        return
      }

      const fn = async () => {
        let url = this.$getModuleUrl('/index/conference', 'recommendStaff')

        if (!url) return

        try {
          await this.$axios(url, {
            data: {
              id: this.id,
              // 1-同意， 2-拒绝
              status: 1,
              // 1-不推荐； 2-推荐
              recommendStatus: 2,
              conferenceRecommend: unSaveList
            },
            op: 'recommendStaff'
          })

          this.$message.success('推荐成功')
          this.unSaveList = []

          this.getRecommondList()
        } catch (error) {
        } finally {
        }
      }

      this.$confirm('提交名单后，提交的名单不允许删除和修改，是否确认提交？', '提示', {
        center: true
      }).then(() => {
        fn()
      }).catch(() => { })
    },


    // 不推荐
    cancel () {
      this.$emit('updateShow', false)
    },


    /**
     * 打开选择推荐人弹窗
     */
    onOpenPersonDialog () {
      this.showPersonDialog = true
    },

    onUpdateSelectedPerson (list) {

      if (list.length === 0) return

      let tableData = cloneDeep(this.tableData)
      // 先删除最后一个
      tableData.splice(tableData.length - 1, 1)

      list.forEach(p => {
        p.disabled = false
        p.reason = ''
        p.advantage = ''
        p.disadvantage = ''

        return p
      })

      if (tableData.length === 0) {
        list.push(getTempItem())

        this.tableData = list
        return
      }


      let arr = [...tableData, ...list]

      let map = new Map()

      for (let item of arr) {
        if (!map.has(item.userId)) {
          map.set(item.userId, item)
        }
      }

      let c = [...map.values()]

      let item = getTempItem()
      c.push(item)

      this.tableData = c
    },

    /**
     * 直接更新某一条中的部分字段
     */
    onUpdateRow (data) {
      let row = cloneDeep(this.tableData[this.activeIndex])

      Object.keys(data).forEach(key => {
        row[key] = data[key]
      })

      this.tableData[this.activeIndex] = row
      // 为了让表格刷新
      this.tableData.splice(1, 0)
    },

    handleSizeChange (size) {
      this.page.pageSize = size
      this.page.currentPage = 1

      // 过滤出未保存的人员，且丢弃掉 请选择人员这一行动态数据
      this.unSaveList = this.tableData.filter(p => p.recommendId === undefined && p.name.length !== 0)
      this.getRecommondList()
    },
    handleCurrentChange (current) {
      this.page.currentPage = current

      this.unSaveList = this.tableData.filter(p => p.recommendId === undefined && p.name.length !== 0)
      this.getRecommondList()
    },

  }
};
</script>

<style scoped lang="scss">
.reference-detail {
    margin: 32px 0 16px 0;
    width: 100%;
    min-height: 100%;

    .reference-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        span {
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
        }
    }

    .reference-btn {
        text-align: center;
        margin: 40px 0;
        font-size: 14px;

        .cancel-btn {
            min-width: 160px;
            height: 36px;
            font-weight: 400;
            color: #606266;
        }

        .confirm-btn {
            min-width: 160px;
            height: 36px;
            background: #f05259;
            border-radius: 4px;
            color: #fff;
        }
    }
}

.search-footer {
    display: flex;
    justify-content: flex-end;
    height: 60px;
    background: #fff;
    padding: 15px 0;
}
</style>