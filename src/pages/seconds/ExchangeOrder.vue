<template>
  <div class="page-myorder-list">
    <div class="order-handler">
      <span @click="changeOrder('current')" :class="{active:selectedOrder==='current'}">{{$t('exchange.curdelegation')}}</span>
      <span @click="changeOrder('history')" :class="{active:selectedOrder==='history'}">{{$t('exchange.hisdelegation')}}</span>
      <!-- <router-link v-show="selectedOrder==='current'" class="linkmore" to="/entrust/current">{{$t("common.more")}}</router-link>
      <router-link v-show="selectedOrder==='history'" class="linkmore" to="/entrust/history">{{$t("common.more")}}</router-link> -->
    </div>
    <div class="order-table">
      <Table highlight-row :no-data-text="$t('common.nodata')" v-if="selectedOrder==='current'" :columns="currentOrder.columns" :data="currentOrder.rows"></Table>
      <Table highlight-row :no-data-text="$t('common.nodata')" v-else :columns="historyOrder.columns" :data="historyOrder.rows"></Table>
    </div>
  </div>
</template>
<style scoped lang="scss">
/deep/ .buy {
    color: #00b275 !important;
}
/deep/ .sell {
    color: #f15057 !important;
}
.page-myorder-list{
  .order-handler {
    font-size: 0;
    // border-radius: 6px;
    background-color:#fff;
    .linkmore {
      float: right;
      color: #f0a70a;
      font-size: 14px;
      line-height: 40px;
      margin-right: 2%;
    }
    > span {
      padding: 0 2%;
      font-size: 14px;
      display: inline-block;
      cursor: pointer;
      line-height: 40px;
      font-weight: 600;
      &.active {
        color: #f0a70a;
      }
      &:first-child {
        border-top-left-radius: 0px;
      }
      &:last-child {
        border-top-right-radius: 0px;
      }
    }
  }
  .order-table{
    /deep/ .ivu-table:after{
      width: 0;
      height: 0;
    }
    /deep/ .ivu-table:before{
      width: 0;
      height: 0;
    }
    
    /deep/ .ivu-table-wrapper {
      border: none !important;
      // max-height: 300px;
      .ivu-table{
        .ivu-table-cell{
          padding-left: 10px !important;
          padding-right: 10px;
        }
        .ivu-table th {
          background-color: #fff !important;
        }
      }

    }
  }
}
</style>

