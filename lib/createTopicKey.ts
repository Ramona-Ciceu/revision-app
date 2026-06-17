export function createTopicKey(
  subject: string,
  ageLevel: string,
  topics: string[]
) {
  return `${subject}-${ageLevel}-${topics.join("-")}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}