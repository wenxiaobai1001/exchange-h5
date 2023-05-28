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
            <Col span="6">
                <span class="expand-key">{{$t("uc.finance.recharge.symbol")}}: </span>
                <span class="expand-value">{{ rows.unit }}</span>
            </Col>
            <Col span="18">
                <span class="expand-key">{{$t("uc.finance.recharge.address")}}: </span>
                <span class="expand-value">{{ rows.address }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin">
            <!-- <Col span="6">
                <span class="expand-key">{{$t("uc.finance.recharge.symbol")}}: </span>
                <span class="expand-value">{{ rows.unit }}</span>
            </Col> -->
            <Col span="18">
                <span class="expand-key">{{$t("uc.finance.recharge.description")}}: </span>
                <span class="expand-value">{{ rows.description }}</span>
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
        },
    };
</script>
