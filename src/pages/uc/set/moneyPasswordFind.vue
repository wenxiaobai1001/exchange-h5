<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.edit')"></PageHeader>
    <div class="page-content">
      <div class="page-fund">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <!-- newMPw -->
          <FormItem :label="$t('uc.safe.newfundpwd')" prop="newMPw">
            <Input v-model="formValidate.newMPw" size="large" type="password"></Input>
          </FormItem>
          <!-- newMPwConfirm -->
          <FormItem :label="$t('uc.safe.confirmnewpwd')" prop="newMPwConfirm">
            <Input v-model="formValidate.newMPwConfirm" size="large" type="password"></Input>
          </FormItem>
          <!-- 邮箱验证码 -->
          <FormItem :label="$t('uc.safe.phonecode')" prop="vailCode">
            <Input v-model="formValidate.vailCode" size="large" class="send-sms-custom">
            <div class="timebox" slot="append">
                <Button @click="send(5)" :disabled="sendMsgDisabled">
                    <span v-if="sendMsgDisabled">{{time+$t('uc.safe.second')}}</span>
                    <span v-if="!sendMsgDisabled">{{$t('uc.safe.clickget')}}</span>
                </Button>
            </div>
            </Input>
          </FormItem>
          <!-- Button -->
          <FormItem>
            <Button type="warning" @click="handleSubmit('formValidate')">{{$t('uc.safe.save')}}</Button>
            <!-- <Button  @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader },
  data() {
    const validateMPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.pwdmsg1")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.pwdmsg1")));
      } else {
        callback();
      }
    };
    const validateMPassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.pwdmsg2")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.pwdmsg2")));
      } else if (value !== this.formValidate.newMPw) {
        callback(new Error(this.$t("uc.safe.pwdmsg2")));
      } else {
        callback();
      }
    };
    return {
      time:60,
      sendMsgDisabled: false,
      isNotVerified: false,
      formSetValidate: {
        pw: "",
        confirmpwd: "",
      },
      formValidate: {
        newMPw: "",
        newMPwConfirm: "",
        vailCode: ""
      },
      ruleValidate: {
        vailCode: [
          {
            required: true,
            message: this.$t("uc.safe.codetip"),
            trigger: "blur"
          }
        ],
        newMPw: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.pwdmsg1"),
            trigger: "blur"
          },
          { validator: validateMPass, trigger: "blur" }
        ],
        newMPwConfirm: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.pwdmsg2"),
            trigger: "blur"
          },
          { validator: validateMPassCheck, trigger: "blur" }
        ]
      },
    };
  },
  watch: {
   
  },
  created: function() {
    
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    send(index) {
      let me = this;
      //资金密码获取手机code
      me.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
        if (me.time-- <= 0) {
          me.time = 60;
          me.sendMsgDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
      this.$http.post(this.host + "/uc/mobile/transaction/code")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            me.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleSubmit(res){
      this.$refs[res].validate(valid => {
        if (valid) {
          //找回资金密码
          let param = {};
          param["newPassword"] = this.formValidate.newMPw;
          param["code"] = this.formValidate.vailCode;
          this.$http.post(this.host + "/uc/approve/reset/transaction/password", param)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(this.$t("uc.safe.save_success"));
                this.handleReset("formValidate");
                this.$router.push("/my");
              } else {
                this.$Message.error(resp.message);
              }
          });
        } else {
          this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      });
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
    .page-fund{
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
