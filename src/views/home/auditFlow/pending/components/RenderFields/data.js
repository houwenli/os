export const fields = [
    {
        // 网约车审批 司机入网申请
        approvalType: 1,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '性别',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'sex',
                            __slot__: {
                                options: [
                                    {
                                        label: '男',
                                        value: 1
                                    },
                                    {
                                        label: '女',
                                        value: 0
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '年龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'ageExperience',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级人证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '无人证',
                                        value: 0
                                    },
                                    {
                                        label: '有人证',
                                        value: 1
                                    },
                                    {
                                        label: '人证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'outterDriverCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统人证',
                                tag: 'el-select',
                                span: 12,
                                placeholder: '请选择',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择',
                                        trigger: 'blur'
                                    }
                                ]
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __rules__: {},
                            __vModel__: 'innerDriverCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '驾驶员信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾驶证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '初次领证日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingAgeStr',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '品牌车型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carBrandName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '注册日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'registerDate',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carExperience',
                            style: null,
                            className: null
                        },

                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级车证',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'outerCarCertState',
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '无车证',
                                        value: 0
                                    },
                                    {
                                        label: '有车证',
                                        value: 1
                                    },
                                    {
                                        label: '车证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车身颜色',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carColorName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统车证',
                                tag: 'el-select',
                                span: 12,
                                placeholder: '请选择',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择',
                                        trigger: 'blur'
                                    }
                                ]
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __rules__: [],
                            __vModel__: 'innerCarCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车辆类型',
                                tag: 'el-select',
                                span: 12,
                                placeholder: '请选择',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择',
                                        trigger: 'blur'
                                    }
                                ]
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '私家车',
                                        value: 1
                                    },
                                    {
                                        label: '出租车',
                                        value: 2
                                    }
                                ]
                            },
                            __rules__: {},
                            __vModel__: 'carType',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 司机修改资料
        approvalType: 2,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '更改资料',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __vModel__: 'startUserName',
                        //     style: null,
                        //     className: null
                        // }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '性别',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'sex',
                            style: null,
                            className: null,
                            __slot__: {
                                options: [
                                    {
                                        label: '男',
                                        value: 1
                                    },
                                    {
                                        label: '女',
                                        value: 0
                                    }
                                ]
                            }
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '年龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'ageExperience',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级人证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '无人证',
                                        value: 0
                                    },
                                    {
                                        label: '有人证',
                                        value: 1
                                    },
                                    {
                                        label: '人证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'outterDriverCertState',
                            style: null,
                            className: null
                            //  0 待校验 -1、无  1、有  2、过期  3、不可查
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '驾驶员信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾驶证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '初次领证日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingAgeStr',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '品牌车型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carBrandName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '注册日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'registerDate',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carExperience',
                            style: null,
                            className: null
                        },

                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级车证',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'outerCarCertState',
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '无车证',
                                        value: 0
                                    },
                                    {
                                        label: '有车证',
                                        value: 1
                                    },
                                    {
                                        label: '车证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车身颜色',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carColorName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车辆类型',
                                tag: 'el-select',
                                span: 12,
                                placeholder: '请选择',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入活动名称',
                                        trigger: 'blur'
                                    }
                                ]
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '私家车',
                                        value: 1
                                    },
                                    {
                                        label: '出租车',
                                        value: 2
                                    }
                                ]
                            },
                            __rules__: {},
                            __vModel__: 'carType',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 司机头像审核
        approvalType: 3,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '性别',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'sex',
                            __slot__: {
                                options: [
                                    {
                                        label: '男',
                                        value: 1
                                    },
                                    {
                                        label: '女',
                                        value: 0
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '年龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverAge',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 车辆保险审核
        approvalType: 4,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '更改保险',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __vModel__: 'startUserName',
                        //     style: null,
                        //     className: null
                        // }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机&车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车辆ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 合规资质审核
        approvalType: 5,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '更改合规资质',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __vModel__: 'startUserName',
                        //     style: null,
                        //     className: null
                        // }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '部级人证',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __vModel__: 'outterDriverCertState',
                        //     style: null,
                        //     __slot__: {
                        //         options: [
                        //             {
                        //                 label: '无人证',
                        //                 value: -1
                        //             },
                        //             {
                        //                 label: '无人证',
                        //                 value: 0
                        //             },
                        //             {
                        //                 label: '有人证',
                        //                 value: 1
                        //             },
                        //             {
                        //                 label: '人证过期',
                        //                 value: 2
                        //             },
                        //             {
                        //                 label: '不可查',
                        //                 value: 3
                        //             }
                        //         ]
                        //     },
                        //     className: null
                        // },
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '系统人证',
                        //         tag: 'el-select',
                        //         span: 12,
                        //         placeholder: '请选择',
                        //         rules: [
                        //             {
                        //                 required: true,
                        //                 message: '请输入活动名称',
                        //                 trigger: 'blur'
                        //             }
                        //         ]
                        //     },
                        //     __slot__: {
                        //         options: [
                        //             {
                        //                 label: '无人证',
                        //                 value: -1
                        //             },
                        //             {
                        //                 label: '不可查',
                        //                 value: 3
                        //             }
                        //         ]
                        //     },
                        //     __rules__: {},
                        //     __vModel__: 'innerDriverCertState',
                        //     style: null,
                        //     className: null
                        // },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车辆ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '部级车证',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __slot__: {
                        //         options: [
                        //             {
                        //                 label: '无车证',
                        //                 value: -1
                        //             },
                        //             {
                        //                 label: '无车证',
                        //                 value: 0
                        //             },
                        //             {
                        //                 label: '有车证',
                        //                 value: 1
                        //             },
                        //             {
                        //                 label: '车证过期',
                        //                 value: 2
                        //             },
                        //             {
                        //                 label: '不可查',
                        //                 value: 3
                        //             }
                        //         ]
                        //     },
                        //     __vModel__: 'outerCarCertState',
                        //     style: null,
                        //     className: null
                        // },
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '系统车证',
                        //         tag: 'el-select',
                        //         span: 12,
                        //         placeholder: '请选择',
                        //         rules: [
                        //             {
                        //                 required: true,
                        //                 message: '请输入活动名称',
                        //                 trigger: 'blur'
                        //             }
                        //         ]
                        //     },
                        //     __slot__: {
                        //         options: [
                        //             {
                        //                 label: '无车证',
                        //                 value: -1
                        //             },
                        //             {
                        //                 label: '不可查',
                        //                 value: 3
                        //             }
                        //         ]
                        //     },
                        //     __rules__: {},
                        //     __vModel__: 'innerCarCertState',
                        //     style: null,
                        //     className: null
                        // }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    // {
        // 网约车审批 司机医学检测报告审核
        // approvalType: 6,
        // categoryName: 1,
        // fields: [
        //     {
        //         __config__: {
        //             type: 'imageList',
        //             label: '图片',
        //             tag: 'el-carousel',
        //             span: 12
        //         },
        //         __vModel__: 'attachmentList',
        //         style: {},
        //         className: ''
        //     },
        //     {
        //         __config__: {
        //             type: 'blockItem',
        //             label: '审批发起信息',
        //             tag: 'el-section',
        //             span: 12,
        //             items: [
        //                 {
        //                     __config__: {
        //                         type: 'formItem',
        //                         label: '审批编号',
        //                         tag: 'span',
        //                         span: 12
        //                     },
        //                     __vModel__: '_procInsId',
        //                     style: null,
        //                     className: null
        //                 },
        //                 {
        //                     __config__: {
        //                         type: 'formItem',
        //                         label: '审批类型',
        //                         tag: 'span',
        //                         span: 12
        //                     },
        //                     __vModel__: '_approvalName',
        //                     style: null,
        //                     className: null
        //                 },
        //                 {
        //                     __config__: {
        //                         type: 'formItem',
        //                         label: '发起时间',
        //                         tag: 'span',
        //                         span: 12
        //                     },
        //                     __vModel__: '_startTime',
        //                     style: null,
        //                     className: null
        //                 },
        //                 {
        //                     __config__: {
        //                         type: 'formItem',
        //                         label: '发起人',
        //                         tag: 'span',
        //                         span: 12
        //                     },
        //                     __vModel__: '_startUserName',
        //                     style: null,
        //                     className: null
        //                 }
                        // {
                        //     __config__: {
                        //         type: 'formItem',
                        //         label: '更改报告',
                        //         tag: 'span',
                        //         span: 12
                        //     },
                        //     __vModel__: 'startUserName',
                        //     style: null,
                        //     className: null
                        // }
            //         ]
            //     },
            //     __vModel__: null,
            //     style: {},
            //     className: ''
            // },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '司机信息',
    //                 tag: 'el-section',
    //                 span: 12,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机ID',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'driverId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '手机号码',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'phone',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '姓名',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'name',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '身份证号码',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'idNumber',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '所属机构',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'parentRelationName',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         }
    //     ]
    // },
    {
        // 网约车审批 身份证找回申请
        approvalType: 7,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '发起找回司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '身份解绑司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'beRetrieveDriverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'beRetrievePhone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'beRetrieveParentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '身份证信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 修改系统双证
        approvalType: 8,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机&车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车辆ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '品牌车型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carBrandName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级人证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '无人证',
                                        value: 0
                                    },
                                    {
                                        label: '有人证',
                                        value: 1
                                    },
                                    {
                                        label: '人证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'outterDriverCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '部级车证',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'outerCarCertState',
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '无车证',
                                        value: 0
                                    },
                                    {
                                        label: '有车证',
                                        value: 1
                                    },
                                    {
                                        label: '车证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '修改前系统证件信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统人证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '无人证',
                                        value: 0
                                    },
                                    {
                                        label: '有人证',
                                        value: 1
                                    },
                                    {
                                        label: '人证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'beInnerDriverCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统车证',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'beInnerCarCertState',
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '无车证',
                                        value: 0
                                    },
                                    {
                                        label: '有车证',
                                        value: 1
                                    },
                                    {
                                        label: '车证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '修改后系统证件信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统人证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无人证',
                                        value: -1
                                    },
                                    {
                                        label: '无人证',
                                        value: 0
                                    },
                                    {
                                        label: '有人证',
                                        value: 1
                                    },
                                    {
                                        label: '人证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'innerDriverCertState',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '系统车证',
                                tag: 'span',
                                span: 12
                            },
                            __slot__: {
                                options: [
                                    {
                                        label: '无车证',
                                        value: -1
                                    },
                                    {
                                        label: '无车证',
                                        value: 0
                                    },
                                    {
                                        label: '有车证',
                                        value: 1
                                    },
                                    {
                                        label: '车证过期',
                                        value: 2
                                    },
                                    {
                                        label: '不可查',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'innerCarCertState',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 网约车审批 身份证更换申请
        approvalType: 10,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '更换后姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'changeName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '更换后身份证',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'changeIdNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '更换原因',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'applyReasonType',
                            __slot__: {
                                options: [
                                    {
                                        label: '车主身故/残疾',
                                        value: 1
                                    },
                                    {
                                        label: '证件纠纷',
                                        value: 2
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '备注原因',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'applyDesc',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'fileList',
                    label: '附件',
                    tag: 'el-section',
                    span: 24
                },
                __vModel__: 'fileList',
                style: {},
                className: ''
            }
        ]
    },
    // {
    //     // 网约车审批 异常订单处理申请
    //     approvalType: 11,
    //     categoryName: 1,
    //     labelWidth: 170,
    //     fields: [
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '审批发起信息',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批编号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_procInsId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_approvalName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起时间',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起人',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startUserName',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '订单基础信息',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '订单号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'orderId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '订单服务类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'requestRideType',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '订单包干类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __slot__: {
    //                             options: [
    //                                 {
    //                                     label: '收取平台费',
    //                                     value: 0
    //                                 },
    //                                 {
    //                                     label: '包干',
    //                                     value: 1
    //                                 }
    //                             ]
    //                         },
    //                         __vModel__: 'orderVipType',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '订单状态',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'orderStatusName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '载客里程',
    //                             tag: 'span',
    //                             span: 12,
    //                             unit: '公里',
    //                             mileageType: 'km'
    //                         },
    //                         __vModel__: 'mileage',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '载客时长',
    //                             tag: 'span',
    //                             span: 12,
    //                             unit: '分钟',
    //                             timeType: 'second'
    //                         },
    //                         __vModel__: 'rideTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '下单时间',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'downOrderTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '完成支付时间',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'payTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机ID',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'driverId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机手机号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'driverPhone',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机姓名',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'driverName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '车牌号码',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'carNum',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '所属机构',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'orgName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '乘客手机号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'passengerPhone',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: '',
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'tableItem',
    //                 label: '乘客支付记录',
    //                 tag: 'el-section',
    //                 span: 24
    //             },
    //             __vModel__: 'passengerPayRecords',
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '支付异常信息',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '异常类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'exceptionStatusName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '订单金额（元）',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'orderPrice',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '减免金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'derateMoney',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '优惠金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'discountPrice',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '乘客应付金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'payablePrice',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '乘客实付金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'realPayPrice',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '第三方支付金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'passengerPay',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '余额支付金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'balanceMoney',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '对账差异金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'checkDifferenceMoney',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机应入账金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'driverIncome',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机实际入账金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'driverActualIncome',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '平台佣金(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'platformChargeMoney',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: '',
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '处理结果',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '处理方式',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'processTypeNameStr',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '处理建议',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'processSuggest',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '乘客退款金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'passengerRefund',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '司机扣除金额(元)',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType: 'yuan'
    //                         },
    //                         __vModel__: 'driverDeduct',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         }
    //     ]
    // },

    {
        // 网约车审批 司机风控扣款返还审核
        approvalType: 13,
        categoryName: 1,
        fields: [
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '备注信息',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'remark',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '风控判责信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '判责事件编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'riskCaseNo',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '业务类型',
                                tag: 'span',
                                span: 12
                            },
                            // 业务类型1,网约车 2,顺风车 3,货车
                            __slot__: {
                                options: [
                                    {
                                        label: '网约车',
                                        value: 1
                                    },
                                    {
                                        label: '顺风车',
                                        value: 2
                                    },
                                    {
                                        label: '货车',
                                        value: 3
                                    }
                                ]
                            },
                            __vModel__: 'businessType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '处罚结果',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'publishResult',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 新出租车审批 司机入网申请
        approvalType: 1,
        categoryName: 2,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '性别',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'sex',
                            __slot__: {
                                options: [
                                    {
                                        label: '男',
                                        value: 1
                                    },
                                    {
                                        label: '女',
                                        value: 0
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '年龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'ageExperience',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '驾驶员信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾驶证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '初次领证日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingAgeStr',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '注册时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'registerDate',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 新出租车审批 司机修改资料
        approvalType: 2,
        categoryName: 2,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '司机信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '司机ID',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'driverId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '手机号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'phone',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '性别',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'sex',
                            __slot__: {
                                options: [
                                    {
                                        label: '男',
                                        value: 1
                                    },
                                    {
                                        label: '女',
                                        value: 0
                                    }
                                ]
                            },
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '年龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'ageExperience',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '身份证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'parentRelationName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '驾驶员信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '姓名',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾驶证号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'licenseId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '初次领证日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingAgeStr',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '驾龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'drivingExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '车辆信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车牌号码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '注册时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'registerDate',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '车龄',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'carExperience',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 机构审批 分公司开通申请
        approvalType: 14,
        categoryName: 3,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '基础信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构编码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'agencyNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'orgType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构全称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构简称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'simpleName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '注册资本',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'ageExperience',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '统一社会信用代码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '上级机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '设立时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'establishTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '业务城市',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构所在地区',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '详细地址',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'address',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 机构审批 服务中心开通申请
        approvalType: 15,
        categoryName: 3,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'approvalType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '基础信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构编码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'agencyNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'orgType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构全称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构简称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'simpleName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '上级机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '设立时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'establishTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '业务城市',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构所在地区',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '详细地址',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'address',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        // 机构审批 实体店开通申请
        approvalType: 18,
        categoryName: 3,
        fields: [
            {
                __config__: {
                    type: 'imageList',
                    label: '图片',
                    tag: 'el-carousel',
                    span: 12
                },
                __vModel__: 'attachmentList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'approvalType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'startUserName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '基础信息',
                    tag: 'el-section',
                    span: 12,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构编码',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'agencyNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'orgType',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构全称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构简称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'simpleName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '上级机构',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '设立时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'establishTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '业务城市',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '机构所在地区',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'idNumber',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '详细地址',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'address',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            }
        ]
    },
    {
        //行政审批 
        approvalType: 24,//总部通用审批
        categoryName: 5,
        fields: [
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属部门',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_positionName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批内容',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批内容',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'content',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批详情',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'detail',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'picList',
                    label: '图片',
                    tag: 'el-section',
                    span: 24
                },
                __vModel__: 'imgList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'fileList',
                    label: '附件',
                    tag: 'el-section',
                    span: 24
                },
                __vModel__: 'fileList',
                style: {},
                className: ''
            }
        ]
    },
    {
        //行政审批 
        approvalType: 29,//机构通用审批
        categoryName: 5,
        fields: [
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属部门',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_positionName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批内容',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批内容',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'content',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批详情',
                                tag: 'span',
                                span: 24
                            },
                            __vModel__: 'detail',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'picList',
                    label: '图片',
                    tag: 'el-section',
                    span: 24
                },
                __vModel__: 'imgList',
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'fileList',
                    label: '附件',
                    tag: 'el-section',
                    span: 24
                },
                __vModel__: 'fileList',
                style: {},
                className: ''
            }
        ]
    },
 {
        // 红包审批
        approvalType:41,
        categoryName:8,
        fields:[
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属部门',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_positionName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批内容',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '红包名称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '单个红包金额（元）',
                                tag: 'span',
                                span: 12,
                                priceType:"yuan"
                            },
                            __vModel__: 'money',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '配置数量',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'totalNumber',
                            style: null,
                            className: null
                        },
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
        ]
    },
    // {
    //     // 出行券审批
    //     approvalType:40,
    //     categoryName:8,
    //     fields:[
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '审批发起信息',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批编号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_procInsId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_approvalName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起时间',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起人',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startUserName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '所属部门',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_positionName',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '审批内容',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '出行券名称',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'couponsName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: 'APP显示别名',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'showName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '总数量',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'totalNumber',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '出行券类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'couponsType',
    //                         style: null,
    //                         className: null,
    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '满减',
    //                                     value: 1
    //                                 },
    //                                 {
    //                                     label: '折扣',
    //                                     value: 2
    //                                 },
    //                                 {
    //                                     label: '立减',
    //                                     value: 3
    //                                 }
    //                             ]
    //                         }
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType:"yuan",
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                let labelStr
    //                                 if(dataObject.couponsType==2){
    //                                     labelStr="折扣金额"
    //                                 }else if(dataObject.couponsType==1){
    //                                     labelStr="满减金额"
    //                                 }else if(dataObject.couponsType==3){
    //                                     labelStr="减免金额"
    //                                 }
    //                                 return {
    //                                     label:labelStr,
    //                                     value:value,
    //                                     show:true
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: 'faceValue',
    //                         style: null,
    //                         className: null,
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType:"yuan",
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let show = dataObject.couponsType!=3
    //                                 if(dataObject.couponsType==2){
    //                                     label="最高减免金额"
    //                                 }else if(dataObject.couponsType==1){
    //                                     label="减免金额"
    //                                 }
    //                                 return {
    //                                     label:label,
    //                                     value:value,
    //                                     show:show
    //                                 }
    //                             }

    //                         },
    //                         __vModel__: 'amountLimitation',
    //                         style: null,
    //                         className: null,
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '有效日期',
    //                             tag: 'span',
    //                             span: 12,
    //                         },
    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '领券后周期内有效',
    //                                     value: 1
    //                                 },
    //                                 {
    //                                     label: '固定周期有效',
    //                                     value: 2
    //                                 }
    //                             ]
    //                         },
    //                         __vModel__: "couponsPeriodType",
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '生效周期',
    //                             tag: 'span',
    //                             span: 12,
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let show =dataObject.couponsPeriodType==1
    //                                 return {
    //                                     label:label,
    //                                     value:value,
    //                                     show:show
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: "validDay",
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '有效时间',
    //                             tag: 'span',
    //                             span: 12,
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let show=dataObject.couponsPeriodType==2
    //                                 return {
    //                                     label:label,
    //                                     value:`${dataObject.effectiveStartTime}-${dataObject.effectiveEndTime}`,
    //                                     show:show
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: "",
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '可用时段',
    //                             tag: 'span',
    //                             span: 12,
    //                             dataType:"timeRange",
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 return {
    //                                     label:label,
    //                                     value:`${dataObject.availableStartTime}-${dataObject.availableEndTime}`,
    //                                     show:true
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: "",
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '适用业务',
    //                             tag: 'span',
    //                             span: 12,
    //                         },
    //                         __vModel__: "ifAllBusiness",
    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '全部业务',
    //                                     value: 1
    //                                 },
    //                                 {
    //                                     label: '部分业务',
    //                                     value: 0
    //                                 },
    //                             ]
    //                         },
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '业务类型',
    //                             tag: 'span',
    //                             span: 12,
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let transformValue=value.split(",").map(i=>{return item.__slot__.options.find(item => { return item.value == i })?.label}).join(",")
    //                                 let show=dataObject.ifAllBusiness==0
    //                                 return {
    //                                     label:label,
    //                                     value:transformValue,
    //                                     show:show
    //                                 }
    //                             }
    //                         },
    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '网约车',
    //                                     value: 1
    //                                 },
    //                                 {
    //                                     label: '顺风车',
    //                                     value: 2
    //                                 },
    //                                 {
    //                                     label: '货运',
    //                                     value: 3
    //                                 },
    //                                 {
    //                                     label: '代驾',
    //                                     value: 4
    //                                 }
    //                             ]
    //                         },
    //                         __vModel__: 'serviceId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '适用车型',
    //                             tag: 'span',
    //                             span: 12,
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let transformValue=value.split(",").map(i=>{return item.__slot__.options.find(item => { return item.value == i })?.label}).join(",")
    //                                 let show=dataObject.ifAllBusiness==0&&dataObject.serviceId.split(",").includes("1")
    //                                 return {
    //                                     label:label,
    //                                     value:transformValue,
    //                                     show:show
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: 'serviceCar',

    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '快车',
    //                                     value: 10
    //                                 },
    //                                 {
    //                                     label: '专车',
    //                                     value: 20
    //                                 },
    //                                 {
    //                                     label: '豪华车',
    //                                     value: 30
    //                                 },
    //                                 {
    //                                     label: '商务车',
    //                                     value: 40
    //                                 }
    //                             ]
    //                         },
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '适用订单',
    //                             tag: 'span',
    //                             span: 12,
    //                             formatter:(label,value,dataObject,config,item)=>{
    //                                 let transformValue=value.split(",").map(i=>{return item.__slot__.options.find(item => { return item.value == i })?.label}).join(",")
    //                                 let show=dataObject.ifAllBusiness==0&&dataObject.serviceId.split(",").includes("1")
    //                                 return {
    //                                     label:label,
    //                                     value:transformValue,
    //                                     show:show
    //                                 }
    //                             }
    //                         },
    //                         __vModel__: 'serviceOrder',
    //                         __slot__:{
    //                             options:[
    //                                 {
    //                                     label: '实时单',
    //                                     value: 20
    //                                 },
    //                                 {
    //                                     label: '扫码单',
    //                                     value: 22
    //                                 },
    //                                 {
    //                                     label: '预约单',
    //                                     value: 21
    //                                 },
    //                                 {
    //                                     label: '包车单',
    //                                     value: 70
    //                                 },
    //                                 {
    //                                     label: '拼车单',
    //                                     value: 40
    //                                 }
    //                             ]
    //                         },
    //                         style: null,
    //                         className: null
    //                     },

    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         },
    //     ]
    // },
    {
        // 新增实体卡审批
        approvalType:42,
        categoryName:8,
        fields:[
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属部门',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_positionName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批内容',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '实体福卡名称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'activityName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '新增数量',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'activityNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '福卡面额（元）',
                                tag: 'span',
                                span: 12,
                                priceType:"yuan"
                            },
                            __vModel__: 'activityMoney',
                            style: null,
                            className: null,
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '福卡有效截止日期',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'activityEndDate',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
        ]
    },
    // {
    //     // 新增实体卡审批
    //     approvalType:43,
    //     categoryName:8,
    //     fields:[
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '审批发起信息',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批编号',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_procInsId',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '审批类型',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_approvalName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起时间',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startTime',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '发起人',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_startUserName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '所属部门',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: '_positionName',
    //                         style: null,
    //                         className: null
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         },
    //         {
    //             __config__: {
    //                 type: 'blockItem',
    //                 label: '审批内容',
    //                 tag: 'el-section',
    //                 span: 24,
    //                 items: [
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '领取部门',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'agencyName',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '申领实体福卡数量',
    //                             tag: 'span',
    //                             span: 12
    //                         },
    //                         __vModel__: 'applyNum',
    //                         style: null,
    //                         className: null
    //                     },
    //                     {
    //                         __config__: {
    //                             type: 'formItem',
    //                             label: '申领福卡面额（元）',
    //                             tag: 'span',
    //                             span: 12,
    //                             priceType:"yuan"
    //                         },
    //                         __vModel__: 'applyMoney',
    //                         style: null,
    //                         className: null,
    //                     }
    //                 ]
    //             },
    //             __vModel__: null,
    //             style: {},
    //             className: ''
    //         },
    //     ]
    // },
    {
        // 红包补量审批
        approvalType:45,
        categoryName:8,
        fields:[
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批发起信息',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批编号',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_procInsId',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '审批类型',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_approvalName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起时间',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startTime',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '发起人',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_startUserName',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '所属部门',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: '_positionName',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
            {
                __config__: {
                    type: 'blockItem',
                    label: '审批内容',
                    tag: 'el-section',
                    span: 24,
                    items: [
                        {
                            __config__: {
                                type: 'formItem',
                                label: '红包名称',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'name',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '单个红包金额（元）',
                                tag: 'span',
                                span: 12,
                                priceType:"yuan"
                            },
                            __vModel__: 'money',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '补充数量',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'addNum',
                            style: null,
                            className: null
                        },
                        {
                            __config__: {
                                type: 'formItem',
                                label: '当前余量',
                                tag: 'span',
                                span: 12
                            },
                            __vModel__: 'remainder',
                            style: null,
                            className: null
                        }
                    ]
                },
                __vModel__: null,
                style: {},
                className: ''
            },
        ]
    }
];
export const fieldsMapper = {
    waterIdCardImgUrl: '身份证人像面',
    waterIdCardBackImgUrl: '身份证国徽面',
    waterDrivingLicenceImgUrl: '驾驶证正本照',
    waterDrivingLicenceSupplementImgUrl: '驾驶证副页照',
    waterTravelImgUrl: '行驶证正本照',
    waterTravelSupplementImgUrl: '行驶证副页照',
    waterWorkLicense: '网约车驾驶员证',
    waterRoadLicense: '网约车运输资格证',
    waterCarImgUrl: '人车合影',
    waterHeadImgUrl: '司机头像照',
    waterCLIVTAImgUrl: '交强险',
    waterVehicleInsuranceImgUrl: '商业险',
    monitorCard: '监督卡',
    qualificationCert: '从业资格证',
    waterTriAgreementUrl:'三方协议'
};
