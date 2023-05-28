<template>
  <div class="page-home">
    <PageHeader :title="$t('uc.locked.title')"></PageHeader> 
    <div class="page-content">
      <div class="page-myminings">
        <div class="mining-list">
          <Row>
            <Col span="24" v-if="miningList.length == 0" style="text-align:center;margin-top: 30px;">
              {{$t('uc.locked.empty')}}
            </Col>
            <Col :xs="24" :sm="24" :md="8" :lg="8" v-for="item in miningList" :key="item">
              <Card style="width:100%;position:relative;">
                <div style="width: 100%;min-height: 58px;">
                  <div style="float:left;"><img style="width:50px;height:50px;border-radius:50px;" :src="item.image"></div>
                  <div style="float:left;text-align:left;margin-left: 15px;">
                    <h2>{{item.title}}</h2>
                    <p><span v-if="item.lockedStatus == 0" style="font-size:12px;padding: 2px 8px;border-radius:10px;background:#FF0000;">{{$t('uc.locked.status0')}}</span></p>
                    <p><span v-if="item.lockedStatus == 1" style="font-size:12px;padding: 2px 8px;border-radius:10px;background:#00b275;">{{$t('uc.locked.status1')}}</span></p>
                    <p><span v-if="item.lockedStatus == 2" style="font-size:12px;padding: 2px 8px;border-radius:10px;background:#888;">{{$t('uc.locked.status2')}}</span></p>
                  </div>
                </div>
                <div style="width:100%;padding: 5px 10px;background: #000;border-radius: 5px;">
                  <table class="config-table">
                    <tr>
                        <td>{{$t('uc.locked.miningUnit')}}</td><td>{{item.releaseUnit}}</td>
                        <td>{{$t('uc.locked.totallocked')}}</td><td>{{item.totalLocked}}</td>
                    </tr>
                    <tr>
                        <td>{{$t('uc.locked.miningDays')}}</td>
                        <td>{{item.lockedDays}}
                            <span v-if="item.period==0">{{$t('uc.locked.day')}}</span>
                            <span v-if="item.period==1">{{$t('uc.locked.week')}}</span>
                            <span v-if="item.period==2">{{$t('uc.locked.month')}}</span>
                            <span v-if="item.period==3">{{$t('uc.locked.year')}}</span>
                        </td>
                        <td>{{$t('uc.locked.miningedDays')}}</td>
                        <td>{{item.releasedDays}}
                            <span v-if="item.period==0">{{$t('uc.locked.day')}}</span>
                            <span v-if="item.period==1">{{$t('uc.locked.week')}}</span>
                            <span v-if="item.period==2">{{$t('uc.locked.month')}}</span>
                            <span v-if="item.period==3">{{$t('uc.locked.year')}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('uc.locked.miningDaysProfit')}}</td>
                        <td>
                            <span v-if="item.releaseType == 0">{{item.originReleaseamount}} {{item.releaseUnit}}/</span>
                            <span v-if="item.releaseType == 1">{{item.releasePercent * 100}} % /</span>

                            <span v-if="item.period==0">{{$t('uc.locked.day')}}</span>
                            <span v-if="item.period==1">{{$t('uc.locked.week')}}</span>
                            <span v-if="item.period==2">{{$t('uc.locked.month')}}</span>
                            <span v-if="item.period==3">{{$t('uc.locked.year')}}</span>
                        </td>
                        <td>{{$t('uc.locked.miningCurrentDaysProfit')}}</td>
                        <td>
                            <span v-if="item.releaseType == 0">{{item.currentReleaseamount}} {{item.releaseUnit}}/</span>
                            <span v-if="item.releaseType == 1">{{item.releaseCurrentpercent * 100}} % /</span>
                            <span v-if="item.period==0">{{$t('uc.locked.day')}}</span>
                            <span v-if="item.period==1">{{$t('uc.locked.week')}}</span>
                            <span v-if="item.period==2">{{$t('uc.locked.month')}}</span>
                            <span v-if="item.period==3">{{$t('uc.locked.year')}}</span>
                        </td>
                      </tr>
                  </table>
                </div>
                <div style="font-size:12px;margin-top: 10px;text-align:left;color: #828ea1;" v-if="item.lockedInvite > 0">
                <Icon type="ios-information-circle" /> {{$t('uc.locked.invitetip1')}}{{item.lockedInvite | percentFun}}{{$t('uc.locked.invitetip2')}}{{item.lockedInvitelimit | percentFun}}%</div>
              </Card>
            </Col>
          </Row>
        </div>
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
      miningList: []
    };
  },
  methods: {
    getMyMiningList() {
      let params = {};
      params.pageNo = this.pageNo;
      params.pageSize = this.pageSize;
      this.$http.post(this.host + this.api.uc.myInnovationLocked, params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.miningList = resp.data.content;
        } else {
          this.$Message.error(this.loginmsg);
        }
        this.loading = false;
      });
    },
    loadDataPage(data){
      this.pageNo = data;
      this.getMyMiningList();
    }
  },
  created() {
    this.getMyMiningList();
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
        title: this.$t("uc.activity.lColumn1"),
        key: "image",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.lColumn2"),
        key: "title",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.lColumn3"),
        key: "miningUnit",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.lColumn4"),
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
        title: this.$t("uc.activity.lColumn5"),
        key: "lockedDays",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.lColumn6"),
        key: "releasedDays",
        align: "center"
      });
      columns.push({
        title: this.$t("uc.activity.lColumn7"),
        key: "lockedStatus",
        align: "center",
        render(h, params) {
          let text = "待释放";
          if(params.row.lockedStatus == 1){
            text = "释放中";
          }
          if(params.row.lockedStatus == 2){
            text = "已结束";
          }
          return h(
            "span",{}, text
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.lColumn8"),
        key: "originReleaseamount",
        align: "center",
        width: 100,
        render(h, params) {
          return h(
            "span",{}, params.row.originReleaseamount + " " + params.row.releaseUnit
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.lColumn9"),
        key: "currentReleaseamount",
        align: "center",
        width: 100,
        render(h, params) {
          return h(
            "span",{}, params.row.currentReleaseamount + " " + params.row.releaseUnit
          );
        }
      });
      columns.push({
        title: this.$t("uc.activity.lColumn10"),
        key: "totalRelease",
        align: "center",
        width: 100
      });
      columns.push({
        title: this.$t("uc.activity.lColumn11"),
        key: "endTime",
        align: "center",
        width: 140
      });
      columns.push({
        title: this.$t("uc.activity.lColumn12"),
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
