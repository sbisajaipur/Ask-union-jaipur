/* =========================================
   ASK UNION – FIREBASE DATA LOADER
   SBISA UDAIPUR MODULE
========================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAzMEREwPKnifSIrB5CvaC8-FbVIa5zF0",
  authDomain: "ask-union-jaipur-circle.firebaseapp.com",
  projectId: "ask-union-jaipur-circle",
  storageBucket: "ask-union-jaipur-circle.firebasestorage.app",
  messagingSenderId: "584327754977",
  appId: "1:584327754977:web:7164a85c007165743ef3a"
};


/* =========================================
   LOAD FIREBASE SDK
========================================= */

function loadScript(src) {

  return new Promise((resolve, reject) => {

    const script = document.createElement("script");

    script.src = src;

    script.onload = resolve;

    script.onerror = () => {
      reject(new Error("Firebase SDK failed to load"));
    };

    document.head.appendChild(script);

  });

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   CREATE CARD
========================================= */

function renderItem(data) {

  const title =
    data.title ||
    data.Title ||
    data.name ||
    data.Name ||
    "Untitled";


  const date =
    data.date ||
    data.Date ||
    "";


  const details =
    data.details ||
    data.Details ||
    data.description ||
    data.Description ||
    data.message ||
    data.Message ||
    "";


  const link =
    data.link ||
    data.Link ||
    data.url ||
    data.URL ||
    "";


  return `
    <div class="item">

      <b>
        ${escapeHtml(title)}
      </b>

      ${
        date
          ? `
            <span>
              ${escapeHtml(date)}
            </span>
          `
          : ""
      }

      ${
        details
          ? `
            <p>
              ${escapeHtml(details)}
            </p>
          `
          : ""
      }

      ${
        link
          ? `
            <a
              href="${escapeHtml(link)}"
              target="_blank"
              rel="noopener"
            >
              Open PDF / Link →
            </a>
          `
          : ""
      }

    </div>
  `;

}


/* =========================================
   FIREBASE INITIALIZATION
========================================= */

let db = null;


async function initializeFirebase() {

  if (window.firebase) {
    return;
  }


  await loadScript(
    "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
  );


  await loadScript(
    "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"
  );


  firebase.initializeApp(firebaseConfig);

}


/* =========================================
   LOAD COLLECTION
========================================= */

async function loadCollection(
  collectionName,
  elementId,
  emptyMessage
) {

  const element =
    document.getElementById(elementId);

  if (!element) {
    return;
  }


  element.innerHTML = `
    <div class="item">
      <p>Loading...</p>
    </div>
  `;


  try {

    if (!db) {
      await initializeFirebase();

      db = firebase.firestore();
    }


    console.log(
      "ASK UNION loading:",
      collectionName
    );


    const snapshot =
      await db
        .collection(collectionName)
        .get();


    console.log(
      "ASK UNION loaded:",
      collectionName,
      snapshot.size
    );


    if (snapshot.empty) {

      element.innerHTML = `
        <div class="item">
          <p>
            ${escapeHtml(emptyMessage)}
          </p>
        </div>
      `;

      return;
    }


    let html = "";


    snapshot.forEach(doc => {

      html += renderItem(
        doc.data()
      );

    });


    element.innerHTML = html;


  } catch (error) {

    console.error(
      "ASK UNION Firebase error:",
      collectionName,
      error
    );


    element.innerHTML = `
      <div class="item">

        <b>
          Information temporarily unavailable.
        </b>

        <p>
          Please refresh the page and try again.
        </p>

      </div>
    `;

  }

}


/* =========================================
   START APPLICATION
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadCollection(
      "updates",
      "updatesList",
      "No new updates published yet."
    );


    loadCollection(
      "circulars",
      "circularsList",
      "No circulars published yet."
    );


    loadCollection(
      "events",
      "eventsList",
      "No upcoming events published yet."
    );

  }
);
