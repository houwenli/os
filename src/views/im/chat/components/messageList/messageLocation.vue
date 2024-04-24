<template>
    <div>
        <a class="message-location" :href="location.href" target="_blank" title="点击查看详情">
            <span class="el-icon-location-outline">{{location.description}}</span>
            <img :src="location.url" />
        </a>
    </div>
</template>
<script>
export default {
    props: {
        message: {
            type: Object,
            default: () => { }
        }
    },
    watch: {
        'message': {
            handler(newV, oldV) {
                if(newV){
                    let l = {
                        lon: '',
                        lat: '',
                        href: '',
                        url: '',
                        description: '',
                        message: newV,
                    };
                    l.lon = newV.payload.longitude.toFixed(6);
                    l.lat = newV.payload.latitude.toFixed(6);
                    l.href =
                        'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&' +
                        `pointx=${l.lon}&pointy=${l.lat}&name=${newV.payload.description}`;
                        l.url =
                        'https://apis.map.qq.com/ws/staticmap/v2/?' +
                        `center=${l.lat},${l.lon}&zoom=10&size=300*150&maptype=roadmap&` +
                        `markers=size:large|color:0xFFCCFF|label:k|${l.lat},${l.lon}&` +
                        'key=UBNBZ-PTP3P-TE7DB-LHRTI-Y4YLE-VWBBD';
                        l.description = newV.payload.description;
                    this.location = l;
                }
            },
            immediate: true,
            deep: true,
        }
    },
    data() {
        return {
            location: {}
        }
    }
}
</script>
<style lang="scss" scoped>
.message-location {
    display: flex;
    flex-direction: column;
}
</style>