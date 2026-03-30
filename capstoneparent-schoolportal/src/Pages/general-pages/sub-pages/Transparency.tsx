import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { getAuthUser } from "@/lib/auth";
import { getTransparencyContent } from "@/lib/transparencyContent";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TransparencyPreview = ({ imageUrl }: { imageUrl: string }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return (
      <div className="flex min-h-130 w-full items-center justify-center rounded-sm bg-white p-8 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-700">Transparency file not found</p>
          <p className="mt-2 text-lg text-gray-600">
            Add the transparency image in public/ or upload a new one from edit page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Transparency and monthly budget proposal"
      onError={() => setHasImageError(true)}
      className="h-auto w-full rounded-sm bg-white object-contain"
    />
  );
};

export const Transparency = () => {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin";
  const content = getTransparencyContent();

  return (
    <div>
      <RoleAwareNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Transparency & Monthly Budget Proposal</h1>
        <div className="w-full rounded-sm bg-gray-300 p-6">
          <TransparencyPreview imageUrl={content.imageUrl} />
        </div>

        {isAdmin && (
          <Link
            to="/edittransparency"
            className="fixed bottom-8 right-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Edit Transparency"
          >
            <Pencil className="h-10 w-10" />
          </Link>
        )}
      </div>
    </div>
  );
};