import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, BookOpen, FileText, GraduationCap, ShieldCheck, 
  Search, Megaphone, TrendingUp, Star, User, Quote, Sparkles,
  ChevronRight, Clock, Download, Eye, Linkedin, Twitter, Instagram, ExternalLink, Briefcase, MapPin, Building2,
  Globe, Youtube
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SEO } from '../components/SEO';

export const Home = () => {
  const { years, subjects, resources, extraResources, news, jobs, user, profile, loading } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const trendingResources = resources.slice(0, 4);
  const featuredSubjects = subjects.slice(0, 6);
  const latestNews = news.slice(0, 1)[0];
  const latestJobs = jobs.slice(0, 3);

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "3rd Year, CSE",
      content: "This platform is a lifesaver! I found all the handwritten notes I needed for my end-term exams in one place.",
      avatar: "RV"
    },
    {
      name: "Priya Sharma",
      role: "2nd Year, ECE",
      content: "The previous year papers are so well-organized. It saved me hours of searching on random websites.",
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      role: "4th Year, ME",
      content: "Verified resources and a clean UI. Best study hub for RTU students. Highly recommended!",
      avatar: "AP"
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      <SEO />
      {/* 1. Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10 relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 shadow-sm backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-emerald-500 animate-pulse" />
            Aayush Ki Mehnat
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-sans font-black tracking-tight text-gray-900 leading-[1.1]"
          >
            Ultimate RTU Notes & Books for <span className="text-emerald-600 italic">B.Tech Students</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-500 max-w-3xl font-sans leading-relaxed"
          >
            Download free RTU (Rajasthan Technical University) study material. Access handwritten notes, standard books, previous year question papers, and assignments all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute inset-0 bg-emerald-600/5 blur-3xl rounded-full group-hover:bg-emerald-600/10 transition-all"></div>
            <div className="relative flex items-center bg-white border-2 border-black/5 rounded-[2rem] p-2 shadow-2xl shadow-black/5 focus-within:border-emerald-500/30 transition-all">
              <div className="pl-6 pr-4 text-gray-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Search for subjects, notes, or books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchTerm && navigate(`/years`)}
                className="flex-1 py-4 bg-transparent outline-none text-lg text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={() => searchTerm && navigate(`/years`)}
                className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hidden md:block"
              >
                Search Now
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/years"
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              Explore Resources <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="bg-white text-gray-900 border-2 border-black/5 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-4 hover:scale-105 transition-transform">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">RTU Notes & Books</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Handwritten RTU notes and standard textbooks structured by year and subject for easy access.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-4 hover:scale-105 transition-transform">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Previous Year Papers</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Ace your RTU exams with a complete collection of previous year question papers and solutions.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-4 hover:scale-105 transition-transform">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">RTU Syllabus</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Stay updated with the latest RTU B.Tech syllabus and academic guidelines for all branches.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-4 hover:scale-105 transition-transform">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Globe size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Global Resources</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Access curated external tools, YouTube channels, and documentation for deeper learning.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-4 hover:scale-105 transition-transform">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Verified Material</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Our admin team verifies every resource to ensure you get the most accurate RTU study material.
          </p>
        </div>
      </section>

      {/* 4. Quick Categories */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Academic <span className="text-emerald-600">Years</span>
            </h2>
            <p className="text-gray-500 text-lg">Browse resources by academic year.</p>
          </div>
          <Link to="/years" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {years.map((year, idx) => (
            <Link
              key={year.id}
              to={`/years/${encodeURIComponent(year.name)}/subjects`}
              className="group p-8 bg-white rounded-[2rem] border border-black/5 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <GraduationCap size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{year.name}</h3>
                  <p className="text-gray-500 text-sm">Access all subjects and notes for this year.</p>
                </div>
                <div className="pt-4 flex items-center text-emerald-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Explore <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4.5 Global Resources Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Global <span className="text-emerald-600">Hub</span>
            </h2>
            <p className="text-gray-500 text-lg">Curated external tools and learning platforms.</p>
          </div>
          <Link to="/resources" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Explore All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraResources.slice(0, 4).map((resource) => (
            <motion.a
              key={resource.id}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group p-6 bg-white rounded-[2rem] border border-black/5 hover:border-emerald-500/20 hover:shadow-xl transition-all flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {resource.category === 'YouTube' ? <Youtube size={20} /> : <Globe size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{resource.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1">{resource.description || 'Verified external resource.'}</p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-emerald-600 font-bold text-xs">
                <span>{resource.category}</span>
                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* 5. Latest Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Latest <span className="text-emerald-600">Jobs</span>
            </h2>
            <p className="text-gray-500 text-lg">Explore new IT opportunities, internships, and govt jobs.</p>
          </div>
          <Link to="/jobs" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Jobs <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 flex flex-col h-full"
              >
                <div className="flex justify-between items-start">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    job.type === 'government' ? "bg-red-50 text-red-600" :
                    job.type === 'private' ? "bg-blue-50 text-blue-600" :
                    "bg-green-50 text-green-600"
                  }`}>
                    {job.type}
                  </div>
                  <Briefcase className="text-gray-200" size={32} />
                </div>
                <div className="space-y-2 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Building2 size={14} />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                </div>
                <Link
                  to="/jobs"
                  className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all text-center flex items-center justify-center gap-2"
                >
                  Details <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-gray-500">No jobs posted recently. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Personalized Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-emerald-400 rounded-full text-sm font-bold border border-white/10">
                <User size={16} /> Personalized for You
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                {user ? `Welcome back, ${profile?.displayName || 'Student'}!` : 'Your Personal Learning Hub'}
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                {user 
                  ? "Track your progress, save your favorite subjects, and access your recently viewed resources instantly."
                  : "Create an account to save your favorite resources, track your study progress, and get personalized recommendations."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 text-center"
                >
                  {user ? "Go to Dashboard" : "Sign Up for Free"}
                </Link>
                {!user && (
                  <Link
                    to="/about"
                    className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/10 text-center"
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <Star className="text-yellow-400 mb-4" size={24} />
                  <h4 className="text-white font-bold">Favorites</h4>
                  <p className="text-gray-500 text-xs">Save for later</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <Clock className="text-blue-400 mb-4" size={24} />
                  <h4 className="text-white font-bold">Recent</h4>
                  <p className="text-gray-500 text-xs">Pick up where left</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="text-emerald-400 mb-4" size={24} />
                  <h4 className="text-white font-bold">Verified</h4>
                  <p className="text-gray-500 text-xs">Quality content</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <Sparkles className="text-purple-400 mb-4" size={24} />
                  <h4 className="text-white font-bold">Smart</h4>
                  <p className="text-gray-500 text-xs">AI suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Loved by <span className="text-emerald-600">Students</span>
          </h2>
          <p className="text-gray-500 text-lg">Join thousands of students who trust us for their academic success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 space-y-8 relative"
            >
              <Quote className="absolute top-8 right-8 text-emerald-100" size={48} />
              <p className="text-gray-600 text-lg leading-relaxed italic relative z-10">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/20">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-emerald-600 text-sm font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. Meet the Developer */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-12 md:p-20 space-y-8">
              <div className="space-y-2">
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">The Mind Behind the Platform</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Meet Aayush Sharma</h2>
                <p className="text-gray-500 text-xl">Full Stack Developer</p>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed italic">
                "I built Aayush Ki Mehnat to solve a problem I faced every day. My goal is to make engineering education more accessible and organized for everyone. This is just the beginning of our journey together."
              </p>
              <div className="flex gap-4 pt-4">
                <a 
                  href="https://aayush-ki-pehchan.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10"
                >
                  Visit My Portfolio <Sparkles size={18} className="text-emerald-400" />
                </a>
              </div>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/aayush-sharma-a44062299/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border border-black/5">
                  <Linkedin size={20} />
                </a>
                <a href="https://x.com/aayushSh2003" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border border-black/5">
                  <Twitter size={20} />
                </a>
                <a href="https://www.instagram.com/aayushsh2003" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border border-black/5">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 h-[400px] lg:h-[600px] w-full relative">
              <img 
                src="Aayush_Photo.jpg" 
                alt="Aayush Sharma" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"></div>
              <div className="absolute bottom-8 left-8 text-white lg:hidden">
                <h3 className="text-2xl font-bold">Aayush Sharma</h3>
                <p className="text-emerald-400">Lead Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Ready to Ace Your <br /> <span className="text-emerald-200 italic">RTU Exams?</span>
            </h2>
            <p className="text-emerald-50 max-w-2xl mx-auto text-xl opacity-90">
              Stop wasting time searching for notes. Get everything you need in one organized platform and start studying smarter today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                to="/years"
                className="w-full sm:w-auto bg-white text-emerald-700 px-12 py-5 rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Explore Now <ArrowRight size={24} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-emerald-700/30 text-white px-12 py-5 rounded-[2rem] font-bold text-xl hover:bg-emerald-700/50 transition-all border border-white/20 backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* 11. Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Stay Updated</h2>
              <p className="text-gray-400 text-lg max-w-md">
                Get the latest study materials, exam notifications, and platform updates delivered to your inbox.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-white/10 border border-white/10 text-white px-8 py-5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-full sm:w-80 text-lg"
              />
              <button className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-600/10 to-transparent"></div>
        </div>
      </section>
    </div>
  );
};
