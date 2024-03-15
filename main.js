Vue.createApp({
    created() {
        this.readPlantsFromLocalStorage();

        // Anropar updateWaterStatus, ändra denna till önskad interval för tid, just nu 10 sekunders testtid
        setInterval(() => {
            this.updateWaterStatus();
        }, 1000); 
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
            index: 0
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
            
            this.myPlants.push({
                index: this.index,
                commonName: plant.commonName,
                scientificName: plant.scientificName,
                wateringSchedule: plant.wateringSchedule,
                sunlightRequirement: plant.sunlightRequirement,
                poisonous: plant.poisonous,
                needsWater: plant.needsWater,
                lastWateredTime: 0
            });

            this.plantInfoVisible[this.index] = false;

            this.updateLocalStorage();

            this.index++;
            this.searchedPlant = false;
        },

        removePlant(myPlant) {
            const removeIndex = this.myPlants.indexOf(myPlant);
            if (removeIndex !== -1) {
                this.myPlants.splice(removeIndex, 1);
            }

            this.updateLocalStorage();
        },

        //LocalStorage:
        saveMyPlantsToLocalStorage() {
            let myPlantsJson = JSON.stringify(this.myPlants);

            localStorage.setItem('myPlantsData', myPlantsJson);
        },

        updateLocalStorage() {
            this.saveMyPlantsToLocalStorage();
        },

        readPlantsFromLocalStorage() {
            let myPlantsJson = localStorage.getItem('myPlantsData');
            if (myPlantsJson) {
                this.myPlants = JSON.parse(myPlantsJson);
            }
        },

        plantInformation() {
            if (this.selectedPlant) {
                console.log('Selected Plant:', this.selectedPlant);
                this.myPlants.push({
                    commonName: this.selectedPlant.commonName,
                    wateringSchedule: this.selectedPlant.wateringSchedule,
                    sunlight: this.selectedPlant.sunlightRequirement,
                    poisonous: this.selectedPlant.poisonous,
                    needsWater: this.selectedPlant.needsWater
                });
            }
        },

        clearSearchResults() {
            this.jsonData = { housePlants: [] };
            this.searchedPlant = false;
        },

        togglePlantInfo(myPlant) {

            let plantIndex= myPlant.index;

            if (this.plantInfoVisible.hasOwnProperty(plantIndex)) {
                this.plantInfoVisible[plantIndex] = !this.plantInfoVisible[plantIndex];
            } else {
                this.plantInfoVisible[plantIndex] = true;
            }

            if (this.plantInfoVisible[plantIndex]) {
                this.plantInformation();
            }
        },

        waterPlant(myPlant) {
            console.log("Water", myPlant);
            myPlant.lastWateredTime = new Date().getTime();
            myPlant.needsWater = false;

            if (this.plantInfoVisible[myPlant.index]) {
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
