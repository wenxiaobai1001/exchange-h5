<template>
  <div class="login_form">
      <Form ref="formInline" class="login_form_content" :model="formInline" :rules="ruleInline" inline>
        <div class="logo">
          <img src="../../assets/images/customized/applogo.png" />
        </div>
        <div class="login_title">{{$t('uc.forget.title')}}</div>
          
        <FormItem prop="user" style="width:100%;">
          <Input type="text" size="large" v-model="formInline.user" :placeholder="$t('uc.login.usertip')"></Input>
        </FormItem>

        <FormItem prop="code" style="width:100%;" class="login-form-user code">
          <!-- <div class="flex code"> -->
          <Input type="text" size="large" v-model="formInline.code" :placeholder="$t('uc.forget.smscode')">
            <input class="send-code" style="width:100px" type="Button" slot="append" id="sendCode" @click="sendSMS()" :value="sendcodeValue" :disabled="codedisabled">
          </Input>
          <!-- </div> -->
        </FormItem>

        <FormItem prop="password" class="password" style="width:100%;">
          <Input type="password" size="large" v-model="formInline.password" :placeholder="$t('uc.forget.newpwd')"></Input>
        </FormItem>

        <FormItem prop="repassword" class="password" style="width:100%;">
          <Input type="password" v-model="formInline.repassword" :placeholder="$t('uc.forget.confirmpwd')"></Input>
        </FormItem>

        <div class="pwd-btn">
          <Button type='warning' @click="handleSubmit('formInline')">{{$t('uc.forget.save')}}</Button>
          <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
        </div>

         <div class='to_register' style="font-size:14px;">
          <router-link to="/login">{{$t('uc.login.login')}}</router-link>
        </div>
      </Form>
    <Modal v-model="modal1" :mask-closable="false">
      <p slot="header" style="text-align:center">{{$t('uc.regist.modaltitle')}}</p>
      <div style="text-align:center">
        <div>
          <div id="captcha">
            <p id="wait" class="show">{{$t('uc.login.validatecodeload')}}......</p>
          </div>
        </div>
        <p id="notice" class="hide">{{$t('uc.login.validatemsg')}}</p>
      </div>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>
