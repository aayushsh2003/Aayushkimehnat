import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, Chrome, ArrowRight, BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Login = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { user, profile, isAuthReady } = useAppStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthReady && user && profile) {
      navigate(profile.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, profile, isAuthReady, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
        const isAdminEmail = newUser.email === 'aayushsharma4437@gmail.com';
        
        const userDoc = await getDoc(doc(db, 'users', newUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', newUser.uid), {
            uid: newUser.uid,
            email: newUser.email,
            role: isAdminEmail ? 'admin' : 'user'
          });
        } else if (isAdminEmail && userDoc.data().role !== 'admin') {
          await updateDoc(doc(db, 'users', newUser.uid), {
            role: 'admin'
          });
        }
      }
      // Navigation will be handled by the useEffect above once auth state updates
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const { user: googleUser } = await signInWithPopup(auth, provider);
      
      const userDoc = await getDoc(doc(db, 'users', googleUser.uid));
      const isAdminEmail = googleUser.email === 'aayushsharma4437@gmail.com';
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', googleUser.uid), {
          uid: googleUser.uid,
          email: googleUser.email,
          role: isAdminEmail ? 'admin' : 'user'
        });
      } else if (isAdminEmail && userDoc.data().role !== 'admin') {
        // Promote to admin if email matches but role is not admin
        await updateDoc(doc(db, 'users', googleUser.uid), {
          role: 'admin'
        });
      }
      // Navigation will be handled by the useEffect above once auth state updates
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center py-12 px-4">
      <SEO 
        title={isLogin ? "Login - Aayush Ki Mehnat" : "Sign Up - Aayush Ki Mehnat"} 
        description={isLogin ? "Login to your Aayush Ki Mehnat account to access personalized study materials and save your favorites." : "Create an account at Aayush Ki Mehnat to start your journey with the best RTU study resources."}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/5 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500">
            {isLogin ? 'Login to access your resources' : 'Join Aayush Ki Mehnat today'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/5"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-mono uppercase tracking-widest text-[10px]">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-black/5 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <Chrome size={20} className="text-emerald-600" />
          Google Login
        </button>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
