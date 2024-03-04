Vue.createApp({
    data() {
        return {
            plantName: '',
            jsonData: { housePlants: [] }, //Lagrar housePlants-datan i en lista
            selectedPlant: null, //Den valda plantan
            projectTitle: 'Plantify Project',
            subTitle: '🌿 Your plant\'s best friend 🌿',
            myPlants: [], //Här kan man lägga en array av sina egna plantor?
            totalAmmountOfPlants: 0,

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

                    let searchTerm = this.plantName.toLowerCase();
                    
                    let plantArray = this.jsonData.housePlants;
                    this.jsonData = plantArray.filter((plant) =>
                        plant.commonName.toLowerCase().includes(searchTerm) ||
                        plant.scientificName.toLowerCase().includes(searchTerm)
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

        addPlantToMyPlants() {
            if (this.selectedPlant) {
                this.myPlants.push({
                    commonName: this.selectedPlant.commonName,
                    // Lägg till andra relevanta attribut från selectedPlant
                });
            }            
            // on click, add to array
            // Ska man kunna lägga till samma planta flera gånger?
        },

        removePlant(myPlant) {
            const index = this.myPlants.indexOf(myPlant);
            if (index !== -1) {
                this.myPlants.splice(index, 1);
            }
        },

        plantInformation(plant){
            if (this.selectedPlant) {
                this.myPlants.push({
                    wateringSchedule: this.selectedPlant.wateringSchedule,
                    sunlight: this.selectedPlant.sunlightRequirement, 
                    poisonous: this.selectedPlant.poisonous,
                    // Lägg till andra relevanta attribut från selectedPlant
                });
            }
        },

        orderPlants(){
            //By name, requirements, room?
        },

        countMyPlants(){
            return this.myPlants.length;
        },

        filterPlants(){

        },

    },

}).mount('#app');
