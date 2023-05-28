<template>
  <div class="page-kline-list">
    <PageHeader :title="currentCoin.symbol+' Kline'"></PageHeader> 
    <div class="page-content">
      <div class="page-kline-main">
        <div class="symbol">
          <div class="symbol-item">
            <div class="item star" @click="currentCoinFavorChange">
              <Icon v-if="currentCoinIsFavor" type="ios-star" color="#f0a70a" size="24" />
              <Icon v-else type="ios-star-outline" color="#f0a70a" size="24" />
              <span class="coin">{{currentCoin.coin}}<small>/{{currentCoin.base}}</small></span>
            </div>
            <div class="item latestprice">
              <span class="num" :class="{buy:currentCoin.change>0,sell:currentCoin.change<0}">{{currentCoin.close | toFixed(currentCoin.baseCoinScale)}}</span>
              <span class="change" :class="{buy:currentCoin.change>0,sell:currentCoin.change<0}">{{currentCoin.rose}}</span>
            </div>
          </div>
          <div class="symbol-item">
            <div class="item">
              <span class="text">{{$t('service.OpenPrice')}}</span>
              <span class="num ">{{currentCoin.open | toFixed(currentCoin.baseCoinScale)}}</span>
            </div>
            <div class="item">
              <span class="text">{{$t('service.ExchangeNum')}}</span>
              <span class="num ">{{currentCoin.volume}} {{currentCoin.coin}}</span>
            </div>
          </div>
          <div class="symbol-item">
            <div class="item">
              <span class="text">{{$t('service.high')}}</span>
              <span class="num ">{{currentCoin.high | toFixed(currentCoin.baseCoinScale)}}</span>
            </div>
            <div class="item">
              <span class="text">{{$t('service.low')}}</span>
              <span class="num ">{{currentCoin.low | toFixed(currentCoin.baseCoinScale)}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="handler">
          <span @click="changeImgTable('k')" :class="{active:currentImgTable==='k'}">{{$t("exchange.kline")}}</span>
          <span @click="changeImgTable('s')" :class="{active:currentImgTable==='s'}">{{$t("exchange.depth")}}</span>
          <span @click="changeImgTable('m')" :class="{active:currentImgTable==='m'}">{{$t("common.realTime")}}</span>
        </div> -->
        <div class="imgtable">
          <div id="kline_container"></div>
          <!-- <div id="kline_container" :class="{hiddenkline:currentImgTable!=='k'}"></div> -->
          <!-- <DepthGraph ref="depthGraph" :class="{hiddenkline:currentImgTable!=='s'}" ></DepthGraph> -->
          <!-- <Table id="plate" :class="{hiddenkline:currentImgTable!=='m'}" :no-data-text="$t('common.nodata')" :columns="trade.columns" :data="trade.rows"></Table> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page-kline-list{
  .page-kline-main{
    width:100%;
    padding-top: 80px;
    .symbol {
      padding: 2%;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item.star {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .coin {
            font-size: 18px;
            font-weight: 600;
        }
      }
      .item.latestprice{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        .num {
          font-size: 16px;
        }
        .buy {
            color: #00b275!important;
        }
        .sell {
            color: #f15057!important;
        }
        .change {
          font-size: 14px;
        }
      }
      .symbol-item:first-child{
        width: 34%;
      }
      .symbol-item:nth-child(2){
        .item{
          display: flex;
          flex-direction: column;
          .text {
            font-weight: bold;
          }
        }
      }
      .symbol-item:last-child{
        .item{
          display: flex;
          flex-direction: column;
          .text {
            font-weight: bold;
          }
        }
      }
    }
    .handler {
      background-color: #fff;
      margin: 2% 0 0 0;
      .active{
        color: #f0a70a;
      }
      span {
          padding: 0 2%;
          font-size: 14px;
          display: inline-block;
          cursor: pointer;
          line-height: 40px;
          font-weight: 600;
      }
    }
    .imgtable{
      width: 100%;
      // height: 450px;
      // position: relative;
      background-color: #fff;
      /deep/ #kline_container {
          position: absolute;
          width: 100%;
          bottom: 0;
          top: unset !important;
          margin-bottom: unset !important;
          left: unset !important;
          // height: 100%;
          iframe {
            background: transparent !important;
            height: 450px !important;
          }
      }
      #kline_container.hiddenkline, #depth_chart.hiddenkline,  #plate.hiddenkline{
          z-index: -100;
      }
      
      /deep/ .ivu-table:after{
        width: 0 !important;
      }
      /deep/ .ivu-table:before{
        height: 0 !important;
      }
      /deep/ .ivu-table-wrapper{
        max-height: 450px;
        width: 100%;
        position: absolute;
        bottom: 0;
        border: none !important;
        .buy {
          color: #00b275!important;
        }
        .sell {
            color: #f15057!important;
        }
        .ivu-table td{
          height: 40px;
          background-color:transparent!important;
        }
        .ivu-table th{
          background-color:#fff!important;
          .ivu-table-cell {
            display: flex;
            justify-content: center;
          }
        }
      }

      #depth_chart {
          top: unset !important;
          left: unset !important;
          bottom: 0;
          position: absolute!important;
          width: 100%;
          height: 450px !important;
      }
    }
  }
}
</style>

