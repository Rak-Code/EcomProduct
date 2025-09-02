import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZimwUJHGqO4EQv-TwhmoSTZKY8dWbBF4", 
  authDomain: "sports-39a54.firebaseapp.com",
  projectId: "sports-39a54",
  storageBucket: "sports-39a54.firebasestorage.app",
  messagingSenderId: "1073900038402",
  appId: "1:1073900038402:web:adf71b43112bf3e9b9fa1b",
  measurementId: "G-WZGB934696"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  } finally {
    process.exit(0);
  }
}

addTestReview();
