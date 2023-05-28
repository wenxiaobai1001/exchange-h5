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
                <span class="expand-key">{{$t("exchange.time")}}: </span>
                <span class="expand-value">{{ rows.time }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("exchange.type")}}: </span>
                <span class="expand-value">{{ rows.type }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin">
            <Col span="12">
                <span class="expand-key">{{$t("exchange.direction")}}: </span>
                <span class="expand-value" :class="{'buy':rows.direction == 'BUY','sell':rows.direction != 'BUY'}">{{ rows.direction == "BUY" ? $t("exchange.buyin") : $t("exchange.sellout") }}</span>
            </Col> 
            <Col span="12">
                <span class="expand-key">{{$t("exchange.traded")}}: </span>
                <span class="expand-value">{{ rows.tradedAmount }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <span class="expand-key">{{$t("exchange.dealamount")}}: </span>
                <span class="expand-value">{{ rows.turnover }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key"></span>
                <span class="expand-value"></span>
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
