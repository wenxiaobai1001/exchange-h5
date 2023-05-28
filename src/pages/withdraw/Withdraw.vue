<template>
  <div class="page-home">
    <PageHeader :title="$t('common.goWithdraw')+''+coinTitle"></PageHeader>
    <div class="page-content">
      <div class="page-withdraw">
        <div class="page-withdraw-address">
          <span class="page-withdraw-address-link"><router-link to="/withdraw/address">{{$t('uc.finance.withdraw.addressmanager')}}</router-link></span>
        </div>
        <div class="page-withdraw-content"> 
          
          <div class="page-withdraw-content-item">
            <!-- <div class="inner-left">
              <p class="describe" style="text-align:left;">{{$t('uc.finance.withdraw.symbol')}}</p>
              <Select v-model="coinType" size="large" style="margin-top: 14px;" @on-change="getAddrList">
                <Option v-for="item in coinList" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
              </Select>
            </div> -->
            <div class="form-group form-address">
              <label for="controlAddress" class="controlAddress describe">{{$t('uc.finance.withdraw.address')}}</label>
              <div class="control-input-group">
                <Select ref="address" style="width: 80%;" v-model="withdrawAdress" size="large" @on-query-change="onAddressChange" :placeholder="$t('common.pleaseselect')">
                  <Option v-for="item in currentCoin.addresses" :value="item.address" :key="item.address">{{item.remark +'('+ item.address+')' }}</Option>
                </Select>
              </div>
            </div>
          </div>

          <div class="page-withdraw-content-item">
            <div class="form-group form-amount">
              <label class="label-amount describe">{{$t('uc.finance.withdraw.num')}}
                <p class="label-fr">
                  <span>【{{$t('uc.finance.withdraw.avabalance')}}】:{{currentCoin.balance|toFloor}}</span>
                  <!-- <span v-if="currentCoin.enableAutoWithdraw == 0">【{{$t('common.tip')}}】：{{$t('uc.finance.withdraw.msg1')}} {{currentCoin.threshold}} {{$t('uc.finance.withdraw.msg2')}}</span> -->
                </p>
              </label>
              <div class="input-group">
                <!-- <Poptip trigger="focus" :content="$t('uc.finance.withdraw.tip1')+currentCoin.withdrawScale+$t('uc.finance.withdraw.tip11')+currentCoin.minAmount+' ,'+$t('uc.finance.withdraw.tip2')+currentCoin.maxAmount" style="width: 50%;">
                  <InputNumber style="width: 100%;" :min="0" @on-blur="computerAmount" v-model="withdrawAmount" :placeholder="$t('uc.finance.withdraw.numtip1')" size="large"></InputNumber>
                  <span class="input-group-addon addon-tag uppercase firstt">{{currentCoin.unit}}</span>
                </Poptip> -->
                <InputNumber style="width: 80%;" @on-change="computerAmount" @on-blur="computerAmount" v-model="withdrawAmount" :placeholder="$t('uc.finance.withdraw.numtip1')" size="large"></InputNumber>
                <span class="input-group-addon addon-tag uppercase firstt">{{currentCoin.unit}}</span>
              </div>
            </div>
          </div>

          <div class="page-withdraw-content-item">
            <div class="form-group form-fee">
              <label class="label-amount describe">
                <span>{{$t('uc.finance.withdraw.fee')}}:【From {{currentCoin.minTxFee}} to {{currentCoin.maxTxFee}}】</span>
              </label>
              <div class="input-group custom-set-fee" style="position:relative;">
                <!-- <Slider @on-change="computerAmount" v-model="withdrawFee" show-input :step="withdrawStep" :max="currentCoin.maxTxFee" :min="currentCoin.minTxFee"></Slider> -->
                <!--<Poptip v-else trigger="focus" :content="$t('uc.finance.withdraw.tip1')+currentCoin.minTxFee+$t('uc.finance.withdraw.tip1')+currentCoin.maxTxFee" style="width: 100%;">-->
                <InputNumber style="width: 80%;" @on-change="computerAmount" @on-blur="computerAmount" v-model="withdrawFee" size="large"></InputNumber>
                <span class="input-group-addon addon-tag uppercase">{{currentCoin.unit}}</span>
                <!--</Poptip>-->
              </div>
            </div>
          </div>

          <div class="page-withdraw-content-item">
            <div class="form-group arriamount">
              <label class="describe">{{$t('uc.finance.withdraw.arriamount')}}</label>
              <div class="input-group" style="margin-top:14px;position:relative;">
                <Input style="width: 80%;" readonly v-model="withdrawOutAmount" :placeholder="$t('uc.finance.withdraw.arriamount')" size="large"></Input>
                <!-- <input id="withdrawOutAmount" class="form-control form-out-amount" disabled="" maxlength="20" type="text" value="0"> -->
                <span class="input-group-addon addon-tag uppercase">{{currentCoin.unit}}</span>
              </div>
            </div>
          </div>

          <div class="action-foot">
            <Button id="withdrawSubmit" long size="large" type="warning" style="height:40px;" @click="apply">{{$t('uc.finance.withdraw.pickup')}}</Button>
            <!-- <Button id="transferSubmit" long size="large" type="primary" style="height:40px;" @click="apply">{{$t('uc.finance.withdraw.transfer')}}</Button> -->
          </div>

          <div class="action-content pt10">
            <div class="action-body">
              <p class="acb-p1">{{$t('common.tip')}}</p>
              <p class="acb-p2">• {{$t('uc.finance.withdraw.msg3')}}: {{currentCoin.minAmount}} {{coinType}}.<br>• {{$t('uc.finance.withdraw.msg5')}}<br>• {{$t('uc.finance.withdraw.msg6')}} </p>
            </div>
          </div>

        </div>
      </div>
    </div>
    <Modal class="withdraw-window" v-model="modal" width="90%">
      <Form class="withdraw-form-inline" ref="formInline" :model="formInline" top>
        <FormItem prop="code" :label="$t('uc.safe.emailcode')">
          <Input type="text" size="large" style="width:70%;" v-model="formInline.code" :placeholder="$t('uc.safe.emailcode')"></Input>
          <input id="sendCode" @click="sendCode();" type="Button" :value="sendcodeValue" :disabled="codeIsSending">
        </FormItem>
        <FormItem :label="$t('otc.chat.msg7')">
          <Input type="password" size="large" style="width:70%;" v-model="formInline.fundpwd" :placeholder="$t('otc.chat.msg7')"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <span class="footer-cancel" @click="cancel">Cancel</span>
        <span class="footer-ok"  @click="ok">Confirm</span>
      </div>
    </Modal>
  </div>
