import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function uploadHikerData(userId, data) {
  try {
    await setDoc(doc(db, 'hikers', userId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    console.log('Uploaded data to Firestore:', data);
  } catch (error) {
    console.error('Firestore upload failed:', error);
  }
}
