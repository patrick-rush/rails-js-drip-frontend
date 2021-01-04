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
                this.leftContainer().append(...renderedPlants);
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
            <div id="rightContainerHeader" class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Name of Plant
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Species of plant
              </p>
            </div>

            Plant.rightContainer().querySelector(".")
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
                // this.rightContainer().querySelector(".fertilizing_frequency").textContent = plant.fertilizing_frequency;
                // this.rightContainer().appendChild(plant.renderPlant());
            })
    }

/*
          <div id="rightContainer" class="bg-white sm:min-h-screen col-span-2 rounded-md shadow">
            <div class="header px-4 py-5 sm:px-6">
              <h3 class="title text-lg leading-6 font-medium text-gray-900">
                Name of Plant
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <div class="body">
              <ul>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Location
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="py-4 col-span-10 sm:col-span-4">Kitchen</a>
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="my-4 text-right"><i class="fa fa-pencil-alt content-end"></i></a>      
                  </li>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Watering Frequency
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="py-4 col-span-10 sm:col-span-4">5 days</a>
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="my-4 text-right"><i class="fa fa-minus"></i></a>
                    <a href="#" class="my-4 text-right"><i class="fa fa-plus"></i></a>      
                  </li>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Fertalizating Frequency
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="py-4 col-span-10 sm:col-span-4">6 months</a>
                  </li>
                  <li class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <a href="#" class="my-4 text-right"><i class="fa fa-minus"></i></a>
                    <a href="#" class="my-4 text-right"><i class="fa fa-plus"></i></a>      
                  </li>

                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Notes
                  </li>
                </div>  
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Completed Care Events
                  </li>
                </div>

              </ul>
            </div>

*/

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