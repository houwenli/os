export default {
    // 时间戳转换成年-月-日-时-分-秒格式
    timestampToTime(timestamp) {
        let t = timestamp + "";
        let date;
        if(t.length === 10){
            date = new Date(timestamp * 1000);
        }else{
            date = new Date(timestamp);
        }
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    },
    // 时间戳转换成年-月-日-时-分格式
    timestamp(timestamp) {
        let t = timestamp + "";
        let date;
        if(t.length === 10){
            date = new Date(timestamp * 1000);
        }else{
            date = new Date(timestamp);
        }
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
        return Y + M + D + h + m ;
    },
      // 时间戳转换成年-月-日格式
    timestampToTimeYMD(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D;
    },
    // 指定日期上增加指定几天;日期加减天数count为负数即为减
    dateAddDate(data, count) {
        let newData = data.substr(0, 4) + '-' + data.substr(4, 2) + '-' + data.substr(6, 2);
        let a = new Date(newData);
        a = a.valueOf();
        a = a + count * 24 * 60 * 60 * 1000;
        a = new Date(a);
        let m = a.getMonth() + 1;
        if (m.toString().length == 1) {
            m = '0' + m;
        }
        let d = a.getDate();
        if (d.toString().length == 1) {
            d = '0' + d;
        }
        return a.getFullYear() + '-' + m + '-' + d;
    },
    //计算两个时间相差天数
    datedifference(sDate1, sDate2) {    //sDate1和sDate2是yyyy-mm-dd格式
        sDate1 = sDate1.replace(/-/g,'/')
        sDate2 = sDate2.replace(/-/g,'/')
        let dateSpan,
        tempDate,
        iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays;
    },
    //js保留几位小数（四舍五入）
    getFloat(num, n) {
        n = n ? parseInt(n) : 0;
        if (n <= 0) {
            return Math.round(num);
        }
        num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
        num = Number(num).toFixed(n); //补足位数
        return num;
    },
    getDateFormat(date) {
        if (!date) return '---';
        date = date.toString();
        let dateArr = [];
        if (date.length == 8) {
          dateArr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2)];
        } else if (date.length == 6) {
          dateArr = [date.substr(0, 4), date.substr(4, 2)];
        } else {
          return '---';
        }
        return dateArr.join('-');
    },
    //将中国标准时间转成年-月-日格式
    formatDate(date) {
        var date = new Date(date);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    },
    formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    },
    dateTypeData(){
        return [{
            value: 1,
            label: '今日'
        }, {
            value: 2,
            label: '近7天'
        }, {
            value: 3,
            label: '近30天'
        }]
    },
    particleSizeData(){
        return [{
            value: 1,
            label: '按小时'
        }, {
            value: 2,
            label: '按天'
        }, {
            value: 3,
            label: '按周'
        }, {
            value: 4,
            label: '按月'
        }]
    },
    driverTypeData2(){
        return [{
            value: 1,
            label: '包干车主',
        },
        {
            value: 2,
            label: '非包干车主',
        },
        {
            value: 3,
            label: '社会车主',
        }];
    },
    /**
     * getWeekRange
     * @param {20200908} date
     * @returns {2020-09-08至2020-09-14}
     */
    getWeekRange(date) {
        if (!date) return '---';
        date = date.toString();
        let dateArr = this.getDateFormat(date);
        let curTime = new Date(dateArr).getTime();
        let weekEndTime = curTime + (24 * 3600 * 1000 * 6);
        let weekEndDate = new Date(weekEndTime);
        let weekEndYMD = [weekEndDate.getFullYear(), this.formatNumber(weekEndDate.getMonth() + 1), this.formatNumber(weekEndDate.getDate())];
        return `${dateArr}至${weekEndYMD.join('-')}`;
    },
    /**
     * 根据索引查询结果
     * @param {[{label: 'title',value: 1}]} list 
     * @param {查找的z值} val 
     * @returns value.label
     */
    searchListVal(list, val) {
        // console.log(list,val)
        if (!list.length || !val) {
            return ''
        }
        const filterList = list.filter(item => item.value == val)
        return filterList.length ? filterList[0].label : ''
    },
    calcPrice(m, float = true) {
        // 金额换算
        if (!parseInt(m)) {
          return '0.00';
        }
        let num = Math.round((m / 100) * 100) / 100;
        return float ? num.toFixed(2) : num;
    },
}

// 引入qq地图
export function TMap(key) {
        return new Promise(function (resolve, reject) {
            window.init = function () {
            resolve(qq)//注意这里
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://map.qq.com/api/js?v=2.exp&callback=init&key="+key;
        script.onerror = reject;
        document.head.appendChild(script);
    })
}