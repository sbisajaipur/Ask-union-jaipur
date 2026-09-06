// ASK UNION – SBISA JAIPUR CIRCLE
// Firebase-connected public app

const firebaseConfig = {
  apiKey: "AIzaSyAzMEREwPKnifSIrB5Cva8D-CFbVIa5zF0",
  authDomain: "ask-union-jaipur-circle.firebaseapp.com",
  projectId: "ask-union-jaipur-circle",
  storageBucket: "ask-union-jaipur-circle.firebasestorage.app",
  messagingSenderId: "584327754977",
  appId: "1:584327754977:web:7164a85c007165743ef3a0"
};

// Load Firebase libraries
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function startFirebase() {
  try {
    await loadScript(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
    );

    await loadScript(
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
    );

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    await renderFirebaseData(db);

  } catch (error) {
    console.error("Firebase error:", error);
  }
}


// Get documents from Firebase
async function getCollection(db, collectionName) {
  const snapshot = await db
    .collection(collectionName)
    .get();

  const items = [];

  snapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data()
    });
  });

  // Newest first
  items.sort((a, b) => {
    return String(b.date || "").localeCompare(String(a.date || ""));
  });

  return items;
}


// Display data on the app
function showList(id, items, emptyText) {

  const element = document.getElementById(id);

  if (!element) return;

  if (!items.length) {
    element.innerHTML =
      `<div class="item">${emptyText}</div>`;
    return;
  }

  element.innerHTML = items.map(item => {

    const title = item.title || "Untitled";
    const details = item.details || "";
    const date = item.date || "";

    let link = "";

    if (item.link) {
      link = `
        <p>
          <a href="${item.link}" target="_blank">
            Open PDF / Link
          </a>
        </p>
      `;
    }

    return `
      <div class="item">
        <b>${title}</b>
        <span>${date}</span>
        <p>${details}</p>
        ${link}
      </div>
    `;

  }).join("");
}


// Load all Firebase content
async function renderFirebaseData(db) {

  const updates = await getCollection(db, "updates");
  const circulars = await getCollection(db, "circulars");
  const events = await getCollection(db, "events");

  showList(
    "updatesList",
    updates,
    "No new updates published yet."
  );

  showList(
    "circularsList",
    circulars,
    "No circulars published yet."
  );

  showList(
    "eventsList",
    events,
    "No upcoming events published yet."
  );
}


// Start
startFirebase();
