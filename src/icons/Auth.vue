<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
   


        <g id="ico_me_identification" stroke="#777777">
            <path d="M10,0.617796872 L0.58794872,7.44845587 L4.18280656,18.5 L15.8171934,18.5 L19.4120513,7.44845587 L10,0.617796872 Z" id="Polygon"></path>
            <path d="M7,11.3301775 L9.05992119,13.3900987 C10.0266918,12.482843 10.7430896,11.7962026 11.2091147,11.3301775 C11.6751398,10.8641524 12.7554415,9.75409327 14.4500199,8" id="Path-2" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
 
    </g>
  </svg>
</template>
<script>
const Auth = {
  props: {
    height: {
      type: [String, Number],
      default: 24
    },
    width: {
      type: [String, Number],
      default: 24
    },
    color: {
      type: String,
      default: '#000'
    }
  }
}

export default Auth;
</script>