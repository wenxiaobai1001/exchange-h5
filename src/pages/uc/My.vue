<template>
  <div class="page-home">
    <div class="mysetting-page">
      <div class="mytop">

        <img class="mytop-setting" src="../../assets/img/settings.png" @click="setList"  v-if="checkLogin" />
        <div class="mytop-header">
          <img class="mytop-header-img" :src="checkLogin ? member.avatar : applogo" @click="login" />
          <div class="mytop-username">
            <span @click="login">{{checkLogin ? member.realName : $t("common.login")}}</span>
            <!-- <span>{{checkLogin ? member.username : ''}}</span> -->
          </div>
        </div>
        <div class="myinvition-link">
          <div class="myinvition-link-title">{{$t("invite.myinvitelink")}}</div>
          <div class="myinvition-link-link">{{getmypromotioninfor.inviteLink}}</div>
          <div class="myinvition-link-btn" @click="invitionCopy"><span>{{$t('invite.copy')}}</span></div>
        </div>
      </div>
      
      <div class="myassets">
        <div class="myassets-title"><span>▏</span>{{$t("uc.finance.personalassets")}}</div>
        <div class="myassets-subtitle"><span>{{$t("uc.finance.money.totalassets")}}</span></div>
        <div class="myassets-assets"><span>≈ {{totalUSDT}} (USDT)</span></div>
        <div class="myassets-content">
          <div v-for="(item,index) in accountList" :key="index" @click="jumpAccount(item)">
            <img class="set_img_flex" :src="item.url"  />
            <span>{{item.name}}</span>
          </div>
        </div>
        <div class="myassets-content record-list">
          <div v-for="(item,index) in recordList" :key="index" @click="jumpAccount(item)">
            <img class="set_img_flex" :src="item.url"  />
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>

      <div class="myInnovation">
        <div class="myInnovation-title"><span>▏</span>{{$t('uc.activity.navTitle')}}</div>
        <div class="myInnovation-content">
          <div v-for="(item,index) in innovationList" :key="index" @click="jumpAccount(item)">
            <img class="set_img_flex" :src="item.url"  />
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>

      <div class="mysetting">
        <div class="mysetting-title"><span>▏</span>{{$t("uc.member.securitysetting")}}</div>
        <div class="mysetting-content">
          <div v-for="(item,index) in settingList" :key="index" @click="jumpURL(item)">
            <img class="set_img_flex" :src="item.check == 1 ? item.goldurl : item.url"  />
            <span :class="item.check == 1 ? 'yellow' : ''">{{item.name}}</span>
          </div>
        </div>
      </div>

      <div class="myinvition" v-if="checkLogin">
        <div class="myinvition-title">
          <div><span>▏</span>My invition</div>
          <input type="hidden" id="link" v-model="getmypromotioninfor.inviteLink" style="opacity:0;" />
        </div>
        <div class="myinvition-content">
          <div class="textc">
            <div class="font14">{{$t('invite.mylevelone')}}</div>
            <div class="bold paddtop5">{{getmypromotioninfor.levelOne}}</div>
          </div>

          <div class="textc">
            <div class="font14">{{$t('invite.myleveltwo')}}</div>
            <div class="bold paddtop5">{{getmypromotioninfor.levelTwo}}</div>
          </div>

          <div class="textc">
            <div class="font14">{{$t('invite.mycommission')}}</div>
            <div class="bold paddtop5">{{getmypromotioninfor.estimatedReward}}</div>
          </div>

          <div class="textc">
            <div class="font14">{{$t('invite.extrareward')}}</div>
            <div class="bold paddtop5">{{getmypromotioninfor.extraReward}}</div>
          </div>

          <div class="textc">
            <div class="font14">{{$t('invite.partnerlevel')}}</div>
            <div class="bold paddtop5">{{getmypromotioninfor.partnerlevel}}</div>
          </div>

        </div>
      </div>
    </div>
    <PageFooter curindex='my'></PageFooter>
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
import PageFooter from '@/components/footer/index.vue';

