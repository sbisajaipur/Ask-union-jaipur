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
   LATEST UPDATES — COMPACT + READ MORE
========================================= */

function renderItem(data, collectionName = "") {

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

  const isUpdate = collectionName === "updates";

  return `
    <div class="item ${isUpdate ? "update-card" : ""}">

      <b class="${isUpdate ? "update-title" : ""}">
        ${escapeHtml(title)}
      </b>

      ${
        date
          ? `<span class="${isUpdate ? "update-date" : ""}">
              ${escapeHtml(formatDate(date))}
             </span>`
          : ""
      }

      ${
        details
          ? isUpdate
            ? `
              <div class="update-details">

                <p class="update-preview">
                  ${escapeHtml(details)}
                </p>

                <div class="update-full" hidden>
                  ${escapeHtml(details)}
                </div>

                <button
                  type="button"
                  class="update-read-more"
                  onclick="toggleUpdate(this)"
                  aria-expanded="false">
                  Read More →
                </button>

              </div>
              `
            : `<p>${escapeHtml(details)}</p>`
      : ""
      }

      ${
        link
          ? `
            <a
              href="${escapeHtml(link)}"
              target="_blank"
              rel="noopener noreferrer"
              class="pdf-button">

              <span>📄 Open PDF / Link →</span>

            </a>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================
   READ MORE / READ LESS
========================================= */

function toggleUpdate(button) {

  const card = button.closest(".update-card");

  if (!card) {
    return;
  }

  const preview = card.querySelector(".update-preview");
  const full = card.querySelector(".update-full");

  if (!preview || !full) {
    return;
  }

  const expanded =
    button.getAttribute("aria-expanded") === "true";

  if (expanded) {

    full.hidden = true;
    preview.hidden = false;

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.textContent = "Read More →";

  } else {

    full.hidden = false;
    preview.hidden = true;

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    button.textContent = "Read Less ↑";

  }

}
/* =========================================
   FORMAT DATE
========================================= */

function formatDate(value) {

  if (!value) {
    return "";
  }

  const text = String(value).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {

    const parts = text.split("-");

    return `${parts[2]} ${[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ][Number(parts[1]) - 1]} ${parts[0]}`;

  }

  // ISO timestamp
  const date = new Date(text);

  if (!Number.isNaN(date.getTime())) {

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

  }

  return text;
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

const items = [];

snapshot.forEach(doc => {

  items.push(doc.data());

});

items.sort((a, b) => {

  const dateA = new Date(
    a.date || a.Date || 0
  ).getTime();

  const dateB = new Date(
    b.date || b.Date || 0
  ).getTime();

  return dateB - dateA;

});

items.forEach(data => {

  html += renderItem(data, collectionName);

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
