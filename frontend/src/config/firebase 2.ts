// Dummy Firebase Config for Build Fix
// If moving to Supabase, this should eventually be removed.
export const auth = {
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: async () => {},
    createUserWithEmailAndPassword: async () => {},
    signOut: async () => {},
    updateProfile: async () => {},
} as any;
