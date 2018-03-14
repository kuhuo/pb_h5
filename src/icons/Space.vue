<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g stroke="#777777">
     

    
            <path d="M12,19 L12,13.154386 C12,12.5168362 11.5204798,12 10.9289617,12 L9.07103825,12 C8.47952016,12 8,12.5168362 8,13.154386 L8,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,10.4323433 C1,7.58469238 2.51372933,4.95170387 4.97463184,3.51884845 L5.97463612,2.93659802 C8.46270777,1.48792342 11.537307,1.48792457 14.0253776,2.93660103 L15.0253733,3.51884748 C17.4862729,4.95170367 19,7.58469054 19,10.4323393 L19,17 C19,18.1045695 18.1045695,19 17,19 L12,19 Z" ></path>
        

    </g>
  </svg>
</template>
<script>
const Space = {
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

export default Space;
</script>