export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type BlogPost = {
  slug: string
  category: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: string
  sections: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-in-kenya-from-abroad",
    category: "Diaspora Guide",
    title: "Building in Kenya from abroad: what to organise before design starts",
    excerpt:
      "Diaspora projects move faster when the site, budget, approval path, and reporting structure are defined before the first drawing package is commissioned.",
    publishedAt: "March 12, 2026",
    readTime: "6 min read",
    sections: [
      {
        heading: "Start with the site realities first",
        paragraphs: [
          "The strongest projects begin with clear site information: location, plot size, access conditions, topography, and any county approval constraints already known. That information shapes design decisions much earlier than most diaspora clients expect.",
          "If the site data is weak, the design conversation becomes abstract. When the site data is strong, the architect can judge orientation, drainage, ventilation, and the practical cost of adapting the plan before time is lost.",
        ],
      },
      {
        heading: "Know whether you need a ready-made plan or a custom brief",
        paragraphs: [
          "A ready-made plan works when the lifestyle needs, plot conditions, and budget are already close to an existing model. It shortens the path to delivery and is often the right move for clients who want speed.",
          "A custom brief is better when the land has unusual constraints, the family structure is specific, or the project needs phased construction, rental units, or a stronger sustainability response. The decision should be made early so the scope does not drift halfway through the project.",
        ],
      },
      {
        heading: "Define reporting before construction begins",
        paragraphs: [
          "Diaspora trust is not built by drawings alone. It is built by how updates, approvals, variations, and milestones are handled once work begins on site.",
          "Before construction starts, decide who will report progress, how often updates will be shared, and what decisions require client signoff. That structure protects the build and reduces avoidable tension later.",
        ],
      },
    ],
  },
  {
    slug: "cost-of-building-in-kenya-before-you-commit",
    category: "Cost Planning",
    title: "How to think about the cost of building in Kenya before you commit to drawings",
    excerpt:
      "Early cost thinking is less about chasing a perfect square metre figure and more about understanding scope, finish level, site complexity, and what the first construction phase must actually achieve.",
    publishedAt: "March 5, 2026",
    readTime: "5 min read",
    sections: [
      {
        heading: "Budget range is more useful than a single number",
        paragraphs: [
          "Clients often want an exact cost too early, but architecture works better when the team understands a realistic range and the priorities inside it. A budget range allows design options to be tested without pretending every variable is already fixed.",
          "It also creates room to separate must-haves from later upgrades. That is especially helpful for families building in phases or combining owner-occupied and rental spaces on one site.",
        ],
      },
      {
        heading: "Site conditions move cost more than people expect",
        paragraphs: [
          "Flat, accessible plots behave very differently from sloped sites, narrow access roads, or land that needs retaining, drainage intervention, or unusual foundations. Those realities should influence the design strategy from the beginning.",
          "A plan that looks affordable on paper can become expensive once it is forced onto the wrong site. That is why adaptation and technical review matter before construction documents are finalised.",
        ],
      },
      {
        heading: "Technical add-ons reduce downstream guesswork",
        paragraphs: [
          "Structural drawings, BOQs, and site adaptation work are not cosmetic extras. They improve cost visibility and make contractor conversations more disciplined.",
          "For diaspora clients in particular, that additional technical clarity is part of risk control. It gives the project a stronger basis before money is committed on site.",
        ],
      },
    ],
  },
  {
    slug: "passive-cooling-for-tropical-homes",
    category: "Sustainability",
    title: "Passive cooling strategies that make sense for tropical homes in East Africa",
    excerpt:
      "Climate responsive design is not a luxury aesthetic. It changes comfort, daylight, energy demand, and the long-term durability of a house in warm regions.",
    publishedAt: "February 26, 2026",
    readTime: "7 min read",
    sections: [
      {
        heading: "Orientation and openings should work together",
        paragraphs: [
          "Passive cooling starts with how the house sits on the site. Window placement, shading depth, and room orientation should respond to solar gain and prevailing air movement rather than generic imported plan logic.",
          "When that relationship is handled well, interior spaces stay calmer and more usable through the day without depending entirely on mechanical cooling.",
        ],
      },
      {
        heading: "Shading is part of architecture, not decoration",
        paragraphs: [
          "Roof overhangs, verandas, screened transitions, and planted outdoor zones are practical thermal devices. They protect the envelope, control glare, and help the building sit more comfortably in its climate.",
          "That approach also creates a stronger connection between indoor and outdoor living, which is often central to East African domestic life.",
        ],
      },
      {
        heading: "Good sustainability still has to be buildable",
        paragraphs: [
          "The best sustainable moves are the ones a project can actually execute within budget and within the local construction ecosystem. An elegant passive strategy that cannot be built consistently is not a serious solution.",
          "That is why sustainable housing design has to balance climate response, contractor reality, and the client's financial priorities from the start.",
        ],
      },
    ],
  },
  {
    slug: "ready-made-plan-vs-custom-design",
    category: "Planning Strategy",
    title: "Ready-made plan or custom design? How to choose the right starting point",
    excerpt:
      "Not every project needs a bespoke design process, but not every plot should be forced into a catalogue plan either. The right starting point depends on fit, speed, and risk.",
    publishedAt: "February 18, 2026",
    readTime: "5 min read",
    sections: [
      {
        heading: "Ready-made plans are strongest when fit is already high",
        paragraphs: [
          "A ready-made plan is efficient when the bedroom count, layout logic, and build ambition already align with the client's needs. It works best when the site is straightforward and the buyer values speed.",
          "That speed becomes even more valuable when the project only needs limited technical add-ons before construction documentation can move forward.",
        ],
      },
      {
        heading: "Custom design is about precision, not prestige",
        paragraphs: [
          "A custom process becomes necessary when the family brief is specific, the land is unusual, or the project needs phased development, rental integration, or a stronger architectural identity.",
          "In those cases, forcing the project into a ready-made plan can actually increase revision time and site compromise. Custom design is justified when precision removes bigger downstream problems.",
        ],
      },
      {
        heading: "The best route is the one that keeps momentum without hiding risk",
        paragraphs: [
          "The wrong decision is usually the one that appears cheaper or faster at first glance but creates confusion later. The better decision is the one that keeps momentum while staying honest about site conditions, approvals, and technical needs.",
          "That is why the plan marketplace and the consultation route should work together. One sells speed; the other protects project fit.",
        ],
      },
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null
}

export function getFeaturedBlogPosts(limit = 3) {
  return blogPosts.slice(0, limit)
}
