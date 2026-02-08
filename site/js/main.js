document.addEventListener('DOMContentLoaded', function() {
  createSnow();
  highlightCurrentPage();
  setupGallery();
  setupBookingForm();
  setupContactForm();
});


/* ========================================
   SNOW EFFECT 
   ======================================== */
function createSnow() {
  var container = document.querySelector('.snow-container');
  if (!container) return;
  
  // Create 80 snowflakes
  for (var i = 0; i < 80; i++) {
    var flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '❄'; 
    
    var size = Math.random() * 15 + 10;
    
    flake.style.fontSize = size + 'px';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.opacity = Math.random() * 0.5 + 0.3;
    flake.style.animationDuration = (Math.random() * 10 + 10) + 's';
    flake.style.animationDelay = Math.random() * 10 + 's';
    
    container.appendChild(flake);
  }
}


/* ========================================
   ACTIVE PAGE 
   ======================================== */
function highlightCurrentPage() {
  var path = window.location.pathname;
  var page = path.split('/').pop() || 'index.html';
  
  var links = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href === page) {
      links[i].classList.add('active');
    }
  }
}


/* ========================================
   GALLERY 
   ======================================== */
function setupGallery() {
  var items = document.querySelectorAll('.gallery-item');
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = document.querySelector('.lightbox img');
  var closeBtn = document.querySelector('.lightbox-close');
  var filterBtns = document.querySelectorAll('.filter-btn');
  
  // Open lightbox when image is clicked
  for (var i = 0; i < items.length; i++) {
    items[i].onclick = function() {
      if (!lightbox || !lightboxImg) return;
      var img = this.querySelector('img');
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    };
  }
  
  // Close lightbox
  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
  }
  
  if (closeBtn) closeBtn.onclick = closeLightbox;
  if (lightbox) lightbox.onclick = function(e) {
    if (e.target === lightbox) closeLightbox();
  };
  
  // Filter gallery by category
  for (var j = 0; j < filterBtns.length; j++) {
    filterBtns[j].onclick = function() {
      var category = this.getAttribute('data-category');
      
      // Update active button
      for (var k = 0; k < filterBtns.length; k++) {
        filterBtns[k].classList.remove('active');
      }
      this.classList.add('active');
      
      // Show/hide items
      for (var m = 0; m < items.length; m++) {
        if (category === 'all' || items[m].getAttribute('data-category') === category) {
          items[m].style.display = 'block';
        } else {
          items[m].style.display = 'none';
        }
      }
    };
  }
}


/* ================
   BOOKING FORM 
   =============== */

// Room prices per night
var roomPrices = {
  'deluxe': 450,
  'superior': 750,
  'grand': 1200,
  'royal': 2500
};

// Optional activities
var activities = [
  { id: 'spa', name: 'Spa & Wellness Package', price: 150, description: 'Full day access with massage' },
  { id: 'ski', name: 'Private Ski Instructor', price: 300, description: 'Half-day personal lessons' },
  { id: 'dinner', name: 'Gourmet Dinner Experience', price: 200, description: '5-course meal with wine pairing' },
  { id: 'helicopter', name: 'Helicopter Tour', price: 500, description: '30-minute scenic mountain flight' }
];

// Extra guest fee per night (after 1 guests)
var extraGuestFee = 75;

// Store selected activities
var selectedActivities = [];

