import Image from "next/image";
import heroImg from '../../../public/img/image.png'
import css from './HeroSection.module.css'

export default function HeroSection() {
    return (
        <>
            <div className="relative h-screen w-full overflow-hidden">
                <Image fill alt="hero image" src={heroImg} />
            </div>
        </>
    )
}