<script>
const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
export default {
  data() {
    const validateRepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.forget.pwdvalidate1")));
      } else if (value !== this.formInline.password) {
        callback(new Error(this.$t("uc.forget.pwdvalidate2")));
      } else {
        callback();
      }
    };
    return {
      codedisabled:false,
      sendcodeValue: this.$t("uc.regist.sendcode"),
      captchaObj: null,
      modal1: false,
      _captchaResult: null,
      buttonLists: [
        {
          text: this.$t("uc.forget.resettelpwd")
        },
        {
          text: this.$t("uc.forget.resetemailpwd")
        }
      ],
      changeActive: 0,
      countdown: 60,
      formInline: {
        user: "",
        code: "",
        password: "",
        repassword: ""
      },
      ruleInline: {
        // user: [{ validator: validateUser, trigger: "blur" }],
        code: [{ required: true, message: "Please input verify code", trigger: "blur" }],
        password: [
          {
            required: true,
            message: this.$t("uc.forget.newpwdtip"),
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: this.$t("uc.forget.pwdvalidate3"),
            trigger: "blur"
          }
        ],
        repassword: [
          { validator: validateRepassword, trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("uc.forget.pwdvalidate3"),
            trigger: "blur"
          }
        ]
      },
      key: "",
      code: ""
    };
  },
  watch: {
    changeActive: function(val) {
      this.$refs["formInline"].resetFields();
    }
  },
  created: function() {
    this.init();
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    handleReset(name) {
      this.$refs['formInline'].resetFields();
    },
    init() {
      if (this.isLogin) {
        this.$router.push("/");
      } else {
        this.$store.state.HeaderActiveName = "1-4";
      }
    },
    sendSMS(){
	    this.afterValidate();
    },
    afterValidate() {
      this.modal1 = false;
      if(!this.formInline.user){
        this.$Notice.error({ title: this.$t("common.tip"), desc: "Please input phone number or email"});
        return;
      }
      this.settime();
      if (emailReg.test(this.formInline.user)) {
        //发送邮件
        var params = {};
        params["account"] = this.formInline.user;
        this.$http.post(this.host + "/uc/reset/email/code", params).then(response => {
            this.countdown = 60;
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
      } else {
        var params = {};
        params["account"] = this.formInline.user;
        this.$http.post(this.host + "/uc/mobile/reset/code", params).then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Notice.success({title: this.$t("common.tip"),desc: resp.message });
            } else {
              this.$Notice.error({title: this.$t("common.tip"),desc: resp.message});
            }
          });
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (emailReg.test(this.formInline.user)) {
            var params = {};
            params["account"] = this.formInline.user;
            params["code"] = this.formInline.code;
            params["mode"] = 1;
            params["password"] = this.formInline.password;
            this.$http
              .post(this.host + "/uc/reset/login/password", params)
              .then(response => {
                this.countdown = 60;
                var resp = response.body;
                if (resp.code == 0) {
                  this.$Notice.success({
                    title: this.$t("common.tip"),
                    desc: resp.message
                  });
                  this.$router.push("/login");
                } else {
                  this.$Notice.error({
                    title: this.$t("common.tip"),
                    desc: resp.message
                  });
                }
              });
          } else {
            var params = {};
            params["account"] = this.formInline.user;
            params["code"] = this.formInline.code;
            params["mode"] = 0;
            params["password"] = this.formInline.password;
            this.$http
              .post(this.host + "/uc/reset/login/password", params)
              .then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                  this.$Notice.success({
                    title: this.$t("common.tip"),
                    desc:'Reset successful'
                  });
                  this.$router.push("/login");
                } else {
                  this.$Notice.error({
                    title: this.$t("common.tip"),
                    desc: resp.message
                  });
                }
              });
          }
          // this.$Message.success(this.$t('uc.forget.resetpwdsuccess'));
        } else {
        }
      });
    },
    settime() {
      this.sendcodeValue = this.countdown;
      this.codedisabled = true;
      let timercode = setInterval(() => {
        this.countdown--;
        this.sendcodeValue = this.countdown;
        if (this.countdown <= 0) {
          clearInterval(timercode);
          this.codedisabled = false;
          this.sendcodeValue = this.$t("uc.regist.sendcode");
          this.countdown = 60;
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
  .login_form{
    width:100%;
    height:100%;
    padding: 2%;
    background:white;
    .login_form_content{
      padding: 2%;
      .login-form-user {
        width: 100%;
        /deep/ .ivu-input-group-append {
          background-color: #f0ac19;
          border: none;
          input#sendCode {
              color: #fff;
          }
      }
        .send-code {
          border: none;
          color: #f0ac19;
          font-weight: bold;
          background: transparent;
        }
      }
    }
    .logo {
      height: 120px;
      width: 100%;
      text-align: center;
      padding:2%;
      img {
        height: 100%;
        width: auto;
      }
    }

    /deep/ .ivu-form-inline .ivu-form-item{
      // margin-right: 0;
      // border-bottom: 1px solid #ececec;
      input.ivu-input {
          border: none;
          outline: none;
          font-size: 14px;
      }
    }

    .login_title{
      color:#333;
      font-size:18px;
      text-align:center;
      margin-bottom:15px;
    }
    .to_register {
      font-size: 14px;
      margin-top: 20px;
    }
    .pwd-btn{
      text-align: center;
      margin-top: 50px;
      .ivu-btn-warning {
          color: #fff;
          background-color: #f90;
          border-color: #f90;
          width: 200px;
          font-size: 16px;
          font-weight: 600;
      }
    }

    .flex.code {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ivu-input-wrapper {
            width: 60%;
        }
        input#sendCode {
          flex-grow: 1;
          background-color: #f90 !important;
          color: #fff !important;
          font-size: 14px;
          border-radius: 10px;
          margin-left: 2%;
          background: none;
          border: none; 
        }
    }

  }
</style>
