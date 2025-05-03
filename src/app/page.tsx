import HeroSection from './components/heroSection';
import Navbar from './components/Navbar';
import FeaturedServices from './components/FeaturesServices';
import WhyOccasionOS from './components/Whyoccasionos';
import Testimonials from './components/Testimonial';
import Footer from './components/Footer';
export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroSection/>
      <FeaturedServices/>
      <WhyOccasionOS/>
      <Testimonials/>
      <Footer/>
      <section className="pt-24">
        {/* Hero will come here next */}
      </section>
    </main>
  );
}
