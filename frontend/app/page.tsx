import Image from "next/image";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import ReadyToConvert from "@/components/ReadyToCovert";

export default function Homepage() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-b from-[#f6f9fe] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-15 grid place-items-center">
          <article className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-center mb-4 text-black">
              Convert Documents Instantly, Without Compromise
            </h2>

            <p className="mt-2 text-lg text-green-500">
              Fast, secure, and accurate file conversions — built for modern workflows
            </p>

            <div className="mt-8 flex justify-center">
              <Link href="/features"className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                Get Started
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Other Sections */}
      <WhyChooseUs />
      <HowItWorks />
      <ReadyToConvert />
    </>
  );
}
