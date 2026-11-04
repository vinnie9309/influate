import { Check } from "lucide-react"

interface CheckListProps {
  items: readonly string[]
  iconClass?: string
  textClass?: string
}

/** A bulleted list with check marks. */
export default function CheckList({ items, iconClass = "text-brand", textClass = "text-body" }: CheckListProps) {
  return (
    <ul className={`flex flex-col gap-3 text-base leading-normal ${textClass}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  )
}
