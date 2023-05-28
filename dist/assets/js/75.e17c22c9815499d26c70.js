webpackJsonp([75],{D3IY:function(e,t){},oT3m:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={components:{},data(){const e=this;return{data:[],ordKeyword:"",rangeDate:"",startDate:"",endDate:"",recordValue:"",recordType:[{value:0,label:this.$t("uc.finance.record.charge")},{value:1,label:this.$t("uc.finance.record.pickup")},{value:2,label:this.$t("uc.finance.record.transaccount")},{value:3,label:this.$t("uc.finance.record.exchange")},{value:4,label:this.$t("uc.finance.record.otcbuy")},{value:5,label:this.$t("uc.finance.record.otcsell")},{value:6,label:this.$t("uc.finance.record.activityaward")},{value:7,label:this.$t("uc.finance.record.promotionaward")},{value:8,label:this.$t("uc.finance.record.dividend")},{value:9,label:this.$t("uc.finance.record.vote")},{value:10,label:this.$t("uc.finance.record.handrecharge")},{value:11,label:this.$t("uc.finance.record.match")}],tableColumnsRecord:[{title:this.$t("uc.finance.paydividende.datehodld"),key:"haveTime",align:"center"},{title:this.$t("uc.finance.paydividende.paydividends"),align:"center",render:(t,a)=>t("span",{attrs:{title:a.row.memBouns}},e.toFloor(a.row.memBouns))},{title:this.$t("uc.finance.paydividende.account_date"),key:"arriveTime",align:"center"}],accumulative_return:"0",accumulat_return:"0",pageSize:10,page:0,total:0,tableRecord:[],loading:!1}},created:function(){this.init()},methods:{init(){let e=0;!this.$store.getters.isLogin&&this.$router.push("/login"),this.$store.getters.isLogin&&(e=this.$store.getters.member.id),e&&0!=e&&(this.memberId=e,this.getTableData())},getTableData(e=1,t=10){this.loading=!0,this.$http.post(this.host+this.api.uc.paydividends,{memberId:this.memberId,pageNo:e,pageSize:t}).then(e=>{this.loading=!1;let t=e.body;if(0==t.code){let e=this.data=t.data;this.accumulative_return=e.amount||0,this.total=parseInt(t.totalElement),this.tableRecord=e.bonus}else this.$Message.error(t.message)})},changePage(e){this.getTableData(e)},queryOrder(){let e="";if(0==this.rangeDate.length)return"English"==this.$store.state.lang&&this.$Message.error("Please select a search date range"),void("English"!=this.$store.state.lang&&this.$Message.error("Please select datetime range"));try{e+=this.rangeDate[0].getFullYear()+"-"+(this.rangeDate[0].getMonth()+1)+"-"+this.rangeDate[0].getDate(),e+="~",e+=this.rangeDate[1].getFullYear()+"-"+(this.rangeDate[1].getMonth()+1)+"-"+this.rangeDate[1].getDate()}catch(e){return"English"==this.$store.state.lang&&this.$Message.error("Please select a search date range"),void("English"!=this.$store.state.lang&&this.$Message.error("Please select datetime range"))}let t={};t.dateRange=e,t.pageNo=0,t.pageSize=10,"number"==typeof this.recordValue&&(t.type=this.recordValue),this.$http.post(this.host+"/uc/asset/transaction/all",t).then(e=>{var t=e.body;t.content?(this.tableRecord=t.content,this.total=t.totalElements,this.loading=!1,this.page=t.number):this.$Message.error(t.message)})},updateLangData(){this.tableColumnsRecord[0].title=this.$t("uc.finance.paydividende.datehodld"),this.tableColumnsRecord[1].title=this.$t("uc.finance.paydividende.paydividends"),this.tableColumnsRecord[2].title=this.$t("uc.finance.paydividende.account_date")}},computed:{lang:function(){return this.$store.state.lang}},watch:{lang:function(){this.updateLangData()}}},n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"nav-rights"},[a("div",{staticClass:"nav-right col-xs-12 col-md-10 padding-right-clear"},[a("div",{staticClass:"bill_box rightarea padding-right-clear record"},[a("div",{staticClass:"col-xs-12 rightarea-con"},[a("div",{staticClass:"trade_accumulative"},[a("div",{staticClass:"trade_accumulative_return"},[e._v(e._s(e.$t("uc.finance.paydividende.money_holding"))+"  "+e._s(new Number(e.accumulative_return).toFixed(8)))])]),e._v(" "),a("div",{staticClass:"form-group",staticStyle:{display:"none"}},[a("span",[e._v("\n                        "+e._s(e.$t("uc.finance.paydividende.start_end"))+" ：\n                    ")]),e._v(" "),a("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"daterange"},model:{value:e.rangeDate,callback:function(t){e.rangeDate=t},expression:"rangeDate"}}),e._v(" "),a("Button",{staticStyle:{padding:"6px 50px","margin-left":"10px","background-color":"#f0a70a","border-color":"#f0a70a"},attrs:{type:"primary"},on:{click:e.queryOrder}},[e._v(e._s(e.$t("uc.finance.paydividende.search")))])],1),e._v(" "),a("div",{staticClass:"datedaitl",staticStyle:{display:"none"}},[a("span",{staticStyle:{color:"#eb6f6c"}},[e._v(e._s(e.$t("uc.finance.paydividende.start_end"))+" ：")]),e._v("  \n                    "),a("span",[e._v(e._s(e.$t("uc.finance.paydividende.datehodld")))])]),e._v(" "),a("div",{staticClass:"order-table"},[a("Table",{attrs:{"no-data-text":e.$t("common.nodata"),columns:e.tableColumnsRecord,data:e.tableRecord,loading:e.loading}}),e._v(" "),a("div",{staticStyle:{margin:"10px",overflow:"hidden"}},[a("div",{staticStyle:{float:"right"}},[a("Page",{attrs:{total:e.total,"page-size":e.pageSize,"show-total":"",current:e.page+1,id:"record_pages"},on:{"on-change":e.changePage}})],1)])],1)])])])])},staticRenderFns:[]};var s=a("VU/8")(i,n,!1,function(e){a("D3IY")},"data-v-328e7848",null);t.default=s.exports}});