export const getAuth = jest.fn(() => ({ currentUser: null }));
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const onAuthStateChanged = jest.fn((auth, callback) => {
  callback(null);
  return jest.fn();
});
export const getIdToken = jest.fn().mockResolvedValue('mock-token');
export const setPersistence = jest.fn().mockResolvedValue(undefined);
export const browserLocalPersistence = 'LOCAL';

export default {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
  setPersistence,
  browserLocalPersistence,
};
