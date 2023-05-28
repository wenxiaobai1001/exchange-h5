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
    .sell-order{
        color: #FF0000!important;
    }
    .sell-order.buy-order{
        color: #42b983!important;
    }
    .profitAndLoss{
        color: #42b983!important;
    }
    .profitAndLoss.profitAndLoss0{
        color: #FF0000!important;
    }
    .pl0{
        color: #FF0000!important;
    }
    .pl0.pl{
        color: #42b983!important;
    }
</style>
<template>
    <div class="expand-detail">
        <Row class="expand-row" :class="skin" v-if="type=='currentPosition'">
            <!--currentPosition-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.pos_Pl")}}: </span>
                <span class="expand-value pl0" :class="{'pl':rows.pl > 0}">{{ rows.pl + " USDT" }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("swap.pos_pos")}}: </span>
                <span class="expand-value">{{ rows.position + " "+$t("swap.shareNumber") }}</span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin" v-if="type=='currentPosition'">
            <!--currentPosition-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.pos_margin")}}: </span>
                <span class="expand-value">{{ rows.margin + " USDT" }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("swap.pos_mRatio")}}: </span>
                <span class="expand-value">{{ (rows.mRatio * 100) + " %" }}</span>
            </Col>
        </Row>

        <Row class="expand-row" :class="skin" v-if="type=='currentOrder'">
            <!--currentOrder-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.pos_Pl")}}: </span>
                <span class="expand-value">{{ rows.pl + " USDT" }}</span>
            </Col>
        </Row>



        <Row class="expand-row" :class="skin" v-if="type=='historyOrder'">
            <!--historyOrder-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.time")}}: </span>
                <span class="expand-value">{{ rows.createTime }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key" >{{$t("swap.ent_direction")}}: </span>
                <span class="expand-value sell-order" v-if="rows.entrustType == 'OPEN'" :class="{'buy-order':rows.direction == 'BUY'}">
                    {{ rows.direction == "BUY" ? $t("swap.openup"):$t("swap.opendown")}}
                </span>
                <span class="expand-value sell-order" v-if="rows.entrustType != 'OPEN'" :class="{'buy-order':rows.direction == 'BUY'}">
                    {{ rows.direction == "BUY" ? $t("swap.closeup"):$t("swap.closedown")}}
                </span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin" v-if="type=='historyOrder'">
            <!--historyOrder-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.ent_type")}}: </span>
                <span class="expand-value" v-if="rows.isFromSpot == 1">{{ $t("swap.spot_price") }}</span>
                <span class="expand-value" v-if="rows.isFromSpot != 1">
                    {{ rows.type == "LIMIT_PRICE"?$t("swap.limited_price"):(rows.type == "MARKET_PRICE"?$t("swap.market_price"):$t("swap.spot_price")) }}
                </span>
            </Col>
            <Col span="12">
                <span class="expand-key" >{{$t("swap.ent_trigglePrice")}}: </span>
                <span class="expand-value" v-if="rows.isFromSpot == 1">
                    {{ rows.triggerPrice}}
                </span>
                <span class="expand-value" v-if="rows.isFromSpot != 1">
                    {{ rows.type == "SPOT_PRICE"?rows.triggerPrice:"--"}}
                </span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin" v-if="type=='historyOrder'">
            <!--historyOrder-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.ent_entrustPrice")}}: </span>
                <span class="expand-value">{{ row.entrustPrice }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key" >{{$t("swap.ent_margin")}}: </span>
                <span class="expand-value">
                    {{ rows.principalAmount +" "+"USDT"}}
                </span>
            </Col>
        </Row>
        <Row class="expand-row" :class="skin" v-if="type=='historyOrder'">
            <!--historyOrder-->
            <Col span="12">
                <span class="expand-key">{{$t("swap.ent_fee")}}: </span>
                <span class="expand-value" v-if="rows.status != 'ENTRUST_CANCEL'">
                    {{ rows.entrustType == "OPEN"?rows.openFee:rows.closeFee }}
                </span>
                <span class="expand-value" v-if="rows.status == 'ENTRUST_CANCEL'">--</span>
            </Col>
            <Col span="12">
                <span class="expand-key">{{$t("swap.ent_pl")}}</span>
                <span class="expand-value profitAndLoss" v-if="rows.entrustType == 'CLOSE'" :class="{'profitAndLoss0':rows.profitAndLoss <0}">
                    {{rows.profitAndLoss}}
                </span>
                <span class="expand-value" v-if="rows.entrustType != 'CLOSE'">--</span>
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
            rows: Object,
            type: String,
        },
        created(){
            console.log("rows", this.rows);
            if(this.type=="historyOrder"){
                this.rows.createTime = this.dateFormat(this.rows.createTime);
            }
        },
    };
</script>
