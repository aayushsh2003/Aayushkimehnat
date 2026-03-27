import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare, ArrowRight, Github, Linkedin, Instagram, Twitter, LogIn } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SEO } from '../components/SEO';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Contact = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-12 md:space-y-16 px-4">
      <SEO 
        title="Contact Us - Aayush Ki Mehnat" 
        description="Get in touch with Aayush Ki Mehnat. Whether you have questions, suggestions, or want to contribute, we're here to help RTU students."
      />
      <section className="text-center space-y-4 md:space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
        >
          Get in <span className="text-emerald-600">Touch</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto"
        >
          Have questions, suggestions, or need technical support? We're here to help you succeed in your academic journey.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info & Chat Gateway */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="relative z-10 space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Real-time Support</h2>
                <p className="text-base md:text-xl text-gray-500 leading-relaxed max-w-xl">
                  Need immediate assistance? Our real-time chat support is the fastest way to get your questions answered by our team.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6">
                {user ? (
                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 group/btn"
                  >
                    <MessageSquare size={20} className="md:w-6 md:h-6" />
                    Open Chat Support
                    <ArrowRight size={18} className="md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-gray-900 text-white px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-black transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 group/btn"
                  >
                    <LogIn size={20} className="md:w-6 md:h-6" />
                    Login to Chat
                    <ArrowRight size={18} className="md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              <div className="pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-400">Email Us</p>
                    <p className="text-gray-900 font-bold">aayushsharma4437@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-400">Social Support</p>
                    <p className="text-gray-900 font-bold">DM on Instagram/Twitter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 flex flex-col justify-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Office</h3>
              <p className="text-gray-900 font-medium mb-1">Jaipur, India</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                We're located in the heart of the educational district, easily accessible by public transport.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 flex flex-col justify-center">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Github size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Open Source</h3>
              <p className="text-gray-900 font-medium mb-1">Contribute to the project</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Check out our repository and help us improve the platform for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative group">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
              alt="Support Team"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-lg">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Support" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Support Team</p>
                  <p className="text-xs text-emerald-400 font-medium">Online Now</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white space-y-8 shadow-2xl shadow-black/20">
            <div className="space-y-6">
              <h4 className="text-2xl font-bold">Follow Us</h4>
              <p className="text-gray-400 text-sm">Stay updated with the latest resources and news.</p>
              <div className="flex gap-4">
                <a href="https://x.com/aayushSh2003" className="p-4 bg-white/10 rounded-2xl hover:bg-emerald-500 transition-all hover:-translate-y-1">
                  <Twitter size={24} />
                </a>
                <a href="https://www.linkedin.com/in/aayush-sharma-a44062299/" className="p-4 bg-white/10 rounded-2xl hover:bg-emerald-500 transition-all hover:-translate-y-1">
                  <Linkedin size={24} />
                </a>
                <a href="https://www.instagram.com/aayushsh2003" className="p-4 bg-white/10 rounded-2xl hover:bg-emerald-500 transition-all hover:-translate-y-1">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
