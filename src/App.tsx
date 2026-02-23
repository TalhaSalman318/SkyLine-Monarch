import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, Phone, ChevronDown, ArrowRight, X, ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// --- WebGL Components ---
const Scene = () => {
  const meshRef = useRef<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setScrollProgress(self.progress)
    });
    return () => st.kill();
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 + scrollProgress * 2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 + scrollProgress * 3;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2 - scrollProgress * 2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#333"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const WebGLBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Scene />
    </Canvas>
  </div>
);

// --- Types ---
interface Project {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  floors: number;
  area: number; // Changed to number for filtering
  bedrooms: number;
  category: 'House' | 'Bath' | 'Gazebo';
  style: 'Log' | 'Timber' | 'Pine';
  description: string;
}

// --- Mock Data ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Albatross",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    floors: 2,
    area: 584,
    bedrooms: 3,
    category: 'House',
    style: 'Timber',
    description: "The Albatross project is a masterpiece of modern wooden architecture. Designed with spacious living areas and large panoramic windows, it offers a perfect blend of luxury and nature. The glued timber construction ensures durability and excellent thermal insulation."
  },
  {
    id: 2,
    title: "Lyubimka",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    floors: 1,
    area: 245,
    bedrooms: 2,
    category: 'House',
    style: 'Timber',
    description: "Lyubimka is a cozy single-story home perfect for a small family or as a weekend getaway. Its compact design maximizes every square meter, providing a comfortable and functional living space."
  },
  {
    id: 3,
    title: "Saint-Tropez",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    floors: 2,
    area: 420,
    bedrooms: 4,
    category: 'House',
    style: 'Timber',
    description: "Inspired by the elegance of the French Riviera, the Saint-Tropez project features a sophisticated design with multiple balconies and a large terrace. It's an ideal choice for those who appreciate fine living and outdoor spaces."
  },
  {
    id: 4,
    title: "Sun City",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200&q=80",
    floors: 1,
    area: 310,
    bedrooms: 3,
    category: 'House',
    style: 'Timber',
    description: "Sun City is designed to capture as much natural light as possible. With its open-plan layout and high ceilings, it feels incredibly spacious and airy. The perfect home for sun lovers."
  },
  {
    id: 5,
    title: "Pushkino",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
    floors: 2,
    area: 280,
    bedrooms: 3,
    category: 'House',
    style: 'Timber',
    description: "A classic design that never goes out of style. Pushkino offers a traditional look with modern amenities, making it a versatile choice for any landscape."
  },
  {
    id: 6,
    title: "Renaissance",
    subtitle: "Residential house made of glued timber",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    floors: 3,
    area: 720,
    bedrooms: 5,
    category: 'House',
    style: 'Timber',
    description: "The Renaissance project is our most ambitious design yet. Spanning three floors, it includes everything from a private gym to a home cinema. A true statement of success."
  },
  {
    id: 7,
    title: "Nordic Spa",
    subtitle: "Premium wooden bath complex",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80",
    floors: 1,
    area: 85,
    bedrooms: 1,
    category: 'Bath',
    style: 'Log',
    description: "A luxurious bath complex featuring a traditional sauna, a cold plunge pool, and a relaxation area with a fireplace. Built with thick cedar logs for an authentic experience."
  },
  {
    id: 8,
    title: "Forest Retreat",
    subtitle: "Modern garden gazebo",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    floors: 1,
    area: 35,
    bedrooms: 0,
    category: 'Gazebo',
    style: 'Pine',
    description: "An elegant open-air gazebo designed for summer dining and relaxation. Features a built-in BBQ area and integrated lighting."
  }
];

// --- Components ---

