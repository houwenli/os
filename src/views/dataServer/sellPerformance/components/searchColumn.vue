<template>
    <div :class="['searchBox', customClass]">
        <div class="left">
            <div class="custom" v-if="$slots.custom">
                <slot name="custom"></slot>
            </div>
            <div class="custom" v-if="showAreaSearch">
              <span>选择省份：</span>
              <ws-city
                  v-model="searchOptions.provinceCode"
                  :defaultProps="{ checkStrictly: false, emitPath: false }"
                  level="1"
                  :showCountry="true"
              ></ws-city>
            </div>
            <div class="day" v-show="showDaySearch">
                <span>日期：</span>
                <el-radio-group v-model="timeType" @change="handleTimeGroupChange" style="margin-right:5px;">
                  <el-radio-button v-for="item in timeButtonGroupList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
                <el-date-picker style="width: 270px;" v-model="searchOptions.dateTime" type="daterange" v-if="timeType == 4"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" @blur="blur">
                </el-date-picker>
            </div>
        </div>
        <div class="right">
            <ws-enter-event>
                <el-button icon="el-icon-search" type="primary" @click="search" style="width: 96px;">查询</el-button>
            </ws-enter-event>
            <ws-enter-event>
              <el-button icon="el-icon-download" type="primary" plain  @click="exportFile" v-if="showExport" style="width: 96px;">导出</el-button>
            </ws-enter-event>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String | Number,
            default: 0,
        },
        showDaySearch: {
            type: Boolean,
            default: true,
        },
        customClass: {
            type: String,
            default: ''
        },
        showExport:{
          type: Boolean,
          default: false,
        },
        showAreaSearch:{
          type: Boolean,
          default: true,
        }
    },

    data() {
        return {
            searchOptions: {
                dateTime: [
                    new Date(this.$baseMethod.getBeforeDay(-6, 'yyyy/MM/dd', new Date())),
                    new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
                ],
                provinceCode:0
            },
            timeType:2,
            timeButtonGroupList:[
              {value:1,label:'今天'},
              {value:2,label:'近7天'},
              {value:3,label:'近30天'},
              {value:4,label:'自定义'},
            ],
            choiceDate: '',
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = '';
                    }
                },
                disabledDate: time => {
                    if (this.choiceDate) {
                        const firstDay = new Date(this.$baseMethod.getBeforeDay(-30, 'yyyy/MM/dd', new Date(this.choiceDate)))
                        const lastDay = new Date(this.$baseMethod.getBeforeDay(30, 'yyyy/MM/dd', new Date(this.choiceDate)))
                        return time.getTime() < firstDay || time.getTime() > lastDay || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now() || time < new Date('2022.1.1');
                    }
                },
            },
        }
    },

    methods: {
        search() {
            const { searchOptions} = this
            this.$emit('search',
                {
                    startDay:this.$baseMethod.formatData(searchOptions.dateTime[0], 'yyyy-MM-dd') || null,
                    endDay:this.$baseMethod.formatData(searchOptions.dateTime[1], 'yyyy-MM-dd') || null,
                    provinceCode:searchOptions.provinceCode
                })
        },
        exportFile(){
          const { searchOptions } = this
          this.$emit('exportFile',
            {
              startDay:this.$baseMethod.formatData(searchOptions.dateTime[0], 'yyyy-MM-dd') || null,
              endDay:this.$baseMethod.formatData(searchOptions.dateTime[1], 'yyyy-MM-dd') || null,
              provinceCode:searchOptions.provinceCode
            })
        },
        handleTimeGroupChange(e){
          switch (e) {
            case 1:
              this.searchOptions.dateTime = [
                new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date())),
                new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
              ]
              break;
            case 2:
              this.searchOptions.dateTime = [
                new Date(this.$baseMethod.getBeforeDay(-6, 'yyyy/MM/dd', new Date())),
                new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
              ]
              break;
            case 3:
            this.searchOptions.dateTime = [
              new Date(this.$baseMethod.getBeforeDay(-30, 'yyyy/MM/dd', new Date())),
              new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
            ]
              break;
            default:
            this.searchOptions.dateTime = [
              new Date(this.$baseMethod.getBeforeDay(-30, 'yyyy/MM/dd', new Date())),
              new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
            ]
              break;
          }
        },
        blur() {
            this.choiceDate = ''
        },
    }
}
</script>

<style lang="scss" scoped>
.searchBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    height: 76px;
    padding: 0 24px;

    .left {
        display: flex;
        align-items: center;
    }
    .custom {
      margin-right: 32px;
    }
}
</style>