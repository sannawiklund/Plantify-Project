Vue.createApp({
    created() {
        //created körs när appen "skapas", antingen vid refresh eller när man startar upp webläsaren.
        //Läser ago in från localStorage om något finns sparat där. Coolt :D
        this.readPlantsFromLocalStorage();

        // Anropar updateWaterStatus varje minut (60 000 millisekunder)
        setInterval(() => {
            this.updateWaterStatus();
        }, 1000); //Ändra denna till önskad interval för tid, just nu 10 sekunders testtid
    },
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
            filter: 'all',
            searchedPlant: '',
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
            this.plantName = '';
            this.searchedPlant = true;
        },

        selectPlant(plant) {
            // Uppdatera selectedPlant med den valda växten
            this.selectedPlant = plant;
        },

        addPlantToMyPlants(plant) {
            console.log(plant);
            this.myPlants.push({
                commonName: plant.commonName,
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

            //Uppdaterar localStorage
            this.updateLocalStorage();

            //Tar bort sökresultatet efter att användaren lagt till plantan i sin lista
            this.searchedPlant = false;

        },

        removePlant(myPlant) {
            const index = this.myPlants.indexOf(myPlant);
            if (index !== -1) {
                this.myPlants.splice(index, 1);
            }

            //Uppdaterar localStorage
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
                    // Lägg till andra relevanta attribut från selectedPlant
                });
            }
        },

        clearSearchResults() {
            this.jsonData = { housePlants: [] };
            this.searchedPlant = false;
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

        //Counting stuff
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
