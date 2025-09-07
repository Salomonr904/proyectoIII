import Header from '../components/Header';
import Hero from '../components/Hero';
import BenefitsSection from '../components/BenefitsSection';
import CoursesSection from '../components/CoursesSection';
import ArticlesSection from '../components/ArticlesSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <BenefitsSection />
      <CoursesSection />
      <ArticlesSection />
      <Footer />
    </>
  );
}
