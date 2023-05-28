<template>
  <div class="nav-rights">
    <div class="nav-right col-xs-12 col-md-10 padding-right-clear">
      <div class="bill_box rightarea padding-right-clear">
        <div class="shaow">
          <div class="money_table">
            <div style="width: 100%;height: 50px;">
              <div style="float:left;letter-spacing:1px;padding-top: 5px;">
                  <span style="font-size:12px;color:#828ea1;">{{$t('uc.finance.money.totalassets')}}</span>
                  <span style="font-size: 18px;color:#D8E1EB;">${{totalUSDT}}</span>
                  <!-- <span style="font-size:10px;color:#828ea1;margin-left: 5px;"> ≈ ¥{{totalCny}}</span> -->
              </div>
            </div>
            <div style="width: 100%;height: 50px;">
              <Input style="float:right;" search enter-button class="search" autocomplete="off" :placeholder="$t('common.searchplaceholder')" @on-search="seachInputChange" v-model="searchKey"/>
            </div>
            <div style="width: 100%;height: 50px;">
              <Button @click="toQuickExchange" type="warning" style="padding: 6px 30px;margin-right:30px;background-color:#f0a70a;border-color:#f0a70a;float:right;">{{$t('uc.finance.record.quickExchange')}}</Button>
            </div>
            <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsMoney" :data="tableMoneyShow" :loading="loading" :disabled-hover="true"></Table>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal" ok-text="OK" cancel-text="Cancel" :title="$t('uc.finance.money.match')" @on-ok="matchGCC">
      <P style="font-weight: bold;padding: 10px 0;">{{$t('uc.finance.money.matchtip1')}}：{{GCCMatchAmount}}</p>
      <p>
        <span>{{$t('uc.finance.money.matchtip2')}}：</span>
        <InputNumber style="width: 150px;" type="text" v-model="matchAmount" :placeholder="$t('uc.finance.money.matchtip2')"></InputNumber>
      </p>
    </Modal>
    <Modal v-model="modal_msg" ok-text="OK" cancel-text="Cancel" :title="$t('uc.finance.money.match')">
      <p>{{match_msg}}</p>
    </Modal>
    <Modal v-model="transModal"  @on-ok="confrimTrans" ok-text="OK" cancel-text="Cancel" :title="$t('uc.finance.money.onkeytrans')">
      <p>{{$t('uc.finance.record.chooseTransCoinUnit')}}：
        <Select v-model="toUnit" style="width: 100%;" :placeholder="$t('common.pleaseselect')">
          <Option v-for="item in transList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.inputTransAmount')}}：
        <InputNumber style="width: 100%;" type="text" v-model="transAmount" :placeholder="$t('uc.finance.money.matchtip2')"></InputNumber>
      </p>
    </Modal>
    <Modal class="quickExchangeModal" v-model="quickExchangeModal"  @on-ok="confrimExchange" ok-text="OK" cancel-text="Cancel" :title="$t('uc.finance.record.quickExchange')">
      <h2 style="text-align:center;color: #45b854">{{$t('uc.finance.record.currentRate')}}： <span style="color: #45b854">{{priceRate | fixed2}} </span></h2>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.from')}}：
        <Select v-model="fromExchangeCoin" style="width: 80%;" :placeholder="$t('common.pleaseselect')">
          <Option v-for="item in fromCoinList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.to')}}：
        <Select v-model="toExchangeCoin" style="width: 80%;" :placeholder="$t('common.pleaseselect')">
          <Option v-for="item in toCoinList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.inputexchangeamount')}}:
        <InputNumber style="width: 80%;" type="text" v-model="exchangeAmount" :placeholder="$t('uc.finance.record.inputexchangeamount')"></InputNumber>
        <span style="margin-left: 10px;font-weight: bold;">{{fromExchangeCoin}}</span>
      </p>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.predictAmount')}}:
        <InputNumber style="width: 80%;" disabled type="text" v-model="predictAmount"></InputNumber>
        <span style="margin-left: 10px;font-weight: bold;">{{toExchangeCoin}}</span>
      </p>
      <p style="margin-top: 15px;">{{$t('uc.finance.record.inputexchangepasswd')}}:
        <Input style="width: 80%;" type="password" v-model="exchangePassword" :placeholder="$t('uc.finance.record.inputexchangepasswd')"></Input>
      </p>
    </Modal>
  </div>
