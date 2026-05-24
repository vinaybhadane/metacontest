import "server-only";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

/**
 * Lazily initializes the Firebase Admin app only when first needed.
 * This prevents module-load crashes when Admin credentials are not
 * configured (e.g. landing page requests that don't touch the Admin SDK).
 */
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
    );
  }

  // Handle both literal \n in env value and actual newlines
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/**
 * Lazily-resolved Admin Auth instance.
 * Only calls getAdminApp() on first property access.
 */
export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAuth(getAdminApp()) as never)[prop as keyof Auth];
  },
});

/**
 * Lazily-resolved Admin Firestore instance.
 * Only calls getAdminApp() on first property access.
 */
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getFirestore(getAdminApp()) as never)[prop as keyof Firestore];
  },
});
