import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

// Try to initialize Firebase if configured
const savedFirebaseConfig = localStorage.getItem('pathcode_firebase_config');

if (savedFirebaseConfig) {
  try {
    const config = JSON.parse(savedFirebaseConfig);
    if (config.apiKey && config.projectId) {
      if (!getApps().length) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApps()[0];
      }
      firebaseAuth = getAuth(firebaseApp);
    }
  } catch (err) {
    console.warn('Firebase init warning:', err);
  }
}

export function getFirebaseAuth(): Auth | null {
  return firebaseAuth;
}

export function updateFirebaseConfig(configString: string): boolean {
  try {
    if (!configString.trim()) {
      localStorage.removeItem('pathcode_firebase_config');
      firebaseAuth = null;
      firebaseApp = null;
      return true;
    }
    const config = JSON.parse(configString);
    if (!config.apiKey || !config.projectId) {
      throw new Error('Config missing apiKey or projectId');
    }
    localStorage.setItem('pathcode_firebase_config', JSON.stringify(config));
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApps()[0];
    }
    firebaseAuth = getAuth(firebaseApp);
    return true;
  } catch (err) {
    console.error('Failed to configure Firebase:', err);
    return false;
  }
}

export function getFirebaseStatus(): { isConfigured: boolean; projectId?: string } {
  if (savedFirebaseConfig) {
    try {
      const cfg = JSON.parse(savedFirebaseConfig);
      return { isConfigured: true, projectId: cfg.projectId };
    } catch {
      return { isConfigured: false };
    }
  }
  return { isConfigured: false };
}
