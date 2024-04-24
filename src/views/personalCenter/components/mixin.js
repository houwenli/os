import {
    mapState,
    mapActions
} from 'vuex';
export const mixin = {
    data() {
        return {
            labelWidth: '120px',
            tableHeaderStyle: {
                background: '#F5F7FA',
                'font-size': '14px',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '500',
                color: '#606266'
            },
            headerCellStyle: {
                background: '#F5F7FA',
                'font-family': 'PingFangSC-Medium, PingFang SC',
                'font-weight': '600',
                color: '#606266'
            },
            rowSpan: 8,
            rowData: {},
            isDisab:true,
            //审核流
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode'
            },
        };
    },     
    computed:{
        ...mapState('personalCenter', ['orgStateFilters', 'provinceCityList'])
    },
    methods: {
        ...mapActions('personalCenter', ['getOrgAttachmentNameList', 'getCityAreaDetail']),
        //数字8位加小数点后2位
        stintNumber(val,name) {
            this.basicsParam[name] = this.basicsParam[name].replace(/[^\d.]/g,"") //清除非 数字和小数点的字符
            this.basicsParam[name] = this.basicsParam[name].replace(/\.{2,}/g,".") //清除第二个小数点
            this.basicsParam[name] = this.basicsParam[name].replace(/^\./g,""); //验证第一个字符是数字而不是字符
            this.basicsParam[name] = this.basicsParam[name].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            this.basicsParam[name] = this.basicsParam[name].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //保留两位小数
            this.basicsParam[name] = this.basicsParam[name].indexOf(".") > 0? this.basicsParam[name].split(".")[0].substring(0, 8) + "." + this.basicsParam[name].split(".")[1]: this.basicsParam[name].substring(0, 8); //限制只能输入8位正整数
        },
        //只能输入数字
        number(val,name) {
            this.basicsParam[name] = val.replace(/[^\d]/g, '');
        },
        // 数字和纯字母
        abcNumber(val,listName,name) {
            this[listName][name] = val.replace(/[^A-Za-z0-9]/g, '');
        },
        // 
        //纯数字支持两位小数
        validateNumber(val,name){
            this.basicsParam[name] = val
              .replace(/[^\d.]/g, "")
              .replace(/\.{2,}/g, ".")
              .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
        },
        
        //------------校验---------------
        //审核流程校验
        setApprovalPer(list) {
            if (!list.length) return true;
            for(let item of list){
                  if((item.memberType=='3'||item.memberType=='4')&&item.userIds.length==0 ){
                    this.$message.error(`还有审批人没选择，请补充完整`);
                    return false
                  }
                  delete item.memberType
            }
            return true
        },
        //附件位校验
        uploadImgValidate(fileList) {
            if (!fileList.length) return true;
            try {
                fileList.map(item => {
                    if (!item.imgUrl) {
                        this.$message.error('请完善附件资料图片');
                        throw new error();
                    }
                });
                return true;
            } catch (error) {}
        },
        // 禁用时间范围，
        disabledDate(time) {
            return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },

        // -------------数据处理（审批流）-------------
        //审核流程信息处理
        setApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            let approvalInfo = allList.map((items, i) => {
                return {
                    memberType:items.memberType,
                    nodeId: items.nodeKey,
                    procDefId:items.procdefId,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return !item.isDefUser;
                        })
                        .map((item, j) => {
                            return item.id;
                        }),
                };
            });
            return approvalInfo;
        },  
        //高亮数据处理
        getNewData(rawData, newData) {
            if(newData.orgType=='20'){
                  let newList=newData.rpcCompanyAssociationAo.rpcJAAoList;
                  let rawList=rawData.rpcCompanyAssociationAo.rpcJAVoList;
                  newList.forEach((newItem,newIndex)=>{
                    for (let index = 0; index < rawList.length; index++) {
                        if(newItem.orgName==rawList[index].orgName&&newItem.duties==rawList[index].duties&&newItem.joinTime==rawList[index].joinTime&&!newItem.opType){                     
                                newList[newIndex].opType=1
                        }
                    }
                    if(!newItem.opType){
                        newList[newIndex].opType=2 
                    }
                  })
            }
            let data = {};
            for (let item in rawData) {
                data[item] = [];
            }
            for (let list in rawData) {
                for (let item in rawData[list]) {
                    if (!this.isObject(rawData[list][item]) && !this.isArray(rawData[list][item]) && rawData[list][item] != newData[list][item]) {
                        data[list].push(item);
                    }
                }
            }
            return data;
        },
        // 判断此对象是不是Object类型
        isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        // 判断此类型是不是Array类型
        isArray(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        },

        // -------------数据处理（基本信息）-------------  
        // 机构所在地区变化
        getSubmitAreaName(val) {
            let vm = this;
            let list = vm.localJurisdictionList.filter(item => item.code == val) || [];
            if (list.length) {
                vm.basicsParam.submitAreaName = list[0].name; //机构所在地区-区
            }
        },
        // 业务城市变化
        getCityNameList(val, list) {
            let vm = this;
            vm.basicsParam.cityName = list.cityName; //业务城市-市
            vm.basicsParam.provinceName = list.provinceName; //业务城市-省
        },
        //根据省市获取区域 获取省市名称
        getLocalJurisdictionList(code, isArea) {
            let vm = this;
            let city,
                areaList = [];
            city = vm.provinceCityAreaList.filter(item => item.code == code[0]) || [];
            if (city.length) {
                areaList = city[0]['children'].filter(e => e.code == code[1]) || [];
                if (!isArea) {
                    vm.basicsParam.cityName = areaList[0].name || ''; //业务城市-市
                    vm.basicsParam.provinceName = city[0].name || ''; //业务城市-省
                    return;
                }
                vm.localJurisdictionList = (areaList.length && areaList[0].children) || [];
                vm.basicsParam.submitCityName = areaList[0].name || ''; //机构所在地区-市
                vm.basicsParam.submitProvinceName = city[0].name || ''; //机构所在地区-省
                vm.getSubmitAreaName(vm.basicsParam.submitAreaCode);
            }
            return;
        },
        //采集地址
        choiceAddress() {
            let vm=this
            vm.mapShow=true
            vm.cityOpt={
                label:vm.basicsParam.submitCityName,
                cityCode:vm.basicsParam.provinceList[0]
            }
        },
        addressSure({ lat, lng, formattedAddress }) {
            let vm = this;
            vm.basicsParam.longitude = lat;
            vm.basicsParam.latitude = lng;
            vm.basicsParam.address = formattedAddress;
        },

        // -------------数据处理（附件信息）------------- 
        //附件上传完成
        afterUpload(res,index) {
            try {
                let { publicDownUrl, publicDownWaterMarkUrl, publicWmFileId } = JSON.parse(res.data);
                this.imgList = {
                    imgUrl: publicDownUrl,
                    waterMarkImageUrl: publicDownWaterMarkUrl,
                    waterMarkImageFileId: publicWmFileId
                };
                let imgArr = {
                    ...this.fileList[index],
                    ...this.imgList,
                    opType: 2
                };
                this.fileList.splice(index, 1, imgArr);
                return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        //附件删除
        handleRemove(url,index) {
            try {
                for (let item in this.imgList) {
                    delete this.fileList[index][item];
                }
                return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        //附件数据处理
        getUrlList(item) {
            let url;
            if (item.waterMarkImageUrl) {
                url = item.waterMarkImageUrl;
            } else {
                url = item.imgUrl;
            }

            if (url) {
                return [url];
            }
        },
        //附件信息与附件位匹配
        setFileList(fileList, arr) {
            fileList.map((item, index) => {
                fileList[index] = {
                    name: fileList[index].name,
                    attachmentTypeID: fileList[index].id
                };
            });
            if (!arr) {
                return fileList;
            }
            fileList.map((item, index) => {
                arr.map(i => {
                    if (item.attachmentTypeID == i.attachmentTypeID) {
                        delete i.name;
                        fileList[index] = { ...i, name: fileList[index].name, attachmentTypeID: fileList[index].attachmentTypeID };
                    }
                });
            });
            return fileList;
        },

        // -------------数据处理（按钮）------------- 
        //返回
        cancel() {
            this.$router.push({ name:'personalCenter' });
        }
    },
};
