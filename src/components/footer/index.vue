<template>
  <div class="page-footer">
    <div class="footer-nav">
      <div v-for="(item, index) in footerNavList" :key="index" style="text-align:center;">
        <router-link :to="item.url" tag="span">
           <span>
             <img :src="require('../../assets/img/'+item.imageName+'-active.png')" v-if="item.imageName == curindex" />
             <img :src="require('../../assets/img/'+item.imageName+'.png')" v-else />
           </span>
           <span style="display:block;" :class="item.imageName == curindex ? 'active' : ''">{{item.name}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "appFooter",
  props:{
    curindex:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentNav:{name:"Home", url:"/",isActive:false,imageName:"home",image:'home'},
      footerNavList:[
        {name:"Home", url:"/",isActive:false,imageName:"home",image:'home'},
        {name:"Market", url:"/market",isActive:false,imageName:"market",image:'market'},
        // {name:"OTC", url:"/otc/trade/usdt",isActive:false,imageName:"otc",image:'otc'},
        {name:"Exchange", url:"/exchange",isActive:false,imageName:"exchange",image:'exchange'},
        {name:"Contract", url:"/swap",isActive:false,imageName:"contract",image:'contract'},
        {name:"Profile", url:"/my",isActive:false,imageName:"my",image:'my'}
      ]
    };
  },
  components:{

  },
  watch: {

  },
  computed: {

  },
  created: function() {
    //this.navigateUrl(this.currentNav);
    // 隐藏加载层
    let initLoading = document.getElementById("initLoading");
    if(initLoading != null){
      document.body.removeChild(initLoading);
    }
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.page-footer{
  // background: #172636;
  background: #2a405c!important;
  width: 100%;
  z-index: 100;
  position: fixed;
  padding: 4px 0;
  bottom: 0;
  .footer-nav {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px;
    font-size: 14px;
    color: #768da9;
    font-weight: 400;
    div {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .active{
          color:#2befbc;
        }
        img{
          height: 16px;
        }
    }
    a{
      color: #768da9;
    }
    a.router-link-exact-active.router-link-active{
      color: #2befbc;
      font-size: 16px;
    }
    a:active {
      color: #2befbc;
    }
    a:hover {
      color: #2befbc;
    }
  }
}
</style>