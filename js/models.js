class Page {
    static leftContainer() {
        return this.l ||= document.querySelector("#leftContainer");
    }

    static rightContainer() {
        return this.c ||= document.querySelector("#rightContainer");
    }

    static nav() {
        return this.n ||= document.querySelector("#nav");
    }
}

class Plant {
    constructor(attributes) {
        let whitelist = ["id", "name", "species", "location", "watering_frequency", "fertalizating_frequency", "user_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
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
                this.collection ||= plantArray.map(attrs => new Plant(attrs));
                let renderedPlants = this.collection.map(plant => plant.render());
                Page.leftContainer().querySelector(".body").innerHTML = "";
                Page.leftContainer().querySelector(".header").innerText = "Plants";
                Page.leftContainer().querySelector(".body").append(...renderedPlants);
                return this.collection
            })
    }

    static show(targetId) {
        let plant = this.collection.find(plant => plant["id"] == targetId);
        plant.renderPlant()
    }

    static new() {
        console.log("got to new plant");
        let header = Page.rightContainer().querySelector(".header");
        let title = header.querySelector(".title");
        let body = Page.rightContainer().querySelector(".body");
        title.innerText = "Create a New Plant";

        let plantForm = Page.rightContainer().querySelector("#newPlant");
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
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(plantAttributes => {
                let plant = new Plant(plantAttributes);
                this.collection.push(plant);
                Page.rightContainer().querySelector(".body").classList.remove("hidden");
                Page.rightContainer().querySelector("#newPlant").classList.add("hidden");
                Page.rightContainer().querySelector(".title").textContent = plant.name;
                Page.rightContainer().querySelector(".location").textContent = plant.location;
                Page.rightContainer().querySelector(".watering_frequency").textContent = plant.watering_frequency;
                Page.leftContainer().append(plant.render());
                CareEvent.create({plant_id: plant.id, event_type: "water", due_date: new Date().toLocaleDateString()})
                new FlashMessage({type: 'success', message: 'New plant added successfully'});
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    static increaseDays(id) {
        let plant = this.collection.find(plant => plant["id"] == id);
        let days = plant.watering_frequency.split(" ")[0];
        let newWateringFrequency = parseInt(days) + 1 + " days";
        plant.watering_frequency = newWateringFrequency;
        // this = Plant above
        return fetch(`http://localhost:3000/plants/${id}`, {
            method: "PATCH",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({plant: {watering_frequency: newWateringFrequency}})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(plant => {
                console.log(plant)
                Page.rightContainer().querySelector(".watering_frequency").textContent = plant.watering_frequency;
                
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }
    // above and below can be refactored into one method
    static decreaseDays(id) {
        let plant = this.collection.find(plant => plant["id"] == id);
        console.log(plant)
        let days = plant.watering_frequency.split(" ")[0]
        let newWateringFrequency = parseInt(days) - 1 + " days";
        plant.watering_frequency = newWateringFrequency;
        // this = Plant above
        return fetch(`http://localhost:3000/plants/${id}`, {
            method: "PATCH",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({plant: {watering_frequency: newWateringFrequency}})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(plant => {
                console.log(plant)
                Page.rightContainer().querySelector(".watering_frequency").textContent = plant.watering_frequency;
                
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    static edit() {

    }

    static update() {

    }

    static destroy() {

    }


    renderPlant() {
        Page.rightContainer().querySelector(".body").classList.remove("hidden");
        Page.rightContainer().querySelector("#newPlant").classList.add("hidden");

        Page.rightContainer().querySelector(".increaseDays").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".decreaseDays").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".title").textContent = this.name;
        Page.rightContainer().querySelector(".location").textContent = this.location;
        Page.rightContainer().querySelector(".watering_frequency").textContent = this.watering_frequency;
        // Will need to render notes and care events here as well
        return this.element;
    }

    render() {
        this.element ||= document.createElement('div');
        this.element.classList.add(..."bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6".split(" "));

        this.nameLink ||= document.createElement('a');
        this.nameLink.href = "#"
        this.nameLink.classList.add(..."text-sm font-medium text-gray-500 selectPlant".split(" "));
        this.nameLink.textContent = this.name;
        this.nameLink.dataset.plantId = this.id;

        this.element.append(this.nameLink);

        return this.element
    }
}


class CareEvent {
    constructor(attributes) {
        let whitelist = ["id", "event_type", "due_date", "completed", "plant_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }

    static today() {
        return fetch("http://localhost:3000/care_events/today", {
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
            .then(careEventArray => {
                // debugger
                this.collection ||= careEventArray.map(attrs => new CareEvent(attrs));
                let renderedCareEvents = this.collection.map(careEvent => careEvent.render());
                Page.leftContainer().querySelector(".body").innerHTML = "";
                Page.leftContainer().querySelector(".header").innerText = "Today's Care Events";
                Page.leftContainer().querySelector(".body").append(...renderedCareEvents);
                return this.collection;
            })
    }

    render() { 
        // debugger
        this.element ||= document.createElement('div');
        this.element.classList.add(..."bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6".split(" "));

        this.eventNameLink ||= document.createElement('a');
        this.eventNameLink.href = "#"
        this.eventNameLink.classList.add(..."text-sm font-medium text-gray-500 selectEvent".split(" "));
        this.eventNameLink.textContent = `${this.event_type} ${this.plantName()}`;
        this.eventNameLink.dataset.careEventId = this.id;

        this.element.append(this.eventNameLink);

        return this.element;
    }

    plantName() {
        return Plant.collection.find(plant => plant["id"] == this.plant_id).name;
    }

    static new() {

    }

    static create(attrs) {
        return fetch("http://localhost:3000/care_events", {
            method: 'POST',
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"    
            },
            body: JSON.stringify({care_event: attrs})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(careEventAttributes => {
                this.collection ||= [];
                let careEvent = new CareEvent(careEventAttributes);
                this.collection.push(careEvent);
            })
    }

    static edit() {

    }

    static update() {

    }

    static destroy() {

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

// look up moment js
// handle care events today of server side 

// plant search for live coding

// you need precision  

// you to me course