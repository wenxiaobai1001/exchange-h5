webpackJsonp([63],{"1+kl":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={data:()=>({src:"https://coineurglobalvip.oss-accelerate.aliyuncs.com/assets/files/coinglbWhitePaperVer2021.pdf"}),created:function(){this.init()},computed:{lang(){return this.$store.state.lang},langPram(){return this.$store.state.lang}},methods:{init(){this.$store.state.HeaderActiveName="1-8",this.$store.commit("navigate","nav-whitepaper")},changePdfPage(t){0===t&&this.currentPage>1&&this.currentPage--,1===t&&this.currentPage<this.pageCount&&this.currentPage++},loadPdfHandler(t){this.currentPage=1}}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"pdf"},[e("embed",{attrs:{src:"https://coineurglobalvip.oss-accelerate.aliyuncs.com/assets/files/coinglbWhitePaperVer2021.pdf",width:"100%",height:"800"}}),this._v(" "),e("p",{staticClass:"arrow",staticStyle:{"text-align":"center",color:"#000",margin:"20px 0 20px 0"}},[e("a",{staticStyle:{color:"#FFF"},attrs:{href:"https://coineurglobalvip.oss-accelerate.aliyuncs.com/assets/files/coinglbWhitePaperVer2021.pdf",target:"_blank"}},[this._v(this._s(this.$t("sectionPage.downloadwhite")))])])])},staticRenderFns:[]};var i=a("VU/8")(s,r,!1,function(t){a("MfmE")},"data-v-69c0784b",null);e.default=i.exports},MfmE:function(t,e){}});