</template>

<script>
import expandRow from "@components/expand/money.vue";

export default {
  components: { expandRow},
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
      fromExchangeCoin: "CDEA",
      toExchangeCoin: "USDT",
      fromCoinList: ["CDEA"],
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
    toQuickExchange(){
      this.quickExchangeModal = true;
      this.getRate();
    },
    confrimExchange(){
      let params = {};
      params["toUnit"] = this.toExchangeCoin;
      params["fromUnit"] = this.fromExchangeCoin;
      params["amount"] = this.exchangeAmount;
      params["jyPassword"] = this.exchangePassword;
      params["priceRate"] = this.priceRate||7;

      this.$http
        .post(this.host + "/uc/asset/wallet/quick-exchange", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
          this.quickExchangeModal = false;
          this.getMoney();
        });
      return false;
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
    getGCCMatchAmount() {
      //获取
      this.$http
        .post(this.host + "/uc/asset/wallet/match-check")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.canMatch = true;
            this.GCCMatchAmount = resp.data;
          } else {
            this.canMatch = false;
            this.match_msg = resp.message;
            // this.$Message.error(this.loginmsg);
          }
          this.showMatchDailog();
        });
    },
    getRate(){
      this.$http
        .post(this.host + "/market/rate-usdt")
        .then(response => {
          var resp = response.body;
          this.priceRate = resp.data.buy;
        });
    },
    showMatchDailog() {
      if (this.canMatch) this.modal = true;
      else this.modal_msg = true;
    },
    matchGCC() {
      if (this.matchAmount <= 0) {
        this.$Message.warning(this.$t("uc.finance.money.matcherr1"));
      } else if (this.matchAmount > this.GCCMatchAmount) {
        this.$Message.warning(this.$t("uc.finance.money.matcherr2"));
      } else {
        //配对
        let params = {};
        params["amount"] = this.matchAmount;
        this.$http
          .post(this.host + "/uc/asset/wallet/match", params)
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.success(this.$t("uc.finance.money.matchsuccess"));
              this.GCCMatchAmount = this.GCCMatchAmount - this.matchAmount;
            } else {
              this.$Message.error(resp.message);
            }
            this.getMoney();
          });
      }
    },
    resetAddress(unit) {
      this.$router.push("/uc/recharge?name=" + unit);
    },
    confrimTrans: function(){
      let params = {};
      params["toUnit"] = this.toUnit;
      params["fromUnit"] = this.fromUnit;
      params["amount"] = this.transAmount;
      this.$http
        .post(this.host + "/uc/asset/wallet/trans-usd", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
          this.transModal = false;
          this.getMoney();
        });
      return false;
    }
  },
  created() {
    this.getMoney();
    this.getRate();
  },
  mounted(){
    this.searchKey = "";
  },
  watch: {
    exchangeAmount: function(val) {
      let seltAmount = val*this.priceRate;
      this.predictAmount = parseFloat(seltAmount.toFixed(2));
    }
  },
  computed: {
    totalUSDT() {
      let usdtTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        usdtTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * this.tableMoney[i].coin.usdRate;
      }
      return usdtTotal.toFixed(2);
    },
    totalCny(){
      let cnyTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        cnyTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * this.tableMoney[i].coin.cnyRate;
      }
      return cnyTotal.toFixed(2);
    },
    tableColumnsMoney() {
      let self = this;
      let columns = [];
      
      columns.push({
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
      });

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
      // columns.push({
      //   title: this.$t("uc.finance.money.frozen"),
      //   key: "frozenBalance",
      //   align: "center",
      //   width: 130,
      //   render(h, params) {
      //     return h(
      //       "span",
      //       {
      //         attrs: {
      //           title: params.row.frozenBalance
      //         }
      //       },
      //       self.toFloor(params.row.frozenBalance || "0")
      //     );
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.money.needreleased"),
      //   align: "center",
      //   width: 160,
      //   render(h, params) {
      //     return h(
      //       "span",
      //       {
      //         attrs: {
      //           title: params.row.toReleased
      //         }
      //       },
      //       self.toFloor(params.row.toReleased || "0")
      //     );
      //   }
      // });
      columns.push({
        title: this.$t("uc.finance.money.operate"),
        key: "price1",
        align: "center",
        render: function(h, params) {
          var actions = [];
          if (params.row.coin.canRecharge == 1) {
            if ( (params.row.address != null && params.row.address != "") || (params.row.coin.accountType == 1)) {
              // 充币
              actions.push(
                h(
                  "Button",
                  {
                    // 充币;
                    props: {
                      type: "info",
                      size: "small"
                    },
                    on: {
                      click: function() {
                        self.$router.push( "/uc/recharge?name=" + params.row.coin.unit);
                      }
                    },
                    style: {
                      margin: "2px",width:"84px"
                    }
                  },
                  self.$t("uc.finance.money.charge")
                )
              );
            } else {
              //   获取地址按钮;
              actions.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small"
                    },
                    on: {
                      click: function() {
                        self.resetAddress(params.row.coin.unit);
                      }
                    },
                    style: {
                      margin: "2px",width:"84px"
                    }
                  },
                  self.$t("uc.finance.money.charge")
                )
              );
            }
          }else{
            actions.push(
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    disabled: true
                  },
                  on: {
                    click: function() {

                    }
                  },
                  style: {
                    margin: "2px",width:"84px"
                  }
                },
                self.$t("uc.finance.money.charge")
              )
            );
          }
          if (params.row.coin.canWithdraw == 1) {
            // 提币;
            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: function() {
                      self.$router.push("/uc/withdraw?name=" + params.row.coin.unit);
                    }
                  },
                  style: {
                    margin: "2px",width:"84px"
                  }
                },
                self.$t("uc.finance.money.pickup")
              )
            );
          }else{
            actions.push(
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    disabled: true
                  },
                  on: {
                    click: function() {

                    }
                  },
                  style: {
                    margin: "2px",width:"84px"
                  }
                },
                self.$t("uc.finance.money.pickup")
              )
            );
          }

          if(params.row.coin.unit == "USDT" || params.row.coin.unit == "EUSDT" || params.row.coin.unit == "TUSDT") {
            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    disabled: false
                  },
                  on: {
                    click: function() {
                      self.fromUnit = params.row.coin.unit;
                      self.transModal = true;
                    }
                  },
                  style: {
                    margin: "2px",width:"84px"
                  }
                },
                self.$t("uc.finance.money.onkeytrans")
              )
            );
          }

          return h("p", actions);
        }
      });
      return columns;
    }
  }
};
</script>
<style scoped lang="scss">
 .quickExchangeModal p {
      color: black;
  }

