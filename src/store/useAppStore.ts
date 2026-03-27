import { create } from 'zustand';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, collection, query, where, orderBy, updateDoc, increment, getDocs } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  photoURL?: string;
  favorites?: string[];
}

interface AppState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAuthReady: boolean;
  years: any[];
  subjects: any[];
  resources: any[];
  extraResources: any[];
  news: any[];
  jobs: any[];
  unreadMessages: number;
  loading: {
    auth: boolean;
    years: boolean;
    subjects: boolean;
    resources: boolean;
    extraResources: boolean;
    news: boolean;
    jobs: boolean;
  };
  setAuth: (user: FirebaseUser | null, profile: UserProfile | null) => void;
  setAuthReady: (ready: boolean) => void;
  setYears: (years: any[]) => void;
  setSubjects: (subjects: any[]) => void;
  setResources: (resources: any[]) => void;
  setExtraResources: (resources: any[]) => void;
  setNews: (news: any[]) => void;
  setJobs: (jobs: any[]) => void;
  setUnreadMessages: (count: number) => void;
  toggleFavorite: (resourceId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateYear: (id: string, updates: any) => Promise<void>;
  updateSubject: (id: string, updates: any) => Promise<void>;
  updateResource: (id: string, updates: any) => Promise<void>;
  updateExtraResource: (id: string, updates: any) => Promise<void>;
  updateNews: (id: string, updates: any) => Promise<void>;
  updateJob: (id: string, updates: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  profile: null,
  isAuthReady: false,
  years: [],
  subjects: [],
  resources: [],
  extraResources: [],
  news: [],
  jobs: [],
  unreadMessages: 0,
  loading: {
    auth: true,
    years: true,
    subjects: true,
    resources: true,
    extraResources: true,
    news: true,
    jobs: true,
  },
  setAuth: (user, profile) => set((state) => ({ 
    user, 
    profile, 
    loading: { ...state.loading, auth: false } 
  })),
  setAuthReady: (ready) => set({ isAuthReady: ready }),
  setYears: (years) => set((state) => ({ 
    years, 
    loading: { ...state.loading, years: false } 
  })),
  setSubjects: (subjects) => set((state) => ({ 
    subjects, 
    loading: { ...state.loading, subjects: false } 
  })),
  setResources: (resources) => set((state) => ({ 
    resources, 
    loading: { ...state.loading, resources: false } 
  })),
  setExtraResources: (extraResources) => set((state) => ({ 
    extraResources, 
    loading: { ...state.loading, extraResources: false } 
  })),
  setNews: (news) => set((state) => ({ 
    news, 
    loading: { ...state.loading, news: false } 
  })),
  setJobs: (jobs) => set((state) => ({ 
    jobs, 
    loading: { ...state.loading, jobs: false } 
  })),
  setUnreadMessages: (count: number) => set({ unreadMessages: count }),
  toggleFavorite: async (resourceId) => {
    const { profile, user } = get();
    if (!user || !profile) return;

    const favorites = profile.favorites || [];
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { favorites: newFavorites });
    set({ profile: { ...profile, favorites: newFavorites } });
  },
  updateProfile: async (updates) => {
    const { profile, user } = get();
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
    set({ profile: { ...profile, ...updates } });
  },
  updateYear: async (id, updates) => {
    const ref = doc(db, 'years', id);
    await updateDoc(ref, updates);
  },
  updateSubject: async (id, updates) => {
    const ref = doc(db, 'subjects', id);
    await updateDoc(ref, updates);
  },
  updateResource: async (id, updates) => {
    const ref = doc(db, 'resources', id);
    await updateDoc(ref, updates);
  },
  updateExtraResource: async (id, updates) => {
    const ref = doc(db, 'extra_resources', id);
    await updateDoc(ref, updates);
  },
  updateNews: async (id, updates) => {
    const ref = doc(db, 'news', id);
    await updateDoc(ref, updates);
  },
  updateJob: async (id, updates) => {
    const ref = doc(db, 'jobs', id);
    await updateDoc(ref, updates);
  },
  refreshData: async () => {
    try {
      const yearsSnap = await getDocs(collection(db, 'years'));
      const years = yearsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      get().setYears(years);

      const subjectsSnap = await getDocs(collection(db, 'subjects'));
      const subjects = subjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      get().setSubjects(subjects);

      const resourcesSnap = await getDocs(collection(db, 'resources'));
      const resources = resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      get().setResources(resources);

      const extraResourcesSnap = await getDocs(collection(db, 'extra_resources'));
      const extraResources = extraResourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      get().setExtraResources(extraResources);

      const newsSnap = await getDocs(collection(db, 'news'));
      const news = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      get().setNews(news);

      const jobsSnap = await getDocs(collection(db, 'jobs'));
      const jobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      get().setJobs(jobs);

    } catch (error) {
      console.error('Manual refresh error:', error);
    }
  },
}));

// Auth Listener
let unreadListener: (() => void) | null = null;

export const initAuth = () => {
  onAuthStateChanged(auth, async (user) => {
    // Cleanup previous listener
    if (unreadListener) {
      unreadListener();
      unreadListener = null;
    }

    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const profile = userDoc.exists() 
        ? userDoc.data() as UserProfile 
        : { uid: user.uid, email: user.email!, role: 'user' as const };
      
      useAppStore.getState().setAuth(user, profile);

      // Setup unread messages listener
      if (profile.role === 'admin') {
        unreadListener = onSnapshot(collection(db, 'conversations'), (snapshot) => {
          const totalUnread = snapshot.docs.reduce((acc, doc) => acc + (doc.data().unreadCountAdmin || 0), 0);
          useAppStore.getState().setUnreadMessages(totalUnread);
        });
      } else {
        unreadListener = onSnapshot(doc(db, 'conversations', user.uid), (doc) => {
          if (doc.exists()) {
            useAppStore.getState().setUnreadMessages(doc.data().unreadCountUser || 0);
          } else {
            useAppStore.getState().setUnreadMessages(0);
          }
        });
      }
    } else {
      useAppStore.getState().setAuth(null, null);
      useAppStore.getState().setUnreadMessages(0);
    }
    useAppStore.getState().setAuthReady(true);
  });
};

// Data Listeners
export const initDataListeners = () => {
  // Years
  onSnapshot(collection(db, 'years'), (snapshot) => {
    const years = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    useAppStore.getState().setYears(years);
  }, (error) => {
    console.error('Years listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'years');
  });

  // Subjects
  onSnapshot(collection(db, 'subjects'), (snapshot) => {
    const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    useAppStore.getState().setSubjects(subjects);
  }, (error) => {
    console.error('Subjects listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'subjects');
  });

  // Resources
  onSnapshot(collection(db, 'resources'), (snapshot) => {
    const resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    useAppStore.getState().setResources(resources);
  }, (error) => {
    console.error('Resources listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'resources');
  });

  // Extra Resources
  onSnapshot(collection(db, 'extra_resources'), (snapshot) => {
    const extraResources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    useAppStore.getState().setExtraResources(extraResources);
  }, (error) => {
    console.error('Extra Resources listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'extra_resources');
  });

  // News
  onSnapshot(collection(db, 'news'), (snapshot) => {
    const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    useAppStore.getState().setNews(news);
  }, (error) => {
    console.error('News listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'news');
  });

  // Jobs
  onSnapshot(collection(db, 'jobs'), (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    useAppStore.getState().setJobs(jobs);
  }, (error) => {
    console.error('Jobs listener error:', error);
    handleFirestoreError(error, OperationType.LIST, 'jobs');
  });
};
