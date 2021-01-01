class Plant {
    constructor(attributes) {
        let whitelist = ["id", "name", "species", "location", "watering_frequency", "fertalizating_frequency", "user_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }

    static container() {
        return this.c ||= document.querySelector("#plants");
    }

    static list() {
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
                this.container().append(...renderedPlants);
                console.log(this);
                debugger
            })
    }

/*
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <li class="text-sm font-medium text-gray-500">
                    Plant 1
                  </li>
                </div>
*/

render() {

        this.element ||= document.createElement('div');
        this.element.classList.add(..."bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6".split(" "));

        this.li ||= document.createElement('li');
        this.li.classList.add(..."text-sm font-medium text-gray-500".split(" "));
        this.li.textContent = this.name; // change this to a link

        this.element.append(this.li);

        return this.element
    }
}
class CareEvent {
    constructor(attributes) {
        let whitelist = ["id", "event_type", "due_date", "completed", "plant_id"];
        whitelist.forEach(attr => this[attr] = attributes[attr]);
    }
}