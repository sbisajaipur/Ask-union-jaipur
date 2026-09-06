// ======================================================
// ASK UNION – SBISA UDAIPUR MODULE
// Firebase Firestore Public Display
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyAzMEREwPKnifSIrB5CvaC8-CFbVIa5zF0",
  authDomain: "ask-union-jaipur-circle.firebaseapp.com",
  projectId: "ask-union-jaipur-circle",
  storageBucket: "ask-union-jaipur-circle.firebasestorage.app",
  messagingSenderId: "584327754977",
  appId: "1:584327754977:web:7164a85c007165743ef3a"
};


// Load Firebase
const firebaseScript = document.createElement("script");
firebaseScript.src =
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";

document.head.appendChild(firebaseScript);


firebaseScript.onload = function () {

  const firestoreScript = document.createElement("script");

  firestoreScript.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

  document.head.appendChild(firestoreScript);


  firestoreScript.onload = function () {

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

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


    // ================================================
    // LOAD FIRESTORE COLLECTION
    // ================================================

    function loadCollection(collectionName, elementId, emptyMessage) {

      const element = document.getElementById(elementId);

      if (!element) return;

      element.innerHTML =
        '<div class="item">Loading...</div>';


      db.collection(collectionName)
        .orderBy("createdAt", "desc")
        .get()

        .then(snapshot => {

          if (snapshot.empty) {

            element.innerHTML =
              `<div class="item">${emptyMessage}</div>`;

            return;
          }


          let html = "";


          snapshot.forEach(doc => {

            const data = doc.data();


            // Support both old and new field names
            const title =
              data.title ||
              data.Title ||
              "Untitled";


            const date =
              data.date ||
              data.Date ||
              "";


            const details =
              data.details ||
              data.Details ||
              "";


            const link =
              data.link ||
              data.Link ||
              "";


            html += `

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
                        href="${escapeAttribute(link)}"
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

        })


        .catch(error => {

          console.error(
            "Firestore error:",
            collectionName,
            error
          );


          element.innerHTML = `

            <div class="item">

              <b>Information temporarily unavailable.</b>

              <p>
                Please try again after a moment.
              </p>

            </div>

          `;

        });

    }


    // ================================================
    // SECURITY HELPERS
    // ================================================

    function escapeHtml(value) {

      return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {

      return String(value)

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

    }

  };

};
