<style scoped>
.ivu-table td, .ivu-table th{
  height: 35px!important;
}
</style>
<template>
  <div class="nav-rights">
    <div class="nav-right">
      <div class="bill_flow_box">
        <div class="rightarea-con">
          <div class="form-group daterange">
            <span style="width: 85px;display: inline-block;">{{$t('uc.finance.record.start_date')}}:</span>
            <DatePicker v-model="startTime" format="yyyy-MM-dd" type="date" style="width: 200px;" @on-clear="clear"></DatePicker>
            <span style="width: 85px;display: inline-block;">{{$t('uc.finance.record.end_date')}}:</span>
            <DatePicker v-model="endTime" format="yyyy-MM-dd" type="date" style="width: 200px;" @on-clear="clear"></DatePicker>
          </div>
          <div class="form-group">
            <span style="width: 85px;display: inline-block;">{{$t('uc.finance.record.symbol')}}:</span>
            <Select v-model="coinType" style="width:200px;" @on-change="getAddrList" clearable :placeholder="$t('common.pleaseselect')">
              <Option v-for="item in coinList" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
            </Select>
          </div>
          <div class="form-group">
            <span style="width: 85px;display: inline-block;">{{$t('uc.finance.record.operatetype')}}:</span>
            <Select v-model="recordValue" clearable style="width:200px;" @on-change="getType" :placeholder="$t('common.pleaseselect')">
              <Option v-for="item in recordType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="form-group">
            <Button type="warning" @click="queryOrder" style="padding: 6px 30px;margin-left:10px;background-color:#f0a70a;border-color:#f0a70a">{{$t('uc.finance.record.search')}}</Button>
          </div>

          <div class="order-table">
            <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsRecord" :data="tableRecord" :disabled-hover="true" :loading="loading"></Table>
            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total="total" :pageSize="pageSize" show-total :current="page" @on-change="changePage" id="record_pages"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import expandRow from "@components/expand/record.vue";

