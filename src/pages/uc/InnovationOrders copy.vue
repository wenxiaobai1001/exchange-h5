<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.activity.subNavTitle1')"></PageHeader>
    <div class="page-content">
      <div class="page-bill_box">
        <Table :no-data-text="$t('common.nodata')" :columns="tableColumns" :data="orderList" :loading="loading" :disabled-hover="true"></Table>
        <div class="page">
          <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader},
  data() {
    return {
      loginmsg: this.$t("common.logintip"),
      total: 0,
      pageSize: 10,
      loading: true,
      pageNo: 1,
      orderList: []
    };
  },
  methods: {
    getMyOrderList() {
      let params = {};
      params.pageNo = this.pageNo;
      params.pageSize = this.pageSize;
      this.$http.post(this.host + this.api.uc.myInnovationOrderList, params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.orderList = resp.data.content;
        } else {
          this.$Message.error(this.loginmsg);
        }
        this.loading = false;
      });
    },
    loadDataPage(data){
      this.pageNo = data;
      this.getMyOrderList();
    }
  },
  created() {
    this.getMyOrderList();
  },
  computed: {
    tableColumns() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.activity.column1"),
        key: "activityName",
        align: "center",
        width: 100,
        render: (h ,params) => {
          // return `<router-link to="/lab/detail/"+params.row.activityId>`+params.row.activityName+`</router-link>`;
          return h('router-link',{
            attrs: {
                to: "/lab/detail/" + params.row.activityId,
            }
          }, params.row.activityName);
        }
      });
      columns.push({
        title: this.$t("uc.activity.column2"),
        key: "type",
        align: "center",
        render(h, params) {
          let text = "Unknow";
          if(params.row.type == 1){
            // text = "首发抢购";
            text = "Starter snap";
          }
          if(params.row.type == 2){
            // text = "首发分摊";
            text = "Starter share";
          }
          if(params.row.type == 3){
            // text = "持仓瓜分";
            text = "Share position";
          }
          if(params.row.type == 4){
            // text = "自由认购";
            text = "Free subscription";
          }
          if(params.row.type == 5){
            // text = "云矿机认购";
            text = "Cloud mining machine subscription";
          }
          if(params.row.type == 6){
            // text = "锁仓";
            text = "Lock up";
          }
          return h(
            "span",{}, text
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.column3"),
        key: "amount",
        align: "center"
      });
      
      columns.push({
        title: this.$t("uc.activity.column6"),
        key: "state",
        align: "center",
        render(h, params) {
          let text = "Temporary";
          if(params.row.type == 5) {
            if(params.row.state == 1) {
              // text = "未部署";
              text ="Not deployed";
            }
            if(params.row.state == 2) {
              // text = "已部署";
              text ="Deployed";
            }
            if(params.row.state == 3) {
              // text = "已撤销";
              text = "Revoked";
            }
          }else{
            if(params.row.state == 1) {
              // text = "待成交";
              text = "Pending transaction";
            }
            if(params.row.state == 2) {
              // text = "已成交";
              text = "Deal done";
            }
            if(params.row.state == 3) {
              // text = "已撤销";
              text = "Revoked";
            }
          }
          return h(
            "span",{}, text
          );
        }
      });
      return columns;
    }
  }
};
</script>

<style scoped lang="scss">
.page-home{
  height: 100%;
  .page-content{
    height: 100%;
    padding-top: 50px;
    background-color: #fff;
    .page-bill_box {
      background-color: #fff;
      padding: 2%;
      .page {
        margin: 2% 0;
        text-align: right;
      }
    }
  }
}
</style>
