import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";
import { getAuthUser } from "@/lib/auth";
import { getContactUsContent } from "@/lib/contactUsContent";
import { Pencil } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export const ContactUs = () => {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin";

  const content = useMemo(() => getContactUsContent(), []);

  return (
    <div>
      <RoleAwareNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Contact us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information Box */}
          <div className="bg-(--button-green) text-white p-8 rounded-lg">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Principal's Office:</h2>
                <p className="text-lg">{content.principalOffice}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Library Office:</h2>
                <p className="text-lg">{content.libraryOffice}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Faculty Office:</h2>
                <p className="text-lg">{content.facultyOffice}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Facebook Page:</h2>
                <a 
                  href={content.facebookPageUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-300 text-lg hover:underline"
                >
                  {content.facebookPageLabel}
                </a>
              </div>
            </div>
          </div>

          {/* Map Box */}
          <div className="rounded-lg overflow-hidden shadow-lg h-100 md:h-auto">
            <iframe 
              src={content.mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Pagsabungan Elementary School Location"
            />
          </div>
        </div>

        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <Link
              to="/editcontactus"
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-transform hover:scale-105"
              aria-label="Edit Contact Us"
            >
              <Pencil className="h-8 w-8" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};