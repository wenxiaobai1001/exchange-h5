<template>
  <div class="page-home-customer">
    <PageHeader :headerType=3 title="Customer Center"></PageHeader>
    <div class="page-content">
      <div class="page-customer-service" @click="closeCustomerService()">
        <div v-if="!customerURL" >Sorry, Please login first, and then can contact with customer center.</div>
        <div v-if="customerURL" ><iframe width="100%" height="100%" frameborder=0 :src="customerURL"></iframe></div>
      </div>
    </div>
  </div>
</template>

<script>

import PageHeader from '@/components/header/index.vue';
export default {
  components: {
    PageHeader
  },
  data() {
    return {
      data: {},
      qrcode: {
        value: "",
        size: 150
      },
      initLang: this.$store.state.lang,
      hasContent: false,
      customerURL:null
    };
  },
  filters: {
    subTime: function(str) {
      return str.substr(5,5);
    }
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    }
  },
  created: function() {
    let member = this.$store.getters.member;
    console.log("member",member);
    // this.customerURL = "https://www.kf827.xyz/Chat/Chat?lang=en&userID=111&userName=111";
    if(!member){
      this.$store.commit("showPopUp", false);
      this.$router.push({ path: "/login"});
      // this.customerURL = "https://www.kf827.xyz/Chat/Chat?lang=en&userID="+member+"&userName="+member.username;
    }
    // this.customerURL = "https://www.onlineservicechat.com/index/index/home?visiter_id="+member.id+"&visiter_name="+(member.realName||'')+"&avatar="+(member.avatar||'')+"&business_id=1&groupid=1&special=1";
    this.customerURL = "https://h5.coinglb.com/chat.html";
  },
  methods: {
    closeCustomerService(){
      this.$store.commit("showPopUp", false);
    }
  },
  watch: {
  }
};
</script>
<style scoped lang="scss">
.page-home-customer {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1000000;
  background: #fff;
  right: 0;
  left: 0;
  .page-content {
    width: 100%;
    height: 100%;
    .page-customer-service{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      div {
          background-color: #fff;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          text-align: center;
          font-weight: bold;
      }
    }
  }
}

</style>
