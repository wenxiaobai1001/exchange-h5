<template>
  <div class="page-view" :class="{'isShowOverflow':isShowPopUp, 'isShowAppDownload': isShowAppDownload=='0'}">
    <CustomerService v-if="isShowPopUp"></CustomerService>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
import CustomerService from '@/components/customer/index.vue';
export default {
  components: {CustomerService},
  name: "app",
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      whatappIframe:"",
      isRouterAlive: true,
      pageView: "page-view",
      utc: null,
      time: null,
      content: " ",
      navDrawerModal: false,
      wechat: this.$t("footer.wechat")
    };
  },
  watch: {
    
  },
  computed: {
    isShowAppDownload(){
      return this.$store.state.isShowAppDownload;
    },
    isShowPopUp(){
      return this.$store.state.isShowPopUp;
    },
    activeNav: function() {
      return this.$store.state.activeNav;
    },
    isLogin: function() {
      return this.$store.getters.isLogin;
    },
    member: function() {
      return this.$store.getters.member;
    },
    languageValue: function() {
      var curlang = this.$store.getters.lang;
      this.$i18n.locale = curlang;
      if(curlang=="zh_CN"){
        return "简体中文";
      }else{
        return "English";
      }
    },
    lang() {
      return this.$store.state.lang;
    },
    exchangeSkin() {
      return this.$store.state.exchangeSkin;
    }
  },
  created: function() {
    this.showAppDownload();
    this.initialize();
    // zE('webWidget', 'hide');
    var d = new Date(), gmtHours = d.getTimezoneOffset() / 60;
    this.utc = "GMT " + (gmtHours > 0 ? "-" : "+") + " " + String(gmtHours)[1];
    setInterval(() => {
      this.time = new Date().getTime();
    }, 1000);
    // 隐藏加载层
    let initLoading = document.getElementById("initLoading");
    if(initLoading != null){
      document.body.removeChild(initLoading);
    }
  },
  methods: {
    showAppDownload(){
      let showdownload = window.location.href;
      let hasdonwload = false;
      if(showdownload.indexOf("showdownload")>0){
        localStorage.setItem("showdownload", '0');
        hasdonwload = true;
      }
      let localShowDownload = localStorage.getItem("showdownload");
      if(localShowDownload==null || localShowDownload=='undefined' || localShowDownload=='null'){
        if(hasdonwload){
          localStorage.setItem("showdownload", '0');
        }
      }
      localShowDownload = localStorage.getItem("showdownload");
      if(localShowDownload=='0'){
        this.$store.commit("showAppDownload", '0');
      }else{
        this.$store.commit("showAppDownload", '1');
      }
    },
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    },
    initialize() {
      this.$store.commit("navigate", "nav-index");
      this.$store.commit("recoveryMember");
      this.$store.commit("initLang");
      this.$store.commit("initLoginTimes");
      this.checkLogin();
    },
    
    checkLogin() {
      this.$http.post(this.host + "/uc/check/login", {}).then(response => {
        var result = response.body;
        if (result.code == 0 && result.data == false) {
          this.$store.commit("setMember", null);
        }
      });
    },
    changelanguage: function(name) {
      console.log("change language: " + name);
      this.$store.commit("setlang", name);
      this.$i18n.locale = name;
      this.reload();
    }
  }
};
</script>

<style lang="scss">
a,.green,.ivu-table-sort i.on{
	color: #2de2b4!important;
}
.ivu-checkbox-checked .ivu-checkbox-inner{
	border-color: #2de2b4;
	background-color: #2de2b4;
}
.ivu-table:before{
	background-color: #1b2c42!important;
}
.swiper-pagination-bullet-active{
	background: #2de2b4!important;
}
.market {
	.ivu-table-column-QmGLbE{
		font-weight: 700;
	}
    .ivu-table th{
		border-bottom: none!important;
	}
	td{ 
		border-bottom: 1px solid #3a495c!important;
		background-color: #1b2c42!important;
		display: table-cell;
		text-align: center;
		padding: 16px 0;
		color: #768da9;
	}
}
.margin10{
	margin-left: 10px;
}
.coin-menu .sc_new_filter .ivu-btn-default,.ivu-table-cell-sort,.coin-menu .sc_new_filter, .ivu-table th{
	color: #768da9!important;
}
.coin-menu .sc_new_filter .ivu-btn-default.active{
	color: #2de2b4!important;
	border-bottom: 4px solid #2de2b4!important;
}
.coin-menu .sc_new_filter,.ivu-table th{
	background-color: #1b2c42!important;
}
.market .ivu-input-large{
	color: rgb(226, 232, 228);
	font-size: 13px;
	border-radius: 5px;
	border: none;
	background: #2a405c;
}
.drawer_index{
	.ivu-drawer{
		width: 80%!important;
	}
	.ivu-drawer-content{
		background-color: #2a405c!important;
		color: #768da9!important;
	}
	.ivu-drawer-body{
		padding: 16px 0;
	}
}
.login_form{
	    padding: 0 22px 20px 22px!important;
	    background: #1b2c42;
	.specialitem{
		display: block;
		padding: 16px 0 0 0;
		margin:10px auto;
		.ivu-input-large{
			color: rgb(226, 232, 228);
			font-size: 13px;
			min-height: 48px;
			line-height: 48px;
			border-radius: 5px;
			border: none;
			background: #2a405c;
		}
		.ivu-input-group-append, .ivu-input-group-prepend{
			    background-color: #2a405c;
			    border: none;
			    border-radius: 4px;
			    color: rgb(226, 232, 228);
		}
	}
	.code{
		.ivu-input{
			color: rgb(226, 232, 228);
			font-size: 13px;
			min-height: 48px;
			line-height: 48px;
			border-radius: 5px;
			border: none;
			background: #2a405c;
		}
		.ivu-form-item{
			margin: 0;
		}
	}
}
.page-view{
  width: 100%;
  height: 100%;
  background: #1b2c42;
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Segoe UI,Arial,Roboto,PingFang SC,Hiragin;
  font-size: 15px;
  // padding: 10px 0 !important;
}
.isShowAppDownload{
  padding-top: 0;
}
.page-view.isShowOverflow{
  overflow: hidden;
}
.page-popup {
    position: fixed;
    z-index: 1000;
    background-color: #fff;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
}
.page-home {
  width: 100%;
  height: 100%;
  .page-content{
    width: 100%;
  }
}
</style>