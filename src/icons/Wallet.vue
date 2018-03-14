<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
   





   
        <g stroke="#777777">
            <rect id="Rectangle-4" x="0.5" y="2.5" width="19" height="16" rx="5"></rect>
            <path d="M19.5,13.5 L19.5,7.5 L13.5,7.5 C11.8431458,7.5 10.5,8.84314575 10.5,10.5 C10.5,12.1568542 11.8431458,13.5 13.5,13.5 L19.5,13.5 Z" id="Rectangle-4-Copy"></path>
            <circle id="Oval-2" cx="13.5" cy="10.5" r="1.5"></circle>
        </g>
 
  </svg>
</template>
<style type="text/css" scoped>
  .st3{fill:#666666;}
</style>
<script>
const Wallet = {
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

export default Wallet;
</script>