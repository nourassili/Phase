// Initialize Firebase
// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const birthYearSelect = document.getElementById("birthYear");
  const form = document.getElementById("onboarding-form");
  const resultDiv = document.getElementById("result");
  const menopauseQ = document.getElementById("menopauseQuestion");

  // Populate birth year options
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 10; y >= 1970; y--) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    birthYearSelect.appendChild(option);
  }

  birthYearSelect.addEventListener("change", () => {
    const age = currentYear - parseInt(birthYearSelect.value);
    menopauseQ.style.display = age >= 38 ? "block" : "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const birthYear = parseInt(document.getElementById("birthYear").value);
    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(document.getElementById("endDate").value);
    const goal = document.getElementById("goal").value;
    const age = currentYear - birthYear;
    const today = new Date();

    // Phase logic (estimation)
    const daysSinceStart = (today - start) / (1000 * 60 * 60 * 24);
    let phase = "";

    if (daysSinceStart < 0) {
      phase = "Not started yet";
    } else if (daysSinceStart <= 5) {
      phase = "Menstrual";
    } else if (daysSinceStart <= 13) {
      phase = "Follicular";
    } else if (daysSinceStart <= 16) {
      phase = "Ovulatory";
    } else {
      phase = "Luteal";
    }

    // Build user response
    const userData = {
      birthYear,
      age,
      cyclePhase: phase,
      goal,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      menopauseExperience: age >= 38 ? document.getElementById("menopauseExperience").value : null,
      submittedAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "onboardingResponses"), userData);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Output message
    let message = `<h2>You're ${age} years old and currently in your <strong>${phase} phase</strong>.</h2>`;
    message += `<p>Your current focus is: <strong>${goal.replace("_", " ")}</strong>.</p>`;

    if (age >= 38) {
      const menoInput = document.getElementById("menopauseExperience").value;
      message += `<p>You noted cycle changes: <strong>${menoInput.replace("_", " ")}</strong>.</p>`;
    }

    resultDiv.innerHTML = message;
  });
});
