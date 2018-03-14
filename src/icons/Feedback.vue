<template>
  <svg viewBox="0 0 24 24" :height="height" :width="width" :fill="color" style="display: inherit;">
    <g>
      

        <g stroke="#777777">
            <path d="M6.49860735,15.7659087 L6.8125,15.8917891 L6.8125,18 C6.8125,18.8284271 7.48407288,19.5 8.3125,19.5 L10.6875,19.5 C11.5159271,19.5 12.1875,18.8284271 12.1875,18 L12.1875,15.8917891 L12.5013926,15.7659087 C15.4983238,14.5640493 17.5,11.6762406 17.5,8.42105263 C17.5,4.04742586 13.919317,0.5 9.5,0.5 C5.08068298,0.5 1.5,4.04742586 1.5,8.42105263 C1.5,11.6762406 3.50167617,14.5640493 6.49860735,15.7659087 Z" id="Combined-Shape"></path>
            <path d="M7,10 L12,10" id="Line" stroke-linecap="round"></path>
        </g>

    </g>
  </svg>
</template>
<script>
const Feedback = {
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

export default Feedback;
</script>