import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Instagram, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
                Aayush Ki <span className="text-emerald-600">Mehnat</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              A dedicated platform for engineering students to find high-quality academic resources, notes, and previous year papers. Built with ❤️ for the student community.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/aayushsh2003" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://x.com/aayushSh2003" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/aayush-sharma-a44062299/" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/years" className="text-gray-500 hover:text-emerald-600 transition-colors">Academic Years</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-emerald-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-emerald-600 transition-colors">Contact Support</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-emerald-600 transition-colors">Student Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-gray-500">
                <Mail size={16} className="text-emerald-600" />
                aayushsharma4437@gmail.com
              </li>
              <li className="text-gray-500">
                Found a bug? <Link to="/contact" className="text-emerald-600 font-medium hover:underline">Report it</Link>
              </li>
              <li className="text-gray-500">
                Want to contribute? <Link to="/contact" className="text-emerald-600 font-medium hover:underline">Join us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-sans">
            &copy; {new Date().getFullYear()} Aayush Ki Mehnat. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Developed with <Heart size={14} className="text-red-500 fill-red-500" /> by <a href="https://aayush-ki-pehchan.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:text-emerald-600 transition-colors underline decoration-emerald-500/30 underline-offset-4">Aayush Sharma</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
