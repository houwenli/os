<template>
    <div>
        <el-dialog class="uploadDialog" title="批量上传" :visible.sync="showUploadList" :destroy-on-close="true" append-to-body :close-on-click-modal="false" width="80%" @open="open()">
            <div class="upload-box-style">
                <div class="upload-style">
                    <el-upload
                        :before-upload="beforeAvatarUpload"
                        :on-remove="handelRemove"
                        :action="uploadFile"
                        ref="upload"
                        :on-change="handleChange"
                        :multiple="true"
                        :data="{ token: token, op: op, data: '{businessType:500}' }"
                    >
                        <el-button size="small" type="primary" :disabled="disabled" :slot="slot">上传用户文件</el-button>
                    </el-upload>
                </div>
                <div class="remark">
                    <p>温馨提示：为避免导入文件失败，请先下载模板，使用模板填写数据后导入</p>
                </div>
            </div>
            <el-button class="downloadBtn" @click="downLoad()" type="primary">下载模板</el-button>
            <ws-table-el class="uploadList" ref="tableuploadList" v-bind="tableConfig" :filterColumns="false" :autoHeight="false" height="400" :pagination="true" :page-size-list="[10,20,30,40,50]">
                <template>
                    <ws-table-column-el prop="fileName" label="导入文件名称"></ws-table-column-el>
                    <ws-table-column-el prop="updateTime" label="导入完成时间"></ws-table-column-el>
                    <ws-table-column-el prop="state" label="导入状态">
                        <template slot-scope="scope">
                            {{ stateList(scope.row.state) }}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="importSuccessNum" label="导入成功数"></ws-table-column-el>
                    <ws-table-column-el prop="importFailureNum" label="导入失败数"></ws-table-column-el>
                    <ws-table-column-el prop="createName" label="操作人"></ws-table-column-el>
                    <ws-table-column-el class="uploadListbtn" label="操作" fixed="right" min-width="140px">
                        <template slot-scope="scope">
                            <!-- <el-button  @click="reupLoad(scope.row)" type="text">重新导入</el-button> -->
                            <span class="upload-style">
                                <el-upload
                                    :before-upload="beforeAvatarUpload"
                                    :on-remove="handelRemove"
                                    :action="uploadFile"
                                    ref="upload"
                                    :on-change="handleChange"
                                    :multiple="true"
                                    :data="{ token: token, op: op, data: '{businessType:500}' }"
                                    class="tableElupload"
                                >
                                    <span size="small" type="primary" :disabled="disabled" :slot="slot">重新导入</span>
                                </el-upload>
                            </span>
                            <el-button class="downLoadDatabtn" v-if="scope.row.mistakeFileUrl" @click="downLoadFailed(scope.row)" type="text">导出错误数据</el-button>
                        </template>
                    </ws-table-column-el>
                    ``
                </template>
            </ws-table-el>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            tableConfig: {
                loading: true,
                lazyQuery: {
                    moduleName: '/cardcouponApply',
                    op: {
                        selectList: 'queryImportList'
                    },
                    beforeQuery: this.beforeQueryMain
                }
            },
            showUploadList: false,
            fileList: [],
            uploadList: [],
            upText: '',
            op: 'batchUploadSpu',
            token: this.$baseMethod.getStore('_ccmUser').token,
            slot: 'trigger',
            disabled: false,
            fileData: [],
            fileUrl: ''
        }
    },
    computed: {
        uploadFile() {
            return process.env.VUE_APP_COUPON_API + '/cardcoupon/applyOnlineRetailersCoupon/batchUploadSpu'
        }
    },
    created() {
        console.log()
        this.getUseruploadList()
    },
    methods: {
        handleChange(file, fileList) {
            console.log('++++++111111++++++++', file, this.fileList)
            if (file.response && file.response.code != 1) {
                this.fileList = []
                this.$message.error(file.response.msg)
                return
            } else if (file.response && file.response.code == 1) {
                this.$message.success('导入成功！')
                let list = JSON.parse(file.response.data).listVo
                this.$emit('selectList', list)
            }
            if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]
            }
            this.upText = file.name
            this.saveuploadList()
            this.$refs.tableuploadList.search()
        },
        saveuploadList() {
            console.log(this.uploadList, '传出来的 this.selectList')
            this.$emit('uploadList', this.uploadList)
        },
        stateList(val) {
            return val == 1 ? '导入成功' : '导入失败'
        },
        getUseruploadList() {
            // let data = {
            //     op: 'queryImportList'
            // }
            // try {
            //     this.$axios('/cardcoupon/applyOnlineRetailersCoupon/queryImportList', data).then(res => {
            //         //列表
            //         if (res.code === 1) {
            //             this.uploadList = JSON.parse(res.data).body
            //         }
            //     })
            // } catch (error) {
            //     console.log(error)
            // }
            this.$refs.tableuploadList.search()
        },
        handelRemove() {
            this.disabled = false
            this.slot = 'trigger'
            this.fileData = []
            this.fileUrl = ''
        },
        success(response, file, fileList) {
            console.log(response, 'response')
            let data = JSON.parse(response.data)
            console.log(data, 'response.data')
            if (data) {
                this.isShowdowlodError = data.result
                this.fileUrl = data.url || ''
                this.fileList = fileList
            }
            console.log(this.fileList, 'fileList')
            if (response.code == 0) {
                this.$message.error(response.msg)
            }
            if (data.anwserCode.code == 1) {
                this.$message.success('导入成功！')
                this.uploadList = JSON.parse(this.fileList[0].response.data).listVo
            }
            this.saveuploadList()
            this.getUseruploadList()
            if (this.isShowdowlodError === 1) {
                this.disabled = true
                this.slot = 'tip'
                this.$message.success('导入成功！')
                data.compensationUserVos.forEach(item => {
                    this.fileData.push({ passengerPhone: item.passengerPhone, remark: item.remark })
                })
            } else {
                this.disabled = true
                this.slot = 'tip'
                if (data.url === null) {
                    this.$message.error(data.anwserCode.message)
                } else {
                    this.$message.error(data.msg)
                }
            }
        },
        beforeAvatarUpload(file) {
            let fileLengh = file.name.split('.')[0].length
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            // if (fileLengh > 12) {
            //     this.$message.error('上传文件名不能超过12个字符!');
            //     return false;
            // }
            if (!isXLSX) {
                this.$message.error('上传文件只能是 xlsx 格式!')
                return false
            }
            return isXLSX && fileLengh
        },
        //上传文件
        // handleChange(file, fileList) {
        //     if (fileList.length > 0) {
        //         this.fileList = [fileList[fileList.length - 1]]
        //     }
        //     this.upText = file.name
        // },
        uploadcommoditybtn() {
            this.showUploadList = true
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => {})
        },
        open() {
            console.log('2222')
        },
        reupLoad(row) {
            console.log(row, 'row')
        },
        downLoadFailed(row) {
            console.log(row, 'row')
            window.open(row.mistakeFileUrl)
        },
        //下载模板
        downLoad() {
            let a = document.createElement('a')
            let dataurl = '/finances.xlsx'
            a.download = '批量录入模板' //指定下载的文件名
            a.href = dataurl //  URL对象
            if (document.all) {
                a.click() // 模拟点击
            } else {
                //兼容火狐点击事件
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('click', true, true)
                a.dispatchEvent(evt)
            }
            URL.revokeObjectURL(a.href) // 释放URL 对象
        }
    }
}
</script>

<style lang="scss" scoped>
.downLoadDatabtn {
    margin-left: 10px;
}
/deep/ .el-upload-list {
    display: none;
}

/deep/.upload-style > div {
    display: inline-block;
}
.uploadDialog {
    // position: relative;
    .upload-box-style {
        position: absolute;
        top: 70px;
        left: 3%;
        .remark {
            p {
                color: #909399;
                margin-top: 6px;
            }
        }
        .upload-style {
            display: flex;
            span {
                cursor: pointer;
                margin-left: 10px;
                color: #f05259;
                padding-top: 10px;
            }
        }
    }
    .downloadBtn {
        position: absolute;
        left: 16%;
        top: 70px;
    }
    .uploadList {
        margin-top: 60px;
        .uploadListbtn {
            display: flex;
        }
    }
}
</style>
