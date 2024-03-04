Vue.createApp({
    data() {
        return {
            plantName: '',
            jsonData: { housePlants: [] }, //Lagrar housePlants-datan i en lista
            selectedPlant: null, //Den valda plantan
            projectTitle: 'Plantify Project',
            subTitle: '🌿 Your plant\'s best friend 🌿',
            myPlants: [], //Här kan man lägga en array av sina egna plantor?
        };
    },
    methods: {
        async fetchJson() {
            try {
                // Fetchar datan från json-filen
                const response = await fetch('data.json');

                // Kontrollera att fetch gått igenom (status 200)
                if (response.ok) {
                    // Parsa JSON och uppdatera jsonData med den hämtade datan
                    this.jsonData = await response.json();
                    let plantArray = this.jsonData.housePlants;
                    this.jsonData = plantArray.filter((plant) =>
                        plant.commonName.includes(this.plantName) ||
                        plant.scientificName.includes(this.plantName)
                    );
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            // Återställ selectedPlant när ny sökning görs
            this.selectedPlant = null;
        },
        selectPlant(plant) {
            // Uppdatera selectedPlant med den valda växten
            this.selectedPlant = plant;
        },

        addPlantToMyPlants(){
            //on click, add to array
            //Ska man kunna lägga till samma planta flera gånger?
        },

        removePlant(){
            //on click, remove plant from array
        },

        orderPlants(){
            //By name, requirements, room?
        },

        countMyPlants(){

        },

        filterPlants(){

        },

        
    },
}).mount('#app');
