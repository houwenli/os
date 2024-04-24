<template>
    <div>
        <el-select v-model="provinceCode1" filterable placeholder="全部" :disabled="isDisabled" @change="changeProvinceCode" class="mr10">
            <el-option v-for="item in provinceList" :key="item.code" :label="item.name" @click.native="getValueName(item.name)" :value="item.code">
            </el-option>
        </el-select>
        <el-select v-model="cityCode1" filterable placeholder="全部" :disabled="isDisabled" @change="changeCityCode">
            <el-option v-for="item in cityList" :key="item.code" :label="item.name" @click.native="getValueName(item.name)" :value="item.code">
            </el-option>
        </el-select>
    </div>
</template>

<script>
//   import {
//     getProvinceSelect,
//     getProvinceCityInfoSelect,
//   } from '@/apis/common';

export default {
    props: {
        title: {
            type: String,
        },
        provinceCode: {
            type: [Number, String],
        },
        cityCode: {
            type: [Number, String],
        },
        isDisabled: {
            type: Boolean,
        },
        showAll: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            moduleName: "/workbench/orderHotSpot",
            provinceCode1: this.provinceCode,
            provinceList: [],
            cityCode1: this.cityCode,
            cityList: [],
        };
    },
    created () {
    },
    mounted () {
        this.getProvince();
        if (this.cityCode) {
            this.getProvinceCityInfo(this.provinceCode)
        }
    },
    watch: {
        'provinceCode': {
            handler (val) {
                this.provinceCode1 = val ? val : '';
                if (val) {
                    this.getProvince(val);
                }
            },
            deep: true
        },
        'cityCode': {
            handler (val) {
                this.cityCode1 = val ? val : '';
            },
            deep: true
        }
    },
    methods: {
        // 获取全部省
        async getProvince (val) {
            try {
                let params = {
                    op: 'getProvince',
                    data: {}
                }
                let URL = this.powerList.getProvince;
                let result = await this.$axios(URL, params);
                if (result.code == 1) {
                    let resultArr = JSON.parse(result.data)
                    let removeList = []
                    if (this.showAll) {
                        removeList = [0] // 需要筛选掉的城市code列表
                    } else {
                        removeList = [0, 2] // 需要筛选掉的城市code列表
                    }
                    this.provinceList = resultArr.filter(item => !removeList.includes(item.code))
                    if (val) {
                        this.getProvinceCityInfo(val);
                    }
                }else{
                    this.$message.error(result.msg)
                }
            } catch (error) {
            }
        },
        // change省事件
        changeProvinceCode (val) {
            if (val) {
                this.provinceCode1 = val;
                this.getProvinceCityInfo(val);
                this.cityCode1 = '';
                this.$emit('pushProvinces', {
                    provinceCode: this.provinceCode1,
                    cityCode: null
                });
            }
        },
        // 获取省下面市
        async getProvinceCityInfo (val) {
            this.cityList = []
            try {
                let params = {
                    op: 'getProvinceCityInfo',
                    data: {
                        provinceCode: val,
                    }
                }
                let URL = this.powerList.getProvinceCityInfo;
                let result = await this.$axios(URL, params);
                // const data = await getProvinceCityInfoSelect(params);
                if(result.code === 1){
                    let resultArr = JSON.parse(result.data)
                    if (Array.isArray(resultArr)) {
                        if (this.showAll) {
                            const removeList = [0] // 需要筛选掉的城市code列表
                        } else {
                            const removeList = [0, 2] // 需要筛选掉的城市code列表
                        }
                        if (this.showAll) {
                            this.cityList = resultArr;
                        } else {
                            this.cityList = resultArr.filter(item => ![2].includes(item.code))
                        }
                    }
                }else{
                    this.$message.error(result.msg)
                }
                
            } catch (error) {
            }
        },
        // change市事件
        changeCityCode (val) {
            if (val) {
                this.$emit('pushProvinces', {
                    provinceCode: this.provinceCode1,
                    cityCode: val
                });
            } else {
            }
        },
        getValueName (data) {
            // console.log(data)
            this.$emit('getValueName', {
                address: data
            });

        }
    }
};
</script>

<style scoped lang="scss">
.edit-title {
    padding: 15px;
}

.el-form-item {
}
</style>

