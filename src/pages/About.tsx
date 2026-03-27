import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Github, Linkedin, Instagram, Twitter, ExternalLink, 
  Target, Eye, Users, BarChart3, Settings, ShieldCheck,
  Heart, MessageSquare, ArrowRight, Sparkles, Zap,
  Search, Download, BookOpen, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const About = () => {
  const howItWorks = [
    {
      title: "Search",
      desc: "Find your subject or resource using our powerful search engine.",
      icon: Search,
      color: "bg-blue-500"
    },
    {
      title: "Select",
      desc: "Choose from handwritten notes, books, or previous year papers.",
      icon: Settings,
      color: "bg-purple-500"
    },
    {
      title: "Study",
      desc: "Download and start mastering your engineering concepts.",
      icon: Zap,
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="space-y-16 md:space-y-32 pb-20 md:pb-32">
      <SEO 
        title="About Us - Aayush Ki Mehnat" 
        description="Learn more about Aayush Ki Mehnat, the ultimate study hub for RTU B.Tech students. Our mission is to provide high-quality study materials for free."
      />
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 md:space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-xs md:text-sm font-bold border border-emerald-100"
          >
            <Sparkles size={14} className="text-emerald-500 md:w-4 md:h-4" />
            Empowering RTU Students
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-tight md:leading-[1.1] lg:leading-[0.95]"
          >
            The Story Behind <br /> <span className="text-emerald-600 italic">Aayush Ki Mehnat</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed"
          >
            We're on a mission to organize the world's engineering resources and make them accessible to every student, everywhere.
          </motion.p>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* 2. Problem → Solution */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The Problem</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                As engineering students, we spent more time searching for quality notes and previous year papers than actually studying. Resources were scattered across random Telegram groups, outdated websites, and expensive photocopies.
              </p>
            </div>
            <div className="w-12 h-1 bg-emerald-200 rounded-full"></div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-600">The Solution</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Aayush Ki Mehnat was built as a centralized, verified, and free-to-use platform. We categorize every resource by year and subject, ensuring that the right material is always just a click away.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-600/5 rounded-[2rem] md:rounded-[3rem] -rotate-3"></div>
            <img 
              src="https://picsum.photos/seed/solution/800/600" 
              alt="Problem Solution" 
              className="rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 border border-black/5 w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-gray-900 rounded-[2rem] md:rounded-[4rem] mx-4 py-12 md:py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 relative z-10">
          <div className="space-y-4 md:space-y-8 p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Target size={24} className="md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-white">Our Mission</h3>
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
              To democratize engineering education by providing high-quality, verified study materials to every student regardless of their background or college.
            </p>
          </div>
          <div className="space-y-4 md:space-y-8 p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Eye size={24} className="md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-white">Our Vision</h3>
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
              To become the most trusted academic resource hub for technical universities in India, fostering a community of collaborative learning and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* New: Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-12 md:space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Our Core <span className="text-emerald-600">Values</span></h2>
          <p className="text-gray-500 text-lg">The principles that guide everything we do.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Student-Centric", desc: "Every decision we make starts with the question: 'How does this help the student?'", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
            { title: "Radical Transparency", desc: "We are open about our processes, our content sources, and our future plans.", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
            { title: "Continuous Innovation", desc: "We never settle. We're always looking for better ways to organize and deliver knowledge.", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-[2rem] border border-black/5 shadow-xl shadow-black/5 space-y-4"
            >
              <div className={`w-12 h-12 ${value.bg} ${value.color} rounded-xl flex items-center justify-center`}>
                <value.icon size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{value.title}</h4>
              <p className="text-gray-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Founder Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-20 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs md:text-sm">The Visionary</span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Aayush Sharma</h2>
                <p className="text-gray-500 text-base md:text-xl">Founder & Lead Developer</p>
              </div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed italic">
                "I started this platform as a side project to help my classmates. Seeing it grow to support thousands of students across Rajasthan is the most rewarding experience of my life. My goal is to keep building tools that solve real problems."
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="https://aayush-ki-pehchan.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all text-sm md:text-base">
                  Portfolio <ExternalLink size={18} />
                </a>
                <div className="flex gap-2 justify-center">
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
            </div>
            <div className="relative h-[400px] lg:h-auto">
              <img 
                src="Aayush_Photo.jpg" 
                alt="Aayush Sharma" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
              <div className="absolute bottom-6 left-6 text-white lg:hidden">
                <h3 className="text-xl font-bold">Aayush Sharma</h3>
                <p className="text-emerald-400 text-sm">Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Built with <span className="text-emerald-600">Modern Tech</span></h2>
          <p className="text-gray-500 text-lg">Leveraging the best tools to provide a seamless experience.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { name: "React 19", icon: "⚛️", desc: "For a fast, reactive UI" },
            { name: "Firebase", icon: "🔥", desc: "Real-time data & auth" },
            { name: "Tailwind CSS", icon: "🎨", desc: "Beautiful, responsive design" },
            { name: "Zustand", icon: "🐻", desc: "Efficient state management" },
            { name: "Motion", icon: "✨", desc: "Smooth animations" },
            { name: "Lucide", icon: "🛡️", desc: "Consistent iconography" },
            { name: "Vite", icon: "⚡", desc: "Blazing fast builds" },
            { name: "TypeScript", icon: "📘", desc: "Type-safe development" }
          ].map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-black/5 shadow-lg shadow-black/5 text-center space-y-2 hover:border-emerald-200 transition-colors"
            >
              <div className="text-3xl mb-2">{tech.icon}</div>
              <h4 className="font-bold text-gray-900">{tech.name}</h4>
              <p className="text-xs text-gray-500">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Future Roadmap */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-emerald-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] md:text-xs font-bold border border-emerald-500/30 uppercase tracking-widest">
                Coming Soon
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The Future of <br /> <span className="text-emerald-400">Aayush Ki Mehnat</span></h2>
              <p className="text-emerald-100/70 text-base md:text-lg leading-relaxed">
                We're not stopping here. Our goal is to build a complete ecosystem for engineering students. Here's what's on the horizon:
              </p>
              <ul className="space-y-3 md:space-y-4">
                {[
                  "AI-Powered Study Assistant",
                  "Interactive Subject Quizzes",
                  "Peer-to-Peer Mentorship Program",
                  "Mobile App for Offline Access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-emerald-100/90 font-medium text-sm md:text-base">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-3 md:space-y-4">
                <div className="h-32 md:h-40 bg-white/10 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-white/10 p-4 md:p-6 flex flex-col justify-end">
                  <p className="text-xl md:text-2xl font-bold">100+</p>
                  <p className="text-[10px] md:text-xs text-emerald-300">New Subjects</p>
                </div>
                <div className="h-48 md:h-56 bg-emerald-500/20 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-emerald-500/20 p-4 md:p-6 flex flex-col justify-end">
                  <p className="text-xl md:text-2xl font-bold">AI</p>
                  <p className="text-[10px] md:text-xs text-emerald-300">Integration</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8">
                <div className="h-48 md:h-56 bg-blue-500/20 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 flex flex-col justify-end">
                  <p className="text-xl md:text-2xl font-bold">iOS/Android</p>
                  <p className="text-[10px] md:text-xs text-blue-300">Native Apps</p>
                </div>
                <div className="h-32 md:h-40 bg-white/10 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-white/10 p-4 md:p-6 flex flex-col justify-end">
                  <p className="text-xl md:text-2xl font-bold">24/7</p>
                  <p className="text-[10px] md:text-xs text-emerald-300">Support</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] -mr-32 -mt-32 md:-mr-48 md:-mt-48"></div>
        </div>
      </section>

      {/* 7. How It Works */}
      <section className="bg-emerald-50 py-16 md:py-24 rounded-[3rem] md:rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">How It <span className="text-emerald-600">Works</span></h2>
            <p className="text-gray-500 text-lg">Three simple steps to academic excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group">
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-emerald-200 -translate-y-1/2"></div>
                  )}
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 space-y-6 relative z-10 group-hover:-translate-y-2 transition-transform">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={28} className="md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Why Trust Us */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Why Trust <span className="text-emerald-600">Us?</span></h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-gray-900">Verified Content</h4>
                <p className="text-gray-500">Every note and book is manually verified by our team of toppers and experts.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-gray-900">Fast & Free</h4>
                <p className="text-gray-500">No hidden costs, no annoying ads, just pure high-speed direct downloads.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-gray-900">Student First</h4>
                <p className="text-gray-500">Built by students, for students. We understand your pain points better than anyone.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
          <img 
            src="https://picsum.photos/seed/trust/800/600" 
            alt="Trust Us" 
            className="rounded-[2.5rem]"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* 8. Contribution Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 text-center space-y-8 md:space-y-10 relative overflow-hidden">
          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20">
              <Heart size={32} className="md:w-10 md:h-10" />
            </div>
            <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Be a Part of the <br /> <span className="text-emerald-400 italic">Movement</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed">
              Have quality notes or previous year papers? Help your juniors and peers by contributing to our library. Your effort can change someone's academic life.
            </p>
            <div className="pt-4">
              <Link
                to="/contact"
                className="inline-flex bg-emerald-500 text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] font-bold text-lg md:text-xl hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 items-center gap-3"
              >
                Start Contributing <ArrowRight size={20} className="md:w-6 md:h-6" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">What Our <span className="text-emerald-600">Community</span> Says</h2>
          <p className="text-gray-500 text-lg">Real stories from real students who use our platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed italic">
              "The organization of subjects by year is brilliant. I don't have to ask anyone for the syllabus or notes anymore. It's all here."
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">SK</div>
              <div>
                <h4 className="font-bold text-gray-900">Saurabh Kumar</h4>
                <p className="text-gray-500 text-sm">RTU Student</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/5 space-y-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed italic">
              "Aayush Ki Mehnat is more than just a website; it's a support system for every B.Tech student in Rajasthan. Thank you for this!"
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">MJ</div>
              <div>
                <h4 className="font-bold text-gray-900">Muskan Jain</h4>
                <p className="text-gray-500 text-sm">RTU Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 text-center space-y-8 md:space-y-10 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Your Academic Success <br /> <span className="text-emerald-200 italic">Starts Here</span>
            </h2>
            <p className="text-emerald-50 max-w-2xl mx-auto text-lg md:text-xl opacity-90">
              Join the community of toppers and start your journey towards excellence today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
              <Link
                to="/years"
                className="w-full sm:w-auto bg-white text-emerald-700 px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] font-bold text-lg md:text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Get Started <ArrowRight size={20} className="md:w-6 md:h-6" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-emerald-700/30 text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] font-bold text-lg md:text-xl hover:bg-emerald-700/50 transition-all border border-white/20 backdrop-blur-sm"
              >
                Student Login
              </Link>
            </div>
          </div>
          <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-[80px] md:blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/20 rounded-full blur-[80px] md:blur-[100px]"></div>
        </div>
      </section>
    </div>
  );
};
