webpackJsonp([39],{7113:function(e,t){},lOoo:function(e,t){},lTcw:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={data:()=>({locale:"",del:!1,editor:!1,verify:!1,loading:!1,verifyEditor:!1,show:!1,screat:"",time:60,time1:60,sendMsgDisabled:!1,sendMsgDisabled1:!1,codeEditorFormItem:"",editorFormItem:{remark:"",bindIp:"",code:""},formItem:{remark:"",bindIp:"",code:""},tableData:[],id:""}),watch:{"$i18n.locale":{handler(e){this.locale=e},immediate:!0}},created(){this.getAllAPI()},methods:{sendCode(e){let t=this;this.$http.post(this.host+"/uc/mobile/api/code").then(s=>{let i=s.body;if(0==i.code)if(1==e){this.sendMsgDisabled=!0;let e=window.setInterval(function(){t.time--<=0&&(t.time=60,t.sendMsgDisabled=!1,window.clearInterval(e))},1e3)}else{this.sendMsgDisabled1=!0;let e=window.setInterval(function(){t.time1--<=0&&(t.time1=60,t.sendMsgDisabled1=!1,window.clearInterval(e))},1e3)}else this.$Message.error(i.message)})},onCopy(e){this.$Notice.success({title:this.$t("common.tip"),desc:"success"})},onError(){this.$Notice.error({title:this.$t("common.tip"),desc:"fail"})},getAllAPI(){return this.$http.get(this.host+"/uc/open/get_key").then(e=>{console.log(e),this.tableData=e.body.data,console.log(this.tableData)})},codeVerify(){if(""!=this.formItem.remark)if(""!=this.formItem.bindIp)if(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(this.formItem.bindIp))this.verify=!0;else{const e="English"==this.$store.getters.lang?"please scanner Correct IP Address":"请输入正确IP地址";this.$Message.error(e)}else{const e="English"==this.$store.getters.lang?"please scanner IP Address":"请输入IP地址";this.$Message.error(e)}else{const e="English"==this.$store.getters.lang?"please scanner remark":"请输入备注信息";this.$Message.error(e)}},make(){this.$http.post(this.host+"/uc/open/api/save",this.formItem).then(e=>{e.body.code?this.$Message.error(e.body.message):(this.$Message.success(e.body.message),this.formItem.remark="",this.formItem.bindIp="",this.formItem.code="",this.getAllAPI(),this.verify=!1,this.screat=e.body.data,this.show=!0)})},okUpdate(){if(void 0!=this.editorFormItem.code)this.verifyEditor=!1,this.editor=!0;else{const e="English"==this.$store.getters.lang?"please scanner Correct IP Address":"请输入验证码";this.$Message.error(e)}},update(){if(this.editorFormItem.remark)if(this.editorFormItem.bindIp)if(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(this.editorFormItem.bindIp))this.$http.post(this.host+"/uc/open/api/update",this.editorFormItem).then(e=>{e.body.code?this.$Message.error(e.body.message):(this.getAllAPI(),this.editor=!1,this.$Message.success(e.body.message))});else{const e="English"==this.$store.getters.lang?"please scanner Correct IP Address":"请输入正确IP地址";this.$Message.error(e)}else{const e="English"==this.$store.getters.lang?"please scanner IP Address":"请输入IP地址";this.$Message.error(e)}else{const e="English"==this.$store.getters.lang?"please scanner remark":"请输入备注信息";this.$Message.error(e)}},onDel(e){this.$http.get(this.host+`/uc/open/api/del/${e}`).then(e=>{e.body.code?this.$Message.error(e.body.message):(this.$Message.success(e.body.message),this.del=!1,this.getAllAPI())})}},computed:{myColumns(){const e=[];return e.push({title:this.$t("uc.api.createTime"),width:"en_US"==this.locale?120:100,key:"createTime"}),e.push({title:this.$t("uc.api.mark"),width:90,key:"remark"}),e.push({title:"API Key",width:150,key:"apiKey"}),e.push({title:this.$t("uc.api.accessKey"),width:"en_US"==this.locale?130:100,render:(e,t)=>{return e("span",{},"******")}}),e.push({title:this.$t("uc.api.bindIpAddress"),width:"en_US"==this.locale?130:"",render:(e,t)=>{let s=t.row.bindIp.split(",");return e("span",{},s=s.length>1?s[0]+"  ...":s)}}),e.push({title:this.$t("uc.api.ioDays"),width:"en_US"==this.locale?150:"",render:(e,t)=>{if(!t.row.bindIp){let s=+new Date(t.row.expireTime)-+new Date,i=Math.floor(s/1e3/60/60/24);return[e("span",{},i=i<=0?0:i)]}}}),e.push({title:this.$t("uc.api.operation"),align:"center",width:180,render:(e,t)=>[e("Button",{props:{type:"primary"},on:{click:()=>{const{remark:e,bindIp:s,id:i,code:o}=t.row;this.editorFormItem={remark:e,bindIp:s,id:i,code:o},this.verifyEditor=!0}}},this.$t("uc.api.edit")),e("Button",{props:{type:"error"},style:{marginLeft:"10px"},on:{click:()=>{this.del=!0,this.id=t.row.id}}},this.$t("uc.api.delete"))]}),e}}},o={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"nav-rights"},[s("div",{staticClass:"main api-manage"},[s("Card",{staticClass:"content",attrs:{bordered:!1}},[s("p",{attrs:{slot:"title"},slot:"title"},[e._v(e._s(e.$t("uc.api.createApi")))]),e._v(" "),s("div",{staticClass:"content_header"},[s("div",{staticClass:"add"},[s("Form",{attrs:{model:e.formItem,"label-position":"top"}},[s("FormItem",{attrs:{label:e.$t("uc.api.mark")}},[s("Input",{model:{value:e.formItem.remark,callback:function(t){e.$set(e.formItem,"remark",t)},expression:"formItem.remark"}})],1),e._v(" "),s("FormItem",{attrs:{label:e.$t("uc.api.bindAddress")}},[s("Input",{model:{value:e.formItem.bindIp,callback:function(t){e.$set(e.formItem,"bindIp",t)},expression:"formItem.bindIp"}})],1)],1),e._v(" "),s("Button",{attrs:{type:"primary"},on:{click:e.codeVerify}},[e._v(e._s(e.$t("uc.api.create")))])],1),e._v(" "),s("div",{staticClass:"prompt"},[s("p",{staticStyle:{color:"#7a8294","font-weight":"600","margin-bottom":"20px"}},[e._v(e._s(e.$t("uc.api.hint")))]),e._v(" "),s("ul",{staticStyle:{"text-align":"left"}},[s("li",[e._v("\n              "+e._s(e.$t("uc.api.part1"))+"\n              "),s("router-link",{attrs:{to:""}},[e._v(e._s(e.$t("uc.api.apiDoc")))]),e._v("\n              "+e._s(e.$t("uc.api.howUse"))+"\n            ")],1),e._v(" "),s("li",[e._v(e._s(e.$t("uc.api.part2")))]),e._v(" "),s("li",[e._v(e._s(e.$t("uc.api.part3")))])])])])]),e._v(" "),s("Card",{staticClass:"content",attrs:{bordered:!1}},[s("p",{attrs:{slot:"title"},slot:"title"},[e._v(e._s(e.$t("uc.api.myApiKey")))]),e._v(" "),s("Table",{attrs:{"no-data-text":e.$t("common.nodata"),columns:e.myColumns,data:e.tableData}})],1)],1),e._v(" "),s("Modal",{attrs:{title:e.$t("uc.api.edit")},model:{value:e.editor,callback:function(t){e.editor=t},expression:"editor"}},[s("Form",{attrs:{model:e.editorFormItem,"label-position":"top"}},[s("FormItem",{attrs:{label:e.$t("uc.api.mark")}},[s("Input",{model:{value:e.editorFormItem.remark,callback:function(t){e.$set(e.editorFormItem,"remark",t)},expression:"editorFormItem.remark"}})],1),e._v(" "),s("FormItem",{attrs:{label:e.$t("uc.api.bindIpAddress")}},[s("Input",{model:{value:e.editorFormItem.bindIp,callback:function(t){e.$set(e.editorFormItem,"bindIp",t)},expression:"editorFormItem.bindIp"}})],1)],1),e._v(" "),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("Button",{attrs:{type:"text",size:"large"},on:{click:function(t){e.editor=!1}}},[e._v(e._s(e.$t("uc.api.cancel")))]),e._v(" "),s("Button",{attrs:{type:"primary",size:"large"},on:{click:e.update}},[e._v(e._s(e.$t("uc.api.okText")))])],1)],1),e._v(" "),s("Modal",{attrs:{title:e.$t("uc.api.delete"),"ok-text":e.$t("uc.api.okText"),"cancel-text":e.$t("uc.api.cancel")},on:{"on-ok":function(t){return e.onDel(e.id)},"on-cancel":function(t){e.del=!1}},model:{value:e.del,callback:function(t){e.del=t},expression:"del"}},[s("p",[e._v(e._s(e.$t("uc.api.sureDelete")))])]),e._v(" "),s("Modal",{attrs:{title:e.$t("uc.api.access"),"mask-closable":!1,"ok-text":e.$t("uc.api.okText"),"cancel-text":e.$t("uc.api.cancel")},on:{"on-ok":function(t){e.show=!1}},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[s("p",{staticClass:"screat"},[e._v(e._s(e.$t("uc.api.tips")))]),e._v(" "),s("p",{staticClass:"screat"},[s("span",[e._v(e._s(e.screat))]),e._v(" "),s("span",{directives:[{name:"clipboard",rawName:"v-clipboard:copy",value:e.screat,expression:"screat",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:e.onCopy,expression:"onCopy",arg:"success"},{name:"clipboard",rawName:"v-clipboard:error",value:e.onError,expression:"onError",arg:"error"}],staticClass:"blue"},[e._v(e._s(e.$t("uc.api.copy")))])])]),e._v(" "),s("Modal",{attrs:{title:e.$t("uc.api.edit")},model:{value:e.verify,callback:function(t){e.verify=t},expression:"verify"}},[s("Form",{attrs:{model:e.formItem,"label-position":"top"}},[s("FormItem",{attrs:{label:e.$t("uc.safe.phonecode"),prop:"vailCode3"}},[s("Input",{attrs:{size:"large"},model:{value:e.formItem.code,callback:function(t){e.$set(e.formItem,"code",t)},expression:"formItem.code"}},[s("div",{staticClass:"timebox",attrs:{slot:"append"},slot:"append"},[s("Button",{attrs:{disabled:e.sendMsgDisabled},on:{click:function(t){return e.sendCode(1)}}},[e.sendMsgDisabled?s("span",[e._v(e._s(e.time+e.$t("uc.safe.second")))]):e._e(),e._v(" "),e.sendMsgDisabled?e._e():s("span",[e._v(e._s(e.$t("uc.safe.clickget")))])])],1)])],1)],1),e._v(" "),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("Button",{attrs:{type:"text",size:"large"},on:{click:function(t){e.verify=!1}}},[e._v(e._s(e.$t("uc.api.cancel")))]),e._v(" "),s("Button",{attrs:{type:"primary",size:"large"},on:{click:e.make}},[e._v(e._s(e.$t("uc.api.okText")))])],1)],1),e._v(" "),s("div",{staticClass:"let-code"},[s("Modal",{attrs:{title:e.$t("uc.api.edit")},model:{value:e.verifyEditor,callback:function(t){e.verifyEditor=t},expression:"verifyEditor"}},[s("Form",{attrs:{model:e.editorFormItem,"label-position":"top"}},[s("FormItem",{attrs:{label:e.$t("uc.safe.phonecode"),prop:"vailCode3"}},[s("Input",{attrs:{size:"large"},model:{value:e.editorFormItem.code,callback:function(t){e.$set(e.editorFormItem,"code",t)},expression:"editorFormItem.code"}},[s("div",{staticClass:"timebox",attrs:{slot:"append"},slot:"append"},[s("Button",{attrs:{disabled:e.sendMsgDisabled1},on:{click:function(t){return e.sendCode(2)}}},[e.sendMsgDisabled1?s("span",[e._v(e._s(e.time1+e.$t("uc.safe.second")))]):e._e(),e._v(" "),e.sendMsgDisabled1?e._e():s("span",[e._v(e._s(e.$t("uc.safe.clickget")))])])],1)])],1)],1),e._v(" "),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("Button",{attrs:{type:"text",size:"large"},on:{click:function(t){e.verifyEditor=!1}}},[e._v(e._s(e.$t("uc.api.cancel")))]),e._v(" "),s("Button",{attrs:{type:"primary",size:"large"},on:{click:e.okUpdate}},[e._v(e._s(e.$t("uc.api.okText")))])],1)],1)],1)],1)},staticRenderFns:[]};var r=s("VU/8")(i,o,!1,function(e){s("7113"),s("lOoo")},"data-v-71931862",null);t.default=r.exports}});