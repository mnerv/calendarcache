<template>
  <div id="app">
    <div class="header">
      <h1>./icalsub</h1>
    </div>
    <MainPage />
    <FooterComponent />
  </div>
</template>

<script>
import MainPage from './components/MainPage'
import FooterComponent from './components/FooterComponent'

export default {
  name: 'app',
  components: {
    MainPage,
    FooterComponent
  }
}
</script>

<style lang="scss" src="./styles/style.scss"/>

