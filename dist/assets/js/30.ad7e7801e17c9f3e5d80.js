webpackJsonp([30],{"9GtF":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={components:{},data(){return{loginmsg:this.$t("common.logintip"),total:0,pageSize:10,loading:!0,pageNo:1,orderList:[]}},methods:{getMyOrderList(){let t={};t.pageNo=this.pageNo,t.pageSize=this.pageSize,this.$http.post(this.host+this.api.uc.myInnovationOrderList,t).then(t=>{var e=t.body;0==e.code?this.orderList=e.data.content:this.$Message.error(this.loginmsg),this.loading=!1})},loadDataPage(t){this.pageNo=t,this.getMyOrderList()}},created(){this.getMyOrderList()},computed:{tableColumns(){let t=[];return t.push({title:this.$t("uc.activity.column1"),key:"activityName",align:"center",width:100,render:(t,e)=>t("a",{attrs:{href:this.rootHost+"/#/lab/detail/"+e.row.activityId,target:"_blank"}},e.row.activityName)}),t.push({title:this.$t("uc.activity.column2"),key:"type",align:"center",render(t,e){let a="Unknow";return 1==e.row.type&&(a="Starter snap"),2==e.row.type&&(a="Starter share"),3==e.row.type&&(a="Share position"),4==e.row.type&&(a="Free subscription"),5==e.row.type&&(a="Cloud mining machine subscription"),6==e.row.type&&(a="Lock up"),t("span",{},a)}}),t.push({title:this.$t("uc.activity.column3"),key:"amount",align:"center"}),t.push({title:this.$t("uc.activity.column4"),key:"baseSymbol",align:"center"}),t.push({title:this.$t("uc.activity.column5"),key:"coinSymbol",align:"center"}),t.push({title:this.$t("uc.activity.column6"),key:"state",align:"center",render(t,e){let a="Temporary";return 5==e.row.type?(1==e.row.state&&(a="Not deployed"),2==e.row.state&&(a="Deployed"),3==e.row.state&&(a="Revoked")):(1==e.row.state&&(a="Pending transaction"),2==e.row.state&&(a="Deal done"),3==e.row.state&&(a="Revoked")),t("span",{},a)}}),t.push({title:this.$t("uc.activity.column7"),key:"turnover",align:"center",render:(t,e)=>t("span",{},e.row.turnover+" "+e.row.baseSymbol)}),t.push({title:this.$t("uc.activity.column8"),key:"createTime",align:"center",width:140}),t}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nav-rights"},[a("div",{staticClass:"nav-right col-xs-12 col-md-10 padding-right-clear"},[a("div",{staticClass:"bill_box rightarea padding-right-clear"},[a("div",{staticClass:"shaow"},[a("div",{staticClass:"money_table"},[a("Table",{attrs:{"no-data-text":t.$t("common.nodata"),columns:t.tableColumns,data:t.orderList,loading:t.loading,"disabled-hover":!0}}),t._v(" "),a("div",{staticClass:"page"},[a("Page",{attrs:{total:t.total,pageSize:t.pageSize,current:t.pageNo},on:{"on-change":t.loadDataPage}})],1)],1)])])])])},staticRenderFns:[]};var r=a("VU/8")(i,o,!1,function(t){a("m9m5"),a("cYY5")},"data-v-ef3e1b9a",null);e.default=r.exports},cYY5:function(t,e){},m9m5:function(t,e){}});