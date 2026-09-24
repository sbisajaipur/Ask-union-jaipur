const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

/**
 * Permanently delete an ASK UNION member.
 *
 * Deletes:
 * 1. Firebase Authentication account
 * 2. Firestore members/{uid} document
 *
 * Only authenticated Admin users can call this function.
 */
exports.deleteMember = onCall(async (request) => {

  // Admin must be logged in.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in as an administrator."
    );
  }

  const adminUid = request.auth.uid;

  // Verify admin account.
  // Your existing admin login uses Firebase Authentication.
  const adminUser = await getAuth().getUser(adminUid);

  // Only allow users whose email is registered as an admin.
  // IMPORTANT: Replace/add your actual admin email(s) here.
  const allowedAdmins = [
  "pareeksunil001@gmail.com"
];

  if (
    !adminUser.email ||
    !allowedAdmins.includes(adminUser.email.toLowerCase())
  ) {
    throw new HttpsError(
      "permission-denied",
      "You are not authorised to delete members."
    );
  }

  const uid = String(request.data?.uid || "").trim();

  if (!uid) {
    throw new HttpsError(
      "invalid-argument",
      "Member UID is required."
    );
  }

  // Never allow the admin to delete their own account.
  if (uid === adminUid) {
    throw new HttpsError(
      "failed-precondition",
      "An administrator cannot delete their own account."
    );
  }

  const memberRef = db.collection("members").doc(uid);
  const memberSnap = await memberRef.get();

  if (!memberSnap.exists) {
    throw new HttpsError(
      "not-found",
      "Member record was not found."
    );
  }

  const member = memberSnap.data() || {};

  try {

    // Delete Firebase Authentication account first.
    await getAuth().deleteUser(uid);

    // Then delete Firestore member record.
    await memberRef.delete();

    return {
      success: true,
      uid,
      employeeNo: member.employeeNo || "",
      name: member.name || "",
      message: "Member permanently deleted."
    };

  } catch (error) {

    console.error("deleteMember error:", error);

    // If Auth account does not exist, still remove orphaned Firestore record.
    if (error.code === "auth/user-not-found") {

      await memberRef.delete();

      return {
        success: true,
        uid,
        employeeNo: member.employeeNo || "",
        name: member.name || "",
        message: "Member record deleted; Firebase Auth account was already absent."
      };
    }

    throw new HttpsError(
      "internal",
      "Unable to permanently delete the member."
    );
  }
});
