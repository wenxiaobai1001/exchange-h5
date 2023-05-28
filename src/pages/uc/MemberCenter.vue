<template>
  <div class="mymsg_wrapper">
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  created: function() {
    this.init();
  },
  methods: {
    init() {
      if (!localStorage.TOKEN || !localStorage.MEMBER) {
        this.$Message.success(this.$t("common.logintip"));
        this.$router.push("/login");
      }
    },
  },
  watch: {
    $route(to, form) {
      console.log(to.path);
    }
  },
  mounted: function() {
    this.$nextTick(function() {
    });
  }
};
</script>

<style lang="scss" scoped>
.mymsg_wrapper {
  padding: 70px 8% 0;
  margin-bottom: 10px;
}
</style>