.nav-right {
 
  .money_table {
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
  }

  .rightarea.bill_box {
    .shaow {
      padding: 5px;
    }
    .money_table {
      .search{
        width: 100%;
        margin-bottom: 10px;
      }
      .ivu-table-wrapper {
        .ivu-table-header{
          background: #27313e;
          th{
            color: #fff;
          }
        }
        .ivu-table-body {
          td {
            color: #fff;
            .ivu-table-cell {
              padding: 10px 10px;
              p .ivu-btn {
                background: transparent;
                height: 25px;
                padding: 0 0px;
                border-radius: 0;
                span {
                  display: inline-block;
                  line-height: 20px;
                  font-size: 12px;
                  padding: 0 2px !important;
                  letter-spacing: 1px;
                }
              }
              p .ivu-btn.ivu-btn-info {
                border: 1px solid #f0ac19;
                span {
                  color: #f0ac19;
                }
              }
              p .ivu-btn.ivu-btn-error {
                border: 1px solid #f15057;
                span {
                  color: #f15057;

                }
              }
              p .ivu-btn.ivu-btn-primary {
                border: 1px solid #00b275;
                border: 1px solid #00b275;
                span {
                  color: #00b275;
                }
              }
              p .ivu-btn.ivu-btn-default {
                border: 1px solid #2c384f;
                background: #222c3e;
                span {
                  color: #54637a;
                }
              }
              p .ivu-btn.ivu-btn-success {
                border: 1px solid #32ad00;
                span {
                  color: #32ad00;
                }
              }
            }
          }
        }
      }
    }
  }
}

.ivu-input-number-disabled .ivu-input-number-input{
  background: transparent!important;
}
</style>

<style scoped lang="scss">
.nav-right {
  height: auto;
  overflow: hidden;
  padding: 0px;
  .rightarea.bill_box {
    // padding-left: 15px;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
}

.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@media screen and (max-width:768px){
  .search{
    // display: none;
  }
}

</style>
