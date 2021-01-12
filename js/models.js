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

    static formContainer() {
        return this.f ||= document.querySelector("#newPlant");
    }

    static welcome() {
        return this.w ||= document.querySelector(".welcome");
    }

    static showWelcome() {
        Page.rightContainer().querySelector(".title").innerHTML = "<br>";
        Page.rightContainer().querySelector(".body").classList.add("hidden");
        Page.rightContainer().querySelector(".careEventBody").classList.add("hidden");
        Page.welcome().style.display = "block";
        Page.formContainer().classList.add("hidden");
    }

    static hideWelcome() {
        // setTimeout(() => (document.querySelector("main").classList.add("hidden")), 3000); 
        Page.welcome().style.display = "none";
        // welcome.classList.add(..."transition duration-500 ease-in-out".split(" "));

    }

    static setFocus(klass) {
        const klasses = [".showPlants", ".showToday", ".showNewPlant"];
        const klassIndex = klasses.indexOf(klass);
        klasses.splice(klassIndex, 1);
        const [a, b] = klasses; 
        Page.nav().querySelector(a).classList.remove(..."bg-green-900 text-white".split(" "));
        Page.nav().querySelector(a).classList.add("text-green-100");
        Page.nav().querySelector(b).classList.remove(..."bg-green-900 text-white".split(" "));
        Page.nav().querySelector(b).classList.add("text-green-100");
        Page.nav().querySelector(klass).classList.add(..."bg-green-900 text-white".split(" "));
    }

    static resetForm() {
        let plantForm = Page.formContainer();
        // plantForm.id = "newPlant";
        
        let submit = plantForm.querySelector(".submit");
        
        plantForm.reset();
        submit.innerText = "Save"
    }

}

