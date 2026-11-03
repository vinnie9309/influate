const options = [
  { value: "creator", title: "I'm a creator", text: "I make content and want brand partnerships" },
  { value: "brand", title: "I'm a brand", text: "I sell products and want creators to promote them" }
]

export default function RolePicker({ value, onChange }) {
  return (
    <fieldset className="grid grid-cols-2 gap-3">
      <legend className="mb-1.5 text-sm font-semibold text-subtle">Who are you?</legend>
      {options.map((o) => (
        <label
          key={o.value}
          className={`flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-colors ${
            value === o.value ? "border-brand bg-brand-soft" : "border-line-strong bg-white hover:bg-mist"
          }`}
        >
          <input
            type="radio"
            name="role"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          <span className="text-[15px] font-bold">{o.title}</span>
          <span className="text-[13px] leading-snug text-body">{o.text}</span>
        </label>
      ))}
    </fieldset>
  )
}
