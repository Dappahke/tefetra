import { ReactNode } from "react"

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
  children?: ReactNode
}

export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  children,
}: SectionIntroProps) {
  return (
    <div className={`section-intro${align === "center" ? " section-intro-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title-display">{title}</h2>
      <p className="section-copy">{description}</p>
      {children}
    </div>
  )
}
