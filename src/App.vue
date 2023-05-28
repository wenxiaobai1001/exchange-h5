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
.page-view{
  width: 100%;
  height: 100%;
  background: white;
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