<template>
  <div class="page-header">
    <div class="header-nav">
      <div class="header-logo">
        <img @click="back" src="../../assets/img/grey-back.png" v-if="headerType==0">
        <img @click="back" src="../../assets/images/customized/logo.png" v-if="headerType==1">
        <!-- <img @click="back" class="back" src="../../assets/img/grey-back.png" v-if="isShowBack && !isShowPopUp"> -->
        <img @click="back" class="back" src="../../assets/img/grey-back.png" v-if="headerType>1">
        <!-- <img @click="close" class="back" src="../../assets/img/grey-close.png" v-if="isShowBack && isShowPopUp"> -->
      </div>
      <div class="header-title">{{title}}</div>
      <div></div>
    </div>
    <!-- <div class="download-bar" v-if="isShowAppDownload=='1'" style="display:none;"> -->
    <div class="download-bar" style="display:none;">
      <img src="../../assets/images/customized/logo.png">
      <div><p>coinglb APP</p><p class="app-desc">New Vision, New Concept</p></div>
      <img src="../../assets/img/download.png" @click="downloadApp">
      <img src="../../assets/img/grey-close.png" @click="closeApp">
    </div>
  </div>
</template>

<style scoped lang="scss">
.download-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 2%;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color: #fff;
    background: #3a3d57;
    box-shadow: 0 10px 12px 0 rgb(18, 18, 22 / 42%);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    img:first-child{
      height: 40px;
      border-radius: 100%;
    }
    img{
      height: 30px;
    }
}

.page-header {
  background-color: #f8f8f9;
  // color: #fff;
  // background-color: #2d8cf0;
  width: 100%;
  z-index: 100;
  position: absolute;
  height: 50px;
  .header-nav {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    .header-title{
      font-size: 18px;
      font-weight: bolder;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-logo {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .back{
        height: 32px !important;
      }
      img {
        position: absolute;
        left: 2%;
        height: 95%;
        z-index: 100;
      }
    }
  }
}
</style>

<script>
export default {
  name: "appHeader",
  data() {
    return {
      isRegisterPath: true,
      navDrawerModal: false,
    };
  },
  props:{
    title:{type:String,default:""},
    isShowBack:{type:Boolean, default:true},
    headerType:{type:Number, default:0},
  },
  computed:{
    isShowAppDownload(){
      return this.$store.state.isShowAppDownload;
    },
    isShowPopUp(){
      return this.$store.state.isShowPopUp;
    },
  },
  watch: {
  },
  created: function() {
  },
  methods:{
    downloadApp(){
      this.$router.push({ path: "/app"});
    },
    closeApp(){
      localStorage.setItem("showdownload", '2');
      this.$store.commit("showAppDownload", '2');
    },
    close(){
      this.$store.commit("showPopUp", false);
    },
    back(){
      if(this.headerType==0){
        history.go(-1);
      }else if(this.headerType==2){
        this.$store.commit("showKline", false);
      }else if(this.headerType==3){
        this.$store.commit("showPopUp", false);
      }else{
        this.$router.push({ path: "/"});
      }
    }
  }
}
</script>