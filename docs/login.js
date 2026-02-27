// ====================================
// Fake Login System (Demo Only)
// ====================================

// Mock database of users
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
  { id: 3, username: "guest", password: "guest123", role: "guest" }
];

// Helper function to simulate hashing (fake)
function fakeHash(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Attempt to login
function login(username, password) {
  console.log("🔐 Attempting login...");
  const user = users.find(u => u.username === username);

  if (!user) {
    console.log("❌ User not found!");
    return false;
  }

  const inputHash = fakeHash(password);
  const storedHash = fakeHash(user.password);

  if (inputHash === storedHash) {
    console.log(`✅ Welcome, ${user.username}! (role: ${user.role})`);
    session.active = true;
    session.user = user;
    return true;
  } else {
    console.log("❌ Invalid password!");
    return false;
  }
}

// Fake session store
let session = {
  active: false,
  user: null
};

// Logout
function logout() {
  if (session.active) {
    console.log(`👋 Goodbye, ${session.user.username}!`);
    session = { active: false, user: null };
  } else {
    console.log("⚠️ No active session.");
  }
}

// Show current session
function showSession() {
  console.log("=== SESSION INFO ===");
  if (session.active) {
    console.log(`User: ${session.user.username}`);
    console.log(`Role: ${session.user.role}`);
  } else {
    console.log("No user logged in.");
  }
  console.log("====================");
}

// Simulate failed login
login("user", "wrongpass");
showSession();

// Simulate correct login
login("user", "user123");
showSession();

// Logout
logout();
showSession();

// Admin login
login("admin", "admin123");
showSession();

// ==========================
// Extra Functions (Dummy)
// ==========================

// Change user password (dummy)
function changePassword(username, oldPass, newPass) {
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log("❌ User not found!");
    return;
  }
  if (fakeHash(oldPass) === fakeHash(user.password)) {
    user.password = newPass;
    console.log(`🔄 Password updated for ${username}`);
  } else {
    console.log("❌ Old password incorrect!");
  }
}

// Role check
function checkRole(requiredRole) {
  if (!session.active) {
    console.log("⚠️ Please login first.");
    return false;
  }
  if (session.user.role === requiredRole) {
    console.log(`✅ Access granted for ${requiredRole}`);
    return true;
  } else {
    console.log(`⛔ Access denied. Required role: ${requiredRole}`);
    return false;
  }
}

// Try role check
checkRole("admin");

// ==========================
// Random Filler Code
// ==========================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fakeLoading() {
  console.log("Loading...");
  await delay(500);
  console.log("Still loading...");
  await delay(500);
  console.log("Done ✅");
}

fakeLoading();

