export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type RevisionTopic = {
  title: string;
  definition: string;
  keyInfo: string[];
  example: string;
  exampleExplanation: string;
  bbcSearchUrl: string;
  userNotes: string;
  revised: boolean;
  quiz: QuizQuestion[];
  topicLibraryId?: string;
  userRevisionSetId?: string;
};

export type RevisionSet = {
  subject: string;
  ageLevel: string;
  topics: RevisionTopic[];
};