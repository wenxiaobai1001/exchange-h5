webpackJsonp([72],{XwgM:function(t,e){},p7kG:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={components:{},data:()=>({}),created:function(){this.init()},methods:{init(){localStorage.TOKEN&&localStorage.MEMBER||(this.$Message.success(this.$t("common.logintip")),this.$router.push("/login"))}},watch:{$route(t,e){console.log(t.path)}},mounted:function(){this.$nextTick(function(){})}},i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"mymsg_wrapper"},[e("div",{staticClass:"wrapper"},[e("router-view")],1)])},staticRenderFns:[]};var o=n("VU/8")(s,i,!1,function(t){n("XwgM")},"data-v-3c3561f9",null);e.default=o.exports}});