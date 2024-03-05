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
            plantInfoVisible: {},
            filter: 'all'

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
        addPlantToMyPlants(plant) {
            this.myPlants.push({
                commonName: plant.commonName,
                scientificName: plant.scientificName,
                wateringSchedule: plant.wateringSchedule,
                sunlightRequirement: plant.sunlightRequirement,
                poisonous: plant.poisonous,
                needsWater: plant.needsWater
            });
        
            // Lägg till informationen i plantInfoVisible när du lägger till planten
            //this.$set(this.plantInfoVisible, plant.commonName, false); // Ersätt med direkt tilldelning
            this.plantInfoVisible[plant.commonName] = false;
        },        

        removePlant(myPlant) {
            const index = this.myPlants.indexOf(myPlant);
            if (index !== -1) {
                this.myPlants.splice(index, 1);
            }
        },

        plantInformation(){
            if (this.selectedPlant) {
                console.log('Selected Plant:', this.selectedPlant);
                this.myPlants.push({
                    commonName: this.selectedPlant.commonName,
                    wateringSchedule: this.selectedPlant.wateringSchedule,
                    sunlight: this.selectedPlant.sunlightRequirement, 
                    poisonous: this.selectedPlant.poisonous,
                    // Lägg till andra relevanta attribut från selectedPlant
                });
            }
        },
        

        togglePlantInfo(myPlant) {
            // Användaren klickar för att toggla informationen för den valda växten
            if (this.plantInfoVisible.hasOwnProperty(myPlant.commonName)) {
                this.plantInfoVisible[myPlant.commonName] = !this.plantInfoVisible[myPlant.commonName];
            } else {
                this.plantInfoVisible[myPlant.commonName] = true;
            }
        
            // Uppdatera information om den valda växten när du visar informationen
            if (this.plantInfoVisible[myPlant.commonName]) {
                this.plantInformation();
            }
        },
        
        

        orderPlants(){
            //By name, requirements, room?
        },

         //Counting stuff
        countMyPlants(){
            return this.myPlants.length;
        },

        countPlantsThatNeedWater(){

        },

        //Filter functions
        filterWatered() {
            return this.myPlants.filter(p => p.needsWater === false);
        },
        filterNeedsWater() {
            return this.myPlants.filter(p => p.needsWater === true);
        },
        filterPlants() {
            if (this.filter === 'watered') {
                return this.filterWatered();
            } else if (this.filter === 'needsWater') {
                return this.filterNeedsWater();
            } else {
                return this.myPlants;
            }
        },
    },

}).mount('#app');
