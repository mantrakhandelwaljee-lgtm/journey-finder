import { EmojiLoader } from "@/components/ui/emoji-loader"

export default function GlobalLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <EmojiLoader />
    </div>
  )
}
