webpackJsonp([5],{"7qpr":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});!function(t){if(void 0===t)throw new Error("Geetest requires browser environment");var e=t.document,i=t.Math,n=e.getElementsByTagName("head")[0];function o(t){this._obj=t}function s(t){var e=this;new o(t)._each(function(t,i){e[t]=i})}o.prototype={_each:function(t){var e=this._obj;for(var i in e)e.hasOwnProperty(i)&&t(i,e[i]);return this}},s.prototype={api_server:"api.geetest.com",protocol:"http://",typePath:"/gettype.php",fallback_config:{slide:{static_servers:["static.geetest.com","dn-staticdown.qbox.me"],type:"slide",slide:"/static/js/geetest.0.0.0.js"},fullpage:{static_servers:["static.geetest.com","dn-staticdown.qbox.me"],type:"fullpage",fullpage:"/static/js/fullpage.0.0.0.js"}},_get_fallback_config:function(){return r(this.type)?this.fallback_config[this.type]:this.new_captcha?this.fallback_config.fullpage:this.fallback_config.slide},_extend:function(t){var e=this;new o(t)._each(function(t,i){e[t]=i})}};var r=function(t){return"string"==typeof t},a=function(t){return"object"==typeof t&&null!==t},c={},l={},u=function(t,e,i,n){e=function(t){return t.replace(/^https?:\/\/|\/$/g,"")}(e);var s=function(t){return 0!==(t=t.replace(/\/+/g,"/")).indexOf("/")&&(t="/"+t),t}(i)+function(t){if(!t)return"";var e="?";return new o(t)._each(function(t,i){(r(i)||function(t){return"number"==typeof t}(i)||function(t){return"boolean"==typeof t}(i))&&(e=e+encodeURIComponent(t)+"="+encodeURIComponent(i)+"&")}),"?"===e&&(e=""),e.replace(/&$/,"")}(n);return e&&(s=t+e+s),s},h=function(t,i,o,s,r){var a=function(c){!function(t,i){var o=e.createElement("script");o.charset="UTF-8",o.async=!0,o.onerror=function(){i(!0)};var s=!1;o.onload=o.onreadystatechange=function(){s||o.readyState&&"loaded"!==o.readyState&&"complete"!==o.readyState||(s=!0,setTimeout(function(){i(!1)},0))},o.src=t,n.appendChild(o)}(u(t,i[c],o,s),function(t){t?c>=i.length-1?r(!0):a(c+1):r(!1)})};a(0)},d=function(e,n,o,s){if(a(o.getLib))return o._extend(o.getLib),void s(o);if(o.offline)s(o._get_fallback_config());else{var r="geetest_"+(parseInt(1e4*i.random())+(new Date).valueOf());t[r]=function(e){"success"==e.status?s(e.data):e.status?s(o._get_fallback_config()):s(e),t[r]=void 0;try{delete t[r]}catch(t){}},h(o.protocol,e,n,{gt:o.gt,callback:r},function(t){t&&s(o._get_fallback_config())})}},p=function(t,e){var i={networkError:"网络错误",gtTypeError:"gt字段不是字符串类型"};if("function"!=typeof e.onError)throw new Error(i[t]);e.onError(i[t])};(t.Geetest||e.getElementById("gt_lib"))&&(l.slide="loaded"),t.initGeetest=function(e,i){var n=new s(e);e.https?n.protocol="https://":e.protocol||(n.protocol=t.location.protocol+"//"),"050cffef4ae57b5d5e529fea9540b0d1"!==e.gt&&"3bd38408ae4af923ed36e13819b14d42"!==e.gt||(n.apiserver="yumchina.geetest.com/",n.api_server="yumchina.geetest.com"),a(e.getType)&&n._extend(e.getType),d([n.api_server||n.apiserver],n.typePath,n,function(e){var o=e.type,s=function(){n._extend(e),i(new t.Geetest(n))};c[o]=c[o]||[];var r=l[o]||"init";"init"===r?(l[o]="loading",c[o].push(s),h(n.protocol,e.static_servers||e.domains,e[o]||e.path,null,function(t){if(t)l[o]="fail",p("networkError",n);else{l[o]="loaded";for(var e=c[o],i=0,s=e.length;i<s;i+=1){var r=e[i];"function"==typeof r&&r()}c[o]=[]}})):"loaded"===r?s():"fail"===r?p("networkError",n):"loading"===r&&c[o].push(s)})}}(window);var n=i("7t+N"),o=i.n(n),s={data(){return{changeActive:0,country:"+86",captchaObj:null,_captchaResult:null,captcha:"",formInline:{user:"",password:"",code:"",uuid:""},ruleInline:{user:[{required:!0,message:this.$t("uc.login.loginvalidate"),trigger:"blur"}],password:[{required:!0,message:this.$t("uc.login.pwdvalidate1"),trigger:"blur"},{type:"string",min:6,message:this.$t("uc.login.pwdvalidate2"),trigger:"blur"}]}}},created:function(){this.init()},mounted:function(){},watch:{changeActive:function(t){this.$refs.formInline.resetFields()}},computed:{isLogin:function(){return this.$store.getters.isLogin}},methods:{handleReset(t){this.$refs.formInline.resetFields()},init(){this.$store.commit("navigate","nav-other"),this.$store.state.HeaderActiveName="0",this.isLogin?this.$router.push("/my"):this.initGtCaptcha(),this.initCaptcha()},onKeyup(t){13==t.keyCode&&o()(".login_btn").click()},initCaptcha(){var t=this;this.$http.get(this.host+"/uc/uuid/captchaNew?t="+(new Date).getTime()).then(function(e){t.captcha="data:image/jpeg;base64,"+e.data.data.img,t.formInline.uuid=e.data.data.uuid})},initGtCaptcha(){this.$http.get(this.host+this.api.uc.captcha).then(function(t){window.initGeetest({gt:t.body.gt,challenge:t.body.challenge,offline:!t.body.success,new_captcha:t.body.new_captcha,product:"bind",width:"100%"},this.handler)})},handler(t){t.onReady(()=>{o()("#wait").hide()}).onSuccess(()=>{(this._captchaResult=t.getValidate())?this.handleSubmit("formInline"):this.$Message.error("Please finish verification")}),o()(".login_btn").click(()=>{let t=this.formInline.user.length>=4,e=this.formInline.password.length>=6;(!t||!e)&&this.$Message.error(this.$t("common.fillComplete")),this.handleSubmit("formInline")})},logout(){this.$http.post(this.host+"/uc/logout",{}).then(t=>{0==t.body.code&&(localStorage.setItem("MEMBER",JSON.stringify(null)),localStorage.setItem("TOKEN",null),localStorage.removeItem("USERKEY",null))})},handleSubmit(t){this.$refs[t].validate(t=>{if(t){var e={};e.username=this.formInline.user,e.password=this.formInline.password,e.uuid=this.formInline.uuid,e.code=this.formInline.code,this.$http.post(this.host+this.api.uc.login,e).then(t=>{var e=t.body;0==e.code?(this.$Message.success(this.$t("uc.login.success")),this.$store.commit("setMember",t.body.data),null!=this.$route.query.key&&""!=this.$route.query.key&&localStorage.setItem("USERKEY",this.$route.query.key),this.$router.push("/my")):this.$Message.error(e.message),this.initCaptcha()})}else this.initCaptcha()}),this._captchaResult?this.$refs[t].validate(t=>{if(t){var e={};e.username=this.formInline.user,e.password=this.formInline.password,e.uuid=this.formInline.uuid,e.code=this.formInline.code,this.$http.post(this.host+this.api.uc.login,e).then(t=>{var e=t.body;0==e.code?(this.$Message.success(this.$t("uc.login.success")),this.$store.commit("setMember",t.body.data),null!=this.$route.query.key&&""!=this.$route.query.key&&localStorage.setItem("USERKEY",this.$route.query.key),this.$router.push("/my")):this.$Message.error(e.message),this.initCaptcha()})}else this.initCaptcha()}):setTimeout(function(){o()("#notice").hide()},2e3)}}},r={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"login_form"},[n("Form",{ref:"formInline",attrs:{model:t.formInline,rules:t.ruleInline,inline:""}},[n("div",{staticClass:"logo"},[n("img",{attrs:{src:i("JO++")}})]),t._v(" "),n("div",{staticClass:"login_title"},[t._v("\n        Hi, "),n("br"),t._v("\n        Welcome to c-deal\n      ")]),t._v(" "),n("FormItem",{attrs:{prop:"user"}},[n("Input",{staticClass:"user",attrs:{name:"user",size:"large",type:"text",placeholder:t.$t("uc.login.usertip")},model:{value:t.formInline.user,callback:function(e){t.$set(t.formInline,"user",e)},expression:"formInline.user"}})],1),t._v(" "),n("FormItem",{staticClass:"password",attrs:{prop:"password"}},[n("Input",{attrs:{type:"password",size:"large",placeholder:t.$t("uc.login.pwdtip")},on:{"on-keyup":t.onKeyup},model:{value:t.formInline.password,callback:function(e){t.$set(t.formInline,"password",e)},expression:"formInline.password"}})],1),t._v(" "),n("div",{staticStyle:{display:"flex","justify-content":"space-between"}},[n("FormItem",{staticClass:"code",attrs:{prop:"code",width:"50px"}},[n("Input",{attrs:{type:"text",name:"code"},model:{value:t.formInline.code,callback:function(e){t.$set(t.formInline,"code",e)},expression:"formInline.code"}})],1),t._v(" "),n("img",{staticStyle:{cursor:"pointer"},attrs:{src:t.captcha,height:"32px"},on:{click:t.initCaptcha}})],1),t._v(" "),n("div",{staticClass:"to_register"},[n("div",[n("span",[t._v(t._s(t.$t("uc.login.noaccount")))]),t._v(" "),n("router-link",{attrs:{to:"/register"}},[t._v(t._s(t.$t("uc.login.goregister")))])],1),t._v(" "),n("div",[n("router-link",{staticStyle:{color:"#979797",float:"right","padding-right":"10px","font-size":"14px"},attrs:{to:"/findPwd"}},[t._v(t._s(t.$t("uc.login.forget")))])],1)]),t._v(" "),n("div",{staticClass:"login-btn"},[n("Button",{attrs:{type:"warning"},on:{click:function(e){return t.handleSubmit("formInline")}}},[t._v(t._s(t.$t("uc.login.login")))])],1)],1)],1)},staticRenderFns:[]};var a=i("VU/8")(s,r,!1,function(t){i("JcFa"),i("wcTC")},"data-v-72f025d1",null);e.default=a.exports},JcFa:function(t,e){},wcTC:function(t,e){}});