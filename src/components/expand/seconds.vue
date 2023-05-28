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
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.seconds.periodTime")}}: </span>
                <span class="expand-value">{{ rows.periodTime }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.seconds.openPrice")}}: </span>
                <span class="expand-value">{{ rows.openPrice}}</span>
            </Col> 
        </Row>
        <Row class="expand-row" :class="skin">
            <Col span="12">
                <span class="expand-key">{{$t("exchange.symbol")}}: </span>
                 <span class="expand-value">{{ rows.symbol }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.seconds.coin")}}: </span>
                <span class="expand-value">{{ rows.baseSymbol }}</span>
            </Col>
        </Row>
        <Row>
           <Col span="12">
                <span class="expand-key">{{$t("uc.finance.seconds.rewardAmount")}}: </span>
                <span class="expand-value">{{ rows.rewardAmount}}</span>
            </Col> 
             <Col span="12">
                <span class="expand-key">{{$t("uc.finance.seconds.buyAmount")}}: </span>
                <span class="expand-value">{{ rows.betAmount }}</span>
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
            this.rows.sturnover = this.toFloor(this.rows.sturnover);
            this.rows.tradedAmount = this.toFloor(this.rows.tradedAmount);
            // this.rows.direction = this.rows.direction == "BUY" ? this.$t("exchange.buyin") : this.$t("exchange.sellout");
            this.rows.type = this.rows.type == "LIMIT_PRICE" ? this.$t("exchange.limited_price") : this.$t("exchange.market_price");
            this.rows.time = this.dateFormat(this.rows.time);
        },
    };
</script>
