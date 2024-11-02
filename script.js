const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// IndexedDB setup
let db;
const request = indexedDB.open("UserDatabase", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("users", { keyPath: "email" });
    objectStore.createIndex("password", "password", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database initialized");
};

request.onerror = function(event) {
    console.log("Database error:", event.target.errorCode);
};

// Register function
function registerUser(email, password) {
    const transaction = db.transaction(["users"], "readwrite");
    const objectStore = transaction.objectStore("users");

    const request = objectStore.add({ email: email, password: password });
    request.onsuccess = function() {
        alert("User registered successfully");
        container.classList.remove("active"); // Switch back to login form after successful signup
    };
    request.onerror = function() {
        alert("Registration failed: Email already exists");
    };
}

// Login function
function loginUser(email, password) {
    const transaction = db.transaction(["users"], "readonly");
    const objectStore = transaction.objectStore("users");

    const request = objectStore.get(email);
    request.onsuccess = function() {
        if (request.result && request.result.password === password) {
            alert("Login successful!");
        } else {
            alert("Login failed: Incorrect email or password");
        }
    };
    request.onerror = function() {
        alert("Login error");
    };
}

// Event listeners for form submissions
document.querySelector(".sign-up form").onsubmit = function(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    if (email && password) {
        registerUser(email, password);
    } else {
        alert("Please enter both email and password");
    }
};

document.querySelector(".sign-in form").onsubmit = function(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    if (email && password) {
        loginUser(email, password);
    } else {
        alert("Please enter both email and password");
    }
};
