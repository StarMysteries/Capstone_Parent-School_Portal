import { RoleAwareNavbar } from "@/components/general/RoleAwareNavbar";

export const ContactUs = () => {
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
                <p className="text-lg">0129293512</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Library Office:</h2>
                <p className="text-lg">012983759</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Faculty Office:</h2>
                <p className="text-lg">0129023121</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Facebook Page:</h2>
                <a 
                  href="https://www.facebook.com/pages/Pagsabungan-Elementary-School/416573625065073" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-300 text-lg hover:underline"
                >
                  Pagsabungan Elementary School
                </a>
              </div>
            </div>
          </div>

          {/* Map Box */}
          <div className="rounded-lg overflow-hidden shadow-lg h-100 md:h-auto">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6147.85805286023!2d123.93795581216922!3d10.356494766753164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9987ccd09bc87%3A0x2f7440ce2f8c0b6e!2sPagsabungan%20Elementary%20School!5e1!3m2!1sen!2sus!4v1769654678624!5m2!1sen!2sus" 
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
      </div>
    </div>
  );
};