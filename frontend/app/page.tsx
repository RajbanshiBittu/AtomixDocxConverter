import Image from "next/image";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import ReadyToConvert from "@/components/ReadyToCovert";

export default function Homepage() {
  return (
    <>
      {/* Hero Section */}
      {/* <section id="home" className="bg-gradient-to-b from-[#f6f9fe] to-white overflow-hidden bg-no-repeat bg-center bg-contain">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <article>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Convert Your <br /> <span className="text-green-500">Documents with Ease</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Fast, Secure & Reliable Document Conversion
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/features"        
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </article>
        </div>
      </section> */}

      <section id="home" className="bg-gradient-to-b from-[#f6f9fe] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-15 grid place-items-center">
          <article className="text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Convert Your <br />
              <span className="text-green-500">Documents with Ease</span>
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Fast, Secure & Reliable Document Conversion
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
