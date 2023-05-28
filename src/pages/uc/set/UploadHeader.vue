<template>
  <div class="page-home">
    <PageHeader :isShowBack=true title="Upload Avatar"></PageHeader>
    <div class="page-content">
      <div class="page-authentication">
        <Form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
          <Row class="page-authentication-upload">
            <div class="page-authentication-upload-item">
              <input type="hidden" name="frontCardImg" :value="formValidate.frontCardImg" />
              <img id="frontCardImg" :src="formValidate.frontCardImg">
              <div class="acc_sc">
                  <Upload ref="upload1" :before-upload="beforeUpload" :on-success="frontHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                      <Button icon="ios-cloud-upload-outline">{{$t('uc.safe.upload')}}</Button>
                  </Upload>
              </div>
            </div>
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
      member:null,
      formValidate: {
        frontCardImg: require("../../../assets/images/upload_placeholder.png"),
      },
      ruleValidate: {
        
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
            this.formValidate.frontCardImg = resp.data.avatar;
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
      this.$refs.upload1.fileList= []
      if (res.code == 0) {
        this.formValidate.frontCardImg =  res.data;
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
      let param = {};
      param["url"] = this.formValidate.frontCardImg;
      this.$http.post(this.host + "/uc/approve/change/avatar", param).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.getMember();
          this.$Message.success(this.$t("uc.safe.save_success"));
          this.$router.push("/my");
        } else {
          this.$Message.error(resp.message);
        }
      });
    }
  }
}
</script>
<style scoped lang="scss">
.page-home{
  height: 100%;
}
.page-content{
  height: 100%;
  background: #fff;
  padding-top: 50px;
  .page-authentication {
    margin: 2%;
    /deep/ .ivu-form{
      .ivu-row {
        margin-top: 10%;
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
            width: 240px;
            // height: 240px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            // padding: 2%;
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
</style>