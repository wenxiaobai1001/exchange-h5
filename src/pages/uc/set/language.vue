<template>
  <div class="page-home">
    <PageHeader :isShowBack=true title="Choose Language"></PageHeader>
    <div class="page-content">
      <div class="page-language">
        <div class="flex flexc navs" v-for="(item,index) in setList" :key="index" @click="changelanguage(item.key)">
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageHeader from '@/components/header/index.vue';
export default {
  components: {PageHeader},
  data() {
    let self = this;
    return {
      setList:[
        // { key:'zh_CN', name:'简体中文'},
        // { key:'ja_JP', name:'日本語'},
        { key:'en_US', name:'English'},
        // { key:'ko_KR', name:'한국어'},
        // { key:'de_DE', name:'Deutsch'},
        // { key:'fr_FR', name:'En français'},
        // { key:'it_IT', name:'Italiano'},
        // { key:'es_ES', name:'Español'},
        // { key:'tr_TR', name:'Türkiye'},
        // { key:'pt_PT', name:'Português'},
        { key:'th_TH', name:'ราชอาณาจักรไทย'},
      ]
    };
  },
  created: function() {
    
  },
  mounted: function() {
  },
  destroyed: function () {  
  }, 
  computed: {
   
  },
  watch: {
    
  },
  filters:{
    
  },
  methods: {
    changelanguage: function(name) {
      console.log("change language: " + name);
      this.$store.commit("setlang", name);
      this.$i18n.locale = name;
      // this.$router.push({ path: "/setUp"});
      history.go(-1);
    },
  }
}
</script>
<style scoped lang="scss" >
  .set_img{
    width:15px;
  }

  .navs{
    background:#fff;
    padding:15px 2.5%;
    width:95%;
    margin:auto;
    background:#fff;
    border-bottom:1px solid #ececec;
  }
  .page-language{
    background:#fff;
    padding-top: 50px;
  }

  .btn{
    height:35px;
    background:#f0a70a;
    margin-top:20px;
    color:#fff;
    border-radius:35px;
    text-align:center;
    line-height:35px;
    letter-spacing: 2px;
    margin-top:50px;
  }
</style>