let events = [];

let editingEventId = null; 

function updateLocationOptions(value) {
    const locationDiv = document.getElementById('location_div');
    const remoteDiv = document.getElementById('remote_url_div');

    if (value === 'remote') {
        locationDiv.classList.add('d-none');
        remoteDiv.classList.remove('d-none');
    } else {
        locationDiv.classList.remove('d-none');
        remoteDiv.classList.add('d-none');
    }
}

function saveEvent() {
    const form = document.getElementById('event_form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const eventDetails = {
        id: editingEventId ? editingEventId : Date.now(), // Use system time as unique ID
        name: document.getElementById('event_name').value,
        weekday: document.getElementById('event_weekday').value,
        time: document.getElementById('event_time').value,
        modality: document.getElementById('event_modality').value,
        location: document.getElementById('event_location').value,
        remote_url: document.getElementById('event_remote_url').value,
        attendees: document.getElementById('event_attendees').value,
        category: document.getElementById('event_category').value
    };

    if (editingEventId) {
        const index = events.findIndex(function(e) {
            return e.id === editingEventId;
        });
        
        if (index !== -1) {
            events[index] = eventDetails;
        }
        editingEventId = null;
    } else {
        events.push(eventDetails);
    }

    renderCalendar();

    const modalElement = document.getElementById('event_modal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    form.reset();
}

function renderCalendar() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(function(day) {
        const dayContainer = document.getElementById(day);
        if (dayContainer) {
            dayContainer.innerHTML = '';
        }
    });

    events.forEach(function(event) {
        addEventToCalendarUI(event);
    });
}

function addEventToCalendarUI(eventInfo) {
    const dayContainer = document.getElementById(eventInfo.weekday);
    if (dayContainer) {
        const card = createEventCard(eventInfo);
        dayContainer.appendChild(card);
    }
}

function createEventCard(eventDetails) {
    const card = document.createElement('div');
    
    let bgClass = 'bg-light'; // Default
    if (eventDetails.category === 'Academic') bgClass = 'bg-primary text-white';
    else if (eventDetails.category === 'Work') bgClass = 'bg-warning text-dark';
    else if (eventDetails.category === 'Personal') bgClass = 'bg-success text-white';

    card.className = `event row border rounded m-1 py-2 ${bgClass}`;
    
    card.onclick = function() {
        loadEventForEdit(eventDetails.id);
    };
    
    card.style.cursor = 'pointer';
    const locationText = eventDetails.modality === 'remote' 
        ? `Remote: ${eventDetails.remote_url}` 
        : `Loc: ${eventDetails.location}`;

    card.innerHTML = `
        <div class="col-12"><strong>${eventDetails.name}</strong></div>
        <div class="col-12 small">${eventDetails.time}</div>
        <div class="col-12 small">${locationText}</div>
        <div class="col-12 small">Attendees: ${eventDetails.attendees}</div>
    `;

    return card;
}

function loadEventForEdit(id) {
    const event = events.find(function(e) {
        return e.id === id;
    });
    
    if (!event) return;

    editingEventId = id; 

    document.getElementById('event_name').value = event.name;
    document.getElementById('event_weekday').value = event.weekday;
    document.getElementById('event_time').value = event.time;
    document.getElementById('event_modality').value = event.modality;
    
    updateLocationOptions(event.modality); 
    
    document.getElementById('event_location').value = event.location;
    document.getElementById('event_remote_url').value = event.remote_url;
    document.getElementById('event_attendees').value = event.attendees;
    document.getElementById('event_category').value = event.category;

    document.querySelector('#event_modal .modal-title').innerText = "Edit Event";

    const modalElement = document.getElementById('event_modal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// Reset form when clicking "Create Event" button
function resetForm() {
    editingEventId = null;
    document.getElementById('event_form').reset();
    document.querySelector('#event_modal .modal-title').innerText = "Create Event";
    updateLocationOptions('in-person');
}

document.addEventListener('DOMContentLoaded', function() {
    
    const createBtn = document.getElementById('create_event_btn');
    if (createBtn) {
        createBtn.addEventListener('click', resetForm);
    }

    const saveBtn = document.getElementById('save_event_btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveEvent);
    }

    const modalitySelect = document.getElementById('event_modality');
    if (modalitySelect) {
        modalitySelect.addEventListener('change', function(event) {
            updateLocationOptions(event.target.value);
        });
    }

    renderCalendar();
});