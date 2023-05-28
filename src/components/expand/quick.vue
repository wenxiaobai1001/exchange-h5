<style scoped>
    .expand-row{
        margin-bottom: 8px;
    }
    td.ivu-table-expanded-cell{
        padding: 10px 50px;
    }
    .expand-row .ivu-col{
        line-height: 20px;
    }
    .expand-detail{
        width: 100%;
    }
    .expand-key{
        color: #61688A;
        font-weight: bolder;
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
</style>
<template>
    <div class="expand-detail">
        <Row class="expand-row" :class="skin">
            <Col span="8">
                <span class="expand-key">{{$t("uc.finance.record.chargetime")}}: </span>
                <span class="expand-value">{{ rows.createTime }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("uc.finance.record.qrate")}}: </span>
                <span class="expand-value">{{ rows.rate }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("uc.finance.record.qexamount")}}: </span>
                <span class="expand-value">{{ rows.exAmount }}</span>
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
            this.rows.createTime = this.dateFormatFromString(this.rows.createTime);
            this.rows.discountFee = this.toFloor(this.rows.discountFee || "0");
            this.rows.realFee = this.toFloor(this.rows.realFee || "0");
            this.rows.fee = this.toFloor(this.rows.fee || "0");
        },
    };
</script>
