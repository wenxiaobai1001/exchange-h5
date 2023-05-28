<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.bindemail')"></PageHeader>
    <div class="page-content">
      <div class="page-email">
        <Form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
          <Row>
            <FormItem :label="$t('uc.safe.email')" prop="mail">
              <Input v-model="formValidate.mail" size="large"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('uc.safe.loginpwd')" prop="password">
              <Input v-model="formValidate.password" size="large" type="password"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('uc.safe.emailcode')" prop="vailCode">
              <Input v-model="formValidate.vailCode" size="large" class="send-sms-custom">
              <!-- <Button slot="append">点击获取</Button> -->
              <div class="timebox" slot="append">
                <Button @click="send" :disabled="sendMsgDisabled1" type="text">
                  <span v-if="sendMsgDisabled1">{{time1+$t('uc.safe.second')}}</span>
                  <span v-if="!sendMsgDisabled1">{{$t('uc.safe.clickget')}}</span>
                </Button>
              </div>
              </Input>
            </FormItem>
          </Row>
          <Row>
          <FormItem>
            <Button type="warning" @click="handleSubmit('formValidate')">{{$t('uc.safe.save')}}</Button>
            <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('uc.safe.reset')}}</Button> -->
          </FormItem>
          </Row>
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
    return {
        isNotVerified: true,
        time1:60,
        formValidate: {
          mail: "",
          vailCode: "",
          password: ""
        },
        ruleValidate: {
          mail: [
            {
              required: true,
              type: "email",
              message: this.$t("uc.safe.emailtip"),
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              message: this.$t("uc.regist.pwdtip"),
              trigger: "blur"
            }
          ],
          vailCode: [
            {
              required: true,
              message: this.$t("uc.safe.codetip"),
              trigger: "blur"
            }
          ]
        },
        sendMsgDisabled1: false,
    };
  },
  watch: {
   
  },
  created: function() {
    this.getMember();
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    getMember() {
      //获取个人安全信息
      this.$http.post(this.host + "/uc/approve/security/setting")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.formValidate.mail = resp.data.email;
            // this.isNotVerified = resp.data.emailVerified==1?false:true;
          } else {
            this.$Message.error(this.loginmsg);
          }
        });
    },
    handleSubmit(res){
      this.$refs[res].validate(valid => {
        if (valid) {
          let param = {};
          param["email"] = this.formValidate.mail;
          param["code"] = this.formValidate.vailCode;
          param["password"] = this.formValidate.password;
          this.$http
            .post(this.host + "/uc/approve/bind/email", param)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(this.$t("uc.safe.save_success"));
                this.$router.push("/my");
              } else {
                this.$Message.error(resp.message);
              }
              this.getMember();
            });
        } else {
          this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      });
    },
    send() {
      let me = this;
      if (this.formValidate.mail) {
        me.sendMsgDisabled1 = true;
        let interval = window.setInterval(function() {
          if (me.time1-- <= 0) {
            me.time1 = 60;
            me.sendMsgDisabled1 = false;
            window.clearInterval(interval);
          }
        }, 1000);
        //获取邮箱code
        this.$http.post(this.host + "/uc/bind/email/code", {email: this.formValidate.mail})
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              me.$Message.success(resp.message);
            } else {
              me.$Message.error(resp.message);
            }
          });
      } else {
        this.$refs.formValidate.validateField("mail");
      }
    },
    handleReset(name) {
      this.$refs['formValidate'].resetFields();
    },
}
};
</script>
<style lang="scss" scoped>
.page-home {
    width: 100%;
    height: 100%;
}
.page-content{
  height: 100%;
  background: #fff;
  padding-top: 50px;
  .page-email{
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
</style>
