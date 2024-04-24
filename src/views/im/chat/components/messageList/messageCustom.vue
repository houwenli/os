<template>
    <div v-html="newTIMCustomElem(message)"></div>
</template>
<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        // 自定义信息展示
        newTIMCustomElem(item){
            let data;
            try{
                data = JSON.parse(item.payload.data);
            }catch(e){
                
            }
            if(data && data.businessID){
                let _html = '';
                switch(data.businessID){
                    case 'ws_group_notice':
                        _html = `${data.operatorName}发布新公告`;
                    break;
                    case 'ws_oc_order':
                        _html = `
                            <div>
                                <p>时间：${data.createTime}</p>
                                <p>起点：${data.startAddress}</p>
                                <p>终点：${data.endAddress}</p>
                                <p>订单状态：${data.orderStatusRemark}</p>
                                <p>订单号：${data.orderId}</p>
                            </div>
                        `;
                    break;
                    case 'ws_group_tips':
                        _html = `${data.content}`;
                    break;
                    default: 
                    break;
                }
                return _html;
            }else{
                if(item.payload.data === 'group_create'){
                    return `<span>${item.nick}创建群组</span>`
                }else{
                    return `<span>${item.payload.extension}</span>`
                }
            }
        },
    }
}
</script>
<style scoped>

</style>