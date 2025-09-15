import { createPersistedStore } from "../store";

const useLoaders = createPersistedStore("loaders", (set) => ({
  loader: false,
  githubLoader: false,
  googleLoader: false,
  pageLoader: false,
  chatLoader: false,
  chatPageLoader: false,
  summarizeLoader: false,
  assessmentLoader: false,
  playlistLoader: false,
  progressLoader: false,
  enrollLoader: false,
  notesLoader: false,
  transcriptLoader: false,
  dashboardYearLoader: false,
  pdfLoader: false,
  quizLoader: false,

  setLoader: () => set(() => ({ loader: true })),
  unsetLoader: () => set(() => ({ loader: false })),

  setGithubLoader: () => set(() => ({ githubLoader: true })),
  unsetGithubLoader: () => set(() => ({ githubLoader: false })),

  setGoogleLoader: () => set(() => ({ googleLoader: true })),
  unsetGoogleLoader: () => set(() => ({ googleLoader: false })),

  setChatPageLoader: () => set(() => ({ chatPageLoader: true })),
  unsetChatPageLoader: () => set(() => ({ chatPageLoader: false })),

  setPageLoader: () => set(() => ({ pageLoader: true })),
  unsetPageLoader: () => set(() => ({ pageLoader: false })),

  setChatLoader: () => set(() => ({ chatLoader: true })),
  unsetChatLoader: () => set(() => ({ chatLoader: false })),

  setSummarizeLoader: () => set(() => ({ summarizeLoader: true })),
  unsetSummarizeLoader: () => set(() => ({ summarizeLoader: false })),

  setAssessmentLoader: () => set(() => ({ assessmentLoader: true })),
  unsetAssessmentLoader: () => set(() => ({ assessmentLoader: false })),

  setDashboardYearLoader: () => set(() => ({ dashboardYearLoader: true })),
  unsetDashboardYearLoader: () => set(() => ({ dashboardYearLoader: false })),

  setPlaylistLoader: () => set(() => ({ playlistLoader: true })),
  unsetPlaylistLoader: () => set(() => ({ playlistLoader: false })),

  setProgressLoader: () => set(() => ({ progressLoader: true })),
  unsetProgressLoader: () => set(() => ({ progressLoader: false })),

  setEnrollLoader: () => set(() => ({ enrollLoader: true })),
  unsetEnrollLoader: () => set(() => ({ enrollLoader: false })),

  setNotesLoader: () => set(() => ({ notesLoader: true })),
  unsetNotesLoader: () => set(() => ({ notesLoader: false })),

  setTranscriptLoader: () => set(() => ({ transcriptLoader: true })),
  unsetTranscriptLoader: () => set(() => ({ transcriptLoader: false })),

  setPdfLoader: () => set(() => ({ pdfLoader: true })),
  unsetPdfLoader: () => set(() => ({ pdfLoader: false })),

  setQuizLoader: () => set(() => ({ quizLoader: true })),
  unsetQuizLoader: () => set(() => ({ quizLoader: false })),
}));

export { useLoaders };
