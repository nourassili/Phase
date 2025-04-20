// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';


// Init
const db = getFirestore(app);
const app = initializeApp(firebaseConfig);

// Form logic
const form = document.getElementById("email-form");
const emailInput = document.getElementById("email");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  try {
    await addDoc(collection(db, "emails"), { email, created: new Date() });
    alert("Thank you! You're on the list.");
    emailInput.value = "";
  } catch (err) {
    console.error("Error adding email: ", err);
    alert("Something went wrong. Try again later.");
  }
});
