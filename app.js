const PROJECT_ID = "ask-union-jaipur-circle";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAzMEREwPKnifSIrB5CvaC8-FbVIa5zF0",
  authDomain: "ask-union-jaipur-circle.firebaseapp.com",
  projectId: "ask-union-jaipur-circle",
  storageBucket: "ask-union-jaipur-circle.firebasestorage.app",
  messagingSenderId: "584327754977",
  appId: "1:584327754977:web:7164a85c007165743ef3a"
};

const FIRESTORE_BASE =
  "https://firestore.googleapis.com/v1/projects/" +
  PROJECT_ID +
  "/databases/(default)/documents";


/* =========================
   FIRESTORE VALUE
========================= */

function readValue(value) {
  if (!value) return "";

  if (value.stringValue !== undefined)
    return value.stringValue;

  if (value.integerValue !== undefined)
    return value.integerValue;

  if (value.doubleValue !== undefined)
    return value.doubleValue;

  if (value.booleanValue !== undefined)
    return value.booleanValue;

  if (value.timestampValue !== undefined)
    return value.timestampValue;

  return "";
}


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   CREATE ITEM
========================= */

function createItem(fields) {

  const title =
    readValue(fields.title) ||
    readValue(fields.Title) ||
    readValue(fields.name) ||
    readValue(fields.Name) ||
    "Untitled";

  const date =
    readValue(fields.date) ||
    readValue(fields.Date) ||
    "";

  const details =
    readValue(fields.details) ||
    readValue(fields.Details) ||
    readValue(fields.description) ||
    readValue(fields.Description) ||
    readValue(fields.message) ||
    readValue(fields.Message) ||
    "";

  const link =
    readValue(fields.link) ||
    readValue(fields.Link) ||
    readValue(fields.url) ||
    readValue(fields.URL) ||
    "";

  return `
    <div class="item">

      <b>${escapeHtml(title)}</b>

      ${
        date
          ? `<span>${escapeHtml(date)}</span>`
          : ""
      }

      ${
        details
          ? `<p>${escapeHtml(details)}</p>`
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


/* =========================
   REST METHOD
========================= */

async function loadFromREST(collection) {

  const response = await fetch(
    `${FIRESTORE_BASE}/${collection}?pageSize=100&v=11`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Accept": "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "REST HTTP " + response.status
    );
  }

  const data = await response.json();

  return data.documents || [];
}


/* =========================
   LOAD FIREBASE SDK
========================= */

function loadScript(src) {

  return new Promise((resolve, reject) => {

    const script =
      document.createElement("script");

    script.src = src;

    script.onload = resolve;

    script.onerror = () =>
      reject(
        new Error(
          "Could not load Firebase SDK"
        )
      );

    document.head.appendChild(script);

  });

}


/* =========================
   FIREBASE SDK METHOD
========================= */

let firebaseReady = false;

async function loadFromFirebase(collectionName) {

  if (!firebaseReady) {

    await loadScript(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
    );

    await loadScript(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"
    );

    firebase.initializeApp(
      FIREBASE_CONFIG
    );

    firebaseReady = true;
  }

  const db =
    firebase.firestore();

  const snapshot =
    await db
      .collection(collectionName)
      .get();

  const documents = [];

  snapshot.forEach(doc => {

    documents.push({
      fields: doc.data()
    });

  });

  return documents;
}


/* =========================
   MAIN LOADER
========================= */

async function loadCollection(
  collection,
  elementId,
  emptyMessage
) {

  const element =
    document.getElementById(elementId);

  if (!element) return;

  element.innerHTML =
    `<div class="item">
       <p>Loading...</p>
     </div>`;


  let documents = [];


  /* FIRST: REST */

  try {

    console.log(
      "Trying Firestore REST:",
      collection
    );

    documents =
      await loadFromREST(collection);

    console.log(
      "REST successful:",
      collection,
      documents.length
    );

  } catch (restError) {

    console.warn(
      "REST failed:",
      restError
    );


    /* SECOND: FIREBASE SDK */

    try {

      console.log(
        "Trying Firebase SDK:",
        collection
      );

      documents =
        await loadFromFirebase(collection);

      console.log(
        "Firebase SDK successful:",
        collection,
        documents.length
      );

    } catch (firebaseError) {

      console.error(
        "Firebase SDK failed:",
        firebaseError
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

      return;
    }
  }


  /* =========================
     NO DOCUMENTS
  ========================= */

  if (!documents.length) {

    element.innerHTML = `
      <div class="item">
        <p>${escapeHtml(emptyMessage)}</p>
      </div>
    `;

    return;
  }


  /* =========================
     DISPLAY DOCUMENTS
  ========================= */

  element.innerHTML =
    documents
      .map(doc =>
        createItem(doc.fields || {})
      )
      .join("");

}


/* =========================
   START
========================= */

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
