<template>
  <div class="nav-right tradeCenter">
    <section class="list-content">
      <Tabs :value="tabPage" v-model="tabPage">
        <TabPane :label="$t('otc.buyin')" name="buy">
          <div class="table-responsive list-table">
            <Table :no-data-text="$t('common.nodata')" :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 250 : ''" :size="tableSize" :data="advertiment.ask.rows" :columns="advertiment.columns" :loading="loading" :disabled-hover="true"></Table>
            <div class="page_change">
              <div style="float: right;">
                <Page v-if="advertiment.ask.totalElement > 0" :pageSize="advertiment.ask.pageNumber" :total="advertiment.ask.totalElement" :current="advertiment.ask.currentPage" @on-change="changePage"></Page>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane :label="$t('otc.sellout')" name="sell">
          <div class="table-responsive list-table">
            <Table :no-data-text="$t('common.nodata')" :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 250 : ''" :size="tableSize" :data="advertiment.bid.rows" :columns="advertiment.columns" :loading="loading" :disabled-hover="true"></Table>
            <div class="page_change">
              <div style="float: right;">
                <Page v-if="advertiment.bid.totalElement > 0" :pageSize="advertiment.bid.pageNumber" :total="advertiment.bid.totalElement" :current="advertiment.bid.currentPage" @on-change="changePage"></Page>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    var self = this;
    return {
      showBorder: false,
      showStripe: false,
      showHeader: true,
      showIndex: false,
      showCheckbox: false,
      fixedHeader: false,
      loading: true,
      dataCount: 10,
      tableSize: "large",
      tabPage: "buy",
      advertiment: {
        //卖出的广告数据
        ask: {
          rows: [],
          currentPage: 1,
          totalPage: 1,
          pageNumber: 10,
          totalElement: 0
        },
        //买入的广告数据
        bid: {
          rows: [],
          currentPage: 1,
          totalPage: 1,
          pageNumber: 10,
          totalElement: 0
        },
        columns: [
          {
            title: self.$t("otc.merchant"),
            key: "memberName",
            // width: 160,
            ellipsis: true,
            render: function(h, params) {
              var avatar = params.row.avatar,
                haveAvatar = false;
              var innerCNT = [];
              if (avatar != null && avatar != "") {
                innerCNT[0] = h(
                  "div",
                  {
                    attrs: {
                      class: "user-face user-avatar-public"
                    }
                  },
                  [
                    h("img", {
                      attrs: {
                        src: avatar,
                        width: "45px",
                        height: "45px"
                      },
                      style: {
                        "border-radius": "50%"
                      }
                    })
                  ]
                );
              } else {
                innerCNT[0] = h(
                  "div",
                  {
                    attrs: {
                      class: "user-face user-avatar-public"
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        attrs: {
                          class: "user-avatar-in"
                        }
                      },
                      params.row.memberName
                        .replace(/^\s+|\s+$/g, "")
                        .slice(0, 1)
                    )
                  ]
                );
              }
              innerCNT[1] = h("p", [
                h(
                  "a",
                  {
                    style: {
                      marginRight: "8px",
                      cursor: "pointer",
                      paddingTop: "5px"
                    },
                    class: {
                      // renzhengA: params.row.renzheng
                    },
                    on: {
                      click: function() {
                        if (self.isLogin) {
                          self.$router.push(
                            "/checkuser?id=" + params.row.memberName
                          );
                        } else {
                          self.$router.push("/login");
                        }
                      }
                    }
                  },
                  params.row.memberName
                  // self.strpro(params.row.memberName)
                ),
                h(
                  "div",
                  {
                    class: {
                      // renzheng: params.row.renzheng
                    }
                  },
                  ""
                )
              ]);
              if (params.row.level == 2)
                innerCNT[2] = h(
                  "div",
                  {
                    attrs: {
                      class: "user-business-v"
                    },
                    style: {
                      display: "inline-block",
                      "vertical-align": "text-top"
                    }
                  },
                  [
                    h("img", {
                      attrs: {
                        src: require("../../assets/images/business_v.png")
                      }
                    })
                  ]
                );
              return h("div", innerCNT);
            }
          },
          // {
          //   title: self.$t("otc.volume"),
          //   key: "transactions",
          //   width:100,
          //   align:"center"
          // },
          // {
          //   title: self.$t("otc.paymethod"),
          //   key: "payMode",
          //   align:"center",
          //   // width:130
          // },
          {
            align:"center",
            title: self.$t("otc.amount"),
            key: "remainAmount"
          },
          // {
          //   title:"限额",
          //   align:'center',
          //   render:(h, params)=>{
          //     return h('div',{},params.row.minLimit + "-" + params.row.maxLimit + "(THB)")
          //   }
          // },
          // {
          //   title:"单价",
          //   align:'center',
          //   render:(h, params)=>{
          //     return h('div',{},params.row.price + "(THB)")
          //   }
          // },
          // {
          //   title: self.$t("otc.price_coin"),
          //   key: "price",
          //   width: 170,
          //   render: function(h, params) {
          //     return h("div", [
          //       h(
          //         "p",
          //         {
          //           attrs: {
          //             class: "price"
          //           }
          //         },
          //         params.row.price + "(THB)"
          //       ),
          //       h(
          //         "p",
          //         {
          //           attrs: {
          //             class: "price2"
          //           }
          //         },
          //         params.row.minLimit + "-" + params.row.maxLimit + "(THB)"
          //       )
          //     ]);
          //   }
          // },
          {
            title: self.$t("otc.operate"),
            key: "buyBtn",
            // width:70,
            align:"center",
            render: function(h, params) {
              return h("p", [
                h(
                  "a",
                  {
                    style: {
                      color: params.row.advertiseType == 0 ? "#f15057" : "#00b275",
                    },
                    on: {
                      click: () => {
                        if (!self.isLogin) {
                          self.$router.push("/login");
                        } else if (!self.member.realName) {
                          //                                            } else if (!self.member.memberLevel) {
                          self.$Message.error(self.$t("otc.validate"));
                          setTimeout(() => {
                            self.$router.push("/uc/safe");
                          }, 2000);
                        } else {
                          self.$router.push(
                            "/otc/tradeInfo?tradeId=" + params.row.advertiseId
                          );
                        }
                      }
                    }
                  },
                  // [
                  //   h(
                  //     "div",
                  //     {
                  //       // props: {
                  //       //   type:"error",
                  //       //     // params.row.advertiseType == 0 ? "error" : "success",
                  //       //   long: true
                  //       // },
                  //       style: {
                  //         marginRight: "8px",
                  //         width: "80%",
                  //       }
                  //     },
                      params.row.advertiseType == 0 ? self.$t("otc.sell") : self.$t("otc.buy")
                    // )
                  // ]
                )
              ]);
            }
          }
        ]
      }
    };
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    },
    member: function() {
      return this.$store.getters.member;
    },
    coin: function() {
      if(this.$route.query.unit == undefined) return "USDT";
      return this.$route.query.unit;
    },
    lang: function() {
      return this.$store.state.lang;
    }
  },
  watch: {
    coin: function() {
      this.reloadAd();
    },
    lang: function() {
      this.updateLangData();
    }
  },
  methods: {
    updateLangData() {
      this.advertiment.columns[0].title = this.$t("otc.merchant");
      this.advertiment.columns[1].title = this.$t("otc.volume");
      this.advertiment.columns[2].title = this.$t("otc.paymethod");
      this.advertiment.columns[2].title = this.$t("otc.amount");
      this.advertiment.columns[2].title = this.$t("otc.price_coin");
      this.advertiment.columns[2].title = this.$t("otc.operate");
    },
    loadAd(pageNo, advertiseType, table) {
      //获取广告
      let params = {};
      table.rows = [];
      table.totalElement = 0;
      table.currentPage = pageNo;
      params["pageNo"] = pageNo;
      params["pageSize"] = table.pageNumber;
      params["advertiseType"] = advertiseType;
      params["unit"] = this.coin;
      this.$http
        .post(this.host + this.api.otc.advertise, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            if (resp.data.context) {
              table.rows = resp.data.context;
              table.totalElement = resp.data.totalElement;
            }
          } else {
            this.$Message.error(resp.message);
          }
          this.loading = false;
        });
    },
    changePage(page) {
      if (this.tabPage == "sell") {
        this.loadAd(page, 0, this.advertiment.bid);
      } else {
        this.loadAd(page, 1, this.advertiment.ask);
      }
    },
    reloadAd() {
      // this.tabPage = "buy";
      this.loadAd(1, 0, this.advertiment.bid);
      this.loadAd(1, 1, this.advertiment.ask);
    },
    strpro(str) {
      let newStr = str;
      str = str.slice(1);
      var re = /[\D\d]*/g;
      var str2 = str.replace(re, function(str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
          result += "*";
        }
        return result;
      });
      return newStr.slice(0, 1) + str2;
    }
  },
  created() {
    this.reloadAd();
  }
};
</script>



<style scoped lang="scss">
#List .nav-right {
  color: #26264c;
  padding-right: 0;
  .list-content {
    color: #fff;
  }
}
</style>

