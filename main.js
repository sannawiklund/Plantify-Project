Vue.createApp({
    created() {
        //created körs när appen "skapas", antingen vid refresh eller när man startar upp webläsaren.
        //Läser in från localStorage om något finns sparat där. 
        this.readPlantsFromLocalStorage();

        // Anropar updateWaterStatus varje minut (60 000 millisekunder)
        setInterval(() => {
            this.updateWaterStatus();
        }, 1000); //Ändra denna till önskad interval för tid, just nu 10 sekunders testtid
    },
    data() {
        return {
            plantName: '',
            jsonData: { housePlants: [] },
            selectedPlant: null, 
            projectTitle: 'Plantify Project',
            subTitle: '🌿 Your plant\'s best friend 🌿',
            myPlants: [], 
            totalAmmountOfPlants: 0,
            plantInfoVisible: {},
            filter: 'all',
            searchedPlant: '',
        };
    },
    methods: {
        async fetchJson() {
            try {
                const response = await fetch('data.json');

                if (response.ok) {
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
            this.plantName = '';
            this.searchedPlant = true;
        },

        selectPlant(plant) {
            // Uppdatera selectedPlant med den valda växten
            this.selectedPlant = plant;
        },

        addPlantToMyPlants(plant) {
            console.log(plant);

            let existingPlant = this.myPlants.filter(p => p.commonName.startsWith(plant.commonName));
            let usedNumbers = existingPlant.map(p => {
                const suffix = p.commonName.slice(plant.commonName.length - 1);
                return parseInt(suffix);
            });

            let plantNumber = 1;
            while (usedNumbers.includes(plantNumber)) {
                plantNumber++;
            }

            this.myPlants.push({
                commonName: plantNumber > 1 ? plant.commonName + ' ' + plantNumber : plant.commonName, // lägger till ett nummer om det finns mer än en växt
                scientificName: plant.scientificName,
                wateringSchedule: plant.wateringSchedule,
                sunlightRequirement: plant.sunlightRequirement,
                poisonous: plant.poisonous,
                needsWater: plant.needsWater,
                lastWateredTime: 0
            });

            // Lägg till informationen i plantInfoVisible när du lägger till planten
            //this.$set(this.plantInfoVisible, plant.commonName, false); // Ersätt med direkt tilldelning
            this.plantInfoVisible[plant.commonName] = false;

            this.updateLocalStorage();

            //Tar bort sökresultatet efter att användaren lagt till plantan i sin lista
            this.searchedPlant = false;

        },

        removePlant(myPlant) {
            const index = this.myPlants.indexOf(myPlant);
            if (index !== -1) {
                this.myPlants.splice(index, 1);
            }

            this.updateLocalStorage();
        },

        //LocalStorage:
        saveMyPlantsToLocalStorage() {
            //Konverterar myPlants arrayen till en json-stäng för att lagra all data.
            let myPlantsJson = JSON.stringify(this.myPlants);

            //SetItem sparar datan under nyckeln 'myPlantsData'
            localStorage.setItem('myPlantsData', myPlantsJson);
        },

        // Kallas på för att hålla localStorage up to date
        updateLocalStorage() {
            this.saveMyPlantsToLocalStorage();
        },

        readPlantsFromLocalStorage() {
            let myPlantsJson = localStorage.getItem('myPlantsData');
            if (myPlantsJson) {
                // Om det finns sparade plantor, konvertera från JSON och uppdatera myPlants
                this.myPlants = JSON.parse(myPlantsJson);
            }
        },

        //Information
        plantInformation() {
            if (this.selectedPlant) {
                console.log('Selected Plant:', this.selectedPlant);
                this.myPlants.push({
                    commonName: this.selectedPlant.commonName,
                    wateringSchedule: this.selectedPlant.wateringSchedule,
                    sunlight: this.selectedPlant.sunlightRequirement,
                    poisonous: this.selectedPlant.poisonous,
                    needsWater: this.selectedPlant.needsWater,
                });
            }
        },

        clearSearchResults() {
            this.jsonData = { housePlants: [] };
            this.searchedPlant = false;
        },

        togglePlantInfo(myPlant) {
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

        waterPlant(myPlant) {
            console.log("Water", myPlant);
            myPlant.lastWateredTime = new Date().getTime();
            myPlant.needsWater = false;

            // Uppdatera information om den valda växten när du ändrar vattenbehovet
            if (this.plantInfoVisible[myPlant.commonName]) {
                this.plantInformation();
            }
        },

        updateWaterStatus() {
            const currentTime = new Date().getTime();

            this.myPlants.forEach(myPlant => {
                // Sekunder sedan plantan vattnades sist   
                const diff = (currentTime - myPlant.lastWateredTime) / 1000;
                if (diff > 10) { //Ändra denna till önskad interval för tid, just nu 10 sekunders testtid
                    myPlant.needsWater = true;
                }
            });
            
            this.saveMyPlantsToLocalStorage();
        },

        convertTimestamp(time) {
            const currentTime = new Date().getTime();
            // Sekunder sedan plantan vattnades
            const diff = (currentTime - time) / 1000;
            
            if (time == 0) {
                // Specialfall, aldrig vattnad
                return "Never watered";
            }
            else if (diff > (60*60*24)) {
                // Visa i dagar
                const days = Math.round(diff/(60*60*24));
                return "About " + days + " days ago";
            }
            else if (diff > (60*60)) {
                // Visa i timmar
                const hours = Math.round(diff/(60*60));
                return "About " + hours + " hours ago";
            }
            else if (diff > 60) {
                // Visa i minuter
                const minutes = Math.round(diff/60);
                return "About " + minutes + " minutes ago";
            }
            else {
                // Visa i sekunder
                const seconds = Math.round(diff);
                return "About " + seconds + " seconds ago";
            }
        },

        //Counting functions
        countMyPlants() {
            return this.myPlants.length;
        },

        countPlantsThatNeedWater() {
            return this.myPlants.filter(p => p.needsWater === true).length;
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
