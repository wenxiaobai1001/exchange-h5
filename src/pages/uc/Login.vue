<template>
  <div class="login_form">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <div class="logo">
          <img src="../../assets/images/customized/applogo.png" />
        </div>
        <div class="login_title">
          Hi, <br/>
          Welcome to c-deal
        </div>
        <FormItem prop="user">
          <Input name="user" size="large" type="text" v-model="formInline.user" :placeholder="$t('uc.login.usertip')" class="user"></Input>
        </FormItem>
        <FormItem prop="password" class="password">
          <Input type="password" size="large" v-model="formInline.password" :placeholder="$t('uc.login.pwdtip')" @on-keyup="onKeyup"></Input>
        </FormItem>
        <div style="display: flex;justify-content: space-between;">
          <FormItem prop="code" class="code" width="50px">
            <Input type="text" name="code" v-model="formInline.code"></Input>
          </FormItem>
          <img :src="captcha" height="32px" @click="initCaptcha" style="cursor: pointer;">
        </div>

        <div class="to_register">
          <div>
            <span>{{$t('uc.login.noaccount')}}</span>
            <router-link to="/register">{{$t('uc.login.goregister')}}</router-link>
          </div>
          <div>
            <router-link to="/findPwd" style="color:#979797;float:right;padding-right:10px;font-size:14px;">{{$t('uc.login.forget')}}</router-link>
          </div>
        </div>

        <div class="login-btn">
          <Button type='warning' @click="handleSubmit('formInline')">{{$t('uc.login.login')}}</Button>
          <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
        </div>
      </Form>
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
  width:100%;
  height:100%;
  padding: 2%;
  background:white;
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
  .login_title{
    color: #333;
    font-size: 18px;
    text-align: left;
    margin-bottom: 15px;
    padding: 2%;
    font-weight: 600;
  }
  .to_register {
    align-items: center;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    padding: 5% 2%;
    margin-top: 50px;
  }
  .login-btn {
      text-align: center;
      padding: 5%;
      .ivu-btn-warning {
        color: #fff;
        background-color: #f90;
        border-color: #f90;
        width: 200px;
        font-size: 16px;
        font-weight: 600;
      }
  }
  .ivu-form-item-error-tip {
    font-size: 14px;
  }
  .ivu-form-inline .ivu-form-item{
    border-bottom:1px solid #ececec;
    display:block;
    // margin:0 auto 10px;
    background:none;
    .ivu-form-item-error .ivu-input{
      border:none;
      font-size: 16px;
    }
    /deep/ .ivu-input{
      border:none;
      outline:none;
      border-radius:0;
      height: 40px;
      font-size: 16px;
      padding: 2%;
    }
  }
}
</style>

