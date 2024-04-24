import { deepClone, centToKm, centToYuan } from '@/utils/index'
import ScrollPane from '@/layout/components/TagsView/ScrollPane';
import download from './download.js';
const layouts = {
    imageList(h, field) {
        let list = this.dataObject[field.__vModel__];
        let listItems = [];
        let ulListItems = [];
        let srcList = list?.map(pic => pic.src);
        {
            list?.forEach((item, index) => {
                let listItem = (
                    <el-carousel-item key={item.id}>
                        <div class="img_container" onClick={() => { this.onPreview(index) }}>
                            <div class="img_content"><img src={item.src} /></div>
                            <h3 class="img_title">{item.title}</h3>
                        </div>

                        {/* <h3>{item.title}</h3> */}

                    </el-carousel-item>)
                let liItem = (
                    <div class="ul_list_item" onClick={() => { this.setActiveItem(index) }}>
                        <div class={this.selectIndex === index ? '' : 'item_dialog'}></div>
                        <img src={item.src} />
                    </div>
                )

                listItems.push(listItem)
                ulListItems.push(liItem)
            })
        }
        return (
            <div class="imgList_wrap_container">
                <span class="block_item_title">{field.__config__.label}</span>
                <div class="imgList_container">
                    <el-carousel ref="carousel" autoplay={false} arrow='hover' indicator-position="none" onChange={(index) => { this.selectIndex = index }}>
                        {listItems}
                    </el-carousel>
                    <ws-image-viewer visible={this.visible} {...{ on: { 'update:visible': (visible) => { this.visible = visible } } }} src-list={srcList} currentIndex={this.currentIndex} />
                    <div class="viewer-navList">
                        <ul class="viewer-list">
                            <ScrollPane ref="scrollContainer" vertical={false}>
                                <div class="viewer_list_content">{ulListItems}</div>
                            </ScrollPane>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    blockItem(h, field) {
        let { __config__: config, } = field;
        let { items } = config
        let formElements = []
        {
            items?.forEach(item => {
                const config = field.__config__;
                const layout = layouts['formItem'];
                if (layout) {
                    formElements.push(layout.call(this, h, item, field.__vModel__));
                }
            });
        }
        let element = (
            <div class="block_item_container">
                <span class="block_item_title">{config.label}</span>
                <el-row class="block_item_wrap">{formElements}</el-row>
            </div>
        )
        return element

    },
    fileList(h, field) {
        let { __config__: config } = field;
        const fileElements = [];
        let list = this.dataObject[field.__vModel__];

        // 如果附件长度位0， 则不渲染这个字段
        if (!list || list.length === 0) return

        {
            list?.forEach(file => {
                let element = (
                    <el-col span={8}>
                        <div class="file_container">
                            <img src={require("@/assets/index/fileIcon.png")} />
                            <div class='text'>
                                <h1>{file.fileName}</h1>
                                {file.fileSize ? <span>{file.fileSize}</span> : ""}
                            </div>
                            <div class="file_shadow">
                                <div class="imgBox">
                                    {(file.fileType && (file.fileType == 'doc' || file.fileType == 'docx' ||
                                        file.fileType == 'ppt' || file.fileType == 'pptx' || file.fileType == 'xls' || file.fileType == 'xlsx' || file.fileType == 'excel')) ?
                                        <span onClick={() => this.handlePreview(file.cdnUrl || file.URL || file.fileUrl)} >
                                            <i class="el-icon-zoom-in" style='margin-right:30px;'></i>
                                        </span> : (file.fileType && (file.fileType == 'pdf' || file.fileType == 'png' || file.fileType == 'jpeg' || file.fileType == 'jpg') && (file.cdnUrl || file.URL || file.fileUrl)) ?
                                            <a href={file.cdnUrl || file.URL || file.fileUrl} target="_blank">
                                                <i class="el-icon-zoom-in" style='margin-right:30px;'></i>
                                            </a> : ''}
                                    <i class="el-icon-download" onClick={() => this.handleDownLoad(file.cdnUrl || file.URL || file.fileUrl)}></i>
                                </div>
                            </div>
                        </div>
                    </el-col>
                )
                fileElements.push(element)
            })
        }
        let element = (
            <div>
                <div class="block_item_container">
                    <span class="block_item_title">{config.label}</span>
                </div>
                <el-row gutter={20}>{fileElements}</el-row>
            </div>
        )
        return element
    },
    picList(h, field) {
        let { __config__: config } = field;

        // 取到字段值
        let list = this.dataObject[field.__vModel__];

        // 如果图片长度位0， 则不渲染这个字段
        if (!list || list.length === 0) return

        let listItems = [];
        let srcList = []
        {
            list?.forEach((item, index) => {
                let liItem = (
                    <div class="ul_list_item" onClick={() => { this.onPicPreview(index) }}>
                        <img src={item?.URL ? item.URL : item} />
                    </div>
                )
                listItems.push(liItem)
                srcList.push(item.URL)
            })
        }
        let picListElement = (
            <div class="viewer-navList">
                <ul class="viewer-list">
                    <el-scrollbar ref="scrollContainer" vertical={false}>
                        <div class="viewer_list_content">{listItems}</div>
                    </el-scrollbar>
                </ul>
            </div>
        )
        return (
            <div class="picList_wrap_container">
                <div class="block_item_container">
                    <span class="block_item_title">{config.label}</span>
                </div>
                <el-row class="pic_row" gutter={20}>{picListElement}</el-row>
                <ws-image-viewer visible={this.picVisible} {...{ on: { 'update:visible': (visible) => { this.picVisible = visible } } }} src-list={srcList} currentIndex={this.currentPicIndex} />
            </div>

        )
    },
    tableItem(h, field) {
        let { __config__: config, } = field;
        let formElements = []
        let tableData = this.dataObject[field.__vModel__]
        let balanceMoney = this.dataObject['balanceMoney']
        let element = (
            <div class="block_item_container">
                <span class="block_item_title">{config.label}</span>
                <el-row class="block_item_wrap">{
                    <ws-table-el ref="table" key={new Date().getTime()} pagination={false} data={tableData} filterColumns={false} highlight-current-row header-cell-style={{ background: '#F5F7FA' }}>
                        <ws-table-column-el prop="notifyTime" label="支付时间"></ws-table-column-el>
                        <ws-table-column-el prop="outTradeNo" label="商户订单号"></ws-table-column-el>
                        <ws-table-column-el prop="tradeNo" label="交易订单号"></ws-table-column-el>
                        <ws-table-column-el prop="orderPrice" label="第三方支付金额" formatter={(row) => { if (row.orderPrice) { return centToYuan(row.orderPrice) } else { return "" } }}></ws-table-column-el>
                        <ws-table-column-el prop="balanceMoney" label="余额支付金额" ></ws-table-column-el>
                    </ws-table-el>
                }
                </el-row>
            </div>
        )
        return element
    },
    formItem(h, item, blockModel) {
        let { __config__: config, __slot__: slot } = item;
        let slots = []
        if (slot) {
            slot.options.forEach(item => {
                slots.push(<el-option label={item.label} value={item.value} ></el-option>)
            })
        }
        let spanValue = this.dataObject[item.__vModel__]
        const options = slot?.options || []
        if (options.length > 0) {
            spanValue = options.find(item => { return item.value == spanValue })?.label
        }
        if (spanValue && config.priceType && config.priceType == 'yuan') {
            spanValue = this.$baseMethod.regFenToYuan(spanValue);
        }
        if (spanValue && config.mileageType && config.mileageType == 'km') {
            spanValue = this.$baseMethod.regRiceToKm(spanValue);
        }
        if (spanValue && config.timeType && config.timeType == 'second') {
            spanValue = this.$baseMethod.regSecondToMinute(spanValue);
        }
        if (spanValue && config.unit) {
            spanValue = spanValue + config.unit;
        }
        const getDisabled = (item) => {
            if (item.__vModel__ == 'innerDriverCertState' && this.outerDriverCertStateDisabled) {
                return true
            }
            if (item.__vModel__ == 'innerCarCertState' && this.innerCarCertStateDisabled) {
                return true
            }
        }
        const changeColor = (item) => {
            if (item.__vModel__ == 'innerDriverCertState' && this.dataObject['beInnerDriverCertState'] && this.dataObject['innerDriverCertState'] !== this.dataObject['beInnerDriverCertState']) {
                return { color: '#F56C6C' }
            }
            if (item.__vModel__ == 'innerCarCertState' && this.dataObject['beInnerCarCertState'] && this.dataObject['innerCarCertState'] !== this.dataObject['beInnerCarCertState']) {
                return { color: '#F56C6C' }
            }
        }
        let element = (
            <el-col span={config.span}>
                <el-form-item prop={item.__vModel__} label={config.label + '：'} rules={config.rules || []}>
                    {config.tag == 'span' || this.fieldStatus == 1
                        ? h('span', { style: changeColor(item) }, spanValue)
                        : h(
                            config.tag,
                            {
                                props: {
                                    value: blockModel ? this.dataObject[blockModel][item.__vModel__] : this.dataObject[item.__vModel__],
                                    disabled: getDisabled(item)
                                },
                                on: {
                                    input: value => {
                                        blockModel ? this.dataObject[blockModel][item.__vModel__] : (this.dataObject[item.__vModel__] = value);
                                    },
                                    change: value => {
                                        if (item.__vModel__ == 'innerCarCertState') {

                                            this.invalue = value;
                                        }
                                        // blockModel?this.dataObject[blockModel][item.__vModel__]:this.dataObject[item.__vModel__]=value
                                    }
                                }
                            },
                            slots
                        )}
                </el-form-item>
            </el-col>
        );
        return element;
    }
};
export default {
    name: 'renderFields',
    props: {
        formFields: {
            type: Object,
            required: true
        },
        dataObject: {
            type: Object,
            default: () => {
                return {
                    innerCarCertState: 0

                };
            }
        },
        fieldStatus: {
            type: Number,
            default: 1
        }
    },
    watch: {
        'dataObject.firstAuditPassTime': {
            handler(val) {
                if (!this.dataObject.carType && this.fieldStatus == 0) {
                    if (!val) {
                        //为空 车辆已入网
                        this.dataObject.carType = 1
                    } else {
                        // 车辆未入网，且未有默认值
                        if (this.dataObject.carType === null) {
                            this.dataObject.carType = 1
                        }
                    }
                }

            },
            immediate: true
        },
        'dataObject.outterDriverCertState': {
            handler(val) {
                if (val) {
                    if (val == 1) {
                        this.formFields.approvalType!==8&&(this.dataObject.innerDriverCertState = "有人证")
                        this.outerDriverCertStateDisabled = true
                    }
                }
            },
            immediate: true
        },

        'dataObject.innerCarCertState': {
            handler(val) {
                if (val) {
                    this.invalue = val
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            currentIndex: 0,
            visible: false,
            picVisible: false,
            currentPicIndex: 0,
            outerDriverCertStateDisabled: false,
            innerCarCertStateDisabled: false,
            invalue: null,
            selectIndex: 0, // 选中图片下标
            isApproval: ""
        }
    },
    methods: {
        onPreview(index) {
            this.currentIndex = index;
            this.visible = true
        },
        onPicPreview(index) {
            this.currentPicIndex = index;
            this.picVisible = true;
        },
        setActiveItem(index) {
            this.selectIndex = index
            this.$refs['carousel'].setActiveItem(index)
        },
        submitForm() {
            this.$refs['el-form'].validate((valid) => {
                if (valid) {
                    return valid
                }
            })
        },
        confirmSelectStatus() {
            if (this.dataObject.outterDriverCertState && this.dataObject.outterDriverCertState == 1&&this.formFields.approvalType!==8) {
                // 已经配置了字典，不太清楚这里为何要转成中文,会导致网约车审批 修改系统双证中显示不了，这里过滤掉
                this.dataObject.innerDriverCertState = "有人证"
                this.outerDriverCertStateDisabled = true
            }
            if (this.dataObject.outerCarCertState && this.dataObject.outerCarCertState == 1&&this.formFields.approvalType!==8) {
                this.dataObject.innerCarCertState = "有车证"
                this.innerCarCertStateDisabled = true
            }
        },
        handleDownLoad(item) {
            download(item);
        },
        handlePreview(item) {
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item)}`);
        },
    },
    render(h) {
        let fieldData = this.formFields.fields;
        this.$set(this.dataObject, 'innerCarCertState', this.invalue)
        this.confirmSelectStatus()
        let renderElements = {
            blocks: [],
            images: [],
            filesElements: [],
            picsElements: [],
            tableElements: []
        }
        const mapper = {
            'blockItem': 'blocks',
            'imageList': 'images',
            'fileList': 'filesElements',
            'picList': 'picsElements',
            'tableItem': 'tableElements'
        }
        {
            fieldData?.forEach(field => {
                const config = field.__config__;
                const layout = layouts[config.type];
                if (layout) {
                    renderElements[mapper[config.type]].push(layout.call(this, h, field))
                }
            });
        }

        return (
            <div>
                <div class="__approval_field_wrap_container">
                    {renderElements.images}
                    <div class="block_container">
                        <el-form label-position="right" label-width={this.formFields.labelWidth ? this.formFields.labelWidth + 'px' : '120px'} ref="el-form" props={{ model: this.dataObject }}>{renderElements.blocks}</el-form>
                    </div>
                </div>
                <div class="__approval_field_wrap_container" style={renderElements.picsElements.length == 0 ? "padding:0 0" : ''}>
                    <div class="pics_container">
                        {renderElements.picsElements}
                    </div>
                </div>
                <div class="__approval_field_wrap_container" style={renderElements.filesElements.length == 0 ? "padding:0 0" : ''}>
                    <div class="files_container">
                        {renderElements.filesElements}
                    </div>
                </div>
                <div class="__approval_field_wrap_container" style={renderElements.tableElements.length == 0 ? "padding:0 0" : ''}>
                    <div class="files_container">
                        {renderElements.tableElements}
                    </div>
                </div>

            </div>
        );
    }
};

