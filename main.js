Vue.createApp({
    data() {
        return {
            apiKey: 'sk-wAgc65ddf32d6d2a14379',
            page: 1,
            searchQuery: '',
            order: 'asc',
            isPoisonous: null,
            cycle: '',
            watering: '',
            sunlight: '',
            speciesData: [], // Sparar resultaten från API-et i en array
            filterMode: 'all', // för att hantera filteralternativen
        };
    },
    methods: {
        fetchData() {
            // Skapa ett objekt med parametrarna för API-anropet
            const params = {
                key: this.apiKey,
                page: this.page,
                q: this.searchQuery,
                order: this.order,
                poisonous: this.isPoisonous,
                cycle: this.cycle,
                watering: this.watering,
                sunlight: this.sunlight,
            };

            // Använd Axios för att göra API-anrop
            axios.get('https://perenual.com/api/species-list', {
                params: params,
            })
            .then(response => {
                // Hantera API-svar och skriv resultaten till konsolen
                this.speciesData = response.data; // Spara resultaten i speciesData
                console.log(this.speciesData);
            })
            .catch(error => {
                // Hantera fel här
                console.error(error);
            });
        },
    },
}).mount('#app');