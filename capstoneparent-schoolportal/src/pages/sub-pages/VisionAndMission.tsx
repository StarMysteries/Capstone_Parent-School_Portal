import { Navbar } from "@/components/Navbar";

export const VisionAndMission = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-12 text-center">Vision And Mission</h1>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mission</h2>
            <div className="w-full h-96 bg-gray-300"></div> {/* Mission picture placeholder */}
          </div>

          {/* Core Values Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Core Values</h2>
            <div className="w-full h-96 bg-gray-300"></div> {/* Core Values picture placeholder */}
          </div>

          {/* Vision Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Vision</h2>
            <div className="w-full h-96 bg-gray-300"></div> {/* Vision picture placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
};