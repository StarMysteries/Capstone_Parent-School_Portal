import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";

export const VisionAndMission = () => {
  return (
    <div>
      <RoleAwareNavbar />
      <div className="max-w-350 mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-12 text-center">Vision And Mission</h1>
        
        <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mission</h2>
            <img
              src="/mission.png"
              alt="DepEd Mission"
              className="w-full h-115 lg:h-155 object-contain"
            />
          </div>

          {/* Core Values Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Core Values</h2>
            <img
              src="/corevalues.png"
              alt="DepEd Core Values"
              className="w-full h-115 lg:h-155 object-contain"
            />
          </div>

          {/* Vision Card */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Vision</h2>
            <img
              src="/vision.png"
              alt="DepEd Vision"
              className="w-full h-115 lg:h-155 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};