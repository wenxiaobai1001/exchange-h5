<template>
    <div class="expand-detail">
        <Row class="expand-row" :class="skin">
            <Col span="24">
                <span class="expand-key">{{$t("uc.finance.record.chargetime")}}: </span><br>
                <span class="expand-value">{{ rows.createTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin">
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.record.discountfee")}}: </span><br>
                <span class="expand-value">{{ row.discountFee }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.record.shouldfee")}}: </span><br>
                <span class="expand-value">{{ row.fee }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin">
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.record.realfee")}}: </span><br>
                <span class="expand-value">{{ row.realfee }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.record.type")}}: </span><br>
                <span class="expand-value">{{ row.str }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
        return {
            row:{}
        };
        },
        props: {
            skin:String,
            rows: Object
        },
        created(){
            this.row.createTime = this.dateFormatFromString(this.rows.createTime);
            this.row.discountFee = this.toFloor(this.rows.discountFee || "0");
            this.row.realFee = this.toFloor(this.rows.realFee || "0");
            this.row.fee = this.toFloor(this.rows.fee || "0");

            let type = this.rows.type;
            if (type == 0) {
                this.row.str = this.$t("uc.finance.record.charge");
            } else if (type == 1) {
                this.row.str = this.$t("uc.finance.record.pickup");
            } else if (type == 2) {
                this.row.str = this.$t("uc.finance.record.transaccount");
            } else if (type == 3) {
                this.row.str = this.$t("uc.finance.record.exchange");
            } else if (type == 4) {
                this.row.str = this.$t("uc.finance.record.otcbuy");
            } else if (type == 5) {
                this.row.str = this.$t("uc.finance.record.otcsell");
            } else if (type == 6) {
                this.row.str = this.$t("uc.finance.record.activityaward");
            } else if (type == 7) {
                this.row.str = this.$t("uc.finance.record.promotionaward");
            } else if (type == 8) {
                this.row.str = this.$t("uc.finance.record.dividend");
            } else if (type == 9) {
                this.row.str = this.$t("uc.finance.record.vote");
            } else if (type == 10) {
                this.row.str = this.$t("uc.finance.record.handrecharge");
            } else if (type == 11) {
                this.row.str = this.$t("uc.finance.record.match");
            } else if (type == 12) {
                this.row.str = this.$t("uc.finance.record.activitybuy");
            } else if (type == 13) {
                this.row.str = this.$t("uc.finance.record.ctcbuy");
            } else if (type == 14) {
                this.row.str = this.$t("uc.finance.record.ctcsell");
            } else if (type == 15) {
                this.row.str = this.$t("uc.finance.record.redout");
            } else if (type == 16) {
                this.row.str = this.$t("uc.finance.record.redin");
            } else if (type == 17) {
                this.row.str = this.$t("uc.finance.record.withdrawcodeout");
            } else if (type == 18) {
                this.row.str = this.$t("uc.finance.record.withdrawcodein");
            } else if (type == 19) {
                this.row.str = this.$t("uc.finance.record.contractfee");
            } else if (type == 20) {
                this.row.str = this.$t("uc.finance.record.contractprofit");
            } else if (type == 21) {
                this.row.str = this.$t("uc.finance.record.contractloss");
            } else if (type == 22) {
                this.row.str = this.$t("uc.finance.record.optionfail");
            } else if (type == 23) {
                this.row.str = this.$t("uc.finance.record.optionfee");
            } else if (type == 24) {
                this.row.str = this.$t("uc.finance.record.optionreward");
            }else {
                this.row.str = this.$t("uc.finance.record.other");
            }
        },
    };
</script>

<style scoped lang="scss">
.expand-detail{
    .expand-row{
        margin-bottom: 8px;
    }
    .expand-row .ivu-col{
        line-height: 20px;
    }
    .expand-key{
        color: #61688A;
        font-weight: bolder;
    }
    .ivu-col-span-24 {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
    }
    .ivu-col-span-12 {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
    }
    .buy {
        color: #00b275!important;
    }
    .sell {
        color: #f15057!important;
    }
}
</style>

