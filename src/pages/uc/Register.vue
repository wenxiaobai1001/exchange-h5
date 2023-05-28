<template>
  <div class="login-form-section">
    <div class="login-form-one">
      <div class="login-tip">
        <h1 class="login-tip-title">c-deal</h1>
        <h4 class="login-tip-subtitle">{{$t('footer.gsmc')}}</h4>
        <div class="login-tip-note">Safety ● Honesty ● Fairness ● Enthusiasm ● Openness</div>
      </div>
      <div class="login-form-type">
        <!-- <span @click="actives(1)" v-if="changeActive==0">{{$t("uc.regist.telregist")}}</span> -->
        <span @click="actives(0)" v-if="changeActive==0">{{$t("uc.regist.emailregist")}}</span>
      </div>
      <Form class="login-form" ref="formInline" :model="formInline" :rules="ruleInline" inline>
        
        <FormItem prop="username" class="login-form-user" style="display:none;">
          <Input type="text" v-model="formInline.username" :placeholder="$t('uc.regist.username')"></Input>
        </FormItem>
        
        <FormItem prop="user" class="login-form-user with-code" v-if="changeActive==1">
          <Select filterable v-model="formInline.country" class="login-form-user-select" style="width: 120px">
              <Option :value="item.zhName" v-for="item in areas" v-bind:key="item.zhName">+{{item.areaCode}} - {{item.enName}}</Option>
            </Select>
          <Input type="text" style="width: 180px" size="large" v-model="formInline.user" :placeholder="key" class="login-form-user-input"></Input>
        </FormItem>

        <FormItem prop="user" class="login-form-user" v-if="changeActive==0">
          <Input type="text" size="large" v-model="formInline.user" :placeholder="key" class="login-form-user-input"></Input>
        </FormItem>

        <FormItem prop="code" class="login-form-user code">
          <Input size="large" v-model="formInline.code" :placeholder="$t('uc.regist.smscode')">
            <input class="send-code" style="width:100px" type="Button" slot="append" id="sendCode" @click="sendCode();" :value="sendcodeValue" :disabled='codedisabled'>
          </Input>
        </FormItem>

        <FormItem prop="password" class="login-form-user">
          <Input size="large" type="password" v-model="formInline.password" :placeholder="$t('uc.regist.pwd')"></Input>
        </FormItem>
        <FormItem prop="repassword" class="login-form-user">
          <Input size="large" type="password" v-model="formInline.repassword" :placeholder="$t('uc.regist.repwd')"></Input>
        </FormItem>

        <FormItem prop="promotion" class="login-form-user">
          <Input size="large" type="text" v-model="formInline.promotion"><span slot="prepend">{{$t('uc.regist.promotion')}}:</span></Input>
        </FormItem>

        <div class="check-agree">
          <label><Checkbox v-model="agree">{{$t('uc.regist.agreement')}}</Checkbox></label>
          <router-link v-if="lang=='zh_CN'" to="/helpdetail?cate=5&id=36">《{{$t('uc.regist.userprotocol')}}》</router-link>
          <router-link v-if="lang!='zh_CN'" to="/helpdetail?cate=5&id=32">《{{$t('uc.regist.userprotocol')}}》</router-link>
        </div>

        <div class="login-form-btn register-btn" style="margin-top:20px;">
          <Button type='warning' :class="{'registing':registing}" @click="handleSubmit('formInline')" :disabled="registing">{{$t('uc.regist.regist')}}</Button>
          <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
        </div>
        <div class='to_register' style="font-size:14px;">
          <span>{{$t('uc.forget.hasaccount')}}</span>
          <router-link to="/login">{{$t('uc.login.login')}}</router-link>
        </div>
      </Form>
    </div>
    <!-- <div class="login-form-two" id="page4">
      <ul>
        <li>
          <div><img src="../../assets/images/feature_safe.png" alt=""></div>
          <p class="title">{{$t('description.title1')}}</p>
          <p>{{$t('description.message1')}}</p>
        </li>
        <li>
          <div><img src="../../assets/images/feature_fast.png" alt=""></div>
          <p class="title">{{$t('description.title2')}}</p>
          <p>{{$t('description.message2')}}</p>
        </li>
        <li>
          <div><img src="../../assets/images/feature_global.png" alt=""></div>
          <p class="title">{{$t('description.title3')}}</p>
          <p>{{$t('description.message3')}}</p>
        </li>
        <li>
          <div><img src="../../assets/images/feature_choose.png" alt=""></div>
          <p class="title">{{$t('description.title4')}}</p>
          <p>{{$t('description.message4')}}</p>
        </li>
      </ul>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
