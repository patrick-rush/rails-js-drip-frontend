document.addEventListener('DOMContentLoaded', function(e) {
    Plant.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
    if (target.matches('.showPlants')) {
        Plant.all();
    } else if (target.matches('.showNewPlant')) {
        Plant.new();
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

