<template>
  <v-btn :href="linkUrl" target="_blank" class="bg-white text-caption text-sm-body-2 guide__btn d-flex" color="headingText" elevation="2" outlined small>
    <span class="lh-crop-12 font-weight-medium">{{ linkText }}</span>
    <v-icon class="guide__btn__icon" color="primary">mdi-chevron-right</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    linkText: {
      type: String,
      default: '',
    },
    linkUrl: {
      type: String,
      default: '',
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/css/common.scss';
.guide{
  &__background {
    background-color: $cushion;
    color: $headingText;
    border-radius: 5px;
  }
  &Title__background {
    width: 80%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.15);
    position: relative;
    top: -45px;
    margin-top: -10px;
  }
  &__btn {
    width: 100%;
    position: relative;
    min-height: 45px;
    &__icon {
      position: absolute;
      top: 50%;
      right: -9px;
      transform: translateY(-50%);
    }
  }

}

</style>
