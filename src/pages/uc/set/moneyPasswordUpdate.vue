<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.edit')"></PageHeader>
    <div class="page-content">
      <div class="page-fund">
        <Form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
            <!-- oldPw -->
            <FormItem :label="$t('uc.safe.oldfundpwd')" prop="oldPw">
                <Input v-model="formValidate.oldPw" size="large" type="password"></Input>
            </FormItem>
            <!-- newMPw -->
            <FormItem :label="$t('uc.safe.newfundpwd')" prop="newMPw">
                <Input v-model="formValidate.newMPw" size="large" type="password"></Input>
            </FormItem>
            <!-- newMPwConfirm -->
            <FormItem :label="$t('uc.safe.confirmnewpwd')" prop="newMPwConfirm">
                <Input v-model="formValidate.newMPwConfirm" size="large" type="password"></Input>
            </FormItem>
            <p style="text-align:right;margin: 4% 2%;font-size: 14px;">
              <router-link to="/moneyPasswordFind">{{$t('uc.forget.title')}}</router-link>
            </p>
            <!-- Button -->
            <FormItem>
              <Button type="warning" @click="handleSubmit('formValidate')">{{$t('uc.safe.save')}}</Button>
              <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
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
      sendMsgDisabled: false,
      isNotVerified: true,
     
      formValidate: {
        oldPw: "",
        newMPw: "",
        newMPwConfirm: ""
      },
      ruleValidate: {
        oldPw: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.oldpwdtip"),
            trigger: "blur"
          },
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
        ],
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
      this.$http.post(this.host + "/uc/mobile/transaction/code")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            me.sendMsgDisabled = true;
            me.$Message.success(resp.message);
            let interval = window.setInterval(function() {
              if (me.time-- <= 0) {
                me.time = 60;
                me.sendMsgDisabled = false;
                window.clearInterval(interval);
              }
            }, 1000);
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
            let param = {};
            param["oldPassword"] = this.formValidate.oldPw;
            param["newPassword"] = this.formValidate.newMPw;
            // param['code'] = this.formValidate.vailCode5
            this.$http
              .post(this.host + "/uc/approve/update/transaction/password", param)
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
    handleReset(name) {
      this.$refs['formValidate'].resetFields();
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
