/*Slideshow*/
    var slides = document.querySelectorAll('.hero .slide');
    var current = 0;

    if(slides.length > 1){
        setInterval(function (){
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000);
    }

/*contact*/
var contactForm = document.getElementById('contact-form');

if(contactForm){
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();

        /* Sends the form to Web3Forms, which emails it to the inbox linked to the access_key in index.html */
        var form = e.target;
        var data = new FormData(form);
        var button = form.querySelector('button[type="submit"]');
        var status = document.getElementById('form-status');

        data.append('subject', 'Website enquiry from ' + data.get('name'));

        button.disabled = true;
        button.textContent = 'Sending...';
        status.style.color = '';
        status.textContent = 'Sending your enquiry...';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data
        })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.success) {
                    status.style.color = 'var(--green)';
                    status.textContent = "Thank you! Your enquiry has been sent. We'll be in touch soon.";
                    form.reset();
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(function () {
                status.style.color = 'var(--red)';
                status.textContent = 'Sorry, something went wrong. Please email enquiry@gmail.com or call +60 17-217 9899.';
            })
            .finally(function () {
                button.disabled = false;
                button.textContent = 'Send enquiry';
            });
    });
}


/*coverage*/
if(document.getElementById('coverage-map') && window.L){
var map = L.map('coverage-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom:false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    /* area = the part of the map shown when that card is clicked */
    var places = [
        {key: 'sarawak', name: 'Sarawak', lat:4.3995, lng: 113.9914, side: 'left',
            area: [[0.85, 109.5], [5.1, 115.6]]},
        {key: 'sabah', name: 'Sabah', lat: 5.80, lng: 117.00,
            area: [[4.1, 115.3], [7.4, 119.3]]},
        {key: 'brunei', name:'Brunei', lat: 4.9031, lng: 114.9398, side: 'top',
            area: [[3.8, 113.6], [5.4, 115.8]]},
        {key: 'indonesia', name:'Indonesia', lat: -1.2379, lng: 116.8529,
            area: [[-4.2, 108.8], [4.4, 119.0]]}
    ];

    var points = [];
    var markers = {};

    var pinIcon = L. divIcon({
        className: 'map-pin',
        html: '<i class="fa-solid fa-location-dot"></i>',
        iconSize: [34, 44],
        iconAnchor: [17, 44]
    });

    places.forEach(function (p){
        var side=p.side || 'right';
        var offset = side === 'left' ? [-18, -22] : side === 'top' ? [0, -46] : [18, -22];

        markers[p.key] = L.marker([p.lat, p.lng], {icon: pinIcon})
            .addTo(map)
            .bindTooltip(p.name, {
                permanent: true,
                direction: side,
                offset: offset,
                className: 'map-label'
            });

        points.push([p.lat, p.lng]);
    });

    map.fitBounds(points,{ padding: [40, 40]});

    window.addEventListener('load', function(){
        map.invalidateSize();
        if (!activePlace) {
            map.fitBounds(points, { padding: [40, 40] });
        }
    });

    window.addEventListener('resize', function (){
        map.invalidateSize();
    });

    /* Click a coverage card -> zoom the map to that area */
    var coverageCards = document.querySelectorAll('.coverage-item[data-place]');
    var mapBox = document.getElementById('coverage-map');
    var activePlace = null;

    /* "Show all areas" button, only visible while zoomed in */
    var resetControl = L.control({ position: 'topright' });
    resetControl.onAdd = function () {
        var btn = L.DomUtil.create('button', 'map-reset');
        btn.type = 'button';
        btn.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Show all areas';
        L.DomEvent.disableClickPropagation(btn);
        L.DomEvent.on(btn, 'click', function () { showPlace(null); });
        return btn;
    };
    resetControl.addTo(map);

    function showPlace(key) {
        activePlace = key;
        mapBox.classList.toggle('is-zoomed', key !== null);

        /* highlight the chosen card, pin and label; fade the others */
        coverageCards.forEach(function (card) {
            var on = card.getAttribute('data-place') === key;
            card.classList.toggle('is-active', on);
            card.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        places.forEach(function (p) {
            var pin = markers[p.key].getElement();
            var label = markers[p.key].getTooltip().getElement();
            var state = key === null ? '' : (p.key === key ? 'is-active' : 'is-dimmed');
            [pin, label].forEach(function (el) {
                if (!el) { return; }
                el.classList.remove('is-active', 'is-dimmed');
                if (state) { el.classList.add(state); }
            });
        });

        if (key === null) {
            map.flyToBounds(points, { padding: [40, 40], duration: 0.8 });
            return;
        }

        var place = places.filter(function (p) { return p.key === key; })[0];
        map.flyToBounds(place.area, { padding: [30, 30], maxZoom: 9, duration: 0.8 });

        /* phones: make sure the map is on screen so they can see it move */
        var box = mapBox.getBoundingClientRect();
        if (box.top < 70 || box.bottom > window.innerHeight) {
            mapBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    coverageCards.forEach(function (card) {
        function choose() {
            var key = card.getAttribute('data-place');
            showPlace(activePlace === key ? null : key);   /* click again to zoom back out */
        }

        card.addEventListener('click', choose);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                choose();
            }
        });
    });
}


var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(function (section) {
    spy.observe(section);
});

/*Header shadow*/
var siteHeader = document.querySelector('header');

window.addEventListener('scroll', function(){
    if(window.scrollY > 10){
        siteHeader.classList.add('scrolled');
    }else{
        siteHeader.classList.remove('scrolled');
    }
});

/* Business bubbles */
var bubbleButtons = document.querySelectorAll('.bubble-toggle');

function closeAllBubbles() {
    bubbleButtons.forEach(function (btn) {
        btn.closest('.service-card').classList.remove('bubble-open');
        btn.setAttribute('aria-expanded', 'false');
    });
}

bubbleButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var card = btn.closest('.service-card');
        var isOpen = card.classList.contains('bubble-open');
        closeAllBubbles();
        if (!isOpen) {
            card.classList.add('bubble-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.business-card')) {
        closeAllBubbles();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeAllBubbles();
    }
});

/* Mobile menu */
var menuToggle = document.querySelector('.menu-toggle');
var navbar = document.querySelector('.navbar');

function setMenu(isOpen) {
    navbar.classList.toggle('nav-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function () {
        setMenu(!navbar.classList.contains('nav-open'));
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            setMenu(false);
        });
    });
}
