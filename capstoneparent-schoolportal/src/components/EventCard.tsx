import { Card, CardContent } from "@/components/ui/card"

interface EventCardProps {
  title: string
  description: string
  subtitle: string
  backgroundColor?: string
}

export default function EventCard({
  title,
  description,
  subtitle,
  backgroundColor = "bg-emerald-500",
}: EventCardProps) {
  return (
    <Card className="overflow-hidden w-full">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg font-medium">Image Placeholder</p>
            <p className="text-sm">16:9 aspect ratio</p>
          </div>
        </div>
        
        {/* Content */}
        <div className={`${backgroundColor} text-white p-8`}>
          <h2 className="text-4xl font-bold mb-4 text-balance">{title}</h2>
          <p className="text-lg leading-relaxed mb-6">{description}</p>
          <p className="text-xl font-semibold">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}