<script>
let moment = require("moment-timezone");
import expandRow from "@components/expand/seconds.vue";
export default {
  components: {},
  data() {
    let self = this;
    return {
      selectedOrder: "current", //当前显示的委托记录
      currentOrder: {
        columns: [
          {
            type: "expand",
            width: 40,
            height:40,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  skin: params.row.skin,
                  rows: params.row
                }
              });
            }
          },
        //   {
        //     title: self.$t("exchange.time"),
        //     key: "time",
        //     render: (h, params) => {
        //       return h("span", {}, this.dateFormat(params.row.time));
        //     }
        //   },
          {
            title: self.$t("exchange.symbol"),
            width: 120,
            key: "symbol"
          },
          {
            title: self.$t("uc.finance.seconds.openPrice"),
            key: "openPrice",
            render(h, params) {
              return h("span", self.toFloor(params.row.openPrice));
            }
          },
          {
            title: self.$t("exchange.direction"),
            key: "direction",
            render: (h, params) => {
              const row = params.row;
              const className = row.direction.toLowerCase();
              return h(
                "span",
                {
                  attrs: {
                    class: className
                  }
                },
                row.direction == "BUY" ? self.$t("uc.finance.seconds.buy") : self.$t("uc.finance.seconds.sell")
              );
            }
          }
        ],
        rows: []
      },
      historyOrder: {
        pageSize: 10,
        total: 10,
        page: 0,
        columns: [
          {
            type: "expand",
            width: 40,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  skin: params.row.skin,
                  rows: params.row
                }
              });
            }
          },
          {
            title: self.$t("exchange.symbol"),
            width: 120,
            key: "symbol"
          },
          // {
          //   title: self.$t("uc.finance.seconds.openPrice"),
          //   key: "openPrice",
          //   render(h, params) {
          //     return h("span", self.toFloor(params.row.openPrice));
          //   }
          // },
          {
            title: self.$t("exchange.direction"),
            key: "direction",
            render: (h, params) => {
              const row = params.row;
              const className = row.direction.toLowerCase();
              return h(
                "span",
                {
                  attrs: {
                    class: className
                  }
                },
                row.direction == "BUY" ? self.$t("uc.finance.seconds.buy") : self.$t("uc.finance.seconds.sell")
              );
            }
          },
          {
            title: self.$t("uc.finance.seconds.status"),
            key: "result",
            render: (h, params) => {
              const status = params.row.result;
              if (status == "WIN") {
                return h(
                  "span",
                  {
                    style: {
                      color: "#f0a70a"
                    }
                  },
                  self.$t("uc.finance.seconds.resultWin")
                );
              } else if (status == "LOSE") {
                return h(
                  "span",
                  {
                    style: {
                      color: "#7c7f82"
                    }
                  },
                  self.$t("uc.finance.seconds.resultFail")
                );
              } else if (status == "TIED") {
                return h(
                  "span",
                  {
                    style: {
                      color: "#7c7f22"
                    }
                  },
                  self.$t("uc.finance.seconds.resultTied")
                );
              }else {
                return h("span", {}, self.$t("uc.finance.seconds.resultWait"));
              }
            }
          }
        ],
        rows: []
      },
      isConnected:false,
    };
  },
  props:{
    currentCoin:{
      type:Object,
    },
    stompClient:{
      type:Object,
    },
    // orderList:{
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
    stompClient:{
      deep: true,  // 深度监听
      handler(newVal,oldVal) {
        console.log(newVal,oldVal);
        if(newVal){
          this.init(newVal);
        }
      }
    },
    lang: function() {
      this.updateLangData();
    },
  },
  created: function() {
    this.getHistoryOrder();
    this.getCurrentOrder();
    setInterval(() => {
      this.getHistoryOrder();
      this.getCurrentOrder();
    }, 10000);
  },
  mounted: function(){
  },
  methods: {
    init(stompClient){
      if (this.isLogin&&!this.isConnected&&stompClient.connected) {
        this.isConnected = true;
        //订阅委托取消信息
      //  stompClient.subscribe("/topic/market/order-canceled/" + this.currentCoin.symbol + "/" + this.member.id,
      //     function(msg) {
      //       var resp = JSON.parse(msg.body);
      //       // console.log("resp",resp);
      //       // that.refreshAccount();
      //       this.historyOrder.rows.forEach((e)=>{
      //         if(e.orderId==reps.orderId){
      //           e = reps;
      //         }else{
                
      //         }
      //       })
      //     }
      //   );
      //   //订阅委托交易完成
      //  stompClient.subscribe("/topic/market/order-completed/" + this.currentCoin.symbol + "/" + this.member.id,
      //     function(msg) {
      //       var resp = JSON.parse(msg.body);
      //       this.historyOrder.rows.forEach((e)=>{
      //         if(e.orderId==reps.orderId){
      //           e = reps;
      //         }
      //       })
      //     }
      //   );
      //   //订阅委托部分交易
      //  stompClient.subscribe("/topic/market/order-trade/" + this.currentCoin.symbol + "/" + this.member.id,
      //     function(msg) {
      //       var resp = JSON.parse(msg.body);
      //       // that.refreshAccount();
      //       console.log("resp",resp);
      //     }
      //   );
     
     }
    },
    login(){
      this.$router.push("/login");
    },
    getCurrentOrder() {
      //查询当前委托
      let params = {};
      params["pageNo"] = 1;
      params["pageSize"] = 100;
      params["symbol"] = this.currentCoin.symbol;
      // this.currentOrder.rows = [];
      this.$http.post(this.host + '/seconds/order/current', params).then(response => {
        let resp = response.body;
        if (resp.content && resp.content.length > 0) {
          let rows = resp.content;
          rows.forEach((row, index) => {
            row.skin = this.skin;
            row.price = row.type == "MARKET_PRICE" ? this.$t("exchange.marketprice") : row.price;
          });
          this.currentOrder.rows = rows;
        }
      });
    },
    getHistoryOrder() {
      // this.historyOrder.rows = []; //清空数据
      let params = {};
      params["pageNo"] = 1;
      params["pageSize"] = 100;
      params["symbol"] = this.currentCoin.symbol;
      this.$http.post(this.host + '/seconds/order/history', params).then(response => {
        let resp = response.body;
        let rows = [];
        if (resp.content&&resp.content.length > 0) {
          this.historyOrder.total = resp.totalElements;
          this.historyOrder.page = resp.number;
          for (let i = 0; i < resp.content.length; i++) {
            let row = resp.content[i];
            if (row) {
              row.skin = this.skin;
              row.price = row.type == "MARKET_PRICE" ? this.$t("exchange.marketprice"): row.price;
              rows.push(row);
            }
          }
          this.historyOrder.rows = rows;
        }
      });
    },
    updateLangData() {
      this.currentOrder.columns[1].title = this.$t("exchange.time");
      this.currentOrder.columns[2].title = this.$t("exchange.symbol");
      this.currentOrder.columns[3].title = this.$t("exchange.type");
      this.currentOrder.columns[4].title = this.$t("exchange.direction");
      this.currentOrder.columns[5].title = this.$t("exchange.price");
      this.currentOrder.columns[6].title = this.$t("exchange.num");
      this.currentOrder.columns[7].title = this.$t("exchange.traded");
      this.currentOrder.columns[8].title = this.$t("exchange.dealamount");
      this.currentOrder.columns[9].title = this.$t("exchange.action");

      this.historyOrder.columns[1].title = this.$t("exchange.time");
      this.historyOrder.columns[2].title = this.$t("exchange.symbol");
      this.historyOrder.columns[3].title = this.$t("exchange.type");
      this.historyOrder.columns[4].title = this.$t("exchange.direction");
      this.historyOrder.columns[5].title = this.$t("exchange.price");
      this.historyOrder.columns[6].title = this.$t("exchange.num");
      this.historyOrder.columns[7].title = this.$t("exchange.done");
      this.historyOrder.columns[8].title = this.$t("exchange.dealamount");
      this.historyOrder.columns[9].title = this.$t("exchange.status");
    },
    changeOrder(str) {
      this.selectedOrder = str;
      this.getHistoryOrder();
      this.getCurrentOrder();
    },
    orderDetailCurrent(currentRow){
      sessionStorage.setItem("ORDER_DETAIL", JSON.stringify({type:'current',currentRow:currentRow}));
      this.$router.push("/orderDetail");
    },
    orderDetailHistory(currentRow){
      sessionStorage.setItem("ORDER_DETAIL", JSON.stringify({type:'history',currentRow:currentRow}));
      this.$router.push("/orderDetail");
    }
  }
};
</script>