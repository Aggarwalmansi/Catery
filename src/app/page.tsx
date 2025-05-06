import HeroSection from './components/heroSection';
import Navbar from './components/Navbar';
import FeaturedServices from './components/FeaturesServices';
import WhyOccasionOS from './components/Whyoccasionos';
import Testimonials from './components/Testimonial';

// import MenuAutoSuggest from './components/occasion/MenuAutoSuggest';
// import OccasionSelector from './components/occasion/OccasionSelector';
export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroSection/>
      <FeaturedServices/>
      <WhyOccasionOS/>
      <Testimonials/>
    

      <section className="pt-0">
        {/* Hero will come here next */}
      </section>
      {/* <OccasionSelector/>
      <MenuAutoSuggest/> */}
    </main>
  );
}
