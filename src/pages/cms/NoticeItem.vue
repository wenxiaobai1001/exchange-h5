<template>
  <div class="page-home">
    <PageHeader :title="$t('common.announcementDetail')"></PageHeader>
    <div class="page-content">
      <div class="page-notice">
        <div class="header">
          <h2>{{data.info.title}}</h2>
          <span>{{data.info.createTime}}</span>
        </div>
        <div class="content">
          <div class="content-text" v-html="data.info.content"></div>
          <div class="show-qrcode">
            <qriously :value="qrcode.value" :size="qrcode.size" foreground="#000" />
            <div style="width:150px;float:right;text-align:center;">{{$t("cms.scanforshare")}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/header/index.vue';
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);

export default {
  components: {
    VueQriously,PageHeader
  },
  data() {
    return {
      data: {},
      qrcode: {
        value: "",
        size: 150
      },
      initLang: this.$store.state.lang,
      hasContent: false
    };
  },
  filters: {
    subTime: function(str) {
      return str.substr(5,5);
    }
  },
  computed: {
    lang() {
      if (this.$store.state.lang != this.initLang) {
        this.$router.back();
      }
      return this.$store.state.lang;
    }
  },
  created: function() {
    this.loadNoticeInfo();
  },
  methods: {
    loadNoticeInfo() {
      let id = this.$route.params.id||-1;
      this.qrcode.value = this.rootHost + "/#/announcement/" + id;
      let param = {
        id: id,
        lang: this.initLang
      };
      this.$http.post(this.host + "/uc/announcement/more", param)
      .then(response => {
          let result = response.body;
          if (result.code == 0) {
            const data = result.data;
            this.data = data;
            this.hasContent = true;
            window.document.title = this.data.info.title;
          }
      });
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style scoped lang="scss">
.page-content{
  padding-top: 50px;
  .page-notice{
    .header {
        margin: 2% 0;
        padding: 4% 2%;
        text-align: center;
        background-color: #fff;
        span {
          margin: 2%;
          text-align: right;
          display: block;
          font-size: 14px;
      }
    }
    .content {
      margin: 2% 0;
      padding: 4% 2%;
      background-color: #fff;
      font-size: 14px;
      .show-qrcode {
        margin: 2%;
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
      }
    }
  }
}
</style>
