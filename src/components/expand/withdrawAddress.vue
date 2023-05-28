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
            <Col span="12">
                <p class="expand-key">{{$t("uc.finance.withdraw.symbol")}}: </p>
                <p class="expand-value">{{ rows.unit }}</p>
            </Col>
            <Col span="12">
                <p class="expand-key">{{$t("uc.finance.withdraw.remark")}}: </p>
                <p class="expand-value">{{ rows.remark }}</p>
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
            this.rows.createTime = this.dateFormat(this.rows.createTime);
        },
    };
</script>
