<template>
  <li class="dropdown nav-item"
      :is="tag"
      :class="{show: isOpen}"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggleDropDown"
      v-click-outside="closeDropDown">

    <a class="nav-link dropdown-toggle"
       data-toggle="dropdown">
      <slot name="title">
        <i :class="icon"></i>
        <span class="no-icon">{{title}}</span>
        <b class="caret"></b>
      </slot>
    </a>
    <div class="dropdown-menu show" v-show="isOpen">
      <slot></slot>
      <a class="dropdown-item" href="#" v-for="item in items" :key="item" @click.prevent="itemSelected(item)">
        {{ item }}
      </a>
    </div>
  </li>
</template>
<script>
export default {
  name: 'base-dropdown',
  props: {
    icon: String,
    tag: {
      type: String,
      default: 'li'
    },
    items: Array // 드롭다운에 표시할 항목들
  },
  data() {
    return {
      isOpen: false,
      title: this.initialTitle, // 초기 타이틀 설정
    }
  },
  methods: {
    itemSelected(item) {
  this.title = item; // 타이틀 업데이트
  this.closeDropDown(); // 드롭다운 닫기
  this.$emit('item-selected', item); // 부모 컴포넌트로 선택된 항목 알리기
},
    toggleDropDown() {
      this.isOpen = !this.isOpen
      this.$emit('change', this.isOpen)
    },
    closeDropDown() {
      this.isOpen = false
      this.$emit('change', this.isOpen)
    }
  }
}
</script>
<style scoped>
.dropdown .dropdown-toggle {
  cursor: pointer;
}

li {
  list-style-type: none;
}
</style>
