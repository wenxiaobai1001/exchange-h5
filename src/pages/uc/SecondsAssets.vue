<template>
 <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.finance.secondsAssets')"></PageHeader>
    <div class="page-content">
      <div class="page-exchangemoney">
        <div class="page-exchangemoney-title">
          <div class="page-exchangemoney-title-assets">
            <span style="font-size:14px;color:#828ea1;">{{$t('uc.finance.seconds.secondsAssets')}}</span>
            <span style="font-size:18px;color:#4f565e;">${{totalUSDT}}</span>
          </div>
          <div class="page-exchangemoney-title-btn">
            <Button type="warning" @click="onTransferClick">{{$t('uc.finance.swap.transfor')}}</Button>
          </div>
        </div>
      </div>
      <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsColumns" :data="tableMoney" :disabled-hover="true"></Table>
    </div>

    <Modal v-model="transferModal" :title="$t('uc.finance.swap.transfor') + ' - USDT'">
      <div style="width: 100%; min-height: 32px;margin-top: 15px;">
        <div style="width: 45%;display: inline-flex;height:32px;line-height: 32px;float:left;">
          <Select v-model="walletOne" style="width: 150px;" :placeholder="$t('uc.finance.swap.currencyaccount') + ' (USDT)'">
            <Option v-for="item in walletOneList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </div>

        <div v-if="transferDirection == 1" @click="changeTo(2)" style="width: 10%;float: left;text-align: center;font-size:18px;height: 30px; line-height:30px;font-weight: bold;color:"> <Tooltip :content="$t('uc.finance.swap.clickchange')"><Icon style="font-weight:bold;color:#19be6b;" type="md-arrow-forward" /></Tooltip> </div>

        <div v-if="transferDirection == 2" @click="changeTo(1)" style="width: 10%;float: left;text-align: center;font-size:18px;height: 30px; line-height:30px;font-weight: bold;color:"> <Tooltip :content="$t('uc.finance.swap.clickchange')"><Icon style="font-weight:bold;color:#19be6b;" type="md-arrow-back" /></Tooltip> </div>

        <div style="width: 45%;display: inline-flex;height:32px;line-height: 32px;float: right;">
          <Select v-model="walletTwo" style="width: 150px;" :placeholder="$t('uc.finance.seconds.secondsaccount')" @on-change="onChangeTwo">
            <Option v-for="item in myTableMoney" :value="item.id" :key="item.id">{{item.baseSymbol}}{{$t("uc.finance.seconds.secondsaccount")}}</Option>
          </Select>
        </div>
      </div>
      <div style="width: 100%; min-height: 20px;margin-top: 0px;font-size: 10px;color:rgb(97, 104, 138);">
        <div style="width: 50%;height:20px;line-height: 20px;float:left;text-align: left;">
          {{$t('uc.finance.swap.avaamount')}}：{{assetsWallet.balance | fixed2}}
        </div>
        <div style="width: 50%;height:20px;line-height: 20px;float: right;text-align: right;">
          {{$t('uc.finance.swap.avaamount')}}：{{assetsWallet.avaBalance | fixed2}}
        </div>
      </div>
      <p style="margin-top: 15px;">{{$t('uc.finance.swap.inputtransferamount')}}:
        <InputNumber :min="0" style="width: 100%;" type="text" v-model="transferAmount" :placeholder="$t('uc.finance.swap.inputtransferamount')"></InputNumber>
        <!-- <span class="trans-all-btn" @click="onTransAll">{{$t('uc.finance.swap.all')}}</span> -->
      </p>

      <div slot="footer">
          <Button size="large" @click="transferModal = false">{{$t("common.close")}}</Button>
          <Button type="primary" size="large" @click="confirmOk">{{$t("uc.finance.swap.oktransfer")}}</Button>
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
      loginmsg: this.$t("common.logintip"),
      loading: true,
      ordKeyword: "",
      myTableMoney: [],
      tableMoney: [],
      searchKey: "",
      transferModal: false,
      transferDirection: 1,
      walletOne: null,
      walletTwo: null,
      transferAmount: 0,
      predictAmount: 0,
      walletTwoList: [],
      walletOneList: [this.$t('uc.finance.swap.currencyaccount') + ' (USDT)'],
      assetsWallet: {
        id: 0,
        balance: 0,
        avaBalance: 0
      },
      swapWallet: {
        id: 0,
        avaBalance: 0
      },
    };
  },
  methods: {
    seachInputChange(){
      this.tableMoney = this.tableMoney.filter(item => item["symbol"].indexOf(this.searchKey) == 0);
    },
    getMoney() {
      //获取
      this.$http.post(this.host + "/seconds/wallet").then(response => {
        var resp = response.body;
        this.tableMoney = resp.data;
      });
    },
    getAssets() {
      //获取
      this.$http.post(this.host + "/seconds/coins").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.assetsWallet = resp.data[0];
          this.walletTwo = this.assetsWallet.id;
          this.walletOne = this.$t('uc.finance.swap.currencyaccount') + ' ('+this.assetsWallet.baseSymbol+')';
          this.walletOneList = [this.$t('uc.finance.swap.currencyaccount') + ' ('+this.assetsWallet.baseSymbol+')'];
          this.myTableMoney = resp.data;
        } else {
          this.$Message.error(this.loginmsg);
        }
      });
    },
    onTransferClick() {
      this.transferModal = true;
    },
    changeTo(val) {
      this.transferDirection = val;
      this.transferAmount = 0.00;
    },
    confirmOk() {
      if(this.assetsWallet.id == 0) {
        this.$Message.error(this.$t('uc.finance.swap.pleaseselectwallet'));
        return;
      }
      if(this.transferAmount <= 0 || this.transferAmount == "" || this.transferAmount == undefined) {
        this.$Message.error(this.$t('uc.finance.swap.pleaseinputamount'));
        return;
      }

      let params = {
        unit: this.assetsWallet.baseSymbol,
        from: this.transferDirection == 1 ? 0 : 1,
        to: this.transferDirection == 1 ? 1 : 0,
        transferDirection: this.transferDirection,
        amount: this.transferAmount
      };

      this.$http.post(this.host + "/seconds/trans", params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          console.log(resp.data);
          this.getMoney();
          this.getAssets();
          this.onChangeTwo();
        } else {
          // this.$Message.error(this.loginmsg);
          this.$Message.error(resp.message);
        }
      });
      this.transferModal = false;
    },
    onChangeTwo(){
      for (let i = 0; i < this.myTableMoney.length; i++) {
        if(this.myTableMoney[i].id == this.walletTwo) {
          this.swapWallet = this.myTableMoney[i];
          this.assetsWallet = this.myTableMoney[i];
          this.walletOne = this.$t('uc.finance.swap.currencyaccount') + ' ('+this.assetsWallet.baseSymbol+')';
          this.walletOneList = [this.$t('uc.finance.swap.currencyaccount') + ' ('+this.assetsWallet.baseSymbol+')'];
        }
      }
    },
    onTransAll() {
      if(this.transferDirection == 1) {
        this.transferAmount = this.assetsWallet.balance;
      }else{
        this.transferAmount = this.swapWallet.avaBalance;
      }
    }
  },
  created() {
    this.getMoney();
    this.getAssets();
  },
  filters:{
    fixed2: function(value){
      return value.toFixed(2);
    }
  },
  computed: {
    totalUSDT() {
      let usdtTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        let rate = this.tableMoney[i].usdRate;
        rate = rate||1;
        usdtTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * rate;
      }
      return usdtTotal.toFixed(2);
    },
    tableColumnsColumns() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.finance.seconds.symbol"),
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.baseSymbol
              }
            },
            params.row.baseSymbol.replace("/", ""),
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.swap.avabalance"),
        key: "balance",
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.balance
              }
            },
            self.toFloor(params.row.balance.toFixed(4) || "0")
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.swap.frozenbalance"),
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.frozenBalance
              }
            },
            self.toFloor(params.row.frozenBalance.toFixed(4) || "0")
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
</style>
