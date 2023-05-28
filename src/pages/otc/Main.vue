<template>
  <div class="page-home">
    <div class="page-content">
      <div class="containers" id="List">
        <div class="fiat">
          <div class="to_business">
            <h3>{{$t('otc.title')}}</h3>
            <span>{{$t('otc.desc')}}</span>
            <a href="javascript:void(0)" @click="goBusiness">{{$t('otc.buttontxt')}}</a>
            <!-- <router-link to="/identbusiness">成为商家</router-link> -->
          </div>
        </div>
        <div class="content">
          <Menu ref="navMenu" mode="horizontal" width="auto" :active-name="activeMenuName" @on-select="menuSelected" class='tradelist'>
            <MenuGroup>
              <template v-for="(coin,index) in coins" >
                <MenuItem :name="'coin-'+index" :key="index"> {{coin.unit}}</MenuItem>
              </template>
            </MenuGroup>
          </Menu>
          <router-view></router-view>
        </div>
        <div class="advantage">
          <ul>
            <li>
              <div class="image"><img src="../../assets/images/price.png" alt=""></div>
              <div class="title">{{$t('otc.title1')}}</div>
              <div class="content1">{{$t('otc.desc1')}}</div>
            </li>
            <li>
              <div class="image"><img src="../../assets/images/poundage.png" alt=""></div>
              <div class="title">{{$t('otc.title2')}}</div>
              <div class="content1">{{$t('otc.desc2')}}</div>
              <li>
                <div class="image"><img src="../../assets/images/instant.png" alt=""></div>
                <div class="title">{{$t('otc.title3')}}</div>
                <div class="content1">{{$t('otc.desc3')}}</div>
              </li>
              <li>
                <div class="image"><img src="../../assets/images/platedanbao.png" alt=""></div>
                <div class="title">{{$t('otc.title4')}}</div>
                <div class="content1">{{$t('otc.desc4')}}</div>
              </li>
          </ul>
        </div>
      </div>
    </div>
    <PageFooter curindex='otc'></PageFooter>
  </div>
</template>

<script>
import PageFooter from '@/components/footer/index.vue';
export default {
  components: {PageFooter},
  data() {
    return {
      coins: [],
      activeMenuName: "coin-1"
    };
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  watch:{
    $route(to, from) {
      this.activeMenu();
    }
  },
  methods: {
    init() {
      this.$store.commit("navigate", "nav-otc");
      this.$http.post(this.host + this.api.otc.coin).then(response => {
        if (response.body.code == 0) {
          this.coins = response.body.data;
          this.activeMenu();
          this.$nextTick(function() {
            this.$refs.navMenu.updateActiveName();
          });
        }
      });
    },
    goBusiness() {
      if (this.isLogin) {
        this.$router.push({
          path: "/identbusiness"
        });
      } else {
        this.$Message.warning("Please log in first");
      }
    },
    menuSelected(menuName) {
      if (menuName.startsWith("coin")) {
        var coin = this.coins[menuName.split("-")[1]];
        this.$router.push({path: "/otc/trade/" + coin.unit, query: {unit: coin.unit}});
      } else {
        this.$router.push("/otc/" + menuName);
      }
    },
    activeMenu() {
      let coin = this.$route.params[0] || "USDT";
      coin = coin.toUpperCase();
      let index=0;
      this.coins.forEach((v,i)=>{
        if(v.unit===coin){
          index=i;
        }
      })
      this.activeMenuName = `coin-${index}`;
      this.$nextTick(function() {
        this.$refs.navMenu.updateActiveName();
      });
    }
  },
  created: function() {
    this.init();
    // this.activeMenuName = "coin-1";
    // this.$nextTick(function() {
    //   this.$refs.navMenu.updateActiveName();
    // });
  }
};
</script>


<style scoped lang="scss">
.page-home {
  // background-color: #fff;
  .containers {
    width: 100%;
    padding-bottom: 50px;
    .fiat {
      // border-radius: 5px;
      // height: 250px;
      background: url("../../assets/images/otc_bg.jpg") no-repeat center center;
      // background-size: 100%;
      .to_business {
        color: #fff;
        text-align: center;
        height: 100%;
        width: 100%;
        display: flex; //flex布局
        justify-content: center; //使子项目水平居中
        align-items: center; //使子项目垂直居中
        flex-direction: column;
        padding: 2%;
        h3 {
          font-size: 20px;
          // letter-spacing: 20px;
        }
        span {
          font-size: 14px;
          // letter-spacing: 10px;
          // display: block;
        }
        a {
          width: 180px;
          height: 45px;
          display: inline-block;
          background: #ffa400;
          border-radius: 5px;
          font-size: 16px;
          line-height: 45px;
          color: #fff;
          margin-top: 20px;
        }
      }
    }
    .content {
      width: 100%;
      // margin: 20px auto;
      background-color: #000000;
      border-radius: 4px;
      /deep/ .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
          color: #f0ac19;
          border-bottom: 2px solid #f0ac19;
      }
    }
    .advantage {
      background-color: #000000;
      // border-radius: 4px;
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        li {
          width: 100%;
          list-style-type: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2%;
          div {
            text-align: center;
          }
          div.image {
            width: 10%;
            height: auto;
            img {    
              width: 100%;
              vertical-align: middle;
            }
          }
          div.title {
            font-size: 16px;
            color: #fff;
            width: 25%;
          }
          div.content1 {
            line-height: 20px;
            font-size: 14px;
            color: #999;
            width: 60%;
          }
        }
      }
    }
  }
}
</style>
