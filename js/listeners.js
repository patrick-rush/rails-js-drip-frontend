document.addEventListener('DOMContentLoaded', function(e) {
    Plant.all();
})

document.addEventListener('click', function(e) {
    const target = e.target;
    Page.hideWelcome();

    if (target.matches('.showPlants')) {
        Page.setFocus('.showPlants');
        Plant.all();
    } else if (target.matches('.showNewPlant')) {
        Page.setFocus('.showNewPlant');
        Page.resetForm();
        Plant.new();
    } else if (target.matches('.selectPlant')) {
        const plant = Plant.findById(target.dataset.plantId);
        plant.show();
    } else if (target.matches('.increaseDays')) {
        const plant = Plant.findById(target.dataset.plantId);
        plant.changeDays("+")
    } else if (target.matches('.decreaseDays')) {
        const plant = Plant.findById(target.dataset.plantId);
        plant.changeDays("-")
    } else if (target.matches('.showToday')) {
        Page.showWelcome();
        Page.setFocus('.showToday');
        CareEvent.today();
    } else if (target.matches('.editPlant')) {
        const plant = Plant.findById(target.dataset.plantId);
        plant.edit();
    } else if (target.matches('.deletePlant')) {
        const plant = Plant.findById(target.dataset.plantId);
        plant.destroy();
    } else if (target.matches('.selectEvent')) {
        const careEvent = CareEvent.findById(target.dataset.careEventId);
        careEvent.show();
    } else if (target.matches('.completed')) {
        const careEvent = CareEvent.findById(target.dataset.careEventId);
        if (careEvent.completed) {
            if (target.dataset.nextCareEventId) {
                const nextCareEvent = CareEvent.findById(target.dataset.nextCareEventId);
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
        const note = Note.findById(target.dataset.noteId);
        note.destroy(target.dataset.noteId);
    } else if (target.matches('.addCareEventIcon')) {
        CareEvent.new();
    } else if (target.matches('.deleteCareEvent')) {
        const careEvent = CareEvent.findById(target.dataset.careEventId);
        careEvent.destroy();
        Page.showWelcome();

    }
})

document.addEventListener('submit', function(e) {
    const target = e.target;
    e.preventDefault();
    if (target.matches('#newPlant')) {
        const formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        Plant.create(formData);
    } else if (target.matches('#updatePlant')) {
        const formData = {};
        target.querySelectorAll('input').forEach(function(input) {
            formData[input.name] = input.value;
        })
        const plant = Plant.findById(target.dataset.plantId);
        plant.update(formData);
    } else if (target.matches('.newNote')) {
        const content = target.querySelector('textarea').value;
        const formData = {
            "content" : content,
            "plant_id" : Plant.active.id
        };
        Note.create(formData);
    } else if (target.matches('.newCareEvent')) {
        const date = target.querySelector('input').value;
        const formData = {
            "event_type" : "Water", 
            "due_date" : new Date(date), 
            "plant_id" : Plant.active.id
        }
        CareEvent.create(formData)
    }
})

