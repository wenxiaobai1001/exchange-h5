<template>
    <div class="nav-rights safe payment">
      <div class="nav-right padding-right-clear">

        <div class="padding-right-clear padding-left-clear rightarea user account-box">
          <div class="rightarea-con">
            <div class="user-top-icon">
              <div class="user-icons">
                <div class="user-face user-avatar-public">
                  <span class="user-avatar-in">{{usernameS}}</span>
                </div>
                <div class="user-name" style="line-height:52px">
                  <span style="line-height:52px">{{user.username}}</span>
                </div>
              </div>
            </div>

            <section class="accountContent">
              <div class="account-in">
                <div class="account-item">
                  <div class="account-detail">
                    <div class="detail-list" style="width: 100%;">
                      <Form :label-width="120" style="text-align:center;">
                          
                          <Row style="margin-bottom:10px;">
                            <Col span="8">
                              <div class="idcard-title">{{$t('uc.finance.recharge.rechargecoin')}}</div>
                            </Col>
                            <Col span="16">
                              <Select style="width:100%;" v-model="coinType" :placeholder="$t('common.pleaseselect')">
                                <Option v-for="item in coinList" :value="item.coin.unit" :key="item.coin.unit">{{ item.coin.unit }}</Option>
                              </Select>
                            </Col>
                          </Row>

                          <Row style="margin-bottom:10px;">
                            <Col span="8">
                              <div class="idcard-title">{{$t('uc.finance.recharge.payaddress')}}</div>
                            </Col>
                            <Col span="16">
                              <Input style="width:100%;" v-model="payAddress" size="large" maxlength="255"></Input>
                            </Col>
                          </Row>
                          
                          <Row style="margin-bottom:10px;">
                            <Col span="8">
                              <div class="idcard-title">{{$t('uc.finance.recharge.rechargeamount')}}</div>
                            </Col>
                            <Col span="16">
                              <InputNumber style="width:100%;" v-model="amount" size="large" :min="0"></InputNumber>
                            </Col>
                          </Row>

                          <Row style="margin-bottom:10px;">
                            <Col span="8">
                              <div class="idcard-title">{{$t('uc.finance.recharge.payevidence')}}</div>
                            </Col>
                            <Col span="16">
                              <input type="hidden" name="imgPreview" :value="imgPreview" />
                              <img id="frontCardImg" style="width: 180px;height: 120px;" :src="frontCardImg">
                              <div class="acc_sc">
                                  <Upload ref="upload1" :before-upload="beforeUpload" :on-success="frontHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                                      <Button icon="ios-cloud-upload-outline">{{$t('uc.safe.upload')}}</Button>
                                  </Upload>
                              </div>
                            </Col>
                          </Row>
                          <!-- Button -->
                          <FormItem style="text-align:center;">
                              <Button type="warning" @click="handleSubmit()" style="margin-left: -85px;">{{$t('uc.safe.save')}}</Button>
                              <Button @click="handleReset()" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button>
                          </FormItem>
                      </Form>
                    </div>
                  </div>
                </div>
                  <!--  -->
              </div>
            </section>
          </div>
        </div>


        <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsMoney" :data="tableMoneyShow" :disabled-hover="true"></Table>
          
      </div>
    </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      fGetBackFundpwd: false,
      loginmsg: this.$t("common.logintip"),
      uploadHeaders: { "x-auth-token": localStorage.getItem("TOKEN") },
      frontCardImg: require("../../assets/images/payment.jpeg"),
      imgPreview: "",
      uploadUrl: this.host + "/uc/upload/oss/image",
      coinList: [],
      tableMoneyShow: [],
      usernameS: "",
      user: {},
      payAddress:"",
      amount:0.0,
      paymentEvidence:"",
      coinType:"BTC",
    };
  },
  methods: {
    
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 8) {
        this.$Message.error("The image is less than 8M");
        return false;
      }
    },
    frontHandleSuccess(res, file,fileList) {
      this.$refs.upload1.fileList=[fileList[fileList.length-1]];
      if (res.code == 0) {
        this.frontCardImg = this.imgPreview = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    backHandleSuccess(res, file,fileList) {
      this.$refs.upload2.fileList=[fileList[fileList.length-1]];
      if (res.code == 0) {
        this.backCardImg = this.imgNext = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    handHandleSuccess(res, file,fileList) {
      this.$refs.upload3.fileList=[fileList[fileList.length-1]];
      if (res.code == 0) {
        this.handCardImg = this.imgLast = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    submit() {
      let param = {};
        param["coinName"] = this.coinType
        param["amount"] = this.amount;
        param["url"] = this.imgPreview;
        param["payAddress"] = this.payAddress;

        this.$http.post(this.host + "/recharge_coin/pay-evidence", param)
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.success(this.$t("uc.safe.save_success"));
            } else {
              this.$Message.error(resp.message);
            }
            this.getEvidence();
            this.handleReset();
          });

    },
    handleSubmit() {
      this.submit();
    },
    handleReset() {
        this.coinType = "";
        this.amount = 0;
        this.imgPreview = "";
        this.payAddress = "";
      // this.$refs[name].resetFields();
    },
    getEvidence(){
      this.$http.post(this.host + "/recharge_coin/pay-list").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.tableMoneyShow = resp.data;
        } else {
          this.$Message.error(resp.message);
        }
      });

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
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    getMember() {
      //获取个人安全信息
      var self = this;
      this.$http
        .post(this.host + "/uc/approve/security/setting")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.user = resp.data;
            this.usernameS = this.user.username.slice(0,1);
          } else {
            this.$Message.error(this.loginmsg);
          }
        });
    }
  },
  computed: {
    member: function() {
      return this.$store.getters.member;
    },
    lang() {
      return this.$store.state.lang;
    },
    
    tableColumnsMoney() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.finance.recharge.rechargecoin"),
        key: "coinName",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.finance.recharge.rechargeamount"),
        key: "amount",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.finance.recharge.payaddress"),
        key: "payAddress",
        align: "center",
      });
      columns.push({
        title: this.$t("uc.finance.recharge.description"),
        key: "description",
        align: "center",
      });
      columns.push({
        title: this.$t("uc.finance.recharge.auditstatus"),
        key: "status",
        align: "center",
        render(h, params) {
          let status = self.$t("uc.finance.recharge.auditwait");
          if(params.row.status == 1){
            status = self.$t("uc.finance.recharge.auditpass");
          }else if(params.row.status == 2){
            status = self.$t("uc.finance.recharge.auditfail");
          }
          return h(
            "span",
            {
              attrs: {
                title: status
              }
            },
            status
          );
        }
      });
      return columns;
    }
  },
  created() {
    this.getMoney();
    this.getMember();
    this.getEvidence();
  }
};
</script>
<style scoped lang="scss">

