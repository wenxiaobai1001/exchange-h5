<template>
  <div class="page-coinmenu-list">
    <!-- <PageHeader :headerType=1 title="Market"></PageHeader>  -->
    <div class="page-content">
      <div class="coin-menu">
        <div class="coin-menu-search">
          <Input size="large" search :placeholder="$t('common.searchplaceholder')" @on-change="seachInputChange" v-model="searchKey"></Input>
        </div>
        <div class="sc_new_filter">
          <span class="ivu-btn-default" v-show="isLogin" @click="changeBaseCion('favor')" :class="{active:basecion==='favor'}">{{$t('service.CUSTOM')}}</span>
          <span class="ivu-btn-default" @click="changeBaseCion('usdt')" :class="{active:basecion==='usdt'}">USDT</span>
          <span class="ivu-btn-default" @click="changeBaseCion('btc')" :class="{active:basecion==='btc'}">BTC</span>
          <span class="ivu-btn-default" @click="changeBaseCion('eth')" :class="{active:basecion==='eth'}">ETH</span>
        </div>
        <Table :no-data-text="$t('common.nodata')" @on-current-change="gohref" highlight-row id="USDT" v-show="basecion==='usdt'" :columns="coins.columns" :data="dataIndex"></Table>
        <Table :no-data-text="$t('common.nodata')" @on-current-change="gohref" highlight-row id="BTC" v-show="basecion==='btc'" :columns="coins.columns" :data="dataIndex"></Table>
        <Table :no-data-text="$t('common.nodata')" @on-current-change="gohref" highlight-row id="ETH" v-show="basecion==='eth'" :columns="coins.columns" :data="dataIndex"></Table>
        <Table :no-data-text="$t('common.nodata')" @on-current-change="gohref" highlight-row v-show="basecion==='favor'" id="collect" :columns="favorColumns" :data="dataIndex"></Table>
      </div>
    </div>
    <PageFooter curindex='market'></PageFooter>
  </div>
</template>
<style scoped lang="scss">
.coin-menu{
  width:100%;
  // padding-top: 50px;
  padding-top: 0px;
  padding-bottom: 50px;
  .coin-menu-search{
    padding: 5%;
  }
  .sc_new_filter {
    display: flex;
    width: 100%;
    background-color: #fff;
    margin: 2% 0 0 0;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    .ivu-btn-default.active{
      color: #f0a70a;
      border-bottom: 4px solid #f0a70a;
    }
    .ivu-btn-default {
      width: 80px;
      font-size: 16px;
      color: #515a6e;
      font-weight: 400;
      list-style: none;
      height: 100%;
      padding: 2%;
      text-align: center;
    }
  }
  /deep/ .ivu-table-wrapper{
    border: none;
  }
  /deep/ .ivu-table:after{
    width: 0;
  }
  /deep/ .ivu-table{
    font-size: 14px;
    .ivu-table th {
      background-color: #fff;
    }
    .ivu-table-cell div {
        display: flex;
        align-items: center;
        .ivu-icon-ios-star:before {
          color: #f0a70a;
        }
    }
    .buy {
        color: #00b275!important;
    }
    .sell {
        color: #f15057!important;
    }
  }
}
</style>

