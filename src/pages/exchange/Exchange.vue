<template>
  <div class="page-home">
    <div class="page-content">
      <div class="page-exchange">
        <div class="page-exchange-title">
          <span>
            <img src="@/assets/img/lines.png" @click="goToExchangeCoinPage()">
          </span>
          <span>{{currentCoin.coin}}<small>/{{currentCoin.base}}</small></span>
          <span>
            <img src="@/assets/img/K-line.png" @click="goToExchangeKlinePage()">
          </span>
        </div>
        <div class="page-exchange-main">
          <div class="page-exchange-buysell">
            <div class="page-exchange-buysell-title">
              <span @click="chooseTransactionType(item.type)" :class="{'buy':(currentTransactionType==item.type && index==0),'sell':(currentTransactionType==item.type && index==1)}" v-for="(item, index) in transactionTypeList" :key="index">
                {{item.name}}
              </span>
            </div>
            <div class="bd">
                <Form ref="formValidate" label-position="top">
                  <FormItem :label="$t('common.transactionmode')">
                    <RadioGroup v-model="transactionMode">
                        <Radio label="limit">{{$t("exchange.limited_price")}}</Radio>
                        <Radio label="market">{{$t("exchange.market_price")}}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- limit price buy and sell start -->
                  <FormItem :label="$t('exchange.buyprice')" v-if="transactionMode=='limit' && currentTransactionType=='buy'">
                    <InputNumber style="width: 140px;" v-model="form.buy.limitPrice" :placeholder="$t('exchange.buyprice')"></InputNumber>
                    <label class="after">{{currentCoin.base}}</label>
                  </FormItem>
                  <FormItem :label="$t('exchange.sellprice')" v-if="transactionMode=='limit' && currentTransactionType=='sell'">
                    <InputNumber style="width: 140px;" v-model="form.sell.limitPrice" :placeholder="$t('exchange.sellprice')"></InputNumber>
                    <label class="after">{{currentCoin.base}}</label>
                  </FormItem>
                  <FormItem :label="$t('exchange.buynum')" v-if="transactionMode=='limit' && currentTransactionType=='buy'">
                    <InputNumber style="width: 140px;" v-model="form.buy.limitAmount" :placeholder="$t('exchange.buynum')"></InputNumber>
                    <label class="after">{{currentCoin.coin}}</label>
                  </FormItem>
                  <FormItem :label="$t('exchange.sellnum')" v-if="transactionMode=='limit' && currentTransactionType=='sell'">
                    <InputNumber style="width: 140px;" v-model="form.sell.limitAmount" :placeholder="$t('exchange.sellnum')"></InputNumber>
                    <label class="after">{{currentCoin.coin}}</label>
                  </FormItem>
                  <FormItem class="bd-radio" v-if="transactionMode=='limit'&& currentTransactionType=='buy'">
                      <RadioGroup size="small" v-model="sliderBuyLimitPercent" type="button" >
                        <Radio :label=0>0%</Radio>
                        <Radio :label=25>25%</Radio>
                        <Radio :label=50>50%</Radio>
                        <Radio :label=75>75%</Radio>
                        <Radio :label=100>100%</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem class="bd-radio" v-if="transactionMode=='limit'&& currentTransactionType=='sell'">
                      <RadioGroup size="small" v-model="sliderSellLimitPercent" type="button" >
                        <Radio :label=0>0%</Radio>
                        <Radio :label=25>25%</Radio>
                        <Radio :label=50>50%</Radio>
                        <Radio :label=75>75%</Radio>
                        <Radio :label=100>100%</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('exchange.amount')" v-if="transactionMode=='limit'&& currentTransactionType=='buy'">
                    <span>{{form.buy.limitTurnover|toFloor(baseCoinScale)}}</span> &nbsp;{{currentCoin.base}}
                  </FormItem>
                   <FormItem :label="$t('exchange.amount')" v-if="transactionMode=='limit'&& currentTransactionType=='sell'">
                    <span>{{form.sell.limitTurnover|toFloor(baseCoinScale)}}</span> &nbsp;{{currentCoin.base}}
                  </FormItem>

                  <!-- limit price buy and sell end -->

                  <!-- market price buy and sell start -->

                   <FormItem :label="$t('exchange.buyprice')" v-if="transactionMode=='market'&& currentTransactionType=='buy'">
                    <Input style="width: 140px;" disabled :placeholder="$t('exchange.buytip')"></Input>
                    <label class="after">{{currentCoin.base}}</label>
                  </FormItem>
                  <FormItem :label="$t('exchange.buynum')" v-if="transactionMode=='market'&& currentTransactionType=='buy'">
                    <InputNumber style="width: 140px;" v-model="form.buy.marketAmount" :placeholder="$t('exchange.buynum')"></InputNumber>
                    <label class="after">{{currentCoin.base}}</label>
                  </FormItem>
                  <FormItem class="bd-radio" v-if="transactionMode=='market'&& currentTransactionType=='buy'">
                      <RadioGroup size="small" v-model="sliderBuyMarketPercent" type="button" >
                        <Radio :label=0>0%</Radio>
                        <Radio :label=25>25%</Radio>
                        <Radio :label=50>50%</Radio>
                        <Radio :label=75>75%</Radio>
                        <Radio :label=100>100%</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('exchange.sellprice')" v-if="transactionMode=='market'&& currentTransactionType=='sell'">
                    <Input style="width: 140px;" disabled :placeholder="$t('exchange.selltip')"></Input>
                    <label class="after">{{currentCoin.base}}</label>
                  </FormItem>
                  <FormItem :label="$t('exchange.sellnum')" v-if="transactionMode=='market'&& currentTransactionType=='sell'">
                    <InputNumber style="width: 140px;" v-model="form.sell.marketAmount" :placeholder="$t('exchange.sellnum')"></InputNumber>
                    <label class="after">{{currentCoin.coin}}</label>
                  </FormItem>
                  <FormItem class="bd-radio" v-if="transactionMode=='market'&& currentTransactionType=='sell'">
                      <RadioGroup size="small" v-model="sliderSellMarketPercent" type="button" >
                        <Radio :label=0>0%</Radio>
                        <Radio :label=25>25%</Radio>
                        <Radio :label=50>50%</Radio>
                        <Radio :label=75>75%</Radio>
                        <Radio :label=100>100%</Radio>
                      </RadioGroup>
                  </FormItem>

                  <!-- market price buy and sell end -->

                  <FormItem :label="$t('exchange.canuse')" v-if="currentTransactionType == 'buy'">
                    <span>{{wallet.base|toFloor(baseCoinScale)}}</span>
                    <span>{{currentCoin.base}}</span>
                  </FormItem>
                  <FormItem :label="$t('exchange.canuse')" v-else>
                    <span>{{wallet.coin|toFloor(coinScale)}}</span>
                    <span>{{currentCoin.coin}}</span>
                  </FormItem>

                  <FormItem>
                    <Button @click="submitWithPrice" v-if="currentTransactionType == 'buy' && isLogin" class="bg-green" >{{$t("exchange.buyin")}} ({{currentCoin.coin}})</Button>
                    <Button @click="submitWithPrice" v-if="currentTransactionType == 'sell' && isLogin" class="bg-red" >{{$t("exchange.sellout")}} ({{currentCoin.coin}})</Button>
                    <Button @click="login" class="bg-gray" v-if="!isLogin">{{$t("common.login")}}</Button>
                  </FormItem>
                </Form>
            </div>
          </div>
          <ExchangePlate @handlePlate="handlePlate" :currentCoin="currentCoin"></ExchangePlate>
        </div>
        <ExchangeOrder :currentCoin="currentCoin" :stompClient="stompClient"></ExchangeOrder>
      </div>
    </div>
    <PageFooter curindex='exchange'></PageFooter>
    <ExchangeKlineCom></ExchangeKlineCom>
    <!-- <div class="page-kline"></div> -->
  </div>
