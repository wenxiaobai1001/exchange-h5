webpackJsonp([61],{"/+vw":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={components:{PageHeader:s("JCuE").a},data(){return{sendMsgDisabled:!1,isNotVerified:!0,formValidate:{oldPw:"",newMPw:"",newMPwConfirm:""},ruleValidate:{oldPw:[{required:!0,type:"string",min:6,message:this.$t("uc.safe.oldpwdtip"),trigger:"blur"}],newMPw:[{required:!0,type:"string",min:6,message:this.$t("uc.safe.pwdmsg1"),trigger:"blur"},{validator:(e,t,s)=>{""===t?s(new Error(this.$t("uc.safe.pwdmsg1"))):/([a-zA-Z0-9]){6,18}/.test(t)?s():s(new Error(this.$t("uc.safe.pwdmsg1")))},trigger:"blur"}],newMPwConfirm:[{required:!0,type:"string",min:6,message:this.$t("uc.safe.pwdmsg2"),trigger:"blur"},{validator:(e,t,s)=>{""===t?s(new Error(this.$t("uc.safe.pwdmsg2"))):/([a-zA-Z0-9]){6,18}/.test(t)?t!==this.formValidate.newMPw?s(new Error(this.$t("uc.safe.pwdmsg2"))):s():s(new Error(this.$t("uc.safe.pwdmsg2")))},trigger:"blur"}]}}},watch:{},created:function(){},computed:{isLogin:function(){return this.$store.getters.isLogin}},methods:{send(e){let t=this;this.$http.post(this.host+"/uc/mobile/transaction/code").then(e=>{var s=e.body;if(0==s.code){t.sendMsgDisabled=!0,t.$Message.success(s.message);let e=window.setInterval(function(){t.time--<=0&&(t.time=60,t.sendMsgDisabled=!1,window.clearInterval(e))},1e3)}else this.$Message.error(s.message)})},handleReset(e){this.$refs[e].resetFields()},handleSubmit(e){this.$refs[e].validate(e=>{if(e){let e={};e.oldPassword=this.formValidate.oldPw,e.newPassword=this.formValidate.newMPw,this.$http.post(this.host+"/uc/approve/update/transaction/password",e).then(e=>{var t=e.body;0==t.code?(this.$Message.success(this.$t("uc.safe.save_success")),this.handleReset("formValidate"),this.$router.push("/my")):this.$Message.error(t.message)})}else this.$Message.error(this.$t("uc.safe.save_failure"))})},handleReset(e){this.$refs.formValidate.resetFields()}}},r={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"page-home"},[s("PageHeader",{attrs:{isShowBack:!0,title:e.$t("uc.safe.edit")}}),e._v(" "),s("div",{staticClass:"page-content"},[s("div",{staticClass:"page-fund"},[s("Form",{ref:"formValidate",attrs:{"label-position":"top",model:e.formValidate,rules:e.ruleValidate}},[s("FormItem",{attrs:{label:e.$t("uc.safe.oldfundpwd"),prop:"oldPw"}},[s("Input",{attrs:{size:"large",type:"password"},model:{value:e.formValidate.oldPw,callback:function(t){e.$set(e.formValidate,"oldPw",t)},expression:"formValidate.oldPw"}})],1),e._v(" "),s("FormItem",{attrs:{label:e.$t("uc.safe.newfundpwd"),prop:"newMPw"}},[s("Input",{attrs:{size:"large",type:"password"},model:{value:e.formValidate.newMPw,callback:function(t){e.$set(e.formValidate,"newMPw",t)},expression:"formValidate.newMPw"}})],1),e._v(" "),s("FormItem",{attrs:{label:e.$t("uc.safe.confirmnewpwd"),prop:"newMPwConfirm"}},[s("Input",{attrs:{size:"large",type:"password"},model:{value:e.formValidate.newMPwConfirm,callback:function(t){e.$set(e.formValidate,"newMPwConfirm",t)},expression:"formValidate.newMPwConfirm"}})],1),e._v(" "),s("p",{staticStyle:{"text-align":"right",margin:"4% 2%","font-size":"14px"}},[s("router-link",{attrs:{to:"/moneyPasswordFind"}},[e._v(e._s(e.$t("uc.forget.title")))])],1),e._v(" "),s("FormItem",[s("Button",{attrs:{type:"warning"},on:{click:function(t){return e.handleSubmit("formValidate")}}},[e._v(e._s(e.$t("uc.safe.save")))])],1)],1)],1)])],1)},staticRenderFns:[]};var i=s("VU/8")(a,r,!1,function(e){s("u5Al")},"data-v-7a36b98a",null);t.default=i.exports},u5Al:function(e,t){}});