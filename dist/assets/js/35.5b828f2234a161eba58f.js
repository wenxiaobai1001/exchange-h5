webpackJsonp([35],{"/cKT":function(t,e){},"5nE3":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={components:{},data(){return{loginmsg:this.$t("common.logintip"),loading:!0,ordKeyword:"",tableMoney:[],tableMoneyShow:[],searchKey:"",transferModal:!1,transferDirection:1,walletOne:null,walletTwo:null,transferAmount:0,predictAmount:0,walletTwoList:[],walletOneList:[this.$t("uc.finance.swap.currencyaccount")+"(USDT)"],assetsWallet:{id:0,balance:0,avaBalance:0},swapWallet:{id:0,avaBalance:0}}},methods:{seachInputChange(){this.tableMoneyShow=this.tableMoney.filter(t=>0==t.symbol.indexOf(this.searchKey))},getMoney(){this.$http.post(this.host+"/seconds/wallet").then(t=>{var e=t.body;this.tableMoneyShow=e.data})},getAssets(){this.$http.post(this.host+"/seconds/coins").then(t=>{var e=t.body;0==e.code?(this.assetsWallet=e.data[0],this.walletTwo=this.assetsWallet.id,this.walletOne=this.$t("uc.finance.swap.currencyaccount")+"("+this.assetsWallet.baseSymbol+")",this.walletOneList=[this.$t("uc.finance.swap.currencyaccount")+"("+this.assetsWallet.baseSymbol+")"],this.tableMoney=e.data):this.$Message.error(this.loginmsg)})},onTransferClick(){this.transferModal=!0},changeTo(t){this.transferDirection=t,this.transferAmount=0},confirmOk(){if(0==this.assetsWallet.id)return void this.$Message.error(this.$t("uc.finance.swap.pleaseselectwallet"));if(this.transferAmount<=0||""==this.transferAmount||void 0==this.transferAmount)return void this.$Message.error(this.$t("uc.finance.swap.pleaseinputamount"));let t={unit:this.assetsWallet.baseSymbol,from:1==this.transferDirection?0:1,to:1==this.transferDirection?1:0,transferDirection:this.transferDirection,amount:this.transferAmount};this.$http.post(this.host+"/seconds/trans",t).then(t=>{var e=t.body;0==e.code?(console.log(e.data),this.getMoney(),this.getAssets(),this.onChangeTwo()):this.$Message.error(e.message)}),this.transferModal=!1},onChangeTwo(){console.log(this.walletTwo);for(let t=0;t<this.tableMoney.length;t++)this.tableMoney[t].id==this.walletTwo&&(this.swapWallet=this.tableMoney[t],this.assetsWallet=this.tableMoney[t],this.walletOne=this.$t("uc.finance.swap.currencyaccount")+"("+this.assetsWallet.baseSymbol+")",this.walletOneList=[this.$t("uc.finance.swap.currencyaccount")+"("+this.assetsWallet.baseSymbol+")"])},onTransAll(){1==this.transferDirection?this.transferAmount=this.assetsWallet.balance:this.transferAmount=this.swapWallet.avaBalance}},created(){this.getMoney(),this.getAssets()},filters:{fixed2:function(t){return t.toFixed(2)}},computed:{totalUSDT(){let t=0;for(let e=0;e<this.tableMoney.length;e++)t+=this.tableMoney[e].usdtBalance+this.tableMoney[e].usdtFrozenBalance+this.tableMoney[e].usdtBuyPrincipalAmount+this.tableMoney[e].usdtSellPrincipalAmount+this.tableMoney[e].usdtTotalProfitAndLoss;return t.toFixed(2)},totalCny(){let t=0;for(let e=0;e<this.tableMoney.length;e++){t+=(this.tableMoney[e].usdtBalance+this.tableMoney[e].usdtFrozenBalance+this.tableMoney[e].usdtBuyPrincipalAmount+this.tableMoney[e].usdtSellPrincipalAmount+this.tableMoney[e].usdtTotalProfitAndLoss)*this.tableMoney[e].contractCoin.usdtRate}return t.toFixed(2)},tableColumnsMoney(){let t=this,e=[];return e.push({title:this.$t("uc.finance.swap.swaptype"),align:"center",render:(e,a)=>e("span",{attrs:{title:a.row.baseSymbol}},a.row.baseSymbol.replace("/","")+" "+t.$t("uc.finance.seconds.seconds"))}),e.push({title:this.$t("uc.finance.swap.avabalance"),key:"balance",align:"center",render:(e,a)=>e("span",{attrs:{title:a.row.balance}},t.toFloor(a.row.balance.toFixed(4)||"0"))}),e.push({title:this.$t("uc.finance.swap.frozenbalance"),align:"center",render:(e,a)=>e("span",{attrs:{title:a.row.frozenBalance}},t.toFloor(a.row.frozenBalance.toFixed(4)||"0"))}),e}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nav-rights"},[a("div",{staticClass:"nav-right col-xs-12 col-md-10 padding-right-clear"},[a("div",{staticClass:"bill_box rightarea padding-right-clear"},[a("div",{staticClass:"shaow"},[a("div",{staticClass:"money_table"},[a("div",{staticStyle:{width:"100%",height:"50px"}},[a("Button",{staticStyle:{padding:"6px 15px","margin-right":"30px","letter-spacing":"2px",color:"#f0ac19","background-color":"transparent",border:"1px solid #f0ac19",float:"right"},attrs:{type:"primary"},on:{click:t.onTransferClick}},[t._v(t._s(t.$t("uc.finance.swap.transfor")))])],1),t._v(" "),a("Table",{attrs:{"no-data-text":t.$t("common.nodata"),columns:t.tableColumnsMoney,data:t.tableMoneyShow,"disabled-hover":!0}})],1)])])]),t._v(" "),a("Modal",{attrs:{title:t.$t("uc.finance.swap.transfor")+" - USDT"},model:{value:t.transferModal,callback:function(e){t.transferModal=e},expression:"transferModal"}},[a("div",{staticStyle:{width:"100%","min-height":"32px","margin-top":"15px"}},[a("div",{staticStyle:{width:"45%",display:"inline-flex",height:"32px","line-height":"32px",float:"left"}},[a("Select",{staticStyle:{width:"450px"},attrs:{placeholder:t.$t("uc.finance.swap.currencyaccount")+"(USDT)"},model:{value:t.walletOne,callback:function(e){t.walletOne=e},expression:"walletOne"}},t._l(t.walletOneList,function(e){return a("Option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}),1)],1),t._v(" "),1==t.transferDirection?a("div",{staticStyle:{width:"10%",float:"left","text-align":"center","font-size":"18px",height:"30px","line-height":"30px","font-weight":"bold"},on:{click:function(e){return t.changeTo(2)}}},[a("Tooltip",{attrs:{content:t.$t("uc.finance.swap.clickchange")}},[a("Icon",{staticStyle:{"font-weight":"bold",color:"#19be6b"},attrs:{type:"md-arrow-forward"}})],1)],1):t._e(),t._v(" "),2==t.transferDirection?a("div",{staticStyle:{width:"10%",float:"left","text-align":"center","font-size":"18px",height:"30px","line-height":"30px","font-weight":"bold"},on:{click:function(e){return t.changeTo(1)}}},[a("Tooltip",{attrs:{content:t.$t("uc.finance.swap.clickchange")}},[a("Icon",{staticStyle:{"font-weight":"bold",color:"#19be6b"},attrs:{type:"md-arrow-back"}})],1)],1):t._e(),t._v(" "),a("div",{staticStyle:{width:"45%",display:"inline-flex",height:"32px","line-height":"32px",float:"right"}},[a("Select",{staticStyle:{width:"450px"},attrs:{placeholder:t.$t("uc.finance.seconds.secondsaccount")},on:{"on-change":t.onChangeTwo},model:{value:t.walletTwo,callback:function(e){t.walletTwo=e},expression:"walletTwo"}},t._l(t.tableMoney,function(e){return a("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.baseSymbol)+t._s(t.$t("uc.finance.seconds.secondsaccount")))])}),1)],1)]),t._v(" "),a("div",{staticStyle:{width:"100%","min-height":"20px","margin-top":"0px","font-size":"10px",color:"rgb(97, 104, 138)"}},[a("div",{staticStyle:{width:"50%",height:"20px","line-height":"20px",float:"left","text-align":"left"}},[t._v("\n        "+t._s(t.$t("uc.finance.swap.avaamount"))+"："+t._s(t._f("fixed2")(t.assetsWallet.balance))+"\n      ")]),t._v(" "),a("div",{staticStyle:{width:"50%",height:"20px","line-height":"20px",float:"right","text-align":"right"}},[t._v("\n        "+t._s(t.$t("uc.finance.swap.avaamount"))+"："+t._s(t._f("fixed2")(t.assetsWallet.avaBalance))+"\n      ")])]),t._v(" "),a("p",{staticStyle:{"margin-top":"15px"}},[t._v(t._s(t.$t("uc.finance.swap.inputtransferamount"))+":\n      "),a("InputNumber",{staticStyle:{width:"250px"},attrs:{type:"text",placeholder:t.$t("uc.finance.swap.inputtransferamount")},model:{value:t.transferAmount,callback:function(e){t.transferAmount=e},expression:"transferAmount"}})],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{size:"large"},on:{click:function(e){t.transferModal=!1}}},[t._v(t._s(t.$t("common.close")))]),t._v(" "),a("Button",{attrs:{type:"primary",size:"large"},on:{click:t.confirmOk}},[t._v(t._s(t.$t("uc.finance.swap.oktransfer")))])],1)])],1)},staticRenderFns:[]};var i=a("VU/8")(n,s,!1,function(t){a("6WlA"),a("/cKT")},"data-v-94d2bc3e",null);e.default=i.exports},"6WlA":function(t,e){}});