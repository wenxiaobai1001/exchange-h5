<template>
    <div class="page-contract-tab" :style="{backgroundColor:bgColor}">
      <router-link :style="{fontColor:fontColor}" :to="item.url" v-for="(item, index) in contractList" :key="index" :class="{'active':item.url.indexOf(contractUrl)>-1}">{{item.title}}</router-link>
    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      contractList :[{title:this.$t("header.swap1"),url:'/swap'},{title:this.$t("header.option"),url:'/option'},{title:this.$t("header.seconds"),url:'/seconds/btc_usdt'}],
    };
  },
  props: {
    contractUrl: {
      type: String,
      default: '/swap'
    },
    bgColor: {
      type:String,
      default:"#000000"
    },
    fontColor: {
      type:String,
      default:"#fff"
    }
  },
  filters: {

  },
  computed: {
  },
  watch: {

  },
  created: function() {
    
  },
  methods: {
      
  }
};
</script>
<style scoped lang="scss">
.page-contract-tab {
    width: 100%;
    // background: #000000;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    // margin: 2% 0;
    a{
      // color:#fff !important;
      display: flex;
      align-items: center;
    }
    .active {
      height: 100%;
      border-bottom: 3px solid #f0a70a;
      color: #f0a70a;
      font-size: 16px;
      font-weight: 600;
    }
}
</style>