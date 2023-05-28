<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.mining.title')"></PageHeader> 
    <div class="page-content">
      <div class="page-myminings">
        <div class="mining-list">
          <Row>
            <Col span="24" v-if="orderList.length == 0" style="text-align:center;margin-top: 30px;">{{$t('uc.mining.empty')}}</Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" v-for="item in orderList" :key="item">
              <Card style="position:relative;">
                <div style="width: 100%;min-height: 58px;">
                  <!-- <div style="float:left;"><img style="width:50px;height:50px;border-radius:50px;" :src="item.image"></div> -->
                  <div style="float:left;text-align:left;margin-left: 15px;">
                    <h3 style="color: #fff;">{{item.activityName}}</h3>
                    <p><span v-if="item.type == 1" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#FF0000;">Starter snap</span></p>
                    <p><span v-if="item.type == 2" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#00b275;">Starter share</span></p>
                    <p><span v-if="item.type == 3" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#888;">Share position</span></p>
                    <p><span v-if="item.type == 4" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#d46c51;">Free subscription</span></p>
                    <p><span v-if="item.type == 5" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#f90;">Cloud mining machine subscription</span></p>
                    <p><span v-if="item.type == 6" style="color: #fff;font-size:12px;padding: 2px 8px;border-radius:10px;background:#2b85e4;">Lock up</span></p>
                  </div>
                </div>
                <div style="width:100%;padding: 5px 10px;background: #000;border-radius: 5px;">
                  <table class="config-table">
                    <tr>
                        <td>{{$t("uc.activity.column3")}}</td><td>{{item.amount}}</td>
                        <td>{{$t('uc.activity.column6')}}</td>
                        <td v-if="item.type==5 && item.state == 1">Not deployed</td>
                        <td v-if="item.type==5 && item.state == 2">Deployed</td>
                        <td v-if="item.type==5 && item.state == 3">Revoked</td>
                        <td v-if="item.type!=5 && item.state == 1">Pending transaction</td>
                        <td v-if="item.type!=5 && item.state == 2">Deal done</td>
                        <td v-if="item.type!=5 && item.state == 3">Revoked</td>
                    </tr>
                    <tr>
                        <td>{{$t('uc.activity.column4')}}</td>
                        <td>{{item.baseSymbol}}</td>
                        <td>{{$t('uc.activity.column5')}}</td>
                        <td>{{item.coinSymbol}}</td>
                    </tr>
                    <tr>
                        <td>{{$t('uc.activity.column7')}}</td>
                        <td>{{item.turnover + " " + item.baseSymbol}}</td>
                        <td>{{$t('uc.activity.column8')}}</td>
                        <td>{{item.createTime}}</td>
                      </tr>
                  </table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div class="page">
        <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
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
  filters: {
    percentFun: function(value){
      var tem = value * 100;
      return tem.toFixed(0);
    }
  },
  computed: {
    tableColumns() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.activity.mColumn1"),
        key: "image",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.mColumn2"),
        key: "title",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.mColumn3"),
        key: "miningUnit",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.mColumn4"),
        key: "period",
        align: "center",
        render(h, params) {
          let text = "日";
          if(params.row.period == 1){
            text = "周";
          }
          if(params.row.period == 2){
            text = "月";
          }
          if(params.row.period == 3){
            text = "年";
          }
          return h(
            "span",{}, text
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.mColumn5"),
        key: "miningDays",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.mColumn6"),
        key: "miningedDays",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.mColumn7"),
        key: "miningStatus",
        align: "center",
        render(h, params) {
          let text = "已部署";
          if(params.row.miningStatus == 1){
            text = "挖矿中";
          }
          if(params.row.miningStatus == 2){
            text = "已结束";
          }
          return h(
            "span",{}, text
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.mColumn8"),
        key: "miningDaysprofit",
        align: "center",
        width: 100,
        render(h, params) {
          return h(
            "span",{}, params.row.miningDaysprofit + " " + params.row.miningUnit
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.mColumn9"),
        key: "currentDaysprofit",
        align: "center",
        width: 100,
        render(h, params) {
          return h(
            "span",{}, params.row.currentDaysprofit + " " + params.row.miningUnit
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.mColumn10"),
        key: "totalProfit",
        align: "center",
        width: 100
      });
      columns.push({
        title: this.$t("uc.activity.mColumn11"),
        key: "endTime",
        align: "center",
        width: 140
      });
      columns.push({
        title: this.$t("uc.activity.mColumn12"),
        key: "createTime",
        align: "center",
        width: 140
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
    .page {
      margin: 2% 0;
      text-align: right;
    }
    .mining-list {
      .ivu-col{
        // margin: 1% 2%;
        // width: auto !important;
      }
      .ivu-row .ivu-col .ivu-card{
        background: #2f3e59;
      }
      .ivu-row .ivu-col .ivu-card-bordered{
        border: none!important;
      }
      .config-table{
        width:100%;
        tr{
          td{
            color: #828ea1;
            font-size: 12px;
            &:nth-child(1){
              text-align:left;
            }
            &:nth-child(2){
              text-align:right;
              padding-right: 10px;
              color: #EEE;
            }
            &:nth-child(3){
              text-align:left;
              padding-left: 10px;
            }
            &:nth-child(4){
              text-align:right;
              color: #EEE;
            }
          }
        }
      }
    }
  }
}
</style>
