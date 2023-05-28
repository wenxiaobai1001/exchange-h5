<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.set')"></PageHeader>
    <div class="page-content">
      <div class="page-fund">
        <Form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
            <Row>
              <FormItem :label="$t('uc.safe.fundpwd')" prop="pwd">
                  <Input v-model="formValidate.pwd" size="large" type="password"></Input>
              </FormItem>
            </Row>

            <Row>
              <FormItem :label="$t('uc.safe.confirmpwd')"  prop="confirmpwd">
                  <Input v-model="formValidate.confirmpwd" size="large" type="password"></Input>
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
    const validatepw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.pwdmsg1")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.pwdmsg1")));
      } else {
        callback();
      }
    };
    const validatepwcheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("uc.safe.pwdmsg1")));
      } else if (!/([a-zA-Z0-9]){6,18}/.test(value)) {
        callback(new Error(this.$t("uc.safe.pwdmsg2")));
      } else if (value !== this.formValidate.pwd) {
        callback(new Error(this.$t("uc.safe.pwdmsg2")));
      } else {
        callback();
      }
    };
    return {
      sendMsgDisabled: false,
      isNotVerified: true,
      formValidate: {
        pwd: "",
        confirmpwd: "",
      },
      ruleValidate: {
        pwd: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.pwdmsg1"),
            trigger: "blur"
          },
          { validator: validatepw, trigger: "blur" }
        ],
        confirmpwd: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.pwdmsg2"),
            trigger: "blur"
          },
          { validator: validatepwcheck, trigger: "blur" }
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
    handleSubmit(res){
      this.$refs[res].validate(valid => {
        if (valid) {
          let param = {};
          param["jyPassword"] = this.formValidate.pwd;
          if(!param["jyPassword"]){
            return;
          }
          this.$http.post(this.host + "/uc/approve/transaction/password", param)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(this.$t("uc.safe.save_success"));
              } else {
                this.$Message.error(resp.message);
              }
              this.handleReset();
              this.$router.push("/my");
            });
        } else {
          this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      });
    },
    handleReset() {
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
