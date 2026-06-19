import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import GamePreview from './sections/GamePreview'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'
import Token from './sections/Token'
import NFTShowcase from './sections/NFTShowcase'
import Roadmap from './sections/Roadmap'
import Community from './sections/Community'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <GamePreview />
      <Features />
      <HowItWorks />
      <Token />
      <NFTShowcase />
      <Roadmap />
      <Community />
      <Footer />
    </div>
  )
}
