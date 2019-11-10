<template>
  <div>
    <div class="container">
      <div class="field-container">
        <input
          class="left-rounded"
          type="text"
          placeholder="Paste link here"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :disabled="false"
        />
        <button class="right-rounded" :disabled="false">GET LINK</button>
      </div>
      <div class="field-container" v-if="true">
        <input
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :disabled="true"
        />
        <button class="copybtn">
          <img src="../assets/copyicon.svg" alt srcset />
        </button>
      </div>
      <div class="extras-container" v-if="false">
        <button>SUBSCRIBE</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style lang="scss">
.field-container {
  display: grid;
  grid-template-columns: 5fr auto;
  gap: 0;
}

.copyicon {
}
</style>