export default {
  components: { expandRow},
  data() {
    return {
      loading: false,
      ordKeyword: "",
      rangeDate: "",
      startTime: "",
      endTime: "",
      recordValue: "",
      recordType: [
        {
          value: 0,
          label: this.$t("uc.finance.record.charge")
        },
        {
          value: 1,
          label: this.$t("uc.finance.record.pickup")
        },
        {
          value: 2,
          label: this.$t("uc.finance.record.transaccount")
        },
        {
          value: 3,
          label: this.$t("uc.finance.record.exchange")
        },
        {
          value: 4,
          label: this.$t("uc.finance.record.otcbuy")
        },
        {
          value: 5,
          label: this.$t("uc.finance.record.otcsell")
        },
        {
          value: 6,
          label: this.$t("uc.finance.record.activityaward")
        },
        {
          value: 7,
          label: this.$t("uc.finance.record.promotionaward")
        },
        {
          value: 8,
          label: this.$t("uc.finance.record.dividend")
        },
        {
          value: 9,
          label: this.$t("uc.finance.record.vote")
        },
        {
          value: 10,
          label: this.$t("uc.finance.record.handrecharge")
        },
        {
          value: 11,
          label: this.$t("uc.finance.record.match")
        },
        {
          value: 12,
          label: this.$t("uc.finance.record.activitybuy")
        },
        {
          value: 13,
          label: this.$t("uc.finance.record.ctcbuy")
        },
        {
          value: 14,
          label: this.$t("uc.finance.record.ctcsell")
        },
        {
          value: 15,
          label: this.$t("uc.finance.record.redout")
        },
        {
          value: 16,
          label: this.$t("uc.finance.record.redin")
        },
        {
          value: 17,
          label: this.$t("uc.finance.record.withdrawcodeout")
        },
        {
          value: 18,
          label: this.$t("uc.finance.record.withdrawcodein")
        },
        {
          value: 19,
          label: this.$t("uc.finance.record.contractfee")
        },
        {
          value: 20,
          label: this.$t("uc.finance.record.contractprofit")
        },
        {
          value: 21,
          label: this.$t("uc.finance.record.contractloss")
        },
        {
          value: 22,
          label: this.$t("uc.finance.record.optionfail")
        },
        {
          value: 23,
          label: this.$t("uc.finance.record.optionfee")
        },
        {
          value: 24,
          label: this.$t("uc.finance.record.optionreward")
        }
      ],
      coinList: [],
      coinType: "",
      pageSize: 10,
      page: 1,
      total: 0,
      tableRecord: []
    };
  },
  created: function() {
    this.getList(this.page);
    this.getAddrList();
  },
  methods: {
    changedate() {
      if (this.rangeDate[0]) {
        this.startTime = this.dateform(this.rangeDate[0]);
        this.endTime = this.dateform(this.rangeDate[1]);
      }
    },
    changePage(pageindex) {
      this.page=pageindex;
      this.getList(this.page);
    },
    queryOrder() {
      if (this.startTime.length == 0 || this.endTime.length == 0) {
        this.$Message.error("Please select datetime range");
        return;
      } else {
        try {
          this.page=1;
          this.getList(this.page);
        } catch (ex) {
          this.$Message.error("Please select datetime range");
          return;
        }
      }
    },
    getAddrList() {
      //获取地址
      this.$http.post(this.host + "/uc/withdraw/support/coin/info").then(response => {
          var resp = response.body;
          if (resp.code == 0 && resp.data.length > 0) {
            this.coinList = resp.data;
            if (this.coinType) {
              this.coinType = this.coinType;
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getType() {
      // console.log(this.recordValue);
    },
    dateform(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    getList(pageNo) {
      //获取tableWithdraw
      let memberId = 0;
      !this.$store.getters.isLogin && this.$router.push("/login");
      this.$store.getters.isLogin && (memberId = this.$store.getters.member.id);
      let startTime = "";
      let endTime = "";
      let symbol = "";
      let type = "";
      this.startTime && (startTime = this.startTime);
      this.endTime && (endTime = this.endTime);
      this.coinType && (symbol = this.coinType);
      if(this.recordValue == 0 || this.recordValue){
        type = this.recordValue;
      }
      // this.recordValue!="" || this.recordValue!=undefined && (type = this.recordValue);
      this.loading = true;
      let params = {
        pageNo: pageNo,
        pageSize: this.pageSize,
        startTime,
        endTime,
        memberId,
        symbol,
        type
      };
      this.$http.post(this.host + "/uc/asset/transaction/all", params).then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.loading = false;
            if (resp.data) {
              let trueData = resp.data;
              this.total = trueData.totalElements;
              this.tableRecord = trueData.content;
            }
          } else {
            this.$Message.error(resp.message);
          }
          this.loading = false;
        });
    },
    clear() {
      this.startTime = "";
      this.endTime = "";
    }
  },
  computed: {
    tableColumnsRecord() {
      let columns = [];
      var that = this;
      columns.push({
        type:"expand",
        width: 40,
        height:40,
        render: (h, params) => {
          return h(expandRow, {
            props: {
              skin: params.row.skin,
              rows: params.row
            }
          });
        }
      });
      // columns.push({
      //   title: this.$t("uc.finance.record.chargetime"),
      //   align: "center",
      //   width: 160,
      //   key:"createTime",
      //   render: function(h,params){
      //     return h("div", {}, that.dateFormatFromString(params.row.createTime));
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.record.type"),
      //   render: function(h, params) {
      //     let str = "";
      //     let type = params.row.type;
      //     if (type == 0) {
      //       str = that.$t("uc.finance.record.charge");
      //     } else if (type == 1) {
      //       str = that.$t("uc.finance.record.pickup");
      //     } else if (type == 2) {
      //       str = that.$t("uc.finance.record.transaccount");
      //     } else if (type == 3) {
      //       str = that.$t("uc.finance.record.exchange");
      //     } else if (type == 4) {
      //       str = that.$t("uc.finance.record.otcbuy");
      //     } else if (type == 5) {
      //       str = that.$t("uc.finance.record.otcsell");
      //     } else if (type == 6) {
      //       str = that.$t("uc.finance.record.activityaward");
      //     } else if (type == 7) {
      //       str = that.$t("uc.finance.record.promotionaward");
      //     } else if (type == 8) {
      //       str = that.$t("uc.finance.record.dividend");
      //     } else if (type == 9) {
      //       str = that.$t("uc.finance.record.vote");
      //     } else if (type == 10) {
      //       str = that.$t("uc.finance.record.handrecharge");
      //     } else if (type == 11) {
      //       str = that.$t("uc.finance.record.match");
      //     } else if (type == 12) {
      //       str = that.$t("uc.finance.record.activitybuy");
      //     } else if (type == 13) {
      //       str = that.$t("uc.finance.record.ctcbuy");
      //     } else if (type == 14) {
      //       str = that.$t("uc.finance.record.ctcsell");
      //     } else if (type == 15) {
      //       str = that.$t("uc.finance.record.redout");
      //     } else if (type == 16) {
      //       str = that.$t("uc.finance.record.redin");
      //     } else if (type == 17) {
      //       str = that.$t("uc.finance.record.withdrawcodeout");
      //     } else if (type == 18) {
      //       str = that.$t("uc.finance.record.withdrawcodein");
      //     } else if (type == 19) {
      //       str = that.$t("uc.finance.record.contractfee");
      //     } else if (type == 20) {
      //       str = that.$t("uc.finance.record.contractprofit");
      //     } else if (type == 21) {
      //       str = that.$t("uc.finance.record.contractloss");
      //     } else if (type == 22) {
      //       str = that.$t("uc.finance.record.optionfail");
      //     } else if (type == 23) {
      //       str = that.$t("uc.finance.record.optionfee");
      //     } else if (type == 24) {
      //       str = that.$t("uc.finance.record.optionreward");
      //     }else {
      //       str = that.$t("uc.finance.record.other");
      //     }
      //     return h("div", str, "");
      //   }
      // });
      columns.push({
        title: this.$t("uc.finance.record.symbol"),
        align: "center",
        width: 110,
        key:"symbol"
        // render: (h, param) => {
        //   return h("div", {}, param.row._source.symbol);
        // }
      });
      columns.push({
        // title: this.$t("uc.finance.record.num"),
        title: this.$t("uc.finance.record.num"), //到账数量
        align: "center",
        width: 110,
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.amount
              }
            },
            that.toFloor(params.row.amount || "0")
          );
        }
      });
      // columns.push({
      //   title: this.$t("uc.finance.record.shouldfee"), //"应付手续费"
      //   align: "center",
      //   render(h, params) {
      //     return h(
      //       "span",
      //       {
      //         attrs: {
      //           title: params.row.fee
      //         }
      //       },
      //       that.toFloor(params.row.fee || "0")
      //     );
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.record.discountfee"), //"抵扣手续费"
      //   align: "center",
      //   render(h, params) {
      //     return h(
      //       "span",
      //       {
      //         attrs: {
      //           title: params.row.discountFee
      //         }
      //       },
      //       that.toFloor(params.row.discountFee || "0")
      //     );
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.record.realfee"), //"实际手续费"
      //   align: "center",
      //   render(h, params) {
      //     return h(
      //       "span",
      //       {
      //         attrs: {
      //           title: params.row.realFee
      //         }
      //       },
      //       that.toFloor(params.row.realFee || "0")
      //     );
      //   }
      // });
      columns.push({
        title: this.$t("uc.finance.record.status"),
        // key: "status",
        align: "center",
        render: (h, params) => {
          return h("div", that.$t("uc.finance.record.finish"), "");
        }
      });
      return columns;
    }
  }
};
</script>
<style scoped lang="scss">

