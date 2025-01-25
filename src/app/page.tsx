export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Margo OS</h1>
        <p className="text-lg text-gray-600">Marketing OS for small business founders</p>
        <button className="mt-8 px-6 py-2 bg-coral/10 text-coral border-b-2 border-coral 
          rounded-t-lg rounded-b-none hover:bg-coral/20 transition-all">
          Get Started
        </button>
      </div>
    </div>
  );
}