</template>
<script>
import expandRow from "@components/expand/withdraw.vue";
import PageHeader from '@/components/header/index.vue';
export default {
  components: { expandRow, PageHeader},
  data() {
    return {
      user: {},
      codeIsSending: false,
      sendcodeValue: this.$t("uc.regist.sendcode"),
      countdown: 60,
      coinTitle:'',
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

      params["unit"] = this.coinType;
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
      this.$http.post(this.host + "/uc/withdraw/support/coin/info").then(response => {
        let resp = response.body;
        if (resp.code == 0 && resp.data.length > 0) {
          this.coinList = resp.data;
          let usdtType = this.coinType;
          if(usdtType=='EUSDT' || usdtType=='TUSDT'){
            usdtType = 'USDT';
          }
          let addressForEUSDT = [];
          let addressForTUSDT = [];
          if(usdtType) {
            for (let i = 0; i < resp.data.length; i++) {
              if (resp.data[i].unit=='EUSDT') {
                addressForEUSDT = resp.data[i].addresses;
              }else if (resp.data[i].unit=='TUSDT') {
                addressForTUSDT = resp.data[i].addresses;
              }
              if(resp.data[i].unit==usdtType){
                this.currentCoin = resp.data[i];
              }
            }
            if(this.coinType=='EUSDT'){
              this.currentCoin.addresses=addressForEUSDT;
            }else if(this.coinType=='TUSDT'){
              this.currentCoin.addresses=addressForTUSDT;
            }
          } else {
              history.go(-1);
            // this.currentCoin = this.coinList[0];
            // this.coinType = this.currentCoin.unit;
          }
        } else {
          this.$Message.error(resp.message);
        }
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
      this.withdrawOutAmount = this.round(this.accSub(this.withdrawAmount, this.withdrawFee),this.currentCoin.withdrawScale);
      // this.withdrawOutAmount = this.round(this.accSub(this.withdrawAmount, this.withdrawFee), 8);
    },
    computerAmount2() {
      this.withdrawAmount = (this.withdrawAmount + "").replace(/([0-9]+\.[0-9]{6})[0-9]*/, "$1") -0;
      this.withdrawOutAmount = this.round(this.accSub(this.withdrawAmount, this.withdrawFee), this.currentCoin.withdrawScale);
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
      } else if (this.withdrawAmount == "" || this.withdrawAmount == 0 || this.withdrawAmount - 0 < this.currentCoin.minAmount) {
        this.$Message.error(this.$t("uc.finance.withdraw.numtip2") + this.currentCoin.minAmount);
        return false;
      } else if (this.withdrawAmount - 0 < this.withdrawFee) {
        this.$Message.error(this.$t("uc.finance.withdraw.numtip3"));
        return false;
      } else if (this.withdrawFee == "" || this.withdrawFee == 0 || this.withdrawFee - 0 > this.currentCoin.maxTxFee || this.withdrawFee - 0 < this.currentCoin.minTxFee) {
        this.$Message.error(this.$t("uc.finance.withdraw.feetip1") +" "+ this.currentCoin.minTxFee + " , " + this.$t("uc.finance.withdraw.feetip2") +" "+ this.currentCoin.maxTxFee);
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
    this.coinType = this.$route.query.unit || "";
    this.coinTitle = this.$route.query.name || "";
    this.getAddrList();
    console.log(this.$store.getters.member);
  },
  computed: {
    member: function() {
      console.log(this.$store.getters.member);
      return this.$store.getters.member;
    },
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
    .page-withdraw{
      padding: 2%;
      .page-withdraw-address{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 2% 2% 0 2%;
        .page-withdraw-address-link {
            padding: 2% 2%;
            border: 1px solid #f0a70a;
            color: #fff;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 400;
        }
      }
      .page-withdraw-content{
        .page-withdraw-content-item{
          label.describe {
            font-size: 14px;
            font-weight: 600;    
            display: flex;
            margin: 3% 0;
          }
          .form-group.arriamount{
            /deep/ .ivu-input{
              border: none;
            }
            /deep/ .ivu-input:focus{
              border: none;
              box-shadow:none;
            }
          }
        }
      }
      .action-foot {
        margin: 4% 0;
        .ivu-btn-warning {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
.withdraw-window{
  /deep/ label.ivu-form-item-label {
    font-size: 14px !important;
    font-weight: 600;
  }
  input#sendCode {
      width: 60px;
      background: rgb(240, 172, 25);
      border: none;
      border-radius: 5px;
      color: #fff;
      font-size: 14px;
  }
  .footer-ok{
    background: rgb(240, 172, 25);
    color: rgb(255, 255, 255);
    width: 101px;
    border-radius: 5px;
    display: inline-block;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
  .footer-cancel{
    background: grey;
    color: rgb(255, 255, 255);
    width: 101px;
    border-radius: 5px;
    display: inline-block;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>

