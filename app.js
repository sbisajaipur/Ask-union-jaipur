const PROJECT_ID = "ask-union-jaipur-circle";

const FIRESTORE_BASE =
  "https://firestore.googleapis.com/v1/projects/" +
  PROJECT_ID +
  "/databases/(default)/documents";


/* =========================
   FIRESTORE VALUE READER
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
   HTML SECURITY
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
   LOAD FIRESTORE COLLECTION
========================= */

async function loadCollection(
  collection,
  elementId,
  emptyMessage
) {

  const element =
    document.getElementById(elementId);

  if (!element) return;


  try {

    element.innerHTML =
      "<p>Loading...</p>";


    const url =
      FIRESTORE_BASE +
      "/" +
      collection +
      "?v=10";


    console.log(
      "Loading Firestore:",
      collection
    );


    const response =
      await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "application/json"
        }
      });


    /* =========================
       CHECK HTTP RESPONSE
    ========================= */

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Firestore error:",
        response.status,
        errorText
      );


      throw new Error(
        "HTTP " +
        response.status
      );

    }


    /* =========================
       READ JSON
    ========================= */

    const result =
      await response.json();


    console.log(
      collection +
      " response:",
      result
    );


    const documents =
      result.documents || [];


    /* =========================
       NO DATA
    ========================= */

    if (documents.length === 0) {

      element.innerHTML =
        '<div class="about-card">' +

          '<p>' +
          escapeHtml(emptyMessage) +
          '</p>' +

        '</div>';

      return;

    }


    /* =========================
       CREATE HTML
    ========================= */

    let html = "";


    documents.forEach(function(doc) {

      const fields =
        doc.fields || {};


      /* TITLE */

      const title =
        readValue(fields.title) ||
        readValue(fields.Title) ||
        readValue(fields.name) ||
        readValue(fields.Name) ||
        "Untitled";


      /* DATE */

      const date =
        readValue(fields.date) ||
        readValue(fields.Date) ||
        readValue(fields.createdAt) ||
        readValue(fields.CreatedAt) ||
        "";


      /* DETAILS */

      const details =
        readValue(fields.details) ||
        readValue(fields.Details) ||
        readValue(fields.description) ||
        readValue(fields.Description) ||
        readValue(fields.message) ||
        readValue(fields.Message) ||
        "";


      /* LINK */

      const link =
        readValue(fields.link) ||
        readValue(fields.Link) ||
        readValue(fields.url) ||
        readValue(fields.URL) ||
        "";


      html +=
        '<div class="about-card">' +


          '<strong>' +
          escapeHtml(title) +
          '</strong>' +


          (
            date
            ?

              '<small style="' +
              'display:block;' +
              'margin-top:6px;' +
              'opacity:.65;' +
              '">' +

              escapeHtml(date) +

              '</small>'

            : ""
          ) +


          (
            details
            ?

              '<p style="' +
              'margin-top:10px;' +
              'line-height:1.6;' +
              '">' +

              escapeHtml(details) +

              '</p>'

            : ""
          ) +


          (
            link
            ?

              '<a ' +
              'href="' +
              escapeHtml(link) +
              '" ' +
              'target="_blank" ' +
              'rel="noopener" ' +
              'class="hero-btn">' +

              'OPEN PDF / LINK →' +

              '</a>'

            : ""
          ) +


        '</div>';

    });


    element.innerHTML = html;


  } catch (error) {

    console.error(
      "Error loading " +
      collection +
      ":",
      error
    );


    element.innerHTML =
      '<div class="about-card">' +

        '<strong>' +
        'Unable to load information.' +
        '</strong>' +

        '<p>' +
        'Please refresh the page and try again.' +
        '</p>' +

      '</div>';

  }

}


/* =========================
   START APP
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
