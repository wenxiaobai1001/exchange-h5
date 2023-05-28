<template>
   <div class="page-home">
    <PageHeader title="Help"></PageHeader> 
    <div class="page-content">
      <div class="page-help">
        <div class="page-help-title">
          <img class="bannerimg" src="../../assets/images/help_banner.jpg">
          <h1>{{$t("header.helpcenter")}}</h1>
        </div>
        <div class="help_container">
          <div class="main">
            <div class="section" v-for="(section, index) in helpData" :key="index">
              <h3>{{section.titleEN}}</h3>
              <div class="list-wrap">
                <router-link class="item" :title="item.title" v-for="(item, index) in section.content" :to="{path:'helpdetail',query:{id:item.id}}" :key="index">
                  <span class="text">{{item.title}}</span>
                </router-link>
              </div>
              <div class="route-wrap">
                <router-link :to="{path:'helplist',query:{cate:section.cate, cateTitle:section.titleEN}}">{{$t("common.more")}}>></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-help {
  background: #FFF;
  height: 100%;
  padding-top: 50px;
  color: #fff;
  .page-help-title {
    position: relative;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
        position: absolute;
    }
    .bannerimg {
      width: 100%;
      height: 100%;
    }
  }
  .help_container {
    background-color: #fff;
    padding: 2%;
    h3 {
        color: #000;
        font-size: 16px;
    }
    .list-wrap {
        display: flex;
        flex-direction: column;
        font-size: 14px;
    }
    .route-wrap {
        width: 100%;
        text-align: right;
    }
  }
}
</style>

<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components:{PageHeader},
  data() {
    return {
      helpData: []
    };
  },
  created: function() {
    this.getData();
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    }
  },
  methods: {
    getData() {
      let param = {};
      param["lang"] = this.lang;
      this.$http.post(this.host + "/uc/ancillary/more/help", param).then(res => {
        if (res.status == 200 && res.body.code == 0) {
          this.helpData = res.body.data;
        } else {
          this.$Message.error(res.body.message);
        }
      });
    }
  }
};
</script>
