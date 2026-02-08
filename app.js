let balance = 500;
let earnings = 0;

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function findWorkers() {
  document.getElementById('workerList').innerHTML =
    '<div>Verified Plumber - 0.5km away ⭐4.5</div>';
}

function toggleAvailability() {
  alert('Availability updated');
}

function simulateJob() {
  earnings += 300;
  balance += 300;
  document.getElementById('earnings').innerText = earnings;
  document.getElementById('balance').innerText = balance;
}

function addMoney() {
  balance += 200;
  document.getElementById('balance').innerText = balance;
}
