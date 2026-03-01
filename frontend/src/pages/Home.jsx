import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { galleryImages } from '../mock/data';
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

const Home = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // MOCK: Store in localStorage for now
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    toast({
      title: t.contact.success,
      description: language === 'en' ? 'We will get back to you shortly.' : 'Nos pondremos en contacto con usted en breve.',
    });
    
    setFormData({ name: '', email: '', phone: '', message: '' });
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => handleImageClick(index)}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={image.thumbnail}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium">{t.portfolio.viewAll}</p>
                </div>
              </div>
            ))}
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
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-[#1F1F1F] font-bold py-6 rounded-md transition-colors"
                >
                  {t.contact.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <span>info@marvinscontracting.com</span>
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