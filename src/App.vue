<script setup lang="ts">
import GameContainer from '@/components/GameContainer.vue';
</script>

<template>
  <main>
    <div class="bg-container">
      <svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="bg-group">
          <g class="bg1" filter="url(#filter0_f_504_1328)">
            <path
              d="M486.199 612.87C406.316 527.283 424.744 412.212 527.359 355.851L914.975 142.956C1017.59 86.5957 1165.53 110.288 1245.42 195.875L1498.6 467.13C1578.48 552.717 1560.05 667.788 1457.44 724.149L1069.82 937.044C967.206 993.405 819.262 969.712 739.379 884.125L486.199 612.87Z"
              fill="url(#paint0_radial_504_1328)" />
          </g>
          <g class="bg2" style="mix-blend-mode:overlay" filter="url(#filter1_f_504_1328)">
            <path
              d="M1363.85 746.116C1275.12 887.43 1076.3 955.106 919.786 897.275L818.094 859.701C661.576 801.87 606.621 640.431 695.35 499.117C784.079 357.803 982.892 290.127 1139.41 347.958L1241.1 385.532C1397.62 443.363 1452.58 604.802 1363.85 746.116Z"
              fill="url(#paint1_radial_504_1328)" />
          </g>
          <g class="bg3" filter="url(#filter2_f_504_1328)">
            <path
              d="M814.418 530.095C747.57 636.559 597.788 687.545 479.869 643.976L403.255 615.669C285.336 572.1 243.934 450.474 310.782 344.01C377.629 237.546 527.412 186.559 645.331 230.128L721.944 258.436C839.863 302.005 881.265 423.631 814.418 530.095Z"
              fill="url(#paint2_radial_504_1328)" />
          </g>
        </g>
        <defs>
          <filter id="filter0_f_504_1328" x="328.237" y="4.06326" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="54.1446" result="effect1_foregroundBlur_504_1328" />
          </filter>
          <filter id="filter1_f_504_1328" x="546.932" y="221.297" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="52.9955" result="effect1_foregroundBlur_504_1328" />
          </filter>
          <filter id="filter2_f_504_1328" x="-47.7047" y="-111.967" filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="163.261" result="effect1_foregroundBlur_504_1328" />
          </filter>
          <radialGradient id="paint0_radial_504_1328" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(840.542 485.616) rotate(39.1934) scale(545.907 536.844)">
            <stop stop-color="#FFD84B" />
            <stop offset="1" stop-color="#FFD84B" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="paint1_radial_504_1328" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1184.6 635.688) rotate(-88.7945) scale(269.003 351.337)">
            <stop stop-color="#9207FF" />
            <stop offset="1" stop-color="#FF9898" />
          </radialGradient>
          <radialGradient id="paint2_radial_504_1328" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(671.239 481.701) rotate(-58.568) scale(988.515 1146.79)">
            <stop stop-color="#5AFD74" />
            <stop offset="1" stop-color="#5AE9FD" stop-opacity="0" />
          </radialGradient>
          <clipPath id="clip0_504_1328">
            <rect fill="white" transform="matrix(0 -1 1 0 0 1080)" />
          </clipPath>
        </defs>
      </svg>

    </div>
    <GameContainer />
  </main>
</template>

<style scoped lang="scss">
main {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    svg {
      width: 100%;
      height: 100%;
      background-color: #131126;
    }

    .bg-group {
      transform-origin: center;
      animation: anim-group 7s ease-in-out alternate infinite;

      @keyframes anim-group {
        to {
          scale: 1.2;
          translate: 0 100px;
        }
      }
    }

    .bg1 {
      animation: bg-one 7s ease-in-out alternate infinite;
      transform-origin: center;

      @keyframes bg-one {
        to {
          translate: 100px;
          scale: 1.1;
        }
      }
    }

    .bg2 {
      animation: bg-two 7s ease-in-out alternate infinite;
      transform-origin: center;

      @keyframes bg-two {
        to {
          translate: 100px 0;
          rotate: -160deg;
        }
      }
    }

    .bg3 {
      animation: bg-three 7s ease-in-out alternate infinite;
      transform-origin: center;

      @keyframes bg-three {
        to {
          translate: -100px -100px;
        }
      }
    }
  }
}
</style>
