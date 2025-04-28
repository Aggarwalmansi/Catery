import HeroSection from './components/heroSection';
import Navbar from './components/Navbar';
import FeaturedServices from './components/FeaturesServices';
import WhyOccasionOS from './components/Whyoccasionos';
import Testimonials from './components/Testimonial';
export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroSection/>
      <FeaturedServices/>
      <WhyOccasionOS/>
      <Testimonials/>
      <section className="pt-24">
        {/* Hero will come here next */}
        <h1 className="text-4xl font-bold text-center mt-10">
          Ram Ram 🙏 Welcome to OccasionOS
        </h1>
      </section>
    </main>
  );
}
