
export default function HowItWorks() {
  return (
    <section className="py-20 text-center bg-white to bg-gray-50">
      <h2 className="text-3xl font-bold mb-10 text-black">
        How To Convert Your{" "}<span className="text-green-600">Documents?</span>
      </h2>

      <div className="flex justify-center gap-20 flex-wrap">
        {["Upload Files", "Process Securely", "Download Output"].map((s, i) => (
          <div key={s}>
            <div className="w-14 h-14  bg-green-600 hover:bg-blue-500 text-white rounded-full
                            flex items-center justify-center mx-auto mb-4">
              {i + 1}
            </div>
            <p className="text-black text-xl">{s}</p>
          </div>
        ))}
      </div>
    </section>  
  );
}

