<style lang="scss" scoped>
/deep/ .ivu-form .ivu-form-item-label {
    font-size: 14px;
    color: #fff;
}

/deep/ td.ivu-table-expanded-cell {
    padding: 20px 20px;
    background: #f8f8f9;
}
/deep/ .ivu-input{
    height: 40px;
    font-size: 14px;
}
/deep/ .ivu-table-wrapper {
    background-color: #000000;
    border: none;
}
/deep/ .ivu-table:before{
  content:unset;
}   
/deep/ .ivu-table:after{
  content:unset;
}
/deep/ .ivu-table-wrapper .ivu-table-body td .ivu-table-cell p .ivu-btn.ivu-btn-default {
    border: 1px solid #2c384f;
    background: #222c3e;
}
/deep/ .ivu-table-wrapper .ivu-table .ivu-table-row td {
    border: none;
    border-bottom: 1px solid #27313e;
}
/deep/ .ivu-table td {
    background: transparent!important;
}
/deep/ .ivu-table-wrapper .ivu-table .ivu-table-header th {
    background-color: #27313e;
    border: none;
    color: #fff;
}
/deep/ td.ivu-table-expanded-cell {
    padding: 20px;
    background: #f8f8f9;
}
/deep/ .ivu-table-wrapper .ivu-table {
    box-shadow: 0 0 4px #27313e;
    background-color: #000000;
    color: #ccc;
}
.daterange{
  /deep/ .ivu-select-dropdown {
      background-color: #000000;
  }
}
.entrustcurrent {
  // float: left;
  width: 100%;
  padding: 5px;
}

.page {
  text-align: right;
  margin-top: 20px;
}
.table {
  border-radius: 4px;
}
.table .ivu-table-wrapper {
  position: relative;
  /* border: 1px solid #dddee1; */
  border-bottom: 0;
  border-right: 0;
  // box-shadow: 0 0 2px #ccc;
  border-radius: 4px;
  // overflow: hidden;
}
.form.ivu-form-inline .ivu-form-item {
  display: inline-block;
}
</style>
<style lang="scss">
.entrustcurrent .ivu-table th,
.entrustcurrent .ivu-table td {
  text-align: center;
}
.table .ivu-table-cell-expand {
  color: #f0a70a;
}
</style>

<template>
  <div class="entrustcurrent">
    <Form class="form" :model="formItem" :label-width="85" inline>
      
      <div class="form-search daterange" style="text-align: left;">
      <FormItem :label="$t('uc.finance.trade.start_date')">
        <DatePicker type="date" v-model="formItem.startTime" style="width:180px;"></DatePicker>
      </FormItem>
      <FormItem :label="$t('uc.finance.trade.end_date')">
        <DatePicker type="date" v-model="formItem.endTime" style="width:180px;"></DatePicker>
      </FormItem>
      </div>

      <div class="form-search" style="text-align: left;">
      <FormItem :label="$t('uc.finance.trade.symbol')">
        <Select v-model="formItem.symbol" style="width:180px;" :placeholder="$t('common.pleaseselect')">
          <Option v-for="(item,index) in symbol " :value="item.symbol " :key="index">{{item.symbol}}</Option>
        </Select>
      </FormItem>
      </div>

      <div class="form-search" style="text-align: left;">
      <FormItem :label="$t('uc.finance.trade.type')">
        <Select v-model="formItem.type" style="width:180px;" :placeholder="$t('common.pleaseselect')">
          <Option value="LIMIT_PRICE">{{$t('uc.finance.trade.limit')}}</Option>
          <Option value="MARKET_PRICE">{{$t('uc.finance.trade.market')}}</Option>
        </Select>
      </FormItem>

      <FormItem :label="$t('uc.finance.trade.direction')">
        <Select v-model="formItem.direction" style="width:180px;" :placeholder="$t('common.pleaseselect')">
          <Option value="0">{{$t('uc.finance.trade.buy')}}</Option>
          <Option value="1">{{$t('uc.finance.trade.sell')}}</Option>
        </Select>
      </FormItem>

      <FormItem>
        <Button type="warning" @click="handleSubmit">{{$t('uc.finance.trade.search')}}</Button>
        <Button style="margin-left: 8px " @click="handleClear " class="clear_btn">Clear</Button>
      </FormItem>
      </div>
    </Form>
    <div class="table">
      <Table :no-data-text="$t('common.nodata')" :columns="columns " :data="orders" :loading="loading"></Table>
      <div class="page">
        <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
var moment = require("moment");
import expandRow from "@components/expand/current.vue";

