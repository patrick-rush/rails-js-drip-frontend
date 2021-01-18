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
        let plant = Plant.findById(target.dataset.plantId);
        plant.show();
    } else if (target.matches('.increaseDays')) {
        let plant = Plant.findById(target.dataset.plantId);
        plant.changeDays("+")
    } else if (target.matches('.decreaseDays')) {
        let plant = Plant.findById(target.dataset.plantId);
        plant.changeDays("-")
    } else if (target.matches('.showToday')) {
        Page.showWelcome();
        Page.setFocus('.showToday');
        CareEvent.today();
    } else if (target.matches('.editPlant')) {
        let plant = Plant.findById(target.dataset.plantId);
        plant.edit();
    } else if (target.matches('.deletePlant')) {
        let plant = Plant.findById(target.dataset.plantId);
        plant.destroy();
    } else if (target.matches('.selectEvent')) {
        let careEvent = CareEvent.findById(target.dataset.careEventId);
        careEvent.show();
    } else if (target.matches('.completed')) {
        let careEvent = CareEvent.findById(target.dataset.careEventId);
        if (careEvent.completed) {
            if (target.dataset.nextCareEventId) {
                let nextCareEvent = CareEvent.findById(target.dataset.nextCareEventId);
                nextCareEvent.destroy();
                careEvent.markNotCompleted();
            } else {
                careEvent.markNotCompleted();
            }
        } else {
            careEvent.markCompleted();
        }
    } else if (target.matches('.addNoteIcon')) {
        Note.new();
    } else if (target.matches('.removeForm')) {
        Note.removeForm();
    } else if (target.matches('.removeCareEventForm')) {
        CareEvent.removeForm();
    } else if (target.matches('.trashNote')) {
        let note = Note.findById(target.dataset.noteId);
        note.destroy(target.dataset.noteId);
    } else if (target.matches('.addCareEventIcon')) {
        CareEvent.new();
    } else if (target.matches('.deleteCareEvent')) {
        let careEvent = CareEvent.findById(target.dataset.careEventId);
        careEvent.destroy();
        Page.showWelcome();

    }
})

document.addEventListener('submit', function(e) {
    let target = e.target;
    e.preventDefault();
    if (target.matches('#newPlant')) {
        let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Plant.create(formData);
    } else if (target.matches('#updatePlant')) {
        let formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        let plant = Plant.findById(target.dataset.plantId);
        plant.update(formData);
    } else if (target.matches('.newNote')) {
        let content = target.querySelector('textarea').value;
        let formData = {
            "content" : content,
            "plant_id" : Plant.active.id
        };
        Note.create(formData);
    } else if (target.matches('.newCareEvent')) {
        let date = target.querySelector('input').value;
        let formData = {
            "event_type" : "Water", 
            "due_date" : new Date(date), 
            "plant_id" : Plant.active.id
        }
        CareEvent.create(formData)
    } else if (target.matches('#search')) {
        console.log("search")
        // let date = target.querySelector('input').value;
        // let formData = {
        //     "event_type" : "Water", 
        //     "due_date" : new Date(date), 
        //     "plant_id" : Plant.active.id
        // }
        // CareEvent.create(formData)
    }
})

