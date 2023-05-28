<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('common.settingTitle')"></PageHeader>
    <div class="page-setup-main">
      <div class="page-setup">
        <div class="navs" v-for="(item,index) in setList" :key="index" @click="jump(item.url)">
          <span>{{item.name}}</span><img class="set_img" src="../../assets/img/icon_arrow_right.png" />
        </div>
      </div>
      <div class="page-setup">
        <div class="navs">
          <span>{{$t("common.version")}}</span>
          <span>1.0.1</span>
        </div>
      </div>
      <div class="btn width" style="background:#ed4014;" @click="deleteAccountTip">{{$t('common.deleteAccount')}}</div>
      <div class="btn width" @click="back">{{$t('common.logout')}}</div>
    </div>
    <Modal v-model="modal1" width="90%">
        <template #header>
            <p style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>Delete confirmation</span>
            </p>
        </template>
        <div style="text-align:center">
            <p style="font-size:14px;">Will you delete it?</p>
        </div>
        <template #footer>
            <Button type="error" size="large" long :loading="modal_loading" @click="deleteAccount">Delete</Button>
        </template>
    </Modal>
  </div>
</template>
<script>

import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader},
  data() {
    let self = this;
    return {
      modal1:false,
      setList:[
        { url:'/language', name:this.$t("common.language")},
        { url:'/uploadHeader', name:this.$t("common.headerImg")},
        //{ url:'', name:'Feedback'},
        // { url:'/aboutUs', name:'About Us'},
      ]
    };
  },
  created: function() {
    
  },
  mounted: function() {
  },
  destroyed: function () {  
  }, 
  computed: {
   
  },
  watch: {
    
  },
  filters:{
    
  },
  methods: {
    jump(res){
      this.$router.push(res)
    },
    back(){
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("MEMBER")
      localStorage.removeItem("LANGUAGE")
      this.$store.commit("setMember", null);
      this.$router.push("/login");
    },
    deleteAccountTip(){
      this.modal1 = true;
    },
    deleteAccount(){
      this.$http.post(this.host + "/uc/member/delete", {}).then(response => {
        this.modal1 = false;
        this.$Notice.success({
          title: this.$t("common.tip"),
          desc:'Deleted successful'
        });
        this.$router.push("/login");
      });
    }
  }
}
</script>
<style scoped lang="scss">
.page-setup-main{
  padding-top: 50px;
  .page-setup{
    background:#fff;
    font-size: 14px;
  }
  .btn{
    height:40px;
    background:#f0a70a;
    margin-top:20px;
    color:#fff;
    border-radius:35px;
    text-align:center;
    line-height:40px;
    letter-spacing: 2px;
    margin-top:50px;
    font-size: 16px;
    margin-right: 20px;
    margin-left: 20px;
  }
}
.set_img{
  width:15px;
}

.navs{
  padding: 3% 2%;
  width: 100%;
  margin: auto;
  background: #fff;
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
}
</style>