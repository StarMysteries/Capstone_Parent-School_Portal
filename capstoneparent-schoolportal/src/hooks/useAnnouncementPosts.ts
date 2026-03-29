import { useCallback, useEffect, useState } from "react"
import type { AnnouncementPostItem } from "@/components/staff/AnnouncementPostFeed"
import { createAnnouncement, getAnnouncements } from "@/lib/api/announcementsApi"
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
      files?: Array<{ id: string; name: string }>
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
          announced_by: authUser.userId,
          // TODO: integrate real uploaded file IDs when file upload API is wired.
          file_ids: [],
        })
        await reload()
      } catch (e) {
        console.error("Failed to create announcement:", e)
        throw e
      }
    },
    [reload],
  )

  return {
    posts,
    createPost,
    reload,
    isLoading,
  }
}

