export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Marketing automation made simple
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your marketing operations and grow your business with Margo OS
        </p>
        <div className="space-x-4">
          <button className="px-8 py-3 bg-coral/10 text-coral border-b-2 border-coral 
            rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all">
            Get Started
          </button>
          <button className="px-8 py-3 text-gray-600 hover:text-coral transition-all">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}
