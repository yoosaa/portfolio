<template>
  <ul id="cards">
    <li class="card">
      <a href="https://www.nhk.or.jp/senkyo/" class="card-image" target="_blank">
        <figure>
          <img src="http://www.nhk.or.jp/senkyo/images/ogimage.png" alt="site-image">
        </figure>
      </a>
      <a href="https://www.nhk.or.jp/senkyo/" class="results-lists__links card-text" target="_blank">NHK選挙WEB</a>
    </li>
    <li class="card">
      <a href="https://www3.nhk.or.jp/news/special/athlete-words/" class="card-image" target="_blank">
        <figure>
          <img src="https://www3.nhk.or.jp/news/special/athlete-words/images/og_image.jpg" alt="site-image">
        </figure>
      </a>
      <a href="https://www3.nhk.or.jp/news/special/athlete-words/" class="results-lists__links card-text" target="_blank">アスリート×ことば</a>
    </li>
    <li class="card">
      <a href="http://littlesetouchi.jp" class="card-image" target="_blank">
        <figure>
          <img src="http://littlesetouchi.jp/images/og_img.png" alt="site-image">
        </figure>
      </a>
      <a href="http://littlesetouchi.jp" class="results-lists__links card-text" target="_blank">LittleSetouchi</a>
    </li>
  </ul>
</template>

<style lang="scss">
.card {
  margin-top: 24px;
  &-image {
    aspect-ratio: 16 / 9;
    display: flex;
    overflow: hidden;
    align-items: center;
  }
}
@media screen and (min-width: 768px) {
  #cards {
    display: flex;
    flex: 1fr 1fr 1fr;
    margin-left: -16px;
  }
  .card {
    margin-top: 0;
    margin-left: 16px;
    &-text {
      margin-top: 32px;
    }
  }
}
</style>
