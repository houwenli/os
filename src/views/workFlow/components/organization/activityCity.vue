<template>
    <div class="data_form">
        <h2 class="flow_title">活动城市</h2>
        <el-row v-if="formData.activityCityLimit === 0" class="form_line">
            <el-col :span="24">
                <el-form-item label="活动城市：">
                    <span>全国</span>
                </el-form-item>
            </el-col>
        </el-row>

        <ws-table-el v-else :span-method="arraySpanMethod" ref="table" v-bind="tableConfig" :data="tableData" :header-cell-style="{ background: '#F5F7FA' }">
            <template>
                <ws-table-column-el prop="provinceName" label="省"></ws-table-column-el>
                <ws-table-column-el prop="cityName" label="市"></ws-table-column-el>
                <ws-table-column-el width="1100px" prop="areaNames" label="区"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
                // autoHeight: true,
            },
            tableData: [], //table的数据
            originalData: [], //table数据备份
            provinceArr: [], //省份要合并数组 [2,0,1,3,0,0] 代表第一二行合并,第三行不变,第四五六行合并,0代表原本的那一行被合并,因此这个列被消除
            provincePos: 0, //省份要合并数组内容的序号
            cityArr: [], //同上 市
            cityPos: [],
            areaArr: [], //同上 区
            areaPos: [],
        };
    },
    watch: {
        // 'formData.codes': {
        //     deep: true,
        //     handler: function (val) {
        //         this.getCityData(val);
        //     },
        // },
    },
    created() {
        this.getCityList();
    },
    methods: {
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                //第一列的合并方法,省
                const _row_1 = this.provinceArr[rowIndex];
                const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
                return {
                    rowspan: _row_1,
                    colspan: _col_1,
                };
            } else if (columnIndex === 1) {
                //第二列的合并方法,市
                const _row_2 = this.cityArr[rowIndex];
                const _col_2 = _row_2 > 0 ? 1 : 0;
                return {
                    rowspan: _row_2,
                    colspan: _col_2,
                };
            }
        },
        merage(tabledata) {
            for (var i = 0; i < tabledata.length; i++) {
                if (i === 0) {
                    //第一行必须存在
                    this.provinceArr.push(1);
                    this.provincepos = 0;

                    this.cityArr.push(1);
                    this.citypos = 0;
                    this.areaArr.push(1);
                    this.zonepos = 0;
                } else {
                    //省
                    if (tabledata[i].provinceCode === tabledata[i - 1].provinceCode) {
                        this.provinceArr[this.provincepos] += 1;
                        this.provinceArr.push(0);
                    } else {
                        this.provinceArr.push(1);
                        this.provincepos = i;
                    }

                    //市
                    if (tabledata[i].cityCode === tabledata[i - 1].cityCode && tabledata[i].provinceCode === tabledata[i - 1].provinceCode) {
                        this.cityArr[this.citypos] += 1;
                        this.cityArr.push(0);
                    } else {
                        this.cityArr.push(1);
                        this.citypos = i;
                    }
                }
            }
        },

        async getCityList() {
            try {
                let { activityType, id, activityCityLimit } = this.formData;
                if (activityCityLimit === 0) return
                let param = {
                    op: 'getShowOrgActivityCityCode',
                    activityType,
                    id,
                };
                let res = await this._axios(param, '', '/orgPassengerAct/common/select');
                if (res.code === 1) {
                    let list = res.data;
                    this.tableData = list.map(item => {
                        return { ...item, areaNames: item.areaNames.toString() };
                    });
                    this.merage(this.tableData);
                }
            } catch (_err) {
                throw _err;
            }
        },

        // async getCityData(original) {
        //     try {
        //         let res = await this._axios({ op: 'select' }, '', '/local/selectAreaTree');
        //         if (res.code === 1) {
        //             let list = res.data; // 所有省数据
        //             let cityList = list.map(item => item.children).flat(Infinity); // 获取所有市数据
        //             let areaList = cityList.map(item => item.children).flat(Infinity); // 获取所有区数据

        //             let province = this.cityHandle(list); // 省数据 {code：name}
        //             let city = this.cityHandle(cityList); // 市数据 {code：name}
        //             let area = this.cityHandle(areaList); // 区数据 {code：name}
        //             this.tableData = this.formCodesHandle(original, province, city, area);
        //             this.merage(this.tableData);
        //         }
        //     } catch (_err) {
        //         throw _err;
        //     }
        // },

        // formCodesHandle(list, province, city, area) {
        //     let arr = [];
        //     for (let item of list) {
        //         let { areaCode, cityCode, provinceCode } = item;
        //         let provinceName = province[provinceCode];
        //         let cityName = city[cityCode];
        //         let areaName = area[areaCode] || '';
        //         let index = arr.findIndex(item => item.provinceCode == provinceCode && item.cityCode == cityCode);
        //         if (index >= 0) {
        //             arr[index].areaNames = areaName ? `${arr[index].areaNames}、${areaName}` : arr[index].areaNames;
        //         } else {
        //             arr.push({ areaCode, cityCode, provinceCode, provinceName, cityName, areaNames: areaName });
        //         }
        //     }
        //     return arr;
        // },

        // cityHandle(list) {
        //     let result = {};
        //     for (let i = 0; i < list.length; i++) {
        //         let data = list[i];
        //         if (data.code !== 0) {
        //             result[data.code] = data.name;
        //         }
        //     }
        //     return result;
        // },
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';
</style>
