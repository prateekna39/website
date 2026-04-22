/* =========================================
   1. NEURAL NETWORK CANVAS BACKGROUND
   ========================================= */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
// Reduce particles slightly for better performance on a long scrolling page
const numberOfParticles = 120; 

const mouse = {
    x: null,
    y: null,
    radius: 150 
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = '#00f0ff';
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();

/* =========================================
   2. SCROLL REVEAL ANIMATIONS
   ========================================= */
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; // How far the element needs to be in view to reveal

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Trigger once on load to show elements already in view (like the hero)
window.addEventListener("load", reveal);
// Trigger on scroll
window.addEventListener("scroll", reveal);

/* =========================================
   3 & 4. CLICK-TO-ENTER & AUDIO UNLOCKER
   ========================================= */
const loader = document.getElementById('loader');
const hoverSound = document.getElementById('hover-sound');
if(hoverSound) hoverSound.volume = 0.2; 

let audioUnlocked = false;

// When the user clicks the terminal screen...
loader.addEventListener('click', () => {
    
    // 1. Unlock the audio
    if(hoverSound) {
        hoverSound.play().then(() => {
            hoverSound.pause();
            hoverSound.currentTime = 0;
            audioUnlocked = true;
        }).catch(e => console.log("Audio unlock failed"));
    }

    // 2. Fade out the loader
    loader.style.opacity = '0';
    
    // 3. Remove loader and show the chatbot
    setTimeout(() => {
        loader.style.display = 'none';
        if (typeof reveal === 'function') reveal(); // Trigger scroll animations
        
        // THIS LINE SHOWS THE CHATBOT AFTER THE SCREEN FADES!
        document.getElementById('chatbot-container').style.display = 'flex';
    }, 500);
});

// Attach hover sound to all interactive elements
const interactives = document.querySelectorAll('.interactive-card, .interactive-badge, .interactive-link, .download-btn, .highlight-btn');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (audioUnlocked && hoverSound) {
            hoverSound.currentTime = 0; 
            hoverSound.play().catch(e => {}); 
        }
    });
});
/* =========================================
   5. THREE.JS 3D WIREFRAME LOGO
   ========================================= */
const logoContainer = document.getElementById('three-logo');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(35, 35);
logoContainer.appendChild(renderer.domElement);

// Create a wireframe sphere (looks like an AI node/globe)
const geometry = new THREE.SphereGeometry(1.5, 8, 8);
const material = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 3;

function animateLogo() {
    requestAnimationFrame(animateLogo);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.015;
    renderer.render(scene, camera);
}
animateLogo();

/* =========================================
   6. CHART.JS - INTERACTIVE AI STOCK DEMO
   ========================================= */
const ctxChart = document.getElementById('stockChart').getContext('2d');
new Chart(ctxChart, {
    type: 'line',
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
        datasets: [{
            label: 'Predicted Trend',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#00f0ff',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Curvy lines
            pointRadius: 0,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 15, 20, 0.9)',
                titleColor: '#00f0ff',
                bodyColor: '#fff',
                borderColor: 'rgba(0, 240, 255, 0.3)',
                borderWidth: 1
            }
        },
        interaction: { intersect: false, mode: 'index' }
    }
});

/* =========================================
   7. LIVE WEATHER API FETCH (For Disaster Response App)
   ========================================= */
// Fetching real weather data for Greater Noida using Open-Meteo (No API Key Required)
async function fetchWeather() {
    const widget = document.getElementById('weather-widget');
    try {
        // Lat/Lon for Greater Noida
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.47&longitude=77.50&current_weather=true');
        const data = await response.json();
        
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        
        widget.innerHTML = `<span class="pulse-dot"></span> Greater Noida Alert: ${temp}°C | Wind: ${wind}km/h`;
        widget.style.color = '#00f0ff';
    } catch (error) {
        widget.innerHTML = `<span class="pulse-dot" style="background: red;"></span> API Offline - Simulation Mode`;
    }
}

// Call API after terminal finishes
setTimeout(fetchWeather, 2500);

/* =========================================
   8. MOBILE MENU TOGGLE
   ========================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Toggle menu on click
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
const mobileLinks = document.querySelectorAll('.nav-links a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

/* =========================================
   9. MOBILE PERFORMANCE BOOST (Neural Canvas)
   ========================================= */
// If the screen is mobile-sized, reduce the number of particles by half 
// to save battery and prevent lag.
if (window.innerWidth < 768) {
    // Note: 'numberOfParticles' is declared at the top of your JS file.
    // If you used 'const', change it to 'let' at the top of the file so this works!
    particlesArray.splice(0, Math.floor(particlesArray.length / 2)); 
}
/* =========================================
   10. SCROLL PROGRESS BAR
   ========================================= */
window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById('scroll-bar');
    // Calculate how far down the user has scrolled
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Convert to percentage
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    // Apply width to the bar
    scrollBar.style.width = scrolled + '%';
});

/* =========================================
   11. CUSTOM MAGNETIC CURSOR
   ========================================= */
