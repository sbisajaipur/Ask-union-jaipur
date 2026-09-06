const PROJECT_ID = "ask-union-jaipur-circle";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;


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


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function renderItem(fields) {

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
      `${FIRESTORE_BASE}/${collection}?v=10`,
      {
        cache: "no-store"
      }
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


    if (!documents.length) {

      element.innerHTML =
        `<div class="item">
          ${escapeHtml(emptyMessage)}
        </div>`;

      return;
    }


    element.innerHTML =
      documents
        .map(doc =>
          renderItem(doc.fields || {})
        )
        .join("");


  } catch (error) {

    console.error(
      `Error loading ${collection}:`,
      error
    );


    element.innerHTML = `
      <div class="item">

        <b>
          Information temporarily unavailable.
        </b>

        <p>
          Please refresh the page.
        </p>

      </div>
    `;

  }

}


document.addEventListener(
  "DOMContentLoaded",
  () => {

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
