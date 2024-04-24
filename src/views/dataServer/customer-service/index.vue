<template>
    <div class="customer-wrap">
		<div class="radio-box" >
            <el-radio-group v-model="radioType" :border="false">
                <el-radio-button label="routineQuestion">常见问题</el-radio-button>
                <el-radio-button label="complaintFeedback">客诉反馈</el-radio-button>
            </el-radio-group>
        </div>
		<component :is="radioType"></component>
    </div>
</template>

<script>
import routineQuestion from './component/routine'
import complaintFeedback from './component/complaint-feedback'
export default {
	components: {
		routineQuestion,
		complaintFeedback,
	},
	name: 'customerService',
	data() {
		return {
			radioType: 'routineQuestion',
		}
	},
}
</script>

<style lang="scss" scoped>
.customer-wrap {
	border-radius: 8px;
    padding: 20px 40px 24px 40px;
    background: #fff;
    width: 100%;
}
.radio-box{
	text-align: center;
	padding: 20px;
	background: #fff;
	border-radius: 8px 8px 0 0;
	/deep/.el-radio-button__inner{
		padding: 12px 34px;
		border:none;
		background: #F0F2F5;
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #606266;
	}
	/deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
		background-color: #F05259;
		border-color:#F05259;
		box-shadow: -1px 0 0 0 #f05259;
		color: #FFFFFF;
	}
}
</style>