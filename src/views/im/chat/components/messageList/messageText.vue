<template>
    <div class="text-warp">
        <template v-for="(item) in data.text">
            <span class="text-box" v-if="item.name === 'text'" v-html="item.text"></span>
            <img class="text-img" v-else-if="item.name === 'img'" :src="item.src" />
        </template>
    </div>
</template>
<script>
import { emojiMap, emojiUrl } from '../../../../../assets/emj'
export default {
    props: {
        message: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        data(){
            return {
                text: this.decodeText(this.message.payload),
            }
        }
    },
    data() {
        return {
            emojiMap: emojiMap,
        }
    },
    methods: {
        decodeText(payload) {
            let atUserList = this.message.atUserList;
            let atObjUser = [];
            if(atUserList.length > 0){
                let atObj = this.$store.state.im.baseGroupUserList.atObj;
                atUserList.map(item => {
                    if(item === '__kImSDK_MesssageAtALL__'){
                        atObjUser.push('@所有人')
                    }else{
                        atObjUser.push('@' + atObj[item])
                    }
                })
            }
            const renderDom = [];
            // 文本消息
            let temp = payload.text;
            let left = -1;
            let right = -1;
            while (temp !== '') {
                left = temp.indexOf('[');
                right = temp.indexOf(']');
                switch (left) {
                    case 0:
                        if (right === -1) {
                            renderDom.push({
                                name: 'text',
                                text: temp,
                            });
                            temp = '';
                        } else {
                            const emojiKey = temp.slice(0, right + 1);
                            if (emojiMap[emojiKey]) {
                                renderDom.push({
                                    name: 'img',
                                    src: emojiUrl + emojiMap[emojiKey],
                                });
                                temp = temp.substring(right + 1);
                            } else {
                                renderDom.push({
                                    name: 'text',
                                    text: '[',
                                });
                                temp = temp.slice(1);
                            }
                        }
                    break;
                    case -1:
                        if(atObjUser && atObjUser.length>0){
                            atObjUser.map(item => {
                                temp = temp.replace(item, `<span style="color: #0088FF;">${item} </span>`)
                            })
                            renderDom.push({
                                name: 'text',
                                text: temp,
                            });
                            temp = '';
                        }else{
                            renderDom.push({
                                name: 'text',
                                text: temp,
                            });
                            temp = '';
                        }
                    break;
                    default:
                        renderDom.push({
                            name: 'text',
                            text: temp.slice(0, left),
                        });
                        temp = temp.substring(left);
                    break;
                }
            }
            return renderDom;
        }
    }
}
</script>
<style scoped>
.text-warp {
    display: flex;
    align-items: center;
}
.text-img {
    width: 25px;
    height: 25px;
}
</style>