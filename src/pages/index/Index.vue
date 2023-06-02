<template>
  <div class="page-home">
	<div class="Sticky_top">
		<img src="../../assets/images/user.png" @click="userControl = true" />
		<div class="name">bittrade</div>
		<div></div>
	</div>
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
            <div class="quick-title green">{{$t("common.quickTransaction")}}</div>
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
            <div class="coin-title">
				<img src="../../assets/images/index_l.png" class="logo" />
				<span class="marketTrend">{{$t("common.marketTrend")}}</span>
				<img src="../../assets/images/left_r.png" class="logo" />
			</div>
            <div class="coin-list">
			  <div class="tips">
				  <div>交易對</div>
				  <div>交易對</div>
				  <div>交易對</div>
			  </div>
              <div class="coin-item" v-for="(item,index) in coins_list" :key="index" @click="goExchangePage(item)">
                <span class="coin-name"><span>{{item.symbolfrist}}</span>/{{item.symbollast}}</span>
                <span class="coin-last-price" :class="{'price-down':item.chg<0, 'price-up':item.chg>0}">{{item.close}}</span>
                <span class="coin-rate price-rize" :class="{'price-down':item.chg<0, 'price-up':item.chg>0}">{{(item.chg*100).toFixed(2)+'%'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter curindex='home'></PageFooter>
	<!--左侧抽屉 开始-->
	<Drawer placement="left" :closable="false" v-model="userControl" class="drawer_index">
	  <div>
		  <div class="user-info">
			  <img src="../../assets/images/user.png" class="user-img" />
			  <div class="u-avatar login-avatar">
				  <div class="nickname">你好, 123</div>
				  <div class="uid">UID: 6<Icon type="md-copy" class="green margin10" size='20' /></div>
			  </div>
			  <div class="iconlist green">
				  <div>
					  <img src="../../assets/images/index_ico1.png" alt="" class="img" />
					  充幣
				  </div>
				  <div>
					  <img src="../../assets/images/index_ico1.png" alt="" class="img" />
					  充幣
				  </div>
				  <div>
					  <img src="../../assets/images/index_ico1.png" alt="" class="img" />
					  充幣
				  </div>
			  </div>
		  </div>
		  
		  <div class="setlist">
			  <div :class="item == 1 ? 'item curitem' : 'item'" v-for='item in 5' :key='item'>
				  <img class="icon" src="../../assets/images/lm_1.png" />
				  123
			  </div>
		  </div>
	  </div>
	  <div class="set">
		  <img  src="../../assets/images/set.png" />设定
	  </div>
	</Drawer>
	<!--左侧抽屉 结束-->
  </div>
</template>

<style scoped lang="scss">
.set{
	position: absolute;
	bottom: 0;
	left: 0%;
	width: 100%;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 1px solid #3a495c;
	height: 55px;
	font-weight: 700;
	font-size: 13px;
	line-height: 55px;
	img{
		margin-right: 10px;
		width: 18px;
		height: 16px;
	}
}
.setlist{
	.curitem{
		background: #284b64;
		border-left: 5px solid #2a6e75;
	}
	margin-top: 70px;
	.item{
		display: flex;
		height: 50px;
		line-height: 50px;
		align-items: center;
		padding: 0 15px;
		img{
			width: 15px;
			margin-right: 10px;
			height: 12px;
		}
	}
}
.user-info{
	    width: 229px;
	    height: 119px;
	    margin: 43px auto 0; 
	    background: url('../../assets/images/bg_dar.png') no-repeat left bottom;
		background-size: 100%;
		.user-img{
			position: relative;
			top: -30px;
			width: 83px;
			height: 83px;
			left: 50%;
			margin-left: -41.5px;
			display: block;
		}
		.u-avatar{
			text-align: center;
			font-size: 13px;
			color: #909399;
			margin-bottom: 5px;
			position: relative;
			top: -20px;
		}
		.iconlist{
			display: flex;
			padding: 0 5px;
			justify-content: space-between;
			div{
				text-align:center;
				.img{
					width: 30px;
					height: 25px;
					display: block;
					margin:5px auto;
					
				}
			}
			
		}
}
.page-content{
	background-color: #1B2C42;
	padding:64px 16px 0;
	box-sizing: border-box;
}
.Sticky_top{
	z-index: 88;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	height: 44px;
	align-items: center;
	background-color: #2a405c;
	padding:0 16px;
	box-sizing: border-box;
	img{
		width: 27px;
		height: 27px;
	}
	.name{
		font-family: DIN-Regular-2;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 4px;
		color: #e2e8e4;
	}
}
.page-index{
  width:100%;
  padding-bottom: 50px;
  // padding-top: 50px;
  padding-top: 0px;
  #page1 {
    height: 200px;
    margin: 0 0 2% 0;
    // margin: 2% 0;
	.swiper-slide{
		border-radius: 5px;
		overflow: hidden;
	}

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
	background-color: #2a405c;
	color: #768da9;
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
	.quick-withdraw-title{
		padding: 2px;
	}
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
          width: 48%;
          border-radius: 10px;
		  background: #2a405c;
		  box-shadow: 0 11px 11px 0 rgba(10,16,23,.4);
		  color: #768da9;
          padding: 2%;
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
          width: 48%;
		  background: #2a405c;
		  box-shadow: 0 11px 11px 0 rgba(10,16,23,.4);
		  color: #768da9;
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
        margin-top: 5px;
        padding-top: 5px;
    }
    .help-notice>div {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
		color:#fff;
        padding: 2%;
        font-size: 14px;
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
      justify-content:center;
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
    background-color: #2a405c;
	color: #768da9;
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
          color:#2de2b4;
          margin: 10px 0;
          // color: rgb(130, 142, 161);
        }
        .pagetrend-lastest-price {
            color: rgb(130, 142, 161);
            .lastest-price {
                font-size: 16px;
                background:-webkit-linear-gradient(left,#828ea1,#4c5563 25%,#2de2b4 50%,#4c5563 75%,#2de2b4);
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
    margin: 2% 0;
    padding: 0 2%;
    .coin-content{
      display: flex;
      flex-direction: column;
      .coin-title {
          font-size: 18px;
          font-weight: bold;
		  align-items: center;
		  display: flex;
		  justify-content:center;
          color: #2de2b4;
          margin: 10px 0;
		  .marketTrend{
			  padding: 0 5px;
		  }
		  img{
			      height: 4px;
			      width: 57px;
		  }
      }
      .coin-list {
        .coin-item:last-child {
          border-bottom: none !important;
        }
		.tips{
			display: flex;
			justify-content: space-between;
			margin-bottom: 5px;
			div{
				color:#768da9;
				background-color: #2a405c;
				padding: 1px 31px;
				border-radius: 11px;
			}
		}
        .coin-item {
		  font-family: DIN-Regular-2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
		  font-weight: 700;
          font-size: 14px;
		  color:#768da9;
          .coin-name {
            width: 90px;
			span{
				color:#2de2b4;
			}
          }
          .coin-last-price{
            width: 100px;
            text-align: left;
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
	  userControl:false,
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
		  e.symbolfrist = e.symbol.split("/")[0]
		  e.symbollast = e.symbol.split("/")[1]
          if(e.symbol==resp.symbol){
            e.chg = resp.chg;
            e.close = resp.close;
          }
		  return e
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