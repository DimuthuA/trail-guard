import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function uploadHikerData(userId, data) {
  try {
    await setDoc(doc(db, 'hikers', userId), data);
    console.log('[uploadService] Uploaded data to Firestore:\n', data);
  } catch (error) {
    console.error('[uploadService] Firestore upload failed:', error);
  }
}