function setupBookingForm() {
  var form = document.getElementById('booking-form');
  if (!form) return;
  
  var steps = document.querySelectorAll('.booking-form-step');
  var indicators = document.querySelectorAll('.step');
  var currentStep = 1;
  
  // Listen for changes
  var checkIn = document.getElementById('check-in');
  var checkOut = document.getElementById('check-out');
  var roomType = document.getElementById('room-type');
  var guestsSelect = document.getElementById('guests');
  
  if (checkIn) checkIn.onchange = updatePriceDisplay;
  if (checkOut) checkOut.onchange = updatePriceDisplay;
  if (roomType) roomType.onchange = updatePriceDisplay;
  if (guestsSelect) {
    guestsSelect.onchange = function() {
      updateRoomPricesInDropdown(); // Dropdown metnini güncelle
      updatePriceDisplay();         // Fiyatı güncelle
    };
  }
  
  // Next buttons
  var nextBtns = document.querySelectorAll('.btn-next');
  for (var i = 0; i < nextBtns.length; i++) {
    nextBtns[i].onclick = function(e) {
      e.preventDefault();
      if (checkRequiredFields(currentStep)) {
        // Step 1'den çıkarken aktivite sor
        if (currentStep === 1) {
          askAboutActivities(function() {
            currentStep++;
            showStep(currentStep);
          });
        } else {
          currentStep++;
          showStep(currentStep);
        }
      }
    };
  }
  
  // Previous buttons
  var prevBtns = document.querySelectorAll('.btn-prev');
  for (var j = 0; j < prevBtns.length; j++) {
    prevBtns[j].onclick = function(e) {
      e.preventDefault();
      currentStep--;
      showStep(currentStep);
    };
  }
  
  // Show a specific step
  function showStep(step) {
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.remove('active');
      indicators[i].classList.remove('active', 'completed');
      
      if (i === step - 1) {
        steps[i].classList.add('active');
        indicators[i].classList.add('active');
      }
      if (i < step - 1) {
        indicators[i].classList.add('completed');
      }
    }
    
    // Update summary on final step
    if (step === 3) updateSummary();
  }
  
  // Check required fields
  function checkRequiredFields(step) {
    var fields = steps[step - 1].querySelectorAll('[required]');
    var allFilled = true;
    
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        fields[i].style.borderColor = '#e74c3c';
        allFilled = false;
      } else {
        fields[i].style.borderColor = '';
      }
    }
    return allFilled;
  }
  
  // Handle form submit
  form.onsubmit = function(e) {
    e.preventDefault();
    
    var total = calculateTotal();
    var confirmed = confirm(
      'Your reservation total is €' + total.toLocaleString() + '\n\n' +
      'Do you want to proceed with this booking?'
    );
    
    if (confirmed) {
      alert('Thank you! Your booking has been confirmed.\nTotal: €' + total.toLocaleString() + '\n\nWe will send confirmation to your email.');
      form.reset();
      selectedActivities = [];
      currentStep = 1;
      showStep(1);
      hidePriceDisplay();
      
      // Reset dropdown texts
      var options = document.getElementById('room-type').options;
      for(var i=1; i<options.length; i++) {
          var base = options[i].getAttribute('data-base-price');
          var name = options[i].textContent.split(' - ')[0];
          options[i].textContent = name + ' - €' + parseInt(base).toLocaleString() + '/night';
      }
    }
  };
}

/* YARDIMCI FONKSİYONLAR */

// Calculate nights
function calculateNights(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return 0;
  
  var start = new Date(checkInDate);
  var end = new Date(checkOutDate);
  var diff = end - start;
  var nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  return nights > 0 ? nights : 0;
}

// Update Room Dropdown Text (Extra Guest Logic)
function updateRoomPricesInDropdown() {
  var roomType = document.getElementById('room-type');
  var guestsSelect = document.getElementById('guests');
  
  if (!roomType || !guestsSelect) return;
  
  var guests = parseInt(guestsSelect.value) || 1;
  var extraGuests = guests > 1 ? guests - 1 : 0;
  var extraFee = extraGuests * extraGuestFee;
  
  var options = roomType.options;
  for (var i = 1; i < options.length; i++) {
    var basePrice = parseInt(options[i].getAttribute('data-base-price')) || 0;
    var totalPrice = basePrice + extraFee;
    var roomName = options[i].textContent.split(' - ')[0]; // İsim kısmını al
    
    if (extraFee > 0) {
      options[i].textContent = roomName + ' - €' + totalPrice.toLocaleString() + '/night (+€' + extraFee + ' for extra guests)';
    } else {
      options[i].textContent = roomName + ' - €' + basePrice.toLocaleString() + '/night';
    }
  }
}

// Calculate total price
function calculateTotal() {
  var checkIn = document.getElementById('check-in');
  var checkOut = document.getElementById('check-out');
  var roomType = document.getElementById('room-type');
  var guestsSelect = document.getElementById('guests');
  
  if (!checkIn || !checkOut || !roomType) return 0;
  
  var nights = calculateNights(checkIn.value, checkOut.value);
  var roomPrice = roomPrices[roomType.value] || 0;
  var guests = parseInt(guestsSelect.value) || 1;
  
  // Base room price
  var roomTotal = nights * roomPrice;
  
  // Add extra guest fee for guests beyond 1
  var extraGuests = guests > 1 ? guests - 1 : 0;
  var guestFee = extraGuests * extraGuestFee * nights;
  
  // Add activities
  var activitiesTotal = 0;
  for (var i = 0; i < selectedActivities.length; i++) {
    activitiesTotal += selectedActivities[i].price;
  }
  
  return roomTotal + guestFee + activitiesTotal;
}

