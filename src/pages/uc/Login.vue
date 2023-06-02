<template>
  <div class="login_form">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <div class="logo-wrap">
          <img src="../../assets/images/logo.png" class="logo" />
		  <div class="switch-language">语言切换</div>
        </div>
        <FormItem prop="user" class="specialitem">
          <Input name="user" size="large" type="text" v-model="formInline.user" :placeholder="$t('uc.login.usertip')" class="user"></Input>
        </FormItem>
        <FormItem prop="password" class="password specialitem">
          <Input type="password" size="large" v-model="formInline.password" :placeholder="$t('uc.login.pwdtip')" @on-keyup="onKeyup"></Input>
        </FormItem>
        <div class="code">
          <FormItem prop="code"  width="100px">
            <Input type="text" name="code" v-model="formInline.code"></Input>
          </FormItem>
          <img :src="captcha" height="32px" @click="initCaptcha" style="cursor: pointer;">
        </div>



          <div @click="handleSubmit('formInline')" class="btnlogin">{{$t('uc.login.login')}}</div>
          <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
      </Form>
	  <div class="to_register">
	    <div>
	      <span>{{$t('uc.login.noaccount')}}</span>
	      <router-link to="/register" style="color: #2de2b4;">{{$t('uc.login.goregister')}}</router-link>
	    </div>
	    <div>
	      <router-link to="/findPwd" style="color:#979797;float:right;padding-right:10px;font-size:14px;">{{$t('uc.login.forget')}}</router-link>
	    </div>
	  </div>
  </div>
</template>
<style scoped lang="scss">
/* 验证码 */
</style>
<script>
import gtInit from "../../assets/js/gt.js";
import $ from "jquery";
export default {
  data() {
    return {
      changeActive:0,
      country: "+86",
      captchaObj: null,
      _captchaResult: null,
      captcha:"",
      formInline: {
        user: "",
        password: "",
        code:"",
        uuid:""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: this.$t("uc.login.loginvalidate"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("uc.login.pwdvalidate1"),
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: this.$t("uc.login.pwdvalidate2"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.init();
  },
  mounted: function(){
    // setInterval(() => {
    //   this.changeActive=this.changeActive+1;
    // }, 1000);
  },
  watch: {
    changeActive: function(val) {
      // console.log(val);
      this.$refs["formInline"].resetFields();
    }
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
      this.$store.commit("navigate", "nav-other");
      this.$store.state.HeaderActiveName = "0";
      if (this.isLogin) {
        this.$router.push("/my");
      } else {
        this.initGtCaptcha();
      }
      this.initCaptcha();
    },
    onKeyup(ev) {
      if (ev.keyCode == 13) {
        $(".login_btn").click();
      }
    },
    initCaptcha(){
      var that = this;
      this.$http.get(this.host + "/uc/uuid/captchaNew?t="+new Date().getTime()).then(function(res) {
        that.captcha = "data:image/jpeg;base64,"+res.data.data.img;
        that.formInline.uuid = res.data.data.uuid;
      });
    },
    initGtCaptcha() {
      var that = this;
      this.$http.get(this.host + this.api.uc.captcha).then(function(res) {
        window.initGeetest({
            // 以下配置参数来自服务端 SDK
            gt: res.body.gt,
            challenge: res.body.challenge,
            offline: !res.body.success, //表示用户后台检测极验服务器是否宕机
            new_captcha: res.body.new_captcha, //用于宕机时表示是新验证码的宕机
            product: "bind",
            width: "100%"
          },
          this.handler
        );
      });
    },
    handler(captchaObj) {
      captchaObj.onReady(() => {
          $("#wait").hide();
        }).onSuccess(() => {
          let result = (this._captchaResult = captchaObj.getValidate());
          if (!result) {
            this.$Message.error("Please finish verification");
          } else {
            this.handleSubmit("formInline");
          }
        });
      $(".login_btn").click(() => {
        // let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        // tel = this.formInline.user,
         let flagtel = this.formInline.user.length>=4 ? true : false, 
         flagpass = this.formInline.password.length >= 6 ? true : false;
         flagtel && flagpass; // && captchaObj.verify(); 
         (!flagtel || !flagpass) && this.$Message.error(this.$t("common.fillComplete"));
         this.handleSubmit("formInline"); // 屏蔽了验证
      });
    },
    logout() {
      this.$http.post(this.host + "/uc/logout", {}).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          localStorage.setItem("MEMBER", JSON.stringify(null));
          localStorage.setItem("TOKEN", null);
          localStorage.removeItem("USERKEY", null);
        } else {
          // this.$Message.error(resp.message);
        }
      });
    },
    handleSubmit(name) {
      // 不带验证
      this.$refs[name].validate(valid => {
        if (valid) {
          var params = {};
          params["username"] = this.formInline.user;
          params["password"] = this.formInline.password;
          params["uuid"] = this.formInline.uuid;
          params["code"] = this.formInline.code;
          this.$http.post(this.host + this.api.uc.login, params).then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(this.$t("uc.login.success"));
                this.$store.commit("setMember", response.body.data);
                if (this.$route.query.key != null && this.$route.query.key != "") {
                  localStorage.setItem("USERKEY", this.$route.query.key);
                }
                this.$router.push("/my");
              } else {
                this.$Message.error(resp.message);
              }
              this.initCaptcha();
            });
        } else {
          this.initCaptcha();
        }
      });
      /* 带验证*/
      var result = this._captchaResult;
      if (!result) {
        // $("#notice").show();
        setTimeout(function() {
          $("#notice").hide();
        }, 2000);
      } else {
        this.$refs[name].validate(valid => {
          if (valid) {
            var params = {};
            params["username"] = this.formInline.user;
            params["password"] = this.formInline.password;
            params["uuid"] = this.formInline.uuid;
            params["code"] = this.formInline.code;

            this.$http.post(this.host + this.api.uc.login, params).then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                  this.$Message.success(this.$t("uc.login.success"));
                  this.$store.commit("setMember", response.body.data);
                  if (this.$route.query.key != null && this.$route.query.key != "") {
                    localStorage.setItem("USERKEY", this.$route.query.key);
                  }
                  this.$router.push("/my");
                } else {
                  this.$Message.error(resp.message);
                }
                this.initCaptcha();
              });
          } else {
            this.initCaptcha();
          }
        });
      }
      
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
	margin-bottom: 93px;
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

</style>

