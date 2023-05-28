<template>
    <div class="expand-detail">
        <PageHeader title="Order Detail"></PageHeader> 
        <div class="page-content">
            <div class="expand-detail-current" v-if="type=='current'">
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.time")}}: </span><br>
                        <span class="expand-value">{{ rows.time }}</span>
                    </Col>
                </Row>
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("uc.finance.trade.type")}}: </span>
                        <span class="expand-value">{{ rows.type=="LIMIT_PRICE" ? $t("exchange.limited_price") : $t("exchange.market_price") }}</span>
                    </Col>
                </Row>
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.direction")}}: </span><br>
                        <span class="expand-value" :class="{'buy':rows.direction == 'BUY','sell':rows.direction != 'BUY'}">{{ rows.direction == "BUY" ? $t("exchange.buyin") : $t("exchange.sellout") }}</span>
                    </Col> 
                </Row>
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.price")}}: </span><br>
                        <span class="expand-value">{{ rows.price }}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.num")}}: </span><br>
                        <span class="expand-value">{{ rows.amount }}</span>
                    </Col>
                </Row> 
                <Row>
                    <Col span="24">
                            <span class="expand-key">{{$t("exchange.done")}}: </span><br>
                        <span class="expand-value">{{ rows.tradedAmount }}</span>
                    </Col>
                </Row>
            </div>
            <div class="expand-detail-current" v-if="type=='history'">
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.time")}}: </span><br>
                        <span class="expand-value">{{ rows.time }}</span>
                    </Col>
                </Row>
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("uc.finance.trade.type")}}: </span>
                        <span class="expand-value">{{ rows.type=="LIMIT_PRICE" ? $t("exchange.limited_price") : $t("exchange.market_price") }}</span>
                    </Col>
                </Row>
                <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.direction")}}: </span><br>
                        <span class="expand-value" :class="{'buy':rows.direction == 'BUY','sell':rows.direction != 'BUY'}">{{ rows.direction == "BUY" ? $t("exchange.buyin") : $t("exchange.sellout") }}</span>
                    </Col> 
                </Row>
                 <Row class="expand-row">
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.price")}}: </span><br>
                        <span class="expand-value">{{ rows.price }}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.num")}}: </span><br>
                        <span class="expand-value">{{ rows.amount }}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <span class="expand-key">{{$t("exchange.done")}}: </span><br>
                        <span class="expand-value">{{ rows.tradedAmount }}</span>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .expand-detail-current {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding-top: 50px;
        background: #fff;
        /deep/ .ivu-col-span-24 {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 5%;
            font-size: 14px;
            span:first-child {
                font-weight: 600;
            }
            span {
                flex-grow: 1;
                width: 50%;
            }
        }
    }
    .buy {
        color: #00b275!important;
    }
    .sell {
        color: #f15057!important;
    }
</style>
<script>
let moment = require("moment-timezone");
import PageHeader from '@/components/header/index.vue';
export default {
    components: {PageHeader},
    data() {
        return {
            rows:null,
            type:'current'
        };
    },
    created(){
        let order = JSON.parse(sessionStorage.getItem("ORDER_DETAIL"));
        this.rows = order.currentRow;
        this.type = order.type;
        this.rows.time = moment(this.rows.time).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.rows);
    }
};
</script>
