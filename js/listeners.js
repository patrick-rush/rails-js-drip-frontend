document.addEventListener('DOMContentLoaded', function(e) {
    Plant.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
    if (target.matches('.showPlants')) {
        Page.nav().querySelector(".showToday").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showToday").classList.add("text-gray-300");
        Page.nav().querySelector(".showNewPlant").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showNewPlant").classList.add("text-gray-300");
        Page.nav().querySelector(".showPlants").classList.add(..."bg-gray-900 text-white".split(" "));

        Plant.all();
    } else if (target.matches('.showNewPlant')) {
        Page.nav().querySelector(".showToday").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showToday").classList.add("text-gray-300");
        Page.nav().querySelector(".showPlants").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showPlants").classList.add("text-gray-300");
        Page.nav().querySelector(".showNewPlant").classList.add(..."bg-gray-900 text-white".split(" "));

        Plant.new();
    } else if (target.matches('.selectPlant')) {
        console.log('selected plant:', target.dataset.plantId);
        Plant.show(target.dataset.plantId);
    } else if (target.matches('.increaseDays')) {
        console.log('clicked plus', target.dataset.plantId);
        Plant.increaseDays(target.dataset.plantId);
    } else if (target.matches('.decreaseDays')) {
        console.log('clicked minus', target.dataset.plantId);
        Plant.decreaseDays(target.dataset.plantId);
    } else if (target.matches('.showToday')) {
        console.log('clicked Today button');
        Page.nav().querySelector(".showPlants").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showPlants").classList.add("text-gray-300");
        Page.nav().querySelector(".showNewPlant").classList.remove(..."bg-gray-900 text-white".split(" "));
        Page.nav().querySelector(".showNewPlant").classList.add("text-gray-300");
        Page.nav().querySelector(".showToday").classList.add(..."bg-gray-900 text-white".split(" "));

        CareEvent.today();
    } 
})

document.addEventListener('submit', function(e) {
    let target = e.target;
    if (target.matches('#newPlant')) {
        e.preventDefault();
        let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Plant.create(formData);
    }
})

