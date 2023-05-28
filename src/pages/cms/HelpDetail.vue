<template>
  <div class="page-home">
    <PageHeader title="Help"></PageHeader> 
    <div class="page-content">
      <div class="helpdetail">
        <div class="main">
          <h3 class="title">{{article.title}}</h3>
          <p class="time">{{article.createTime}}</p>
          <div class="content">
            <div v-html="article.content"></div>
            <div class="show-qrcode" style="text-align: right;padding: 15px 10px;border-radius:10px;background:#FFF;margin-top: 30px;">
              <qriously :value="qrcode.value" :size="qrcode.size" foreground="#000" />
              <div style="width:150px;float:right;text-align:center;">{{$t("cms.scanforshare")}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);
import PageHeader from '@/components/header/index.vue';
export default {
  components: {
    VueQriously,
    PageHeader
  },
  data() {
    return {
      article: {}, //文章详情
      qrcode: {
        value: "",
        size: 150
      }
    };
  },
  created() {
    const {id} = this.$route.query;
    this.id = id;
    this.qrcode.value = window.location.href;
    this.getData(id);
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
  methods: {
    getData(id) {
      this.$http.post(this.host + "/uc/ancillary/more/help/detail", {id}).then(res => {
        if (res.status == 200 && res.body.code == 0) {
          this.article = res.body.data;
        } else {
          this.$Message.error(res.body.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.helpdetail{
  width: 100%;
  padding-top: 50px;
  .main {
    margin: 2% 0;
    background-color: #fff;
    padding: 2%;
    .title {
      text-align: center;
      padding: 4% 2%;
      font-size: 16px;
      font-weight: 800;
    }
    .time {
      font-size: 12px;
      margin: 2% 0;
    }
    .content {
      font-size: 14px;
    }
  }
}
</style>