/deep/ td.ivu-table-expanded-cell {
    padding: 20px 20px;
    background: #f8f8f9;
}
/deep/ .ivu-input{
    height: 40px;
    font-size: 14px;
}
/deep/ .ivu-table-wrapper {
    background-color: #000000;
    border: none;
}
/deep/ .ivu-table:before{
  content:unset;
}   
/deep/ .ivu-table:after{
  content:unset;
}
/deep/ .ivu-table-wrapper .ivu-table-body td .ivu-table-cell p .ivu-btn.ivu-btn-default {
    border: 1px solid #2c384f;
    background: #222c3e;
}
/deep/ .ivu-table-wrapper .ivu-table .ivu-table-row td {
    border: none;
    border-bottom: 1px solid #27313e;
}
/deep/ .ivu-table td {
    background: transparent!important;
}
/deep/ .ivu-table-wrapper .ivu-table .ivu-table-header th {
    background-color: #27313e;
    border: none;
    color: #fff;
}
/deep/ td.ivu-table-expanded-cell {
    padding: 20px;
    background: #f8f8f9;
}
/deep/ .ivu-table-wrapper .ivu-table {
    box-shadow: 0 0 4px #27313e;
    background-color: #000000;
    color: #ccc;
}
.daterange{
  /deep/ .ivu-select-dropdown {
      background-color: #000000;
  }
}


.nav-rights {
  .nav-right {
    height: auto;
    overflow: hidden;
    padding: 0 15px;
    .bill_flow_box .rightarea-con {
      .form-group {
        margin-bottom: 20px;
        text-align: left;
      }
    }
  }
}
</style>
