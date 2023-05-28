import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import routes from './config/routes.js';
import store from './config/store.js';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
import VueI18n from 'vue-i18n';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import util from './assets/js/util.js';
import crypto from 'crypto';
import 'swiper/dist/css/swiper.css';
import './assets/icons/iconfont.css';
import App from './App.vue';
import Api from './config/api';
import {BASEURL, BASEAPIURL, WSSAPIURL} from './service/http';

var moment = require('moment');
var momentTimezone = require('moment-timezone');

import ViewUI from 'view-design';
import en from 'iview/dist/locale/en-US';
import zh from 'iview/dist/locale/zh-CN';

let current_local = localStorage.getItem('LANGUAGE');
if(!current_local){
    localStorage.setItem('LANGUAGE', JSON.stringify("en_US"));
}

let locale = current_local == 'zh_CN'?zh:en;

console.log("********current_local",current_local);
console.log("********locale",locale);


Vue.use(iView);
Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(vueResource);
Vue.use(VueI18n);
Vue.use(ViewUI, { locale });

Vue.prototype.rootHost = BASEURL;
Vue.prototype.host = BASEAPIURL;
Vue.prototype.wssHost = WSSAPIURL;

Vue.prototype.api = Api;
Vue.http.options.credentials = true;
Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Content-Type': 'application/json;charset=utf-8'
};

const router = new VueRouter({
    mode: 'hash',
    routes
});

iView.LoadingBar.config({
    color: '#F90',
    failedColor: '#f0ad4e',
    height: 2
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
    iView.LoadingBar.finish();
});

const i18n = new VueI18n({
    locale: 'en_US',
    messages: {
        'en_US': require('./assets/lang/en.js'),
		'zh_CN': require('./assets/lang/cn.js'),
		// 'zh_HK': require('./assets/lang/hk.js'),
		'ja_JP': require('./assets/lang/jp.js'),
		'ko_KR': require('./assets/lang/ko.js'),
		'de_DE': require('./assets/lang/de.js'),
		'fr_FR': require('./assets/lang/fr.js'),
		'it_IT': require('./assets/lang/it.js'),
		'es_ES': require('./assets/lang/es.js'),
		'tr_TR': require('./assets/lang/tr.js'),
		'pt_PT': require('./assets/lang/pt.js'),
		'th_TH': require('./assets/lang/th.js')
    },
    silentTranslationWarn: true
});


function sortAsc(jsonObj) {
    let arr = new Array();
    let num = 0;
    for (let i in jsonObj) {
        arr[num] = i;
        num++;
    }
    let sortArr = arr.sort();
    let sortObj = {};
    for (let i in sortArr) {
        sortObj[sortArr[i]] = jsonObj[sortArr[i]];
    }
    return sortObj;
}

Vue.http.interceptors.push((request, next) => {
    //登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
    let token = localStorage.getItem('TOKEN')||"";
    request.headers.set('x-auth-token', token);

    let timestamp = (new Date().getTime())+"";
    request.headers.set('x-timestamp', timestamp);

    let lang = JSON.parse(localStorage.getItem('LANGUAGE'));
	request.headers.set('lang', lang);

    const nonce = crypto
    .createHash("md5")
    .update(timestamp+"nonce-token")
    .digest("hex");

    // let nonce  = md5(timestamp+"nonce-token");
   
    if(request.url.indexOf("/uc/asset/mywallet")>0){
        if(!request.body){
            request['body'] = {};
        }
        let bodyParams = request.body;
        bodyParams["timestamp"]=timestamp;
        bodyParams["nonce"]= nonce;
    }
    let dataParams = {"timestamp":timestamp,"nonce":nonce};

    let sign_tmp = "Timestamp"+timestamp+JSON.stringify(sortAsc(dataParams));

    const sign = crypto
    .createHash("md5")
    .update(sign_tmp)
    .digest("hex");
    
	request.headers.set('x-sign', sign.toUpperCase());

    next((response) => {
        //登录极验证时需获取后台返回的TOKEN值
        var xAuthToken = response.headers.get('x-auth-token');
        // console.log("params**", xAuthToken);
        if (xAuthToken != null && xAuthToken != '') {
            localStorage.setItem('TOKEN', xAuthToken);
        }
        if (response.data.code == '4000' || response.data.code == '3000') {
            store.commit('setMember', null);
            router.push('/login');
            return false;
        }
        return response;
    });
});

Vue.config.productionTip = false;

Vue.filter('shortTimeFormat', function(tick) {
    return moment(tick).format("ss");
});
Vue.filter('timeFormat', function(tick) {
    return moment(tick).format("HH:mm:ss");
});
Vue.filter('dateFormat', function(tick) {
    return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});
Vue.filter('toFixed', function(number, scale) {
    return new Number(number).toFixed(scale);
});
Vue.filter('toPercent', function(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
});
Vue.filter('toFloor', (number, scale) => {
    return toFloor(number, scale);
});
Vue.prototype.toFloor = toFloor;

function toFloor(number, scale = 8) {
    if (new Number(number) == 0) {
        return 0;
    }
    var __str = number + "";
    if (__str.indexOf('e') > -1 || __str.indexOf('E') > -1) {
        var __num = new Number(number).toFixed(scale + 1),
            __str = __num + "";
        return __str.substring(0, __str.length - 1);
    } else if (__str.indexOf(".") > -1) {
        if (scale == 0) {
            return __str.substring(0, __str.indexOf("."));
        }
        return __str.substring(0, __str.indexOf(".") + scale + 1);
    } else {
        return __str;
    }
}

Vue.prototype.getTimezone4K = function(){
	let curlang = this.$store.getters.lang;
	if(curlang=="zh_CN"){
		return "Asia/Shanghai";
	}else{
		return "America/Los_Angeles";
	}
};
Vue.prototype.getLang4K = function(){
	let curlang = this.$store.getters.lang;
	if(curlang=="zh_CN"){
		return "zh";
	}else{
		return "en";
	}
};

Vue.prototype.shortTimeFormat=function(tick) {
    return momentTimezone(tick).tz(this.getTimezone4K()).format("ss");
};
Vue.prototype.timeFormat=function(tick) {
    return momentTimezone(tick).tz(this.getTimezone4K()).format("HH:mm:ss");
};
Vue.prototype.dateFormat=function(tick) {
    return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
};
Vue.prototype.dateFormatHM=function(tick) {
    return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm");
};
Vue.prototype.dateFormatFromString=function(tick){
	var timestamp = momentTimezone(tick).tz('Asia/Shanghai').valueOf();
	return momentTimezone(timestamp).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
};

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: { App }
});
