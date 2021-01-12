document.addEventListener('DOMContentLoaded', function(e) {
    Plant.all();
})

document.addEventListener('click', function(e) {
    let target = e.target;
    Page.hideWelcome();

    if (target.matches('.showPlants')) {
        Page.setFocus('.showPlants');
        Plant.all();
    } else if (target.matches('.showNewPlant')) {
        Page.setFocus('.showNewPlant');
        Page.resetForm();
        Plant.new();
    } else if (target.matches('.selectPlant')) {
        console.log('selected plant:', target.dataset.plantId);
        let plant = Plant.findById(target.dataset.plantId);
        plant.show();
        // Plant.show(target.dataset.plantId);
    } else if (target.matches('.increaseDays')) {
        console.log('clicked plus', target.dataset.plantId);
        // Plant.increaseDays(target.dataset.plantId);
        let plant = Plant.findById(target.dataset.plantId);
        // plant.increaseDays();
        plant.changeDays("+")
    } else if (target.matches('.decreaseDays')) {
        console.log('clicked minus', target.dataset.plantId);
        // Plant.decreaseDays(target.dataset.plantId);
        let plant = Plant.findById(target.dataset.plantId);
        // plant.decreaseDays();
        plant.changeDays("-")
    } else if (target.matches('.showToday')) {
        console.log('clicked Today button');
        Page.showWelcome();
        Page.setFocus('.showToday');
        CareEvent.today();
    } else if (target.matches('.editPlant')) {
        console.log('clicked editPlant', target.dataset.plantId);
        let plant = Plant.findById(target.dataset.plantId);
        plant.edit();
    } else if (target.matches('.deletePlant')) {
        console.log('clicked deletePlant', target.dataset.plantId);
        let plant = Plant.findById(target.dataset.plantId);
        plant.destroy();
        // Plant.destroy(target.dataset.plantId)
    } else if (target.matches('.selectEvent')) {
        console.log('clicked selectEvent', target.dataset.careEventId);
        let careEvent = CareEvent.findById(target.dataset.careEventId);
        careEvent.show();
    } else if (target.matches('.completed')) {
        console.log('clicked the checkmark', target.dataset.careEventId)
        if (target.dataset.nextCareEventId) {
            let nextCareEvent = CareEvent.findById(target.dataset.nextCareEventId);
            let careEvent = CareEvent.findById(target.dataset.careEventId);
            nextCareEvent.destroy();
            careEvent.markNotCompleted();
        } else {
            let careEvent = CareEvent.findById(target.dataset.careEventId);
            careEvent.markCompleted(); 
        }
    } else if (target.matches('.addNoteIcon')) {
        console.log('clicked add note', target.dataset.plantId);
        Note.new();
    } else if (target.matches('.removeForm')) {
        Note.removeForm();
    } else if (target.matches('.trashNote')) {
        let note = Note.findById(target.dataset.noteId);
        note.destroy(target.dataset.noteId);
    } 
})

// document.addEventListener('click', function(e) {
// })

document.addEventListener('submit', function(e) {
    let target = e.target;
    e.preventDefault();
    if (target.matches('#newPlant')) {
        // e.preventDefault();
        let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Plant.create(formData);
    } else if (target.matches('#updatePlant')) {
        // e.preventDefault();
        let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        let plant = Plant.findById(target.dataset.plantId);
        plant.update(formData);
    } else if (target.matches('.newNote')) {
        // e.preventDefault();
        console.log("clicked save new note")
        let content = target.querySelector('textarea').value;
        let formData = {
            "content" : content,
            "plant_id" : Plant.active.id
        };
        Note.create(formData);
    }
})