button.ivu-btn{
  &:focus{
    box-shadow: 0 0 0 2px rgba(45,140,240,0);
  }
}
button.ivu-btn.ivu-btn-primary{
  box-shadow: 0 0 0 2px rgba(45,140,240,0);
}
.nav-right {
  // padding-left: 15px;
  .user .user-top-icon {
    height: 80px;
    border-bottom: 1px dashed #27313e;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 50px;
  }
}
.uploadimgtip {
  position: relative;
  top: -20px;
  color: #f0a70a;
}
.account-box .account-in .account-item .account-detail {
  padding: 30px 0;
  // background: white;
  margin: 6px 0;
}

.account-box .account-in .account-item .account-detail .detail-list {
  width: 40%;
  margin: 0 auto;
}

.account-box
  .account-in
  .account-item
  .account-detail
  .detail-list
  .input-control {
  margin-bottom: 10px;
  height: 45px;
}

.detail-list .input-control .ivu-input-group-prepend {
  width: 63px;
}

.detail-list .input-control .ivu-input {
  height: 45px;
}

.account-box .account-in .account-item {
  margin-bottom: 10px;
}

.account-box .account-in .account-item .account-item-in {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 15px 30px 15px 50px;
  // background-color: white;
  -webkit-box-shadow: 0 1px 0 0 rgba(69, 112, 128, 0.06);
  box-shadow: 0 1px 0 0 rgba(69, 112, 128, 0.06);
  font-size: 14px;
  color: #fff;
}

.account-box .account-in .account-item .account-item-in .icons {
  height: 17px;
  width: 17px;
  display: inline-block;
  margin-top: -1px;
  background-size: 100% 100%;
}

.account-box .account-in .account-item .account-item-in .yesImg {
  background-image: url(../../assets/img/overicon.png);
}

.icons.noImg {
  background-image: url(../../assets/img/noicon.png);
}

.account-box .account-in .account-item .account-item-in .card-number {
  width: 142px;
  height: 40px;
  margin-right: 15px;
  border-right: 1px dashed #27313e;
  padding: 0 15px;
  line-height: 40px;
  text-align: left;
  display: inline-block;
}

.account-box .account-in .account-item .account-item-in .bankInfo {
  width: 65%;
  text-align: left;
}

.account-box .account-in .account-item .account-item-in .btn {
  // padding: 8px 10px;
  cursor: pointer;
}

.tips-g {
  color: #8994a3;
  font-size: 12px;
}

.gr {
  color: #b4b4b4;
}

.m1 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m1.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.m2 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m2.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.m3 {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/img/m3.png);
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
}

.itp {
  display: inline-block;
}

.user-right {
  width: 80%;
}

.rightarea {
  padding-left: 15px !important;
  padding-right: 15px !important;
  margin-bottom: 60px !important;
}

.rightarea .rightarea-top {
  line-height: 75px;
  border-bottom: #f1f1f1 solid 1px;
}

.rightarea .trade-process {
  line-height: 30px;
  padding: 0 15px;
  background: #f1f1f1;
  display: inline-block;
  position: relative;
  margin-right: 20px;
}

.rightarea .trade-process.active {
  color: #eb6f6c;
  background: #f9f5eb;
}

.rightarea .trade-process .icon {
  background: #fff;
  border-radius: 20px;
  height: 20px;
  width: 20px;
  display: inline-block;
  line-height: 20px;
  text-align: center;
  margin-right: 10px;
}

