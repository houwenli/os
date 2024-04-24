// 存储所有地图相关事件

/**
 * 处理地图点击事件， 上下文this是Vue组件实例
 * @param {*} e
 */
function clickListenerHandler(e) {
    this.map.clearMap();
    let lat = e.lnglat.getLat()
    let lon = e.lnglat.getLng()

    this.addMarker([{
        lat,
        lon
    }]);
    this.address.lat = lat
    this.address.lng = lon

    AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({
            city: this.cityCode
        });

        geocoder.getAddress([lon, lat], (status, result) => {
            if (status === 'complete' && result.regeocode) {
                this.address.formattedAddress = result.regeocode.formattedAddress;
            }
        });
    });
}

/**
 * 所有事件绑定
 * @param {VueComponent} instance Vue实例对象
 * @link https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap
 */
export const bindEventListener = (instance) => {
    instance.map.on('click', event => clickListenerHandler.call(instance, event))

    let {
        lon,
        lat
    } = instance.marker.length && instance.marker[0];
    if (lon && lat) {
        instance.address = Object.assign({}, {
            lat,
            lng: lon
        });
    } else {
        instance.map.setCity(instance.cityCode);
    }

    // 拖拽选址
    AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        let positionPickerInstance = new PositionPicker({
            mode: 'dragMap',
            map: instance.map,
            iconStyle: {
                url: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                size: [53, 68],
                ancher: [24, 40]
            }
        })

        positionPickerInstance.on('success', positionResult => {
            let {
                position: {
                    lat,
                    lng
                },
                address
            } = positionResult;

            instance.address = Object.assign({}, {
                lng,
                lat,
                formattedAddress: address
            });
            instance.keyWord = address;
        });

        positionPickerInstance.on('fail', function (error) {
            console.log('error==>', error);
        });

        let marker = lon && lat ? new AMap.LngLat(lon, lat) : '';
        positionPickerInstance.start(marker);
    });
}

export const removeEventListener = (instance) => {
    if (instance.map) {
        console.log('地图组件销毁')
        instance.map.off('click', clickListenerHandler)

        // 销毁实例对象
        instance.map.destroy()
        instance.map = null
    }
}
