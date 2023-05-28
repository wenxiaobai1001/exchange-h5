<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.finance.recharge.record')"></PageHeader> 
    <div class="page-content">
      <div class="page-rechargerecord">
        <div class="order-table">
          <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsRecharge" :data="tableRecharge" :loading="loading"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="dataCount" :current="1" @on-change="changePage" class="recharge_btn"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);
import expandRow from "@components/expand/recharge.vue";
import PageHeader from '@/components/header/index.vue';
export default {
  components: {
    VueQriously, expandRow, PageHeader
  },
  inject: ['reload'],
  data() {
    return {
      modal1: false,
      modal2: false,
      withdrawCode: "",
      fundpwd: "",
      accountType: 0,
      memoCode: "",
      minRechargeAmount:"0.001",
      isShowGetAddress: false,
      isShowEwm: false,
      dataCount: 0,
      loading: true,
      qrcode: {
        value: "",
        size: 220,
        coinName: "",
        unit: ""
      },
      coinType: "",
      coinList: [],
      tableRecharge: [],
      allTableRecharge: [],
      withdrawCodeInfo: {
        coin: {
          unit: ""
        }
      },
    };
  },
  methods: {
    changePage(index) {
      this.getList(index);
    },
    getCurrentCoinRecharge() {
      if (this.coinType != "") {
        var temp = [];
        for (var i = 0; i < this.allTableRecharge.length; i++) {
          if (this.allTableRecharge[i].symbol == this.coinType) {
            temp.push(this.allTableRecharge[i]);
          }
        }
        this.tableRecharge = temp;
      } else {
        this.tableRecharge = this.allTableRecharge;
      }
    },
    showEwm() {
      this.isShowEwm = !this.isShowEwm;
    },
    onCopy(e) {
      this.$Message.success(
        this.$t("uc.finance.recharge.copysuccess") + e.text
      );
    },
    onError(e) {
      this.$Message.error(this.$t("uc.finance.recharge.copysuccess"));
    },
    changeCoin(value) {
      for (var i = 0; i < this.coinList.length; i++) {
        if (this.coinList[i].coin.unit == value) {
          this.qrcode.value = this.coinList[i].address;
          this.qrcode.coinName = this.coinList[i].coin.name.toLowerCase();
          this.qrcode.unit = this.coinList[i].coin.unit;
          this.minRechargeAmount = this.coinList[i].coin.minRechargeAmount;
          if(this.coinList[i].coin.accountType == 1) {
            this.qrcode.value = this.coinList[i].coin.depositAddress;
            this.memoCode = this.coinList[i].memo;
            this.accountType = 1;
          }else{
            this.accountType = 0;
          }

          if(this.qrcode.value == "" || this.qrcode.value == null || this.qrcode.value == undefined){
            this.isShowGetAddress = true;
          }else{
            this.isShowGetAddress = false;
          }
        }
      }
      this.getCurrentCoinRecharge();
    },
    openCodeModal(){
      this.modal1 = true;
      this.withdrawCode = "";
    },
    getCodeInfo(){
      if(this.withdrawCode == "") {
        this.$Message.warning(this.$t("uc.finance.recharge.coderechargetip"));
        return;
      }
      let param = {};
      param["withdrawCode"] = this.withdrawCode;

      this.$http
        .post(this.host + "/uc/withdrawcode/apply/info", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.withdrawCodeInfo = resp.data;
            this.modal1 = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
      this.modal1 = false;
      this.modal2 = true;
    },
    submitCode(){
      if(this.withdrawCode == "") {
        this.$Message.warning(this.$t("uc.finance.recharge.coderechargetip"));
        return;
      }
      let param = {};
      param["withdrawCode"] = this.withdrawCode;

      this.$http
        .post(this.host + "/uc/withdrawcode/apply/recharge", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(this.$t("uc.finance.recharge.rechargesuccess"));
            this.modal1 = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
      this.modal2 = false;
    },
    resetAddress(){
      this.reload();
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
          for (let i = 0; i < resp.data.length; i++) {
            var coin = resp.data[i];
            if (coin.coin.canRecharge == 1) {
              this.coinList.push(coin);
              console.log(coin);
            }
          }
          this.changeCoin(this.coinType);
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    getList(pageN) {
      //获取tableRecharge
      let memberId = 0;
      !this.$store.getters.isLogin && this.$router.push("/login");
      this.$store.getters.isLogin && (memberId = this.$store.getters.member.id);
      let pageNo = pageN,
        pageSize = 10,
        type = 0,
        params = { memberId, pageNo, pageSize, type };
      this.$http.post(this.host + "/uc/asset/transaction/all", params).then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data) {
              let trueData = resp.data;
              this.allTableRecharge = trueData.content || [];
              this.dataCount = trueData.totalElements || 0;
              this.getCurrentCoinRecharge();
            }
            this.loading = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getMember() {
      let self = this;
      this.$http.post(this.host + "/uc/approve/security/setting").then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data.realName == null || resp.data.realName == "") {
              // 判断是否实名认证，未认证跳转到实名认证页面；
              this.$Message.success(this.$t("otc.publishad.submittip1"));
              self.$router.push("/my");
            } else if (resp.data.phoneVerified == 0) {
              // 判断是否是手机号0，1，未认证跳转到实名认证页面；
              this.$Message.success(this.$t("otc.publishad.submittip2"));
              self.$router.push("/my");
            } else if (resp.data.fundsVerified == 0) {
              // 判断是否设置交易密码，未认证跳转到实名认证页面；
              this.$Message.success(this.$t("otc.publishad.submittip3"));
              self.$router.push("/my");
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    }
  },
  created() {
    this.coinType = this.$route.query.name || "";
    //this.getMember();
    this.getMoney();
    this.getList(1);
  },
  computed: {
    tableColumnsRecharge() {
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
        title: this.$t("uc.finance.recharge.time"),
        align: "center",
        width: 150,
        render: (h, param) => {
          let str = param.row.createTime;
          return h("div", {}, str);
        }
      });
      // columns.push({
      //   title: this.$t("uc.finance.recharge.symbol"),
      //   align: "center",
      //   width: 120,
      //   render: (h, param) => {
      //     let str = param.row.symbol;
      //     return h("div", {}, str);
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.recharge.address"),
      //   align: "center",
      //   render: (h, param) => {
      //     let str = param.row.address;
      //     return h("div", {}, str);
      //   }
      // });
      columns.push({
        title: this.$t("uc.finance.recharge.amount"),
        align: "center",
        render: (h, param) => {
          let str = param.row.amount;
          return h("div", {}, str);
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
    background: #fff;
    .page-rechargerecord{
      /deep/ td.ivu-table-expanded-cell {
          padding: 2%;
      }
    }
  }
}
</style>
