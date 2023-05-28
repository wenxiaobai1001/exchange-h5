<template>
  <div class="page-plate-list">
    <div class="handlers">
      <span @click="changePlate('all')" class="handler handler-all" :class="{active:selectedPlate=='all'}"></span>
      <span @click="changePlate('buy')" class="handler handler-green" :class="{active:selectedPlate=='buy'}"></span>
      <span @click="changePlate('sell')" class="handler handler-red" :class="{active:selectedPlate=='sell'}"></span>
    </div>
    <Table :no-data-text="$t('common.nodata')" v-show="selectedPlate!='buy'" @on-current-change="buyPlate" highlight-row ref="currentRowTable" class="sell_table" :columns="plate.columns" :data="plate.askRows"></Table>
    <div class="plate-nowprice">
      <span class="price" :class="{buy:currentCoin.change>0,sell:currentCoin.change<0}">{{currentCoin.price | toFixed(baseCoinScale)}}</span>
      <span v-if="currentCoin.change>0" class="buy">↑</span>
      <span v-else-if="currentCoin.change<0" class="sell">↓</span>
    </div>
    <Table :no-data-text="$t('common.nodata')" v-show="selectedPlate!='sell'" @on-current-change="sellPlate" highlight-row class="buy_table" :class="{hidden:selectedPlate==='all'}" :columns="plate.columns" :data="plate.bidRows"></Table>
    <!-- <div class="trade-wrap" style="margin-top: 5px;">
      <Table :no-data-text="$t('common.nodata')" :columns="trade.columns" :data="trade.rows"></Table>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
.page-plate-list{
  .buy {
      color: #00b275!important;
  }
  .sell {
      color: #f15057!important;
  }
  .handlers {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    .handler {
      display: inline-block;
      margin-right: 10px;
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      cursor: pointer;
      &.handler-all {
        background-image: url("../../assets/images/exchange/plate_all.png");
        &.active {
          background-image: url("../../assets/images/exchange/plate_all_active.png");
        }
      }
      &.handler-green {
        background-image: url("../../assets/images/exchange/plate_green.png");
        &.active {
          background-image: url("../../assets/images/exchange/plate_green_active.png");
        }
      }
      &.handler-red {
        background-image: url("../../assets/images/exchange/plate_red.png");
        &.active {
          background-image: url("../../assets/images/exchange/plate_red_active.png");
        }
      }
    }
  }
  .plate-nowprice {
    text-align: center;
    // background-color: #27313e;
    line-height: 1;
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    .price {
      font-size: 18px;
      margin-right: 10px;
    }
  }
  .trade-wrap{
    /deep/ .ivu-table-wrapper{
      max-height: 130px;
    }
  }
  /deep/ .ivu-table:after{
    width: 0 !important;
  }
  /deep/ .ivu-table:before{
    height: 0 !important;
  }
  /deep/ .ivu-table-wrapper{
    border: none !important;
    .buy {
      color: #00b275!important;
    }
    .sell {
        color: #f15057!important;
    }
    .ivu-table td{
      height: 20px;
      background-color:transparent!important;
    }
    .ivu-table th{
      background-color:#fff!important;
      height: 30px !important;
      .ivu-table-cell {
        display: flex;
        justify-content: center;
        padding: 0 0 10px 0 !important;
      }
    }
    td.percenttd {
        position: absolute;
        right: 0;
        left: 0;
    }
    th.percenttd {
        display: none;
        font-size: 0;
    }
    td.percenttd .ivu-table-cell {
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
        pointer-events: none;
    }
    td.percenttd .percentdiv {
        position: absolute;
        right: 0;
        height: 100%;
        opacity: .2;
    }
    td.percenttd .percentdiv {
      opacity: .1;
    }

  }
  /deep/ .ivu-table-cell{
    padding: 0 5px 0 5px !important;
  }

}
</style>

<script>
let Stomp = require("stompjs");
let SockJS = require("sockjs-client");