// Update the price display in step 1
function updatePriceDisplay() {
  var priceDisplay = document.getElementById('price-display');
  var breakdown = document.getElementById('price-breakdown');
  var totalEl = document.getElementById('base-total');
  
  var checkIn = document.getElementById('check-in');
  var checkOut = document.getElementById('check-out');
  var roomType = document.getElementById('room-type');
  var guestsSelect = document.getElementById('guests');
  
  if (!checkIn.value || !checkOut.value || !roomType.value) {
    if (priceDisplay) priceDisplay.style.display = 'none';
    return;
  }
  
  var nights = calculateNights(checkIn.value, checkOut.value);
  var roomPrice = roomPrices[roomType.value] || 0;
  var guests = parseInt(guestsSelect.value) || 1;
  
  // Calculate extra guest fee
  var extraGuests = guests > 1 ? guests - 1 : 0;
  var guestFee = extraGuests * extraGuestFee * nights;
  
  var roomTotal = nights * roomPrice;
  var total = roomTotal + guestFee;
  
  if (nights > 0 && roomPrice > 0) {
    var text = nights + ' night(s) × €' + roomPrice + '/night = €' + roomTotal.toLocaleString();
    
    // Show guest fee if applicable
    if (guestFee > 0) {
      text += '\n+ ' + extraGuests + ' extra guest(s) × €' + extraGuestFee + '/night × ' + nights + ' night(s) = €' + guestFee.toLocaleString();
    }
    
    if(breakdown) breakdown.innerHTML = text.replace(/\n/g, '<br>');
    if(totalEl) totalEl.textContent = total.toLocaleString();
    if(priceDisplay) priceDisplay.style.display = 'block';
  } else {
    if(priceDisplay) priceDisplay.style.display = 'none';
  }
}

// Hide price display
function hidePriceDisplay() {
  var priceDisplay = document.getElementById('price-display');
  if (priceDisplay) priceDisplay.style.display = 'none';
}

// Ask user about activities
function askAboutActivities(callback) {
  selectedActivities = []; // Reset
  var index = 0;
  
  function askNext() {
    if (index >= activities.length) {
      // Done asking
      if (selectedActivities.length > 0) {
        var list = '';
        var total = 0;
        for (var i = 0; i < selectedActivities.length; i++) {
          list += '• ' + selectedActivities[i].name + ' (+€' + selectedActivities[i].price + ')\n';
          total += selectedActivities[i].price;
        }
        alert('Activities added to your package:\n\n' + list + '\nActivities total: €' + total);
      }
      callback();
      return;
    }
    
    var activity = activities[index];
    var message = 'Would you like to add this activity?\n\n' +
      activity.name + '\n' +
      activity.description + '\n' +
      'Price: +€' + activity.price;
    
    if (confirm(message)) {
      selectedActivities.push(activity);
    }
    
    index++;
    askNext();
  }
  
  askNext();
}

// Update booking summary
function updateSummary() {
  var checkIn = document.getElementById('check-in');
  var checkOut = document.getElementById('check-out');
  var roomType = document.getElementById('room-type');
  var guests = document.getElementById('guests');
  
  var nights = calculateNights(checkIn.value, checkOut.value);
  
  document.getElementById('summary-dates').textContent = 
    (checkIn ? checkIn.value : '') + ' to ' + (checkOut ? checkOut.value : '');
  document.getElementById('summary-room').textContent = 
    roomType ? roomType.options[roomType.selectedIndex].text : '';
  document.getElementById('summary-guests').textContent = 
    (guests ? guests.value : '') + ' guest(s)';
  
  var summaryNights = document.getElementById('summary-nights');
  if(summaryNights) summaryNights.textContent = nights + ' night(s)';
  
  // Show activities
  var activitiesRow = document.getElementById('summary-activities-row');
  var activitiesEl = document.getElementById('summary-activities');
  
  if (activitiesRow && activitiesEl) {
      if (selectedActivities.length > 0) {
        var names = [];
        for (var i = 0; i < selectedActivities.length; i++) {
          names.push(selectedActivities[i].name);
        }
        activitiesEl.textContent = names.join(', ');
        activitiesRow.style.display = 'flex';
      } else {
        activitiesRow.style.display = 'none';
      }
  }
  
  // Total price
  var totalEl = document.getElementById('summary-total');
  if(totalEl) {
      var total = calculateTotal();
      totalEl.textContent = '€' + total.toLocaleString();
  }
}


/* ========================================
   CONTACT FORM
   ======================================== */
function setupContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  
  form.onsubmit = function(e) {
    e.preventDefault();
    
    var fields = form.querySelectorAll('[required]');
    var allFilled = true;
    
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        fields[i].style.borderColor = '#e74c3c';
        allFilled = false;
      } else {
        fields[i].style.borderColor = '';
      }
    }
    
    if (allFilled) {
      alert('Thank you for your message! We will get back to you soon.');
      form.reset();
    }
  };
}