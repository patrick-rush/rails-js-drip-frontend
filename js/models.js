class Plant {
    constructor(attributes) {
        let whitelist = ["id", "name", "species", "location", "watering_frequency", "fertalizating_frequency", "user_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }

    static infoContainer() {
        return this.c ||= document.querySelector("#infoContainer");
    }

    static list() {
        return this.l ||= document.querySelector("#plants");
    }

    static all() {
        // find someway to prevent this from populating sidebar multiple times
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
                this.list().append(...renderedPlants);
                return this.collection
            })
    }

/*
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <a href='#' class="text-sm font-medium text-gray-500">
                    Plant 1
                  </a>
                </div>
*/ 

/*
            <div id="infoContainerHeader" class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Name of Plant
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Species of plant
              </p>
            </div>

            Plant.infoContainer().querySelector(".")
*/
/*
              <form action="#" method="POST">
                <div class="shadow overflow-hidden sm:rounded-md">
                    <div class="px-4 py-5 bg-white sm:p-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 sm:col-span-3">
                                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" id="name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="species" class="block text-sm font-medium text-gray-700">Species</label>
                                <input type="text" name="species" id="species" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div class="col-span-6 sm:col-span-4">
                                <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" name="location" id="location" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                              <label for="fertalizing_frequency" class="block text-sm font-medium text-gray-700">Fertalizing Frequency</label>
                              <input type="text" name="fertalizing_frequency" id="fertalizing_frequency" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                            <div class="col-span-6 sm:col-span-3">
                                <label for="watering_frequency" class="block text-sm font-medium text-gray-700">Watering Frequency</label>
                                <input type="text" name="watering_frequency" id="watering_frequency" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save
                      </button>
                    </div>
                </div>
              </form>

*/
    static new() {
        console.log("got to new plant");
        let header = this.infoContainer().querySelector(".header");
        let title = header.querySelector(".title");
        let body = this.infoContainer().querySelector(".body");
        title.innerText = "Create a New Plant";

        let plantForm = this.infoContainer().querySelector("#newPlant");
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
                this.infoContainer().appendChild(plant.renderPlant());
            })
    }

    renderPlant() {
        // START HERE - MAKE THIS RENDER A PLANT'S INFO AND ALSO TOGGLE HIDDEN ON FORM 
        this.element ||= document.createElement('div');
        this.element.innerText = this
        return this.element
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