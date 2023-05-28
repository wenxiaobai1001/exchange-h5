<template>
  <div class="page-home">
    <PageHeader :title="$t('common.withdrawList')"></PageHeader>
    <div class="page-content">
      <div class="page-withdraw">
        <!-- <div class="page-withdraw-address">
          <div class="page-withdraw-address-link">
            <router-link to="/withdraw/address">{{$t('uc.finance.withdraw.addressmanager')}}</router-link>
          </div>
        </div> -->
        <div class="page-withdraw-title">
          <h2>{{$t('common.withdrawChannels')}}</h2>
          <!-- <p>{{$t('common.withdrawTip')}}</p> -->
        </div>
        <div class="page-withdraw-list">
          <div class="item" v-for="item in coinList" :key="item.id">
            <div><img :src="require('../../assets/img/'+item.coin.name.toLowerCase()+'.png')">{{item.coin.nameCn}}</div>
            <div>
              <router-link :to="'/doWithdraw?name='+item.coin.nameCn+'&unit='+item.coin.name" tag="a">{{$t('common.goWithdraw')}}</router-link>
            </div>
          </div>
          <!-- <div class="item">
            <div><img src="@/assets/img/bankcard.png">Bank</div>
            <div>{{$t('common.goWithdraw')}}</div>
          </div> -->
        </div>
        <div class="page-withdraw-title">
          <h2>{{$t('common.withdrawThird')}}</h2>
        </div>
        <div class="page-withdraw-list">
          <div class="item third">
            <div><img src="@/assets/img/binance.png">BINANCE {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://accounts.binance.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
          <div class="item third">
            <div><img style="background: #000;" src="@/assets/img/okx.png">OKEX {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://www.okx.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
         <div class="item third">
            <div><img src="@/assets/img/channelly.png">Changelly {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://channelly.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
          <div class="item third">
            <div><img src="@/assets/img/simplex.png">Simplex {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://www.simplex.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
          <div class="item third">
            <div><img style="height:auto;" src="@/assets/img/crypto.png">Crypto {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://www.crypto.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
          <div class="item third">
            <div><img style="height:auto;" src="@/assets/img/moonpay.png">Moonpay {{$t('common.withdrawThirdChannel')}}</div>
            <div>
              <a href="https://www.moonpay.com/" target="_blank">
                <span>{{$t('common.goWithdraw')}}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';
export default {
  components:{
    PageHeader
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalNum: 0,
      FAQList: [],
      coinList: []
    };
  },
  created: function() {
    this.init();
    this.getMoney();
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    langPram(){
      return this.$store.state.lang;
    }
  },
  methods: {
    init() {
      this.loadDataPage(this.pageNo);
    },
    getMoney() {
      //获取
      this.$http.post(this.host + this.api.uc.mywallet,{},{
        emulateJSON: false,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        let resp = response.body;
        if (resp.code == 0) {
          for (let i = 0; i < resp.data.length; i++) {
            let coin = resp.data[i];
            if (coin.coin.canRecharge == 1 && coin.coin.name!='USDT') {
              this.coinList.push(coin);
            }
          }
          console.log(this.coinList);
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    loadDataPage(pageIndex) {
      var param = {};
      (param["pageNo"] = pageIndex),(param["pageSize"] = this.pageSize),(param["lang"] = this.lang),
        this.$http.post(this.host + this.api.uc.announcement, param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data.content.length == 0) return;
            this.FAQList = resp.data.content;
            this.totalNum = resp.data.totalElements;
          } else {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: resp.message
            });
          }
        });
    },
    noticedeail(id) {
      var path = { path: "/announcement/"+id};
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-withdraw {
    width: 100%;
    padding-top: 50px;
    // background-color: #fff;
    .page-withdraw-address{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 2% 2% 0 2%;
      .page-withdraw-address-link {
          padding: 2% 2%;
          border: 1px solid #f0a70a;
          color: #fff;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 400;
      }
    }
    .page-withdraw-title {
        padding: 2%;
      h2 {
          padding: 4% 0%;
          text-align: center;
      }
      p {
          font-size: 14px;
          padding: 2% 0;
      }
    }

    .page-withdraw-list {
        display: flex;
        flex-flow: wrap;
        padding: 2%;
        justify-content: space-between;
        .item{
          width: 45%;
          border: 1px solid #fff;
          margin: 2%;
          background-color: #fff;
          border-radius: 5px;
          img{
            width: 30px;
            height: 30px;
            margin-right: 2%;
          }
        }
        .item div {
            display: flex;
            align-items: center;
            padding: 5% 2%;
            width: 100%;
        }
        .item div:first-child{
          font-size: 16px;
          font-weight: 600;
        }
        .item div:last-child {
          justify-content: flex-end;
          font-size: 14px;
        }
        .item.third div:first-child{
          font-size: 12px;
          font-weight: 600;
        }
        .item.third div:last-child {
          justify-content: flex-end;
          font-size: 14px;
        }
    }

}
</style>

