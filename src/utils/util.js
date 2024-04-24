export default {
  timestampToTimeWithDefault(timestamp, defaultValue = '--') {
    if (timestamp) {
      return this.timestampToTime(timestamp);
    }
    return defaultValue;
  },
  // 时间戳转换成年-月-日-时-分-秒格式
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  // 时间戳转换成年-月-日-时-分-秒格式
  timestampToTime13(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
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

  // 时间戳转换成时-分-秒格式
  timestampToTimeHMS(second) {
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second % 86400) / 3600);
    const minutes = Math.floor(((second % 86400) % 3600) / 60);
    const seconds = Math.floor(((second % 86400) % 3600) % 60);
    return days * 24 + hours + ':' + minutes + ':' + seconds;
  },
  // 时间戳转换成天-时-分-秒格式
  formatDuring(second) {
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second % 86400) / 3600);
    const minutes = Math.floor(((second % 86400) % 3600) / 60);
    const seconds = Math.floor(((second % 86400) % 3600) % 60);
    // const forMatDate = { days: days, hours: hours, minutes: minutes,seconds: seconds};
    return days + '天' + hours + '时' + minutes + '分' + seconds + '秒';
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

  //计算两个时间相差天数
  datedifference(sDate1, sDate2) {    //sDate1和sDate2是yyyy-mm-dd格式
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

  //00:00时分格式转换为int分钟数值
  makeToMinute(time) {
    const str = time;
    const arr = str.split(':');
    const minute = parseInt(arr[0] * 60) + parseInt(arr[1]);
    return minute;
  },

  //将秒数转换为时分秒格式，小于十补零
  secondToDate(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = m + ':' + s;
    // return result = h + ":" + m + ":" + s;
  },
  //将秒数转换为时分秒格式，小于十补零
  secondToDate1(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + ":" + m;
  },

  //将秒数转换为时分秒格式
  formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var middle = 0;// 分
    var hour = 0;// 小时
    if (theTime > 60) {
      middle = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (middle > 60) {
        hour = parseInt(middle / 60);
        middle = parseInt(middle % 60);
      }
    }
    // var result = ""+parseInt(theTime)+":";
    var result = '' + parseInt(theTime) + '';
    if (middle > 0) {
      result = '' + parseInt(middle) + ':' + result;
    }
    if (hour > 0) {
      result = '' + parseInt(hour) + ':' + result;
    }
    return result;
  },

  phoneHide(value) {
    // 显示手机号码中间4位*号[telphone-133****1234]
    if (value !== undefined) {
      let start = value.substring(0, 3),
        end = value.substring(7, 11);
      return start + '****' + end;
    }
  },

  calcPrice(m, float = true) {
    // 金额换算
    if (!parseInt(m)) {
      return '0.00';
    }
    let num = Math.round((m / 100) * 100) / 100;
    return float ? num.toFixed(2) : num;
  },

  //将数据为null，为空，为undefind做处理
  remarkText(text) {
    if (text === '' || text === null || text === undefined) {
      return '--';
    } else {
      return text;
    }
  },

  //城市格式化
  arrToStr(arr) {
    var result = '';
    if (arr && arr.length > 0) {
      arr.forEach(ele => {
        var ids = ele.join('_');
        result += ids + ',';
      });
      result = result.substring(0, result.length - 1);
    }

    return result;
  },
  strtoArr(arr) {
    var result = [];
    var ids = arr.split(',');
    ids.forEach(el => {
      var _id = el.split('_');
      result.push(_id);
    });
    return result;
  },

  //标签管理过滤
  findArray(dic, key, value) {
    for (let i = 0; i < dic.length; i++) {
      if (dic[i][key] == value) {
        return i;
      }
    }
    return -1;
  },
  isArray(arr) {
    return arr instanceof Array
  },
  isProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  },
  // 对象/数组深克隆
  deepClone(obj) {
    const objClone = this.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (this.isProperty(obj, key)) {
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = this.deepClone(obj[key])
          } else {
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  },
  carOwnerStatusStatus(status) {
    if (status == 1) {
      return '普通车主';
    } else if (status == 2) {
      return '共享合伙人';
    } else if (status == 3) {
      return '高级合伙人';
    }
  },
  // 下載模板 
   downLoad(fileName,url) {
    const a = document.createElement("a");
    a.download = fileName // 指定下载的文件名
    a.href = url //  URL对象
    if (document.all) {
      a.click(); // 模拟点击
    } else {
      // 兼容火狐点击事件
      const evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      a.dispatchEvent(evt);
    }
    URL.revokeObjectURL(a.href); // 释放URL 对象
  },  
  downloadFile (filePat, fileName){
    //文件地址
  var url = filePat;
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true); 
  xhr.responseType = "blob"; // 返回类型blob
  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
  xhr.onload = function() {
    // 请求完成
    if(this.status === 200) {
      // 返回200
      var blob = this.response;
      var href = window.URL.createObjectURL(blob); //创建下载的链接
      //判断是否是IE浏览器，是的话返回true
      if (window.navigator.msSaveBlob) {
        try {
          window.navigator.msSaveBlob(blob, fileName + '.xls')
        } catch (e) {
          console.log(e);
        }
      } else {
        // 谷歌浏览器 创建a标签 添加download属性下载
        var downloadElement = document.createElement('a');
        downloadElement.href = href;
        downloadElement.target = '_blank';
        downloadElement.download = fileName + '.xls'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    }
  }
  // 发送ajax请求
  xhr.send()
  },
  // 获取近多少天日期
  getFinalDay(day, theDate) {
    var toDay = new Date()
      if (theDate) {
        toDay = new Date(theDate)
    }
    var targetDay_milliseconds = toDay.getTime() + 1000 * 60 * 60 * 24 * day;
    toDay.setTime(targetDay_milliseconds);
    var tYear = toDay.getFullYear();
    var tMonth = toDay.getMonth();
    var tDate = toDay.getDate();
    tMonth = this.getHandleMonth(tMonth + 1);
    tDate = this.getHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
  },
  getHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  // 防抖
  debounce(fun, delay = 500) {
    let timer //定时器
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fun.apply(this, args)
      }, delay)
    }
  }
};

// 格式化字典
export function formatLable(val, arr, key = 'id', lable = 'value') {
  if (!(arr instanceof Array)) { return ''}
  const el = arr.find(item => {
    return item[key] + '' === val + ''
  })
  return el ? el[lable] : ''
}

