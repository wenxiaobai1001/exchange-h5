<template>
  <div class="about">
    <div class="page-home">
      <img class="set_img" src="../../../assets/images/activity-bg.jpg"/>
      <div class="width">
        <div class="bold color3 font18 title">
          关于CDEA
          <span class="caps">诚实 | 公平 | 热情 | 开放</span>
        </div>

        <div class="contain">coinglb由一群比特币早期参与者与极客创立，团队核心成员来自于谷歌、微软、阿里巴巴、腾讯等知名企业，具有深厚的研发实力与丰富的互联网产品运营经验。</div>
        <div class="contain">CDEA定位于区块链基础服务商，致力于为全球用户提供优质加密资产交易平台，秉承着“不作恶”的基本原则，坚持诚实、公正、热情的服务于客户，以开放的态度迎接一切有利于用户根本利益的伙伴/项目。</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: { },
  data() {
    let self = this;
    return {
      
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

  }
}
</script>
<style scoped lang="scss" >
  .about{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background:#fff;
  }

  .set_img{
    width:100%;
  }

  .title{
    padding:5% 0;
    .caps{
      font-size:12px;
      font-weight:normal;
      display:block;
    }
  }
  .contain{
    text-indent:2em;
    margin-bottom:3%;
  }
</style>