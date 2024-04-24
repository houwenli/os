<!--只能查询到自己所属的机构数据-->
<template>
  <div class="ws-organization-options">
    <el-select v-if="showSelect" v-model="orgValue" v-bind="$attrs" class="options-wrap" :placeholder="placeholder" @change="changeOrg" :popper-append-to-body="false">
      <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-if="showSearch" v-model="selectValue" v-bind="$attrs" filterable remote reserve-keyword :placeholder=placeholder2 :remote-method="remoteMethod" @change="handleSelect"
      @clear="handleClear" :value-key="valueKey" :loading="loading" :popper-append-to-body="false" clearable class="input-wrap">
      <el-option v-for="item in options" :key="item[valueKey]" :label="item.orgName" :value="item[valueKey]"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
    name: 'organization-options',
    props: {
        value: { type: [String, Number, Array] },
        orgType: { type: String, default: '' }, //20分公司  30服务中心  30服务站
        valueKey: { type: String, default: 'relationId' }, // 获取字段，默认为relationId，可选agencyNumber
        selectOptions: { type: Array, default: () => [] }, //数据源，不传则取组件内部数据
        placeholder: { type: String, default: '请选择类型' },
        placeholder2: { type: String, default: '请输入机构名称搜索' },
        showSelect: { type: Boolean, default: true },
        centerType: { type: Boolean, default: false },
        showSearch: { type: Boolean, default: true },
    },
    computed: {
        orgOptions() {
            return this.selectOptions.length
                ? this.selectOptions
                : [
                      {
                          value: '20',
                          label: '一级机构',
                      },
                      {
                          value: '30',
                          label: '二级机构',
                      },
                      {
                          value: '40',
                          label: '实体店',
                      },
                  ];
        },
    },
    watch: {
        orgType: {
            handler(val) {
                if (val) {
                    this.flag = true;
                }
                this.orgValue = val;
            },
            immediate: true,
        },
        value: {
            handler(val) {
                this.selectValue = val;
                if (this.showSelect && !val && !this.flag && this.orgOptions.length !== 1) {
                    this.orgValue = '';
                    this.flag = false;
                }
            },
        },
    },
    data() {
        return {
            selectValue: '',
            orgValue: '',
            options: [],
            loading: false,
            flag: false,
        };
    },
    methods: {
        changeOrg(val) {
            this.flag = true;
            this.selectValue = '';
            this.$emit('orgTypeChange', val);
            this.$emit('input', '');
            this.options = [];
        },
        remoteMethod(queryString) {
            if (!this.orgValue) {
                this.$message.error('请选择机构类型后搜索');
                return;
            }
            if (queryString !== '' && queryString.length > 1) {
                this.loading = true;
                let data = {
                    orgName: queryString,
                    orgType: this.orgValue,
                };
                if (this.orgValue == 30 && this.centerType) {
                    data.centerType = 1;
                }
                let params = {
                    data,
                    op: 'selectOrgByName',
                };

                this.$axios('/authority/personalCenter/select', params)
                    .then(res => {
                        this.loading = false;
                        let data = JSON.parse(res.data).body || [];
                        this.options = data;
                    })
                    .catch(err => (this.options = []));
            } else {
                this.options = [];
            }
        },
        handleSelect(value) {
            this.$emit('input', value);
            this.$emit('select', value);
        },
        handleClear() {
            this.$emit('select', '');
            this.$emit('input', '');
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
    /deep/ .el-input.is-focus .el-input__inner {
        border: none !important;
    }
    /deep/ .el-input__inner:focus {
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
