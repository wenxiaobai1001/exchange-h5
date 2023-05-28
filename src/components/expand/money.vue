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
                <span class="expand-key">{{$t("uc.finance.money.frozen")}}: </span>
                <span class="expand-value">{{ rows.frozenBalance }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("uc.finance.money.needreleased")}}: </span>
                <span class="expand-value">{{ rows.toReleased }}</span>
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
            this.rows.frozenBalance = this.toFloor(this.rows.frozenBalance||0);
            this.rows.toReleased = this.toFloor(this.rows.toReleased||0);
            this.rows.time = this.dateFormat(this.rows.time);
        },
    };
</script>
