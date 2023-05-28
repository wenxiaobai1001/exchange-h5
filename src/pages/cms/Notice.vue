<template>
  <div class="page-home">
    <PageHeader :title="$t('common.announcementlist')"></PageHeader>
    <div class="page-content">
      <div class="page-notice">
        <!-- <div class="banner">
          <span>{{$t("header.service")}}</span>
        </div> -->
        <div class="notice-list">
          <div class="notice-item" v-for="(item, index) in FAQList" :key="index" @click="noticedeail(item.id)">
            <span class="text">{{item.title}}</span>
            <span class="time">{{item.createTime}}</span>
          </div>
        </div>
        <div class="notice-page">
          <Page :total="totalNum" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
        </div>
      </div>
    </div>
    <!-- <PageFooter curindex="0"></PageFooter> -->
  </div>
</template>
<script>

import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';
export default {
  components:{
    PageHeader
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalNum: 0,
      FAQList: []
    };
  },
  created: function() {
    this.init();
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    langPram(){
      return this.$store.state.lang;
    }
  },
  methods: {
    init() {
      this.loadDataPage(this.pageNo);
    },
    loadDataPage(pageIndex) {
      var param = {};
      (param["pageNo"] = pageIndex),(param["pageSize"] = this.pageSize),(param["lang"] = this.lang),
        this.$http.post(this.host + this.api.uc.announcement, param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data.content.length == 0) return;
            this.FAQList = resp.data.content;
            this.totalNum = resp.data.totalElements;
          } else {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: resp.message
            });
          }
        });
    },
    noticedeail(id) {
      var path = { path: "/announcement/"+id};
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-notice {
  padding-top:50px;
  .banner {
      margin: 2% 0;
      padding: 8% 2%;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px #f0f2f5;
  }
  .notice-list {
    margin: 2% 0;
    padding: 1% 2%;
    background-color: #fff;
    .notice-item:last-child {
        border-bottom: none !important;
    }
    .notice-item {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1% 0;
      border-bottom: 2px solid #f0f2f5;
      padding: 2% 0;
      span {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
      span:first-child{
          display: block;
          width: 250px;
      }
      span:last-child {
        // width: 80px;
        text-align: right;
      }
    }
  }
  .notice-page {
    text-align: right;
    .ivu-page-item-active {
      border-color: #f0a70a;
      a{
        color: #f0a70a;
      }
    }
  }
}
</style>

