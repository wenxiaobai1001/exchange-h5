webpackJsonp([29],{U8TV:function(t,e){},bh7g:function(t,e){},xe0Y:function(t,e,i){t.exports=i.p+"assets/img/ctc-bg.739b630.jpg"},zr3A:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("JCuE"),a=i("97sG"),r=i("PJh5"),o={components:{expandRow:a.a,PageHeader:s.a},data(){const t=this;return{payTypeList:[{label:this.$t("ctc.bank"),value:"bank"},{label:this.$t("ctc.alipay"),value:"alipay"},{label:this.$t("ctc.wechatpay"),value:"wechatpay"}],receiveTypeList:[{label:this.$t("ctc.bank"),value:"bank"}],countdown:60,timer:"",orderTimer:"",orderCountdown:0,direction:"buy",receiveType:"bank",payType:"bank",buyPrice:7,buyAmount:null,sellPrice:7,sellAmount:null,modal:!1,detailModal:!1,formInline:{code:"",fundpwd:""},fundpwd:"",codeIsSending:!1,sendcodeValue:this.$t("uc.regist.sendcode"),loading:!1,pageSize:10,pageNo:1,total:10,user:{},userAccount:{},orders:[],detailOrder:{},columns:[{type:"index",width:50,render:(t,e)=>t(a.a,{props:{skin:e.row.skin,rows:e.row.detail}})},{title:t.$t("ctc.tradetime"),key:"createTime",minWidth:125,render:(e,i)=>e("span",{},t.dateFormat(i.row.createTime))},{title:t.$t("ctc.orderSn"),key:"orderSn",minWidth:100,render:(t,e)=>t("span",{},e.row.orderSn)},{title:t.$t("ctc.direction"),key:"direction",minWidth:100,render:(t,e)=>{let i=0==e.row.direction?"Buy":"Sell";return t("div",{style:{color:0==e.row.direction?"#42b983":"#FF0000"}},[t("span",{},i)])}},{title:t.$t("ctc.amount"),key:"amount",minWidth:120,render:(t,e)=>t("span",{},e.row.amount)},{title:t.$t("ctc.price"),key:"price",minWidth:100,render:(t,e)=>t("span",{},e.row.price)},{title:t.$t("ctc.money"),key:"money",minWidth:100,render:(t,e)=>t("span",{},e.row.money.toFixed(2))},{title:t.$t("ctc.status"),key:"status",minWidth:95,render:(t,e)=>{let i="Waiting order";return 1==e.row.status&&0==e.row.direction?t("div",{},[t("span",{},"In order( "),t("span",{style:{color:"#FF0000",fontSize:"10px"}},"Please complte payment"),t("span",{}," )")]):1==e.row.status&&1==e.row.direction?t("div",{},[t("span",{},"Processing( "),t("span",{style:{color:"#42b983",fontSize:"10px"}},"The acceptor is paying"),t("span",{}," )")]):(2==e.row.status&&(i="Paid"),3==e.row.status&&(i="Completed"),4==e.row.status&&(i="Cancelled"),t("span",{},i))}},{title:t.$t("ctc.operate"),key:"",align:"center",minWidth:95,render:(e,i)=>e("div",[e("Button",{props:{type:"info",size:"small"},style:{marginRight:"10px"},on:{click:()=>{let e={};e.oid=i.row.id,this.$Spin.show(),this.$http.post(this.host+"/uc/ctc/detail",e).then(e=>{var i=e.body;this.$Spin.hide(),0==i.code?(this.detailOrder=i.data,this.showDetailModal()):this.$Notice.error({title:t.$t("exchange.tip"),desc:i.message})})}},key:""},"Detail")])}]}},created:function(){this.init()},filters:{dateFormat:function(t){return r(t).format("YYYY-MM-DD HH:mm:ss")},fixedScale:function(t,e){return t.toFixed(e)},countDownFormat:function(t){var e=parseInt(t/60),i=t%60;return e<10&&(e="0"+e),i<10&&(i="0"+i),e+":"+i}},mounted(){var t=this;this.timer=setInterval(()=>{t.getC2cPrice()},3e4)},beforeDestroy:function(){this.timer&&clearInterval(this.timer),this.orderTimer&&clearInterval(this.orderTimer)},computed:{lang(){return this.$store.state.lang},langPram(){return this.$store.state.lang},isLogin:function(){return this.$store.getters.isLogin},totalBuyMoney(){return(this.buyPrice*this.buyAmount).toFixed(2)},totalSellMoney(){return(this.sellPrice*this.sellAmount).toFixed(2)}},methods:{init(){this.$store.commit("navigate","nav-ctc"),this.getC2cPrice(),this.isLogin&&(this.getOrderList(),this.getAccount(),this.getAccountSecurity())},cancelOrderClick(){this.$Modal.confirm({title:"确定取消订单吗",content:"<p>您确定要取消该笔订单吗？</p>",onOk:()=>{this.cancelOrder()},onCancel:()=>{}})},payOrderClick(){this.$Modal.confirm({title:"确定您已付款吗？",content:'<p>标记已付款前请确认您已付款！</p><p style="color:#FF0000;padding-top:10px;font-size:12px;">注意：对于恶意标记付款的账户，我们将对您的账户进行冻结等限制！</p>',onOk:()=>{this.payOrder()},onCancel:()=>{}})},closeDetail:function(){this.detailModal=!1},payOrder:function(){let t={};t.oid=this.detailOrder.id,this.$Spin.show(),this.$http.post(this.host+"/uc/ctc/pay-ctc-order",t).then(t=>{var e=t.body;0==e.code?(this.getOrderList(),this.detailOrder=e.data):this.$Notice.error({title:that.$t("exchange.tip"),desc:e.message}),this.$Spin.hide()})},cancelOrder:function(){let t={};t.oid=this.detailOrder.id,this.$Spin.show(),this.$http.post(this.host+"/uc/ctc/cancel-ctc-order",t).then(t=>{var e=t.body;0==e.code?(this.getOrderList(),this.detailOrder=e.data):this.$Notice.error({title:that.$t("exchange.tip"),desc:e.message}),this.$Spin.hide()})},dateFormat:function(t){return r(t).format("YYYY-MM-DD HH:mm:ss")},loadDataPage(t){this.pageNo=t,this.getOrderList()},getAccountSecurity(){this.$http.post(this.host+"/uc/approve/security/setting").then(t=>{var e=t.body;0==e.code?this.user=e.data:this.$Notice.error({title:this.$t("common.tip"),desc:e.message})})},getAccount(){this.$http.post(this.host+"/uc/approve/account/setting").then(t=>{var e=t.body;0==e.code?this.userAccount=e.data:this.$Notice.error({title:this.$t("common.tip"),desc:e.message})})},getC2cPrice(){this.$http.post(this.host+"/market/ctc-usdt-thb").then(t=>{var e=t.body;this.buyPrice=e.data.buy,this.sellPrice=e.data.sell})},getOrderList(){this.loading=!0;let t={};t.pageNo=this.pageNo,t.pageSize=this.pageSize,this.orders=[],this.$http.post(this.host+"/uc/ctc/page-query",t).then(t=>{var e=t.body;let i=[];if(0==e.code&&e.data.content.length>0){this.total=e.data.totalElements;for(var s=0;s<e.data.content.length;s++){var a=e.data.content[s];i.push(a)}this.orders=i}this.loading=!1})},createOrder(){var t=this;let e={};"buy"==this.direction?(e.price=this.buyPrice,e.amount=this.buyAmount,e.payType=this.payType,e.direction=0):(e.price=this.sellPrice,e.amount=this.sellAmount,e.payType=this.receiveType,e.direction=1),e.unit="USDT",e.fundpwd=this.formInline.fundpwd,e.code=this.formInline.code,this.$Spin.show(),this.$http.post(this.host+"/uc/ctc/new-ctc-order",e).then(e=>{var i=e.body;0==i.code?(this.getOrderList(),this.detailOrder=i.data,this.modal=!1,this.showDetailModal()):this.$Notice.error({title:t.$t("exchange.tip"),desc:i.message}),this.$Spin.hide()})},showDetailModal(){var t=this;if(""!=this.orderTimer&&clearInterval(this.orderTimer),null!=this.detailOrder.currentTime){let e=parseInt(new Date(this.detailOrder.currentTime).getTime()/1e3);if(0==this.detailOrder.status){let t=parseInt(new Date(this.detailOrder.createTime).getTime()/1e3);this.orderCountdown=e-t}else if(1==this.detailOrder.status){let t=parseInt(new Date(this.detailOrder.confirmTime).getTime()/1e3);this.orderCountdown=e-t}this.orderCountdown<1800&&(this.orderCountdown=1800-this.orderCountdown,this.orderTimer=setInterval(()=>{t.orderCountdown--,t.orderCountdown<1&&clearInterval(t.orderTimer)},1e3))}this.detailModal=!0},cancel(){this.modal=!1,this.formInline.code="",this.formInline.fundpwd=""},sendCode(){this.$http.post(this.host+"/uc/mobile/ctc/code").then(t=>{var e=t.body;0==e.code?(this.settime(),this.$Notice.success({title:this.$t("common.tip"),desc:e.message})):this.$Notice.error({title:this.$t("common.tip"),desc:e.message})})},settime(){this.sendcodeValue="will be sent again, after"+this.countdown+"s",this.codeIsSending=!0;let t=setInterval(()=>{this.countdown--,this.sendcodeValue="will be sent again, after"+this.countdown+"s",this.countdown<=0&&(clearInterval(t),this.sendcodeValue=this.$t("uc.regist.sendcode"),this.countdown=60,this.codeIsSending=!1)},1e3)},ok(){return""==this.formInline.code?(this.modal=!0,void this.$Message.error("Please input code")):""==this.formInline.fundpwd?(this.modal=!0,void this.$Message.error(this.$t("otc.chat.msg7tip"))):void this.createOrder()},valid(t){return this.isLogin?1!=this.user.realVerified?(this.$Message.error("Please finish real-name authentication"),!1):1!=this.user.fundsVerified?(this.$Message.error("Please set fund password"),!1):0==t?""==this.buyAmount||null==this.buyAmount||void 0==this.buyAmount?(this.$Message.error("Please input buy amount"),!1):!(this.buyAmount<50||this.buyAmount>5e4)||(this.$Message.error("Please input valid buy amount"),!1):1!=this.userAccount.bankVerified?(this.$Message.error("Please bind your bank card"),!1):""==this.sellAmount||null==this.sellAmount||void 0==this.sellAmount?(this.$Message.error("Please input sell amount"),!1):!(this.sellAmount<50||this.sellAmount>5e4)||(this.$Message.error("Please input valid sell amount"),!1):(this.$Message.error("Please log in first！"),!1)},buyClick(){if(this.direction="buy",this.valid(0)){this.modal=!0;let t=setInterval(()=>{this.countdown<=0&&(clearInterval(t),this.sendcodeValue=this.$t("uc.regist.sendcode"),this.codeIsSending=!1)},1e3)}},sellClick(){if(this.direction="sell",this.valid(1)){this.modal=!0;let t=setInterval(()=>{this.countdown<=0&&(clearInterval(t),this.sendcodeValue=this.$t("uc.regist.sendcode"),this.codeIsSending=!1)},1e3)}}}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"ctc"},[s("PageHeader",{attrs:{headerType:0}}),t._v(" "),s("img",{staticClass:"bannerimg",attrs:{src:i("xe0Y")}}),t._v(" "),s("div",{staticClass:"ctc_container"},[s("h1",[t._v(t._s(t.$t("ctc.title")))]),t._v(" "),s("p",{staticStyle:{"letter-spacing":"1px"}},[t._v(t._s(t.$t("ctc.desc")))]),t._v(" "),s("div",{staticClass:"main"},[s("Tabs",{staticStyle:{width:"100%"},attrs:{animated:!1}},[s("TabPane",{attrs:{label:"USDT"+t.$t("ctc.trade"),name:"all"}},[s("div",{staticClass:"ctc-container"},[s("div",{staticClass:"trade_wrap"},[s("div",{staticClass:"trade_panel"},[s("div",{staticClass:"trade_bd_ctc"},[s("div",{staticClass:"panel panel_buy"},[s("div",{staticClass:"bd bd_limited"},[s("Form",[s("FormItem",{staticClass:"buy-input"},[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.buyprice")))]),t._v(" "),s("Input",{attrs:{disabled:""},model:{value:t.buyPrice,callback:function(e){t.buyPrice=e},expression:"buyPrice"}}),t._v(" "),s("label",{staticClass:"after",staticStyle:{color:"#45b854"}},[t._v("(THB)")])],1),t._v(" "),s("FormItem",{staticClass:"trade-input"},[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.buynum"))+"：")]),t._v(" "),s("InputNumber",{staticStyle:{width:"60%",float:"right"},attrs:{size:"large",max:5e4,min:50,placeholder:t.$t("ctc.input50tips")},model:{value:t.buyAmount,callback:function(e){t.buyAmount=e},expression:"buyAmount"}}),t._v(" "),s("label",{staticClass:"after"},[t._v("USDT")])],1),t._v(" "),s("p",{staticStyle:{"font-size":"12px","margin-top":"-20px","text-align":"right","margin-bottom":"10px"}},[t._v("  ")]),t._v(" "),s("FormItem",[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.payType"))+"：")]),t._v(" "),s("Select",{staticStyle:{width:"60%",float:"right",height:"40px"},attrs:{size:"large",placeholder:t.$t("common.pleaseselect")},model:{value:t.payType,callback:function(e){t.payType=e},expression:"payType"}},t._l(t.payTypeList,function(e){return s("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.label))])}),1)],1),t._v(" "),s("div",{staticStyle:{height:"30px","line-height":"30px","margin-top":"-20px","margin-bottom":"5px",color:"#0074eb","text-align":"right","font-size":"12px"}},[s("router-link",{attrs:{to:"/uc/account"}},[t._v(t._s(t.$t("ctc.payset")))])],1),t._v(" "),s("div",{staticClass:"total buy_total",staticStyle:{}},[s("div",{staticStyle:{"min-height":"40px"}},[s("div",{staticStyle:{float:"left"}},[t._v(t._s(t.$t("ctc.payamount")))]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("span",{staticStyle:{color:"#45b854","font-size":"24px","font-weight":"600"}},[t._v(t._s(t.totalBuyMoney))]),t._v(" "),s("span",{staticStyle:{"font-size":"14px","margin-left":"5px",color:"#45b854"}},[t._v("(THB)")])])]),t._v(" "),s("div",{staticStyle:{width:"100%","font-size":"12px","text-align":"left"}},[t._v(t._s(t.$t("ctc.moneyTips")))])]),t._v(" "),s("Button",{staticClass:"bg-green",staticStyle:{"padding-bottom":"10px","padding-top":"10px"},attrs:{size:"large"},on:{click:t.buyClick}},[t._v(t._s(t.$t("ctc.buyin"))+" USDT")])],1)],1)]),t._v(" "),s("p",{staticStyle:{background:"#e7e7f0",height:"2px",margin:"6% 0%",width:"100%"}}),t._v(" "),s("div",{staticClass:"panel panel_sell"},[s("div",{staticClass:"bd bd_limited"},[s("Form",{ref:"formValidate"},[s("FormItem",{staticClass:"sell-input"},[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.sellprice")))]),t._v(" "),s("Input",{attrs:{disabled:""},model:{value:t.sellPrice,callback:function(e){t.sellPrice=e},expression:"sellPrice"}}),t._v(" "),s("label",{staticClass:"after",staticStyle:{color:"#f2334f"}},[t._v("(THB)")])],1),t._v(" "),s("FormItem",{staticClass:"trade-input"},[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.sellnum"))+"：")]),t._v(" "),s("InputNumber",{staticStyle:{width:"60%",float:"right"},attrs:{size:"large",max:5e4,min:50,placeholder:t.$t("ctc.input50tips")},model:{value:t.sellAmount,callback:function(e){t.sellAmount=e},expression:"sellAmount"}}),t._v(" "),s("label",{staticClass:"after"},[t._v("USDT")])],1),t._v(" "),s("p",{staticStyle:{"font-size":"12px","margin-top":"-20px","text-align":"right","margin-bottom":"10px"}},[s("span",[t._v(t._s(t.$t("ctc.avabalance")))]),t._v("：\n                            ")]),t._v(" "),s("FormItem",[s("label",{staticClass:"before"},[t._v(t._s(t.$t("ctc.receiveType"))+"：")]),t._v(" "),s("Select",{staticStyle:{width:"60%",float:"right",height:"40px"},attrs:{size:"large",placeholder:t.$t("common.pleaseselect")},model:{value:t.receiveType,callback:function(e){t.receiveType=e},expression:"receiveType"}},t._l(t.receiveTypeList,function(e){return s("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.label))])}),1)],1),t._v(" "),s("div",{staticStyle:{height:"30px","line-height":"30px","margin-top":"-20px","text-align":"right","margin-bottom":"5px","font-size":"12px"}},[t._v("\n                          "+t._s(t.$t("ctc.useselfaccount"))+"\n                          ")]),t._v(" "),s("div",{staticClass:"total buy_total"},[s("div",{staticStyle:{"min-height":"40px"}},[s("div",{staticStyle:{float:"left"}},[t._v(t._s(t.$t("ctc.getamount")))]),t._v(" "),s("div",{staticStyle:{float:"right",color:"#f2334f"}},[s("span",{staticStyle:{color:"#f2334f","font-size":"24px","font-weight":"600"}},[t._v(t._s(t.totalSellMoney))]),t._v(" "),s("span",{staticStyle:{"font-size":"14px","margin-left":"5px"}},[t._v("(THB)")])])]),t._v(" "),s("div",{staticStyle:{width:"100%","font-size":"12px","text-align":"left"}},[t._v(t._s(t.$t("ctc.moneyTips")))])]),t._v(" "),s("Button",{staticClass:"bg-red",staticStyle:{"padding-bottom":"10px","padding-top":"10px"},attrs:{size:"large"},on:{click:t.sellClick}},[t._v(t._s(t.$t("ctc.sell"))+" USDT")])],1)],1)])]),t._v(" "),s("p",{staticStyle:{background:"#e7e7f0",height:"2px",margin:"6% 0%",width:"100%"}}),t._v(" "),s("div",{staticStyle:{padding:"1% 5%","font-size":"12px"}},[s("div",{staticStyle:{padding:"1%",width:"100%","text-align":"left","line-height":"26px"}},[s("p",{staticStyle:{"text-align":"center","font-size":"18px","margin-bottom":"10px"}},[t._v(t._s(t.$t("ctc.notice")))]),t._v(" "),s("p",[t._v(t._s(t.$t("ctc.notice1")))]),t._v(" "),s("p",[t._v(t._s(t.$t("ctc.notice2")))]),t._v(" "),s("p",[t._v(t._s(t.$t("ctc.notice3")))]),t._v(" "),s("p",[t._v(t._s(t.$t("ctc.notice4")))]),t._v(" "),s("p",[t._v(t._s(t.$t("ctc.notice5")))])])]),t._v(" "),s("div")])])]),t._v(" "),s("div",{staticClass:"table"},[s("Table",{attrs:{"no-data-text":t.$t("common.nodata"),columns:t.columns,data:t.orders,loading:t.loading}}),t._v(" "),s("div",{staticClass:"page"},[s("Page",{attrs:{total:t.total,pageSize:t.pageSize,current:t.pageNo},on:{"on-change":t.loadDataPage}})],1)],1)])],1)],1)]),t._v(" "),s("Modal",{attrs:{width:"450"},model:{value:t.modal,callback:function(e){t.modal=e},expression:"modal"}},[s("p",{attrs:{slot:"header"},slot:"header"},[t._v("\n      "+t._s(t.$t("ctc.tip"))+"\n    ")]),t._v(" "),s("Form",{ref:"formInline",staticClass:"withdraw-form-inline",attrs:{model:t.formInline,inline:""}},[s("FormItem",{attrs:{prop:"code"}},[s("Input",{attrs:{id:"verifyCode",type:"text",autocomplete:"off",placeholder:t.$t("uc.regist.smscode")},model:{value:t.formInline.code,callback:function(e){t.$set(t.formInline,"code",e)},expression:"formInline.code"}}),t._v(" "),s("input",{attrs:{id:"sendCode",type:"Button",disabled:t.codeIsSending},domProps:{value:t.sendcodeValue},on:{click:function(e){return t.sendCode()}}})],1),t._v(" "),s("FormItem",[s("Input",{attrs:{id:"fundPwd",type:"password",autocomplete:"off",placeholder:t.$t("otc.chat.msg7")},model:{value:t.formInline.fundpwd,callback:function(e){t.$set(t.formInline,"fundpwd",e)},expression:"formInline.fundpwd"}})],1)],1),t._v(" "),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("span",{staticStyle:{"margin-right":"50px"},on:{click:t.cancel}},[t._v("Cancel")]),t._v(" "),s("span",{staticStyle:{background:"#f0ac19",color:"#fff",width:"80px","border-radius":"30px",display:"inline-block","text-align":"center",height:"30px","line-height":"30px"},on:{click:t.ok}},[t._v("Confirm")])])],1),t._v(" "),s("Modal",{attrs:{title:"订单详情"},on:{"on-ok":t.ok},model:{value:t.detailModal,callback:function(e){t.detailModal=e},expression:"detailModal"}},[0==t.detailOrder.direction&&0==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：等待承兑商接单...")]):t._e(),t._v(" "),0==t.detailOrder.direction&&1==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：承兑商已接单，等待您付款中")]):t._e(),t._v(" "),0==t.detailOrder.direction&&2==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：已付款，等待承兑商放币")]):t._e(),t._v(" "),0==t.detailOrder.direction&&3==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：已完成")]):t._e(),t._v(" "),0==t.detailOrder.direction&&4==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：已取消("+t._s(t.detailOrder.cancelReason)+")")]):t._e(),t._v(" "),1==t.detailOrder.direction&&0==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：等待承兑商接单...")]):t._e(),t._v(" "),1==t.detailOrder.direction&&1==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：承兑商已接单，正在付款中")]):t._e(),t._v(" "),1==t.detailOrder.direction&&2==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：承兑商已付款，确认放币中")]):t._e(),t._v(" "),1==t.detailOrder.direction&&3==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：已完成")]):t._e(),t._v(" "),1==t.detailOrder.direction&&4==t.detailOrder.status?s("p",{staticClass:"ctc-order-status"},[t._v("订单状态：已取消("+t._s(t.detailOrder.cancelReason)+")")]):t._e(),t._v(" "),s("Row",{staticStyle:{background:"#27384a",padding:"10px 0px","border-radius":"5px"}},[s("Col",{attrs:{span:"8"}},[0==t.detailOrder.direction?s("p",{staticClass:"item-title"},[t._v("买入")]):t._e(),t._v(" "),1==t.detailOrder.direction?s("p",{staticClass:"item-title"},[t._v("卖出")]):t._e(),t._v(" "),s("p",{staticClass:"item-desc"},[t._v("订单类型")])]),t._v(" "),s("Col",{attrs:{span:"8"}},[0==t.detailOrder.direction?s("p",{staticClass:"item-title"},[t._v(t._s(t._f("toFixed")(t.detailOrder.amount,2))+" "),s("span",{staticClass:"unit"},[t._v("USDT")])]):t._e(),t._v(" "),1==t.detailOrder.direction?s("p",{staticClass:"item-title"},[t._v(t._s(t._f("toFixed")(t.detailOrder.amount,2))+" "),s("span",{staticClass:"unit"},[t._v("USDT")])]):t._e(),t._v(" "),s("p",{staticClass:"item-desc"},[t._v("交易数量")])]),t._v(" "),s("Col",{attrs:{span:"8"}},[0==t.detailOrder.direction?s("p",{staticClass:"item-title green"},[t._v(t._s(t._f("toFixed")(t.detailOrder.money,2))+" "),s("span",{staticClass:"unit"},[t._v("(THB)")])]):t._e(),t._v(" "),1==t.detailOrder.direction?s("p",{staticClass:"item-title red"},[t._v(t._s(t._f("toFixed")(t.detailOrder.money,2))+" "),s("span",{staticClass:"unit"},[t._v("(THB)")])]):t._e(),t._v(" "),s("p",{staticClass:"item-desc"},[t._v("交易总额")])])],1),t._v(" "),0==t.detailOrder.direction?s("div",{staticStyle:{"font-size":"12px","margin-top":"15px"}},[s("Icon",{staticStyle:{color:"rgb(183, 183, 183)","margin-right":"5px","font-size":"14px"},attrs:{type:"md-information-circle"}}),t._v("请向以下收款账户汇款/转账： "),s("span",{staticClass:"green",staticStyle:{"font-size":"20px","font-weight":"bold"}},[t._v(t._s(t._f("toFixed")(t.detailOrder.money,2)))]),t._v(" "),s("span",{staticClass:"green"},[t._v("(THB)")]),t._v(" "),t.orderCountdown>0&&(0==t.detailOrder.status||1==t.detailOrder.status)?s("div",{staticStyle:{float:"right",padding:"2px 10px",color:"#FF0000"}},[s("Icon",{staticStyle:{"font-weight":"bold","font-size":"18px","margin-top":"-5px","margin-right":"3px"},attrs:{type:"ios-clock-outline"}}),t._v(" "),s("span",{staticStyle:{"font-size":"16px"}},[t._v(t._s(t._f("countDownFormat")(t.orderCountdown)))])],1):t._e()],1):t._e(),t._v(" "),1==t.detailOrder.direction?s("div",{staticStyle:{"font-size":"12px","margin-top":"15px"}},[s("Icon",{staticStyle:{color:"rgb(183, 183, 183)","margin-right":"5px","font-size":"14px"},attrs:{type:"md-information-circle"}}),t._v("你的以下账户将收到汇款/转账： "),s("span",{staticClass:"red",staticStyle:{"font-size":"20px","font-weight":"bold"}},[t._v(t._s(t._f("toFixed")(t.detailOrder.money,2)))]),t._v(" "),s("span",{staticClass:"red"},[t._v("(THB)")])],1):t._e(),t._v(" "),s("Row",{staticStyle:{"margin-top":"5px",background:"#27384a",padding:"20px 0px","border-radius":"5px"}},[s("Col",{attrs:{span:"24"}},[s("div",{staticStyle:{float:"left","margin-left":"20px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("账户实名：")]),t._v(" "),s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v(t._s(t.detailOrder.realName))])]),t._v(" "),s("div",{staticStyle:{float:"right","margin-right":"20px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("收款方式：")]),t._v(" "),"bank"==t.detailOrder.payMode?s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v("银行卡")]):t._e(),t._v(" "),"alipay"==t.detailOrder.payMode?s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v("支付宝")]):t._e(),t._v(" "),"wechatpay"==t.detailOrder.payMode?s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v("微信支付")]):t._e()])]),t._v(" "),"bank"==t.detailOrder.payMode?s("Col",{staticStyle:{"margin-top":"10px","text-align":"left"},attrs:{span:"24"}},[s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("开户银行：")]),t._v(" "),s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v(t._s(t.detailOrder.bankInfo.bank))])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("开户支行：")]),t._v(" "),s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v(t._s(t.detailOrder.bankInfo.branch))])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("银行卡号：")]),t._v(" "),s("span",{staticStyle:{"font-size":"16px",color:"#FFF","letter-spacing":"3px","font-weight":"bold"}},[t._v(t._s(t.detailOrder.bankInfo.cardNo))])])]):t._e(),t._v(" "),"alipay"==t.detailOrder.payMode?s("Col",{staticStyle:{"margin-top":"10px","text-align":"left"},attrs:{span:"24"}},[s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("支付宝账号：")]),t._v(" "),s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v(t._s(t.detailOrder.alipay.aliNo))])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("收款码：")])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px","text-align":"center"}},[s("img",{staticStyle:{width:"300px",height:"400px"},attrs:{src:t.detailOrder.alipay.qrCodeUrl}})])]):t._e(),t._v(" "),"wechatpay"==t.detailOrder.payMode?s("Col",{staticStyle:{"margin-top":"10px","text-align":"left"},attrs:{span:"24"}},[s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("微信账号：")]),t._v(" "),s("span",{staticStyle:{"font-size":"14px",color:"#FFF"}},[t._v(t._s(t.detailOrder.wechatPay.wechat))])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px"}},[s("span",{staticStyle:{color:"rgb(190, 190, 190)","font-size":"12px"}},[t._v("收款码：")])]),t._v(" "),s("div",{staticStyle:{float:"left","margin-left":"20px",width:"100%","margin-top":"10px","text-align":"center"}},[s("img",{staticStyle:{width:"300px",height:"400px"},attrs:{src:t.detailOrder.wechatPay.qrWeCodeUrl}})])]):t._e()],1),t._v(" "),s("div",{attrs:{slot:"footer"},slot:"footer"},[1==t.detailOrder.direction&&0==t.detailOrder.status||0==t.detailOrder.direction&&t.detailOrder.status<2?s("Button",{attrs:{type:"error",size:"large"},on:{click:t.cancelOrderClick}},[t._v("撤消订单")]):t._e(),t._v(" "),0==t.detailOrder.direction&&1==t.detailOrder.status?s("Button",{attrs:{type:"success",size:"large"},on:{click:t.payOrderClick}},[t._v("标记已付款")]):t._e(),t._v(" "),s("Button",{attrs:{type:"default",size:"large"},on:{click:t.closeDetail}},[t._v("关闭")])],1)],1)],1)},staticRenderFns:[]};var n=i("VU/8")(o,l,!1,function(t){i("bh7g"),i("U8TV")},"data-v-1570aa98",null);e.default=n.exports}});