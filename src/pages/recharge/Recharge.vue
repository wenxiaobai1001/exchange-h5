<template>
  <div class="page-home">
    <PageHeader :title="$t('common.goRecharge')+' '+coinTitle"></PageHeader>
    <div class="page-content">
      <div class="page-dorecharge">
        <!-- <div class="page-dorecharge-code">
          <qriously :value="qrcode.value" :size="qrcode.size" foreground="#000" />
        </div> -->
        <div class="page-dorecharge-address">
          <!-- <div class="page-dorecharge-address-title">{{$t('common.rechargeAddress')}}</div> -->
          <!-- <div class="page-dorecharge-address-input" v-if="accountType==1">
            <input v-model="qrcode.value" readonly v-if="qrcode.value"/>
            <span v-else>{{$t('common.rechargeCustomer')}}</span>
          </div> -->
          <div class="page-dorecharge-address-input" style="display:none;">
            <input v-model="qrcode.value" readonly v-if="qrcode.value" />
          </div>
          <!-- <div class="page-dorecharge-address-input">
            <InputNumber v-model="rechargeAmount" placeholder="Please input recharge amount"></InputNumber>
          </div> -->
          <!-- <div class="page-dorecharge-address-btn"> -->
            <!-- <a v-show="isShowGetAddress" class="link-copy" @click="resetAddress">{{$t('uc.finance.money.getaddress')}}</a> -->
            <!-- <a v-clipboard:copy="qrcode.value" v-clipboard:success="onCopy" v-clipboard:error="onError" href="javascript:;" id="copyBtn" class="link-copy">{{$t('common.rechargeCopy')}}</a> -->
          <!-- </div> -->
        </div>
        <div class="page-dorecharge--content">
            <Form label-position="top">
                <Form-item :label="$t('common.rechargeAmount')">
                  <InputNumber style="width:100%" v-model="rechargeAmount" size="large" :min="0"></InputNumber>
                </Form-item>
                <!-- <Form-item :label="$t('common.rechargeEvidence')">
                    <input type="hidden" name="imgPreview" :value="imgPreview" />
                    <Upload type="drag" ref="upload" :before-upload="beforeUpload" :on-success="frontHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                      <div style="padding: 20px 0">
                          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                          <p>{{$t('common.rechargeEvidenceTip')}}</p>
                      </div>
                    </Upload>
                </Form-item> -->
                <FormItem class="upload-evidence">
                    <Button type="primary" @click="resetAddress()">{{$t('uc.finance.recharge.recharge')}}</Button>
                </FormItem>
            </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);
import PageHeader from '@/components/header/index.vue';

