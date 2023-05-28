<template>
  <div class="page-home">
    <PageHeader :isShowBack=true title="Real Name Authentication"></PageHeader>
    <div class="page-content">
      <div class="page-authentication">
        <Form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
          <!-- 真实姓名 -->
          <Row>
            <FormItem :label="$t('uc.safe.realname')" prop="realName">
                <Input v-model="formValidate.realName" size="large"></Input>
            </FormItem>
          </Row>
          <Row>
            <!-- 身份证号 -->
            <FormItem :label="$t('uc.safe.idcard')" prop="idCard">
                <Input v-model="formValidate.idCard" size="large"></Input>
            </FormItem>
          </Row>
          <Row class="page-authentication-upload">
            <div class="page-authentication-upload-item">
              <input type="hidden" name="frontCardImg" :value="frontCardImg" />
              <div class="idcard-title">{{$t('uc.safe.upload_positive')}}</div>
              <img id="frontCardImg" :src="frontCardImg">
              <div class="acc_sc">
                  <Upload ref="upload1" :before-upload="beforeUpload" :on-success="frontHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                      <Button icon="ios-cloud-upload-outline">{{$t('uc.safe.upload')}}</Button>
                  </Upload>
              </div>
            </div>
            <div class="page-authentication-upload-item">
              <input type="hidden" name="backCardImg" :value="backCardImg" />
              <div class="idcard-title">{{$t('uc.safe.upload_negative')}}</div>
              <img id="backCardImg" :src="backCardImg">
              <div class="acc_sc">
                  <Upload ref="upload2" :before-upload="beforeUpload" :on-success="backHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                      <Button  icon="ios-cloud-upload-outline">{{$t('uc.safe.upload')}}</Button>
                  </Upload>
              </div>
            </div>
            <div class="page-authentication-upload-item">
              <input type="hidden" name="handCardImg" :value="handCardImg" />
              <div class="idcard-title">{{$t('uc.safe.upload_hand')}}</div>
              <img id="handCardImg" :src="handCardImg">
              <div class="acc_sc">
                  <Upload ref="upload3" :before-upload="beforeUpload" :on-success="handHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                      <Button icon="ios-cloud-upload-outline">{{$t('uc.safe.upload')}}</Button>
                  </Upload>
              </div>
            </div>
          </Row>
          <Row class="idcard-desc">
              <p>{{$t('uc.safe.idcard_verifymsg1')}}</p>
              <p>{{$t('uc.safe.idcard_verifymsg2')}}</p>
              <p>{{$t('uc.safe.idcard_verifymsg3')}}</p>
          </Row>
          <!-- Button -->
          <Row class="page-authentication-btn">
            <FormItem>
              <Button v-if="isNotVerified" type="warning" @click="handleSubmit('formValidate')">{{$t('uc.safe.save')}}</Button>
              <!-- <Button @click="handleReset('formValidate')">{{$t('uc.safe.reset')}}</Button> -->
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
    let self = this;
    return {
      isNotVerified: true,
      uploadUrl: this.host + "/uc/upload/oss/image",
      uploadHeaders: { "x-auth-token": localStorage.getItem("TOKEN") },
      name:null,
      idCard:null,
      handCardImg: require("../../../assets/images/my/Hasidcard.png"),
      frontCardImg: require("../../../assets/images/my/idcardFront.png"),
      backCardImg: require("../../../assets/images/my/idcardBack.png"),
      member:null,
      formValidate: {
        realName: "",
        idCard: ""
      },
      ruleValidate: {
        realName: [
          {
            required: true,
            message: this.$t("uc.safe.realnametip"),
            trigger: "blur"
          }
        ],
        idCard: [
          {
            required: true,
            message: this.$t("uc.safe.idcardtip"),
            trigger: "blur"
          }
        ]
      },
    };
  },
  created: function() {
    this.getMember();
  },
  mounted: function() {
  },
  destroyed: function () {  
  }, 
  computed: {
   
  },
  watch: {
    
  },
  filters:{
    
  },
  methods: {
    getMember() {
      //获取个人安全信息
      this.$http.post(this.host + "/uc/approve/security/setting")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.member = resp.data;
            this.formValidate.realName = resp.data.realName;
            this.formValidate.idCard = resp.data.idCard;
            this.isNotVerified = resp.data.realVerified==1?false:true;
          } else {
            this.$Message.error(this.loginmsg);
          }
        });
    },
    beforeUpload(data) {
      if (data && data.size >= 1024000 * 8) {
        this.$Message.error("The image is less than 8M");
        return false;
      }
    },
    frontHandleSuccess(res, file,fileList) {
      this.$refs.upload2.fileList= []
      if (res.code == 0) {
        this.frontCardImg =  res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    backHandleSuccess(res, file,fileList) {
      this.$refs.upload3.fileList= []
      if (res.code == 0) {
        this.backCardImg = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    handHandleSuccess(res, file,fileList) {
     this.$refs.upload1.fileList= []
      if (res.code == 0) {
        this.handCardImg =  res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submit();
        } else {
          this.$Message.error(this.$t("uc.safe.save_failure"));
        }
      });
    },
    submit(){
      if (this.frontCardImg == "") {
        this.$Message.error(this.$t("uc.safe.upload_positivetip"));
        return false;
      }
      if (this.backCardImg == "") {
        this.$Message.error(this.$t("uc.safe.upload_negativetip"));
        return false;
      }
      if (this.handCardImg == "") {
        this.$Message.error(this.$t("uc.safe.upload_handtip"));
        return false;
      }

      let param = {};
      param["realName"] = this.formValidate.realName;
      param["idCard"] = this.formValidate.idCard;
      param["idCardFront"] = this.frontCardImg;
      param["idCardBack"] = this.handCardImg;
      param["handHeldIdCard"] = this.handCardImg;

      this.$http.post(this.host + "/uc/approve/real/name", param).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.getMember();
          this.$store.commit("setMember", this.member);
          this.$Message.success(this.$t("uc.safe.save_success"));
        } else {
          this.$Message.error(resp.message);
        }
      });
    }
  }
}
</script>
<style scoped lang="scss">
.page-content{
  background: #fff;
  padding-top: 50px;
  .page-authentication {
    margin: 2%;
    /deep/ .ivu-form{
      .ivu-row {
        margin-bottom: 10px;
        label.ivu-form-item-label {
          font-size: 14px !important;
          font-weight: 600;
        }
        .ivu-form-item-error-tip {
          font-size: 14px;
        }
      }
      .page-authentication-upload.ivu-row {
          display: flex;
          justify-content: space-between;
          .page-authentication-upload-item {
            width: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2%;
            img {
              width: 100%;
              height: auto;
            }
            .idcard-title {
              width: 100%;
              text-align: center;
            }
            .acc_sc {
              width: 100%;
              text-align: center;
              margin-top: 5px;
            }
          }
      }
      .idcard-desc.ivu-row {
        font-size: 14px;
        p {
            margin: 2% 1%;
        }
      }
      .page-authentication-btn.ivu-row{
        button.ivu-btn.ivu-btn-warning {
          width: 100%;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}

  .about{
    background:#fff;
  }

 .user{
    margin-top:20px;
 }

.login_btn {
    width: 100%;
    background-color: #f0ac19;
    outline: none;
    border-color: #f0ac19;
    color: #fff;
    border-radius: 5px;
    font-size: 18px;
    margin: 8% auto 4%;
}

 .set_img{
  width:80%;
  display:block;
  margin:0 auto 3%;
 }

 .photoimg{
   text-align:center;
   margin-top:3%;
 }
</style>