export default {
  components: { expandRow },
  data() {
    const self = this;
    return {
      loading: false,
      pageSize: 10,
      pageNo: 1,
      total: 10,
      symbol: [],
      formItem: {
        symbol: "",
        type: "",
        direction: "",
        date: "",
        startTime:"",
        endTime:""
      },
      columns: [
        {
          type: "expand",
          width: 30,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                skin: params.row.skin,
                rows: params.row
              }
            });
          }
        },
        // {
        //   title: self.$t("exchange.time"),
        //   key: "time",
        //   minWidth: 55,
        //   render: (h, params) => {
        //     return h("span", {}, this.dateFormat(params.row.time));
        //   }
        // },
        {
          title: self.$t("uc.finance.trade.symbol"),
          width: 100,
          key: "symbol"
        },
        // {
        //   title: self.$t("uc.finance.trade.type"),
        //   width: 70,
        //   render(h, params) {
        //     return h(
        //       "span",
        //       params.row.type === "LIMIT_PRICE" ? self.$t("exchange.limited_price") : self.$t("exchange.market_price")
        //     );
        //   }
        // },
        // {
        //   title: self.$t("exchange.direction"),
        //   key: "direction",
        //   width: 90,
        //   render: (h, params) => {
        //     const row = params.row;
        //     const className = row.direction.toLowerCase();
        //     return h(
        //       "span",
        //       {
        //         attrs: {
        //           class: className
        //         }
        //       },
        //       row.direction == "BUY"
        //         ? self.$t("exchange.buyin")
        //         : self.$t("exchange.sellout")
        //     );
        //   }
        // },
        {
          title: self.$t("exchange.price"),
          key: "price",
          render(h, params) {
            return h(
              "span",
              {
                attrs: {
                  title: params.row.price
                }
              },
              self.toFloor(params.row.price)
            );
          }
        },
        // {
        //   title: self.$t("exchange.num"),
        //   key: "amount",
        //   render(h, params) {
        //     return h(
        //       "span",
        //       {
        //         attrs: {
        //           title: params.row.amount
        //         }
        //       },
        //       self.toFloor(params.row.amount)
        //     );
        //   }
        // },
        // {
        //   title: self.$t("exchange.traded"),
        //   key: "tradedAmount",
        //   render(h, params) {
        //     return h(
        //       "span",
        //       {
        //         attrs: {
        //           title: params.row.tradedAmount
        //         }
        //       },
        //       self.toFloor(params.row.tradedAmount)
        //     );
        //   }
        // },
        {
          title: self.$t("uc.finance.trade.turnover"),
          key: "turnover",
          render(h, params) {
            return h(
              "span",
              {
                attrs: {
                  title: params.row.turnover
                }
              },
              self.toFloor(params.row.turnover)
            );
          }
        },
        {
          title: self.$t("exchange.action"),
          key: "operate",
          width: 110,
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  size: "small"
                },
                style: {
                  border: "1px solid #f0ac19",
                  color: "#f1ac19",
                  "line-height": "1.2",
                  "border-radius": "10px"
                },
                on: {
                  click: () => {
                    // console.log("======开始撤单")
                    self.cancel(params.row.orderId);
                  }
                }
              },
              self.$t("exchange.undo")
            );
          }
        }
      ],
      orders: []
    };
  },
  computed:{
    lang: function() {
      return this.$store.state.lang;
    }
  },
  watch: {
    lang: function() {
      this.updateLangData();
    }
  },
  created() {
    this.getHistoryOrder();
    this.getSymbol();
  },
  methods: {
    dateFormat: function(tick) {
      return moment(tick).format("YYYY-MM-DD HH:mm:ss");
    },
    timeFormat: function(tick) {
      return moment(tick).format("HH:mm:ss");
    },
    loadDataPage(data) {
      this.pageNo = data;
      this.getHistoryOrder();
    },
    handleSubmit() {
      this.pageNo = 1;
      this.getHistoryOrder();
    },
    handleClear() {
      this.formItem = {
        symbol: "",
        type: "",
        direction: "",
        date: "",
        startTime:"",
        endTime:""
      };
    },
    getHistoryOrder() {
      //查询历史委托
      this.loading = true;
      const { symbol, type, direction, date: rangeDate } = this.formItem;


      let startTime = new Date(this.startTime).getTime() || "";
      let endTime = new Date(this.endTime).getTime() || "";

      let params = {};
      if (symbol) params.symbol = symbol;
      if (direction) params.direction = direction;
      if (type) params.type = type;
      if (startTime) params.startTime = startTime;
      if (endTime) params.endTime = endTime;
      params.pageNo = this.pageNo;
      params.pageSize = this.pageSize;
      var that = this;
      this.orders = [];
      this.$http
        .post(this.host + "/exchange/order/personal/current", params)
        .then(response => {
          var resp = response.body;
          let rows = [];
          if (resp.content.length > 0) {
            this.total = resp.totalElements;
            for (var i = 0; i < resp.content.length; i++) {
              var row = resp.content[i];
              row.price =
                row.type == "MARKET_PRICE"
                  ? that.$t("exchange.marketprice")
                  : row.price;
              rows.push(row);
            }
            this.orders = rows;
            console.log(this.orders);
          }
          this.loading = false;
        });
    },
    getSymbol() {
      this.$http.post(this.host + this.api.market.thumb, {}).then(response => {
        var resp = response.body;
        if (resp.length > 0) {
          this.symbol = resp;
        }
      });
    },
    cancel(orderId) {
      this.$Modal.confirm({
        content: this.$t("exchange.undotip"),
        onOk: () => {
          this.$http
            .post(this.host + this.api.exchange.orderCancel + "/" + orderId, {})
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.getHistoryOrder();
              } else {
                this.$Notice.error({
                  title: this.$t("exchange.tip"),
                  desc: resp.message
                });
              }
            });
        }
      });
    },
    updateLangData(){
      this.columns[1].title = this.$t("exchange.time");
      this.columns[2].title = this.$t("uc.finance.trade.symbol");
      this.columns[3].title = this.$t("uc.finance.trade.type");
      this.columns[4].title = this.$t("exchange.direction");
      this.columns[5].title = this.$t("exchange.price");
      this.columns[6].title = this.$t("exchange.num");
      this.columns[7].title = this.$t("exchange.traded");
      this.columns[8].title = this.$t("uc.finance.trade.turnover");
      this.columns[9].title = this.$t("exchange.action");
    }
  }
};
</script>

