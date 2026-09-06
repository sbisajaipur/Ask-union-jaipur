// ======================================================
// ASK UNION – SBISA UDAIPUR MODULE
// Direct Firestore REST Reader
// ======================================================

const PROJECT_ID = "ask-union-jaipur-circle";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;


// ======================================================
// FIRESTORE VALUE READER
// ======================================================

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


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ======================================================
// LOAD COLLECTION
// ======================================================

async function loadCollection(
  collection,
  elementId,
  emptyMessage
) {

  const element =
    document.getElementById(elementId);

  if (!element) return;


  try {

    const response = await fetch(
      `${FIRESTORE_BASE}/${collection}`
    );


    if (!response.ok) {

      throw new Error(
        `Firestore HTTP ${response.status}`
      );

    }


    const result =
      await response.json();


    const documents =
      result.documents || [];


    if (documents.length === 0) {

      element.innerHTML =
        `<div class="item">${emptyMessage}</div>`;

      return;

    }


    let html = "";


    documents.forEach(document => {

      const fields =
        document.fields || {};


      const title =
        readValue(fields.title) ||
        readValue(fields.Title) ||
        "Untitled";


      const date =
        readValue(fields.date) ||
        readValue(fields.Date) ||
        "";


      const details =
        readValue(fields.details) ||
        readValue(fields.Details) ||
        "";


      const link =
        readValue(fields.link) ||
        readValue(fields.Link) ||
        "";


      html += `

        <div class="item">

          <b>
            ${escapeHtml(title)}
          </b>

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

    });


    element.innerHTML = html;


  } catch (error) {

    console.error(
      `Error loading ${collection}:`,
      error
    );


    element.innerHTML = `

      <div class="item">

        <b>
          Unable to load information
        </b>

        <p>
          Please refresh the page.
        </p>

      </div>

    `;

  }

}


// ======================================================
// START
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

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
