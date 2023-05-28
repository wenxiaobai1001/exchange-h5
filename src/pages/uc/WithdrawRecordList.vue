<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.finance.withdraw.record')"></PageHeader> 
    <div class="page-content">
      <div class="page-withdrawrecord">
        <div class="order-table">
          <div class="actionMoblieTable">
              <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsWithdraw" :data="tableWithdraw" :loading="loading"></Table>
            </div>
          <div id="pages">
            <div style="float: right;">
              <Page class="pages_a" :total="transaction.total" :current="transaction.page + 1" @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import expandRow from "@components/expand/withdraw.vue";
import PageHeader from '@/components/header/index.vue';
export default {
  components: { expandRow,PageHeader},
  data() {
    return {
      user: {},
      codeIsSending: false,
      sendcodeValue: this.$t("uc.regist.sendcode"),
      countdown: 60,
      formInline: {
        code: "",
        fundpwd: ""
      },
      modal: false,
      fundpwd: "",
      currentCoin: {},
      transaction: {
        page: 0,
        pageSize: 10,
        total: 0
      },
      loading: true,
      withdrawAdress: "",
      inputAddress: "", //用户输入的地址
      withdrawAmount: 0,
      withdrawFee: 0,
      withdrawStep: 0.0001,
      withdrawOutAmount: 0,
      coinType: "",
      coinList: [],
      tableWithdraw: [],
      allTableWithdraw: []
    };
  },
  watch: {
    currentCoin: function() {
      this.withdrawFee = this.currentCoin.minTxFee;
      this.withdrawStep = (this.currentCoin.maxTxFee - this.currentCoin.minTxFee)/(Math.pow(10, this.currentCoin.withdrawScale));
      // this.withdrawFee = this.currentCoin.minTxFee +(this.currentCoin.maxTxFee - this.currentCoin.minTxFee) / 2;
    }
  },
  methods: {
    cancel() {
      this.modal = false;
      this.formInline.code = "";
      this.formInline.fundpwd = "";
    },
    sendCode() {
      this.settime();
      this.$http.post(this.host + "/uc/withdraw/email/code").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.$Notice.success({
            title: this.$t("common.tip"),
            desc: resp.message
          });
        } else {
          this.$Notice.error({
            title: this.$t("common.tip"),
            desc: resp.message
          });
        }
      });
    },
    settime() {
      this.sendcodeValue = this.countdown;
      this.codeIsSending = true;
      let timercode = setInterval(() => {
        this.countdown--;
        this.sendcodeValue = this.countdown;
        if (this.countdown <= 0) {
          clearInterval(timercode);
          this.sendcodeValue = this.$t("uc.regist.sendcode");
          this.countdown = 60;
          this.codeIsSending = false;
        }
      }, 1000);
    },
    changePage(index) {
      this.transaction.page = index - 1;
      this.getList();
    },
    onAddressChange(data) {
      this.inputAddress = data;
    },
    clearValues() {
      if (this.$refs.address) {
        this.$refs.address.setQuery(" ");
      }
      this.withdrawAdress = "";
      this.inputAddress = "";
      this.withdrawAmount = 0;
      // this.withdrawFee= 0;
      this.withdrawOutAmount = 0;
    },
    getCurrentCoinRecharge() {
      if (this.coinType != "") {
        var temp = [];
        for (var i = 0; i < this.allTableWithdraw.length; i++) {
          //   if (this.allTableWithdraw[i].symbol == this.coinType) {
          if (this.allTableWithdraw[i].coin.unit == this.coinType) {
            temp.push(this.allTableWithdraw[i]);
          }
        }
        this.tableWithdraw = temp;
      } else {
        this.tableWithdraw = this.allTableWithdraw;
      }
    },
    ok() {
      if (this.formInline.code == "") {
        this.modal = true;
        this.$Message.error("Please input message code!");
        return;
      }
      if (this.formInline.fundpwd == "") {
        this.modal = true;
        this.$Message.error(this.$t("otc.chat.msg7tip"));
        return;
      }
      let params = {};
      for (let i = 0; i < this.currentCoin.addresses; i++) {
        if(this.currentCoin.addresses[i].address == this.withdrawAdress){
          params["remark"] = this.currentCoin.addresses[i].remark;
        }
      }

      params["unit"] = this.currentCoin.unit;
      params["address"] = this.withdrawAdress;
      params["amount"] = this.withdrawAmount;
      params["fee"] = this.withdrawFee;
      params["jyPassword"] = this.formInline.fundpwd;
      params["code"] = this.formInline.code;
      this.$http
        .post(this.host + "/uc/withdraw/apply/codeNew", params)
        .then(response => {
          this.fundpwd = "";
          var resp = response.body;
          if (resp.code == 0) {
            this.modal = false;
            this.formInline.code = "";
            this.formInline.fundpwd = "";
            this.transaction.page = 0;
            this.getList();
            this.clearValues();
            this.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getAddrList() {
      // 初始化页面上的值
      this.clearValues();
      //获取地址
      this.$http
        .post(this.host + "/uc/withdraw/support/coin/info")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0 && resp.data.length > 0) {
            this.coinList = resp.data;
            if (this.coinType) {
              for (let i = 0; i < resp.data.length; i++) {
                if (this.coinType == resp.data[i].unit) {
                  this.currentCoin = resp.data[i];
                  break;
                }
              }
            } else {
              this.currentCoin = this.coinList[0];
              this.coinType = this.currentCoin.unit;
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getList() {
      this.loading = true;
      //获取tableWithdraw
      let params = {};
      params["page"] = this.transaction.page;
      params["pageSize"] = this.transaction.pageSize;
      this.$http
        .post(this.host + "/uc/withdraw/record", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.tableWithdraw = resp.data.content;
            this.transaction.total = resp.data.totalElements;
            this.transaction.page = resp.data.number;
          } else {
            this.$Message.error(resp.message);
          }
          this.loading = false;
        });
    },
    accSub(arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    round(v, e) {
      var t = 1;
      for (; e > 0; t *= 10, e--);
      for (; e < 0; t /= 10, e++);
      return Math.round(v * t) / t;
    },
    roundDecimal(x, n){
      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    },
    computerAmount() {
      if(this.withdrawFee > this.currentCoin.maxTxFee){
        this.withdrawFee = this.currentCoin.maxTxFee;
      }
      if(this.withdrawFee < this.currentCoin.minTxFee){
        this.withdrawFee = this.currentCoin.minTxFee;
      }

      if(this.withdrawAmount < this.currentCoin.minAmount){
        this.withdrawAmount = this.currentCoin.minAmount;
      }
      if(this.withdrawAmount > this.currentCoin.maxAmount){
        this.withdrawAmount = this.currentCoin.maxAmount;
      }

      this.withdrawFee = this.roundDecimal(this.withdrawFee, this.currentCoin.withdrawScale||4);

      console.log("this.currentCoin.withdrawScale",this.currentCoin.withdrawScale);
      this.withdrawOutAmount = this.round(
        this.accSub(this.withdrawAmount, this.withdrawFee),
        this.currentCoin.withdrawScale
      );
      // this.withdrawOutAmount = this.round(this.accSub(this.withdrawAmount, this.withdrawFee), 8);
    },
    computerAmount2() {
      this.withdrawAmount = (this.withdrawAmount + "").replace(/([0-9]+\.[0-9]{6})[0-9]*/, "$1") -0;
      this.withdrawOutAmount = this.round(
        this.accSub(this.withdrawAmount, this.withdrawFee),
        this.currentCoin.withdrawScale
      );
      // this.withdrawOutAmount = this.round(this.accSub(this.withdrawAmount, this.withdrawFee), 8);
    },
    valid() {
      this.withdrawAdress = this.withdrawAdress || this.inputAddress;
      if (this.coinType == "") {
        this.$Message.error(this.$t("uc.finance.withdraw.symboltip"));
        return false;
      } else if (this.withdrawAdress == "") {
        this.$Message.error(this.$t("uc.finance.withdraw.addresstip"));
        return false;
      } else if (
        this.withdrawAmount == "" ||
        this.withdrawAmount == 0 ||
        this.withdrawAmount - 0 < this.currentCoin.minAmount
      ) {
        this.$Message.error(
          this.$t("uc.finance.withdraw.numtip2") + this.currentCoin.minAmount
        );
        return false;
      } else if (this.withdrawAmount - 0 < this.withdrawFee) {
        this.$Message.error(this.$t("uc.finance.withdraw.numtip3"));
        return false;
      } else if (
        this.withdrawFee == "" ||
        this.withdrawFee == 0 ||
        this.withdrawFee - 0 > this.currentCoin.maxTxFee ||
        this.withdrawFee - 0 < this.currentCoin.minTxFee
      ) {
        this.$Message.error(this.$t("uc.finance.withdraw.feetip1") + this.currentCoin.minTxFee + " , " + this.$t("uc.finance.withdraw.feetip2") + this.currentCoin.maxTxFee);
        return false;
      } else {
        return true;
      }
    },
    apply() {
      this.formInline.code = "";
      this.formInline.fundpwd = "";

      if (this.valid()) {
        this.modal = true;
        let timercode = setInterval(() => {
          if (this.countdown <= 0) {
            clearInterval(timercode);
            this.sendcodeValue = this.$t("uc.regist.sendcode");
            this.codeIsSending = false;
          }
        }, 1000);
      }
    },
    getMember() {
      //获取个人安全信息
      let self = this;
      this.$http.post(this.host + "/uc/approve/security/setting").then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.user = resp.data;
            if (resp.data.realName == null || resp.data.realName == "") {
              this.$Notice.error({
                title: this.$t("common.tip"),
                desc: this.$t("otc.publishad.submittip1")
              });
              // 判断是否实名认证，未认证跳转到实名认证页面；
              //this.$Message.success(this.$t("otc.publishad.submittip1"));
              self.$router.push("/my");
            } else if (resp.data.phoneVerified == 0) {
              this.$Notice.error({
                title: this.$t("common.tip"),
                desc: this.$t("otc.publishad.submittip2")
              });
              // 判断是否是手机号0，1，未认证跳转到实名认证页面；
              //this.$Message.success(this.$t("otc.publishad.submittip2"));
              self.$router.push("/my");
            } else if (resp.data.fundsVerified == 0) {
              this.$Notice.error({
                title: this.$t("common.tip"),
                desc: this.$t("otc.publishad.submittip3")
              });
              // 判断是否设置交易密码，未认证跳转到实名认证页面；
              //this.$Message.success(this.$t("otc.publishad.submittip3"));
              self.$router.push("/my");
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    }
  },
  created() {
    this.getMember();
    this.$http.options.emulateJSON = false;
    this.coinType = this.$route.query.name || "";
    this.getAddrList();
    this.getList(0, 10, 1);
    console.log(this.$store.getters.member);
  },
  computed: {
    member: function() {
      console.log(this.$store.getters.member);
      return this.$store.getters.member;
    },
    tableColumnsWithdraw() {
      let columns = [],
        filters = [];
      if (this.coinList.length > 0) {
        this.coinList.forEach(v => {
          filters.push({
            label: v.unit,
            value: v.unit
          });
        });
      }
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

      // columns.push({
      //   title: this.$t("uc.finance.withdraw.time"),
      //   width: 180,
      //   key: "createTime"
      // });
      columns.push({
        title: this.$t("uc.finance.withdraw.symbol"),
        key: "symbol",
        filters,
        filterMultiple: false,
        filterMethod(value, row) {
          return row.coin.unit === value;
        },
        render: function(h, params) {
          return h("span", params.row.coin.unit);
        }
      });
      // columns.push({
      //   title: this.$t("uc.finance.withdraw.address"),
      //   key: "address"
      // });
      columns.push({
        title: this.$t("uc.finance.withdraw.num"),
        key: "totalAmount"
      });
      // columns.push({
      //   title: this.$t("uc.finance.withdraw.fee"),
      //   key: "fee"
      // });
      // columns.push({
      //   title: this.$t("uc.finance.withdraw.txid"),
      //   key: "transactionNumber"
      // });
      columns.push({
        title: this.$t("uc.finance.withdraw.status"),
        key: "status",
        render: (h, params) => {
          let text = "";
          if (params.row.status == 0) {
            text = this.$t("uc.finance.withdraw.status_1");
          } else if (params.row.status == 1) {
            text = this.$t("uc.finance.withdraw.status_2");
          } else if (params.row.status == 2) {
            text = this.$t("uc.finance.withdraw.status_3");
          } else if (params.row.status == 3) {
            text = this.$t("uc.finance.withdraw.status_4");
          }
          return h("div", [h("p", text)]);
        }
      });
      return columns;
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
    background: #fff;
    .page-withdrawrecord{
      /deep/ td.ivu-table-expanded-cell {
          padding: 2%;
      }
    }
  }
}
</style>

