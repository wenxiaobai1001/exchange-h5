<template>
  <div class="login_form">
      <Form ref="formInline" class="login_form_content" :model="formInline" :rules="ruleInline" inline>
        <div class="logo-wrap">
          <img src="../../assets/images/logo.png" class="logo" />
        </div>
        <div class="login_title">{{$t('uc.forget.title')}}</div>
        <FormItem prop="user"  class="specialitem">
          <Input type="text" size="large" v-model="formInline.user" :placeholder="$t('uc.login.usertip')"></Input>
        </FormItem>
		<div class="codesend">
			<FormItem prop="code"  class="specialitem">
			  <!-- <div class="flex code"> -->
			  <Input type="text" size="large" v-model="formInline.code" :placeholder="$t('uc.forget.smscode')"></Input>
			  <!-- </div> -->
			</FormItem>
			<span class="send-code" style="width:100px"  id="sendCode" @click="sendSMS()">{{sendcodeValue}}</span>
		</div>

        <FormItem prop="password" class="password specialitem">
          <Input type="password" size="large" v-model="formInline.password" :placeholder="$t('uc.forget.newpwd')"></Input>
        </FormItem>

        <FormItem prop="repassword" class="specialitem password">
          <Input type="password" v-model="formInline.repassword" size="large"  :placeholder="$t('uc.forget.confirmpwd')"></Input>
        </FormItem>
        <div type='warning' @click="handleSubmit('formInline')" class="btnlogin">{{$t('uc.forget.save')}}</div>
          <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->

         <div class='to_register' style="font-size:14px;">
          <router-link to="/login" style="color: #2de2b4;">{{$t('uc.login.login')}}</router-link>
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
	padding: 0 22px 0 22px;
}
.code{
	display: flex;
	padding: 16px 0 0 0;
	margin:10px auto;
	align-items: center;
	justify-content: space-between;
}
.login-btn{
	padding: 16px 0 0 0;
}
.to_register{
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
}
.btnlogin{
	width: 100%;
	background: linear-gradient(0deg,#2a6972,#2bd4ac);
	color: #fff;
	height: 44px;
	margin: 16px 0 0 0;
	line-height: 44px;
	border-radius: 5px;
	text-align: center;
	font-size: 19px;
}
.logo-wrap{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 59px;
	position: relative;
	top:44px;
	.logo{
		width: 88px;
		height: 88px;
	}
	.switch-language{
	    position: absolute;
	    top: 5px;
	    right: 16px;
	    color: #2de2b4;
	}
}
.login_title{
	color: rgb(226, 232, 228);
	text-align: center;
}
.codesend{
	position: relative;
	.send-code{
		position: absolute;
		right: 15px;
		top: 44%;
		color: #2de2b4;
		text-align: right;
	}
}
</style>