var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
var moment = require("moment");
import SvgLine from "@components/exchange/SvgLine.vue";
import SvgIndex from "@components/exchange/SvgIndex.vue";
import Swiper from 'swiper';
export default {
  components: { SvgLine, SvgIndex,PageHeader, PageFooter },
  data() {
    let self = this;
    return {
      tableMoney:[],
      applogo:require("../../assets/images/my/header.png"),
      invitionlink:'https://www.c-deal.com/#/reg?code=0QGW',
      member:{},
      checkLogin:!!localStorage.getItem('TOKEN') ? true : false,
      getmypromotioninfor:{},
      accountList:[
        { name:this.$t('common.exchangeAccount'), url:require("../../assets/img/exchange-account.png"), jumpurl:'/moneyIndex'},
        { name:this.$t('common.contractAccount'), url:require("../../assets/img/contract-account.png"), jumpurl:'/swapAssets'},
        { name:this.$t('common.secondAccount'), url:require("../../assets/img/second-account.png") , jumpurl:'/secondsAssets'},
      ],
      recordList:[
        { name:this.$t('uc.finance.billdetail'), url:require("../../assets/img/exchange-record.png"), jumpurl:'/exchangeRecordList'},
        { name:this.$t('uc.finance.charge'), url:require("../../assets/img/recharge-record.png"), jumpurl:'/rechargeRecordList'},
        { name:this.$t('uc.finance.pickup'), url:require("../../assets/img/withdraw-record.png") , jumpurl:'/withdrawRecordList'},
      ],
      innovationList:[
        { name:this.$t('uc.activity.subNavTitle1'), url:require("../../assets/img/myorders.png"), jumpurl:'/myorders'},
        // { name:this.$t('uc.activity.subNavTitle2'), url:require("../../assets/img/mymining.png"), jumpurl:'/myminings'},
        { name:this.$t('uc.activity.subNavTitle3'), url:require("../../assets/img/mylocked.png") , jumpurl:'/mylocked'},
      ],
      settingList:[
        { name:this.$t('uc.safe.verified'), url:require("../../assets/images/my/idcard.png"), jumpurl:'/authentication', goldurl:require("../../assets/images/my/idcardgold.png")},
        { name:this.$t('uc.safe.bindemail'), url:require("../../assets/images/my/email.png"), jumpurl:'/emailAuthenication', goldurl:require("../../assets/images/my/emailgold.png") },
        // { name:this.$t('uc.safe.bindphone'), url:require("../../assets/images/my/ipone.png") , jumpurl:'/phoneAuthenication', goldurl:require("../../assets/images/my/iponegold.png")},
        { name:this.$t('uc.safe.loginpwd'), url:require("../../assets/images/my/password.png"),jumpurl:'/changePassword', goldurl:require("../../assets/images/my/passwordgold.png") },
        { name:this.$t('uc.safe.fundpwd'), url:require("../../assets/images/my/money.png"),jumpurl:'/moneyPassword', goldurl:require("../../assets/images/my/moneygold.png") },
      ]
    };
  },
  created:function(){
    this.getMoney();
  },
  mounted: function() {
    if(!!localStorage.getItem('TOKEN')){
       this.getMember();
       this.getmypromotion();
    }
  },
  destroyed: function () {  
  }, 
  computed: {
   totalUSDT() {
      let usdtTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        usdtTotal +=  (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * this.tableMoney[i].coin.usdRate;
      }
      return usdtTotal.toFixed(2);
    },
  },
  watch: {
    
  },
  filters:{
    
  },
  methods: {
     partnerNameByCount: function(count) {
      if(count == undefined || count == null || count == ""){
        return "-";
      }
      let partnerName = "Lv1(" + this.$t('invite.lv1') +")";
      if(count > 10) partnerName = "Lv2(" + this.$t('invite.lv2') +")";
      if(count > 100) partnerName = "Lv3(" + this.$t('invite.lv3') +")";
      if(count > 500) partnerName = "Lv4(" + this.$t('invite.lv4') +")";
      if(count > 1500) partnerName = "Lv5(" + this.$t('invite.lv5') +")";
      if(count > 3000) partnerName = "Lv6(" + this.$t('invite.lv6') +")";
      return partnerName;
    },
    invitionCopy(){
      document.getElementById("link").select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success(this.$t("uc.finance.recharge.copysuccess"));
    },
    getMoney() {
      //获取
      this.$http.post(this.host + this.api.uc.mywallet,{},{
        emulateJSON: false,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.tableMoney = resp.data;
          for (let i = 0; i < this.tableMoney.length; i++) {
            this.tableMoney[i]["coinType"] = this.tableMoney[i].coin.unit;
          }
          this.loading = false;
          this.tableMoneyShow = this.tableMoney;
        } else {
          this.$Message.error(this.loginmsg);
        }
      });
    },
    getMember() {
        //获取个人安全信息
        var self = this;
        this.$http
          .post(this.host + "/uc/approve/security/setting")
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.member = resp.data
              this.settingList[0].check = resp.data.realVerified;
              this.settingList[1].check = resp.data.emailVerified;
              // this.settingList[2].check = resp.data.phoneVerified;
              this.settingList[2].check = resp.data.loginVerified;
              this.settingList[3].check = resp.data.fundsVerified;
              if(resp.data.fundsVerified==1){
                this.settingList[3].jumpurl = '/moneyPasswordUpdate';
              }
            } else {
              this.$Message.error(this.loginmsg);
              // this.$Message.error(this.$t('common.logintip'));
            }
          });
    },
    //我的邀请数据
    getmypromotion() {
        //获取个人安全信息
        var self = this;
        this.$http
          .post(this.host + "/uc/promotion/mypromotion")
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.getmypromotioninfor = resp.data
              this.getmypromotioninfor.partnerlevel = this.partnerNameByCount(resp.data.levelOne);
              this.getmypromotioninfor.inviteLink = this.$store.state.member.promotionPrefix + this.$store.state.member.promotionCode;
            } else {
              this.$Message.error(this.loginmsg);
              // this.$Message.error(this.$t('common.logintip'));
            }
          });
    },
    login(){
        if(this.checkLogin){
          return false
        }
        localStorage.setItem("MEMBER", JSON.stringify(null));
        localStorage.setItem("TOKEN", null);
        localStorage.removeItem("USERKEY", null);
        this.$store.commit("setMember", null);
        this.$router.push("/login");
    },
    setList(){
      this.$router.push({ path: "/setUp"});
    },
    jumpAccount(res){
      this.$router.push(res.jumpurl);
    },
    jumpURL(res){
      // if(res.jumpurl=='/moneyPassword' && res.check ==1){
      //   return;
      // }
      // if(res.check !==1){
        // if(this.member.fundsVerified==1){
        //   res.jumpurl = "/moneyPasswordUpdate";
        // }
      this.$router.push(res.jumpurl);
      // }
    }
  }
}
</script>
<style scoped lang="scss">
.mysetting-page{
  padding-bottom: 50px;

  .mytop{
      background: linear-gradient(200deg,#f19100,#ffc84b,#ffc540);
      padding: 4% 2%;
      position: relative;
      .myinvition-link {
        margin-top: 20px;
        color: #fff;
        .myinvition-link-title{
          font-size: 16px;
          font-weight: 400;
        }
        .myinvition-link-link{
          font-size: 14px;
          margin-top: 10px;
        }
        .myinvition-link-btn {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          text-align: right;
        }
      }
      .mytop-setting{
        width: 30px;
        height: 30px;
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .mytop-header{
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        .mytop-header-img {
            height: 100px;
            width: 100px;
            border-radius: 100%;
        }
      }
  }

  .myassets{
      background-color: #fff;
      margin-top: 1%;
      padding: 2%;
      .myassets-title {
        font-size: 18px;
        color: #f0a70a;
        font-weight: bold;
        margin: 10px 0;
      }
      .myassets-subtitle{
        font-size: 14px;
        color: #f0a70a;
        font-weight: bold;
        margin: 10px 0;
      }
      .myassets-assets{
        font-size: 16px;
        // color: #f0a70a;
        font-weight: bold;
        margin: 10px 0;
      }
      .record-list{
        border-top: 3px solid #f0f2f5;
      }
      .myassets-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 2% 0;
        div{
          padding: 2%;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 30%;
          img{
            width: 32px;
          }
          span{
            // height: 40px;
            width: 100%;
            display: block;
            text-align: center;
          }
        }
      }
  }

  .myInnovation{
    background-color: #fff;
    margin-top: 1%;
    padding: 2%;
    .myInnovation-title {
      font-size: 18px;
      color: #f0a70a;
      font-weight: bold;
      margin: 10px 0;
    }
    .myInnovation-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      div{
        font-size: 14px;         
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin: 2%;
        padding: 1%;
        // width: 100px;
        height: 80px;
        width: 29.33%;
        img{
          width: 32px;
        }
        span{
          height: 40px;
          width: 100%;
          display: block;
          text-align: center;
        }
      }
    }
  }

  .mysetting{
    background-color: #fff;
    margin-top: 1%;
    padding: 2%;
    .mysetting-title {
      font-size: 18px;
      color: #f0a70a;
      font-weight: bold;
      margin: 10px 0;
    }
    .mysetting-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      div{
        font-size: 14px;         
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin: 2%;
        padding: 2%;
        // width: 100px;
        height: 80px;
          width: 29%;
        img{
          width: 32px;
        }
        span{
          height: 40px;
          width: 100%;
          display: block;
          text-align: center;
        }
      }
    }
  }
  .myinvition{
    background-color: #fff;
    margin: 1% 0;
    padding: 2%;
    .myinvition-title {
      font-size: 18px;
      color: #f0a70a;
      font-weight: bold;
      margin: 10px 0;
    }
    .myinvition-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .textc{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin: 2%;
        padding: 2%;
        background-color: #f8f8f9;
        border-radius: 5px;
        width: 100px;
        height: 80px;
        div{
          text-align: center;
          width: 100%;
        }
      }
    }
  }

}
</style>