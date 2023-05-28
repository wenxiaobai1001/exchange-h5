<template>
  <div class="page-home">
    <PageHeader :title="$t('uc.finance.personalassets')"></PageHeader>
    <div class="page-content">
      <div class="page-exchangemoney">
        <div class="page-exchangemoney-title">
          <div class="page-exchangemoney-title-assets">
              <span style="font-size:14px;color:#828ea1;">{{$t('uc.finance.money.totalassets')}}</span>
              <span style="font-size:18px;color:#4f565e;">${{totalUSDT}}</span>
          </div>
          <div class="page-exchangemoney-title-btn">
            <!-- <Button @click="toTransferExchange" type="warning" >{{$t('uc.finance.money.onkeytrans')}}</Button> -->
          </div>
        </div>
        <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsMoney" :data="tableMoneyShow" :loading="loading" :disabled-hover="true"></Table>
      </div>
    </div>

    <Modal class="transmoney" v-model="transModal" :title="$t('uc.finance.money.onkeytrans')">
      <div class="transmoney-item">
        <div class="transmoney-item-title"><span>{{$t('uc.finance.record.chooseTransCoinUnit')}}</span></div>
        <div class="transmoney-item-content">
          <div>
            <Select v-model="fromUnit" style="width: 150px;" :placeholder="$t('common.pleaseselect')">
              <Option v-for="item in transList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div>
          <Icon style="font-weight:bold;color:#19be6b;" type="md-arrow-forward" />
          <div>
            <Select v-model="toUnit" style="width: 150px;" :placeholder="$t('common.pleaseselect')">
              <Option v-for="item in transList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div>
        </div>
      </div>
      <div class="transmoney-item">
        <div class="transmoney-item-title">{{$t('uc.finance.record.inputTransAmount')}}</div>
        <div class="transmoney-item-content">
          <InputNumber style="width: 150px;" :min="0" type="text" v-model="transAmount" :placeholder="$t('uc.finance.money.matchtip2')"></InputNumber>
        </div>
      </div>
      <div slot="footer">
          <Button size="large" @click="transferModal = false">{{$t("common.close")}}</Button>
          <Button type="primary" size="large" @click="confrimTrans">{{$t("uc.finance.swap.oktransfer")}}</Button>
      </div>
    </Modal>
    
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader},
  data() {
    return {
      GCCMatchAmount: 0,
      matchAmount: 0,
      modal: false,
      loginmsg: this.$t("common.logintip"),
      loading: true,
      ordKeyword: "",
      tableMoney: [],
      tableMoneyShow: [],
      canMatch: true,
      modal_msg: false,
      match_msg: "",
      searchKey: "",
      transModal: false,
      toUnit: "",
      fromUnit: "",
      transAmount: 0,
      transList: ["USDT", "EUSDT", "TUSDT"],
      quickExchangeModal: false,
      toExchangeCoin: "USDT",
      toCoinList: ["USDT"],
      exchangeAmount: 0,
      exchangePassword: "",
      predictAmount: 0,
      priceRate: 7.0
    };
  },
  filters: {
    fixed2: function(value) {
      return value.toFixed(2);
    }
  },
  methods: {
    seachInputChange(){
      this.tableMoneyShow = this.tableMoney.filter(item => item["coinType"].indexOf(this.searchKey) == 0);
    },
    toTransferExchange(){
      this.transModal = true;
    },
    getMoney() {
      //获取
      this.$http.post(this.host + this.api.uc.mywallet,{},{
        emulateJSON: false,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.tableMoney = resp.data;
          this.tableMoney = this.tableMoney.filter(e=>{
            return e.coin.name!='TUSDT'&&e.coin.name!='EUSDT';
          });

          for (let i = 0; i < this.tableMoney.length; i++) {
            this.tableMoney[i]["coinType"] = this.tableMoney[i].coin.unit;
          }
          this.loading = false;
          this.tableMoneyShow = this.tableMoney;
        } else {
          this.$Message.error(this.loginmsg);
        }
      });
    },
    resetAddress(unit) {
      this.$router.push("/uc/recharge?name=" + unit);
    },
    confrimTrans: function(){
      let params = {};
      params["toUnit"] = this.toUnit;
      params["fromUnit"] = this.fromUnit;
      params["amount"] = this.transAmount;
      if(!this.fromUnit){
        this.$Message.error("Please choose coin");
        return;
      }
      if(!this.toUnit){
        this.$Message.error("Please choose coin");
        return;
      }
      if(!this.transAmount){
        this.$Message.error("Please input amount");
        return;
      }
      if(this.toUnit==this.fromUnit){
        this.$Message.error("Please choose different coin");
        return;
      }

      this.$http.post(this.host + "/uc/asset/wallet/trans-usd", params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.$Message.success(resp.message);
        } else {
          this.$Message.error(resp.message);
        }
        this.transModal = false;
        this.getMoney();
      });
    }
  },
  created() {
    this.getMoney();
  },
  watch: {
    exchangeAmount: function(val) {
      // this.predictAmount = val/this.priceRate;
      let seltAmount = val*this.priceRate;
      this.predictAmount = parseFloat(seltAmount.toFixed(2));
    }
  },
  computed: {
    totalUSDT() {
      let usdtTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        let rate = this.tableMoney[i].coin.usdRate;
        rate = rate||1;
        usdtTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * rate;
      }
      return usdtTotal.toFixed(2);
    },
    totalCny(){
      let cnyTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        let rate = this.tableMoney[i].coin.cnyRate;
        rate = rate||6.5;
        cnyTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * rate;
      }
      return cnyTotal.toFixed(2);
    },
    tableColumnsMoney() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.finance.money.cointype"),
        key: "coinType",
        width: 90,
        align: "center"
      });
      columns.push({
        title: this.$t("uc.finance.money.balance"),
        key: "balance",
        align: "center",
        width: 130,
        render(h, params) {
          return h(
            "span",
            {
              style: {
              },
              attrs: {
                title: params.row.balance
              }
            },
            self.toFloor(params.row.balance || "0")
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.money.frozen"),
        key: "frozenBalance",
        align: "center",
        width: 130,
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.frozenBalance
              }
            },
            self.toFloor(params.row.frozenBalance || "0")
          );
        }
      });
      return columns;
    }
  }
};
</script>

<style scoped lang="scss">
.page-home{
  height: 100%;
  .page-content{
    height: 100%;
    padding-top: 50px;
    // background-color: #fff;
    .page-exchangemoney {
      background-color: #fff;
      padding: 2%;
      // padding: 0 2%;
      .page-exchangemoney-title {
        padding: 5% 2%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .page-exchangemoney-title-assets {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          flex-direction: column;
        }
        .page-exchangemoney-title-btn {
          text-align: right;
          button.ivu-btn.ivu-btn-warning{
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
      /deep/ .ivu-table-wrapper{
        border: none;
        .ivu-table:before,.ivu-table:after{
          content: none;
        }
      }
    }
  }
}

.transmoney{
  .transmoney-item {
    font-size: 14px;
    margin: 5% 0;
    .transmoney-item-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    span:first-child {
      width: 150px;
      display: inline-block;
    }
  }
}
</style>
