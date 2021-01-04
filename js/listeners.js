document.addEventListener('DOMContentLoaded', function(e) {
    Plant.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
    if (target.matches('.showPlants')) {
        Plant.collection || Plant.all();
    } else if (target.matches('.showNewPlant')) {
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

