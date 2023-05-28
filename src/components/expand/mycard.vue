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
            <Col span="16">
                <span class="expand-key">{{$t("uc.promotion.card_column0")}}: </span><br>
                <span class="expand-value">{{ rows.cardNo }}</span>
            </Col>
             <Col span="8">
                <span class="expand-key">{{$t("uc.promotion.card_column5")}}: </span><br>
                <span class="expand-value">{{ rows.count }}</span>
            </Col>
            
        </Row>
        <Row class="expand-row" :class="skin">
           <Col span="16">
                <span class="expand-key">{{$t("uc.promotion.card_column2")}}: </span><br>
                <span class="expand-value">{{ rows.coin.unit }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("uc.promotion.card_column6")}}: </span><br>
                <span class="expand-value">{{ rows.exchangeCount }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin">
            <Col span="18">
                <span class="expand-key">{{$t("uc.promotion.card_column7")}}: </span><br>
                <span class="expand-value">{{ rows.createTime }}</span>
            </Col>
            <Col span="6">
                <span class="expand-key"></span><br>
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
            this.rows.createTime = this.dateFormatFromString(this.rows.createTime);
        },
    };
</script>
