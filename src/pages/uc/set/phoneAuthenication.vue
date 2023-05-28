<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.safe.bindphone')"></PageHeader>
    <div class="page-content">
      <div class="page-mobile">
        <Form ref="formValidate" label-position="top" :model="formValidate" class="width" :rules="ruleValidate">
          <Row>
            <FormItem :label="$t('uc.safe.country')" prop="country">
                <Select filterable v-model="formValidate.country" style="width: 100%; margin-bottom:10px;">
                  <Option :value="item.zhName" v-for="item in areas" v-bind:key="item.zhName">+{{item.areaCode}} - {{item.enName}}</Option>
                </Select>
            </FormItem>
          </Row>

          <Row>
            <FormItem :label="$t('uc.safe.phone')" prop="mobile">
              <Input v-model="formValidate.mobile" size="large"></Input>
          </FormItem>
          </Row>
          
          <Row>
            <FormItem :label="$t('uc.safe.loginpwd')" prop="password">
              <Input v-model="formValidate.password" size="large" type="password"></Input>
          </FormItem>
          </Row>

          <!-- <Row>
            <FormItem :label="$t('uc.safe.phonecode')" prop="vailCode2">
              <Input v-model="formValidate.password" size="large" type="password"></Input>
          </FormItem>
          </Row> -->

          <Row>
            <FormItem :label="$t('uc.safe.phonecode')" prop="vailCode2">
                <Input v-model="formValidate.vailCode2" size="large" class="send-sms-custom">
                <!-- <Button slot="append">点击获取</Button> -->
                <div class="timebox" slot="append">
                    <Button @click="send" :disabled="sendMsgDisabled2" type="text">
                        <span v-if="sendMsgDisabled2">{{time2+$t('uc.safe.second')}}</span>
                        <span v-if="!sendMsgDisabled2">{{$t('uc.safe.clickget')}}</span>
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
      areas: [],
      formValidate: {
        mobile: "",
        vailCode2: "",
        password: "",
        country:""
      },
      time2: 60, // 发送验证码倒计时
      ruleValidate: {
        mobile: [
          {
            required: true,
            message: this.$t("uc.safe.telnotip"),
            trigger: "blur"
          }
        ],
        vailCode2: [
          {
            required: true,
            message: this.$t("uc.safe.codetip"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            type: "string",
            min: 6,
            message: this.$t("uc.safe.pwdmsg1"),
            trigger: "blur"
          }
        ],
      },
      sendMsgDisabled2: false,
    };
  },
  watch: {
   
  },
  created: function() {
    this.getMember();
    this.getAreas();
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
            this.formValidate.email = resp.data.email;
            // this.isNotVerified = resp.data.phoneVerified==1?false:true;
          } else {
            this.$Message.error(this.loginmsg);
          }
        });
    },
    getAreas() {
      this.$http.post(this.host + this.api.common.area).then(response => {
        var resp = response.body;
        this.areas = resp.data;
        this.formValidate.country = this.areas[0].zhName;
        this.formValidate.areaCode = this.areas[0].areaCode;
      });
    },
    handleSubmit(res){
        this.$refs[res].validate(valid => {
          if (valid) {
            let param = {};
            param["phone"] = this.formValidate.mobile;
            param["code"] = this.formValidate.vailCode2;
            param["password"] = this.formValidate.password;
            param["country"] = this.formValidate.country;
            this.$http
              .post(this.host + "/uc/approve/bind/phone", param)
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
    handleReset(name) {
      this.$refs['formValidate'].resetFields();
    },
    send() {
      let me = this;
      if (this.formValidate.mobile) {
        me.sendMsgDisabled2 = true;
        let interval = window.setInterval(function() {
          if (me.time2-- <= 0) {
            me.time2 = 60;
            me.sendMsgDisabled2 = false;
            window.clearInterval(interval);
          }
        }, 1000);
        //获取手机code
        this.$http.post(this.host + "/uc/mobile/bind/code", {
            phone: this.formValidate.mobile,
            country : this.formValidate.country
          }).then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.success(resp.message);
            } else {
              this.$Message.error(resp.message);
            }
          });
      } else {
        this.$refs.formValidate.validateField("mobile");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page-home{
  height: 100%;
  .page-content{
    height: 100%;
    background: #fff;
    padding-top: 50px;
    .page-mobile{
      margin: 2%;
      /deep/ .ivu-form{
        .ivu-row{
          .ivu-select-single .ivu-select-input {
            font-size: 14px;
          }
          ivu-form-item-error-tip {
            font-size: 14px;
          }
          label.ivu-form-item-label {
            font-size: 14px;
            font-weight: 600;
          }
          button.ivu-btn.ivu-btn-warning {
            width: 100%;
            font-weight: 600;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>