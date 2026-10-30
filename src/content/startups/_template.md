---
# Every profile answers the same six questions, in this order. "Not found" is an allowed answer.
# 1. Identity
name: Company Name
summary: One plain-language sentence on what the company does (240 characters max).
website: https://example.com
country: Canada
foundedYear: 2020
areas: [pcos]            # one or more of the 11 condition areas
type: device             # drug | device | diagnostic | software | service | platform
technology: Plain-words description of the science or technology   # shown on the "By technology" view
fundingStage: seed       # grant | pre-seed | seed | series-a | beyond-cap | seeking | unknown
# 2. Problem and who it affects: ids of INDEPENDENT references (never the company) below
prevalenceRefs: [example-prevalence]
# 3. The claim, as the company would put it
claim: One sentence on what the company says its product does.
# 5. Where it sits. These describe; they do not rank.
evidenceBasis: new-science      # new-science | established-applied | none-public
productCheck: none-public       # none-public | lab-unpublished | lab-peer-reviewed | pilot | registered-trial | cleared
howFound: Where and how I came across it (event, grant search, trial sponsor, etc.).
relationship: None
# 4. Evidence. Numbered in the order listed. Cite in the text with {{ref:id}}.
# use: read-in-full | abstract-only | summary-only | registry-search | not-read | company-reported
references:
  - id: example-prevalence
    citation: Author, Journal, year. What it is.
    url: https://example.com
    use: abstract-only
    note: Optional. For example, who is independent of whom.
lastChecked: 2026-10-22
draft: true
---

<!--
Body outline: one short page that reads top to bottom, for a reader curious about startups.
  ## What problem are they trying to solve?   (independent prevalence sources)
  ## How are they making it happen?
  ## What's different from before?
  ## What has to happen next?                 (the steps before people can use it)
  ## Funding                                   (short)
  ## My take                                   (your own view, clearly labeled)

Rules:
- Every factual sentence ends with a {{ref:id}}. Every reference must be cited, or the build fails.
- Technical terms use {{term:slug}} or {{term:slug|shown text}}. A glossary file must exist for each.
- Description, not judgment: say what the public evidence shows and what is not public.
-->
