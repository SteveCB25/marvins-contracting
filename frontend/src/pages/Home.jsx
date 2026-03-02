import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { galleryImages as fallbackGalleryImages } from '../mock/data';
import Lightbox from '../components/Lightbox';
import OptimizedImage from '../components/OptimizedImage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { 
  ChefHat,
  Bath, 
  Layers,
  PaintRoller,
  Phone,
  MapPin,
  Shield,
  Star,
  Clock,
  Users,
  Languages,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Home = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${API}/gallery`);
        if (response.data && response.data.images) {
          setGalleryImages(response.data.images);
        } else {
          setGalleryImages(fallbackGalleryImages);
        }
      } catch (error) {
        setGalleryImages(fallbackGalleryImages);
      } finally {
        setIsLoadingGallery(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  const handleImageClick = (index) => {
    const actualIndex = galleryImages.findIndex(img => img.id === filteredImages[index].id);
    setCurrentImageIndex(actualIndex);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('https://formspree.io/f/mojnzzwr', {
        ...formData,
        language: language,
        _subject: `New Inquiry from ${formData.name} - Marvin's Contracting`
      });
      
      if (response.status === 200) {
        toast({
          title: t.contact.success,
          description: language === 'en' ? 'We will get back to you shortly.' : 'Nos pondremos en contacto con usted en breve.',
        });
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: language === 'en' ? 'Failed to submit. Please try again.' : 'Error al enviar. Por favor, inténtelo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    { 
      id: 'kitchen', 
      icon: ChefHat, 
      title: language === 'en' ? 'Kitchen Remodeling' : 'Remodelación de Cocinas',
      description: language === 'en' 
        ? 'Transform your kitchen into a stunning, functional space that becomes the heart of your home.'
        : 'Transforme su cocina en un espacio impresionante y funcional que se convierta en el corazón de su hogar.',
      span: 'md:col-span-2 md:row-span-2'
    },
    { 
      id: 'bathroom', 
      icon: Bath, 
      title: language === 'en' ? 'Bathroom Renovation' : 'Renovación de Baños',
      description: language === 'en'
        ? 'Create your personal spa retreat with modern fixtures and timeless design.'
        : 'Cree su refugio de spa personal con accesorios modernos y diseño atemporal.',
      span: 'md:col-span-1 md:row-span-2'
    },
    { 
      id: 'flooring', 
      icon: Layers, 
      title: language === 'en' ? 'Flooring' : 'Pisos',
      description: language === 'en'
        ? 'Expert installation of hardwood, tile, and luxury vinyl for lasting beauty.'
        : 'Instalación experta de madera, azulejo y vinilo de lujo para una belleza duradera.',
      span: 'md:col-span-1'
    },
    { 
      id: 'painting', 
      icon: PaintRoller, 
      title: language === 'en' ? 'Painting' : 'Pintura',
      description: language === 'en'
        ? 'Professional interior and exterior painting that protects and beautifies.'
        : 'Pintura profesional interior y exterior que protege y embellece.',
      span: 'md:col-span-1'
    }
  ];

  const trustSignals = [
    { icon: Clock, label: language === 'en' ? '20+ Years Experience' : '20+ Años de Experiencia' },
    { icon: Shield, label: language === 'en' ? 'Licensed & Insured' : 'Licenciado y Asegurado' },
    { icon: Star, label: language === 'en' ? '5-Star Rated' : 'Calificación 5 Estrellas' },
    { icon: Users, label: language === 'en' ? 'Locally Owned' : 'Propiedad Local' }
  ];

  // Get a good hero image (first kitchen image)
  const heroImage = galleryImages.find(img => img.category === 'kitchen') || galleryImages[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Marvin's <span className="text-[#D4AF37]">Contracting</span>
              </h1>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors uppercase tracking-wide"
                >
                  {t.nav[section]}
                </button>
              ))}
            </div>

            {/* Phone + Language */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:+12404674308" 
                className="hidden sm:flex items-center gap-2 text-[#1A1A1A] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>(240) 467-4308</span>
              </a>
              
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors"
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'ES' : 'EN'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100 py-4"
          >
            <div className="px-4 space-y-3">
              {['home', 'services', 'portfolio', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className="block w-full text-left py-2 text-gray-600 hover:text-[#1A1A1A] font-medium"
                >
                  {t.nav[section]}
                </button>
              ))}
              <a 
                href="tel:+12404674308" 
                className="flex items-center gap-2 py-2 text-[#D4AF37] font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>(240) 467-4308</span>
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {heroImage && (
            <img 
              src={heroImage.url || heroImage.thumbnail}
              alt="Quality craftsmanship"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                {language === 'en' ? 'Licensed & Insured' : 'Licenciado y Asegurado'}
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              {language === 'en' ? 'Quality Craftsmanship.' : 'Artesanía de Calidad.'}
              <br />
              <span className="text-[#D4AF37]">
                {language === 'en' ? 'Reliable Service.' : 'Servicio Confiable.'}
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl"
            >
              {language === 'en' 
                ? 'Trusted local contractor serving Maryland. We transform your vision into reality with expert craftsmanship.'
                : 'Contratista local de confianza sirviendo Maryland. Transformamos su visión en realidad con artesanía experta.'}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-none px-8 py-6 font-bold tracking-wide uppercase text-sm transition-all hover:translate-y-[-2px]"
                data-testid="hero-cta-primary"
              >
                {language === 'en' ? 'Request a Free Estimate' : 'Solicitar Presupuesto Gratis'}
              </Button>
              <Button
                onClick={() => scrollToSection('portfolio')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1A1A1A] rounded-none px-8 py-6 font-bold tracking-wide uppercase text-sm transition-all"
                data-testid="hero-cta-secondary"
              >
                {language === 'en' ? 'View Our Work' : 'Ver Nuestro Trabajo'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals Bar */}
      <section className="bg-[#1A1A1A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustSignals.map((signal, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <signal.icon className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-white text-sm font-medium">{signal.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="py-20 md:py-32 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
              {language === 'en' ? 'What We Do' : 'Lo Que Hacemos'}
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4">
              {t.services.title}
            </motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              const serviceImage = galleryImages.find(img => img.category === service.id);
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative overflow-hidden bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 ${service.span}`}
                >
                  {/* Background Image */}
                  {serviceImage && (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={serviceImage.thumbnail}
                        alt={service.title}
                        className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
                    <div className="w-14 h-14 bg-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ServiceIcon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 flex-grow">
                      {service.description}
                    </p>
                    
                    <button 
                      onClick={() => {
                        setActiveFilter(service.id);
                        scrollToSection('portfolio');
                      }}
                      className="inline-flex items-center gap-2 text-[#1A1A1A] font-semibold hover:text-[#D4AF37] transition-colors group/btn"
                    >
                      <span className="uppercase text-sm tracking-wide">
                        {language === 'en' ? 'View Projects' : 'Ver Proyectos'}
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
              {language === 'en' ? 'Our Portfolio' : 'Nuestro Portafolio'}
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4 mb-6">
              {t.portfolio.title}
            </motion.h2>
            
            {/* Filter Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {['all', 'kitchen', 'bathroom', 'flooring', 'painting'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 text-sm font-medium uppercase tracking-wide transition-all ${
                    activeFilter === filter 
                      ? 'bg-[#1A1A1A] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' 
                    ? (language === 'en' ? 'All' : 'Todos')
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingGallery ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] bg-gray-200 animate-pulse" />
              ))
            ) : (
              filteredImages.slice(0, 6).map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleImageClick(index)}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-gray-100"
                >
                  <OptimizedImage
                    src={image.thumbnail}
                    blur={image.blur}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold text-lg">
                        {image.category?.charAt(0).toUpperCase() + image.category?.slice(1)}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {language === 'en' ? 'Click to view' : 'Haga clic para ver'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {filteredImages.length > 6 && (
            <div className="text-center mt-12">
              <p className="text-gray-500">
                {language === 'en' 
                  ? `Showing 6 of ${filteredImages.length} projects` 
                  : `Mostrando 6 de ${filteredImages.length} proyectos`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 md:py-32 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
              {language === 'en' ? 'Transformations' : 'Transformaciones'}
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4">
              {language === 'en' ? 'Before & After' : 'Antes y Después'}
            </motion.h2>
          </motion.div>

          {/* Before/After Slider */}
          {galleryImages.length >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage 
                    src={galleryImages[0]?.url || galleryImages[0]?.thumbnail} 
                    alt="Before" 
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage 
                    src={galleryImages[1]?.url || galleryImages[1]?.thumbnail} 
                    alt="After" 
                  />
                }
                className="aspect-video rounded-none shadow-2xl"
                style={{ height: '500px' }}
              />
              <div className="flex justify-between mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <span>{language === 'en' ? 'Before' : 'Antes'}</span>
                <span>{language === 'en' ? 'After' : 'Después'}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
                {language === 'en' ? 'About Us' : 'Sobre Nosotros'}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4 mb-8">
                {t.about.title}
              </h2>
              
              <p className="text-xl font-medium text-[#1A1A1A] mb-6">
                {t.about.intro}
              </p>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t.about.paragraph1}
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t.about.paragraph2}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {t.about.focusPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D4AF37]" />
                    <span className="text-[#1A1A1A] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {galleryImages[2] && (
                <img 
                  src={galleryImages[2].url || galleryImages[2].thumbnail}
                  alt="Our work"
                  className="w-full aspect-[4/5] object-cover"
                />
              )}
              <div className="absolute -bottom-8 -left-8 bg-[#D4AF37] text-white p-8">
                <p className="text-4xl font-bold">20+</p>
                <p className="text-sm uppercase tracking-wide">
                  {language === 'en' ? 'Years Experience' : 'Años de Experiencia'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
                {language === 'en' ? 'Get In Touch' : 'Contáctenos'}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-8">
                {t.contact.title}
              </h2>
              
              <p className="text-gray-400 text-lg mb-12 max-w-md">
                {language === 'en' 
                  ? 'Ready to start your project? Contact us today for a free estimate. We respond within 24 hours.'
                  : '¿Listo para comenzar su proyecto? Contáctenos hoy para un presupuesto gratis. Respondemos en 24 horas.'}
              </p>

              <div className="space-y-6">
                <a href="tel:+12404674308" className="flex items-center gap-4 text-white hover:text-[#D4AF37] transition-colors group">
                  <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">
                      {language === 'en' ? 'Call Us' : 'Llámenos'}
                    </p>
                    <p className="text-xl font-semibold">(240) 467-4308</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">
                      {language === 'en' ? 'Service Area' : 'Área de Servicio'}
                    </p>
                    <p className="text-xl font-semibold">Maryland</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                  {language === 'en' ? 'Request a Free Estimate' : 'Solicitar Presupuesto Gratis'}
                </h3>
                
                <div className="space-y-5">
                  <Input
                    type="text"
                    name="name"
                    placeholder={t.contact.form.name}
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-none border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                    data-testid="contact-name"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      type="email"
                      name="email"
                      placeholder={t.contact.form.email}
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-none border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                      data-testid="contact-email"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder={t.contact.form.phone}
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-none border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                      data-testid="contact-phone"
                    />
                  </div>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleFormChange}
                    className="w-full rounded-none border border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-4 px-3 text-gray-600"
                    data-testid="contact-service"
                  >
                    <option value="">{language === 'en' ? 'Select a Service' : 'Seleccione un Servicio'}</option>
                    <option value="kitchen">{language === 'en' ? 'Kitchen Remodeling' : 'Remodelación de Cocinas'}</option>
                    <option value="bathroom">{language === 'en' ? 'Bathroom Renovation' : 'Renovación de Baños'}</option>
                    <option value="flooring">{language === 'en' ? 'Flooring' : 'Pisos'}</option>
                    <option value="painting">{language === 'en' ? 'Painting' : 'Pintura'}</option>
                    <option value="other">{language === 'en' ? 'Other' : 'Otro'}</option>
                  </select>
                  
                  <Textarea
                    name="message"
                    placeholder={t.contact.form.message}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full rounded-none border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] resize-none"
                    data-testid="contact-message"
                  />
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-none py-6 font-bold tracking-wide uppercase text-sm transition-all disabled:opacity-50"
                    data-testid="contact-submit"
                  >
                    {isSubmitting 
                      ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                      : t.contact.form.submit}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Marvin's <span className="text-[#D4AF37]">Contracting</span>
              </h2>
              <p className="text-gray-500 text-sm">{t.footer.tagline}</p>
            </div>
            
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Marvin's Contracting. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Home;
