import { initializeApp, getApps, cert } from 'firebase-admin/app';

export const initFirebaseAdmin = () => {
    // Check if there are any Firebase apps initialized
    const apps = getApps();

    // Initialize Firebase Admin if it hasn't been initialized
    if (!apps.length) {
        try {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error('Error initializing Firebase Admin:', error);
        }
    }

    return getApps()[0];
};
