<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.loginpwd')"></PageHeader>
    <div class="page-content">
      <div class="page-password">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <Row>
              <FormItem :label="$t('uc.safe.oldpwd')" prop="oldPw">
                  <Input v-model="formInline.oldPw" size="large" type="password"></Input>
              </FormItem>
          </Row>

          <Row>
            <FormItem :label="$t('uc.safe.newpwd')" prop="newMPw">
                <Input v-model="formInline.newMPw" size="large" type="password"></Input>
            </FormItem>
          </Row>

          <Row>
            <FormItem :label="$t('uc.safe.confirmnewpwd')"  prop="newMPwConfirm">
                <Input v-model="formInline.newMPwConfirm" size="large" type="password"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('uc.safe.emailcode')" prop="vailCode" style="padding-bottom: 2px;">
                <Input v-model="formInline.vailCode" size="large" class="send-sms-custom">
                <!-- <Button slot="append">点击获取</Button> -->
                <div class="timebox" slot="append">
                    <Button @click="send" :disabled="sendMsgDisabled" type="text">
                        <span v-if="sendMsgDisabled">{{time+$t('uc.safe.second')}}</span>
                        <span v-if="!sendMsgDisabled">{{$t('uc.safe.clickget')}}</span>
                    </Button>
                </div>
                </Input>
            </FormItem>
          </Row>

          <Row>
          <FormItem style="margin:50px auto 15px; border:none;">
              <Button type="warning" @click="handleSubmit('formInline')">{{$t('uc.safe.save')}}</Button>
              <!-- <Button @click="handleReset('formInline')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
          </FormItem>
          </Row>
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
    </div>
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.newpwdmsg1")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.newpwdmsg1")));
      } else {
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.newpwdmsg2")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.newpwdmsg2")));
      } else if (value !== this.formInline.newMPw) {
        callback(new Error(this.$t("uc.safe.newpwdmsg2")));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        oldPw: "",
        newMPw: "",
        newMPwConfirm: "",
        vailCode:''
        // vailCode5: '',
      },
      codedisabled:false,
      sendcodeValue: this.$t("uc.regist.sendcode"),
      sendMsgDisabled:false,
      captchaObj: null,
      modal1: false,
      time: 60, // 发送验证码倒计时
      ruleInline: {
       vailCode: [
          {
            required: true,
            message: this.$t("uc.safe.codetip"),
            trigger: "blur"
          }
        ],
        oldPw: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.oldpwdtip"),
            trigger: "blur"
          }
        ],
        newMPw: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.newpwdmsg1"),
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        newMPwConfirm: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.newpwdmsg2"),
            trigger: "blur"
          },
          { validator: validatePassCheck, trigger: "blur" }
        ],
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
    
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    send(){
      //登录密码获取手机code
      this.$http
        // .post(this.host + "/uc/mobile/update/password/code")
          .post(this.host + "/uc/reset/email/codeNew").then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.sendMsgDisabled = true;
            this.$Message.success(resp.message);
            let interval = setInterval(() => {
              if (this.time-- <= 0) {
                this.time = 60;
                this.sendMsgDisabled = false;
                clearInterval(interval);
              }
            }, 1000);
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    sendSMS(){
	    this.afterValidate();
    },
    handleSubmit(res){
      let self = this;
      this.$refs[res].validate(valid => {
        if (valid) {
          let param = {};
          param["oldPassword"] = this.formInline.oldPw;
          param["newPassword"] = this.formInline.newMPw;
          param["code"] = this.formInline.vailCode;
          this.$http
            .post(this.host + "/uc/approve/update/password/email", param)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(this.$t("uc.safe.save_success"));
                localStorage.removeItem("MEMBER");
                localStorage.removeItem("TOKEN");
                this.$store.state.showLogout = true;
                this.$store.state.showLogin = false;
                let self = this;
                setTimeout(() => {
                  self.$router.push("/login");
                }, 1000);
              } else {
                this.$Message.error(resp.message);
              }
            });
        } else {
          this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      });
    },
     handleReset(name) {
      this.$refs['formInline'].resetFields();
    },
  }
};
</script>
<style lang="scss" scoped>
.page-home{
  height: 100%;
  .page-content{
    background: #fff;
    height: 100%;
    padding-top: 50px;
    .page-password{
      margin: 2%;
      margin: 2%;
      /deep/ .ivu-form{
        .ivu-row {
          margin-bottom: 10px;
        }
        label.ivu-form-item-label {
          font-size: 14px !important;
          font-weight: 600;
        }
        .ivu-form-item-error-tip {
          font-size: 14px;
        }
        button.ivu-btn.ivu-btn-warning {
          width: 100%;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
