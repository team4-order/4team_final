<template>
  <div>
    <input v-model="question" placeholder="Ask a question about fruit distribution">
    <button @click="askQuestion">Ask</button>
    <p>Answer: {{ answer }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      question: '',
      answer: ''
    };
  },
  methods: {
    async askQuestion() {
      try {
        const response = await axios.post('http://localhost:8080/api/ask', this.question);
        this.answer = response.data;
      } catch (error) {
        console.error('Error asking question:', error);
        this.answer = 'Failed to get an answer.';
      }
    }
  }
}
</script>