.login-form-section {
  background:#fff;
  height: 100%;
  position: relative;
  .login-form-one {
    padding: 2%;
    background: transparent;
    width: 100%;
    border-radius: 5px;
    .login-tip{
      color: #F90;
      margin-bottom: 30px;
      margin-top: 30px;
      .login-tip-title{
        border-left: 5px solid #F90;
        padding-left: 10px;
        letter-spacing: 2px;
        line-height: 30px;
        height: 30px;
      }
      .login-tip-subtitle{
        margin-top:5px;
        letter-spacing: 1px;
      }
      .login-tip-note{
        letter-spacing: 0.5px;
        margin-top: 10px;
        color:#727284;
        font-size:12px;
      }
    }
    .login-form-type {
      width: 100%;
      text-align: right;
      padding:2%;
      span{
        color: #f0ac19;
      }
    }
    .login-form {
      // border-radius: 5px;
      padding: 2%;
      .with-code {
        /deep/ .ivu-select-single .ivu-select-selection{
          height: 36px;
        }
        /deep/ .ivu-form-item-content{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .login-form-user {
        width: 100%;
        .send-code {
          border: none;
          color: #f0ac19;
          font-weight: bold;
          background: transparent;
        }
      }
      .check-agree{
        a{
          color: #f0ac19 !important;
        }
        .ivu-checkbox-checked:hover .ivu-checkbox-inner {
          border-color: #f0ac19;
        }
        /deep/ .ivu-checkbox-checked .ivu-checkbox-inner {
          border-color: #f0ac19;
          background-color: #f0ac19;
        }
      }
      
      .login-form-btn{
        width: 100%;
        button.register_btn.ivu-btn.ivu-btn-default.registing {
            background-color: grey !important;
            border-color: grey !important;
        }
        .register_btn {
            width: 100%;
            background-color: #f0ac19;
            outline: none;
            border-color: #f0ac19;
            color: #fff;
            border-radius: 5px;
            font-size: 18px;
            margin-top: 20px;
        }
      }
    }
  }

  .register-btn{
    text-align: center;
    margin: 5% 0;
    .ivu-btn-warning {
        font-size: 16px;
        width: 200px;
    }
  }

  .code{
    /deep/ .ivu-input-group-append {
        background-color: #f0ac19;
        border: none;
        input#sendCode {
            color: #fff;
        }
    }
  }

  .login-form-two {
    background: transparent;
    padding: 10px 0 80px 0;
    ul {
      width: 95%;
      margin: 0 auto;
      li {
        flex: 0 0 25%;
        display: inline-block;
        width: 100%;
        padding: 0 15px;
        div {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          vertical-align: middle;
          text-align: center;
          margin: 0 auto;
          img {
            height: 125px;
            margin-top: 8px;
          }
        }
        p {
          font-size: 14px;
          margin: 10px 0;
          text-align: center;
          color: #828ea1;
        }
        p.title {
          color: #fff;
          font-size: 18px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>

<script>
export default {
  data() {
    const validateUser = (rule, value, callback) => {
      if (this.changeActive == 1) {
        if (value == "") {
          callback(new Error(this.$t("uc.regist.teltip")));
        }else{
          callback();
        }
      } else {
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        if (value == "") {
          callback(new Error(this.$t("uc.regist.emailtip")));
        } else if (!reg.test(this.formInline.user)) {
          callback(new Error(this.$t("uc.regist.emailerr")));
        } else {
          callback();
        }
      }
    };
    const validateRepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.regist.confirmpwdtip")));
      } else if (value !== this.formInline.password) {
        callback(new Error(this.$t("uc.regist.confirmpwderr")));
      } else {
        callback();
      }
    };
    return {
      country: "America",
      formInline_user:'',
      codedisabled:false,
      sendcodeValue: this.$t("uc.regist.sendcode"),
      isRegister: false,
      ticket: "",
      randStr: "",
      registing: false,
      captchaObj: null,
      modal1: false,
      _captchaResult: null,
      agree: true,
      allowRegister: true,
      buttonLists: [{text: this.$t("uc.regist.emailregist")}],
      areas: [],
      changeActive: 0,
      showCode: true,
      countdown: 60,
      formInline: {
        username: "",
        country: "America",
        user: "",
        code: "",
        areaCode: "",
        password: "",
        repassword: "",
        promotion: ""
      },
      ruleInline: {
        // username: [{ required: true, message: this.$t("uc.regist.usernametip"),trigger: "blur"}],
        user: [{ validator: validateUser, trigger: "blur" }],
        code: [{ required: true, message: this.$t("uc.regist.smscodetip"),trigger: "blur"}],
        password: [
          { required: true, message: this.$t("uc.regist.pwdtip"), trigger: "blur"},
          { type: "string", min: 6, message: this.$t("uc.regist.pwdmsg"), trigger: "blur"}
        ],
        repassword: [{ validator: validateRepassword, trigger: "blur" }],
        // promotion: [{ required: true, message: "Enter promotion code", trigger: "blur"}]
      },
      key: this.$t("uc.regist.emailregist"),
      code: ""
    };
  },
  watch: {
    changeActive: function(val) {
      this.$refs["formInline"].resetFields();
    },
    lang: function() {
      this.updateLangData();
    }
  },
  computed: {
    lang: function() {
      let curlang = this.$store.state.lang;
      if(!curlang){
        curlang = "en_US";
      }
      return curlang;
    },
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  created: function() {
    window.scrollTo(0, 0);
    this.init();
    // this.actives(this.changeActive);
    if(this.$route.query.code != undefined && this.$route.query.code != "" && this.$route.query.code != null){
        this.formInline.promotion = this.$route.query.code;
    }else{
        this.formInline.promotion = "";
    }
  },
  mounted: function(){
    // this.$refs["formInline"].resetFields();
  },
  methods: {
    handleReset(name) {
      this.$refs['formInline'].resetFields();
    },
    updateLangData() {
      this.buttonLists = [{text: this.$t("uc.regist.emailregist")}];
      if (this.changeActive == 1) {
        this.key = this.$t("uc.regist.telno");
      } else {
        this.key = this.$t("uc.regist.email");
      }
    },
    init() {
      this.$store.commit("navigate", "nav-other");
      this.$store.state.HeaderActiveName = "0";
      console.log("this.isLogin",this.isLogin);
      if(this.isLogin) {
        this.$router.push("/");
      }
      window.document.title = (this.lang == "zh_CN" ? "新用户注册 - " : "New Register - ") + "c-deal | Global digital currency trading platform";
      this.getAreas();
    },
    onAreaChange(value) {
      for (var i = 0; i < this.areas.length; i++) {
        if (this.areas[i].zhName == value) {
          this.formInline.areaCode = this.areas[i].areaCode;
        }
      }
    },
    getAreas() {
      this.$http.post(this.host + this.api.common.area).then(response => {
        var resp = response.body;
        this.areas = resp.data;
        this.formInline.country = this.areas[0].zhName;
        this.formInline.areaCode = this.areas[0].areaCode;
      });
    },
    actives: function(index) {
      this.changeActive = index;
      if (this.changeActive == 1) {
        this.key = this.$t("uc.regist.telno");
      } else {
        this.key = this.$t("uc.regist.email");
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.agree == true) {
            if (this.changeActive == 0) {
              if (!this.isRegister) {
                this.registing = true;
                var params = {};
                params["email"] = this.formInline.user;
                params["username"] = this.formInline.user;
                params["password"] = this.formInline.password;
                params["promotion"] = this.formInline.promotion; // 邀请码
                params["country"] = this.formInline.country;//"中国";
                params["superPartner"] = "";
                params["code"] = this.formInline.code;
                params["visitCode"] = this.formInline.visitPassword;

                this.$http.post(this.host + "/uc/register/email", params).then(response => {
                    this.registing = false;
                    var resp = response.body;
                    if (resp.code == 0) {
                      if (this.formInline.superType == "1" || this.formInline.superType == "2") {
                        this.$Notice.success({
                          title: this.$t("common.tip"),
                          desc: "Sign up successful!"
                        });
                        var that = this;
                        setTimeout(() => {
                          that.$router.push("/");
                        }, 3000);
                      } else {
                        this.$Notice.success({
                          title: this.$t("common.tip"),
                          desc: resp.message
                        });
                        var that = this;
                        setTimeout(() => {
                          that.$router.push("/login");
                        }, 3000);
                      }
                    } else {
                      this.registing = false;
                      this.$Notice.error({
                        title: this.$t("common.tip"),
                        desc: resp.message
                      });
                    }
                  });
              } else {
                this.registing = false;
                this.$Notice.error({
                  title: this.$t("common.tip"),
                  desc: "opps"
                });
              }
            } else {
              if (!this.isRegister) {
                this.registing = true;
                var params = {};
                params["phone"] = this.formInline.user;
                params["username"] = this.formInline.user;
                params["password"] = this.formInline.password;
                params["promotion"] = this.formInline.promotion; // 邀请码
                params["code"] = this.formInline.code;
                params["country"] = this.formInline.country;//"中国";
                params["superPartner"] = "";//this.formInline.superType;
                params["ticket"] = this.ticket;
                params["randStr"] = this.randStr;

                this.$http
                  .post(this.host + "/uc/register/phone", params)
                  .then(response => {
                    this.registing = false;
                    var resp = response.body;
                    if (resp.code == 0) {
                      if (
                        this.formInline.superType == "1" ||
                        this.formInline.superType == "2"
                      ) {
                        this.$Notice.success({
                          title: this.$t("common.tip"),
                          desc: "Sign up successful!"
                        });
                        var that = this;
                        setTimeout(() => {
                          that.$router.push("/");
                        }, 3000);
                      } else {
                        this.$Notice.success({
                          title: this.$t("common.tip"),
                          desc: resp.message
                        });
                        var that = this;
                        setTimeout(() => {
                          that.$router.push("/login");
                        }, 3000);
                      }
                    } else {
                      this.registing = false;
                      this.$Notice.error({
                        title: this.$t("common.tip"),
                        desc: resp.message
                      });
                    }
                  });
              } else {
                this.registing = false;
                this.$Notice.error({
                  title: this.$t("common.tip"),
                  desc: "Please input valid sms code."
                });
              }
            }
          } else {
            this.registing = false;
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("uc.regist.agreementtip")
            });
          }
        }
      });
    },
    settime() {
      this.sendcodeValue = this.$t("uc.regist.resendcode") + this.countdown + ")";
      this.codedisabled = true;
      var _this = this;
      let timercode = setInterval(() => {
        _this.countdown--;
        _this.sendcodeValue = _this.$t("uc.regist.resendcode") + _this.countdown + ")";
        if (this.countdown <= 0) {
          clearInterval(timercode);
          _this.codedisabled = false;
          _this.sendcodeValue = _this.$t("uc.regist.sendcode");
          _this.countdown = 60;
        }
      }, 1000);
    },
    sendCode() {
      if(this.changeActive == 1){
        var params = {};
        params["phone"] = this.formInline.user;
        params["country"] = this.formInline.country;
        if(!this.formInline.user){
          this.$Notice.error({title: "Sign up",desc: "The mobile phone can't be empty."});
          return;
        }
        this.settime();
        this.$http.post(this.host + "/uc/mobile/register/code", params).then(response => {
          var resp = response.body;
          resp.code == 0 && this.$Notice.success({title: this.$t("common.tip"),desc: resp.message});
          // resp.code == 0 && this.settime();
          resp.code != 0 && this.$Notice.error({title: this.$t("common.tip"),desc: resp.message});
        });
      }else{
        var params = {};
        params["email"] = this.formInline.user;
        if(!this.formInline.user){
          this.$Notice.error({title: "Sign up",desc: "The email can't be empty."});
          return;
        }
        this.settime();
        this.$http.post(this.host + "/uc/register/email/code", params).then(response => {
          var resp = response.body;
          resp.code == 0 && this.$Notice.success({title: this.$t("common.tip"),desc: resp.message});
          // resp.code == 0 && this.settime();
          resp.code != 0 && this.$Notice.error({title: this.$t("common.tip"),desc: resp.message});
        });
      }
    }
  }
};
</script>
