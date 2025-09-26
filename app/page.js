'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            XGrid Campers Ambassador Map
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with XGrid Camper Ambassadors near you. Schedule viewings,
            explore models, and discover your perfect adventure vehicle.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Phase 1: Hello World 🚀
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold text-gray-700 mb-2">✅ Next.js Setup</h3>
                <p className="text-sm text-gray-600">React framework configured</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold text-gray-700 mb-2">✅ Tailwind CSS</h3>
                <p className="text-sm text-gray-600">Styling system ready</p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold text-gray-700 mb-2">🔄 AWS Amplify</h3>
                <p className="text-sm text-gray-600">Deployment pending</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Development Status
            </h3>
            <p className="text-blue-700">
              Application framework is ready. Next steps include database integration
              and map implementation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}