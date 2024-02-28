Vue.createApp({
    data() {
        return {
            apiKey: 'sk-wAgc65ddf32d6d2a14379',
            // ... andra data-egenskaper ...
        };
    },
    methods: {
        fetchData() {
            // Använd Axios för att göra API-anrop
            axios.get('https://perenual.com/api/species-list?key=sk-wAgc65ddf32d6d2a14379', {
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey,
                    // ... andra headers om det behövs ...
                },
            })
            .then(response => {
                // Hantera API-svar här
                console.log(response.data);
            })
            .catch(error => {
                // Hantera fel här
                console.error(error);
            });
        },
        // ... andra metoder ...
    },
}).mount('#app');
