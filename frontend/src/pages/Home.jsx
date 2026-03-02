import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { galleryImages as fallbackGalleryImages } from '../mock/data';
import Lightbox from '../components/Lightbox';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Hammer, 
  Paintbrush, 
  Home as HomeIcon, 
  Bath, 
  Shield, 
  Languages,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allGalleryImages, setAllGalleryImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedCount, setLoadedCount] = useState(12); // Start with 12 images
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${API}/gallery`);
        if (response.data && response.data.images) {
          setAllGalleryImages(response.data.images);
          setVisibleImages(response.data.images.slice(0, 12));
        } else {
          // Fallback to mock data
          setAllGalleryImages(fallbackGalleryImages);
          setVisibleImages(fallbackGalleryImages.slice(0, 12));
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        // Fallback to mock data
        setAllGalleryImages(fallbackGalleryImages);
        setVisibleImages(fallbackGalleryImages.slice(0, 12));
      } finally {
        setIsLoadingGallery(false);
      }
    };
    fetchGallery();
  }, []);

  // Load more images when user scrolls near the end
  const loadMoreImages = () => {
    if (loadedCount < allGalleryImages.length) {
      const newCount = Math.min(loadedCount + 8, allGalleryImages.length);
      setVisibleImages(allGalleryImages.slice(0, newCount));
      setLoadedCount(newCount);
    }
  };

  // Handle scroll in gallery to trigger loading more
  const handleGalleryScroll = (e) => {
    const container = e.target;
    const scrollRight = container.scrollWidth - container.scrollLeft - container.clientWidth;
    if (scrollRight < 500) {
      loadMoreImages();
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to Formspree
      const response = await axios.post('https://formspree.io/f/mojnzzwr', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        language: language,
        _subject: `New Inquiry from ${formData.name} - Marvin's Contracting`
      });
      
      if (response.status === 200) {
        toast({
          title: t.contact.success,
          description: language === 'en' 
            ? 'We will get back to you shortly.' 
            : 'Nos pondremos en contacto con usted en breve.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Error',
        description: language === 'en' 
          ? 'Failed to submit inquiry. Please try again.' 
          : 'Error al enviar la consulta. Por favor, inténtelo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceIcons = {
    0: <HomeIcon className="w-10 h-10" />,
    1: <Bath className="w-10 h-10" />,
    2: <Hammer className="w-10 h-10" />,
    3: <Paintbrush className="w-10 h-10" />
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1F1F1F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF37]">{t.hero.title}</h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="hover:text-[#D4AF37] transition-colors">{t.nav.home}</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-[#D4AF37] transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('portfolio')} className="hover:text-[#D4AF37] transition-colors">{t.nav.portfolio}</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-[#D4AF37] transition-colors">{t.nav.about}</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-[#D4AF37] transition-colors">{t.nav.contact}</button>
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#D4AF37] text-[#1F1F1F] hover:bg-[#C5A028] transition-colors font-medium"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'ES' : 'EN'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-[#1F1F1F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t.hero.subtitle}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
              <p className="text-lg sm:text-xl text-gray-300">{t.hero.licensed}</p>
            </div>
            <Button
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#1F1F1F] font-bold text-lg px-8 py-6 rounded-md transition-all hover:scale-105"
            >
              {t.hero.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4">{t.services.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.services.items.map((service, index) => (
              <Card key={service.id} className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4 text-[#1F1F1F]">
                    {serviceIcons[index]}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#1F1F1F]">{service.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4">{t.portfolio.title}</h2>
            <p className="text-lg text-gray-600">{t.portfolio.subtitle}</p>
          </div>
          
          {/* Horizontal Scroll Gallery (All Devices) */}
          <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4">
              {isLoadingGallery ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[450px] h-[300px] sm:h-[350px] bg-gray-300 rounded-lg animate-pulse"></div>
                ))
              ) : (
                galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(index)}
                    className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[450px] snap-center relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all"
                  >
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.alt}
                      className="w-full h-[300px] sm:h-[350px] object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 flex items-end justify-center pb-6">
                      <div className="text-center text-white px-4">
                        <p className="font-bold text-lg mb-1">{image.category?.charAt(0).toUpperCase() + image.category?.slice(1)}</p>
                        <p className="text-sm opacity-90">{t.portfolio.viewAll}</p>
                      </div>
                    </div>
                    {/* Swipe indicator on first image */}
                    {index === 0 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                        {language === 'en' ? 'Scroll for more →' : 'Desplazar para más →'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {!isLoadingGallery && galleryImages.length > 0 && (
              <p className="text-sm text-gray-500">
                {galleryImages.length} {language === 'en' ? 'projects' : 'proyectos'} • {language === 'en' ? 'Scroll to explore' : 'Desplazar para explorar'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4">{t.about.title}</h2>
            <p className="text-lg text-gray-600">{t.about.subtitle}</p>
          </div>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-xl font-semibold text-[#1F1F1F] text-center">
              {t.about.intro}
            </p>
            
            <p className="text-base">
              {t.about.paragraph1}
            </p>
            
            <p className="text-base">
              {t.about.paragraph2}
            </p>
            
            <div className="bg-white rounded-lg p-8 shadow-md my-8">
              <h3 className="text-xl font-bold text-[#1F1F1F] mb-6 text-center">
                {t.about.focusTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.about.focusPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                    <span className="text-[#1F1F1F] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-base">
              {t.about.closing}
            </p>
            
            <p className="text-base font-semibold text-[#1F1F1F] italic text-center pt-4">
              {t.about.finalNote}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#1F1F1F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-lg text-[#D4AF37] font-semibold">{t.contact.subtitle}</p>
          </div>
          
          <Card className="bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder={t.contact.form.name}
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full text-[#1F1F1F] border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t.contact.form.email}
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full text-[#1F1F1F] border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={t.contact.form.phone}
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full text-[#1F1F1F] border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder={t.contact.form.message}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={5}
                    className="w-full text-[#1F1F1F] border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-[#1F1F1F] font-bold py-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                    : t.contact.form.submit
                  }
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <span>(240) 467-4308</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {t.hero.title}. {t.footer.rights}.
            </p>
            <p className="text-sm text-[#D4AF37]">{t.footer.tagline}</p>
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