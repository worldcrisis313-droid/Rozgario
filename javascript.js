// Initialize Leaflet Map
function initMap() {
    // Default coordinates (Bangalore)
    const map = L.map('map').setView([12.9716, 77.5946], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Worker markers with different categories
    const workers = [
        { lat: 12.975, lng: 77.59, type: 'electrician', name: 'Raj', available: true },
        { lat: 12.968, lng: 77.60, type: 'plumber', name: 'Kumar', available: true },
        { lat: 12.973, lng: 77.59, type: 'carpenter', name: 'Suresh', available: true },
        { lat: 12.970, lng: 77.58, type: 'electrician', name: 'Mohan', available: false },
        { lat: 12.976, lng: 77.61, type: 'laborer', name: 'Ravi', available: true }
    ];
    
    // Define custom icons
    const iconColors = {
        electrician: 'blue',
        plumber: 'green',
        carpenter: 'purple',
        laborer: 'orange',
        cleaner: 'red'
    };
    
    // Add worker markers
    workers.forEach(worker => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon ${worker.type}" style="background-color: ${getColor(worker.type)}">
                     <i class="fas fa-${getIcon(worker.type)}"></i>
                     ${worker.available ? '<div class="pulse"></div>' : ''}
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        L.marker([worker.lat, worker.lng], { icon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h4>${worker.name}</h4>
                    <p>${worker.type.charAt(0).toUpperCase() + worker.type.slice(1)}</p>
                    <p>${worker.available ? '✅ Available Now' : '❌ Not Available'}</p>
                    <button onclick="contactWorker('${worker.name}')" class="btn-small">Contact</button>
                </div>
            `);
    });
    
    // Add user location marker
    L.marker([12.9716, 77.5946])
        .addTo(map)
        .bindPopup('Your Location')
        .openPopup();
    
    return map;
}

function getColor(type) {
    const colors = {
        electrician: '#4A90E2',
        plumber: '#2ECC71',
        carpenter: '#9B59B6',
        laborer: '#F39C12',
        cleaner: '#E74C3C'
    };
    return colors[type] || '#95A5A6';
}

function getIcon(type) {
    const icons = {
        electrician: 'bolt',
        plumber: 'wrench',
        carpenter: 'hammer',
        laborer: 'hard-hat',
        cleaner: 'broom'
    };
    return icons[type] || 'user';
}

// Worker Availability Toggle
let isAvailable = true;
document.getElementById('toggleAvailability').addEventListener('click', function() {
    isAvailable = !isAvailable;
    const btn = this;
    if (isAvailable) {
        btn.innerHTML = '<i class="fas fa-toggle-on"></i> Available Now';
        btn.style.color = '#27AE60';
        showNotification('Status updated: Now available for work', 'success');
    } else {
        btn.innerHTML = '<i class="fas fa-toggle-off"></i> Not Available';
        btn.style.color = '#E74C3C';
        showNotification('Status updated: Not available for work', 'warning');
    }
});

// SOS Emergency Button
document.getElementById('sosBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to trigger SOS emergency? This will alert nearby users and authorities.')) {
        // Simulate emergency alert
        this.innerHTML = '<i class="fas fa-exclamation-triangle"></i> SOS ACTIVATED';
        this.style.background = 'linear-gradient(135deg, #E74C3C, #ff6b6b)';
        
        // Show emergency modal
        showNotification('SOS Alert sent to nearby users and emergency contacts!', 'danger');
        
        // Simulate emergency call
        setTimeout(() => {
            alert('Emergency services have been notified. Help is on the way!');
        }, 1000);
    }
});

// Emergency Need Button
document.getElementById('emergencyBtn').addEventListener('click', function() {
    showModal(`
        <div class="emergency-modal">
            <h3><i class="fas fa-bolt"></i> Emergency Service Request</h3>
            <p>Get a worker within 30 minutes (Premium Feature)</p>
            
            <div class="emergency-options">
                <div class="option">
                    <h4>Basic</h4>
                    <p>₹199 additional</p>
                    <button onclick="requestEmergency('basic')" class="btn-small">Select</button>
                </div>
                <div class="option">
                    <h4>Priority</h4>
                    <p>₹499 additional</p>
                    <button onclick="requestEmergency('priority')" class="btn-small">Select</button>
                </div>
            </div>
        </div>
    `);
});

// Payment Processing with Razorpay Integration
document.getElementById('makePaymentBtn').addEventListener('click', function() {
    document.getElementById('paymentModal').style.display = 'flex';
});

function processPayment() {
    const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your actual key
        amount: 120000, // Amount in paise (₹1200 = 120000 paise)
        currency: 'INR',
        name: 'JOBConnect',
        description: 'Payment for electrical work',
        image: 'https://your-logo-url.com/logo.png',
        handler: function(response) {
            showNotification('Payment successful! Payment ID: ' + response.razorpay_payment_id, 'success');
            document.getElementById('paymentModal').style.display = 'none';
            
            // Update wallet balance
            updateWalletBalance(1200);
        },
        prefill: {
            name: 'Demo User',
            email: 'demo@jobconnect.com',
            contact: '9999999999'
        },
        theme: {
            color: '#4A90E2'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

function updateWalletBalance(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    let currentBalance = parseInt(balanceElement.textContent.replace('₹', '').replace(',', ''));
    currentBalance += amount;
    balanceElement.textContent = '₹' + currentBalance.toLocaleString('en-IN');
}

// Voice Command Interface
function startVoiceCommand() {
    const voiceInterface = document.getElementById('voiceInterface');
    voiceInterface.style.display = 'block';
    
    // Animate voice visualizer
    const bars = document.querySelectorAll('.voice-visualizer .bar');
    bars.forEach(bar => {
        bar.style.animation = 'voicePulse 1.5s ease-in-out infinite';
    });
    
    // Simulate voice recognition
    setTimeout(() => {
        document.querySelector('.voice-status').textContent = 'Recognized: "Find electrician near me"';
        
        // Show search results
        setTimeout(() => {
            showNotification('Found 5 electricians within 2km', 'info');
            closeVoiceInterface();
        }, 1500);
    }, 2000);
}

function closeVoiceInterface() {
    document.getElementById('voiceInterface').style.display = 'none';
}

// Referral System
document.getElementById('copyReferralBtn').addEventListener('click', function() {
    const referralCode = document.getElementById('referralCode');
    referralCode.select();
    document.execCommand('copy');
    
    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
    showNotification('Referral code copied to clipboard!', 'success');
    
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
});

// Aadhaar Verification
function verifyAadhaar() {
    showModal(`
        <div class="verification-modal">
            <h3><i class="fas fa-passport"></i> Government Verification</h3>
            
            <div class="verification-step active">
                <i class="fas fa-mobile-alt"></i>
                <h4>Step 1: Mobile Verification</h4>
                <p>Enter mobile number linked with Aadhaar</p>
                <input type="tel" placeholder="Enter mobile number" id="aadhaarMobile">
                <button onclick="sendAadhaarOTP()" class="btn-small">Send OTP</button>
            </div>
            
            <div class="verification-step">
                <i class="fas fa-id-card"></i>
                <h4>Step 2: Aadhaar Number</h4>
                <p>Enter 12-digit Aadhaar number</p>
                <input type="text" placeholder="XXXX XXXX XXXX" disabled>
            </div>
            
            <div class="verification-step">
                <i class="fas fa-shield-alt"></i>
                <h4>Step 3: OTP Verification</h4>
                <p>Enter OTP sent to registered mobile</p>
                <input type="text" placeholder="Enter OTP" disabled>
            </div>
        </div>
    `);
}

function sendAadhaarOTP() {
    const mobile = document.getElementById('aadhaarMobile').value;
    if (mobile.length === 10) {
        showNotification('OTP sent to ' + mobile + ' via SMS & WhatsApp', 'info');
        
        // Simulate OTP sending
        setTimeout(() => {
            alert('OTP sent: 123456 (Demo)');
        }, 1000);
    } else {
        showNotification('Please enter a valid 10-digit mobile number', 'warning');
    }
}

// Training Modules
function showTraining() {
    showModal(`
        <div class="training-modal">
            <h3><i class="fas fa-graduation-cap"></i> Skill Development Training</h3>
            
            <div class="training-courses">
                <div class="course-card">
                    <h4><i class="fas fa-bolt"></i> Advanced Electrical Safety</h4>
                    <p>Government Certified • 40 hours • Free</p>
                    <button class="btn-small">Enroll Now</button>
                </div>
                
                <div class="course-card">
                    <h4><i class="fas fa-vr-cardboard"></i> VR Plumbing Training</h4>
                    <p>Hands-on Simulation • 60 hours • ₹999</p>
                    <button class="btn-small">Enroll Now</button>
                </div>
                
                <div class="course-card">
                    <h4><i class="fas fa-tools"></i> Modern Carpentry Techniques</h4>
                    <p>Skill India Certified • 80 hours • Free</p>
                    <button class="btn-small">Enroll Now</button>
                </div>
            </div>
            
            <div class="training-info">
                <p><i class="fas fa-certificate"></i> All certificates are government recognized</p>
                <p><i class="fas fa-rupee-sign"></i> Subsidized training available for registered workers</p>
            </div>
        </div>
    `);
}

// Insurance Products
function showInsurance() {
    showModal(`
        <div class="insurance-modal">
            <h3><i class="fas fa-shield-heart"></i> Worker Insurance Plans</h3>
            
            <div class="insurance-plans">
                <div class="plan-card basic">
                    <h4>Basic Cover</h4>
                    <div class="plan-price">₹50/month</div>
                    <ul>
                        <li><i class="fas fa-check"></i> Accident Cover: ₹2 Lakhs</li>
                        <li><i class="fas fa-check"></i> Health: ₹1 Lakh</li>
                        <li><i class="fas fa-times"></i> Tool Insurance</li>
                    </ul>
                    <button class="btn-small">Buy Now</button>
                </div>
                
                <div class="plan-card premium">
                    <h4>Premium Cover</h4>
                    <div class="plan-price">₹150/month</div>
                    <ul>
                        <li><i class="fas fa-check"></i> Accident Cover: ₹5 Lakhs</li>
                        <li><i class="fas fa-check"></i> Health: ₹3 Lakhs</li>
                        <li><i class="fas fa-check"></i> Tool Insurance: ₹50,000</li>
                    </ul>
                    <button class="btn-small">Buy Now</button>
                </div>
            </div>
        </div>
    `);
}

// Group Bidding System
function showGroupBids() {
    showModal(`
        <div class="group-bid-modal">
            <h3><i class="fas fa-handshake"></i> Collaborative Projects</h3>
            
            <div class="project-list">
                <div class="project-card">
                    <h4>Commercial Building Electrical Work</h4>
                    <p><i class="fas fa-map-marker-alt"></i> Whitefield • Budget: ₹5,00,000</p>
                    <p><i class="fas fa-users"></i> 4 electricians needed</p>
                    
                    <div class="bid-status">
                        <span>Current Bid: ₹4,75,000</span>
                        <span>Time left: 2 days</span>
                    </div>
                    
                    <div class="bid-actions">
                        <input type="number" placeholder="Enter your bid" value="470000">
                        <button class="btn-small">Join Bid</button>
                    </div>
                </div>
                
                <div class="project-card">
                    <h4>Apartment Complex Plumbing</h4>
                    <p><i class="fas fa-map-marker-alt"></i> Koramangala • Budget: ₹3,00,000</p>
                    <p><i class="fas fa-users"></i> 3 plumbers needed</p>
                    
                    <div class="bid-status">
                        <span>Current Bid: ₹2,80,000</span>
                        <span>Time left: 1 day</span>
                    </div>
                    
                    <button class="btn-small">Join Project Group</button>
                </div>
            </div>
        </div>
    `);
}

// Utility Functions
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        danger: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27AE60',
        error: '#E74C3C',
        warning: '#F39C12',
        info: '#3498DB',
        danger: '#E74C3C'
    };
    return colors[type] || '#3498DB';
}

function contactWorker(name) {
    showModal(`
        <div class="contact-modal">
            <h3>Contact ${name}</h3>
            <p>Choose contact method:</p>
            
            <div class="contact-options">
                <button onclick="initiateCall('${name}')" class="btn-primary">
                    <i class="fas fa-phone-alt"></i> In-App Call
                </button>
                
                <button onclick="startChat('${name}')" class="btn-secondary">
                    <i class="fas fa-comment-alt"></i> Chat with Translation
                </button>
                
                <button onclick="sendVoiceMessage('${name}')" class="btn-small">
                    <i class="fas fa-microphone"></i> Voice Message
                </button>
            </div>
            
            <div class="contact-note">
                <p><i class="fas fa-shield-alt"></i> Phone numbers are masked for privacy protection</p>
            </div>
        </div>
    `);
}

function initiateCall(name) {
    showNotification(`Connecting call to ${name}...`, 'info');
    // In a real app, this would initiate WebRTC call
}

function startChat(name) {
    showNotification(`Opening chat with ${name} (Auto-translate enabled)`, 'info');
}

function sendVoiceMessage(name) {
    showNotification(`Recording voice message for ${name}...`, 'info');
    startVoiceCommand();
}

function requestEmergency(type) {
    const price = type === 'basic' ? 199 : 499;
    showNotification(`Emergency request sent! Additional charge: ₹${price}. Workers notified.`, 'success');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
    
    .marker-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        position: relative;
    }
    
    .pulse {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        animation: pulse 2s infinite;
        opacity: 0.7;
        z-index: -1;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
    
    .map-popup {
        min-width: 200px;
    }
    
    .map-popup h4 {
        margin: 0 0 5px 0;
    }
    
    .map-popup button {
        margin-top: 10px;
        width: 100%;
    }
    
    .emergency-options {
        display: flex;
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .emergency-options .option {
        flex: 1;
        padding: 1rem;
        border: 2px solid #eee;
        border-radius: 8px;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Add some sample data updates
    setInterval(() => {
        // Randomly update earnings
        const earningElement = document.querySelector('.earning-amount');
        const currentEarnings = parseInt(earningElement.textContent.replace('₹', '').replace(',', ''));
        const newEarnings = currentEarnings + Math.floor(Math.random() * 100);
        earningElement.textContent = '₹' + newEarnings;
        
       