.rightarea .trade-process .arrow {
  position: absolute;
  top: 10px;
  right: -5px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #f1f1f1;
}

.rightarea .trade-process.active .arrow {
  border-left: 5px solid #f9f5eb;
}

.rightarea .rightarea-tabs {
  border: none;
}

.rightarea .rightarea-tabs li > a {
  width: 100%;
  height: 100%;
  padding: 0;
  margin-right: 0;
  font-size: 14px;
  color: #646464;
  border-radius: 0;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rightarea .rightarea-tabs li > a:hover {
  background-color: #fcfbfb;
}

.rightarea .rightarea-tabs li {
  width: 125px;
  height: 40px;
  position: relative;
  margin: -1px 0 0 -1px;
  border: 1px solid #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rightarea .rightarea-tabs li.active {
  background-color: #fcfbfb;
}

.rightarea .rightarea-tabs li:last-child {
  border-right: 1px solid #f1f1f1;
}

.rightarea .rightarea-tabs li.active > a,
.rightarea .rightarea-tabs li:hover > a {
  color: #da2e22;
  border: none;
}

.rightarea .panel-tips {
  border: 3px solid #fdfaf3;
  color: #9e9e9e;
  font-size: 12px;
}

.rightarea .panel-tips .panel-header {
  background: #fdfaf3;
  line-height: 40px;
  margin-bottom: 15px;
}

.rightarea .panel-tips .panel-title {
  font-size: 16px;
}

.rightarea .recordtitle {
  cursor: pointer;
}

.user .top-icon {
  /* background: url("../../images/user/userplist.png") no-repeat 0 0; */
  width: 75px;
  height: 75px;
  display: inline-block;
}

.user .top-icon.intro {
  background-position: 0 -670px;
}

.user .user-info {
  padding: 0px 10px;
  background-color: #fff;
  color: #fff;
}

.user .user-info .user-info-top {
  border-bottom: 1px dashed #27313e;
  padding-bottom: 20px;
}

.user .user-info h5 {
  font-size: 18px;
}

.user .user-info h5 .iconfont {
  font-size: 20px;
  color: #e24a64;
  margin-left: 10px;
}

.user-avatar {
  display: flex;
  justify-content: space-between;
}

.user-icons {
  display: flex;
  align-self: center;
  width: 300px;
}

.user-icons .icons-in {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: #00b5f6;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.user-icons .icons-in em {
  color: white;
  font-size: 20px;
  font-style: normal;
}

.user-icons .user-name {
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  flex-direction: column;
}

.user-icons .user-name span {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 225px;
  height: 52px;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.user-top-icon .trade-info {
  width: 420px;
  padding-left: 30px;
  display: flex;
}

.user-top-icon .trade-info .item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-top-icon .trade-info .item.capital {
  width: 60%;
}

.user-icons .user-name span.uid {
  color: #8994a3;
  font-size: 12px;
}

.circle-info {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border: 2px solid #ebeff5;
  margin-left: 14px;
}

.circle-info span {
  font-weight: bolder;
}

.circle-info p {
  color: #8994a3;
  margin: 0;
  padding: 0;
}

.circle-info p.count {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.user-avatar-public {
  background: #df9a00;
  border-radius: 50%;
  height: 52px;
  width: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 5px 0 rgba(71, 78, 114, 0.24);
  position: relative;
}

.user-avatar-public > .user-avatar-in {
  background: #f0a70a;
  border-radius: 50%;
  height: 42px;
  width: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
/*新加样式*/
.router-link-active {
  color: red;
}
/* router-link-exact-active router-link-active */
.account-item-in i {
  color: #f0a70a !important;
}
.btn {
  color: #f0a70a;
  width: 50px;
}
.verified-btn{
  width: 50px;
}
.ivu-btn-primary {
  background-color: #f0a70a;
  border-color: #f0a70a;
}
</style>
<style scoped lang="scss">
li.ivu-upload-list-file.ivu-upload-list-file-finish {
  &:hover {
    span {
      color: #f0a70a;
    }
  }
}

.idcard-title{
    font-size: 13px;
    margin-bottom: 10px;
}
.acc_sc{
    margin-top: 10px;
}
.idcard-desc{
    padding: 10px 150px 50px 150px;
    >p{
        font-size: 13px;
        margin-bottom: 10px;
        text-align:left;
        color: #828ea1;
    }
}

@media screen and (max-width:768px){
    .safe .nav-right .user .user-top-icon{
        padding: 0 0!important;
    }
    .safe .account-box .account-in .account-item .account-item-in{
        padding: 15px 0px 15px 0px;
    }
    .safe .account-box .account-in .account-item .account-item-in .bankInfo {
        width: 50%!important;
    }
    .safe .account-box .account-in .account-item .account-item-in .card-number{
        width: 100px!important;
    }
    .safe .user-icons .user-name span{
        width: 100px!important;
    }
}
</style>

<style scoped lang="scss">
.send-sms-custom.ivu-input-group-large>.ivu-input-group-append{
    background-color: #27313e !important;
    border: 0px solid #27313e !important;
}

.nav-rights.safe.payment {
    padding: 0 2% !important;
}
</style>
