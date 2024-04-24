<template>
    <div class="app_sys">
        <!-- 手机模拟展示 -->
        <section class="phone_show">
            <div class="phone_head">
                <h2>xx:xx</h2>
                <img class="Cellular_connection" src="@/assets/images/Cellular_connection.png" alt="" />
                <img class="Wifi" src="@/assets/images/Wifi.png" alt="" />
                <img class="Battery" src="@/assets/images/Battery.png" alt="" />
            </div>
            <div class="rotation_box">
                <el-carousel height="150px">
                    <el-carousel-item v-for="item in imgList" :autoplay="true" :key="item">
                        <img :src="item" alt="" />
                    </el-carousel-item>
                </el-carousel>
            </div>

            <div class="phone_content">
                <template v-if="pageTypeForm.pageType === 1">
                  <!-- 左侧手机菜单布局 -->
                  <appPreviewLayout
                    :activeMenu='activeMenu'
                    :activeMenuIndex='activeMenuIndex'
                    @change='(item, optionIndex, index) => clickanchor(`#menu${index}${optionIndex}${item.id}`, item, index)'
                  />
                </template>
            </div>
            <!-- 底部tab 导航 -->
            <div class="phone_footer">
                <ul>
                    <li v-for="(item, index) in navList" :key="index">
                        <a @click="onChangeTabNav(item)">
                            <img :src="item.pic" alt="" v-show='item.pic'/>
                            <div v-show='!item.pic' class="nav-item-empty-placeholder"></div>
                            <p>{{ item.name }}</p>
                        </a>
                    </li>
                </ul>
            </div>
        </section>

        <section style="flex: 1">
            <div class="menu_config">
                <div class="title_box">
                    <h2>{{ headline }}</h2>
                    <el-button
                      class="operate_btn"
                      icon="el-icon-circle-plus"
                      type="primary"
                      v-if="navList.length < 5 && !isDisabled && showNav"
                      @click="addFirstLevelMenu">新增</el-button>
                </div>

                <!-- nav 导航配置 -->
                <draggable :disabled="isDisabled" v-show="showNav" class="menu_box" handle=".nav_mover" :animation="600" v-model="navList">
                    <transition-group>

                      <!-- 遍历开始 start -->
                        <div v-for="(item, index) in navList" :key="`${item.id}${index}`" class="menu_info">
                            <div class="menu_title nav_mover">
                                <img v-if="!isDisabled" :src="require('@/assets/images/icon_drag.png')" alt="" />
                                <h5>{{ item.name }}</h5>
                                <!-- 展开/收起 -->
                                <img style="margin-right: auto" :class="item.isOpen ? '' : 'arrow_rotate'"  @click='item.isOpen = !item.isOpen' :src="require('@/assets/images/icon_more.png')" alt="" />
                                <span class="del_btn" v-if="navList.length > 1 && !isDisabled" @click="delClick(navList, index)">删除</span>
                            </div>

                            <div v-show="item.isOpen" class="function_moudel">
                                <el-form class="form_box_padding" :disabled="isDisabled" :ref="`nav${index}`" :rules="navRules" label-width="6rem" :model="item">
                                    <el-form-item prop="pic" class="picLabel" label="导航图标：">
                                        <div style="display: flex">
                                            <ws-image-upload
                                                :urlList="getUrlList(item.pic)"
                                                :afterUpload="data => afterUpload(data, navList, index, 'pic')"
                                                :handleRemove="data => handleRemove(data, navList, index, 'pic')"
                                                :disable="isDisabled"
                                                :isDelete="!isDisabled"
                                                class="ws_image_upload"
                                                v-bind="options"
                                            />
                                        </div>
                                    </el-form-item>

                                    <el-form-item prop="name" label="导航名称：">
                                        <el-input maxlength="7" v-model.trim="item.name" placeholder="最多7个汉字"></el-input>
                                    </el-form-item>

                                    <el-form-item prop="deepLinkId" :rules="[{ required: true, trigger: 'blur', message: `导航路径` }]" label="导航路径：">
                                        <el-select class="sys_select" filterable :popper-append-to-body="false" v-model="item.deepLinkId" placeholder="导航路径">
                                            <el-option v-for="sys in navDeepLink" :key="sys.id" :label="sys.name" :value="sys.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <!-- 遍历结束 end -->
                    </transition-group>
                </draggable>

              <!-- 这里的页面也上面的nav导航配置页面是互斥逻辑，上面导航配置界面展示，下面的详细节目就不展示 -->
              <template v-if='!showNav'>
                <div  class="card_title_box">
                    <el-form :key="parentId" style="flex: 1" :disabled="isDisabled" ref="pageTypeForm" :model="pageTypeForm">
                        <el-form-item prop="pageType" :rules="[{ required: true, trigger: 'blur', message: `请选择页面类型` }]" label="页面类型：">
                            <el-radio-group @change="pageTypeChange(pageTypeForm.pageType)" v-model="pageTypeForm.pageType">
                                <el-radio :label="1">复合页面</el-radio>
                                <el-radio :label="2">独立页面</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <!-- 页面类型为 复合页面 -->
                    <el-button class="operate_btn" icon="el-icon-circle-plus" v-if="!isDisabled && pageTypeForm.pageType === 1" type="primary" @click="addSecondLevelMenu">新增</el-button>
                </div>


                <!-- 菜单功能配置 -->
                <!-- 当前面板在  页面类型选择 复合页面才展示 -->
                <draggable data-desc="菜单功能配置" :disabled="isDisabled" v-if="pageTypeForm.pageType === 1" :animation="300" class="menu_box" handle=".card_mover" v-model="activeMenu">
                    <transition-group>
                        <!-- 返回顶部锚点 -->
                        <!-- 当前tab下面没有菜单，item就没有id, 只能取索引，不然无法出现元素 -->
                        <div v-for="(item, activeIndex) in activeMenu" :key="item.id ? item.id: activeIndex" :id="`#card${item.id}`" class="menu_info">
                            <div class="menu_title">
                              <img v-if="!isDisabled" class="card_mover" :src="require('@/assets/images/icon_drag.png')" alt="" />
                              <div style="color: #F56C6C; margin-left: 4px;">*</div>
                              <el-input class="head_name" v-model.trim="item.name" :disabled="isDisabled" maxlength="7" placeholder="最多7个汉字"></el-input>

                                <!-- 样式类型 -->
                                <el-select :disabled='isDisabled' filterable v-model='item.styleType' style="marign-right: 8px" @change='(val) => onChangeStyle(val, item)'>
                                  <el-option v-for='(s, sIndex) in styleOptions' :key='sIndex' :label='s.text' :value='s.value'></el-option>
                                </el-select>

                                <!-- 展开/收起 -->
                                <div class="arrow-wrapper" @click='item.isOpen = !item.isOpen' >
                                  <img :class="item.isOpen ? '' : 'arrow_rotate'"  :src="require('@/assets/images/icon_more.png')" />
                                </div>

                                <span class="add_btn del_btn" v-if="!isDisabled" @click="addThreeLevelMenu(item, activeIndex)">添加</span>
                                <span class="del_btn" v-if="activeMenu.length > 1 && !isDisabled" @click="delClick(activeMenu, activeIndex)">删除</span>
                            </div>

                            <draggable data-desc="功能配置区域" :animation="300" v-if="item.isOpen" class="menu_box" handle=".function_mover" v-model="item.children">
                                <transition-group>
                                    <div v-for="(son, sonIndex) in item.children" :key="son.id || sonIndex"  :id="`#menu${activeIndex}${sonIndex}${son.id}`">
                                      <el-form class='three-level-menu' :disabled="isDisabled" :rules="cardRules" :ref="`card${activeIndex}${sonIndex}`" label-width="110px" :model="son">
                                        <div class="menu_title">
                                            <img v-if="!isDisabled" class="function_mover" :src="require('@/assets/images/icon_drag.png')" alt="" />
                                            <h5>{{ son.name }}</h5>
                                            <!-- 展开收起 -->
                                            <div class="arrow-wrapper" @click="son.isOpen = !son.isOpen">
                                              <img
                                                :class='son.isOpen ? "arrow_rotate": ""'
                                                :src="require('@/assets/images/icon_more.png')"
                                            />
                                            </div>

                                            <span class="del_btn" v-if="item.children.length > 1 && !isDisabled" @click="delClick(item.children, sonIndex)">删除</span>
                                        </div>
                                        <!-- 功能配置 -->
                                        <div v-show="son.isOpen" class="function_moudel function_tree">
                                              <div  class="form_box_padding">
                                                <el-form-item class="picLabel" label="导航图标：" :rules="picRules">
                                                    <div style="display: flex">
                                                        <ws-image-upload
                                                            :afterUpload="data => afterUpload(data, item.children, sonIndex, 'pic')"
                                                            :handleRemove="data => handleRemove(data, item.children, sonIndex, 'pic')"
                                                            :uploadValidate="(file) => beforeUploadFile(file, item.styleType)"
                                                            :urlList="getUrlList(son.pic)"
                                                            :disable="isDisabled"
                                                            :isDelete="!isDisabled"
                                                            class="ws_image_upload"
                                                            v-bind="options"
                                                           :class='(!son.pic &&isDisabled) ? "empty-icon": ""'
                                                        />
                                                        <div class="picTips">建议尺寸：{{getIconSize(item.styleType).text}}，支持png、gif</div>
                                                    </div>
                                                </el-form-item>

                                                <el-form-item  prop="type" label="导航类型：">
                                                    <el-radio-group :disabled='setNavigationTypeDisabled(son)' @change="onChangeNavagationType(son)" v-model="son.type">
                                                        <el-radio v-for="item in menuTypes" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>

                                                <!-- 样式1 才有导航名称 -->
                                                <el-form-item :rules='navNameRules' prop="name" label="导航名称：">
                                                    <el-input maxlength="7" v-model.trim="son.name" placeholder="请输入导航名称"></el-input>
                                                </el-form-item>

                                                <!-- APP应用 导航路径 -->
                                                <el-form-item v-if="son.type === 1"  prop="deepLinkId" :rules="[{ required: true, trigger: 'blur', message: `页面路径` }]" label="导航路径：">
                                                    <el-select
                                                        filterable
                                                        class="sys_select"
                                                        @change="(val) => selectAllChildById(item.children[sonIndex], val)"
                                                        v-if="son.type == 1"
                                                        :popper-append-to-body="false"
                                                        v-model="son.deepLinkId"
                                                        placeholder="页面路径"
                                                    >
                                                        <el-option v-for="sys in appConf" :key="sys.id" :label="sys.name" :value="sys.id"></el-option>
                                                    </el-select>
                                                </el-form-item>

                                                <!-- H5应用 导航路径 -->
                                                <el-form-item v-else prop="id" :rules="[{ required: true, trigger: 'blur', message: `请输入页面路径` }]" label="导航路径：">
                                                  <!-- 导航路径在 H5应用是可不重复选择，在编辑状态下，无法再选择自己， 所以直接显示中文 -->
                                                    <el-input disabled v-if="son.id && son.menuSysInfoName" v-model='son.menuSysInfoName'></el-input>
                                                     <!-- 注意：H5这里保存给后台是一个menuSysInfoId 不是以前的url路径了 -->
                                                    <el-select v-else filterable @change="(val) => onChangeH5NavPath(item.children[sonIndex], val)" v-model="son.menuSysInfoId">
                                                      <el-option v-for="sys in currentOrgSystemOpList" :key="sys.id" :label="sys.name" :value="sys.id"></el-option>
                                                    </el-select>
                                                </el-form-item>

                                                <el-form-item prop="menuDesc" label="页面描述：">
                                                    <el-input maxlength="25" v-model.trim="son.menuDesc" placeholder="请输入页面描述"></el-input>
                                                </el-form-item>
                                                </div>

                                            <!-- 功能菜单配置 -->
                                            <menuConfigTree v-if='showFeatureConfigTree(son)' :type="son.type" :treeList="toWrapArray(son.deepLinkMenuVo || son.children && son.children[0])"></menuConfigTree>
                                        </div>
                                        </el-form>
                                    </div>
                                </transition-group>
                            </draggable>
                        </div>
                    </transition-group>
                </draggable>

                <!-- 页面类型为 独立页面 -->
                <!-- 改为v-if实现 -->
                <div data-desc="独立页面" v-if="pageTypeForm.pageType === 2" class="h5_page">
                    <div class="h5_page_box">
                        <el-form :disabled="isDisabled" :rules="cardRules" class="form_box_padding" ref="cardPageH5" label-width="6rem" :model="activeMenu[0]">
                            <el-form-item :rules="[{ required: true, trigger: 'blur', message: `导航类型` }]" prop="type" label="导航类型：">
                                <el-radio-group @change="onChangeNavagationTypeForH5" v-model="activeMenu[0].type">
                                    <el-radio v-for="item in menuTypes" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item prop="name" :rules="[{ required: true, trigger: 'blur', message: `输入导航名称` }]" label="导航名称：">
                                <el-input maxlength="7" v-model.trim="activeMenu[0].name" placeholder="请输入导航名称"></el-input>
                            </el-form-item>

                            <el-form-item v-if="activeMenu[0].type == 1" prop="deepLinkId" :rules="[{ required: true, trigger: 'blur', message: `导航路径` }]" label="导航路径：">
                                <el-select
                                  filterable
                                    class="sys_select"
                                    @change="selectAllChildById(activeMenu[0], activeMenu[0].deepLinkId)"
                                    v-if="activeMenu[0].type == 1"
                                    :popper-append-to-body="false"
                                    v-model="activeMenu[0].deepLinkId"
                                    placeholder="导航路径"
                                >
                                    <el-option v-for="sys in appConf" :key="sys.id" :label="sys.name" :value="sys.id"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item v-else prop="url" :rules="[{ required: true, trigger: 'blur', message: `'请输入导航路径` }]" label="导航路径：">
                                <el-input :disabled="isDisabled || activeMenu[0].type == 1" maxlength="100" v-model.trim="activeMenu[0].url" placeholder="请输入导航路径"></el-input>
                            </el-form-item>

                            <el-form-item prop="menuDesc" label="页面描述：">
                                <el-input maxlength="25" v-model.trim="activeMenu[0].menuDesc" placeholder="请输入页面描述"></el-input>
                            </el-form-item>
                        </el-form>

                        <!-- 独立页面 场景，H5应用还是不会展示 菜单功能配置树 -->
                        <menuConfigTree v-if="activeMenu[0].type == 1" :type="activeMenu[0].type" :treeList="toWrapArray(activeMenu[0].deepLinkMenuVo)"></menuConfigTree>
                    </div>
                </div>
              </template>
            </div>
        </section>

        <ws-footer>
          <div v-show='isDisabled'>
            <el-button @click="goBack">返 回</el-button>
            <el-button type="primary" :loading="loading" @click="onEdit">修 改</el-button>
          </div>

          <div v-show='!isDisabled'>
            <el-button  @click="cancel('')">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="onSubmitCheck">保 存</el-button>
          </div>
        </ws-footer>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { judgeType } from '../../../utils/commMethods.js'
