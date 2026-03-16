import { FileText, Pencil, Plus } from "lucide-react";

export type AnnouncementAttachment = string | { name: string; url: string };

const FALLBACK_PDF_PREVIEW_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const ABSOLUTE_OR_BROWSER_URL_PATTERN = /^(https?:\/\/|blob:|data:|\/)/i;

const getAttachmentLabelFromUrl = (url: string) => {
  const cleanUrl = url.split("#")[0].split("?")[0];
  const segment = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);

  if (!segment) {
    return "Attachment.pdf";
  }

  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const resolveAttachmentLink = (attachment: AnnouncementAttachment) => {
  if (typeof attachment === "string") {
    if (ABSOLUTE_OR_BROWSER_URL_PATTERN.test(attachment)) {
      return {
        label: getAttachmentLabelFromUrl(attachment),
        href: attachment,
      };
    }

    return {
      label: attachment,
      href: `${FALLBACK_PDF_PREVIEW_URL}#name=${encodeURIComponent(attachment)}`,
    };
  }

  return {
    label: attachment.name,
    href: ABSOLUTE_OR_BROWSER_URL_PATTERN.test(attachment.url)
      ? attachment.url
      : `${FALLBACK_PDF_PREVIEW_URL}#name=${encodeURIComponent(attachment.name)}`,
  };
};

export interface AnnouncementPostItem {
  id: string;
  author: string;
  role: string;
  date: string;
  title: string;
  content: string;
  attachments?: AnnouncementAttachment[];
}

interface AnnouncementPostFeedProps {
  posts: AnnouncementPostItem[];
  onAdd?: () => void;
  onEdit?: (post: AnnouncementPostItem) => void;
}

export const AnnouncementPostFeed = ({
  posts,
  onAdd,
  onEdit,
}: AnnouncementPostFeedProps) => {
  return (
    <section className="mx-auto w-full max-w-330 px-3 py-6 text-left sm:px-5 lg:px-6">
      <div className="space-y-5 sm:space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 sm:grid-cols-[68px_minmax(0,1fr)] sm:gap-5"
          >
            <img
              src="/Logo.png"
              alt="Author avatar"
              className="mt-4 h-14 w-14 rounded-full border-2 border-gray-300 bg-white object-cover sm:h-16 sm:w-16"
            />

            <div className="relative w-full overflow-hidden rounded-2xl border border-gray-300 bg-linear-to-r from-gray-100 to-gray-200 p-5 shadow-sm sm:p-7 lg:p-8">
              {onEdit && (
                <button
                  type="button"
                  aria-label="Edit announcement"
                  onClick={() => onEdit(post)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-(--button-green) text-white shadow-md transition-colors hover:bg-(--button-hover-green) sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                >
                  <Pencil size={20} />
                </button>
              )}

              <div className={onEdit ? "pr-0 sm:pr-14" : ""}>
                <p className="text-xl font-semibold uppercase tracking-wide text-blue-600 sm:text-2xl">
                  {post.author}
                </p>
                <p className="text-lg font-semibold text-gray-900 sm:text-xl">{post.role}</p>
                <p className="text-sm text-gray-600 sm:text-base">{post.date}</p>

                <h2 className="mt-4 text-[clamp(1.65rem,3.4vw,3rem)] font-bold leading-tight text-gray-950">
                  {post.title}
                </h2>

                <p className="mt-4 whitespace-pre-line text-[clamp(1rem,1.45vw,1.4rem)] leading-relaxed text-gray-900">
                  {post.content}
                </p>

                {!!post.attachments?.length && (
                  <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                    {post.attachments.map((attachment) => {
                      const resolvedAttachment = resolveAttachmentLink(attachment);
                      const attachmentKey =
                        typeof attachment === "string"
                          ? attachment
                          : `${attachment.name}-${attachment.url}`;

                      return (
                        <a
                          key={attachmentKey}
                          href={resolvedAttachment.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-(--button-green) hover:text-(--button-green) sm:px-4 sm:py-3 sm:text-base"
                          title={`Open ${resolvedAttachment.label}`}
                        >
                          <FileText className="text-red-500" size={18} />
                          <span className="max-w-44 truncate sm:max-w-52">
                            {resolvedAttachment.label}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {onAdd && (
        <button
          type="button"
          aria-label="Create announcement"
          onClick={onAdd}
          className="fixed bottom-8 right-8 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-(--button-green) text-white shadow-lg transition-colors hover:bg-(--button-hover-green)"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      )}
    </section>
  );
};
