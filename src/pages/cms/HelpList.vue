<template>
   <div class="page-home">
    <PageHeader :title="cateTitle"></PageHeader> 
    <div class="page-content">
      <div class="helplist">
        <div class="list">
          <router-link class="item" v-for="(item,index) in list" :key="index" :to="{path:'helpdetail',query:{id:item.id}}">
            <span class="text">{{item.title}}</span>
            <span class="time">{{item.createTime}}</span>
          </router-link>
        </div>
        <div class="page">
          <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="pageChange"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.helplist {
  width: 100%;
  padding: 2%;
  background: #FFF;
  color: #000;
  padding-top: 50px;
  .list {
    font-size: 14px;
    .item {
      color: #464646;    
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 40px;
      border-bottom: 1px solid #ebebeb;
      cursor: pointer;
      .iconimg {
        width: 14px;
        vertical-align: sub;
        margin-left: 20px;
      }
      .text {
        width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        color: #999;
        font-size: 12px;
      }
      &:hover{
        color: #f0a70a;
      }
    }
  }
  .page {
    margin: 2% 0 0 0;
    text-align: right;
  }
}
</style>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components:{PageHeader},
  data() {
    return {
      cate: 0,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      list: []
    };
  },
  created() {
    const { cate, cateTitle } = this.$route.query;
    this.cate = cate;
    this.cateTitle = cateTitle;
    this.getData();
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    }
  },
  watch: {
    $route(to, from) {
      const { cate, cateTitle } = to.query;
      this.cate = cate;
      this.cateTitle = cateTitle;
      this.getData();
    }
  },
  methods: {
    pageChange(data) {
      this.pageNo = data;
      this.getData();
    },
    getData() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        cate: this.cate,
        lang: this.lang
      };
      this.$http.post(this.host + "/uc/ancillary/more/help/page", params)
        .then(res => {
          if (res.status == 200 && res.body.code == 0) {
            this.list = res.body.data.content;
            this.total = res.body.data.totalElements;
          } else {
            this.$Message.error(res.body.message);
          }
        });
    }
  }
};
</script>


