export function createTopicKey(subject: string, level: string, topic: string) {
  return `${subject}-${level}-${topic}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}