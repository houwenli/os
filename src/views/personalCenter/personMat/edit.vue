<template>
    <!-- 花名册编辑 -->
    <div class="branchContainer">
        <div class="form-wrap">
            <div class="fee-info" style="margin-bottom: 16px" id="pdfDom">
                <!-- <h2>{{ form1.name }}个人档案</h2> -->
                <el-form :model="form1" ref="form1" label-width="120px" class="form1" :rules="show1 ? rules : {}">
                    <div class="title" style="margin-top: 1px">
                        <span>基本信息</span>
                        <!-- <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateBasicInfo']" @click="show1 = true">编辑</el-button> -->
                    </div>
                    <div class="detail">
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="姓名：" prop="name">
                                <el-input
                                    v-model.trim="form1.name"
                                    maxlength="10"
                                    style="width: 100%"
                                    :disabled="!show1"
                                    placeholder="请输入"
                                    clearable
                                    v-emoji
                                ></el-input>
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="司龄(天)：">
                                    <el-input v-model.trim="form1.workingDays" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="员工ID ：" prop="id">
                                    <el-input v-model.trim="form1.id" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工号：" prop="jobNumber">
                                    <el-input v-model.trim="form1.jobNumber" style="width: 100%" maxlength="10" :disabled="!show1" placeholder="请输入" v-emoji clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号：">
                                    <el-input v-model.trim="form1.phone" maxlength="11" @input="number" style="width: 100%" clearable disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="办公地点：" prop="officeAddressId">
                                    <el-select v-model.trim="form1.officeAddressId" style="width: 100%" :disabled="!show1" clearable>
                                        <el-option v-for="item in officeAddressLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="员工类型：" prop="employeeType" placeholder="请选择">
                                    <el-select v-model.trim="form1.employeeType" style="width: 100%" :disabled="!show1" clearable>
                                        <el-option v-for="item in employeeTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="员工状态：">
                                    <el-input v-model.trim="form1.employeeStatusName" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="直属上级：">
                                    <el-input v-model.trim="form1.directSupervisor" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="导师：" prop="tutorId">
                                    <el-input @focus="dialogVisible = true" v-model="form1.tutorName" :disabled="!show1" :suffix-icon="form1.tutorName ? '' : 'el-icon-user'" class="chooseMan" placeholder="请选择" clearable @clear="handleClear"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <el-form :model="form2" ref="form2" label-width="120px" class="form2" :rules="show2 ? rules : {}">
                    <div class="title titleTop">
                        <span>个人信息</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updatePersonalInfo']" @click="show2 = true">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="身份证号码：" prop="identityCard">
                                    <el-input v-model.trim="form2.identityCard" style="width: 100%" :disabled="!show2" placeholder="请输入15位或18位身份证号码" maxlength="18" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="籍贯：" prop="nativePlace">
                                    <el-input v-model.trim="form2.nativePlace" v-emoji  maxlength="10" style="width: 100%" :disabled="!show2" placeholder="请输入" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="出生日期：" prop="birthday">
                                    <el-date-picker v-model="form2.birthday" type="date" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :disabled="!show2" @change="birthdatChange" :picker-options="pickerOptions" clearable></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="性别：" prop="sex">
                                    <el-select v-model="form2.sex" style="width: 100%" :disabled="!show2" clearable>
                                        <el-option v-for="item in sexs" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生日月份：">
                                    <el-input v-model="form2.birthdayMonth" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" v-if="!show2">
                                <el-form-item label="年龄：">
                                    <el-input v-model="form2.age" style="width: 100%" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="身份证住址：" prop="identityCardAddress">
                                    <el-input v-model.trim="form2.identityCardAddress" maxlength="50" style="width: 100%" :disabled="!show2" placeholder="请输入" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="民族：" prop="nation">
                                    <el-input v-model.trim="form2.nation" maxlength="10" style="width: 100%" :disabled="!show2" placeholder="请输入" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="目前住址：" prop="currentAddress">
                                    <el-input v-model.trim="form2.currentAddress" maxlength="50" style="width: 100%" :disabled="!show2" placeholder="请输入" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="户口类型：" prop="registeredResidenceType">
                                    <el-select v-model.trim="form2.registeredResidenceType" style="width: 100%" :disabled="!show2" clearable>
                                        <el-option v-for="item in registeredResidenceTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="婚姻状况：" prop="maritalStatus">
                                    <el-select v-model.trim="form2.maritalStatus" style="width: 100%" :disabled="!show2" clearable>
                                        <el-option v-for="item in maritalStatuss" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生育状况：" prop="fertilityStatus">
                                    <el-select v-model.trim="form2.fertilityStatus" style="width: 100%" :disabled="!show2" clearable>
                                        <el-option v-for="item in fertilityStatuss" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="个人邮箱：" prop="email">
                                    <el-input v-model.trim="form2.email" maxlength="30" style="width: 100%" :disabled="!show2" placeholder="请输入" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="政治面貌：">
                                    <el-select v-model.trim="form2.politicalType" style="width: 100%" :disabled="!show2" clearable @change="getPoliticalTypes">
                                        <el-option v-for="item in politicalTypes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="入党时间：" v-if="form2.politicalType==4">
                                    <el-date-picker v-model="form2.joinPartyDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :disabled="!show2 || !form2.politicalType || form2.politicalType != 4" clearable></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="edit-box" v-if="show2">
                        <el-button @click="cancel(2)" class="cancel">取消</el-button>
                        <el-button @click="save(2)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form3" ref="form3" label-width="120px" class="form3" :rules="show3 ? rules : {}">
                    <div class="title titleTop">
                        <span>教育经历</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateEducationInfo']" @click="tableEdit(3)">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-form-item label="" label-width="0">
                            <table cellspacing="0px" width="100%" class="table">
                                <tr>
                                    <th class="border" style="width: 100px">序号</th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        学历
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        毕业院校
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        专业
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        教育方式
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        起止年月
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show3">*</span>
                                        是否最高学历
                                    </th>
                                    <th class="border deal" style="width: 100px" v-if="show3">操作</th>
                                </tr>
                                <tr v-for="(item, index) in form3.list" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td v-if="!show3">{{ item.educationName }}</td>
                                    <td v-if="!show3">{{ item.schoolName }}</td>
                                    <td v-if="!show3">{{ item.major }}</td>
                                    <td v-if="!show3">{{ item.educationalModeName }}</td>
                                    <td v-if="!show3">{{ item.startTime.substring(0, 7) + '~' + item.endTime.substring(0, 7) }}</td>
                                    <td v-if="!show3">{{ item.firstDegreeName }}</td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.education`" :rules="index == 0 ? [{ required: true, message: '请选择学历', trigger: 'change' }] : []">
                                            <el-select v-model="form3.list[index].education" style="width: 100%" placeholder="请选择" :disabled="!show3" clearable>
                                                <el-option v-for="item in highestEducationNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.schoolName`" :rules="index == 0 ? [{ required: true, message: '请输入毕业院校', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form3.list[index].schoolName" placeholder="请输入" clearable style="width: 100%" maxlength="20"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.major`" :rules="index == 0 ? [{ required: true, message: '请输入专业', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form3.list[index].major" placeholder="请输入" clearable style="width: 100%" maxlength="20"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.educationalMode`" :rules="index == 0 ? [{ required: true, message: '请选择教育方式', trigger: 'change' }] : []">
                                            <el-select v-model="form3.list[index].educationalMode" placeholder="请选择" style="width: 100%" clearable>
                                                <el-option v-for="item in educationalModes" :key="item.id" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.endTime`" :rules="index == 0 ? [{ required: true, message: '请选择起止年月', trigger: 'change' }] : []">
                                            <ws-date-range style="width: 100%" :disabled="!show3" :intervalTime="9999" :startTime.sync="form3.list[index].startTime" :endTime.sync="form3.list[index].endTime" valueFormat="yyyy-MM-dd HH:mm:ss" type="monthrange"></ws-date-range>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3">
                                        <el-form-item :prop="`list.${index}.firstDegree`" :rules="index == 0 ? [{ required: true, message: '请选择是否最高学历', trigger: 'change' }] : []">
                                            <el-select v-model="form3.list[index].firstDegree" style="width: 100%" :disabled="!show3" clearable>
                                                <el-option v-for="item in firstDegrees" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show3" class="deal">
                                        <i class="el-icon-circle-plus icon-style" @click="add(3,index)"></i>
                                        <i class="el-icon-remove icon-style" @click="remove(index, 3)" style="margin-left: 20px"></i>
                                    </td>
                                </tr>
                            </table>
                            <div class="empty_text" v-show="!form3.list.length">
                                <img src="../../../assets/images/default-table-content.png" alt />
                                <p>暂无数据</p>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="edit-box" v-if="show3">
                        <el-button @click="cancel(3)" class="cancel">取消</el-button>
                        <el-button @click="save(3)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form4" ref="form4" label-width="120px" class="form4" :rules="show4 ? rules : {}">
                    <div class="title titleTop">
                        <span>银行卡信息</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateBankCardInfo']" @click="show4 = true">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="工资银行卡号：" prop="bankCardNumber" :rules="rules.bankCardNumber">
                                <el-input
                                    v-model.trim="form4.bankCardNumber"
                                    :maxlength="21"
                                    style="width: 100%"
                                    :disabled="!show4"
                                    clearable
                                    @blur="hanleBlur(form4.bankCardNumber)"
                                    v-emoji
                                ></el-input>
                            </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item prop="bankName" label="银行名称：">
                                    <el-input v-model.trim="form4.bankName" placeholder="系统自动校验" style="width: 100%" disabled clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="分行名称：" prop="bankBranchName">
                                    <el-input v-model.trim="form4.bankBranchName" maxlength="20" style="width: 100%" :disabled="!show4" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="支行名称：" prop="bankSubBranchName">
                                    <el-input v-model.trim="form4.bankSubBranchName" maxlength="20" style="width: 100%" :disabled="!show4" clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="edit-box" v-if="show4">
                        <el-button @click="cancel(4)" class="cancel">取消</el-button>
                        <el-button @click="save(4)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form5" ref="form5" label-width="120px" class="form5" :rules="show5 ? rules : {}">
                    <div class="title">
                        <span>紧急联系人信息</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateEmergencyContactInfo']" @click="tableEdit(5)">
                            编辑
                        </el-button>
                    </div>
                    <div class="detail">
                        <el-form-item label="" label-width="0">
                            <table cellspacing="0px" width="100%" class="table">
                                <tr>
                                    <th class="border" style="width: 100px">序号</th>
                                    <th class="border">
                                        <span class="star" v-if="show5">*</span>
                                        姓名
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show5">*</span>
                                        关系
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show5">*</span>
                                        联系电话
                                    </th>
                                </tr>
                                <tr v-for="(item, index) in form5.list" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td v-if="!show5">{{ item.name }}</td>
                                    <td v-if="!show5">{{ item.relation }}</td>
                                    <td v-if="!show5">{{ item.phone }}</td>
                                    <td v-if="show5">
                                        <el-form-item :prop="`list.${index}.name`" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
                                            <el-input v-model.trim="form5.list[index].name" placeholder="请输入" clearable style="width: 100%" maxlength="10"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show5">
                                        <el-form-item :prop="`list.${index}.relation`" :rules="[{ required: true, message: '请输入关系', trigger: 'blur' }]">
                                            <el-input v-model.trim="form5.list[index].relation" placeholder="请输入" clearable style="width: 100%" maxlength="10"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show5">
                                        <el-form-item :prop="`list.${index}.phone`" :rules="[
                                                { required: true, message: '请输入联系电话', trigger: 'blur' },
                                                {
                                                    pattern: $regexList.get('mobile'),
                                                    message: '输入的手机号码格式不正确',
                                                    trigger: 'blur'
                                                }
                                            ]">
                                            <el-input v-model.trim="form5.list[index].phone" placeholder="请输入11位手机号" clearable style="width: 100%" maxlength="11"></el-input>
                                        </el-form-item>
                                    </td>
                                </tr>
                            </table>
                            <div class="empty_text" v-show="!form5.list.length">
                                <img src="../../../assets/images/default-table-content.png" alt />
                                <p>暂无数据</p>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="edit-box" v-if="show5">
                        <el-button @click="cancel(5)" class="cancel">取消</el-button>
                        <el-button @click="save(5)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form6" ref="form6" label-width="120px" class="form6" :rules="show6 ? rules : {}">
                    <div class="title">
                        <span>工作经历</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateJobInfo']" @click="tableEdit(6)">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-form-item label="" label-width="0">
                            <table cellspacing="0px" width="100%" class="table">
                                <tr>
                                    <th class="border" style="width: 100px">序号</th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        公司名称
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        起止年月
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        部门
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        职位
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        证明人姓名
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show6">*</span>
                                        证明人联系电话
                                    </th>
                                    <th class="border deal" style="width: 100px" v-if="show6">操作</th>
                                </tr>
                                <tr v-for="(item, index) in form6.list" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td v-if="!show6">{{ item.companyName }}</td>
                                    <td v-if="!show6">{{ item.startTime.substring(0, 7) + '~' + item.endTime.substring(0, 7) }}</td>
                                    <td v-if="!show6">{{ item.departmentName }}</td>
                                    <td v-if="!show6">{{ item.positionName }}</td>
                                    <td v-if="!show6">{{ item.witness }}</td>
                                    <td v-if="!show6">{{ item.witnessPhone }}</td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.companyName`" :rules="index == 0 ? [{ required: true, message: '请填写公司名称', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form6.list[index].companyName" placeholder="请输入" style="width: 100%" maxlength="30"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.endTime`" :rules="index == 0 ? [{ required: true, message: '请选择起止年月', trigger: 'blur' }] : []">
                                            <ws-date-range style="width: 100%" :disabled="!show6" :intervalTime="9999" :startTime.sync="form6.list[index].startTime" :endTime.sync="form6.list[index].endTime" valueFormat="yyyy-MM-dd HH:mm:ss" type="monthrange"></ws-date-range>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.departmentName`" :rules="index == 0 ? [{ required: true, message: '请填写部门', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form6.list[index].departmentName" placeholder="请输入" style="width: 100%" maxlength="20"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.positionName`" :rules="index == 0 ? [{ required: true, message: '请填写职位', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form6.list[index].positionName" placeholder="请输入" style="width: 100%" maxlength="20"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.witness`" :rules="index == 0 ? [{ required: true, message: '请填写证明人姓名', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form6.list[index].witness" placeholder="请输入" style="width: 100%" maxlength="10"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6">
                                        <el-form-item :prop="`list.${index}.witnessPhone`" :rules="[
                                                { required: index == 0, message: '请填写证明人联系电话', trigger: 'blur' },
                                                {
                                                    pattern: $regexList.get('mobile'),
                                                    message: '输入的手机号码格式不正确',
                                                    trigger: 'blur'
                                                }
                                            ]">
                                            <el-input v-model.trim="form6.list[index].witnessPhone" placeholder="请输入" style="width: 100%" maxlength="11"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show6" class="deal">
                                        <i class="el-icon-circle-plus icon-style" @click="add(6,index)"></i>
                                        <i class="el-icon-remove icon-style" @click="remove(index, 6)" style="margin-left: 20px"></i>
                                    </td>
                                </tr>
                            </table>
                            <div class="empty_text" v-show="!form6.list.length">
                                <img src="../../../assets/images/default-table-content.png" alt />
                                <p>暂无数据</p>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="edit-box" v-if="show6">
                        <el-button @click="cancel(6)" class="cancel">取消</el-button>
                        <el-button @click="save(6)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form7" ref="form7" label-width="120px" class="form7" :rules="show7 ? rules : {}">
                    <div class="title">
                        <span>家庭成员</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateFamilyInfo']" @click="tableEdit(7)">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-form-item label="" label-width="0">
                            <table cellspacing="0px" width="100%" class="table">
                                <tr>
                                    <th class="border" style="width: 100px">序号</th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        姓名
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        关系
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        年龄
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        工作单位
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        职务
                                    </th>
                                    <th class="border">
                                        <span class="star" v-if="show7">*</span>
                                        联系电话
                                    </th>
                                    <th class="border deal" style="width: 100px" v-if="show7">操作</th>
                                </tr>
                                <tr v-for="(item, index) in form7.list" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td v-if="!show7">{{ item.name }}</td>
                                    <td v-if="!show7">{{ item.relation }}</td>
                                    <td v-if="!show7">{{ item.age }}</td>
                                    <td v-if="!show7">{{ item.companyName }}</td>
                                    <td v-if="!show7">{{ item.positionName }}</td>
                                    <td v-if="!show7">{{ item.phone }}</td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.name`" :rules="index == 0 ? [{ required: true, message: '请填写姓名', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form7.list[index].name" placeholder="请输入" style="width: 100%" maxlength="10"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.relation`" :rules="index == 0 ? [{ required: true, message: '请填写关系', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form7.list[index].relation" placeholder="请输入" style="width: 100%" maxlength="10"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.age`" :rules="[
                                                { required: index == 0, message: '请填写年龄', trigger: 'blur' },
                                                {
                                                    pattern: /^(0|[1-9][0-9]{0,2})$/,
                                                    message: '只能输入数字',
                                                    trigger: 'blur'
                                                }
                                            ]">
                                            <el-input v-model.trim="form7.list[index].age" placeholder="请输入" style="width: 100%" maxlength="3"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.companyName`" :rules="index == 0 ? [{ required: true, message: '请填写工作单位', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form7.list[index].companyName" placeholder="请输入" style="width: 100%" maxlength="30"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.positionName`" :rules="index == 0 ? [{ required: true, message: '请填写职务', trigger: 'blur' }] : []">
                                            <el-input v-model.trim="form7.list[index].positionName" placeholder="请输入" style="width: 100%" maxlength="20"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7">
                                        <el-form-item :prop="`list.${index}.phone`" :rules="[
                                                { required: index == 0, message: '请填写联系电话', trigger: 'blur' },
                                                {
                                                    pattern: $regexList.get('mobile'),
                                                    message: '输入的手机号码格式不正确',
                                                    trigger: 'blur'
                                                }
                                            ]">
                                            <el-input v-model.trim="form7.list[index].phone" placeholder="请输入" style="width: 100%" maxlength="11"></el-input>
                                        </el-form-item>
                                    </td>
                                    <td v-if="show7" class="deal">
                                        <i class="el-icon-circle-plus icon-style" @click="add(7,index)"></i>
                                        <i class="el-icon-remove icon-style" @click="remove(index, 7)" style="margin-left: 20px"></i>
                                    </td>
                                </tr>
                            </table>
                            <div class="empty_text" v-show="!form7.list.length">
                                <img src="../../../assets/images/default-table-content.png" alt />
                                <p>暂无数据</p>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="edit-box" v-if="show7">
                        <el-button @click="cancel(7)" class="cancel">取消</el-button>
                        <el-button @click="save(7)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
                <el-form :model="form8" ref="form8" label-width="120px" class="form6" :rules="show8 ? rules : {}">
                    <div class="title">
                        <span>退役信息</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateVeteransInfo']" @click="show8 = true">编辑</el-button>
                    </div>
                    <div class="detail">
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="是否为军人：">
                                    <!-- <el-radio-group v-model="form8.veteransStatus" style="width: 100%" :disabled="!show8" :rules="show10 ? rules : {}" clearable>
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="0">否</el-radio>
                                    </el-radio-group> -->
                                    <el-select v-model="form8.veteransStatus" style="width: 100%" :disabled="!show8">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <div v-if="form8.veteransStatus == 1">
                                <el-col :span="8">
                                    <el-form-item label="部队级别：" prop="veteransForceLevel">
                                        <el-input v-model.trim="form8.veteransForceLevel" maxlength="10" style="width: 100%" :disabled="!show8" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="入伍日期：" prop="enlistDate">
                                        <el-date-picker v-model="form8.enlistDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :disabled="!show8" clearable></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="转业日期：" prop="transferDate">
                                        <el-date-picker v-model="form8.transferDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :disabled="!show8" clearable></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-row>
                    </div>
                    <div class="edit-box" v-if="show8">
                        <el-button @click="cancel(8)" class="cancel">取消</el-button>
                        <el-button @click="save(8)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>

                <el-form :model="form9" ref="form9" label-width="120px" class="form9" :rules="show9 ? rules : {}">
                    <div class="title titleTop">
                        <span>附件信息</span>
                        <el-button type="text" class="edit-btn" v-show="!isEditing && powerList['updateFile']" @click="show9 = true">编辑</el-button>
                    </div>
                    <div class="detail">
                        <MyUpload ref="uploadFile" uploadDesc="上传电子简历、面试登记表等文件；最多上传20个；单个文件最大20M，支持格式：JPEG、JPG、PNG、PDF、DOCX、DOC、XLSX、XLS、PPTX、PPT" :picSize="20971520" @getFile="getFile" :fileList="form9.list" :isUpload="show9" :isShowDownload="!show9" :isShowDelete="show9" :limitCount="20"
                            pageType="update"></MyUpload>
                    </div>
                    <div class="edit-box" v-if="show9">
                        <el-button @click="cancel(9)" class="cancel">取消</el-button>
                        <el-button @click="save(9)" class="save">
                            <p>确认</p>
                        </el-button>
                    </div>
                </el-form>
            </div>
            <section class="btnBox">
                    <el-button class="backBtn" @click="$router.push({ name: 'personalCenter', params: { activeName: 'personMat' } });">返回</el-button>
            </section>
            <!-- 选择人员 -->
             <tree-select :dialogVisible.sync="dialogVisible" title="添加人员" :expandOnClickNode="false" :moduleName="'/systemManage/taskFlow'" :listModuleName="'/systemManage/taskFlow'" :funcDefaultNode="funcDefaultNode" :maxCount.sync="treeSelectMaxCount"
            :opObj="{ selectTree: 'selectOrgTree', selectList: 'listByFuzzyName' }" :depType="1" :funcRoleProps="{
                label: 'name',
                value: 'id',
                children: 'children',
                isLeaf: 'leaf',
                disabled: setTreeDisabled
            }" @visibleChanged="
                val => {
                    treeSelectVisable = val;
                }
            " @checkedNodeChange="getCheckedNodeList"></tree-select>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import TreeSelect from './components/treeSelect/treeSelect.vue';
import MyUpload from './components/myUpload';
export default {
    components: {
        MyUpload,
        TreeSelect
    },
    data() {
        return {
            moduleName: '/personalCenter/personMat',
            baseInfo: {},
            options: [
                {
                    id: '',
                    value: ''
                }
            ],
            dialogVisible: false,
            treeSelectMaxCount: 1,
            tableConfig1: {
                data: [
                    {
                        id: '123'
                    }
                ],
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                pageId: 'id'
                // lazyQuery: {
                //     moduleName: '/customer/activity/list', //后台配置页面路径，对应当前页面路由path
                //     op: {
                //         selectList: 'activityOpration',
                //         selectCount: 'activityOpration'
                //     },
                //     afterQuery: this.afterQuery
                // }
            },
            htmlTitle: '员工档案',
            //出生日期未来时间禁用
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
             //表单校验
            rules: {
                //名字
                name: [
                     { required: true, message: '请输入员工姓名', trigger: 'blur' },
                ],
                //工号
                jobNumber: [{ required: false }, { pattern: /^[A-Za-z0-9]+$/, message: '格式错误，仅支持大小写英文字母和数字输入', trigger: 'blur' }],
                //员工类型
                employeeType: [{ required: true, message: '请选择员工类型', trigger: 'change' }],
                //办公地点
                officeAddressId: [{ required: true, message: '请选择办公地点', trigger: 'change' }],
                //身份证号码
                identityCard: [
                    { required: true, message: '请输入身份证号码', trigger: 'blur' },
                    {
                        pattern: /^([1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3})$|^([1-9]\d{5}\d{4}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])$/,
                        message: '请输入正确的15位或18位身份证号码'
                    },
                ],
                //出生日期
                birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
                //性别
                sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                //身份证住址
                identityCardAddress: [{ required: true, message: '请输入身份证地址', trigger: 'blur' }],
                //民族
                nation: [
                    { required: true, message: '请输入民族', trigger: 'blur' },
                    { pattern: /^[\s\u4e00-\u9fa5]{0,}$/, message: '格式错误，仅支持中文输入' }
                ],
                //目前住址
                currentAddress: [{ required: true, message: '请输入目前住址', trigger: 'blur' }],
                //户口类型
                registeredResidenceType: [{ required: true, message: '请选择户口类型', trigger: 'change' }],
                //婚姻状况
                maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'change' }],
                //生育状况
                fertilityStatus: [{ required: true, message: '请选择生育状况', trigger: 'change' }],
                //籍贯
                nativePlace: [
                    { required: true, message: '请输入籍贯', trigger: 'blur' },
                    { pattern: /^[\s\u4e00-\u9fa5]{0,}$/, message: '格式错误，仅支持中文输入' }
                ],
                //个人邮箱
                email: [
                    { required: true, message: '请输入个人邮箱', trigger: 'blur' },
                    {
                        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        message: '请输入正确的邮箱',
                        trigger: 'blur'
                    }
                ],
                //退役部队级别
                veteransForceLevel: [{ required: true, message: '部队级别为必填', trigger: 'blur' }],
                //银行卡校验
                // 代码理解不了找产品和测试，为了在输入空格的时候直接替换成''，同时没有错误提示，所以加上了\s
                bankCardNumber: [{ required: false }, { pattern: /^[\s0-9]+$/, message: '只能输入数字' }]
            },
            form1: {},
            form2: {},
            form3: {
                list: [
                    {
                        startTime: '',
                        endTime: '',
                        startAndEndTime: ''
                    }
                ]
            },
            form4: {},
            form5: {
                list: [
                    {
                        name: '这是',
                        relation: '123',
                        phone: '123'
                    }
                ]
            },
            form6: {
                list: [
                    {
                        startTime: '',
                        endTime: '',
                        startAndEndTime: ''
                    }
                ]
            },
            form7: {
                list: [
                    {
                        name: '这是'
                    }
                ]
            },
            form8: {
                radio: '2'
            },
            form9: {},
            show1: false,
            show2: false,
            show3: false,
            show4: false,
            show5: false,
            show6: false,
            show7: false,
            show8: false,
            show9: false,
            show10: false,
            opList: [
                'updateBasicInfo',
                'updatePersonalInfo',
                'updateEducationInfo',
                'updateBankCardInfo',
                'updateEmergencyContactInfo',
                'updateJobInfo',
                'updateFamilyInfo',
                'updateVeteransInfo',
                'updateFile'
            ],
            fileList: [],
            officeAddressLists: [],
            funcDefaultNode: [],
            isUpdate: 0,
            isOver: true
        };
    },
    computed: {
        ...mapState('personalCenter',[
            'probations',
            'contractTypes',
            'contractPeriods',
            'employeeTypes',
            'officeAddressList',
            'sexs',
            'registeredResidenceTypes',
            'maritalStatuss',
            'fertilityStatuss',
            'politicalTypes',
            'highestEducationNames',
            'educationalModes',
            'firstDegrees'
        ]),
        isEditing() {
            return this.show1 || this.show3 || this.show4 || this.show5 || this.show6 || this.show7 || this.show8 || this.show2 || this.show9;
        }
    },

    created() {
        this.getDetails();
        this.officeAddress();
    },
    methods: {
        number(val) {
            this.searchOptions.phone = val.replace(/[^\d]/g, '');
        },
        showDialog() {
            if (this.show1 == true) {
                this.dialogVisible = true;
            }
        },
        handleClear() {
            this.dialogVisible = false;
            this.funcDefaultNode = [];
            this.form1.tutorId = null;
        },
        setTreeDisabled(node, data) {
            return !data.isLeaf;
        },
        getCheckedNodeList(val) {
            if (val.length) {
                this.funcDefaultNode = val;
                this.form1.tutorId = val[0].employeeId;
                this.form1.tutorName = val[0].name;
            } else {
                this.funcDefaultNode = val;
                this.form1.tutorId = '';
                this.form1.tutorName = '';
            }
        },
        //选择非共产党员，入党时间清空
        getPoliticalTypes(value) {
            if (value !== 4 && value !== '') {
                this.form2.joinPartyDate = '';
            }
        },
        //计算当前年龄及出生月份
        birthdatChange(val) {
            let nowYear = new Date().getTime(),
                birthdayYear = new Date(val).getTime(),
                birthdayMonth = val.substring(5, 7);
            this.form2.birthdayMonth = birthdayMonth[0] == 0 ? birthdayMonth : birthdayMonth[1];
            // this.form2.age = nowYear - birthdayYear;
            console.log(nowYear,birthdayYear)
        },
        afterQuery(data) {
            return data.body || [];
        },
        //获取办公地点
        officeAddress() {
            const param = {
                op: 'selectOfficeAddressList'
            };
            this.$axios('/personnel/common/select', param).then(res => {
                this.officeAddressLists = JSON.parse(res.data);
            });
        },
        getDetails() {
            let data = {
                id: this.$route.query.id,
                op: 'selectPersonDocumentInfo'
            };
            this.$axios(this.getModuleUrl(data.op), { data: JSON.stringify(data), op: data.op })
                .then(res => {
                    let data = JSON.parse(res.data);
                    this.form1 = data.personBasicInfoVo;
                    this.form2 = data.personalInfoVo;
                    this.form3.list = data.educationInfoVoList || [];
                    this.form4 = data.bankCardInfoVo;
                    this.form5.list = data.emergencyContactInfoVoList || [];
                    this.form6.list = data.jobInfoVoList || [];
                    this.form7.list = data.familyInfoVoList || [];
                    this.form8 = data.veteransInfoVo;
                    this.form9.list = data.fileInfoVoList;
                })
                .catch(err => {});
        },
        save(val) {
            this[`form${val}`].id = this.$route.query.id;
            this.$refs[`form${val}`].validate(valid => {
                if (valid) {
                    let data = {};
                    switch (val) {
                        case 3:
                            data = {
                                employeeId: this.$route.query.id,
                                educationInfoList: this[`form${val}`].list
                            };
                            let arr = this[`form${val}`].list.filter(item => {
                                return item.firstDegree == 1;
                            });
                            console.log(arr);
                            if (arr.length != 1) {
                                this.$message.error('最高学历有且只能有1个，请调整');
                                return;
                            }
                            break;
                        case 5:
                            data = {
                                employeeId: this.$route.query.id,
                                emergencyContactInfoList: this[`form${val}`].list
                            };
                            break;
                        case 6:
                            data = {
                                employeeId: this.$route.query.id,
                                jobInfoVoList: this[`form${val}`].list
                            };
                            break;
                        case 7:
                            data = {
                                employeeId: this.$route.query.id,
                                familyInfoList: this[`form${val}`].list
                            };
                            break;
                        case 8:
                            if (this.form8.veteransStatus == 0) {
                                this.form8 = {
                                    veteransStatus: 0,
                                    veteransForceLevel: null,
                                    enlistDate: null,
                                    transferDate: null
                                };
                                this[`form${val}`].id = this.$route.query.id;
                            }
                            data = this[`form${val}`];
                            break;
                        case 9:
                            data = {
                                employeeId: this.$route.query.id,
                                fileList: this[`form${val}`].list
                            };
                            break;
                        default:
                            data = this[`form${val}`];
                    }
                    if (!this.isOver) {
                        this.$message.error('系统正在校验银行卡号开户行名称，提交失败，请在10秒后重试');
                        return;
                    }
                    if (this.$refs.uploadFile.upFlag) {
                        this.$message.warning('文件正在上传中，请稍后...');
                        return;
                    }
                    this.$axios(this.getModuleUrl(this.opList[val - 1]), { data, op: this.opList[val - 1] }).then(res => {
                        if (res.code === 1) {
                            this['show' + val] = false;
                            this.isUpdate = 1;
                            this.getDetails();
                            this.$message.success('保存成功');
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        cancel(val) {
            if(val == 9){
                this.$refs.uploadFile.cancel()
            }
            this[`show${val}`] = false;
            this.$refs[`form${val}`].resetFields();
            this.getDetails();
        },
        resetForm(val) {
            this.$refs[`form${val}`].resetFields();
        },
        add(val,index) {
            switch (val) {
                case 3:
                    if (this[`form${val}`].list.length == 7) {
                        this.$message.warning('教育经历最多只能有7条');
                        return;
                    }
                    break;
                case 6:
                    if (this[`form${val}`].list.length == 10) {
                        this.$message.warning('工作经历最多只能有10条');
                        return;
                    }
                    break;
                case 7:
                    if (this[`form${val}`].list.length == 7) {
                        this.$message.warning('家庭成员最多只能有7个');
                        return;
                    }
                    break;
            }
            this[`form${val}`].list.splice(index+1,0,{});
        },
        remove(index, val) {
            if (this[`form${val}`].list.length > 1) {
                this[`form${val}`].list.splice(index, 1);
            } else {
                let obj = {
                    3: '最高学历',
                    6: '工作经历',
                    7: '家庭成员'
                };
                this.$message.warning(`${obj[val]}至少需保留1${val == 7 ? '个' : '条'}`);
            }
        },
        getFile(fileList) {
            this.form9.list = fileList;
        },
        //银行卡号获取银行信息失去焦点blur事件
        hanleBlur(val) {
            this.form4.bankName = '';
            let valLength = val.toString().length;
            if (valLength >= 1 && valLength <= 7) {
                this.form4.bankCardNumber = '';
                this.$message.error('银行卡号位数错误');
            } else {
                this.isOver = false;
                let data = {
                    data: { bankCardNumber: this.form4.bankCardNumber },
                    op: 'checkBankCard'
                };
                this.$axios('/personnel/induction/apply/select', data, { timeout: 1000 })
                    .then(res => {
                        let data = JSON.parse(res.data);
                        this.form4.bankName = data.fullName;
                        this.isOver = true;
                    })
                    .catch(err => {
                        this.isOver = true;
                    });
            }
        },
        tableEdit(val) {
            this[`show${val}`] = true;
            if (!this[`form${val}`].list.length) this[`form${val}`].list.push({});
            if (val == 5 && this[`form${val}`].list.length < 2) this[`form${val}`].list.push({});
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.branchContainer{
    padding: 32px;
    .form-wrap {
        overflow: hidden;
        background-color: #fff !important;
        padding: 25px 32px 32px;
        margin-bottom: 64px;
        border-radius: 8px;
        .fee-info {
            margin-top: -44px;
            margin-left: -40px;
            overflow: hidden;
            margin-bottom: 32px;
            padding: 40px;
            h2 {
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin: 20px 0;
            }
            .title {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin-top: 32px;
                margin-bottom: 16px;
                .edit-btn {
                    padding-top:0px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #0088ff;
                    height: auto !important;;
                }
            }
            .titleTop{
                margin-top: 10px;
            }
            .detail {
                /deep/ .ws-table-warp {
                    min-height: 100px;
                    padding-top: 4px !important;
                    padding-bottom: 0 !important;
                    .pagination-warp {
                        padding-bottom: 0;
                        height: auto;
                    }
                }
                .ws-table__wrapper /deep/ .option-box {
                    margin-bottom: 0px !important;
                }
                .inline-block {
                    margin-right: 80px;
                    margin-top: 30px;
                    .label {
                        display: inline-block;
                        text-align: right;
                        margin-right: 15px;
                        min-width: 124px !important;
                        height: 40px;
                        line-height: 40px;
                    }
                    .text {
                        display: inline-block;
                        margin-right: 5px;
                        line-height: 40px;
                        word-wrap: break-word;
                    }
                }
            }
            .edit-box {
                text-align: center;
                margin: 10px 0;
                .cancel {
                    width: 160px;
                    height: 36px;
                    background: #ffffff;
                    border: 1px solid #dcdfe6;
                }
                .save {
                    width: 160px;
                    height: 36px;
                    background-color: #f05259;
                    border-radius: 4px;
                }
                p {
                    width: 120px;
                    height: 14px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 14px;
                }
            }
        }
     }
    .btnBox {
        position: fixed;
        bottom: 0;
        left: 0;
        width: calc(100% + 166px);
        height: 64px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        .backBtn {
            width: 160px;
            margin-right: 16px;
        }
    }
}

.set_btn {
    margin-top: 60px;
    text-align: center;

    .el-button {
        padding: 12px 65px;
    }
}
.flex-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.search-left {
    width: calc(100% - 200px);
    position: relative;
}
.search-right {
    position: absolute;
    right: -200px;
    top: 0;
}
.table {
    margin-bottom: 20px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    /deep/ .el-form-item {
        margin-bottom: 0 !important;
    }
    /deep/ .el-form-item__error {
        top: 86%;
        font-size: 12px;
        transform: scale(0.8);
    }
    tr:first-child {
        th {
            height: 40px;
            line-height: 40px;
        }
    }
    th,
    td {
        height: 55px;
        line-height: 55px;
    }
    th:first-child,
    td:first-child {
        width: 60px;
    }
    th {
        height: 55px;
        line-height: 55px;
        text-align: left;
        padding: 0 16px;
        background: #f5f7fa;
        border: 1px solid #ebeef5;
    }
    td {
        text-align: left;
        padding: 0 16px;
        border: 1px solid #ebeef5;
    }
    .deal {
        width: 120px;
    }
}
.icon-style {
    font-size: 32px;
    color: #f05259 !important;
    vertical-align: middle !important;
    cursor: pointer;
}
.star {
    color: #f56c6c;
}
/deep/ .el-form-item__content{
    table{
        margin-bottom:0px !important;
    }
}
.empty_text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ebeef5; 
    border-top: none; 
    padding:30px 0;
    margin-top: 0px;
    height: 197px !important;
    box-sizing: content-box;
}
</style>