class Plant {
    constructor(attributes) {
        let whitelist = ["id", "name", "species", "location", "watering_frequency", "fertalizating_frequency", "user_id", "active"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
        if(this.active) { Plant.active = this; }
    }

    static findById(id) {
        return this.collection.find(plant => plant.id == id)
    }

    static all() {
        Page.showWelcome();
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

    show() {
        this.toggleActive();
        this.renderPlant();
    }

    static new() {
        console.log("got to new plant");
        let header = Page.rightContainer().querySelector(".header");
        let title = header.querySelector(".title");
        let body = Page.rightContainer().querySelector(".body");
        let careEventBody = Page.rightContainer().querySelector('.careEventBody');
        title.innerText = "Create a New Plant";

        let plantForm = Page.formContainer();
        body.classList.add("hidden");
        careEventBody.classList.add("hidden");
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
                plant.renderPlant();
                Page.leftContainer().append(plant.render());
                CareEvent.create({plant_id: plant.id, event_type: "Water", due_date: new Date().toLocaleDateString()})
                new FlashMessage({type: 'success', message: 'New plant added successfully'});
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    changeDays(plusOrMinus) {
        // let days = this.watering_frequency.split(" ")[0]
        if (plusOrMinus === "+") {
            // let newWateringFrequency = parseInt(days) + 1 + " days";
            let newWateringFrequency = this.watering_frequency + 1;
            this.watering_frequency = newWateringFrequency;
        } else if (plusOrMinus === "-") {
            // let newWateringFrequency = parseInt(days) - 1 + " days";
            let newWateringFrequency = this.watering_frequency - 1;
            this.watering_frequency = newWateringFrequency;
        }
        return fetch(`http://localhost:3000/plants/${this.id}`, {
            method: "PATCH",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({plant: {watering_frequency: this.watering_frequency}})
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
                Page.rightContainer().querySelector(".watering_frequency").textContent = plant.watering_frequency + " days";
                Page.rightContainer().querySelector(".careEventBody").querySelector(".watering_frequency").textContent = plant.watering_frequency + " days";
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    edit() {
        console.log("got to edit plant");
        let header = Page.rightContainer().querySelector(".header");
        let title = header.querySelector(".title");
        let body = Page.rightContainer().querySelector(".body");
        title.innerText = `Edit ${this.name}`;

        let plantForm = Page.formContainer();
        body.classList.add("hidden");
        plantForm.classList.remove("hidden");
        
        let name = plantForm.querySelector(".name");
        let species = plantForm.querySelector(".species");
        let location = plantForm.querySelector(".location");
        let submit = plantForm.querySelector(".submit");
        let watering_frequency = plantForm.querySelector(".watering_frequency");
        
        name.value = this.name;
        species.value = this.species;
        location.value = this.location;
        watering_frequency.value = this.watering_frequency;
        submit.innerText = "Update";
        plantForm.dataset.plantId = this.id;
        plantForm.id = "updatePlant"
    }

    update(formData) {
        let plantForm = Page.formContainer();

        return fetch(`http://localhost:3000/plants/${this.id}`, {
            method: "PUT",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({plant: formData})
        })
            .then(res => {
                if(res.ok) {
                return res.json()
                } else {
                return res.text().then(error => Promise.reject(error));
                }
            })
            .then(json => {
                Object.keys(json).forEach((key) => this[key] = json[key])
                Page.resetForm();
                plantForm.id = "newPlant";

                this.render();
                this.renderPlant();
                new FlashMessage({type: 'success', message: 'Plant updated successfully'});
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
    }

    destroy() {
        let proceed = confirm("Are you sure you want to delete this plant?");
        if(proceed) {
            return fetch(`http://localhost:3000/plants/${this.id}`, {
                method: 'DELETE'
            })
                .then(json => {
                    let index = Plant.collection.findIndex(plant => plant.id == json.id);
                    Plant.collection.splice(index, 1);
                    this.element.remove();
                    new FlashMessage({type: 'success', message: 'Plant successfully deleted'})
                    Page.showWelcome();
                })
        }
    }

    renderPlant() {
        Page.rightContainer().querySelector(".body").classList.remove("hidden");
        Page.formContainer().classList.add("hidden");

        Page.rightContainer().querySelector(".increaseDays").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".decreaseDays").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".editPlant").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".deletePlant").dataset.plantId = this.id;
        Page.rightContainer().querySelector(".title").textContent = this.name + " the " + this.species;
        Page.rightContainer().querySelector(".location").textContent = this.location;
        Page.rightContainer().querySelector(".watering_frequency").textContent = this.watering_frequency + " days";
        // Will need to render notes and care events here as well
        // Page.rightContainer().querySelector(".notesContainer").append(...Note.allByPlantId(this.id));
        Page.rightContainer().querySelector(".addNoteIcon").dataset.plantId = this.id;
        let notes = Page.rightContainer().querySelectorAll(".newNote");
        notes.forEach((note) => {note.remove()})
        Note.allByPlantId(this.id);
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

    toggleActive() {
        if(Plant.active) {
            Plant.active.active = false;
        }
        Plant.active = this;
    }
}


class CareEvent {
    constructor(attributes) {
        let whitelist = ["id", "event_type", "due_date", "completed", "plant_id", "active"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
        if(this.active) { CareEvent.active = this; }
    }

    static findById(id) {
        return this.collection.find(careEvent => careEvent.id == id);
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

    show() {
        this.toggleActive();
        this.renderCareEvent();
    }

    overdue() {
        const dateFormat = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        return Boolean(new Date(this.due_date).toLocaleDateString('en-us', dateFormat) > new Date().toLocaleDateString('en-us', dateFormat));
    }

    render() { 
        // debugger
        this.element ||= document.createElement('div');
        this.element.classList.add(..."bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6".split(" "));

        this.eventNameLink ||= document.createElement('a');
        this.eventNameLink.href = "#"
        this.eventNameLink.classList.add(..."text-sm font-medium text-gray-500 selectEvent".split(" "));
        if (this.completed == true) {
            this.eventNameLink.classList.add("line-through");
            this.eventNameLink.classList.remove("text-yellow-500");
        } else if (this.completed == false) {
            this.eventNameLink.classList.remove("line-through");
            if (this.overdue()) {
                this.eventNameLink.classList.add("text-yellow-500");
            }
        }
        this.eventNameLink.textContent = `${this.event_type} ${this.plantName()}`;
        this.eventNameLink.dataset.careEventId = this.id;

        this.element.append(this.eventNameLink);

        return this.element;
    }

    renderCareEvent() {
        Page.rightContainer().querySelector(".body").classList.add("hidden");
        Page.formContainer().classList.add("hidden");
        Page.rightContainer().querySelector(".careEventBody").classList.remove("hidden");

        let plant = Plant.findById(this.plant_id);
        Page.rightContainer().querySelector(".careEventBody").querySelector(".increaseDays").dataset.plantId = plant.id;
        Page.rightContainer().querySelector(".careEventBody").querySelector(".decreaseDays").dataset.plantId = plant.id;
        Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").dataset.careEventId = this.id;
        if (this.completed == true) {
            Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").classList.add("text-green-500");
        } else if (this.completed == false) {
            Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").classList.remove("text-green-500");            
        }

        let date = new Date(this.due_date).toLocaleDateString(
            'en-us',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }
        );

        Page.rightContainer().querySelector(".title").textContent = `${this.event_type} ${plant.name} (Due ${date})`;
        if (this.overdue()) {
            Page.rightContainer().querySelector(".title").classList.remove("text-green-900");
            Page.rightContainer().querySelector(".title").classList.add("text-yellow-500");
        }
        Page.rightContainer().querySelector(".careEventBody").querySelector(".watering_frequency").textContent = plant.watering_frequency + " days";
        // Will need to render notes and care events here as well
        return this.element;
    }

    plantName() {
        return Plant.collection.find(plant => plant["id"] == this.plant_id).name;
    }

    // static new() {

    // }

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
                return careEvent;
            })
    }

    markCompleted() {
        return fetch(`http://localhost:3000/care_events/${this.id}`, {
            method: "PATCH",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({care_event: {completed: true}})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(json => {
                this.completed = json.completed
                Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").classList.add("text-green-500");

                this.render();
                return Plant.findById(this.plant_id)
            })
            .then(plant => {
                // "id", "event_type", "due_date", "completed", "plant_id", "active"
                return CareEvent.create({event_type: "Water", due_date: CareEvent.calculateDate(plant.watering_frequency), plant_id: plant.id});
            })
            .then(careEvent => {
                Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").dataset.nextCareEventId = careEvent.id;
                console.log("next care event id is ", careEvent.id)
            })
    }

    markNotCompleted() {
        return fetch(`http://localhost:3000/care_events/${this.id}`, {
            method: "PATCH",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({care_event: {completed: false}})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(json => {
                this.completed = json.completed
                Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").classList.remove("text-green-500");
                delete Page.rightContainer().querySelector(".careEventBody").querySelector(".completed").dataset.nextCareEventId;
                this.render();
            })
    }

    static calculateDate(frequency) {
        let date = new Date();
        date.setDate(date.getDate() + frequency);
        return date;
    }

    // static edit() {

    // }

    // static update() {

    // }

    destroy() {
        console.log(this)
        return fetch(`http://localhost:3000/care_events/${this.id}`, {
            method: 'DELETE'
        })
            .then(json => {
                let index = CareEvent.collection.findIndex(careEvent => careEvent.id == json.id);
                CareEvent.collection.splice(index, 1);
                // this.element.remove();
                // new FlashMessage({type: 'success', message: 'Plant successfully deleted'})
                // Page.showWelcome();
            })

    }

    toggleActive() {
        if(CareEvent.active) {
            CareEvent.active.active = false;
        }
        CareEvent.active = this;
    }

}

class Note {
    constructor(attributes) {
        let whitelist = ["id", "content", "plant_id", "created_at", "active"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
        if(this.active) { Note.active = this; }
    }

    static findById(id) {
        return Plant.active.noteCollection.find(note => note.id == id);
    }

    static allByPlantId(plantId) {
        return fetch(`http://localhost:3000/plants/${plantId}/notes`, {
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
            .then(noteArray => {
                let plant = Plant.findById(plantId);
                plant.noteCollection ||= noteArray.map(attrs => new Note(attrs));
                // this.collection ||= plantArray.map(attrs => new Plant(attrs));

                console.log(noteArray)
                // let notes = noteArray.map(attrs => new Note(attrs));
                let renderedNotes = plant.noteCollection.map(note => note.render());
                Page.rightContainer().querySelector(".notesContainer").append(...renderedNotes);

                return plant.noteCollection;
            })
    }

    static new() {
        let icon = document.querySelector(".notesContainer").querySelector('.addNoteIcon')
        icon.classList.remove(..."fa fa-plus addNoteIcon".split(" "));
        icon.classList.add(..."fa fa-minus removeForm".split(" "));

        this.form ||= document.createElement('form');
        this.form.classList.add(..."newNote bg-white shadow overflow-hidden sm:rounded-lg mt-5".split(" "));

        this.contentBox ||= document.createElement('div');
        this.contentBox.classList.add(..."col-span-6 sm:col-span-3".split(" "));

        this.label ||= document.createElement('label');

        this.textarea ||= document.createElement('textarea');
        this.textarea.name = "content";
        this.textarea.classList.add(..."p-2 location mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md".split(" "));
    
        this.contentBox.append(this.label, this.textarea);

        this.buttonContainer ||= document.createElement("div");
        this.buttonContainer.classList.add(..."px-4 py-3 bg-gray-50 text-right sm:px-6".split(" "));

        this.submitButton ||= document.createElement("button");
        this.submitButton.setAttribute("type", "submit");
        this.submitButton.id = "submitNote"
        this.submitButton.classList.add(..."inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500".split(" "));
        this.submitButton.innerText = "Save";
        
        this.buttonContainer.append(this.submitButton);

        this.form.append(this.contentBox, this.buttonContainer);

        let notesContainer = Page.rightContainer().querySelector(".notesContainer");
        notesContainer.insertBefore(this.form, notesContainer.children[1]);

        return this.form
    }

    static removeForm() {
        Page.rightContainer().querySelector(".notesContainer").querySelector('form').remove();
        
        let icon = document.querySelector(".notesContainer").querySelector('.removeForm');
        icon.classList.remove(..."fa fa-minus removeForm".split(" "));
        icon.classList.add(..."fa fa-plus addNoteIcon".split(" "));
    }

    static create(formData) {
        return fetch("http://localhost:3000/notes/", {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({note: formData})
        })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return res.text().then(error => Promise.reject(error));
                }
            })
            .then(noteAttributes => {
                let note = new Note(noteAttributes);
                let renderedNote = note.render();
                let notesContainer = Page.rightContainer().querySelector(".notesContainer");
                notesContainer.insertBefore(renderedNote, notesContainer.children[1]);
                
                new FlashMessage({type: 'success', message: 'New note added successfully'})
                // notesContainer.querySelector('form').remove();
                Note.removeForm();
            })
            .catch(error => {
                new FlashMessage({type: 'error', message: error});
            })
        }    

    render() {
        this.element ||= document.createElement('div');
        this.element.classList.add(..."newNote bg-white shadow overflow-hidden sm:rounded-lg mt-5".split(" "));

        let date = new Date(this.created_at).toLocaleDateString(
            'en-us',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }
        );

        this.date ||= document.createElement('div');
        this.date.classList.add(..."px-4 pt-5 pb-0 col-span-full".split(" "));
        this.date.textContent = date;

        this.trashCanLink ||= document.createElement('a');
        this.trashCanLink.href = "#deleteNote";
        this.trashCanLink.classList.add(..."my-4 p-2 text-right".split(" "));

        this.icon ||= document.createElement('i');
        this.icon.classList.add(..."fa p-2 fa-trash trashNote".split(" "));
        this.icon.dataset.noteId = this.id;

        this.trashCanLink.append(this.icon)

        this.contentBox ||= document.createElement('div');
        this.contentBox.classList.add(..."px-4 py-5 col-span-full".split(" "));
        this.contentBox.textContent = this.content;

        this.date.append(this.trashCanLink);

        this.element.append(this.date, this.contentBox);

        return this.element;
    }

    destroy() {
        let proceed = confirm("Are you sure you want to delete this note?");
        if(proceed) {
            return fetch(`http://localhost:3000/notes/${this.id}`, {
                method: 'DELETE'
            })
                .then(json => {
                    let index = Plant.active.noteCollection.findIndex(note => note.id == json.id);
                    Plant.active.noteCollection.splice(index, 1);
                    console.log("this is note destory's this: ", this);
                    this.element.remove();
                    new FlashMessage({type: 'success', message: 'Note successfully deleted'})
                })
        }
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