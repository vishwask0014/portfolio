import HeroSection from "@/components/Sections/HeroSection/HeroSection";
import Curve3DInfo from "@/components/Sections/Curve3DInfo/Curve3DInfo";
import WorldFullOfColor from "@/components/Sections/WorldFullOfColor/WorldFullOfColor";
import LiveProjects from "@/components/Sections/LiveProjects/LiveProjects";
import SkillsMarque from "@/components/Sections/SkillsMarque/SkillsMarque";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Curve3DInfo />
      <WorldFullOfColor />
      <LiveProjects />
      <SkillsMarque />
    </>
  )
}