const MagneticButton: React.FC<{ children: React.ReactNode, className?: string, to: string }> = ({ children, className, to }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link ref={btnRef} to={to} className={className}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-gradient-to-b from-black/60 to-transparent'}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white uppercase">Skyline Mon Ranch</Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <Link to="/about" className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white' : ''}`}>About</Link>
            <Link to="/services" className={`hover:text-white transition-colors ${location.pathname === '/services' ? 'text-white' : ''}`}>Services</Link>
            <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : ''}`}>Projects</Link>
            <Link to="/blog" className={`hover:text-white transition-colors ${location.pathname === '/blog' ? 'text-white' : ''}`}>Blog</Link>
            <Link to="/contacts" className={`hover:text-white transition-colors ${location.pathname === '/contacts' ? 'text-white' : ''}`}>Contacts</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>
          <MagneticButton to="/" className="hidden sm:block px-6 py-2.5 border border-white/30 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all">
            Choose Project
          </MagneticButton>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-xl font-bold tracking-tighter uppercase">Skyline</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {[
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Projects', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contacts', path: '/contacts' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-serif hover:text-white/60 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Get in touch</p>
              <p className="text-2xl font-medium mb-2">8 800 750 32 45</p>
              <p className="text-white/60">hello@skylinemonranch.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={32} />
            </button>
            <form onSubmit={handleSearch} className="w-full max-w-4xl relative">
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, styles, materials..."
                className="w-full bg-transparent border-b-2 border-white/20 py-6 text-4xl md:text-6xl font-serif outline-none focus:border-white transition-colors"
              />
              <button type="submit" className="absolute right-0 bottom-6 p-2">
                <ArrowRight size={48} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-6 bg-[#141414]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-4 text-white/40">
        <Phone size={18} />
        <span className="text-xl font-medium text-white">8 800 750 32 45</span>
      </div>
      <div className="text-white/40 text-sm">
        © 2024 Skyline Mon Ranch. All rights reserved.
      </div>
      <div className="flex gap-6 text-sm text-white/60">
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
        <a href="#" className="hover:text-white transition-colors">Facebook</a>
        <a href="#" className="hover:text-white transition-colors">YouTube</a>
      </div>
    </div>
  </footer>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative aspect-[4/3] overflow-hidden group cursor-pointer rounded-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <img 
        ref={imgRef}
        src={project.image} 
        alt={project.title}
        className="w-full h-[120%] object-cover absolute top-0 left-0 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 w-full p-8 transition-all duration-500">
        <div className={`transition-all duration-500 ${isHovered ? '-translate-y-24' : 'translate-y-0'}`}>
          <h3 className="text-2xl font-serif mb-1">{project.title}</h3>
          <p className="text-sm text-white/60">{project.subtitle}</p>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-8 right-8"
            >
              <div className="flex justify-between items-center mb-6 text-xs uppercase tracking-widest text-white/50">
                <div className="flex flex-col gap-1">
                  <span>Floors</span>
                  <span className="text-white text-base font-medium">{project.floors}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>Area</span>
                  <span className="text-white text-base font-medium">{project.area} m²</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>Bedrooms</span>
                  <span className="text-white text-base font-medium">{project.bedrooms}</span>
                </div>
              </div>
              <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm text-sm font-medium hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                Learn More <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Pages ---

const About = () => (
  <div className="min-h-screen pt-24 pb-20">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center gsap-reveal"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 block">Our Story</span>
        <h1 className="text-5xl md:text-7xl font-serif mb-6">Crafting Legacies in Wood</h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Since 1998, Skyline Mon Ranch has been at the forefront of sustainable timber construction, blending traditional craftsmanship with modern engineering.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-6 gsap-reveal">
          <h2 className="text-3xl font-serif">A Tradition of Excellence</h2>
          <p className="text-base text-white/60 leading-relaxed">
            We believe that a home should be more than just a structure; it should be a living testament to the beauty of nature and the skill of the human hand. Our journey began in a small workshop, and today, we are proud to have built over 500 unique architectural masterpieces across the globe.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-3xl font-serif mb-1">25+</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-serif mb-1">500+</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Projects Completed</p>
            </div>
          </div>
        </div>
        <div className="aspect-video lg:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl gsap-reveal">
          <img 
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80" 
            alt="Our Workshop" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Sustainability", desc: "We use only certified timber from responsibly managed forests, ensuring that every project gives back to the earth." },
          { title: "Craftsmanship", desc: "Our master builders bring decades of experience to every joint, every beam, and every finish." },
          { title: "Innovation", desc: "We combine ancient techniques with state-of-the-art technology for unmatched precision and durability." }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-8 rounded-sm space-y-4 border border-white/5">
            <h3 className="text-xl font-serif">{item.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Services Data ---
const SERVICES_DATA = [
  {
    slug: "architectural-design",
    title: "Architectural Design",
    desc: "Bespoke blueprints tailored to your lifestyle and the natural landscape.",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
    fullDesc: "Our architectural design process is a collaborative journey. We start by understanding your vision, the unique characteristics of your site, and your functional requirements. Our team of expert architects then crafts detailed blueprints that harmonize with the natural environment, utilizing the latest in sustainable design principles and timber engineering.",
    features: ["Site Analysis", "Concept Development", "3D Visualization", "Technical Blueprints"]
  },
  {
    slug: "timber-construction",
    title: "Timber Construction",
    desc: "Expert assembly of log and timber frame structures using premium wood.",
    img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    fullDesc: "We specialize in the construction of high-end log and timber frame homes. Using only the finest, sustainably sourced wood, our master builders combine traditional joinery techniques with modern precision. Every beam is carefully selected and every joint is expertly crafted to ensure structural integrity and aesthetic perfection.",
    features: ["Log Home Assembly", "Timber Framing", "Glued Timber Construction", "Structural Engineering"]
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    desc: "Warm, modern interiors that celebrate the natural texture of wood.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    fullDesc: "Our interior design philosophy is centered around creating spaces that feel both luxurious and grounded. We celebrate the natural warmth and texture of wood, complementing it with modern finishes and thoughtful lighting. From custom furniture to integrated storage solutions, we ensure every detail contributes to a cohesive and inviting atmosphere.",
    features: ["Space Planning", "Material Selection", "Custom Cabinetry", "Lighting Design"]
  },
  {
    slug: "landscape-integration",
    title: "Landscape Integration",
    desc: "Harmonizing your home with its surroundings for a seamless outdoor experience.",
    img: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80",
    fullDesc: "A Skyline Mon Ranch home is never an island. We design with the landscape in mind, creating seamless transitions between indoor and outdoor living. Our landscape integration services include site grading, terrace design, and the selection of native plantings that enhance the natural beauty of your property while providing privacy and functionality.",
    features: ["Terrace & Deck Design", "Native Landscaping", "Outdoor Living Spaces", "Site Grading"]
  }
];

const Services = () => (
  <div className="min-h-screen pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-24">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">What We Do</span>
        <h1 className="text-5xl md:text-8xl font-serif mb-8">Comprehensive Design & Build</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES_DATA.map((service, i) => (
          <Link 
            key={i}
            to={`/services/${service.slug}`}
            className="group relative aspect-video rounded-sm overflow-hidden cursor-pointer block"
          >
            <motion.div 
              whileHover={{ y: -10 }}
              className="w-full h-full"
            >
              <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-12">
                <h3 className="text-3xl font-serif mb-4">{service.title}</h3>
                <p className="text-white/60 max-w-md group-hover:text-white transition-colors">{service.desc}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICES_DATA.find(s => s.slug === slug);

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-serif mb-4">Service not found</h2>
        <button onClick={() => navigate('/services')} className="text-white underline">Back to services</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-5xl md:text-7xl font-serif mb-12">{service.title}</h1>
        
        <div className="aspect-video rounded-sm overflow-hidden mb-16">
          <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-serif">Overview</h2>
            <p className="text-xl text-white/70 leading-relaxed">
              {service.fullDesc}
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              Our commitment to quality and sustainability ensures that every project we undertake is built to last for generations. We use only the finest materials and employ the most skilled craftsmen in the industry.
            </p>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-2xl font-serif border-b border-white/10 pb-4">Key Features</h2>
            <ul className="space-y-4">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-white/80">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link to="/contacts" className="inline-block w-full py-4 bg-white text-black text-center font-bold rounded-sm hover:bg-white/90 transition-all">
              Inquire About Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Blog Data ---
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  img: string;
  content: string;
}

const BLOG_POSTS: BlogPost[] = [
  { 
    id: 1, 
    slug: "choosing-timber",
    title: "Choosing the Right Timber for Your Climate", 
    date: "Oct 12, 2023", 
    img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    content: "Selecting the right timber is crucial for the longevity and performance of your wooden home. Different species react differently to moisture, temperature fluctuations, and UV exposure. In this guide, we explore the best options for various climatic zones..."
  },
  { 
    id: 2, 
    slug: "modern-minimalism",
    title: "Modern Minimalism in Wooden Architecture", 
    date: "Sep 28, 2023", 
    img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200&q=80",
    content: "Minimalism isn't just about having less; it's about making every element count. When applied to wooden architecture, minimalism highlights the natural beauty of the grain and the precision of the joinery..."
  },
  { 
    id: 3, 
    slug: "benefits-log-home",
    title: "The Benefits of Living in a Log Home", 
    date: "Aug 15, 2023", 
    img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
    content: "Beyond their aesthetic appeal, log homes offer exceptional energy efficiency, natural air filtration, and a unique sense of tranquility. Discover why more people are choosing log construction for their primary residences..."
  },
  { 
    id: 4, 
    slug: "sustainable-forestry",
    title: "Sustainable Forestry: Our Commitment", 
    date: "Jul 02, 2023", 
    img: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80",
    content: "At Skyline Mon Ranch, sustainability is at the core of everything we do. We partner with certified forests to ensure that every tree harvested is replaced, maintaining the ecological balance for future generations..."
  },
  { 
    id: 5, 
    slug: "natural-light-design",
    title: "Designing for Natural Light", 
    date: "Jun 18, 2023", 
    img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    content: "Natural light can transform a space, making it feel larger, warmer, and more inviting. Our architectural designs prioritize large windows and strategic orientations to maximize daylight throughout the year..."
  },
  { 
    id: 6, 
    slug: "winter-maintenance",
    title: "Winter Maintenance for Timber Structures", 
    date: "May 24, 2023", 
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    content: "Winter can be harsh on any building, but timber structures require specific care to stay in top condition. From checking seals to managing snow loads, here's what you need to know to protect your home..."
  }
];

const Blog = () => (
  <div className="min-h-screen pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-24 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Journal</span>
        <h1 className="text-5xl md:text-8xl font-serif mb-8">The Art of Living</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {BLOG_POSTS.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group cursor-pointer">
            <div className="aspect-[4/3] rounded-sm overflow-hidden mb-6">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <span className="text-xs uppercase tracking-widest text-white/40 mb-2 block">{post.date}</span>
            <h3 className="text-xl font-serif group-hover:text-white transition-colors">{post.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-serif mb-4">Post not found</h2>
        <button onClick={() => navigate('/blog')} className="text-white underline">Back to journal</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">{post.date}</span>
        <h1 className="text-4xl md:text-6xl font-serif mb-12">{post.title}</h1>
        
        <div className="aspect-video rounded-sm overflow-hidden mb-12">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            {post.content}
          </p>
          <p className="text-lg text-white/60 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  );
};

const Contacts = () => (
  <div className="min-h-screen pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="gsap-reveal">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-8xl font-serif mb-12">Let's Build Your Dream</h1>
          
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-full"><MapPin size={24} /></div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-white/40 mb-2">Office</h4>
                <p className="text-lg">123 Architecture Way, Timber Valley, CA 90210</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-full"><Phone size={24} /></div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-white/40 mb-2">Phone</h4>
                <p className="text-base">8 800 750 32 45</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-full"><User size={24} /></div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-white/40 mb-2">Email</h4>
                <p className="text-lg">hello@skylinemonranch.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-12 rounded-sm gsap-reveal">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-4 outline-none focus:border-white transition-colors" placeholder="talha" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-sm p-4 outline-none focus:border-white transition-colors" placeholder="talha@skylinemonranch.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">Subject</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-4 outline-none focus:border-white transition-colors" placeholder="New Project Inquiry" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40">Message</label>
              <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-sm p-4 outline-none focus:border-white transition-colors resize-none" placeholder="Tell us about your dream home..."></textarea>
            </div>
            <button className="w-full py-5 bg-white text-black font-bold rounded-sm hover:bg-white/90 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [category, setCategory] = useState<'All' | 'House' | 'Bath' | 'Gazebo'>('All');
  const [style, setStyle] = useState<'All' | 'Log' | 'Timber' | 'Pine'>('All');
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 1000]);
  const [bedrooms, setBedrooms] = useState<number | 'All'>('All');
  const [floors, setFloors] = useState<number | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (heroImgRef.current) {
      gsap.to(heroImgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroImgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      if (category !== 'All' && p.category !== category) return false;
      if (style !== 'All' && p.style !== style) return false;
      if (p.area < areaRange[0] || p.area > areaRange[1]) return false;
      if (bedrooms !== 'All' && p.bedrooms !== bedrooms) return false;
      if (floors !== 'All' && p.floors !== floors) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(query) || 
          p.subtitle.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.style.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query);
        if (!matches) return false;
      }
      
      return true;
    });
  }, [category, style, areaRange, bedrooms, floors, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div ref={heroImgRef} className="absolute inset-0 h-[120%] -top-[10%]">
          <img 
            src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero House"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-serif max-w-4xl mx-auto leading-tight mb-8 gsap-reveal">
            {searchQuery ? `Search results for "${searchQuery}"` : "We don't build houses, we build a better life"}
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-[0.3em] gsap-reveal">
            {searchQuery ? `${filteredProjects.length} projects found` : "Custom Architectural Projects"}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                window.history.replaceState({}, '', '/');
              }}
              className="mt-8 text-sm border-b border-white/40 pb-1 hover:border-white transition-colors gsap-reveal"
            >
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <div className="w-full max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <div className="glass-panel p-6 rounded-sm flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-4 border-r border-white/10 pr-8">
            {(['All', 'House', 'Bath', 'Gazebo'] as const).map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-sm font-medium transition-all pb-1 ${category === cat ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-1 items-center gap-6 overflow-x-auto scrollbar-hide">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Style</span>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer appearance-none"
              >
                <option value="All" className="bg-[#1a1a1a]">All Styles</option>
                <option value="Log" className="bg-[#1a1a1a]">Log Houses</option>
                <option value="Timber" className="bg-[#1a1a1a]">Timber Houses</option>
                <option value="Pine" className="bg-[#1a1a1a]">Pine Houses</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Area</span>
              <select 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'All') setAreaRange([0, 1000]);
                  else if (val === 'small') setAreaRange([0, 300]);
                  else if (val === 'medium') setAreaRange([300, 500]);
                  else if (val === 'large') setAreaRange([500, 1000]);
                }}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer appearance-none"
              >
                <option value="All" className="bg-[#1a1a1a]">All Sizes</option>
                <option value="small" className="bg-[#1a1a1a]">Up to 300 m²</option>
                <option value="medium" className="bg-[#1a1a1a]">300 - 500 m²</option>
                <option value="large" className="bg-[#1a1a1a]">500+ m²</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Bedrooms</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button 
                    key={num}
                    onClick={() => setBedrooms(num)}
                    className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs transition-colors ${bedrooms === num ? 'bg-white text-black' : 'border border-white/20 hover:bg-white/10'}`}
                  >
                    {num}{num === 4 ? '+' : ''}
                  </button>
                ))}
                <button 
                  onClick={() => setBedrooms('All')}
                  className={`px-2 h-6 flex items-center justify-center rounded-sm text-xs transition-colors ${bedrooms === 'All' ? 'bg-white text-black' : 'border border-white/20 hover:bg-white/10'}`}
                >
                  All
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Floors</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(num => (
                  <button 
                    key={num}
                    onClick={() => setFloors(num)}
                    className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs transition-colors ${floors === num ? 'bg-white text-black' : 'border border-white/20 hover:bg-white/10'}`}
                  >
                    {num}
                  </button>
                ))}
                <button 
                  onClick={() => setFloors('All')}
                  className={`px-2 h-6 flex items-center justify-center rounded-sm text-xs transition-colors ${floors === 'All' ? 'bg-white text-black' : 'border border-white/20 hover:bg-white/10'}`}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid & Sidebar */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-xl font-serif">No projects found matching your criteria</p>
              <button 
                onClick={() => {
                  setCategory('All');
                  setStyle('All');
                  setAreaRange([0, 1000]);
                  setBedrooms('All');
                  setFloors('All');
                }}
                className="mt-4 text-white underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        <aside className="lg:col-span-1 space-y-12">
          <div className="space-y-6">
            <h4 className="text-lg font-serif border-b border-white/10 pb-4">Categories</h4>
            <div className="space-y-4">
              {[
                { title: "Larch Houses", img: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80", style: 'Log' },
                { title: "Glued Timber Houses", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", style: 'Timber' },
                { title: "Pine Houses", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80", style: 'Pine' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group cursor-pointer flex items-center gap-4"
                  onClick={() => setStyle(item.style as any)}
                >
                  <div className="w-20 h-20 overflow-hidden rounded-sm">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-white transition-colors">{item.title}</p>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">View Collection</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-sm space-y-6">
            <h4 className="text-xl font-serif">Need help choosing?</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Our specialists will help you find the perfect project for your needs and budget.
            </p>
            <button className="w-full py-3 bg-white text-black text-sm font-bold rounded-sm hover:bg-white/90 transition-all">
              Request Consultation
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === Number(id));

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-serif mb-4">Project not found</h2>
        <button onClick={() => navigate('/')} className="text-white underline">Back to projects</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 gsap-reveal"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">{project.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">{project.title}</h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-8 border-y border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Area</span>
                <p className="text-xl font-medium">{project.area} m²</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Floors</span>
                <p className="text-xl font-medium">{project.floors}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Bedrooms</span>
                <p className="text-xl font-medium">{project.bedrooms}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Style</span>
                <p className="text-xl font-medium">{project.style}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Category</span>
                <p className="text-xl font-medium">{project.category}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-sm hover:bg-white/90 transition-all">
                Request Quote
              </button>
              <button className="px-8 py-4 border border-white/20 font-bold rounded-sm hover:bg-white/10 transition-all">
                Download PDF Plan
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-sm overflow-hidden gsap-reveal"
          >
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* More Projects */}
        <div className="mt-32">
          <h3 className="text-3xl font-serif mb-12">Similar Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.filter(p => p.id !== project.id).slice(0, 3).map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen pt-48 pb-24 flex items-center justify-center">
    <div className="text-center max-w-2xl px-6">
      <h1 className="text-5xl md:text-7xl font-serif mb-8">{title}</h1>
      <p className="text-lg text-white/60 leading-relaxed mb-12">
        We are currently refining this section to provide you with the most accurate and inspiring architectural insights. Stay tuned for updates on our latest {title.toLowerCase()} and innovations.
      </p>
      <Link to="/" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-white/80 hover:border-white/80 transition-all">
        Explore Projects <ArrowRight size={18} />
      </Link>
    </div>
  </div>
);

// --- Main App ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  useEffect(() => {
    // Smooth Scroll with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global reveal animation for elements with 'gsap-reveal' class
    gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a1a1a] text-white font-sans antialiased relative overflow-x-hidden">
        <WebGLBackground />
        <ScrollToTop />
        <Navbar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
