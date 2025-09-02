import 'server-only';
import admin from 'firebase-admin';

// Only allow these emails to access /admin
const ADMIN_EMAILS = ["samadali1580@gmail.com", "rakeshgupta1361411@gmail.com", "aditaenterpriseindia@gmail.com"];

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export async function verifyAdminToken(token: string): Promise<{ isValid: boolean; email?: string; uid?: string }> {
  if (!token) {
    return { isValid: false };
  }

  try {
    // Verify the Firebase ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;
    const uid = decodedToken.uid;

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return { isValid: false };
    }

    return { isValid: true, email, uid };
  } catch (error) {
    console.error('Token verification error:', error);
    return { isValid: false };
  }
}

export { admin };