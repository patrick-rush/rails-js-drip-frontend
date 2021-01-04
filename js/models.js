class Plant {
    constructor(attributes) {
        let whitelist = ["id", "name", "species", "location", "watering_frequency", "fertalizating_frequency", "user_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }

    static rightContainer() {
        return this.c ||= document.querySelector("#rightContainer");
    }

    static leftContainer() {
        return this.l ||= document.querySelector("#plants");
    }

    static all() {
        return fetch("http://localhost:3000/plants", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if(res.ok) {
                return res.json()
                } else {
                return res.text().then(error => Promise.reject(error));
                }
            })
            .then(plantArray => {
                this.collection = plantArray.map(attrs => new Plant(attrs));
                let renderedPlants = this.collection.map(plant => plant.render());
                this.leftContainer().append(...renderedPlants);
                return this.collection
            })
    }

    static new() {
        console.log("got to new plant");
        let header = this.rightContainer().querySelector(".header");
        let title = header.querySelector(".title");
        let body = this.rightContainer().querySelector(".body");
        title.innerText = "Create a New Plant";

        let plantForm = this.rightContainer().querySelector("#newPlant");
        body.classList.add("hidden");
        plantForm.classList.remove("hidden");        
    }

    static create(formData) {
        console.log(formData);
        return fetch("http://localhost:3000/plants", {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({plant: formData})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error))
                }
            })
            .then(plantAttributes => {
                let plant = new Plant(plantAttributes);
                this.collection.push(plant);
                this.rightContainer().querySelector(".body").classList.remove("hidden");
                this.rightContainer().querySelector("#newPlant").classList.add("hidden");
                this.rightContainer().querySelector(".title").textContent = plant.name;
                this.rightContainer().querySelector(".location").textContent = plant.location;
                this.rightContainer().querySelector(".watering_frequency").textContent = plant.watering_frequency;
                this.leftContainer().append(plant.render())
                new FlashMessage({type: 'success', message: 'New plant added successfully'})
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }


    renderPlant() {
        // START HERE - MAKE THIS RENDER A PLANT'S INFO AND ALSO TOGGLE HIDDEN ON FORM 
        // this.element ||= document.createElement('div');
        
        // this.header ||= document.createElement('div');
        // this.header.classList.add(..."header px-4 py-5 sm:px-6".split(" "));
        
        // this.h ||= document.createElement('h3');
        // this.h.classList.add(..."title text-lg leading-6 font-medium text-gray-900".split(" "));
        // this.h.innerText = this.name;
        
        // this.header.append(this.h);

        // this.element.append(this.header);
        
        document.querySelector("#rightContainer").querySelector(".title").textContent = this.name;
        return this.element;
    }

    render() {
        this.element ||= document.createElement('div');
        this.element.classList.add(..."bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6".split(" "));

        this.nameLink ||= document.createElement('a');
        this.nameLink.href = "#"
        this.nameLink.classList.add(..."text-sm font-medium text-gray-500".split(" "));
        this.nameLink.textContent = this.name;

        this.element.append(this.nameLink);

        return this.element
    }
}

class CareEvent {
    constructor(attributes) {
        let whitelist = ["id", "event_type", "due_date", "completed", "plant_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }
}

class FlashMessage {
    constructor({type, message}) {
        this.error = type === "error";
        this.message = message;
        this.render();
    }
    
    container() {
        return this.c ||= document.querySelector('#flash');
    }

    render() {
        this.container().textContent = this.message;
        this.toggleDisplay();
        setTimeout(() => this.toggleDisplay(), 5000); 
    }

    toggleDisplay() {
        console.log("we got to toggle display")
        this.container().classList.toggle('opacity-0');
        this.container().classList.toggle(this.error ? 'bg-red-200' : 'bg-gray-200');
    }
}