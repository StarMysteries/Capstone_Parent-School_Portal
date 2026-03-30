import { useCallback, useEffect, useState } from "react"
import type { AnnouncementPostItem } from "@/components/staff/AnnouncementPostFeed"
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "@/lib/api/announcementsApi"
import type { AnnouncementCategory } from "@/lib/announcementPosts"
import { getAuthUser } from "@/lib/auth"

const getBackendType = (
  cat: AnnouncementCategory,
): "General" | "Staff_only" | "Memorandum" => {
  switch (cat) {
    case "general":
      return "General"
    case "staffs":
      return "Staff_only"
    case "memorandum":
      return "Memorandum"
    default:
      return "General"
  }
}

export const useAnnouncementPosts = (category: AnnouncementCategory) => {
  const [posts, setPosts] = useState<AnnouncementPostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    try {
      const type = getBackendType(category)
      const res = await getAnnouncements({ limit: 50, type })
      setPosts(res.data || [])
    } catch (e) {
      console.error("Failed to fetch announcements:", e)
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    reload()
  }, [reload])

  const createPost = useCallback(
    async (data: {
      title: string
      content: string
      category: AnnouncementCategory
      files?: Array<{ id: string; name: string; file: File }>
    }) => {
      const authUser = getAuthUser()
      if (!authUser) {
        console.error("Cannot create announcement: no authenticated user")
        return
      }

      try {
        const announcement_type = getBackendType(data.category)
        await createAnnouncement({
          announcement_title: data.title,
          announcement_desc: data.content,
          announcement_type,
          attachments: (data.files || []).map((f) => f.file),
        })
        await reload()
      } catch (e) {
        console.error("Failed to create announcement:", e)
        throw e
      }
    },
    [reload],
  )

  const updatePost = useCallback(
    async (data: {
      announcementId: number
      title: string
      content: string
      category: AnnouncementCategory
      files?: Array<{ id: string; name: string; file: File }>
      replaceAttachments?: boolean
      removeFileIds?: number[]
    }) => {
      try {
        const announcement_type = getBackendType(data.category)
        const mappedAttachments = (data.files || []).map((f) => f.file)
        await updateAnnouncement(data.announcementId, {
          announcement_title: data.title,
          announcement_desc: data.content,
          announcement_type,
          replace_attachments: data.replaceAttachments,
          remove_file_ids: data.removeFileIds,
          ...(mappedAttachments.length > 0 ? { attachments: mappedAttachments } : {}),
        })
        await reload()
      } catch (e) {
        console.error("Failed to update announcement:", e)
        throw e
      }
    },
    [reload],
  )

  return {
    posts,
    createPost,
    updatePost,
    reload,
    isLoading,
  }
}

