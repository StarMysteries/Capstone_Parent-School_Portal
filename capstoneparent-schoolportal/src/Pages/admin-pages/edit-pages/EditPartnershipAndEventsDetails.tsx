import { NavbarAdmin } from "@/components/admin/NavbarAdmin";
import { EditPartnershipAndEventsDetailsModal } from "@/components/admin/EditPartnershipAndEventsDetailsModal";
import type { PartnershipEventFormData } from "@/components/admin/EditPartnershipAndEventsModal";
import { usePartnershipEvents } from "@/hooks/usePartnershipEvents";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState } from "react";

const DetailImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-linear-to-br from-emerald-200 via-emerald-100 to-yellow-100 ring-1 ring-black/5">
        <div className="absolute inset-0 bg-black/5" />
        <p className="absolute bottom-3 left-3 rounded-md bg-white/80 px-3 py-1 text-sm font-semibold text-gray-700 backdrop-blur">
          Event image unavailable
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageFailed(true)}
      className="aspect-16/8.5 w-full rounded-2xl object-cover ring-1 ring-black/5"
    />
  );
};

export const EditPartnershipAndEventsDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, updateEvent, deleteEvent, isLoading } = usePartnershipEvents();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!eventId) {
    return <Navigate to="/managepartnershipandevents" replace />;
  }

  const event = events.find((e) => e.id === parseInt(eventId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarAdmin />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-gray-600">Loading event...</p>
          </section>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarAdmin />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <h1 className="text-3xl font-bold text-gray-900">Event not found</h1>
            <p className="mt-3 text-gray-600">
              The event you are trying to view does not exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/managepartnershipandevents")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--button-green) px-4 py-2 font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </button>
          </section>
        </main>
      </div>
    );
  }

  const handleSaveEvent = async (updatedEvent: PartnershipEventFormData) => {
    await updateEvent(event.id, updatedEvent);
    setIsEditModalOpen(false);
  };

  const handleDeleteEvent = async () => {
    await deleteEvent(event.id);
    navigate("/managepartnershipandevents");
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <header className="bg-white relative">
              <button
                onClick={() => navigate("/managepartnershipandevents")}
                className="mb-4 inline-flex items-center gap-2 rounded-lg bg-(--button-green) px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-(--button-green)"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-(--button-green) p-3 text-white hover:shadow-lg transition-shadow"
                  title="Edit event"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 p-3 text-white hover:shadow-lg transition-shadow"
                  title="Delete event"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <h1 className="pr-24 text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
                {event.title}
              </h1>
            </header>

            <DetailImage src={event.imageUrl} alt={event.title} />

            <section className="rounded-2xl bg-(--button-green) p-6 text-white shadow-sm ring-1 ring-black/5 md:p-8">
              <div className="space-y-4 text-lg leading-relaxed text-white/95">
                {event.details.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          </article>

          <aside>
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl font-bold text-gray-900">Other Posts</h2>
              <div className="mt-4 space-y-2">
                {events
                  .filter((item) => item.id !== event.id)
                  .slice(0, 5)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(`/admin-edit-event/${item.id}`)}
                      className="block w-full text-left text-lg text-gray-900 hover:text-gray-700"
                    >
                      <span className={item.id === event.id ? "font-bold" : ""}>
                        {item.title}
                      </span>
                    </button>
                  ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Edit Modal */}
      <EditPartnershipAndEventsDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onSave={handleSaveEvent}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-bold text-gray-900">Delete Event?</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this partnership and event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => void handleDeleteEvent()}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