export default {
  components: {},
  data() {
    return {
      baseCoinScale: 6,
      coinScale: 6,
      selectedPlate: "all", //当前显示的买卖盘
      plate: {//最新价的 table 数据;
        maxPostion: 10,
        askRows: [],
        bidRows: [],
        columns: [
          {
            //   价格;
            title: this.$t("exchange.price"),
            key: "price",
            render: (h, params) => {
              let str = "";
              let price = "";
              const className = params.row.direction.toLowerCase();
              params.row.price == 0 && (str = h("span", {}, "--"));
              params.row.price != 0 && (price = params.row.price.toFixed(this.baseCoinScale)) && (str = h( "span", {attrs: {class: className}},price));
              return str;
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
              let str = "";
              params.row.amount == 0 && (str = h("span", {}, "--"));
              params.row.amount != 0 && (str = h("span",{},params.row.amount.toFixed(this.coinScale)));
              return str;
            },
            renderHeader: (h, params) => {
              const title = this.$t("exchange.num") + "(" + this.currentCoin.coin + ")";
              return h("span", {}, title);
            }
          },
          {
            className: "percenttd",
            width: 1,
            render: (h, params) => {
              let width = "0", backgroundColor = params.row.direction === "BUY" ? "#00b275" : "#f15057",
                totle = params.row.direction === "BUY" ? this.plate.bidTotle  : this.plate.askTotle;
              if (params.row.totalAmount) {
                width = (params.row.totalAmount / totle).toFixed(4) * 100 + "%";
              }
              return h(
                "div",
                {
                  style: {
                    width,
                    backgroundColor
                  },
                  attrs: {
                    class: "percentdiv"
                  }
                },
                " "
              );
            }
          }
        ]
      },
      trade: {
        maxPostion:5,
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
                params.row.price.toFixed(this.baseCoinScale)
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
              return h("span", {}, params.row.amount.toFixed(this.coinScale));
            },
            renderHeader: (h, params) => {
              const title = this.$t("exchange.num") + "(" + this.currentCoin.coin + ")";
              return h("span", {}, title);
            }
          },
          {
            title: this.$t("exchange.time"),
            key: "time",
            width: 25,
            render: (h, params) => {
              return h("span", {}, this.shortTimeFormat(params.row.time));
            },
            renderHeader: (h, params) => {
              const time = require('../../assets/img/time.png');
              return h("img", {
                  style:{
                    width:'20px',
                    height:'20px'
                  },
                  attrs: {
                    src: time
                  }
                }, '');
            }
          }
        ]
      },
    };
  },
  props:{
    currentCoin:{
      type: Object,
    },
    // dataIndex:{
    //   type:Array,
    // }
  },
  filters: {
  },
  computed: {
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
    lang: function() {
      this.updateLangData();
    },
  },
  created: function() {
    console.log("currentCoin", this.currentCoin);
    this.getPlate(); //买卖盘
    this.getSymbolScale();
    this.startWebsock();
  },
  methods: {
    login(){
      this.$router.push("/login");
    },
    gohref(currentRow, oldCurrentRow) {
      this.$router.push({
        name: 'ExchangePair',
        params: {pair: currentRow.href}
      });
    },
    updateLangData() {
      this.plate.columns[0].title = this.$t("exchange.stall");
      this.plate.columns[1].title = this.$t("exchange.price");
      this.plate.columns[2].title = this.$t("exchange.num");
      // this.plate.columns[3].title = this.$t("exchange.total");
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
        //订阅实时成交信息
        // stompClient.subscribe("/topic/market/trade/" + self.currentCoin.symbol,
        //   function(msg) {
        //     let resp = JSON.parse(msg.body);
        //     if (resp.length > 0) {
        //       for (let i = 0; i < resp.length; i++) {
        //         self.trade.rows.unshift(resp[i]);
        //       }
        //     }
        //     if (self.trade.rows.length > self.trade.maxPostion) {
        //       self.trade.rows = self.trade.rows.slice(0, self.trade.maxPostion);
        //     }
        //   }
        // );
        //订阅盘口消息
        stompClient.subscribe("/topic/market/trade-plate/" + self.currentCoin.symbol,
          function(msg) {
            let resp = JSON.parse(msg.body);
            if (resp.direction == "SELL") {
              let asks = resp.items;
              self.plate.askRows = [];
              let totle = 0;
              for (let i = self.plate.maxPostion - 1; i >= 0; i--) {
                let ask = {};
                if (i < asks.length) {
                  ask = asks[i];
                } else {
                  ask["price"] = 0;
                  ask["amount"] = 0;
                }
                ask.direction = "SELL";
                ask.position = i + 1;
                self.plate.askRows.push(ask);
              }
              for (let i = self.plate.askRows.length - 1; i >= 0; i--) {
                if (i == self.plate.askRows.length - 1 || self.plate.askRows[i].price == 0) {
                  self.plate.askRows[i].totalAmount = self.plate.askRows[i].amount;
                } else {
                  self.plate.askRows[i].totalAmount = self.plate.askRows[i + 1].totalAmount + self.plate.askRows[i].amount;
                }
                totle += self.plate.askRows[i].amount;
              }
              self.plate.askTotle = totle;
            } else {
              let bids = resp.items;
              self.plate.bidRows = [];
              let totle = 0;
              for (let i = 0; i < self.plate.maxPostion; i++) {
                let bid = {};
                if (i < bids.length) {
                  bid = bids[i];
                } else {
                  bid["price"] = 0;
                  bid["amount"] = 0;
                }
                bid.direction = "BUY";
                bid.position = i + 1;
                self.plate.bidRows.push(bid);
              }
              for (let i = 0; i < self.plate.bidRows.length; i++) {
                if (i == 0 || self.plate.bidRows[i].amount == 0) {
                  self.plate.bidRows[i].totalAmount = self.plate.bidRows[i].amount;
                } else {
                  self.plate.bidRows[i].totalAmount = self.plate.bidRows[i - 1].totalAmount + self.plate.bidRows[i].amount;
                }
                totle += self.plate.bidRows[i].amount;
              }
              self.plate.bidTotle = totle;
            }
            // if(self.currentImgTable == 's') {
            //   self.getPlateFull();
            // }
          }
        );
      
      });
    },
    getSymbolScale() {
      //获取精度
      this.$http.post(this.host + this.api.market.symbolInfo, {
          symbol: this.currentCoin.symbol
      }).then(response => {
        let resp = response.body;
        if (resp != null) {
          this.baseCoinScale = resp.baseCoinScale;
          this.coinScale = resp.coinScale;
        }
      });
    },
    changePlate(str) {
      if (str != "all") {
        this.plate.maxPostion = 20;
      } else {
        this.plate.maxPostion = 10;
      }
      this.getPlate(str);
    },
    getPlate(str="") {
      //买卖盘
      let params = {};
      params["symbol"] = this.currentCoin.symbol;
      this.$http.post(this.host + this.api.market.platemini, params).then(response => {
          this.plate.askRows = [];
          this.plate.bidRows = [];
          let resp = response.body;
          if (resp.ask && resp.ask.items) {
            for (let i = 0; i < resp.ask.items.length; i++) {
              if (i == 0) {
                resp.ask.items[i].totalAmount = resp.ask.items[i].amount;
              } else {
                resp.ask.items[i].totalAmount = resp.ask.items[i - 1].totalAmount + resp.ask.items[i].amount;
              }
            }
            if (resp.ask.items.length >= this.plate.maxPostion) {
              for (let i = this.plate.maxPostion; i > 0; i--) {
                var ask = resp.ask.items[i - 1];
                ask.direction = "SELL";
                ask.position = i;
                this.plate.askRows.push(ask);
              }
              const rows = this.plate.askRows, len = rows.length, totle = rows[0].totalAmount;
              this.plate.askTotle = totle;
            } else {
              for (let i = this.plate.maxPostion; i > resp.ask.items.length; i--) {
                let ask = { price: 0, amount: 0 };
                ask.direction = "SELL";
                ask.position = i;
                ask.totalAmount = ask.amount;
                this.plate.askRows.push(ask);
              }
              for (let i = resp.ask.items.length; i > 0; i--) {
                let ask = resp.ask.items[i - 1];
                ask.direction = "SELL";
                ask.position = i;
                this.plate.askRows.push(ask);
              }
              let askItemIndex = (resp.ask.items.length - 1) > 0 ? (resp.ask.items.length - 1) : 0;
              const rows = this.plate.askRows, len = rows.length, totle = rows[askItemIndex].totalAmount;
              this.plate.askTotle = totle;
            }
          }
          if (resp.bid && resp.bid.items) {
            for (let i = 0; i < resp.bid.items.length; i++) {
              if (i == 0)
                resp.bid.items[i].totalAmount = resp.bid.items[i].amount;
              else
                resp.bid.items[i].totalAmount = resp.bid.items[i - 1].totalAmount + resp.bid.items[i].amount;
            }
            for (let i = 0; i < resp.bid.items.length; i++) {
              let bid = resp.bid.items[i];
              bid.direction = "BUY";
              bid.position = i + 1;
              this.plate.bidRows.push(bid);
              if (i == this.plate.maxPostion - 1) break;
            }
            if (resp.bid.items.length < this.plate.maxPostion) {
              for (let i = resp.bid.items.length; i < this.plate.maxPostion; i++) {
                let bid = { price: 0, amount: 0 };
                bid.direction = "BUY";
                bid.position = i + 1;
                bid.totalAmount = 0;
                this.plate.bidRows.push(bid);
              }
              let bidItemIndex = (resp.bid.items.length - 1) > 0 ? (resp.bid.items.length - 1) : 0;
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
    buyPlate(currentRow) {
      this.$emit("handlePlate", 'buy',currentRow);
      // this.form.buy.limitPrice = currentRow.price;
      // this.form.sell.limitPrice = currentRow.price;
    },
    sellPlate(currentRow) {
      this.$emit("handlePlate", 'sell',currentRow);
      // this.form.buy.limitPrice = currentRow.price;
      // this.form.sell.limitPrice = currentRow.price;
    },
  }
};
</script>