export default {
  components: {
    VueQriously, PageHeader
  },
  inject: ['reload'],
  data() {
    return {
      coinAddress:{
        BTC:"bc1qwputd5n5zy7agg4jrsudn9vjw5gmxfysn3yvgr", 
        ETH:"0xb2ab75518f44a1368af01bcde7879e9dc53caf1d",
        EUSDT:"0xb2ab75518f44a1368af01bcde7879e9dc53caf1d",
        USDT:"TRpJYCBuwVJRyKmMZTdwumWo2oYBfG6DqY",
        TUSDT:"TRpJYCBuwVJRyKmMZTdwumWo2oYBfG6DqY"
      },
      uploadUrl: this.host + "/uc/upload/oss/image",
      uploadHeaders: { "x-auth-token": localStorage.getItem("TOKEN") },
      coinType:'',
      imgPreview:"",
      payAddress:"",
      isSubmit:false,
      amount:0.0,
      coinList:[],
      loading: true,
      minRechargeAmount:0.0,
      rechargeAmount:0.0,
      accountType:0,
      isShowGetAddress:false,
      txid:"R"+ new Date().getTime(),
      qrcode: {
        value: "",
        size: 150,
        coinName: "",
        unit: ""
      },
    };
  },
  methods: {
    handleSubmit() {
      let param = {};
      param["coinName"] = this.coinType
      param["amount"] = this.amount;
      param["url"] = this.imgPreview;
      param["payAddress"] = this.payAddress;
      param['txId'] = this.txid;
      if(!this.amount){
        this.$Message.error("Please input amount.");
        return false;
      }
      if(!this.payAddress){
        this.$Message.error("Please get address.");
        return false;
      }
      if(!this.imgPreview){
        this.$Message.error("Please upload recharge evidence");
        return false;
      }
      if(this.isSubmit){
        return false;
      }
      this.isSubmit = true;
      this.$http.post(this.host + "/uc/deposit-manual/apply", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(this.$t("uc.safe.save_success"));
            setTimeout(() => {
              history.go(-1);
            }, 1000);
          } else {
            this.$Message.error(resp.message);
          }
          this.isSubmit = false;
          this.reload();
        });
    },
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 8) {
        this.$Message.error("The image is less than 8M");
        return false;
      }
    },
    frontHandleSuccess(res, file,fileList) {
      this.$refs.upload.fileList=[fileList[fileList.length-1]];
      if (res.code == 0) {
        this.imgPreview = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    getMoney() {
      //获取
      this.coinList = [];
      this.$http.post(this.host + this.api.uc.mywallet,{},{
        emulateJSON: false,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          for (let i = 0; i < resp.data.length; i++) {
            let coin = resp.data[i];
            if (coin.coin.canRecharge == 1) {
              this.coinList.push(coin);
            }
          }
          this.changeCoin(this.coinType);
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    changeCoin(value) {
      for (var i = 0; i < this.coinList.length; i++) {
        

        if (this.coinList[i].coin.unit == value) {
          this.qrcode.value = this.coinList[i].address;
          this.qrcode.coinName = this.coinList[i].coin.nameCn.toLowerCase();
          this.qrcode.unit = this.coinList[i].coin.unit;
          this.minRechargeAmount = this.coinList[i].coin.minRechargeAmount;
          if(this.coinList[i].coin.accountType == 1) {
            this.qrcode.value = this.coinList[i].coin.depositAddress;
            this.accountType = 1;
          }else{
            this.accountType = 0;
          }

          // let selectCoinAddress = this.coinAddress[value];
          // if(this.coinList[i].address){
          //   this.qrcode.value = selectCoinAddress||"";
          // }else{
          //   this.qrcode.value = "";
          // }

          this.payAddress = this.qrcode.value;
          if(!this.qrcode.value){
            this.isShowGetAddress = true;
          }else{
            this.isShowGetAddress = false;
          }
          break;
        }
      }
    },
    resetAddress(){
      let self = this;
      this.$Spin.show({
          render: (h) => {
              return h('div', [
                  h('Icon', {
                    'class': 'demo-spin-icon-load',
                    props: {
                        type: 'ios-loading',
                        size: 18
                    }
                  }),
                  h('div', {style:{
                    fontSize: "12px",
                    marginTop: "8px"
                  }}, this.$t('uc.finance.recharge.gettingaddress'))
              ])
          }
      });
      let params = {};
      params["unit"] = this.qrcode.unit;
      params["amount"] = this.rechargeAmount;
      this.$http.post(this.host + "/uc/asset/wallet/reset-address-create", params).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          setTimeout(function() {
            self.reload();
            self.$Spin.hide();
            window.open(resp.data, "_blank");
          }, 3000);
        } else {
          this.$Message.error(resp.message);
          self.$Spin.hide();
        }
      });
    },
    onCopy(e) {
      this.$Message.success(
        this.$t("uc.finance.recharge.copysuccess") + e.text
      );
    },
    onError(e) {
      this.$Message.error(this.$t("uc.finance.recharge.copysuccess"));
    },
  },
  created() {
    this.coinType = this.$route.query.unit || "";
    this.getMoney();
  },
  watch:{

  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    coinTitle(){
      let coinTitle = this.$route.query.name || "";
      if(!coinTitle){
        this.$router.push('/recharge');
      }
      return coinTitle;
    }
  }
};
</script>
<style scoped lang="scss">
.page-home, .page-content {
  height: 100%;
  background-color: #fff;
}
.page-dorecharge {
  width: 100%;
  padding-top: 50px;
  background-color: #fff;
  // height: 100%;
  .page-dorecharge-code {
      text-align: center;
      width: 100%;
      padding: 2%;
  }
  .page-dorecharge-address{
    .page-dorecharge-address-title {
        // margin: 2% 0;
        padding: 2% 2%;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    .page-dorecharge-address-input {
        text-align: center;
        font-size: 14px;
        padding: 2% 2%;
        input:focus-visible {
          outline: none;
        }
        input {
          width: 100%;
          border: none;
          padding: 1%;
          text-align: center;
        }
    }
    .page-dorecharge-address-btn {
      width: 100%;
      padding: 2% 2%;
      text-align: center;
      font-size: 16px;
      a.link-copy {
        border: 1px solid #2d8cf0;
        padding: 2% 2%;
        border-radius: 20px;
        width: 140px;
        display: inline-block;
      }
    }
  }
  .page-dorecharge--content{
    padding: 10% 2%;
    font-size: 12px;
    /deep/ .ivu-form-item-label {
      font-size: 14px;
      font-weight: 600;
    }
    .upload-evidence.ivu-form-item {
      text-align: center;
      button.ivu-btn.ivu-btn-primary {
        width: 90%;
        font-size: 16px;
        font-weight: 800;
      }
    }
  }
}
</style>
