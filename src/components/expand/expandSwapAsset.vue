<style scoped>
    .expand-row{
        margin-bottom: 8px;
    }
    td.ivu-table-expanded-cell{
        padding: 2%;
        background: #f8f8f9;
        text-align: center;
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
                <span class="expand-key">{{$t("uc.finance.swap.profitandloss")}}: </span><br>
                <span class="expand-value">{{ rows.usdtTotalProfitAndLoss }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("uc.finance.swap.usebalance")}}: </span><br>
                <span class="expand-value">{{ rows.toReleased }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("uc.finance.swap.frozenbalance")}}: </span><br>
                <span class="expand-value">{{ rows.usdtFrozenBalance }}</span>
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
            // this.row = this.rows;
            this.rows.usdtTotalProfitAndLoss = this.toFloor(this.rows.usdtTotalProfitAndLoss.toFixed(4)||0);
            this.rows.toReleased = (this.rows.usdtBuyPrincipalAmount + this.rows.usdtSellPrincipalAmount).toFixed(4);
            this.rows.usdtFrozenBalance = this.toFloor(this.rows.usdtFrozenBalance.toFixed(4)||0);
        },
    };
</script>