</template>

<script>
import Datafeeds from "@js/charting_library/datafeed/bitrade.js";
let Stomp = require("stompjs");
let SockJS = require("sockjs-client");
let moment = require("moment-timezone");
import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';
import ExchangePlate from '@/components/exchange/ExchangePlate.vue';
import ExchangeKlineCom from '@/components/exchange/ExchangeKlineCom.vue';
import ExchangeOrder from './ExchangeOrder.vue';

export default {
  components: {PageHeader, PageFooter, ExchangePlate,ExchangeKlineCom, ExchangeOrder},
  data() {
    let self = this;
    return {
      stompClient:null,
      transactionTypeList:[{name:"BUY",type:'buy'}, {name:"SELL",type:'sell'}],
      currentTransactionType:'buy',
      
      sliderBuyLimitPercent: 0,
      sliderSellLimitPercent: 0,
      sliderBuyMarketPercent: 0,
      sliderSellMarketPercent: 0,

      defaultPath: "btc_usdt",
      basecion: "usdt",
      robotType:"0",
      coinScale: 6,
      baseCoinScale: 6,
      symbolFee: 0.001,

      collecRequesting: false,
      currentCoinIsFavor: false,

      enableMarketBuy: 1, // 0:禁用  1:启用
      enableMarketSell: 1,
      exchangeable: 1, // 0:可交易   1:不可交易

      selectedPlate: "all", //当前显示的买卖盘

      //当前市场上的交易币种，按交易对分
      coins: {
        _map: [],
        USDT: [],
        BTC: [],
        ETH: [],
        USDT2: [],
        BTC2: [],
        ETH2: [],
        favor: [],
      },
      wallet: {
        base: 0.0,
        coin: 0.0
      },
      //最新价的 table 数据;
      plate: {
        maxPostion: 10,
        columns: [],
        askRows: [],
        bidRows: []
      },

      skin: "night", //皮肤样式day&night

      publishType: "NONE",
      currentTime: 0,
      publishAmount: 0,
      publishPrice: 0,
      startTime: "2000-01-01 00:00:00",
      endTime: "2000-01-01 00:00:00",
      clearTime: "2000-01-01 00:00:00",
      showPublish: false,
      showCountDown: false,
      countDownBgColor: "linear-gradient(135deg, rgb(0 199 144 / 63%) 10%, rgb(18 33 41) 100%)",
      publishState: 0,

      currentCoin: {
        base: "",
        coin: "",
        symbol: "",
        baseCoinScale:6,
        coinScale:6,
      },
      transactionMode:"limit",
      form: {
        buy: {
          limitPrice: 0.0,
          limitAmount: 0.0,
          marketAmount: 0.0,
          limitTurnover: 0.0
        },
        sell: {
          limitPrice: 0.0,
          limitAmount: 0.0,
          marketAmount: 0.0,
          limitTurnover: 0.0
        }
      },
    };
  },
  filters: {
  },
  computed: {
    rechargeUSDTUrl: function() {
      return "/uc/recharge?name="+this.currentCoin.base;
      // return "#/finance/recharge?name=" + this.currentCoin.base;
    },
    rechargeCoinUrl: function() {
      return "/uc/recharge?name=" + this.currentCoin.coin;
      // return "#/finance/recharge?name=" + this.currentCoin.coin;
    },
    isLogin: function() {
      return this.$store.getters.isLogin;
    },
    member: function() {
      return this.$store.getters.member;
    },
    lang: function() {
      return this.$store.state.lang;
    },
  },
  watch: {
    "form.buy.limitPrice": function(val) {
      if(!val) val = 0;
      let price = this.form.buy.limitPrice, account = this.wallet.base, amount = 0;
      if (val > 0) {
        amount = this.toFloor(account.div(price).mul(this.sliderBuyLimitPercent).mul(0.01),this.coinScale);
      }
      this.form.buy.limitAmount = parseFloat(amount);
      this.form.buy.limitTurnover = this.toFloor(val.mul(amount),this.baseCoinScale);
    },
    "form.buy.limitAmount": function(val) {
      let price = this.form.buy.limitPrice;
      if(!price) price = 0;
      if(!val) val = 0;
      this.form.buy.limitTurnover = this.toFloor(val.mul(price),this.baseCoinScale);
    },
    "form.sell.limitPrice": function(val) {
      let amount = this.form.sell.limitAmount;
      if(!amount) amount = 0;
      if(!val) val = 0;
      this.form.sell.limitTurnover = this.toFloor(val.mul(amount),this.coinScale);
    },
    "form.sell.limitAmount": function(val) {
      let price = this.form.sell.limitPrice;
      if(!price) price = 0;
      if(!val) val = 0;
      this.form.sell.limitTurnover = this.toFloor(val.mul(price),this.coinScale);
    },
    sliderBuyLimitPercent() {
      let price = this.form.buy.limitPrice, account = this.wallet.base, amount = 0;
      if(price > 0) {
        amount = this.toFloor(account.div(price).mul(this.sliderBuyLimitPercent).mul(0.01),this.coinScale);
      }
      this.form.buy.limitAmount = parseFloat(amount);
    },
    sliderBuyMarketPercent() {
      let account = this.wallet.base;
      this.form.buy.marketAmount = parseFloat(this.toFloor(account.mul(this.sliderBuyMarketPercent).mul(0.01), this.baseCoinScale));
    },
    sliderSellLimitPercent() {
      let account = this.wallet.coin;
      this.form.sell.limitAmount = parseFloat(this.toFloor(account.mul(this.sliderSellLimitPercent).mul(0.01), this.coinScale));
    },
    sliderSellMarketPercent() {
      let account = this.wallet.coin;
      this.form.sell.marketAmount = parseFloat(this.toFloor(account.mul(this.sliderSellMarketPercent).mul(0.01),this.coinScale));
    },
    lang: function() {
      this.updateLangData();
    },
    $route(to, from) {
      this.init();
    },
  },
  created: function() {
    this.init();
  },
  methods: {
    init(){
      let params = this.$route.params.pair;
      if (params == undefined || params == 'undefined') {
        params = this.defaultPath;
        this.$router.push("/exchange/" + this.defaultPath);
      }
      const basecion = params.split("_")[1];
      if (basecion) {
        this.basecion = basecion;
      }
      let coin = params.toUpperCase().split("_")[0];
      let base = params.toUpperCase().split("_")[1];
      this.currentCoin.symbol = coin + "/" + base;
      this.currentCoin.coin = coin;
      this.currentCoin.base = base;
      this.getSymbolScale();
      this.getSymbol(); //包含 K线图、getFavor、startWebsock等
      this.getPlate(); //买卖盘
      if (this.isLogin) {
        this.refreshAccount();
      }
      this.sliderBuyLimitPercent = 0;
      this.sliderSellLimitPercent = 0;
      this.sliderBuyMarketPercent = 0;
      this.sliderSellMarketPercent = 0;
    },
    chooseTransactionType(type){
      this.currentTransactionType = type;
    },
    silderGo(val){
      console.log(val);
    },
    getSymbolScale() {
      //获取精度
      this.robotType = '0';
      this.$http.post(this.host + this.api.market.symbolInfo, {symbol: this.currentCoin.symbol}).then(response => {
        let resp = response.body;
        if (resp != null) {
          this.currentCoin.coinScale = resp.coinScale;
          this.currentCoin.baseCoinScale = resp.baseCoinScale;

          this.robotType = resp.robotType+'';

          this.baseCoinScale = resp.baseCoinScale;
          this.coinScale = resp.coinScale;
          this.symbolFee = resp.fee;

          this.enableMarketBuy = resp.enableMarketBuy;
          this.enableMarketSell = resp.enableMarketSell;
          this.exchangeable = resp.exchangeable;


          this.publishType = resp.publishType;
          this.startTime = resp.startTime;
          this.endTime = resp.endTime;
          this.clearTime = resp.clearTime;
          this.currentTime = parseInt(resp.currentTime/1000);
          this.publishAmount = resp.publishAmount;
          this.publishPrice = resp.publishPrice;

          var temCurT = moment(resp.currentTime).format("YYYY-MM-DD HH:mm:ss");
          if(temCurT < this.clearTime) {
            if(this.publishType == "QIANGGOU" || this.publishType == "FENTAN"){
              this.showPublish = true;
              this.showCountDown = true;
            }else{
              this.showPublish = false;
              this.showCountDown = false;
            }
          }else{
            this.showPublish = false;
            this.showCountDown = false;
          }
        }
      });
    },
    getSymbol() {
      this.$http.post(this.host + this.api.market.thumb, {}).then(response => {
        let resp = response.body;
        this.coins._map = [];
        this.coins.favor = [];
        for (let i = 0; i < resp.length; i++) {
          let coin = resp[i];
          coin.coin = resp[i].symbol.split("/")[0];
          coin.base = resp[i].symbol.split("/")[1];
          coin.price = resp[i].close = resp[i].close.toFixed(resp[i].baseCoinScale);
          coin.rose = resp[i].chg > 0 ? "+" + (resp[i].chg * 100).toFixed(2) + "%" : (resp[i].chg * 100).toFixed(2) + "%";
          coin.href = (coin.coin + "_" + coin.base).toLowerCase();
          coin.isFavor = false;
          this.coins._map[coin.symbol] = coin;
          if(coin.zone == 0){
            this.coins[coin.base].push(coin);
          }else{
            this.coins[coin.base + "2"].push(coin);
          }
          if (coin.symbol == this.currentCoin.symbol) {
            this.currentCoin = coin;
            this.form.buy.limitPrice = this.form.sell.limitPrice = parseFloat(coin.price);
          }
        }

        this.startWebsock();
        this.changeBaseCion(this.basecion);
      });
    },
    changeBaseCion(str) {
      this.basecion = str;
      if(str == "usdt"){
        this.dataIndex = this.coins.USDT;
        this.dataIndex2 = this.coins.USDT2;
      }else if(str == "btc"){
        this.dataIndex = this.coins.BTC;
        this.dataIndex2 = this.coins.BTC2;
      }else if(str == "eth"){
        this.dataIndex = this.coins.ETH;
        this.dataIndex2 = this.coins.ETH2;
      }else if(str == "favor"){
        this.dataIndex = this.coins.favor;
      }
    },
    startWebsock() {
      if (this.stompClient) {
        this.stompClient.ws.close();
      }
      var stompClient = null;
      var that = this;
      var socket = new SockJS(that.wssHost + that.api.market.ws);
      stompClient = Stomp.over(socket);
      this.stompClient = stompClient;
      stompClient.debug = false;
      stompClient.connect({}, function(frame) {
        //订阅价格变化消息
        stompClient.subscribe("/topic/market/thumb", function(msg) {
          var resp = JSON.parse(msg.body);
          var coin = that.getCoin(resp.symbol);
          if (coin != null) {
            // coin.price = resp.close.toFixed(2);
            coin.price = resp.close;
            coin.rose = resp.chg > 0 ? "+" + (resp.chg * 100).toFixed(2) + "%" : (resp.chg * 100).toFixed(2) + "%";
            // coin.close = resp.close.toFixed(2);
            // coin.high = resp.high.toFixed(2);
            // coin.low = resp.low.toFixed(2);
            coin.close = resp.close;
            coin.high = resp.high;
            coin.low = resp.low;
            coin.turnover = parseInt(resp.volume);
            coin.volume = resp.volume;
            coin.usdRate = resp.usdRate;
          }
        });
        //订阅盘口消息
        stompClient.subscribe("/topic/market/trade-plate/" + that.currentCoin.symbol,
          function(msg) {
            var resp = JSON.parse(msg.body);
            if (resp.direction == "SELL") {
              var asks = resp.items;
              that.plate.askRows = [];
              let totle = 0;
              for (var i = that.plate.maxPostion - 1; i >= 0; i--) {
                var ask = {};
                if (i < asks.length) {
                  ask = asks[i];
                } else {
                  ask["price"] = 0;
                  ask["amount"] = 0;
                }
                ask.direction = "SELL";
                ask.position = i + 1;
                that.plate.askRows.push(ask);
              }
              for (var i = that.plate.askRows.length - 1; i >= 0; i--) {
                if (i == that.plate.askRows.length - 1 || that.plate.askRows[i].price == 0) {
                  that.plate.askRows[i].totalAmount = that.plate.askRows[i].amount;
                } else {
                  that.plate.askRows[i].totalAmount = that.plate.askRows[i + 1].totalAmount + that.plate.askRows[i].amount;
                }
                totle += that.plate.askRows[i].amount;
              }
              that.plate.askTotle = totle;
            } else {
              var bids = resp.items;
              that.plate.bidRows = [];
              let totle = 0;
              for (var i = 0; i < that.plate.maxPostion; i++) {
                var bid = {};
                if (i < bids.length) {
                  bid = bids[i];
                } else {
                  bid["price"] = 0;
                  bid["amount"] = 0;
                }
                bid.direction = "BUY";
                bid.position = i + 1;
                that.plate.bidRows.push(bid);
              }
              for (var i = 0; i < that.plate.bidRows.length; i++) {
                if (i == 0 || that.plate.bidRows[i].amount == 0) {
                  that.plate.bidRows[i].totalAmount = that.plate.bidRows[i].amount;
                } else {
                  that.plate.bidRows[i].totalAmount = that.plate.bidRows[i - 1].totalAmount + that.plate.bidRows[i].amount;
                }
                totle += that.plate.bidRows[i].amount;
              }
              that.plate.bidTotle = totle;
            }
          }
        );
      });
    },
    getPlate(str="") {
      //买卖盘
      var params = {};
      params["symbol"] = this.currentCoin.symbol;
      this.$http.post(this.host + this.api.market.platemini, params).then(response => {
          this.plate.askRows = [];
          this.plate.bidRows = [];
          let resp = response.body;
          if (resp.ask && resp.ask.items) {
            for (var i = 0; i < resp.ask.items.length; i++) {
              if (i == 0) {
                resp.ask.items[i].totalAmount = resp.ask.items[i].amount;
              } else {
                resp.ask.items[i].totalAmount =
                  resp.ask.items[i - 1].totalAmount + resp.ask.items[i].amount;
              }
            }
            if (resp.ask.items.length >= this.plate.maxPostion) {
              for (var i = this.plate.maxPostion; i > 0; i--) {
                var ask = resp.ask.items[i - 1];
                ask.direction = "SELL";
                ask.position = i;
                this.plate.askRows.push(ask);
              }
              const rows = this.plate.askRows, len = rows.length, totle = rows[0].totalAmount;
              this.plate.askTotle = totle;
            } else {
              for (var i = this.plate.maxPostion; i > resp.ask.items.length; i--) {
                var ask = { price: 0, amount: 0 };
                ask.direction = "SELL";
                ask.position = i;
                ask.totalAmount = ask.amount;
                this.plate.askRows.push(ask);
              }
              for (var i = resp.ask.items.length; i > 0; i--) {
                var ask = resp.ask.items[i - 1];
                ask.direction = "SELL";
                ask.position = i;
                this.plate.askRows.push(ask);
              }
              var askItemIndex = (resp.ask.items.length - 1) > 0 ? (resp.ask.items.length - 1) : 0;
              const rows = this.plate.askRows, len = rows.length, totle = rows[askItemIndex].totalAmount;
              this.plate.askTotle = totle;
            }
          }
          if (resp.bid && resp.bid.items) {
            for (var i = 0; i < resp.bid.items.length; i++) {
              if (i == 0)
                resp.bid.items[i].totalAmount = resp.bid.items[i].amount;
              else
                resp.bid.items[i].totalAmount = resp.bid.items[i - 1].totalAmount + resp.bid.items[i].amount;
            }
            for (var i = 0; i < resp.bid.items.length; i++) {
              var bid = resp.bid.items[i];
              bid.direction = "BUY";
              bid.position = i + 1;
              this.plate.bidRows.push(bid);
              if (i == this.plate.maxPostion - 1) break;
            }
            if (resp.bid.items.length < this.plate.maxPostion) {
              for (var i = resp.bid.items.length; i < this.plate.maxPostion; i++) {
                var bid = { price: 0, amount: 0 };
                bid.direction = "BUY";
                bid.position = i + 1;
                bid.totalAmount = 0;
                this.plate.bidRows.push(bid);
              }
              var bidItemIndex = (resp.bid.items.length - 1) > 0 ? (resp.bid.items.length - 1) : 0;
              const rows = this.plate.bidRows, len = rows.length, totle = rows[bidItemIndex].totalAmount;
              this.plate.bidTotle = totle;
            } else {
              const rows = this.plate.bidRows, len = rows.length, totle = rows[len - 1].totalAmount;
              this.plate.bidTotle = totle;
            }
          }
          if(str!=""){
            this.selectedPlate = str;
          }
      });
    },
    refreshAccount: function() {
      this.getWallet(); //账户资产信息
    },
    /**
     * 获取钱包信息
     */
    getWallet() {
      this.$http
        .post(this.host + this.api.uc.wallet + this.currentCoin.base, {})
        .then(response => {
          var resp = response.body;
          this.wallet.base = resp.data.balance || "";
          console.log("wallet.base", this.wallet);
        });
      this.$http
        .post(this.host + this.api.uc.wallet + this.currentCoin.coin, {})
        .then(response => {
          var resp = response.body;
          this.wallet.coin = resp.data.balance;
          console.log("wallet.coin", this.wallet);
        });
    },
    getCoin(symbol) {
      return this.coins._map[symbol];
    },
    updateLangData() {
    },
    submitWithPrice() {
      let params = {};
      if(this.transactionMode=='limit'){
        if(this.currentTransactionType=='buy'){
          if(!this.form.buy.limitPrice) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.pricetip")
            });
            return;
          }
          if(!this.form.buy.limitAmount) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.buyamounttip")
            });
            return;
          }
          let maxAmount = parseFloat(this.form.buy.limitAmount) * parseFloat(this.form.buy.limitPrice);
          if (maxAmount > this.wallet.base) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.buyamounttipwarning") + this.toFloor(this.wallet.base, this.baseCoinScale)
            });
            return;
          }
          params["price"] = this.form.buy.limitPrice;
          params["amount"] = this.form.buy.limitAmount;
          params["direction"] = "BUY";
          params["type"] = "LIMIT_PRICE";
        }else{
          if (!this.form.sell.limitPrice) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.sellpricetip")
            });
            return;
          }
          if (!this.form.sell.limitAmount) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.sellamounttip")
            });
            return;
          }
          if (this.form.sell.limitAmount > parseFloat(this.wallet.coin)) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.sellamounttipwarning") + this.wallet.coin
            });
            return;
          }
          params["price"] = this.form.sell.limitPrice;
          params["amount"] = this.form.sell.limitAmount;
          params["direction"] = "SELL";
          params["type"] = "LIMIT_PRICE";
        }
      }else{
        if(this.currentTransactionType=='buy'){
          if (!this.form.buy.marketAmount) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.buyamounttip")
            });
            return;
          }
          if (this.form.buy.marketAmount > parseFloat(this.wallet.base)) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.buyamounttipwarning") + this.wallet.base
            });
            return;
          }
          params["price"] = 0;
          params["amount"] = this.form.buy.marketAmount;
          params["direction"] = "BUY";
          params["type"] = "MARKET_PRICE";
        }else{
          if (!this.form.sell.marketAmount) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.sellamounttip")
            });
            return;
          }
          if (this.form.sell.marketAmount > parseFloat(this.wallet.coin)) {
            this.$Notice.error({
              title: this.$t("exchange.tip"),
              desc: this.$t("exchange.sellamounttipwarning") + this.wallet.coin
              // desc: "最多能卖" + this.wallet.coin + "个"
            });
            return;
          }
          params["price"] = 0;
          params["amount"] = this.form.sell.marketAmount;
          params["direction"] = "SELL";
          params["type"] = "MARKET_PRICE";
        }
      }

      var that = this;
      params["symbol"] = this.currentCoin.symbol;
      // params["useDiscount"] = "0"; //是否试用手续费抵扣,0 不使用 1使用
      this.$http.post(this.host + this.api.exchange.orderAdd, params).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          this.$Notice.success({
            title: that.$t("exchange.tip"),
            desc: that.$t("exchange.success")
          });
          this.refreshAccount();
          this.form.buy.limitAmount = 0;
          this.form.sell.limitAmount = 0;

          this.form.buy.marketAmount = 0;
          this.form.sell.marketAmount = 0;

          this.sliderBuyLimitPercent = 0;
          this.sliderSellLimitPercent = 0;
          this.sliderBuyMarketPercent = 0;
          this.sliderSellMarketPercent = 0;
        } else {
          this.$Notice.error({
            title: that.$t("exchange.tip"),
            desc: resp.message
          });
        }
      });
    },
    goToExchangeCoinPage(){
      this.$router.push("/exchangeCoins/exchange");
    },
    goToExchangeKlinePage(){
      // let params = this.$route.params.pair;
      // this.$router.push({
      //   name: 'ExchangeKlinePair',
      //   params: {pair: params, type:'exchange'}
      // });
      // this.$router.push("/exchangeKline/"+params+"/exchange");
      // this.isShow=true;
      this.$store.commit("showKline", true);
    },
    login(){
      this.$router.push("/login");
    },
    handlePlate(type, currentRow){
      if(type=='buy'){
        this.form.buy.limitPrice = currentRow.price;
        this.form.sell.limitPrice = currentRow.price;
      }else{
        this.form.buy.limitPrice = currentRow.price;
        this.form.sell.limitPrice = currentRow.price;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-exchange{
  width:100%;
  padding-bottom: 50px;
  // padding-top: 30px;
  .page-exchange-title {
      padding: 2%;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      // margin: 2% 0 0 0;
      margin: 0 0 2% 0;
      font-size: 18px;
      font-weight: bold;
      
      span{
        display: inline-flex;
      }
      img{
        height:32px;
        width:32px;
      }
  }
  .page-exchange-main {
    display: flex;
    background-color: #fff;
    // margin: 1% 0 0 0;
    padding: 2%;
    >div{
      width: 50%;
    }
    .page-exchange-buysell{
      .page-exchange-buysell-title {
        height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        .buy {
          color: #00b275;
        }
        .sell {
            color: #f15057;
        }
      }
      .bd {
        margin-top: 2%;
        
        .bg-red {
          background-color: #f15057;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          width: 100%;
        }
        .bg-green {
          background-color: #00b275;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          width: 100%;
        }
        .bg-gray {
          background-color: gray;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          width: 100%;
        }
        /deep/ .ivu-form-item{
          margin-bottom: 12px;
        }
        /deep/ .ivu-radio-wrapper {
          font-size: 12px !important;
        }
        /deep/ label.ivu-form-item-label{
          font-weight: 600;
          font-size: 13px !important;
        }
        .bd-radio{
          /deep/ label.ivu-radio-wrapper.ivu-radio-group-item.ivu-radio-default:before {
              content: unset !important;
          }
          /deep/ label.ivu-radio-wrapper.ivu-radio-group-item.ivu-radio-default:after {
              content: unset !important;
          }
          /deep/ .ivu-radio-wrapper-checked:hover {
              border: none;
          }
          /deep/ .ivu-radio-wrapper-checked {
              background: #f0a70a;
              color: #fff;
              border: none;
              box-shadow:none;
          }
          /deep/ .ivu-radio-wrapper {
              height: 30px;
              padding: 0px 0px;
              width: 34px;
              text-align: center;
              line-height: 30px;
          }
        }
        .total_amount {
          // display: flex;
          // justify-content: space-between;
          font-size: 14px;
          padding: 2% 2% 2% 0;
          span {
            margin: 0 5px 0 0;
          }
        }
      }
    }
  }
  .page-myorder-list {
    margin: 0;
  }
}
</style>
