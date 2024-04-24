<template>
    <div>
        <editor v-model="contentTxt" :init="editorInit" :placeholder="placeholderHtml" :disabled="disabled"></editor>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import editor from '@tinymce/tinymce-vue';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/link';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/image';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/insertdatetime';
export default {
    name: 'TinyEditor',
    components: {
        editor
    },
    props: {
        value: {
            type: String,
            default: () => ''
        },
        disabled: {
            type: Boolean,
            default: () => false
        }
    },
    data () {
        let fonts = ['宋体=宋体', '微软雅黑=微软雅黑', '楷书=楷书', '隶书=隶书', '仿宋=仿宋', 'Verdana=Verdana'];
        return {
            editorInit: {
                height: '750px',
                resize: 'both',
                language_url: '/static/tinymce/langs/zh_CN.js', //语言包的路径
                language: 'zh_CN', //语言
                skin_url: '/static/tinymce/skins/lightgray', //skin路径
                branding: false, //是否禁用“Powered by TinyMCE”
                menubar: false, //顶部菜单栏显示
                fontsize_formats: '10px 12px 14px 16px 18px 24px 36px',
                plugins: ['preview advlist autolink link lists hr table stylebuttons textcolor image insertdatetime placeholder'],
                fonts: ['宋体'],
                toolbar: false,
                font_formats: fonts.join(';'),
                paste_data_images: true,
                statusbar: false,
                images_upload_handler: (blobInfo, success, failure) => {
                    let formData = new FormData(),
                        token = this.$baseMethod.getStore('_ccmUser').token;
                    formData.append('file', blobInfo.blob());
                    formData.append('op', 'imgUpload');
                    formData.append('token', token);
                    formData.append('data', JSON.stringify({}));

                    let url = '/message/news/uploadFile';
                    this.$upLoad(url, formData)
                        .then(res => {
                            // console.log(JSON.parse(res.data).publicDownUrl)
                            success(JSON.parse(res.data).publicDownUrl); //提交图片返回url
                        })
                        .catch(err => {
                            this.$message.error(err.msg);
                            failure(err.msg);
                        });
                    return false;
                }
            },
            contentTxt: '',
            placeholderHtml: '请输入...',
        };
    },

    methods: {
        getContent () {
            return tinymce.activeEditor.getContent();
        },
        // 页面有多个编辑器时
        getMoreContent (index) {
            return tinymce.editors[index].getContent();
        },
        setContent (val) {
            this.contentTxt = val;
        }
    },

    watch: {
        value: {
            immediate: true,
            handler (val) {
                this.contentTxt = val;
            }
        }
    },

    created () {
        tinymce.PluginManager.add('stylebuttons', function (editor, url) {
            ['pre', 'p', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (name) {
                editor.addButton('style-' + name, {
                    tooltip: 'Toggle ' + name,
                    text: name.toUpperCase(),
                    onClick: function () {
                        editor.execCommand('mceToggleFormat', false, name);
                    },
                    onPostRender: function () {
                        let self = this,
                            setup = function () {
                                editor.formatter.formatChanged(name, function (state) {
                                    self.active(state);
                                });
                            };
                        editor.formatter ? setup() : editor.on('init', setup);
                    }
                });
            });
        });
        tinymce.PluginManager.add('placeholder', function (editor) {
            editor.on('init', function () {
            let label = new Label()
            onBlur()
            tinymce.DOM.bind(label.el, 'click', onFocus)
            editor.on('focus', onFocus)
            editor.on('blur', onBlur)
            editor.on('change', onBlur)
            editor.on('setContent', onBlur)
            function onFocus() { if (!editor.settings.readonly === true) { label.hide() } editor.execCommand('mceFocus', false) }
            function onBlur() { if (editor.getContent() === '') { label.show() } else { label.hide() } }
            })
            let Label = function () {
                        let placeholderText = editor.getElement().getAttribute('placeholder') || editor.settings.placeholder
                        let placeholderAttrs = editor.settings.placeholderAttrs || { style: { position: 'absolute', top: '6px', left: 0, color: '#aaaaaa', padding: '.25%', margin: '5px', width: '80%', 'font-size': '17px !important;', overflow: 'hidden', 'white-space': 'pre-wrap' } }
                        let contentAreaContainer = editor.getContentAreaContainer()
            tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative')
            this.el = tinymce.DOM.add(contentAreaContainer, 'label', placeholderAttrs, placeholderText)
            }
            Label.prototype.hide = function () { tinymce.DOM.setStyle(this.el, 'display', 'none') }
            Label.prototype.show = function () { tinymce.DOM.setStyle(this.el, 'display', '') }
        })
    },

    mounted () {
        tinymce.init({});
    }
};
</script>
<style scoped lang="scss">
/deep/.mce-panel {
    border: 0 !important;
    box-shadow: none;
}
</style>