import { getStyleOptions, getMenuTypes, getInitMenuTemplate, getInitForSecondMenuTemplate, getInitForThreeMenuTemplate, navNameRules, navRules, cardRules, picRules, validSameNavgationPathForH5 } from './data.js'
import appPreviewLayout from './components/appPreviewLayout.vue'
import menuConfigTree from './components/menuConfigTree.vue'
import {cloneDeep, debounce} from 'lodash-es'

export default {
  name: 'appSystem',
  components: { draggable, appPreviewLayout, menuConfigTree },
  props: {
    orgType: {
      type: Number,
      default: 0
    },
    moduleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      navRules,
      cardRules,
      //图片上传
      options: {
        quantity: 1,
        actions: {
          url: '/file/upload', //上传地址，优先级高于moduleName
          op: '' //上传op，优先级高于moduleName
        },
        fileExt: ['png', 'gif']
      },
      isDisabled: true,
      mentInfo: {},
      isShow: true,
      showNav: '',
      // 左侧手机区域  底部导航的所有数据
      navList: [],
      // 导航路径-deeplink List枚举
      appConf: [],

      // 当前高亮选中的菜单
      activeMenu: [],
      activeIndex: '',
      copyNavList: [],

      navId: '',
      titleName: '',
      systemInfo: {},
      menuData: {},
      menuDetail: {},
      loading: false,
      menuTypes: getMenuTypes(),
      copySelectMenu: [],
      pageTypeForm: {
        pageType: 0,
      },
      defaultProps: {
        children: 'deepLinkChildVos',
        label: 'name'
      },
      parentId: '',
      // 导航路径-枚举
      navDeepLink: [],
      imgList: [require(`@/assets/icons/app/banner@2x.webp`)],
      activeMenuIndex: '',

      styleOptions: getStyleOptions(),

      // 导航图标的行内验证规则
      picRules,
      navNameRules,

      // 当前机构op列表
      currentOrgSystemOpList: []
    }
  },

    computed: {
        headline() {
            let list = this.navList.filter(item => item.id == this.navId)[0];
            if (this.showNav) return '导航配置'
            return list?.name
        }
    },

    watch: {
        orgType: {
            handler(val) {
              this.isDisabled = true
              this.getOrgSystemOpList()

              this.navId = '';
              this.appConfigQuery();
              this.selectListByOrgType(val);
              this.selectNavigateListByOrgType(val);
            },
            immediate: true,
        }
    },

    methods: {
        pageTypeChange(type) {
            if (type == 1 && this.activeMenu.length == 1 && !this.activeMenu[0].children) {
                this.activeMenu[0].children = [{
                    name: '',
                    url: '',
                    imgUrl: '',
                    menuDesc: '',
                    activeImgUrl: '',
                    navDec: '',
                    // pageType: 1
                }];
            }
        },

        // TODO 页面逻辑乱，后期需抽时间优化 -----------------------------------
        async deepFunction(menu = []) {
            if (!menu || menu.length == 0) return;
            for (let item of menu) {
                if (item.type == 1 && item.deepLinkId) {
                  // 循环获取菜单功能配置
                    this.selectAllChildById(item, item.deepLinkId);
                }

                if (item.children && item.children.length > 0) {
                    this.deepFunction(item.children);
                }
            }
        },

        // 根据deeplinkId获取其所有配置 - 待优化 - 实际就是获取  功能菜单配置
        async selectAllChildById(data, id) {
            try {
                let res = await this._axios({ op: 'selectAllChildById', id }, this.moduleName, '/authority/deeplink/select');
                if (res.code === 1) {
                  const item = res.data

                  if (item && Object.keys(item).length) {
                    this.$set(data, 'deepLinkMenuVo', [res.data]);
                  } else {
                    this.$set(data, 'deepLinkMenuVo', [])
                  }
                }
            } catch (_err) {
                throw _err;
            }
        },

        goBack() {
            // 展示nav导航信息，返回上一页面
            if (this.showNav) {
              // 只能用 path跳转，不能通过name ，猜测可能是keep-alive 了
              this.$router.push({
                path: '/technology'
              })
              return
            }

            // 说明展示的是tab里面的子菜单
            this.showNav = true

            this.activeMenuIndex = ''

            let originNavList = this.$baseMethod.deepClone(this.copyNavList)
            // 将菜单还原 - 为最外层大类的第一项
            this.navList = originNavList
            this.activeMenu = this.$baseMethod.deepClone(originNavList[0].children)
        },


        // 取消表单
        cancel() {
          this.isDisabled = true
          let originNavList = this.$baseMethod.deepClone(this.copyNavList)
          // 将菜单还原 - 为最外层大类的第一项
          this.navList = originNavList
          this.activeMenu = this.$baseMethod.deepClone(originNavList[0].children)
        },

        /**
         * 修改
         */
        onEdit() {
          this.isDisabled = false

          // 当前编辑的是 tab下面的菜单
          if (!this.showNav) {
            // 查看一下当前的 菜单
            this.setH5AppNavgationPathId(this.activeMenu, 'edit')
          }
        },

        /**
         * 编辑状态下，需要将 H5应用的 导航路径id去掉， 因为导航路径不可选择重复的，后台已经将数据过滤掉了, select的List是无法匹配到的
         * @param {Array<any>} target
         * @param {Eunm <'edit'| 'save'>} action 编辑状态，去掉menuSysInfoId， 保存的时候，数据还原
         */
        setH5AppNavgationPathId(target, action) {
          target.forEach(levelItem => {
            if (levelItem.children && levelItem.children.length) {
              const secondList = levelItem.children

              secondList.forEach(secondLevel => {
                // 导航类型为 H5应用
                if (secondLevel.type === 2) {
                  if (action === 'edit') {
                    secondLevel._menuSysInfoId = secondLevel.menuSysInfoId
                    secondLevel.menuSysInfoId = null
                  } else {
                    // 保存 - 从上面编辑场景中 重新取值
                    if (!secondLevel.menuSysInfoId) {
                      secondLevel.menuSysInfoId = secondLevel._menuSysInfoId
                    }

                    // 新增第三层数据，menuSysInfoId 是一定有值的，无需处理
                  }
                }
              })
            }
          })
        },

        onSubmitCheck: debounce(function() {
          let valid = true
          if (this.showNav) {
            valid = this.onCheckNavagationMenu()
          } else {
            valid = this.onCheckSubMenu()
          }

          if (valid) {
            this.submitSave()
          }
        }, 2000, {
          // true 先调用后等待
          leading: true,
          trailing: false
        }),

        // 保存
        async submitSave() {
            try {
                let res;

                // 底部导航菜单的保存
                if (this.showNav) {
                  res = await this.updateAppNavigateMenu()
                  console.log('保存 底部tab')
                } else {
                  // 保存tab下的菜单
                  res = await this.updateCardButtonMenu()
                }

                if (res && res.code === 1) {
                    this.$message.success('保存成功');
                    this.isDisabled = true;
                    await this.appConfigQuery('update')

                    // 需要在查询完菜单以后再让用户能继续操作-快速操作会导致菜单存在一定几率丢失
                    this.loading = false

                    // 重新将枚举接口查询一下-避免用户重复选择同一个H5应用导航
                    this.getOrgSystemOpList()
                }
            } catch (error) {
              this.loading = false
              console.log('保存失败', error)
            }
        },

        // 排序处理
        sortHandle(list) {
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                data.sort = i;
                data.buttonMenus = data.children;
                if (data.buttonMenus) {
                    this.sortHandle(data.buttonMenus);
                }
            }
        },

        /**
         * 验证当前tab下的所有子菜单
         */
        onCheckSubMenu() {
          // 复合页面
          if (this.pageTypeForm.pageType === 1) {
            // 验证所有的二级标题是否都填写了
            let validPanelTitle = this.activeMenu.every(p => p.name)

            if (!validPanelTitle) {
              this.$message.warning('请填写模块标题!')
              return false
            }

            // 调试使用，层级过深，数据多的情况，不好判断是哪条记录有问题
            let errorTips = {
              pic: '导航图标必填',
              deepLinkId: ' APP应用 导航路径必填',
              url: ' H5应用 导航路径必填',
              name: ' 导航名称必填',
              desc: '',
              errType: null
            }

            let validIcon = this.activeMenu.every(p => {
              // 验证图标和导航路径
              return p.children.every(innerItem => {
                if (!innerItem.pic ) {
                  errorTips.errType = 'pic'
                  errorTips.desc = innerItem.name || ''
                  return false
                }

                if (!innerItem.name) {
                  errorTips.errType = 'name'
                  errorTips.desc = innerItem.name || ''
                  return false
                }

                // 判断导航类型
                // app应用
                if (innerItem.type === 1) {
                  if (innerItem.deepLinkId === null || innerItem.deepLinkId === "") {
                    errorTips.errType = 'deepLinkId'
                    errorTips.desc = innerItem.name || ''
                    return false
                  }

                  return true
                } else {
                  // h5应用
                  // 这2个字段，menuSysInfoId 对应新增的场景； _menuSysInfoId对应编辑的场景
                  const validSysId = Boolean(innerItem.menuSysInfoId) || Boolean(innerItem._menuSysInfoId)
                  if (!validSysId) {
                    errorTips.errType = 'url'
                    errorTips.desc = innerItem.name || ''
                    return false
                  }

                  return true
                }
              })
            })

            if (!validIcon) {
              let message = errorTips[errorTips.errType]
              this.$message.warning(`菜单: ${errorTips.desc}${message}`)
              return false
            }

            return true
          } else {
            let isOk = true
            // 独立页面
            this.$refs['cardPageH5'].validate(valid => isOk = valid)

            return isOk
          }
        },

        // 保存多个实体店app卡片,按钮菜单
        async updateCardButtonMenu() {
          // if (!this.onCheckSubMenu()) return
          this.loading = true;
          console.log('保存小菜单')
            try {
                this.sortHandle(this.activeMenu)

                const cardMenus = cloneDeep(this.activeMenu)
                this.setH5AppNavgationPathId(cardMenus, 'save')

                const validSame = validSameNavgationPathForH5(cardMenus)

                if (!validSame.result) {
                  this.$message.warning(`H5应用,导航名称 ${validSame.error} 重复`)
                  return
                }

                let param = {
                    orgType: this.orgType,
                    parentId: this.parentId,
                    pageType: this.pageTypeForm.pageType,
                    cardMenus: cardMenus,
                    op: 'updateCardButtonMenu',
                };

                let res = await this._axios(param, '', '/authority/appMenu/update');
                return res;
            } catch (_err) {
              this.loading = false;
              console.error(_err);
            }
        },

        /**
         * 校验底部菜单的保存
         */
        onCheckNavagationMenu() {
          const refList = this.navList.map((p, index)=> {
            return `nav${index}`
          })

          let result = refList.every((key) => {
            let isOk = true

            // 这里获取的ref组件实例是一个 数组
            if (this.$refs[key][0]) {
              this.$refs[key][0].validate(valid => {
                isOk = valid
              })
            }
            return isOk
          })

          return result
        },
        // app修改导航菜单
        async updateAppNavigateMenu() {
          // if (!this.onCheckNavagationMenu()) return

          this.loading = true

            try {
                let param = {
                    orgType: this.orgType,
                    parentId: this.allAppData.id,
                    navigateMenus: this.deleteJsonKey(
                        this.navList.map((item, index) => {
                            return { ...item, sort: index };
                        }),
                        ['functions', 'children']
                    ),
                    op: 'updateAppNavigateMenu',
                };

                let res = await this._axios(param, this.moduleName);
                return res;
            } catch (error) {
              this.loading = false
              console.error(error);
            }
        },

        //配置验证
        validateAddFields(data) {
            return data
                .map(item => {
                    for (let key in item) {
                        if (!item[key] && ['name'].includes(key)) {
                            this.$message.error(`${{ name: '模块标题' }[key]}为必填项!`);
                            return false;
                        }
                    }
                    return true;
                })
                .every(field => field);
        },

        // 多表单校验
        checkForm(rules) {
            let list = rules.map(item => {
                return new Promise((resolve, reject) => {
                    (this.$refs[item][0] || this.$refs[item]).validate(valid => {
                        if (valid) {
                            resolve(true);
                        } else reject(false);
                    });
                });
            });
            return Promise.all(list);
        },

        handleRemove(data, menu, index, key) {
            menu[index][key] = '';
        },

        afterUpload(data, menu, index, key) {
            // 上传成功回调函数
            let imageUrl = data.data;
            menu[index][key] = imageUrl;

            return [imageUrl];
        },

        // 删除对应key
        deleteJsonKey(target, keys) {
            if (target.length == 0) {
                return target;
            }
            let result = [];
            if (Array.isArray(keys)) {
                let mixed = Object.keys(...target).filter(x => !new Set(keys).has(x));
                result = JSON.parse(JSON.stringify(target, mixed));
            } else {
                result = JSON.parse(
                    JSON.stringify(target, (k, v) => {
                        if (k !== keys) {
                            return v;
                        }
                    })
                );
            }
            return result;
        },
        /**
         * 新增底部菜单大类（工作台，代办，消息 ）同级大类
         */
        addFirstLevelMenu() {
          let sort = this.navList.length + 1

          const newMenu = getInitMenuTemplate(this.orgType, sort)

          this.navList.push(newMenu)
          // todo 可能需要给原始数据同样新增一条记录
        },

        /**
         * 新增当前tab内的菜单
         * 例如： 在工作台tab中新增一个 面板
         */
        addSecondLevelMenu() {
          let sort = this.activeMenu.length + 1
          const item = getInitForSecondMenuTemplate(this.orgType, sort)
          this.activeMenu.push(item)
        },

        /**
         * 新增第三层-具体菜单项
         * @param {Object} item 第二层菜单 对象
         * @param {Number} itemForSecondIndex  第二层菜单在第一层菜单里面的 索引， v-for 的index
         */
        addThreeLevelMenu(item, itemForSecondIndex) {
          let currentStyle = this.styleOptions.find(p => p.value === item.styleType)

          // 不允许新增
          if (currentStyle.count && item.children.length >= currentStyle.count) {
            this.$message.warning(`当前选择${currentStyle.text}限定个数为${currentStyle.count}`)
            return
          }

          const sort = item.children.length + 1

          const threeItem = getInitForThreeMenuTemplate(this.orgType, sort, item.id)

          item.children.push(threeItem)

          // 构造锚点id 字符串 - 和上面template中 构造的方式一模一样
          const id = `#menu${itemForSecondIndex}${item.children.length-1}`

          // console.log('拿到的锚点id', `#menu${itemForSecondIndex}${item.children.length-1}`)

          this.$nextTick(() => {
            const targetDOM = document.getElementById(id)

            // 将试图滚动到指定位置
            if (targetDOM) {
              targetDOM.scrollIntoView({ behavior: 'smooth' })
            }
          })
        },

        getUrlList(url) {
            // 图片地址集合，可用于修改返回图片地址
            let imgArr = [];
            url && imgArr.push(url);
            return imgArr;
        },

        // 删除 nav 导航
        delClick(list, index) {
            list.splice(index, 1);
        },

        /**
         * 切换底部tab
         */
        onChangeTabNav(menu) {
          if (menu.id === null || menu.id === undefined) {
            // 说明是新增tab， 不做任何处理
            return
          }

          // 判断是否当前点击的tab有子菜单，没有则初始化一个进去
          let children = menu.children || []

          menu._text = '第一层'

          if (children.length === 0) {
            let item = {
              id: null,
              type: 1,
              pic: '',
              name: '',
              url: '',
              menuDesc: '',
              isOpen: true,
              styleType: 1,
              // 单纯做测试标注的-无任何影响
              _text: "第二层",
              deepLinkId: null,
              deepLinkMenuVo: [],
              children: [{
                type: 1,
                pic: '',
                name: '',
                url: '',
                menuDesc: '',
                isOpen: true,
                _text: '第三层',
                deepLinkId: null,
                deepLinkMenuVo: [],
                sort: 0,
                orgType: this.orgType
              }]
            }

            children.push(item)
          }

          this.activeMenu = children
          // 将当前菜单也copy一份；在取消的时候做还原操作
          this.copySelectMenu = this.$baseMethod.deepClone(menu);
          this.parentId = menu.id;
          this.navId = menu.id;
          this.pageTypeForm.pageType = menu?.pageType || 1;
          this.isDisabled = true;
          // 切换到具体当前tab的子面板节目
          this.showNav = false
          this.activeMenuIndex = '';

           this.$nextTick(() => {
                setTimeout(() => {
                    document.getElementById('#card0') && document.getElementById('#card0').scrollIntoView({ behavior: 'smooth' });
                }, 10);
            });
        },


        // 锚点定位滑动
        clickanchor(idName, menu, index) {
          // this.isDisabled = true;
          console.log('点击底部的菜单', idName, '---menu,', menu, 'index--', index)

            this.showNav = false;
            let initData = [
                {
                    name: '',
                    pic: '',
                    url: '',
                    type: 1,
                    orgType: this.orgType,
                    menuDesc: '',
                    children: [{ type: 1 }],
                },
            ];
            // 点击nav返回top待处理 - 不会被调用
            if (idName.indexOf('card') > -1) {
                menu.children = menu.children ? menu.children : judgeType(menu.children, initData);
                this.$refs['pageTypeForm'] && this.$refs['pageTypeForm'].resetFields();
                // 切换菜单
                this.activeMenu = menu.children;
                this.copySelectMenu = this.$baseMethod.deepClone(menu);
                this.parentId = menu.id;
                this.navId = menu.id;
                this.pageTypeForm.pageType = menu?.pageType || 1;

                this.activeMenuIndex = '';
                this.cancel('card');
            }

            // 复制当前点击菜单，恢复用
            if (idName.indexOf('menu') > -1) {
                let menuData = this.navList.filter(item => item.id == menu.parentId)[0];
                this.copySelectMenu = this.$baseMethod.deepClone(menuData);
                this.pageTypeForm.pageType = menuData?.pageType || 1;
                this.activeMenuIndex = index;
            }

            this.$nextTick(() => {
                setTimeout(() => {
                    document.getElementById(idName) && document.getElementById(idName).scrollIntoView({ behavior: 'smooth' });
                }, 10);
            });
        },

        // 根据机构类型获取deeplink下拉
        async selectListByOrgType(orgType) {
            try {
                let res = await this._axios({ op: 'selectListByOrgType', orgType }, this.moduleName, '/authority/deeplink/select');
                if (res.code === 1) {
                  this.appConf = res.data || []
                }
            } catch (error) {
                console.log('查询deepLink 下拉枚举失败')
                console.log(error)
            }
        },

        /**
         * app端配置查询
         * 查询所有界面菜单信息
         */
        async appConfigQuery(type) {
            try {
                let res = await this._axios({ op: 'selectAppDetail', orgType: this.orgType }, this.moduleName);

                if (res.code !== 1) return

                let t = res.data || {}

                t.menus = t.menus || []

                let data = []

                if (t.menus.length) {
                  data = t.menus[0].children || []
                } else {
                  data =  [{ id: '', parentId: t.id, name: '新增导航', sort: 1, orgType: this.orgType, children: [], type: 1 }]
                }

                // 增加附属字段- 这里总共有3层
                data.forEach(p => {
                  // 底部nav  第一层
                  p.isOpen = true

                  p.children = p.children || []

                  // nav里面的菜单，第二层
                  p.children = p.children.map(second => {
                    let secondChildren = second.children || []

                    // 第三层-菜单项
                    secondChildren = secondChildren.map(thrid => {
                      return {
                        ...thrid,
                        isOpen: true
                      }
                    })

                    return {
                      ...second,
                      isOpen: true,
                      styleType: second.styleType || 1,
                      children: secondChildren
                    }
                  })
                })

                this.allAppData = t

                    this.systemInfo.id = this.allAppData.id;
                    this.navList = data;

                    if (this.parentId) {
                        let info = this.navList.filter(item => item.id === this.parentId)[0];
                        this.pageTypeForm.pageType = info?.pageType || 1;
                    } else {
                        this.pageTypeForm.pageType = data[0]?.pageType || 1;
                    }
                    this.copyNavList = this.$baseMethod.deepClone(data); // 深拷贝一份，取消时恢复

                    // 修改记录信息
                    let { createUserName, createTime, updateUserName, updateTime } = this.allAppData;
                    this.$emit('editLog', { createUserName, createTime, updateUserName, updateTime });

                    // 设置当前的菜单清单
                    this.activeMenu = data[0].children || [];

                    if (!type) {
                      this.activeMenuIndex = ''
                    }

                    // 有选中的nav导航id，不刷新页面，防止右侧菜单滑动轨迹重置
                    if (this.navId) return;

                    // 保存当前显示卡片的父节点id,更新卡片信息入参
                    this.parentId = data[0].id || '';
                    this.navId = data[0].id || '';
                    this.showNav = true;
            } catch (error) {
              console.log('appConfigQuery--报错')
              console.log(error)
            }
        },

        // 根据机构类型获取导航deeplink下拉列表 https://yapi.wsecar.cn/project/2215/interface/api/100991
        async selectNavigateListByOrgType(orgType) {
            try {
                let res = await this._axios({ op: 'selectNavigateListByOrgType', orgType }, this.moduleName, '/authority/deeplink/select');
                if (res.code === 1) {
                    this.navDeepLink = res.data || []
                }
            } catch (error) {
                console.log('根据机构类型获取导航deeplink下拉列表-报错')
                console.log(error)
            }
        },

        /**
         * 将一个对象包装成数组，符合Tree所需要的结构
         * @param {Object} obj
         * @return {Array} []
         */
        toWrapArray(obj) {
          if ([null, ''].includes(obj)) return []

          if (Array.isArray(obj)) return obj

          return [obj]
        },

        /**
         * 切换样式
         */
        onChangeStyle(val, item) {
          let count = this.styleOptions.find(p => p.value === val).count
          // 从原始数据中拿到子项直接替换， 不能直接操作 itme, 会导致每次切换，引用对象 children越来越少
          let originFirstLevel = this.copyNavList.find(p => p.id === item.parentId)

          // 有原始数据，说明接口有保存过，操作对象为接口数据
          if (originFirstLevel) {
            let originSecondLevel = originFirstLevel.children.find(p => p.id === item.id)

            if (originSecondLevel) {
              originSecondLevel.children = originSecondLevel.children || []

                // 没有限制
                if (val === 1) {
                  item.children = this.$baseMethod.deepClone(originSecondLevel.children)
                } else {
                  item.children = originSecondLevel.children.filter((p, index) => index < count)
                }
            }
          } else {
            // 接口没有保存过，但是子项目是有数据的
            const children = item.children || []

            if (count) {
              item.children = children.filter((p, index) => index < count)
            }
          }
        },

        /**
         * 复合页面 - 切换导航类型
         */
        onChangeNavagationType(threeLevelItem) {
          // 清空APP类型的导航路径
          threeLevelItem.deepLinkId = null
          // 清空APP页面场景的 功能菜单配置的入参
          threeLevelItem.deepLinkMenuVo = []
          // 清空页面路径
          threeLevelItem.url = null

          // 导航类型为H5需要清空的字段
          threeLevelItem.menuSysInfoId = null
          threeLevelItem._menuSysInfoId = null
          threeLevelItem.children = []
          threeLevelItem.menuSysInfoName = null
        },


        /**
         * 独立页面-切换导航类型
         */
        onChangeNavagationTypeForH5() {
          let currentSingnlePage = this.activeMenu[0]

          // 独立页面，切换导航类型，需要清空
          currentSingnlePage.url = null
          currentSingnlePage.deepLinkId = null
          currentSingnlePage.deepLinkMenuVo = null

          this.$refs['cardPageH5'].clearValidate()
        },

        getIconSize(itemStyle) {
          return this.styleOptions.find(p => p.value === itemStyle).iconSize
        },

        async beforeUploadFile(file, itemStyle) {
          let iconSize= this.getIconSize(itemStyle)

          let base64 = await this.getImageBase64(file)

          let {width, height} =await this.getImagePx(base64)

          console.log(width, height)

          // 支持图标1倍图和2倍图
          if ((width === iconSize.width && height === iconSize.height) || (width === iconSize.width * 2 && height === iconSize.height * 2)) {
            return true
          }

          this.$message.warning(`图像尺寸不符合要求, 请上传${iconSize.width * 2}px * ${iconSize.height * 2}px`)
          return false
        },
        getImageBase64(file) {
          let reader = new FileReader()

          reader.readAsDataURL(file)

          return new Promise((resolve) => {
            reader.onload = () => {
              resolve(reader.result)
            }
          })

        },
        getImagePx(base64) {
          let image = new Image()
          image.src = base64

          return new Promise((resolve) => {
            image.onload = () => {
              const width = image.width
              const height = image.height

              resolve({width, height})
            }
          })
        },

        /**
         * 查询当前机构的 op 列表
         */
        async getOrgSystemOpList() {
          try {
            this.currentOrgSystemOpList = []

            const res = await this._axios({ op: 'selectAllAppSysInfo', orgType: this.orgType }, '','/authority/appSystem/select')

            if (res.code === 1) {
              const list = res.data || []

              this.currentOrgSystemOpList = list
            }
          } catch (error) {
            this.currentOrgSystemOpList = []
            console.log(error)
          }
        },

        /**
         * 切换H5应用选择的导航路径-查询对应导航路径下的op菜单Tree
         */
        async onChangeH5NavPath(item, id) {
          item.url = ''
          try {
            let res = await this._axios({ op: 'selectAppSystemMenuTree', id, orgType: this.orgType }, '', '/authority/appSystem/select');

            if (res.code == 1) {
              const r1 = this.currentOrgSystemOpList.find(p => p.id === id)

              if (r1) {
                item.menuSysInfoName = r1.name
              }

              if (!res.data || res.data.length === 0) {
                this.$set(item, 'deepLinkMenuVo', []);
                return
              }

              // H5应用在根路径下只会存在一个 菜单， 其他的权限都是挂载 这个菜单下面的，所以这是 res.data[0]

                this.$set(item, 'deepLinkMenuVo', [res.data[0]]);
                console.log(item)
            }
          } catch (err) {
            console.log('查询H5导航 对应菜单OP树失败 ',err)
          }
        },

        /**
         * 复合页面 - 是否展示功能菜单配置
         */
        showFeatureConfigTree(item) {
          if(item.type === 1 && item.deepLinkId) return true

          if (item.type === 2 && (item.menuSysInfoId || item._menuSysInfoId)) return true

          return false
        },

        /**
         * 当之前已经保存过菜单，则不能再切换导航类型了
         * 切换导航类型的动作 会和 H5保存过，不能再重新设置冲突了
         * 导航类型为H5的 - 直接禁用 - 禁止切换, 禁用的其实是 H5导航路径只能删除重新选，而不能直接通过select切换更改（需求设计如此）
         */
        setNavigationTypeDisabled(son) {
          if (son.id) return true

          return false
        }
    }
};
</script>

<style lang="less" scoped>
@import url('./appSystem.less');
</style>
