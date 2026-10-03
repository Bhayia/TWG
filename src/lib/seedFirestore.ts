import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  initialSiteSettings,
  initialEvents,
  initialMemberships,
  initialProducts,
  initialJourneys,
  initialFaqs,
} from './initialData';

export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const settingsDocRef = doc(db, 'siteSettings', 'general');
    const settingsSnap = await getDoc(settingsDocRef);

    if (!settingsSnap.exists()) {
      console.log('Seeding initial siteSettings into Firestore...');
      await setDoc(settingsDocRef, initialSiteSettings);

      // Seed Events
      for (const event of initialEvents) {
        await setDoc(doc(db, 'events', event.id), event);
      }

      // Seed Memberships
      for (const membership of initialMemberships) {
        await setDoc(doc(db, 'memberships', membership.id), membership);
      }

      // Seed Products
      for (const product of initialProducts) {
        await setDoc(doc(db, 'products', product.id), product);
      }

      // Seed Journeys
      for (const journey of initialJourneys) {
        await setDoc(doc(db, 'journeys', journey.id), journey);
      }

      // Seed FAQs
      for (const faq of initialFaqs) {
        await setDoc(doc(db, 'faqs', faq.id), faq);
      }

      console.log('Firestore successfully seeded with initial blueprint content.');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not auto-seed Firestore (may lack write permissions or be offline):', error);
    return false;
  }
}

export async function forceReseedFirestore(): Promise<void> {
  const settingsDocRef = doc(db, 'siteSettings', 'general');
  await setDoc(settingsDocRef, initialSiteSettings);

  for (const event of initialEvents) {
    await setDoc(doc(db, 'events', event.id), event);
  }
  for (const membership of initialMemberships) {
    await setDoc(doc(db, 'memberships', membership.id), membership);
  }
  for (const product of initialProducts) {
    await setDoc(doc(db, 'products', product.id), product);
  }
  for (const journey of initialJourneys) {
    await setDoc(doc(db, 'journeys', journey.id), journey);
  }
  for (const faq of initialFaqs) {
    await setDoc(doc(db, 'faqs', faq.id), faq);
  }
}
