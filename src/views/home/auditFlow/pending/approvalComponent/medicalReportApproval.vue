<template>

    <div class="__approval_field_wrap_container">
      <div class="imgList_wrap_container">
             <span class="block_item_title" style="margin-top:16px;">相关证件（{{nodeFormJson.urls&&nodeFormJson.urls.length || 0}}张）</span>
              <imgCarousel style="width:100%; margin-top:16px;" :imgList="nodeFormJson.urls" />
            </div>
        <div class="block_container">
            <el-form label-position="right" label-width="120px" ref="newForm" :model="nodeFormJson" :rules="newFormrules">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">司机信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="司机ID：">{{ nodeFormJson.driverId }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">{{ nodeFormJson.phone }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="姓名：">{{ nodeFormJson.name }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码：">{{ nodeFormJson.idNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属机构：">{{ nodeFormJson.parentRelationName }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">过期时间</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12"   v-for="(item,index) in nodeFormJson.healthApproveList" 
                            :key="index">
                            <el-form-item 
                            label-width="130px"
                            style="margin-top:10px"
                            :label="typeObj[item.approveType]+ '：'"
                             :rules="item.deadline == 1 && item.expireRule == 1 ?[{ required: true, message: '请选择到期时间', trigger: 'blur' }] :[]"
                            > 
                            <!-- deadline 为0为不限制期限 -->
                              <div v-if="item.deadline == 1">
                                <span v-if="item.expireRule== 2">
                                {{item.validDays ? `自审核通过${item.validDays}天起` : ''}}
                                </span>
                                <span v-else-if="item.expireRule == 3">
                                  审核通过当天过期
                                </span>
                                <div v-else>
                                  <!-- 审核状态为3,4 可修改其他只展示文字 -->
                                  <el-date-picker
                                    v-if="[3,4].includes(dataObject.flowStatus)"
                                    v-model="item.reviewInputTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    default-time="23:59:59"
                                    :picker-options="pickerOptions"
                                    @change="healthCodeHandle"
                                    type="datetime"
                                    placeholder="选择日期"
                                    >
                                  </el-date-picker>
                                  <span v-else>{{item.reviewInputTime}}</span>
                                </div>
                              </div>
                              <span v-else>不限制期限</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        
    </div>
</template>

<script>
import imgCarousel from '@/views/home/auditFlow/components/imgCarousel.vue'
import BaseInfo from './base/approvalInfo.vue';
import download from '../components/RenderFields/download';
export default {
    //司机医学检测报告审核
    name: 'medicalReportApproval',
    components:{
      imgCarousel,
      BaseInfo
    } ,
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {}
        },
        dataObject: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
          typeObj:{
            '1':'健康码',
            '2':'疫苗接种记录',
            '3':'核酸检测报告 ',
            '4':'行程码'
          },
          pickerOptions: {
            disabledDate(time) {
              return  time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
            }
          },
          visible:false,
          currentIndex:0,
          srcList:[],
          newFormrules:{
            healthCode:[{ required: true, message: '请选择健康码到期时间', trigger: 'blur' }],
            itineraryCode:[{ required: true, message: '请选择行程码到期时间', trigger: 'blur' }],
            rnaReport:[{ required: true, message: '请选择核酸检测报告到期时间', trigger: 'blur' }],
          }   
        };
    },
    mounted() {},
    methods: {
        handleDownLoad(item) {
            download(item);
        },
        healthCodeHandle(e){
          this.$emit('formHandle',this.nodeFormJson)
        },
        onPreview(item) {
          console.log(item,'--=');
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item)}`);
        }
    }
};
</script>

<style lang="scss" scoped>
.__approval_field_wrap_container {
    margin-bottom:80px;
}
</style>
