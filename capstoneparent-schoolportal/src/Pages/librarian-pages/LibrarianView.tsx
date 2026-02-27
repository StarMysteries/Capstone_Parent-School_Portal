import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import EventCard from "@/components/general/EventCard";

interface Event {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}

// Sample event data
// NEED TO REPLACE WITH DYNAMIC DATA LATER
const events: Event[] = [
  {
    id: 1,
    title: "United Nations Day",
    subtitle: "#G1 Science Class",
    description: "On UNITED NATIONS DAY, let's celebrate our global community by exploring the world of books.🌍 Happy reading! 📚📖"
  },
  {
    id: 2,
    title: "Reading Month Celebration",
    subtitle: "",
    description: "Share a book, Share a story, Share the joy of reading! This Reading Month, sharing books nurtures kindness and inspires a love for learning from everyone 📚✨"
  },
  {
    id: 3,
    title: "Science Magic PH",
    subtitle: "From mind-blowing experiments",
    description: "A Spellbinding Success! ✨ Pagsabungan Elementary School was captivated by the Science Magic Philippines Team with a spectacular show that brought science to life!"
  },
  {
    id: 4,
    title: "Career Day",
    subtitle: "Dressed as future community heroes 👨‍⚕️👨‍💼",
    description: "Grade 1-SPS: Little Community Helpers! 🦸‍♀️👩‍🌾 As future community heroes, our young learners explored the library on Career Day discovering books that inspire their dreams! 📚🎓✨"
  }
];

export const LibrarianView = () => {
  return (
    <div>
      <NavbarLibrarian />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-[24px] font-bold mb-2 text-center">Welcome to</h1>
        <h1 className="text-4xl font-bold mb-12 text-center">Pagsabungan Elementary School</h1>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Partnerships and Events</h2>
            <a href="#" className="text-blue-600 font-semibold hover:underline">View more...</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                subtitle={event.subtitle}
                description={event.description}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="relative w-full py-16 mt-11.5">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-black opacity-50" // NEED TO REPLACE WITH ACTUAL IMAGE URL
        />
        
        {/* Content Container */}
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="p-8 rounded-lg text-center bg-(--navbar-bg)">
            <h2 className="text-3xl font-bold mb-4 text-black">Vision & Mission</h2>
            <p className="text-black font-medium mb-6">
              The Pagsabungan Elementary School is a public school that nurtures academic excellence, producing knowledgeable, honest, and responsible pupils who are ready for lifelong skills.
            </p>
            <button className="bg-black text-white px-8 py-2 font-bold hover:bg-gray-800">
              ABOUT US
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};