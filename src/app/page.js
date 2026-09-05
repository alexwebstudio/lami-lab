import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Works from '@/components/Works';
import About from '@/components/About';
import Reviews from '@/components/Reviews';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Services />
        <Works />
        <About />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