const customCursor = document.getElementById('custom-cursor');

// Move the circle with the mouse
document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
});

// Add the 'magnet' expansion effect when hovering over interactive elements
const hoverElements = document.querySelectorAll('a, button, .interactive-card, .interactive-badge');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('cursor-hover'));
});

/* =========================================
   12. THE MATRIX EASTER EGG
   ========================================= */
let secretCode = '';
const matrixTrigger = 'ai';

document.addEventListener('keydown', (e) => {
    // Record the keys pressed
    secretCode += e.key.toLowerCase();
    
    // Only keep the last 2 letters in memory
    if (secretCode.length > 2) {
        secretCode = secretCode.slice(-2); 
    }
    
    // Check if they typed "ai"
    if (secretCode === matrixTrigger) {
        // Change CSS theme to green
        document.body.classList.add('matrix-mode');
        
        // Change canvas particles to green
        particlesArray.forEach(p => p.color = '#00ff00');
        
        // Revert back to cyan after 5 seconds
        setTimeout(() => {
            document.body.classList.remove('matrix-mode');
            particlesArray.forEach(p => p.color = '#00f0ff');
        }, 5000);
    }
});

/* =========================================
   13. 3D HOLOGRAPHIC CARD TILT
   ========================================= */
// This initializes the 3D effect on all your glass cards
VanillaTilt.init(document.querySelectorAll(".glass-card"), {
    max: 10,             // Maximum tilt rotation (degrees)
    speed: 400,          // Speed of the enter/exit transition
    glare: true,         // Enables the glass reflection effect
    "max-glare": 0.15,   // Maximum glare opacity
    scale: 1.02          // Slightly pop the card out on hover
});

/* =========================================
   14. "ASK MY AI" CHATBOT LOGIC (Zero-Server Version)
   ========================================= */
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatBody = document.getElementById('chat-body');

// The AI Knowledge Base (Built directly into the code so browsers don't block it)
const aiKnowledge = {
    "skills": {
        "keywords": ["skill", "tech", "language", "stack", "know", "code"],
        "response": "Prateek is highly skilled in Python, Java, JavaScript, C++, Next.js, Flask, MongoDB, and PyTorch for AI/ML!"
    },
    "education": {
        "keywords": ["education", "university", "degree", "study", "college", "cgpa", "school"],
        "response": "He is pursuing his B.Tech CSE in AI at Bennett University (7/10 CGPA). He completed his 12th at M.D. Ind. Pub School and 10th at OP Jindal Modern School."
    },
    "projects": {
        "keywords": ["project", "work", "build", "portfolio", "made", "app", "system"],
        "response": "He has built complex systems like an AI Stock Predictor, SmartCampus+, a Student Management System, and a Disaster Response Platform."
    },
    "contact": {
        "keywords": ["contact", "hire", "email", "number", "phone", "reach", "call", "linkedin", "github"],
        "response": "Reach him at prateeknarang.79@gmail.com or call +91 9992066033. You can also use the contact form or social links at the bottom of the page!"
    },
    "certifications": {
        "keywords": ["certif", "course", "learn", "achieve", "google", "coursera", "infosys"],
        "response": "He has 10 global certifications from Google, Coursera, and Infosys, covering AI, Java, Networking, Microprocessors, and Operating Systems."
    },
    "leadership": {
        "keywords": ["lead", "volunteer", "club", "ieee", "event", "sportikon"],
        "response": "He is the Multimedia SubHead for the IEEE WIE Club and volunteers for multimedia content at events like Sportikon and Zenivia."
    },
    "default": {
        "keywords": [],
        "response": "I'm a simple AI. Try asking specifically about Prateek's 'skills', 'education', 'certifications', or 'projects'."
    }
};

// Open/Close UI
chatToggle.addEventListener('click', () => {
    chatWindow.classList.remove('hidden-chat');
    chatToggle.style.display = 'none';
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('hidden-chat');
    chatToggle.style.display = 'block';
});

// The AI Brain Function
function handleChat() {
    const text = chatInput.value.toLowerCase().trim();
    if (!text) return;

    // Show user message on screen
    chatBody.innerHTML += `<div class="user-msg">${chatInput.value}</div>`;
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll down

    // Simulate thinking delay
    setTimeout(() => {
        let finalResponse = aiKnowledge.default.response;

        // Search the knowledge base for keyword matches
        for (const category in aiKnowledge) {
            if (category === 'default') continue; 
            
            const hasMatch = aiKnowledge[category].keywords.some(keyword => text.includes(keyword));
            
            if (hasMatch) {
                finalResponse = aiKnowledge[category].response;
                break; 
            }
        }

        // Show AI response on screen
        chatBody.innerHTML += `<div class="bot-msg">${finalResponse}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Play click sound when AI responds
        if (typeof audioUnlocked !== 'undefined' && audioUnlocked && typeof hoverSound !== 'undefined') {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => {});
        }
        
    }, 600); // 0.6 second delay
}

// Listen for Clicks or Enter Key
sendBtn.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});