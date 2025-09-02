import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

async function addTestReview() {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const testReview = {
      productId: 'test-product',
      userId: 'test-user',
      userName: 'Test User',
      rating: 5,
      comment: 'This is a test review to verify the reviews functionality',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const docRef = await addDoc(reviewsCollection, testReview);
    console.log('Test review added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding test review:', error);
  }
}

addTestReview();
