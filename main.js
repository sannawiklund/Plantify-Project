Vue.createApp({
    data() {
      return {
        jsonData: [],
      };
    },

    methods: {
      async fetchJson() {
        try {
          let response = await fetch('data.json');
          if (!response.ok) {
            throw new Error('Something went wrong');
          }
          this.jsonData = await response.json();
          console.log('Hämtad data:', this.jsonData);
        } catch (error) {
          console.error('Fel:', error.message);
        }
      },
    },
    mounted() {
      this.fetchJson();
    },

    computed: {},
  }).mount('#app');