<script>
let Stomp = require("stompjs");
let SockJS = require("sockjs-client");
import DepthGraph from "@components/exchange/DepthGraph.vue";
import Datafeeds from "@js/charting_library/datafeed/bitrade.js";
var moment = require("moment-timezone");
import $ from "@js/jquery.min.js";
import PageHeader from '@/components/header/index.vue';

export default {
  components: {DepthGraph, PageHeader},
  data() {
    return {
      defaultPath: "btc_usdt",
      skin: "night", //皮肤样式day&night
      currentCoinIsFavor: false,
      collecRequesting: false,
      currentImgTable: "k",
      currentCoin: {
        base: "",
        coin: "",
        symbol: "",
        baseCoinScale: 6,
        coinScale: 6,
      },
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
      trade: {
        maxPostion:10,
        rows: [],
        columns: [
          {
            title: this.$t("exchange.price"),
            key: "price",
            render: (h, params) => {
              const row = params.row;
              const className = row.direction == "BUY" ? "buy" : "sell";
              return h(
                "span",
                {
                  attrs: {
                    class: className
                  }
                },
                params.row.price.toFixed(this.currentCoin.baseCoinScale)
              );
            },
            renderHeader: (h, params) => {
              const title = this.$t("exchange.price") + "(" + this.currentCoin.base + ")";
              return h("span", {}, title);
            }
          },
          {
            title: this.$t("exchange.num"),
            key: "amount",
            render: (h, params) => {
              return h("span", {}, params.row.amount.toFixed(this.currentCoin.coinScale));
            },
            renderHeader: (h, params) => {
              const title = this.$t("exchange.num") + "(" + this.currentCoin.coin + ")";
              return h("span", {}, title);
            }
          },
          {
            title: this.$t("exchange.time"),
            key: "time",
            render: (h, params) => {
              return h("span", {}, this.timeFormat(params.row.time));
            }
          }
        ]
      },
    };
  },
  props:{
    // currentCoin:{
    //   type: Object,
    // },
    // dataIndex:{
    //   type:Array,
    // }
  },
  filters: {
  },
  computed: {
    lang: function() {
      return this.$store.state.lang;
    },
  },
  watch: {
    lang: function() {
      this.updateLangData();
    },
  },
  created: function() {
  },
  mounted:function(){
    this.init();
  },
  methods: {
    init() {
      var params = this.$route.params.pair;
      if (params == undefined || params == 'undefined') {
        params = this.defaultPath;
        this.$router.push("/exchange/" + this.defaultPath);
      }
      var coin = params.toUpperCase().split("_")[0];
      var base = params.toUpperCase().split("_")[1];
      this.currentCoin.symbol = coin + "/" + base;
      this.currentCoin.coin = coin;
      this.currentCoin.base = base;

      this.getTrade();
      this.getSymbol(); //包含 K线图、getFavor、startWebsock等
      // this.getPlateFull();

      // setInterval(() => {
      //   this.getPlateFull();
      // }, 10000);
    },
    changeImgTable(str) {
      this.currentImgTable = str;
    },
    updateLangData() {
      this.trade.columns[0].title = this.$t("exchange.num");
      this.trade.columns[1].title = this.$t("exchange.price");
      this.trade.columns[2].title = this.$t("exchange.time");
    },
    startWebsock() {
      let stompClient = null;
      let self = this;
      let socket = new SockJS(self.wssHost + self.api.market.ws);
      stompClient = Stomp.over(socket);
      stompClient.debug = false;
      stompClient.connect({}, function(frame) {
        self.datafeed = new Datafeeds.WebsockFeed(self.host + "/market", self.currentCoin, stompClient, self.baseCoinScale);
        console.log("self.currentCoin", self.currentCoin);
        self.getKline();
        //订阅实时成交信息
        stompClient.subscribe("/topic/market/trade/" + self.currentCoin.symbol,
          function(msg) {
            let resp = JSON.parse(msg.body);
            if (resp.length > 0) {
              for (let i = 0; i < resp.length; i++) {
                self.trade.rows.unshift(resp[i]);
              }
            }
            if (self.trade.rows.length > self.trade.maxPostion) {
              self.trade.rows = self.trade.rows.slice(0, self.trade.maxPostion);
            }
          }
        );
        //订阅价格变化消息
        stompClient.subscribe("/topic/market/thumb", function(msg) {
          var resp = JSON.parse(msg.body);
          var coin = self.getCoin(resp.symbol);
          if (coin != null) {
            coin.price = resp.close;
            coin.rose = resp.chg > 0 ? "+" + (resp.chg * 100).toFixed(2) + "%" : (resp.chg * 100).toFixed(2) + "%";
            coin.close = resp.close;
            coin.high = resp.high;
            coin.low = resp.low;
            coin.turnover = parseInt(resp.volume);
            coin.volume = resp.volume;
            coin.usdRate = resp.usdRate;
          }
        });

      });
    },
    getLang4K(){
      let curlang = this.$store.getters.lang;
      if(curlang=="zh_CN"){
        return "zh";
      }else {
        return "en";
      }
    },
    getTrade() {
      var params = {};
      params["symbol"] = this.currentCoin.symbol;
      params["size"] = this.trade.maxPostion;
      this.$http.post(this.host + this.api.market.trade, params).then(response => {
        this.trade.rows = [];
        var resp = response.body;
        for (var i = 0; i < resp.length; i++) {
          this.trade.rows.push(resp[i]);
        }
      });
    },
    getPlateFull() {
      //深度图
      let params = {};
      params["symbol"] = this.currentCoin.symbol;
      this.$http.post(this.host + this.api.market.platefull, params).then(response => {
        let resp = response.body;
        // this.fullTrade = resp;
        resp.skin = this.skin;
        this.$refs.depthGraph.draw(resp);
      });
    },
    getKline() {
      let that = this;
      let config = {
        autosize: true,
        height: 320,
        fullscreen: true,
        symbol: that.symbol,
        interval: "5", // 默认K线周期
        timezone: this.getTimezone4K(),
        // toolbar_bg: "#18202a",
        toolbar_bg: "#fff",
        container_id: "kline_container",
        datafeed: that.datafeed,
        library_path: process.env.NODE_ENV === "production" ? "/assets/charting_library/" : "/src/assets/js/charting_library/",
        locale: this.getLang4K(),
        debug: false,
        drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }]
        },
        disabled_features: [
          "header_resolutions",
          "timeframes_toolbar",
          "header_symbol_search",
          "header_chart_type",
          "header_compare",
          "header_undo_redo",
          "header_screenshot",
          "header_saveload",
          //"use_localstorage_for_settings",
          //"left_toolbar",
          "volume_force_overlay",
          "widget_logo",
          "compare_symbol", 
          "display_market_status",
          "go_to_date", 
          "header_interval_dialog_button", 
          "legend_context_menu", 
          "show_hide_button_in_legend",
          "show_interval_dialog_on_key_press", 
          "snapshot_trading_drawings", 
          "symbol_info", 
          //"header_widget", 
          "edit_buttons_in_legend",
          "context_menus", 
          "control_bar", 
          "border_around_the_chart"
        ],
        enabled_features: [
          "disable_resolution_rebuild",
          "keep_left_toolbar_visible_on_small_screens", //防止左侧工具栏在小屏幕上消失
          "hide_last_na_study_output",
          "move_logo_to_main_pane",
          // "dont_show_boolean_study_arguments",
          "use_localstorage_for_settings",
          "remove_library_container_border",
          "save_chart_properties_to_local_storage",
          "side_toolbar_in_fullscreen_mode",
          "constraint_dialogs_movement",
          "hide_left_toolbar_by_default",
          "left_toolbar",
          "same_data_requery",
          "header_in_fullscreen_mode"
        ],
		//成交量样式
        studies_overrides: {
          "volume.volume.color.0": "#fa5252", 
          "volume.volume.color.1": "#12b886", 
          "volume.volume.transparency": 25,
        },
        // custom_css_url: "bundles/common.css",
        custom_css_url : "bundles/common_day.css",
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        // supported_resolutions: ["1", "5", "15", "30", "60", "4H", "1D", "1W", "1M"],
        charts_storage_url: "http://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        overrides: {
          // "paneProperties.background": "#1B1E2E",
          "paneProperties.background": "#000000",
          "paneProperties.vertGridProperties.color": "rgba(0,0,0,.1)",
          "paneProperties.horzGridProperties.color": "rgba(0,0,0,.1)",
          //"scalesProperties.textColor" : "#AAA",
          "scalesProperties.textColor": "#61688A",
          "mainSeriesProperties.candleStyle.upColor": "#12b886",
          "mainSeriesProperties.candleStyle.downColor": "#fa5252",
          // "mainSeriesProperties.candleStyle.upColor": "#a6d3a5",
          // "mainSeriesProperties.candleStyle.downColor": "#ffa5a6",
          "mainSeriesProperties.candleStyle.drawBorder": true,
          "mainSeriesProperties.candleStyle.wickUpColor": "#589065",
          "mainSeriesProperties.candleStyle.wickDownColor": "#AE4E54",
          "paneProperties.legendProperties.showLegend": true,
          "mainSeriesProperties.areaStyle.color1": "rgba(71, 78, 112, 0.5)",
          "mainSeriesProperties.areaStyle.color2": "rgba(71, 78, 112, 0.5)",
          "mainSeriesProperties.areaStyle.linecolor": "#9194a4",
          "volumePaneSize": "small"
        },
        time_frames: [
          { text: "1min", resolution: "1", description: "realtime", title: that.$t("exchange.realtime") },
          { text: "1min", resolution: "1", description: "1min" },
          { text: "5min", resolution: "5", description: "5min" },
          { text: "15min", resolution: "15", description: "15min" },
          { text: "30min", resolution: "30", description: "30min" },
          { text: "1hour", resolution: "60", description: "1hour", title: "1hour" },
          // { text: "4hour", resolution: "240", description: "4hour", title: "4hour" },
          { text: "1day", resolution: "1D", description: "1day", title: "1day" },
          { text: "1week", resolution: "1W", description: "1week", title: "1week" },
          { text: "1mon", resolution: "1M",  description: "1mon", }
        ]
      };
      if (that.skin === "day") {
        config.toolbar_bg = "#fff";
        config.custom_css_url = "bundles/common_day.css";
        config.overrides["paneProperties.background"] = "#fff";
        config.overrides["mainSeriesProperties.candleStyle.upColor"] = "#a6d3a5";
        config.overrides["mainSeriesProperties.candleStyle.downColor"] = "#ffa5a6";
      }
      require(["@js/charting_library/charting_library.min.js"], function(tv) {
        var widget = (window.tvWidget = new TradingView.widget(config));
        widget.onChartReady(function() {
          widget.chart().executeActionById("drawingToolbarAction");
          widget.chart().createStudy("Moving Average", false, false, [5], null, { "plot.color": "#EDEDED" });
          widget.chart().createStudy("Moving Average", false, false, [10], null, { "plot.color": "#ffe000" });
          widget.chart().createStudy("Moving Average", false, false, [30], null, { "plot.color": "#ce00ff" });
          widget.chart().createStudy("Moving Average", false, false, [60], null, { "plot.color": "#00adff" });
          
          widget
            .createButton()
            .attr("title", "realtime")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(3);
              widget.setSymbol("", "1");
            })
            .append("<span>Time</span>");

          widget
            .createButton()
            .attr("title", "M1")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "1");
            })
            .append("<span>M1</span>");

          widget
            .createButton()
            .attr("title", "M5")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "5");
            })
            .append("<span>M5</span>")
            .addClass("selected");

          widget
            .createButton()
            .attr("title", "M15")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "15");
            })
            .append("<span>M15</span>");

          widget
            .createButton()
            .attr("title", "M30")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "30");
            })
            .append("<span>M30</span>");

          widget
            .createButton()
            .attr("title", "H1")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "60");
            })
            .append("<span>H1</span>");

          widget
            .createButton()
            .attr("title", "D1")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "1D");
            })
            .append("<span>D1</span>");

          widget
            .createButton()
            .attr("title", "W1")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "1W");
            })
            .append("<span>W1</span>");

          widget
            .createButton()
            .attr("title", "M1")
            .on("click", function() {
              if ($(this).hasClass("selected")) return;
              $(this)
                .addClass("selected")
                .parent(".group")
                .siblings(".group")
                .find(".button.selected")
                .removeClass("selected");
              widget.chart().setChartType(1);
              widget.setSymbol("", "1M");
            })
            .append("<span>M1</span>");
        });
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
          }
        }
        if (this.isLogin) {
          this.getFavor();
        }
        require(["../../assets/js/exchange.js"], function(e) {
          e.clickScTab();
        });
        this.startWebsock();
      });
    },
    getFavor() {
      //查询自选(收藏)
      this.$http.post(this.host + this.api.exchange.favorFind, {}).then(response => {
        this.coins.favor = [];
        this.currentCoinIsFavor = false;
        let resp = response.body;
        for (let i = 0; i < resp.length; i++) {
          let coin = this.getCoin(resp[i].symbol);
          if (coin != null) {
            coin.isFavor = true;
            this.coins.favor.push(coin);
          }
          if (this.currentCoin.symbol == resp[i].symbol) {
            this.currentCoinIsFavor = true;
          }
        }
      });
    },
    getCoin(symbol) {
      return this.coins._map[symbol];
    },
    currentCoinFavorChange() {
      if (!this.isLogin) {
        this.$Message.warning(this.$t("common.logintip"));
        return;
      }
      if (this.collecRequesting) {
        return;
      }
      const symbol = this.currentCoin.symbol;
      this.collecRequesting = true;
      if (this.currentCoinIsFavor) {
        //已收藏,去取消收藏
        this.$http.post(this.host + this.api.exchange.favorDelete, {symbol}).then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.info(this.$t("exchange.cancel_favorite"));
            this.getSymbol(); //刷新状态
            this.currentCoinIsFavor = false;
          }
          this.collecRequesting = false;
        });
      } else {
        //去添加收藏
        this.$http
          .post(this.host + this.api.exchange.favorAdd, { symbol })
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.info(this.$t("exchange.do_favorite"));
              this.getSymbol(); //刷新状态
              this.currentCoinIsFavor = true;
            }
            this.collecRequesting = false;
          });
      }
    },
  }
};
</script>