<template>
<div class="page-home">
  <PageHeader :title="$t('uc.member.hisdelegate')"></PageHeader> 
  <div class="page-content">
    <div class="entrusthistory">
      <Form class="form" :model="formItem" :label-width="85" inline>
        <div style="text-align: left;" class="daterange">
        <FormItem :label="$t('uc.finance.trade.start_end')">
          <DatePicker type="date" v-model="formItem.startTime" style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker type="date" v-model="formItem.endTime" style="width:180px;"></DatePicker>
        </FormItem>
        </div>

        <div style="text-align: left;">
        <FormItem :label="$t('uc.finance.trade.symbol')">
          <Select v-model="formItem.symbol" style="width:180px;" :placeholder="$t('common.pleaseselect')">
            <Option v-for="(item,index) in symbol" :key="index" :value="item.symbol">{{item.symbol}}</Option>
          </Select>
        </FormItem>
        </div>
        
        <div style="text-align: left;">
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
          <Button style="margin-left: 8px" @click="handleClear" class="clear_btn">Clear</Button>
        </FormItem>
        </div>
      </Form>
      <div class="table">
        <Table :no-data-text="$t('common.nodata')" :columns="columns" :data="orders" :loading="loading"></Table>
        <div class="page">
          <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
var moment = require("moment");
import expandRow from "@components/expand/history.vue";
import PageHeader from '@/components/header/index.vue';
export default {
  components: { expandRow, PageHeader},
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
          type:"expand",
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
        // {
        //   title: self.$t("exchange.time"),
        //   key: "time",
        //   minWidth: 55,
        //   render: (h, params) => {
        //     return h("span", {}, self.dateFormat(params.row.time));
        //   }
        // },
        {
          title:  self.$t("uc.finance.trade.symbol"),
          width: 110,
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
        // {
        //   title: self.$t("exchange.price"),
        //   key: "price",
        //   render(h, params) {
        //     return h(
        //       "span",
        //       {
        //         attrs: {
        //           title: params.row.price
        //         }
        //       },
        //       self.toFloor(params.row.price)
        //     );
        //   }
        // },
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
        //   title: self.$t("exchange.done"),
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
          title: self.$t("exchange.status"),
          key: "status",
          // width: 80,
          render: (h, params) => {
            const status = params.row.status;
            if (status == "COMPLETED") {
              return h(
                "span",
                {
                  style: {
                    color: "#f0a70a"
                  }
                },
                self.$t("exchange.finished")
              );
            } else if (status == "CANCELED") {
              return h(
                "span",
                {
                  style: {
                    color: "#f0a70a"
                  }
                },
                self.$t("exchange.canceled")
              );
            } else {
              return h("span", {}, "--");
            }
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
        .post(this.host + "/exchange/order/personal/history", params)
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
    updateLangData(){
      this.columns[1].title = this.$t("exchange.time");
      this.columns[2].title = this.$t("uc.finance.trade.symbol");
      this.columns[3].title = this.$t("uc.finance.trade.type");
      this.columns[4].title = this.$t("exchange.direction");
      this.columns[5].title = this.$t("exchange.price");
      this.columns[6].title = this.$t("exchange.num");
      this.columns[7].title = this.$t("exchange.traded");
      this.columns[8].title = this.$t("uc.finance.trade.turnover");
      this.columns[9].title = this.$t("exchange.status");
    }
  }
};
</script>
<style lang="scss" scoped>
.page-home{
  height: 100%;
  .page-content{
    height: 100%;
    padding-top: 50px;
  }
}
</style>
