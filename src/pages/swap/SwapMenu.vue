<template>
  <div class="swap-menu">
    <div class="swap-menu-right">
      <div class="coin-menu">
        <div style="padding: 8px 10px;height:48px;">
          <Input search :placeholder="$t('common.searchplaceholderswap')" @on-change="seachInputChange" v-model="searchKey"/>
        </div>
        <div class="sc_filter" style="display: none;">
          <span @click="changeBaseCion('usdt')" :class="{active:basecion==='usdt'}">USDT</span>
        </div>
        <Table :no-data-text="$t('common.nodata')" @on-current-change="gohref" highlight-row id="USDT" v-show="basecion==='usdt'" :columns="coins.columns" :data="dataIndex"></Table>
      </div>
    </div>
    <div class="swap-menu-center">
      <div class="symbol">
        <div class="symbol-info">
          <div class="item">
              <span class="coin">{{currentCoin.symbol}} {{$t("swap.swapindex")}}
              </span>
          </div>
          <div class="item" style="margin-top: 10px;">
            <!-- <span class="text">{{$t('service.NewPrice')}}</span> -->
            <span class="num" style="font-size:18px; font-weight: bold;" :class="{buy:currentCoin.change>0,sell:currentCoin.change<0}">{{currentCoin.close | toFixed(4)}}</span>
            <!-- <span class="price-cny">≈ ￥{{currentCoin.usdRate*CNYRate | toFixed(2)}}</span> -->
          </div>
        </div>
        <div class="symbol-info" style="width: 50%;">
          <div class="item">
            <span class="text">{{$t('service.Change')}}</span>
            <span class="num" :class="{buy:currentCoin.change>0,sell:currentCoin.change<0}">{{currentCoin.rose}}</span>
          </div>
          <div class="item">
            <span class="text">{{$t('service.high')}}</span>
            <span class="num ">{{currentCoin.high | toFixed(4)}}</span>
          </div>
          <div class="item">
            <span class="text">{{$t('service.low')}}</span>
            <span class="num ">{{currentCoin.low | toFixed(4)}}</span>
          </div>
          <div class="item">
            <span class="text">{{$t('service.ExchangeNum')}}</span>
            <span class="num ">{{currentCoin.volume |  toFixed(4)}} {{currentCoin.coin}}</span>
          </div>
          <div class="item">
            <!-- <img src="../../assets/images/exchange/light-switch.png" alt=""> -->
          </div>
        </div>
      </div>
      <div class="imgtable">
        <div class="handler">
          <span @click="changeImgTable('k')" :class="{active:currentImgTable==='k'}">{{$t("swap.kline")}}</span>
          <span @click="changeImgTable('s')" :class="{active:currentImgTable==='s'}">{{$t("swap.depth")}}</span>
        </div>
        <div id="kline_container" :class="{hidden:currentImgTable==='s'}">
        </div>
        <DepthGraph :class="{hidden:currentImgTable==='k'}" ref="depthGraph"></DepthGraph>
      </div>
    </div>
    <div class="trade-list">
      <div class="order" style="background: #999;">
        <div class="order-handler">
          <span @click="changeOrder('currentPositions')" :class="{active:selectedOrder==='currentPositions'}">{{$t('swap.currentposition')}}</span>
          <span @click="changeOrder('currentEntrustOrders')" :class="{active:selectedOrder==='currentEntrustOrders'}">{{$t('swap.curdelegation')}}</span>
          <span @click="changeOrder('historyEntrustOrders')" :class="{active:selectedOrder==='historyEntrustOrders'}">{{$t('swap.hisdelegation')}}</span>
        </div>
        <div class="table">
          <Table :no-data-text="$t('common.nodata')" height="285" v-if="selectedOrder==='currentPositions'" :columns="currentPosition.columns" :data="positionList"></Table>
          <Table :no-data-text="$t('common.nodata')" height="285" v-if="selectedOrder==='currentEntrustOrders'" :columns="currentOrder.columns" :data="currentEntrustOrderList"></Table>
          <Table :no-data-text="$t('common.nodata')" height="285" v-if="selectedOrder==='historyEntrustOrders'" :columns="historyOrder.columns" :data="historyEntrustOrderList"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    let self = this;
    return {
      dataIndex: [],
      searchKey: "",
      basecion: "usdt",
      currentCoin: {
        base: "",
        coin: "",
        symbol: "",
        price: 0.0
      },
      coins: {
        _map: [],
        USDT: [],
        columns: [
          {
            title: this.$t("swap.contract") + "/" + this.$t("swap.vol"),
            key: "coin",
            width: 150,
            sortable: false,
            className: "coin-menu-symbol swap-coin-menu-symbol",
            render: (h, params) => {
              return h("div", {
                  style: {
                    padding: "5px 0"
                  }
                },[
                h("span", {
                  style: {
                    fontSize: "13px",
                    fontWeight: "bold"
                  }
                }, params.row.coin + "/USDT " + this.$t("swap.swapindex")),
                h("br"),
                h("span", {
                  style: {
                    color: "#61688A",
                    fontSize: "12px"
                  }
                }, params.row.volume.toFixed(4))
              ]);
            }
          },
          {
            title: this.$t("swap.lastprice") + "/" + this.$t("swap.daychange"),
            key: "rose",
            className: "swap-coin-menu-lastprice",
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
              return h("div", {
                  style: {
                    padding: "5px 10px",
                    textAlign: "right",
                    fontSize: "13px"
                  }
                },[
                  h("span", params.row.close),
                  h("br"),
                  h(
                  "span",
                  {
                    attrs: {
                      class: className
                    }
                  },
                  row.rose
                )]);
            }
          }
        ]
      },
    };
  },
  filters: {

  },
  computed: {

  },
  watch: {
    lang: function() {
      // this.updateLangData();
    },
    $route(to, from) {
      // this.init();
    }
  },
  created: function() {
    // this.init();
  },
  filters:{
    dateFormat: function(tick) {
      return moment(tick).format("MM-DD HH:mm");
    },
    fixed2: function(value){
      return value.toFixed(2);
    },
    fixed4: function(value){
      return value.toFixed(4);
    },
    percent: function(value){
      return (value * 100).toFixed(2);
    }
  },
  methods: {

    init() {
      var params = this.$route.params.pair;
      if (params == undefined) {
        this.$router.push("/swap/" + this.defaultPath);
        params = this.defaultPath;
      }
      const basecion = params.split("_")[1];
      if (basecion) {
        this.basecion = basecion;
      }
      var coin = params.toUpperCase().split("_")[0];
      var base = params.toUpperCase().split("_")[1];
      this.currentCoin.symbol = coin + "/" + base;
      this.currentCoin.coin = coin;
      this.currentCoin.base = base;
      this.$store.commit("navigate", "nav-swap");
      this.$store.commit("setSkin", this.skin);
      this.currentPositionList = new Array();
      this.getSymbolInfo();
      this.getSymbolThumb(); //包含 K线图、getFavor、startWebsock等
      this.getPlate(); //买卖盘
      this.getPlateFull();
      this.sliderOpenPercent = 0;
      this.sliderClosePercent = 0;
    },
    seachInputChange(){
      this.searchKey = this.searchKey.toUpperCase();
      this.dataIndex = this.coins.USDT.filter(item => item["coin"].indexOf(this.searchKey) == 0);
    },
    gohref(currentRow, oldCurrentRow) {
      this.$router.push({
        name: 'SwapPair',
        params: {
          pair: currentRow.href
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">

</style>