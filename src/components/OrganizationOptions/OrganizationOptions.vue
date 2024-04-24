<template>
    <div class="ws-organization-options">
        <el-select v-model="orgValue" class="options-wrap" @change="changeSelect()">
            <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select
            v-model="value"
            v-bind="$attrs"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入机构名称"
            value-key="orgName"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleSelect"
            @clear="clearClearable"
            class="input-wrap"
        >
            <!-- 注意这里agencyNumber超长不能做key -->
            <el-option v-for="item in listData" :key="item.orgId" :label="item.orgName" :value="item[valueKey]"></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'organization-city',
    props: {
        orgType: { type: String, default: '20' }, //20分公司  30服务站
        valueKey: { type: String, default: 'agencyNumber' }, // 获取字段，默认为agencyNumber，可选relationId
        selectOptions: { type: Array, default: () => [] }, //数据源，不传则取组件内部数据
        moduleName: { type: String, required: true },
    },
    data() {
        return {
            value: '',
            orgValue: '',
            loading: false,
            listData: [],
        };
    },
    watch: {
        orgType: {
            handler(val) {
                this.orgValue = val;
            },
            immediate: true,
        },
        value(val) {
            this.$emit('input', val);
        },
    },
    computed: {
        orgOptions() {
            return this.selectOptions.length
                ? this.selectOptions
                : [
                      {
                          value: '20',
                          label: '分公司',
                      },
                      {
                          value: '30',
                          label: '服务中心',
                      },
                      {
                          value: '40',
                          label: '服务站',
                      },
                  ];
        },
    },
    methods: {
        changeSelect() {
            this.value = '';
            this.listData = [];
        },
        handleSelect(val) {
            // let obj=this.listData.find(item=>item[this.valueKey]=val)
            this.$emit('input', val);
            // this.$emit("change", obj);//获取选中对象
        },
        clearClearable() {
            this.listData = [];
            this.$emit('input', '');
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 远程搜索
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                let params = {
                    data: {
                        orgType: this.orgValue, // 机构类型
                        orgName: query, // 机构名称
                    },
                    op: 'selectOrgByOrgName',
                };
                let URL = this.getModuleUrl(params.op);
                this.$axios(URL, params)
                    .then(res => {
                        this.loading = false;
                        // eslint-disable-next-line eqeqeq
                        if (res.code == 1) {
                            let data = JSON.parse(res.data);
                            this.listData = data;
                        } else {
                            this.listData = [];
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                    });
            } else {
                this.listData = [];
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ws-organization-options {
    display: flex;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;

    /deep/ .el-input__inner {
        border: none;
    }
    /deep/.el-input.is-focus .el-input__inner {
        border: none !important;
    }
    /deep/.el-input__inner:focus {
        border: none !important;
    }
    .options-wrap {
        width: 102px;
        flex: 0 0 102px;
        border-right: 1px solid #dcdfe6;
    }

    .input-wrap {
        flex: 1;
    }
}
</style>
