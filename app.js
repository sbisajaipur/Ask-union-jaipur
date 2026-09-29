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

/* =========================================
   UPDATE CARD — COMPACT MOBILE DESIGN
========================================= */

function getUpdateThumbnail(data) {

  const image =
    data.image ||
    data.imageUrl ||
    data.thumbnail ||
    data.photo ||
    data.photoUrl ||
    "";

  if (image) {
    return `
      <img
        src="${escapeHtml(image)}"
        alt=""
        loading="lazy"
        class="update-thumb-img">
    `;
  }

  const title = String(
    data.title ||
    data.Title ||
    data.name ||
    data.Name ||
    ""
  ).toLowerCase();

  let icon = "📰";

  if (
    title.includes("strike") ||
    title.includes("हड़ताल") ||
    title.includes("ufbu")
  ) {
    icon = "📣";
  } else if (
    title.includes("meeting") ||
    title.includes("meeting") ||
    title.includes("conciliation")
  ) {
    icon = "🤝";
  } else if (
    title.includes("pli") ||
    title.includes("loan")
  ) {
    icon = "💰";
  } else if (
    title.includes("birthday") ||
    title.includes("जन्मदिन")
  ) {
    icon = "🌹";
  }

  return `
    <div class="update-thumb-fallback">
      <span>${icon}</span>
    </div>
  `;
}


/* =========================================
   CREATE CARD
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

  const isUpdate =
    collectionName === "updates";


  /* -----------------------------------------
     LATEST UPDATES
  ----------------------------------------- */

  if (isUpdate) {

    return `
      <article
        class="update-mini-card"
        tabindex="0"
        onclick="openUpdateCard(this)"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openUpdateCard(this)}">

        <div class="update-mini-thumb">
          ${getUpdateThumbnail(data)}
        </div>


        <div class="update-mini-body">

          <div class="update-mini-top">

            <span class="update-mini-badge">
              LATEST UPDATE
            </span>

            ${
              date
                ? `
                  <span class="update-mini-date">
                    📅 ${escapeHtml(formatDate(date))}
                  </span>
                `
                : ""
            }

          </div>


          <h3 class="update-mini-title">
            ${escapeHtml(title)}
          </h3>


          ${
            details
              ? `
                <p class="update-mini-summary">
                  ${escapeHtml(details)}
                </p>
              `
              : ""
          }

        </div>


        <div class="update-mini-arrow">
          ›
        </div>


        <!-- Hidden full content used by Full Post View -->

        <div class="update-source-data" hidden>

          <div class="full-update-title">
            ${escapeHtml(title)}
          </div>

          <div class="full-update-date">
            ${date ? escapeHtml(formatDate(date)) : ""}
          </div>

          <div class="full-update-details">
            ${escapeHtml(details)}
          </div>

          ${
            link
              ? `
                <div class="full-update-link">
                  ${escapeHtml(link)}
                </div>
              `
              : ""
          }

        </div>

      </article>
    `;
  }


  /* -----------------------------------------
     CIRCULARS / EVENTS
     KEEP EXISTING DESIGN
  ----------------------------------------- */

  return `
    <div class="item">

      <b>
        ${escapeHtml(title)}
      </b>

      ${
        date
          ? `
            <span>
              ${escapeHtml(formatDate(date))}
            </span>
          `
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
              rel="noopener noreferrer"
              class="pdf-button">

              <span>
                📄 Open PDF / Link →
              </span>

            </a>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================
   FULL UPDATE VIEW
========================================= */

function openUpdateCard(card) {

  if (!card) {
    return;
  }

  const source =
    card.querySelector(".update-source-data");

  if (!source) {
    return;
  }

  const title =
    source.querySelector(".full-update-title")?.textContent.trim() || "";

  const date =
    source.querySelector(".full-update-date")?.textContent.trim() || "";

  const details =
    source.querySelector(".full-update-details")?.textContent.trim() || "";

  const link =
    source.querySelector(".full-update-link")?.textContent.trim() || "";


  let viewer =
    document.getElementById("updateFullViewer");


  if (!viewer) {

    viewer = document.createElement("div");

    viewer.id = "updateFullViewer";

    viewer.className = "update-full-viewer";

    viewer.innerHTML = `

      <div class="update-viewer-box">

        <button
          type="button"
          class="update-viewer-close"
          onclick="closeUpdateViewer()"
          aria-label="Close">
          ×
        </button>


        <div class="update-viewer-header">

          <span class="update-viewer-back">
            ← Latest Update
          </span>

        </div>


        <div class="update-viewer-content">

          <div class="update-viewer-thumb">
            📣
          </div>

          <span class="update-viewer-badge">
            LATEST UPDATE
          </span>

          <h2 id="viewerUpdateTitle"></h2>

          <div
            id="viewerUpdateDate"
            class="update-viewer-date">
          </div>

          <div
            id="viewerUpdateDetails"
            class="update-viewer-details">
          </div>

          <div
            id="viewerUpdateDocument"
            class="update-viewer-document">
          </div>

        </div>

      </div>

    `;

    document.body.appendChild(viewer);

  }


  document.getElementById(
    "viewerUpdateTitle"
  ).textContent = title;


  document.getElementById(
    "viewerUpdateDate"
  ).textContent = date
    ? `📅 ${date}`
    : "";


  document.getElementById(
    "viewerUpdateDetails"
  ).textContent = details;


  const documentBox =
    document.getElementById(
      "viewerUpdateDocument"
    );


  if (link) {

    documentBox.innerHTML = `
      <a
        href="${escapeHtml(link)}"
        target="_blank"
        rel="noopener noreferrer"
        class="update-document-button">

        📄 Open Related Document / PDF
        <span>↓</span>

      </a>
    `;

  } else {

    documentBox.innerHTML = "";

  }


  viewer.classList.add("active");

  document.body.classList.add(
    "update-viewer-open"
  );

}


/* =========================================
   CLOSE FULL UPDATE
========================================= */

function closeUpdateViewer() {

  const viewer =
    document.getElementById(
      "updateFullViewer"
    );

  if (!viewer) {
    return;
  }

  viewer.classList.remove("active");

  document.body.classList.remove(
    "update-viewer-open"
  );

}


/* ESC KEY CLOSE */
document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {
      closeUpdateViewer();
    }

  }
);
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
