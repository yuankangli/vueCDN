/**
 *
 * @param context vue 上下文
 * @param title 提示标题, 为 null 时, 默认是 提示
 * @param msg 提示内容
 * @param type 类型, 为 null 时, 默认是 info
 * @param settingJson 位置和持续时间
 */
function showTip(context, title, msg, type, settingJson) {
    settingJson = settingJson || {};
    title = title || "提示";
    type = type || "info";
    position = settingJson.position || "bottom-right";
    duration = settingJson.duration || 10000;
    if (type === "info") {
        context.$notify.info({
            title: title,
            message: msg,
            position: position,
        })
    } else if (type === "error") {
        context.$notify.error({
            title: title,
            dangerouslyUseHTMLString: true,
            message: msg,
            position: position,
            duration: duration
        })
    } else {
        context.$notify.success({
            title: title,
            message: msg,
            position: position,
        })
    }

}

function cLog(...values) {
    console.log(values);
}

function isEmpty(value) {
    return value == null || value === "";
}

/**
 * 处理表格 columnConfig 默认值 和 下拉框的值
 * @param context
 * @param columnConfig
 * @param loading 全局等待, 防止下拉框内容还没加载,用户已经点了下拉框(如果可以确保网速, 可以直接在开头将loading.body设置为false)
 */
function setDefaultValue(context, columnConfig, loading) {
    // 处理默认值
    let waitSelect = 0;
    for (let index in columnConfig) {
        let value = columnConfig[index];
        if (isEmpty(value.field)) {
            showTip(context, "提示", "columnConfig中field必填, 出错索引:" + index, "error");
            return;
        }
        if (isEmpty(value.title)) {
            value.title = value.field;
        }
        if (isEmpty(value.type)) {
            value.type = "text";
        }
        if (isEmpty(value.show)) {
            value.show = {
                query: false, // 是否在查询条件展示, 以下都是默认 false 不展示
                table: false, // 是否在表格中展示, 以下都是默认 false 不展示
                insert: false, // 是否在新增页面展示, 以下都是默认 false 不展示
                update: false // 是否在修改页面展示, 以下都是默认 false 不展示
            }
        }
        if (!isEmpty(value.optionUrl) ) {
            value.options = [];
            waitSelect = waitSelect + 1;
            // TODO 调用网络请求
/*            this.$ajax({
                method: 'get',
                url: value.optionUrl,
            }).then(function (response) {
                // TODO 根据自己的返回值进行修改
                value.options = response.data;
            }).catch(function (error) {
                showTip(self, '错误', '获取下拉框('+value.optionUrl+')资料时出现异常:' + error.message, "error");
            });*/
            setTimeout(() => {
                value.options = [
                    {
                        value: "fj",
                        label: '福建'
                    },{
                        value: "bj",
                        label: '北京'
                    },{
                        value: "hn",
                        label: '湖南'
                    },{
                        value: "hb",
                        label: '湖北'
                    }
                ];
                waitSelect = waitSelect - 1;
                if (waitSelect === 0) {
                    loading.body = false;
                }
            },500);

        }
    }
    if (waitSelect === 0) {
        loading.body = false;
    }
}

/**
 * @return {string} UUID
 */
function UUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

/**************************************时间格式化处理************************************/
function dateFormat(formatStr ,date)
{ //author: meizz
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(formatStr))
        formatStr=formatStr.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(formatStr))
            formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return formatStr;
}


//接口的统一域名部分
Vue.prototype.urlPrefix = '/rest/';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = Vue.prototype.urlPrefix;
Vue.prototype.$ajax = axios;
// Vue.http.options.credentials = true