<script>
import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';
let Stomp = require("stompjs");
let SockJS = require("sockjs-client");
export default {
  components: {PageHeader, PageFooter},
  data() {
    return {      
      basecion: "usdt",
      searchKey: "",
      currentCoinIsFavor: false,
      favorColumns: [
        {
          title: this.$t("exchange.coin"),
          key: "coin",
          sortable: false,
          width: 120,
          className: "coin-menu-symbol",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  color:"#f0a70a",
                  type: params.row.isFavor ? "ios-star" : "ios-star-outline"
                },
                nativeOn: {
                  click: (event) => {
                    event.stopPropagation(); //阻止事件冒泡
                    if (this.isLogin) {
                      if (event.currentTarget.className == "ivu-icon ivu-icon-ios-star") {
                        this.cancelCollect(params.index, params.row);
                        event.currentTarget.className = "ivu-icon ivu-icon-ios-star-outline";
                      } else {
                        this.collect(params.index, params.row);
                        event.currentTarget.className = "ivu-icon ivu-icon-ios-star";
                      }
                    } else {
                      this.$Message.warning("Please log in first");
                    }
                  }
                }
              }),
              h("span", params.row.symbol)
            ]);
          }
        },
        {
          title: this.$t("exchange.lastprice"),
          key: "close",
          sortable: true,
          sortMethod: function(a, b, type) {
            let a1 = parseFloat(a);
            let b1 = parseFloat(b);
            if (type == "asc") {
              return a1 - b1;
            } else {
              return b1 - a1;
            }
          }
        },
        {
          title: this.$t("exchange.daychange"),
          key: "rose",
          sortable: true,
          sortMethod: function(a, b, type) {
            let a1 = a.replace(/[^\d|.|-]/g, "") - 0;
            let b1 = b.replace(/[^\d|.|-]/g, "") - 0;
            if (type == "asc") {
              return a1 - b1;
            } else {
              return b1 - a1;
            }
          },
          render: (h, params) => {
            const row = params.row;
            const className = parseFloat(row.rose) < 0 ? "sell" : "buy";
            return h(
              "span",
              {
                attrs: {
                  class: className
                }
              },
              row.rose
            );
          }
        }
      ],
      dataIndex:[],
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
        columns: [
          {
            title: this.$t("exchange.coin"),
            key: "coin",
            sortable: false,
            width: 120,
            className: "coin-menu-symbol",
            render: (h, params) => {
              if(params.row.coin == "CDEA"){
                return h("div", [
                  h("Icon", {
                    props: {
                      color:"#f0a70a",
                      type: params.row.isFavor ? "ios-star" : "ios-star-outline"
                    },
                    nativeOn: {
                      click: (event) => {
                        event.stopPropagation(); //阻止事件冒泡
                        if (this.isLogin) {
                          if (event.currentTarget.className == "ivu-icon ivu-icon-ios-star") {
                            this.cancelCollect(params.index, params.row);
                            event.currentTarget.className = "ivu-icon ivu-icon-ios-star-outline";
                          } else {
                            this.collect(params.index, params.row);
                            event.currentTarget.className = "ivu-icon ivu-icon-ios-star";
                          }
                        } else {
                          this.$Message.warning(this.$t("common.logintip"));
                        }
                      }
                    }
                  }),
                  h("span", params.row.coin),
                  h("Tooltip", { 
                      props: {
                        placement:"top-start",
                        content:"价格跟随演示，价格为BTC价格的0.92%"
                      }
                    }, 
                    [h("span", 
                      {
                        style: {
                          fontSize: "8px", 
                          padding: "2px 2px 1px 2px", 
                          color: "#FFF", 
                          marginLeft: "5px", 
                          background:"#F30", 
                          borderRadius:"8px", 
                          display: "inline-block", 
                          height: "8px", 
                          width: "8px"
                        }
                      }, "")]
                    )
                ]);
              }
              return h("div", [
                h("Icon", {
                  props: {
                    color:"f0a70a",
                    type: params.row.isFavor ? "ios-star" : "ios-star-outline"
                  },
                  nativeOn: {
                    click: (event) => {
                      event.stopPropagation(); //阻止事件冒泡
                      if (this.isLogin) {
                        if (event.currentTarget.className == "ivu-icon ivu-icon-ios-star") {
                          this.cancelCollect(params.index, params.row);
                          event.currentTarget.className = "ivu-icon ivu-icon-ios-star-outline";
                        } else {
                          this.collect(params.index, params.row);
                          event.currentTarget.className = "ivu-icon ivu-icon-ios-star";
                        }
                      } else {
                        this.$Message.warning(this.$t("common.logintip"));
                      }
                    }
                  }
                }),
                h("span", params.row.coin)
              ]);
            }
          },
          {
            title: this.$t("exchange.lastprice"),
            key: "close",
            sortable: true,
            sortMethod: function(a, b, type) {
              let a1 = parseFloat(a);
              let b1 = parseFloat(b);
              if (type == "asc") {
                return a1 - b1;
              } else {
                return b1 - a1;
              }
            }
          },
          {
            title: this.$t("exchange.daychange"),
            key: "rose",
            sortable: true,
            sortMethod: function(a, b, type) {
              let a1 = a.replace(/[^\d|.|-]/g, "") - 0;
              let b1 = b.replace(/[^\d|.|-]/g, "") - 0;
              if (type == "asc") {
                return a1 - b1;
              } else {
                return b1 - a1;
              }
            },
            render: (h, params) => {
              const row = params.row;
              const className = parseFloat(row.rose) < 0 ? "sell" : "buy";
              return h(
                "span",
                {
                  attrs: {
                    class: className
                  }
                },
                row.rose
              );
            }
          }
        ]
      },
    };
  },
  props:{
    // coins:{
    //   type: Object,
    // },
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
    this.getSymbol();
    if (this.isLogin) {
      this.getFavor();
    }
  },
  methods: {
    changeBaseCion(str) {
      this.basecion = str;
      if(str == "usdt"){
        this.dataIndex = this.coins.USDT;
      }else if(str == "btc"){
        this.dataIndex = this.coins.BTC;
      }else if(str == "eth"){
        this.dataIndex = this.coins.ETH;
      }else if(str == "favor"){
        this.dataIndex = this.coins.favor;
      }
    },
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
      this.favorColumns[0].title = this.$t("exchange.coin");
      this.favorColumns[1].title = this.$t("exchange.lastprice");
      this.favorColumns[2].title = this.$t("exchange.daychange");

      this.coins.columns[0].title = this.$t("exchange.coin");
      this.coins.columns[1].title = this.$t("exchange.lastprice");
      this.coins.columns[2].title = this.$t("exchange.daychange");
      this.coins.columns[3].title = this.$t("exchange.favorite");
    },
    seachInputChange(){
      this.searchKey = this.searchKey.toUpperCase();
      if(this.basecion == "favor"){
          this.dataIndex = this.coins.favor.filter(item => item["coin"].indexOf(this.searchKey) == 0);
      }else if(this.basecion == "usdt"){
          this.dataIndex = this.coins.USDT.filter(item => item["coin"].indexOf(this.searchKey) == 0);
      }else if(this.basecion == "btc"){
          this.dataIndex = this.coins.BTC.filter(item => item["coin"].indexOf(this.searchKey) == 0);
      }else if(this.basecion == "eth"){
          this.dataIndex = this.coins.ETH.filter(item => item["coin"].indexOf(this.searchKey) == 0);
      }
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
        }
        this.startWebsock();
        this.changeBaseCion(this.basecion);
      });
    },
    getCoin(symbol) {
      return this.coins._map[symbol];
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
            // if (this.currentCoin.symbol == resp[i].symbol) {
            //   this.currentCoinIsFavor = true;
            // }
          }
      });
    },
    collect(index, row) {
      if (!this.isLogin) {
        this.$Message.info(this.$t("common.logintip"));
        return;
      }
      let params = {};
      params["symbol"] = row.symbol;
      this.$http.post(this.host + this.api.exchange.favorAdd, params).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          this.$Message.info(this.$t("exchange.do_favorite"));
          this.getCoin(row.symbol).isFavor = true;
          row.isFavor = true;
          this.coins.favor.push(row);
          // if (this.currentCoin.symbol == row.symbol) {
          //   this.currentCoinIsFavor = true;
          // }
        }
      });
    },
    cancelCollect(index, row) {
      if (!this.isLogin) {
        this.$Message.info(this.$t("common.logintip"));
        return;
      }
      let params = {};
      params["symbol"] = row.symbol;
      this.$http.post(this.host + this.api.exchange.favorDelete, params).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          this.$Message.info(this.$t("exchange.cancel_favorite"));
          this.getCoin(row.symbol).isFavor = false;
          for (let i = 0; i < this.coins.favor.length; i++) {
            let favorCoin = this.coins.favor[i];
            if (favorCoin.symbol == row.symbol) {
              this.coins.favor.splice(i, 1);
              break;
            }
          }
          // if (this.currentCoin.symbol == row.symbol) {
          //   this.currentCoinIsFavor = false;
          // }
        }
      });
    },
    startWebsock() {
      let stompClient = null;
      let self = this;
      let socket = new SockJS(this.wssHost + this.api.market.ws);
      stompClient = Stomp.over(socket);
      stompClient.debug = false;
      stompClient.connect({}, function(frame) {
        //订阅价格变化消息
        stompClient.subscribe("/topic/market/thumb", function(msg) {
          let resp = JSON.parse(msg.body);
          let coin = self.getCoin(resp.symbol);
          if (coin != null) {
            coin.price = resp.close.toFixed(resp.baseCoinScale);
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
  }
};
</script>