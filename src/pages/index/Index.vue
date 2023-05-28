<template>
  <div class="page-home">
    <!-- <PageHeader :headerType=1></PageHeader> -->
    <div class="page-content">
      <div class="page-index">
        <div class="section" id="page1">
          <div class="activity-list" v-show="picShow">
            <div class="swiper-container" id="swiper_container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in picList" :key="index">
                  <div class="activity-item"><img :src="item.url"></div>
                </div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
        </div>
        <div class="section" id="page2">
          <div class="topnav">
            <div class="notice-list">
              <div class="notice-item" v-for="(item, index) in FAQList" :key="index">
                <router-link :to="{path: '/announcement/' + item.id}">[ {{item.createTime}} ] {{item.title}}</router-link>
              </div>
            </div>
            <div class="more">
              <router-link to="/notice/">{{$t('common.more')}}</router-link>
            </div>
          </div>
        </div>
        <!-- <div class="section" id="page5">
          <div class="quick-title">Quick Transaction</div>
          <div>
              <div class="quick-recharge" @click="goToRechargePage()">
                <div class="quick-title">
                  <div class="quick-subtitle">Quick Transaction</div>
                  <div class="quick-desc">Support BTC, USDT, ETH, etc.</div>
                </div>
                <div class="quick-recharge-img">
                  <img src="@/assets/img/quick-transaction.png">
                </div>
              </div>
              <div class="quick-recharge" @click="goToRechargePage()">
                <div class="quick-title">
                  <div class="quick-subtitle">Quick Transaction</div>
                  <div class="quick-desc">Support BTC, USDT, ETH, etc.</div>
                </div>
                <div class="quick-recharge-img">
                  <img src="@/assets/img/quick-transaction.png">
                </div>
              </div>
          </div>
        </div> -->

        <div class="section" id="page3">
          <div class="quick-transaction">
            <div class="quick-title">{{$t("common.quickTransaction")}}</div>
            <div class="quick-content">
              <div class="quick-recharge" @click="goToRechargePage()">
                <div class="quick-recharge-title">
                  <div class="quick-recharge-subtitle">{{$t("common.recharge")}}</div>
                  <div class="quick-recharge-desc">{{$t("common.support")}}</div>
                </div>
                <div class="quick-recharge-img">
                  <img src="@/assets/img/deposit.png">
                </div>
              </div>
              <div class="quick-withdraw" @click="goToWidthdrawPage()">
                <div class="quick-withdraw-title">
                  <div class="quick-withdraw-subtitle">{{$t("common.withdraw")}}</div>
                  <div class="quick-withdraw-desc">{{$t("common.support")}}</div>
                </div>
                <div class="quick-withdraw-img">
                  <img src="@/assets/img/withdraw.png">
                </div>
              </div>
            </div>
          </div>
          <div class="help-notice">
            <div @click="goToHelpPage">
              <div><img src="@/assets/img/help.png"></div>
              <div>{{$t("common.helpCenter")}}</div>
            </div>
            <div @click="goToNoticePage">
              <div><img src="@/assets/img/notice.png"></div>
              <div>{{$t("common.noticeCenter")}}</div>
            </div>
            <div @click="openCustomerService()">
              <div><img src="@/assets/img/customer_support.png"></div>
              <div>{{$t("common.customerCenter")}}</div>
            </div>
            <div @click="openCtc">
              <div><img src="@/assets/img/c2c.png"></div>
              <div>{{$t("header.ctc")}}</div>
            </div>
          </div>
        </div>
        <div class="section" id="page4">
          <div class="my-lab" @click="goToLabPage">
            <div class="quick-title">
              <div class="quick-subtitle">{{$t("common.innovativeLab")}}</div>
              <div class="quick-desc">{{$t("common.innovativeLabDesc")}}</div>
            </div>
            <!-- <div class="quick-tran-img">
              <img src="@/assets/images/activity_mobile.jpg">
            </div> -->
          </div>
        </div>
       
        <div class="section" id="page6">
          <div ref="trendPanel" class="pagetrend-main">
            <div class="pagetrend-btctrend">
              <div class="pagetrend-btctrend-title">BTC/USDT {{$t("common.trend")}}</div>
              <div class="pagetrend-lastest-price"><span class="lastest-price">{{trendData.close | fixed2}}</span><span style="font-weight: bold;">/USDT</span></div>
            </div>
            <SvgIndex class="pagetrend-svgindex" ref="svgIndexRef" :width="200" :height="180" :values="lineValues"></SvgIndex>
            <div class="pagetrend-price-detail">
              <div>
                <span>Highest price: {{trendData.highest}}</span>
                <span>Lowest price: {{trendData.lowest}}</span>
              </div>
              <div>
                <span>Change(24H): {{trendData.rose}}</span>
                <span>Volume(24H): {{trendData.volume}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section" id="page7">
          <div class="coin-content">
            <div class="coin-title">{{$t("common.marketTrend")}}</div>
            <div class="coin-list">
              <div class="coin-item" v-for="(item,index) in coins_list" :key="index" @click="goExchangePage(item)">
                <span class="coin-name">{{item.symbol}}</span>
                <span class="coin-last-price" :class="{'price-down':item.chg<0, 'price-up':item.chg>0}">{{item.close}}</span>
                <span class="coin-rate price-rize" :class="{'price-down':item.chg<0, 'price-up':item.chg>0}">{{(item.chg*100).toFixed(2)+'%'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter curindex='home'></PageFooter>
  </div>
</template>

<style scoped lang="scss" >
.page-index{
  width:100%;
  padding-bottom: 50px;
  // padding-top: 50px;
  padding-top: 0px;
  #page1 {
    background-color: #fff;
    height: 200px;
    margin: 0 0 2% 0;
    // margin: 2% 0;
    .activity-list {
      height: 100%;
      .swiper-container {
        height: 100%;
        .swiper-slide.swiper-slide-active {
          width: 100%;
        }
        .activity-item {
          height: 100%;
          img{
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }

  #page2 {
    background-color: #fff;
    // height: 40px;
    margin: 2% 0;
    padding: 0 2%;
    .topnav {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .more a{
        color: #f0a70a;
      }
      .notice-list {
        height: 100%;
        .notice-item {
          height: 100%;
          a {
            display: block;
            width: 280px;
            height: 40px;
            line-height: 40px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 13px;
          }
        }
      }
    }
  }

  // #page3 {
  //   background-color: #fff;
  //   margin: 2% 0;
  //   padding: 0 2%;
  //   .quick-transaction {
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     height: 110px;
  //     .quick-title {
  //       height: 100%;
  //       display: block;
  //       .quick-subtitle {
  //         font-size: 18px;
  //         color:#f0a70a;
  //         // color: #377cfb;
  //         font-weight: bold;
  //         margin: 10px 0;
  //       }
  //       .quick-desc {
  //         font-size: 14px;
  //         margin-top: 5px;
  //       }
  //     }
  //     .quick-tran-img {
  //       height: 100%;
  //       padding: 2% 0;
  //       img {
  //         height: 100%;
  //       }
  //     }
  //   }
  //   .help-notice {
  //       display: flex;
  //       justify-content: space-between;
  //       align-items: center;
  //       border-top: 2px solid #f0f2f5;
  //       margin-top: 5px;
  //       padding-top: 5px;
  //   }
  //   .help-notice>div {
  //       width: 33.33%;
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       justify-content: center;
  //       padding: 2%;
  //       font-size: 14px;
  //       box-shadow: 0px 2px 6px 0px #f0f2f5;
  //       img {
  //           height: 40px;
  //       }
  //   }

  // }

  #page3 {
    background-color: #fff;
    margin: 2% 0;
    padding: 0 2%;
    .quick-transaction {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      .quick-title {
        width: 100%;
        display: block;
        font-size: 18px;
        color:#f0a70a;
        font-weight: bold;
        margin: 10px 0;
      }
      .quick-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .quick-recharge {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 45%;
          border-radius: 10px;
          padding: 2%;
          box-shadow: 2px 2px 4px 2px #f0f2f5;
          .quick-recharge-subtitle {
            font-size: 16px;
            font-weight: 600;
          }
        }
        .quick-withdraw {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 45%;
          box-shadow: 2px 2px 4px 2px #f0f2f5;
          border-radius: 10px;
          padding: 2%;
          .quick-withdraw-subtitle {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
    .help-notice {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        border-top: 2px solid #f0f2f5;
        margin-top: 5px;
        padding-top: 5px;
    }
    .help-notice>div {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2%;
        font-size: 14px;
        box-shadow: 0px 2px 6px 0px #f0f2f5;
        div{
          text-align: center;
        }
        img {
            height: 40px;
        }
    }

  }

  #page4 {
    background-color: #fff;
    margin: 2% 0;
    // padding: 0 2%;
    height: 110px;
    .my-lab {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      background-image: url("../../assets/images/activity_mobile.jpg");    
      background-size: 100%;
      background-repeat: no-repeat;
      width: 100%;
      color: #fff;
      padding: 0 2%;
      .quick-title {
        height: 100%;
        display: block;
        .quick-subtitle {
          font-size: 18px;
          // color:#f0a70a;
          // color: #377cfb;
          font-weight: bold;
          margin: 10px 0;
        }
        .quick-desc {
          font-size: 14px;
          margin-top: 5px;
        }
      }
    }
  }

  #page5 {
    background-color: #fff;
    margin: 2% 0;
    padding: 0 2%;
    height: 110px;
    .quick-recharge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .quick-title {
        height: 100%;
        display: block;
        .quick-subtitle {
          font-size: 18px;
          color:#f0a70a;
          // color: #377cfb;
          font-weight: bold;
          margin: 10px 0;
        }
        .quick-desc {
          font-size: 14px;
          margin-top: 5px;
        }
      }
      .quick-recharge-img {
        height: 100%;
        padding:2% 0;
        img {
          height: 100%;
        }
      }
    }
  }

  #page6{
    background-color: #fff;
    margin: 2% 0;
    padding: 0% 2% 2% 2%;
    .pagetrend-main{
      width: 100%;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      .pagetrend-btctrend {
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        .pagetrend-btctrend-title {
          font-size: 18px;
          font-weight: bold;
          color:#f0a70a;
          margin: 10px 0;
          // color: rgb(130, 142, 161);
        }
        .pagetrend-lastest-price {
            color: rgb(130, 142, 161);
            .lastest-price {
                font-size: 16px;
                background:-webkit-linear-gradient(left,#828ea1,#4c5563 25%,#f0a70a 50%,#4c5563 75%,#f0a70a);
                color:transparent;
                -webkit-background-clip:text;
                background-size:200% 100%;
                animation: masked-animation 2s infinite linear;
            }
        }

      }
      .pagetrend-price-detail {
        color: rgb(130, 142, 161);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: rgb(130, 142, 161);
        div {
          width: 100%;
          display: flex;
          span {
            width: 50%;
            text-align: left;
            margin: 1px;
          }
        }
      }
    }
  }

  #page7{
    background-color: #fff;
    margin: 2% 0;
    padding: 0 2%;
    .coin-content{
      display: flex;
      flex-direction: column;
      .coin-title {
          font-size: 18px;
          font-weight: bold;
          color: #f0a70a;
          margin: 10px 0;
      }
      .coin-list {
        .coin-item:last-child {
          border-bottom: none !important;
        }
        .coin-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          font-size: 14px;
          border-bottom: 2px solid #f0f2f5;
          .coin-name {
            width: 90px;
          }
          .coin-last-price.price-up {
            color: #00b275;
          }
          .coin-last-price{
            width: 100px;
            text-align: left;
          }
          .coin-last-price.price-down {
            color:#f15057;
          }
          .price-rize {
            padding: 2px 4px;
            width: 70px;
            text-align: center;
          }
          .price-rize.price-up {
            color: #fff;
            background-color: #00b275;
          }
          .price-rize.price-down {
              color: #fff;
              background-color: #f15057;
          }
        }
      }
    }
  }
}
@-webkit-keyframes masked-animation {
  0% {
      background-position:0 0;
  }
  100% {
      background-position:-100% 0;
  }
}
</style>

<script>
import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';

var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
var moment = require("moment");
import SvgLine from "@components/exchange/SvgLine.vue";
import SvgIndex from "@components/exchange/SvgIndex.vue";
import Swiper from 'swiper';
export default {
  components: { SvgLine, SvgIndex,PageHeader, PageFooter},
  data() {
    let self = this;
    return {
      lineValues :[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      trendData: {
        highest: 0,
        lowest: 0,
        close: 0,
        volume: 0
      },
      loading: false,
      percent: 0,
      pageNo: 1,
      pageSize: 6,
      totalNum: 0,
      FAQList: [],
      yesDayCashDividensBonusETH: 0,
      CNYRate: null,
      dataIndex: [],
      pageNo: 1,
      totalNum: 0,
      searchKey: "",
      coins_list:[],
      coins: {
        _map: [],
        USDT: [],
        USDT2: [],
        BTC: [],
        BTC2: [],
        ETH: [],
        ETH2: [],
        favor: []
      },
      indexBtn: [
        {
          text: this.$t("service.CUSTOM")
        },
        {
          text: this.$t("service.USDT")
        },
        {
          text: this.$t("service.BTC")
        },
        {
          text: this.$t("service.ETH")
        }
      ],
      choseBtn: 0,
      valueCal: 0,
      showArrow: "never",
      speed: 5000,
      symbol: "",
      usdtData: [],
      usdtList: [],
      btcList: [],
      ethList: [],
      picList: [],
      picShow: false
    };
  },
  created: function() {
    this.init();
  },
  mounted: function() {
  },
  destroyed: function () {  
  }, 
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    },
    lang: function() {
      return this.$store.state.lang;
    }
  },
  watch: {
    lang: function() {
      // this.updateLangData();
    }
  },
  filters:{
    fixed2: function(value){
      return value?value.toFixed(2):0.00;
    },
  },
  methods: {
    goExchangePage(item){
      this.$router.push({
        name: 'ExchangePair',
        params: {pair: item.href}
      });
    },
    goToLabPage(){
      this.$router.push({ path: "/lab"});
    },
    goToHelpPage(){
      this.$router.push({ path: "/help"});
      // this.$router.push({ path: "/helplist?cate=1&cateTitle=FAQ"});
    },
    openCtc(){
      this.$router.push({ path: "/ctc"});
    },
    goToNoticePage(){
      this.$router.push({ path: "/notice"});
    },
    goToRechargePage(){
      this.$router.push({ path: "/recharge"});
    },
    goToWidthdrawPage(){
      this.$router.push({ path: "/withdraw"});
    },
    openCustomerService(){
      this.$store.commit("showPopUp", true);
    },
    initSwiper(){
      var ss = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    },
    getRandomNum (Min,Max){
      var Range = Max - Min;
      var Rand = Math.random();
      return(Min + Math.round(Rand * Range));
    },
    init() {
      this.$store.commit("navigate", "nav-index");
      this.loadPicData();
      this.loadDataPage(1);
      this.getSymbol();
      this.loadTrendData();
    },
    updateCoinList(resp){
      this.coins_list.forEach(function(e){
          if(e.symbol==resp.symbol){
            e.chg = resp.chg;
            e.close = resp.close;
          }
      });
      return this.coins_list;
    },
    startWebsock() {
      let stompClient = null;
      let that = this;
      let socket = new SockJS(that.wssHost + that.api.market.ws);
      stompClient = Stomp.over(socket);
      stompClient.debug = false;
      stompClient.connect({}, function(frame) {
        //订阅价格变化消息
        stompClient.subscribe("/topic/market/thumb", function(msg) {
          let resp = JSON.parse(msg.body);
          that.coins_list = that.updateCoinList(resp);
          let coin = that.getCoin(resp.symbol);
          if (coin != null) {
            if(resp.symbol == "BTC/USDT") {
              that.trendData.highest = resp.high;
              that.trendData.lowest = resp.low;
              that.trendData.volume = resp.volume;
              that.trendData.close = resp.close;
              that.trendData.rose = resp.chg > 0 ? "+" + (resp.chg * 100).toFixed(2) + "%" : (resp.chg * 100).toFixed(2) + "%";
            }
          }
        });
      });
    },
    getCoin(symbol) {
      return this.coins._map[symbol];
    },
    loadTrendData(){
      this.$http.post(this.host + "/market/btc/trend", {}).then(response => {
        let resp = response.body;
        this.lineValues = resp.data;
        this.$refs["svgIndexRef"].reload(this.lineValues, this.$refs.trendPanel.offsetWidth, this.$refs.trendPanel.offsetWidth/4);
      });
    },
    getSymbol() {
      this.loading = true;
      this.$http.post(this.host + this.api.market.thumbTrend, {}).then(response => {
        let resp = response.body;
        this.coins_list = resp||[];
        for (let i = 0; i < resp.length; i++) {
          let coin = resp[i];
          coin.price = resp[i].close;
          coin.rose = resp[i].chg > 0 ? "+" + (resp[i].chg * 100).toFixed(2) + "%" : (resp[i].chg * 100).toFixed(2) + "%";
          coin.coin = resp[i].symbol.split("/")[0];
          coin.base = resp[i].symbol.split("/")[1];
          coin.href = (coin.coin + "_" + coin.base).toLowerCase();
          coin.isFavor = false;
          this.coins._map[coin.symbol] = coin;
          this.coins[coin.base].push(coin); // 主板
          if(resp[i].symbol == "BTC/USDT") {
            this.trendData.highest = resp[i].high;
            this.trendData.lowest = resp[i].low;
            this.trendData.volume = resp[i].volume;
            this.trendData.close = resp[i].close;
            this.trendData.rose = resp[i].chg > 0 ? "+" + (resp[i].chg * 100).toFixed(2) + "%" : (resp[i].chg * 100).toFixed(2) + "%";
          }
        }
        // this.startWebsock();
        this.loading = false;
        this.startWebsock();
      });
    },
    loadDataPage(pageIndex) {
      var param = {};
      let self = this;
      (param["pageNo"] = pageIndex), (param["pageSize"] = this.pageSize), (param["lang"] = this.lang),
      this.$http.post(this.host + this.api.uc.announcement, param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data.content.length == 0) return;

            self.totalNum = resp.data.totalElements;
            let FAQListtem = resp.data.content;

            let faqListTmp = [];

            if(self.totalNum > 3){
              faqListTmp = FAQListtem.slice(0, 3);
            }else{
              faqListTmp = FAQListtem;
            }
            faqListTmp.forEach(function(item){
              item.createTime = item.createTime.substring(5, 10);
            });

            setInterval(() => {
              let currentIndex = self.getRandomNum(0,faqListTmp.length-1);
              self.FAQList = faqListTmp.filter((e,i)=>{
                return i == currentIndex;
              });
            }, 3000);

          } else {
            self.$Notice.error({
              title: self.$t("common.tip"),
              desc: resp.message
            });
          }
      });
    },
    loadPicData() {
      let param = {};
      param["sysAdvertiseLocation"] = 1;
      param["lang"] = this.langPram;
      this.$http.post(this.host + "/uc/ancillary/system/advertise", param).then(response => {
        var result = response.body;
        if(result.code == 0 && result.data.length > 0) {
          this.picList = result.data;
          this.picShow = true;
          var _this = this;
          setTimeout(function(){
            _this.initSwiper();
          },1000);
        }else{
          this.picShow = false;
        }
      });
    },
    goMyAssetsPage(){
      this.$router.push("/moneyIndex");
    }
  }
}
</script>