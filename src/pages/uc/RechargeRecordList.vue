<template>
  <div class="page-home">
    <PageHeader :isShowBack=true :title="$t('uc.finance.recharge.record')"></PageHeader> 
    <div class="page-content">
      <div class="page-rechargerecord">
        <div class="order-table">
          <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsRecharge" :data="tableRecharge" :loading="loading"></Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import expandRow from "@components/expand/recharge.vue";
import PageHeader from '@/components/header/index.vue';
export default {
  components: { expandRow, PageHeader},
  inject: ['reload'],
  data() {
    return {
      tableRecharge: [],
    };
  },
  methods: {
    getList() {
      this.loading = true;
      this.$http.post(this.host + "/uc/deposit-manual/deposit-records", {}).then(response => {
          let resp = response.body;
          if (resp.code == 0) {
            if (resp.data) {
              this.tableRecharge = resp.data;
            }
            this.loading = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
  },
  created() {
    this.getList();
  },
  computed: {
    tableColumnsRecharge() {
      let columns = [];
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

      columns.push({
        title: this.$t("uc.finance.recharge.time"),
        align: "center",
        width: 150,
        render: (h, param) => {
          let str = param.row.auditTime;
          return h("div", {}, str);
        }
      });
      // columns.push({
      //   title: this.$t("uc.finance.recharge.symbol"),
      //   align: "center",
      //   width: 120,
      //   render: (h, param) => {
      //     let str = param.row.symbol;
      //     return h("div", {}, str);
      //   }
      // });
      // columns.push({
      //   title: this.$t("uc.finance.recharge.address"),
      //   align: "center",
      //   render: (h, param) => {
      //     let str = param.row.address;
      //     return h("div", {}, str);
      //   }
      // });
      columns.push({
        title: this.$t("uc.finance.recharge.amount"),
        align: "center",
        render: (h, param) => {
          let str = param.row.amount;
          return h("div", {}, str);
        }
      });
       columns.push({
        title: this.$t("uc.finance.recharge.auditstatus"),
        align: "center",
        render: (h, param) => {
          let str = param.row.status;
          return h("div", {}, str==1?this.$t("uc.finance.recharge.auditpass"):(str==2?this.$t("uc.finance.recharge.auditfail"):this.$t("uc.finance.recharge.auditwait")));
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
    background: #fff;
    .page-rechargerecord{
      /deep/ td.ivu-table-expanded-cell {
          padding: 2%;
      }
    }
  }
}
</style>
