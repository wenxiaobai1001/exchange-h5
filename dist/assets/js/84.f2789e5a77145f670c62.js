webpackJsonp([84],{"8Me/":function(e,t){},Wozy:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={data(){return{country:"America",formInline_user:"",codedisabled:!1,sendcodeValue:this.$t("uc.regist.sendcode"),isRegister:!1,ticket:"",randStr:"",registing:!1,captchaObj:null,modal1:!1,_captchaResult:null,agree:!0,allowRegister:!0,buttonLists:[{text:this.$t("uc.regist.emailregist")}],areas:[],changeActive:0,showCode:!0,countdown:60,formInline:{username:"",country:"America",user:"",code:"",areaCode:"",password:"",repassword:"",promotion:""},ruleInline:{user:[{validator:(e,t,s)=>{if(1==this.changeActive)""==t?s(new Error(this.$t("uc.regist.teltip"))):s();else{var i=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;i=/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,""==t?s(new Error(this.$t("uc.regist.emailtip"))):i.test(this.formInline.user)?s():s(new Error(this.$t("uc.regist.emailerr")))}},trigger:"blur"}],code:[{required:!0,message:this.$t("uc.regist.smscodetip"),trigger:"blur"}],password:[{required:!0,message:this.$t("uc.regist.pwdtip"),trigger:"blur"},{type:"string",min:6,message:this.$t("uc.regist.pwdmsg"),trigger:"blur"}],repassword:[{validator:(e,t,s)=>{""===t?s(new Error(this.$t("uc.regist.confirmpwdtip"))):t!==this.formInline.password?s(new Error(this.$t("uc.regist.confirmpwderr"))):s()},trigger:"blur"}]},key:this.$t("uc.regist.emailregist"),code:""}},watch:{changeActive:function(e){this.$refs.formInline.resetFields()},lang:function(){this.updateLangData()}},computed:{lang:function(){let e=this.$store.state.lang;return e||(e="en_US"),e},isLogin:function(){return this.$store.getters.isLogin}},created:function(){window.scrollTo(0,0),this.init(),void 0!=this.$route.query.code&&""!=this.$route.query.code&&null!=this.$route.query.code?this.formInline.promotion=this.$route.query.code:this.formInline.promotion=""},mounted:function(){},methods:{handleReset(e){this.$refs.formInline.resetFields()},updateLangData(){this.buttonLists=[{text:this.$t("uc.regist.emailregist")}],1==this.changeActive?this.key=this.$t("uc.regist.telno"):this.key=this.$t("uc.regist.email")},init(){this.$store.commit("navigate","nav-other"),this.$store.state.HeaderActiveName="0",console.log("this.isLogin",this.isLogin),this.isLogin&&this.$router.push("/"),window.document.title=("zh_CN"==this.lang?"新用户注册 - ":"New Register - ")+"c-deal | Global digital currency trading platform",this.getAreas()},onAreaChange(e){for(var t=0;t<this.areas.length;t++)this.areas[t].zhName==e&&(this.formInline.areaCode=this.areas[t].areaCode)},getAreas(){this.$http.post(this.host+this.api.common.area).then(e=>{var t=e.body;this.areas=t.data,this.formInline.country=this.areas[0].zhName,this.formInline.areaCode=this.areas[0].areaCode})},actives:function(e){this.changeActive=e,1==this.changeActive?this.key=this.$t("uc.regist.telno"):this.key=this.$t("uc.regist.email")},handleSubmit(e){this.$refs[e].validate(e=>{var t;e&&(1==this.agree?0==this.changeActive?this.isRegister?(this.registing=!1,this.$Notice.error({title:this.$t("common.tip"),desc:"opps"})):(this.registing=!0,(t={}).email=this.formInline.user,t.username=this.formInline.user,t.password=this.formInline.password,t.promotion=this.formInline.promotion,t.country=this.formInline.country,t.superPartner="",t.code=this.formInline.code,t.visitCode=this.formInline.visitPassword,this.$http.post(this.host+"/uc/register/email",t).then(e=>{this.registing=!1;var t=e.body;if(0==t.code)if("1"==this.formInline.superType||"2"==this.formInline.superType){this.$Notice.success({title:this.$t("common.tip"),desc:"Sign up successful!"});var s=this;setTimeout(()=>{s.$router.push("/")},3e3)}else{this.$Notice.success({title:this.$t("common.tip"),desc:t.message});s=this;setTimeout(()=>{s.$router.push("/login")},3e3)}else this.registing=!1,this.$Notice.error({title:this.$t("common.tip"),desc:t.message})})):this.isRegister?(this.registing=!1,this.$Notice.error({title:this.$t("common.tip"),desc:"Please input valid sms code."})):(this.registing=!0,(t={}).phone=this.formInline.user,t.username=this.formInline.user,t.password=this.formInline.password,t.promotion=this.formInline.promotion,t.code=this.formInline.code,t.country=this.formInline.country,t.superPartner="",t.ticket=this.ticket,t.randStr=this.randStr,this.$http.post(this.host+"/uc/register/phone",t).then(e=>{this.registing=!1;var t=e.body;if(0==t.code)if("1"==this.formInline.superType||"2"==this.formInline.superType){this.$Notice.success({title:this.$t("common.tip"),desc:"Sign up successful!"});var s=this;setTimeout(()=>{s.$router.push("/")},3e3)}else{this.$Notice.success({title:this.$t("common.tip"),desc:t.message});s=this;setTimeout(()=>{s.$router.push("/login")},3e3)}else this.registing=!1,this.$Notice.error({title:this.$t("common.tip"),desc:t.message})})):(this.registing=!1,this.$Notice.error({title:this.$t("common.tip"),desc:this.$t("uc.regist.agreementtip")})))})},settime(){this.sendcodeValue=this.$t("uc.regist.resendcode")+this.countdown+")",this.codedisabled=!0;var e=this;let t=setInterval(()=>{e.countdown--,e.sendcodeValue=e.$t("uc.regist.resendcode")+e.countdown+")",this.countdown<=0&&(clearInterval(t),e.codedisabled=!1,e.sendcodeValue=e.$t("uc.regist.sendcode"),e.countdown=60)},1e3)},sendCode(){if(1==this.changeActive){if((e={}).phone=this.formInline.user,e.country=this.formInline.country,!this.formInline.user)return void this.$Notice.error({title:"Sign up",desc:"The mobile phone can't be empty."});this.settime(),this.$http.post(this.host+"/uc/mobile/register/code",e).then(e=>{var t=e.body;0==t.code&&this.$Notice.success({title:this.$t("common.tip"),desc:t.message}),0!=t.code&&this.$Notice.error({title:this.$t("common.tip"),desc:t.message})})}else{var e;if((e={}).email=this.formInline.user,!this.formInline.user)return void this.$Notice.error({title:"Sign up",desc:"The email can't be empty."});this.settime(),this.$http.post(this.host+"/uc/register/email/code",e).then(e=>{var t=e.body;0==t.code&&this.$Notice.success({title:this.$t("common.tip"),desc:t.message}),0!=t.code&&this.$Notice.error({title:this.$t("common.tip"),desc:t.message})})}}}},r={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"login-form-section"},[s("div",{staticClass:"login-form-one"},[s("div",{staticClass:"login-tip"},[s("h1",{staticClass:"login-tip-title"},[e._v("c-deal")]),e._v(" "),s("h4",{staticClass:"login-tip-subtitle"},[e._v(e._s(e.$t("footer.gsmc")))]),e._v(" "),s("div",{staticClass:"login-tip-note"},[e._v("Safety ● Honesty ● Fairness ● Enthusiasm ● Openness")])]),e._v(" "),s("div",{staticClass:"login-form-type"},[0==e.changeActive?s("span",{on:{click:function(t){return e.actives(0)}}},[e._v(e._s(e.$t("uc.regist.emailregist")))]):e._e()]),e._v(" "),s("Form",{ref:"formInline",staticClass:"login-form",attrs:{model:e.formInline,rules:e.ruleInline,inline:""}},[s("FormItem",{staticClass:"login-form-user",staticStyle:{display:"none"},attrs:{prop:"username"}},[s("Input",{attrs:{type:"text",placeholder:e.$t("uc.regist.username")},model:{value:e.formInline.username,callback:function(t){e.$set(e.formInline,"username",t)},expression:"formInline.username"}})],1),e._v(" "),1==e.changeActive?s("FormItem",{staticClass:"login-form-user with-code",attrs:{prop:"user"}},[s("Select",{staticClass:"login-form-user-select",staticStyle:{width:"120px"},attrs:{filterable:""},model:{value:e.formInline.country,callback:function(t){e.$set(e.formInline,"country",t)},expression:"formInline.country"}},e._l(e.areas,function(t){return s("Option",{key:t.zhName,attrs:{value:t.zhName}},[e._v("+"+e._s(t.areaCode)+" - "+e._s(t.enName))])}),1),e._v(" "),s("Input",{staticClass:"login-form-user-input",staticStyle:{width:"180px"},attrs:{type:"text",size:"large",placeholder:e.key},model:{value:e.formInline.user,callback:function(t){e.$set(e.formInline,"user",t)},expression:"formInline.user"}})],1):e._e(),e._v(" "),0==e.changeActive?s("FormItem",{staticClass:"login-form-user",attrs:{prop:"user"}},[s("Input",{staticClass:"login-form-user-input",attrs:{type:"text",size:"large",placeholder:e.key},model:{value:e.formInline.user,callback:function(t){e.$set(e.formInline,"user",t)},expression:"formInline.user"}})],1):e._e(),e._v(" "),s("FormItem",{staticClass:"login-form-user code",attrs:{prop:"code"}},[s("Input",{attrs:{size:"large",placeholder:e.$t("uc.regist.smscode")},model:{value:e.formInline.code,callback:function(t){e.$set(e.formInline,"code",t)},expression:"formInline.code"}},[s("input",{staticClass:"send-code",staticStyle:{width:"100px"},attrs:{slot:"append",type:"Button",id:"sendCode",disabled:e.codedisabled},domProps:{value:e.sendcodeValue},on:{click:function(t){return e.sendCode()}},slot:"append"})])],1),e._v(" "),s("FormItem",{staticClass:"login-form-user",attrs:{prop:"password"}},[s("Input",{attrs:{size:"large",type:"password",placeholder:e.$t("uc.regist.pwd")},model:{value:e.formInline.password,callback:function(t){e.$set(e.formInline,"password",t)},expression:"formInline.password"}})],1),e._v(" "),s("FormItem",{staticClass:"login-form-user",attrs:{prop:"repassword"}},[s("Input",{attrs:{size:"large",type:"password",placeholder:e.$t("uc.regist.repwd")},model:{value:e.formInline.repassword,callback:function(t){e.$set(e.formInline,"repassword",t)},expression:"formInline.repassword"}})],1),e._v(" "),s("FormItem",{staticClass:"login-form-user",attrs:{prop:"promotion"}},[s("Input",{attrs:{size:"large",type:"text"},model:{value:e.formInline.promotion,callback:function(t){e.$set(e.formInline,"promotion",t)},expression:"formInline.promotion"}},[s("span",{attrs:{slot:"prepend"},slot:"prepend"},[e._v(e._s(e.$t("uc.regist.promotion"))+":")])])],1),e._v(" "),s("div",{staticClass:"check-agree"},[s("label",[s("Checkbox",{model:{value:e.agree,callback:function(t){e.agree=t},expression:"agree"}},[e._v(e._s(e.$t("uc.regist.agreement")))])],1),e._v(" "),"zh_CN"==e.lang?s("router-link",{attrs:{to:"/helpdetail?cate=5&id=36"}},[e._v("《"+e._s(e.$t("uc.regist.userprotocol"))+"》")]):e._e(),e._v(" "),"zh_CN"!=e.lang?s("router-link",{attrs:{to:"/helpdetail?cate=5&id=32"}},[e._v("《"+e._s(e.$t("uc.regist.userprotocol"))+"》")]):e._e()],1),e._v(" "),s("div",{staticClass:"login-form-btn register-btn",staticStyle:{"margin-top":"20px"}},[s("Button",{class:{registing:e.registing},attrs:{type:"warning",disabled:e.registing},on:{click:function(t){return e.handleSubmit("formInline")}}},[e._v(e._s(e.$t("uc.regist.regist")))])],1),e._v(" "),s("div",{staticClass:"to_register",staticStyle:{"font-size":"14px"}},[s("span",[e._v(e._s(e.$t("uc.forget.hasaccount")))]),e._v(" "),s("router-link",{attrs:{to:"/login"}},[e._v(e._s(e.$t("uc.login.login")))])],1)],1)],1)])},staticRenderFns:[]};var o=s("VU/8")(i,r,!1,function(e){s("8Me/")},"data-v-098f95f4",null);t.default=o.exports}});