import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import AiAssistant from '../components/landing/AiAssistant';
import Workflow from '../components/landing/Workflow';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="bg-background-light text-text-light font-sans transition-colors duration-300 antialiased selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <AiAssistant />
      <Workflow />
      <Footer />
    </div>
  );
}
