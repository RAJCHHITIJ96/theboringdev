// Auto-generated article registry
// This file is managed by Shaper AI - do not edit manually

export interface ArticleEntry {
  slug: string;
  component: string;
  title: string;
  publishDate: string;
  category: string;
  description: string;
  readTime: string;
  url: string;
  assetsCount: {
    images: number;
    videos: number;
    tables: number;
    charts: number;
    code_snippets: number;
  };
}

export const ARTICLE_REGISTRY: Record<string, ArticleEntry[]> = {
  "ai-automation": [
    {
      "slug": "the-ai-powered-meeting-summaries-guidenn-why-ai-summaries-matternnendless-meetings-eat-away-at-productivity-and-taking-notes-distracts-people-from-real-discussions-ai-meeting-summaries-free-teams-from-manual-note-taking-while-ensuring-no-detail-is-lostnnthink-of-it-as-having-an-always-available-scribe-that-never-misses-contextnn-the-core-ai-summary-stagesnn1-transcription-ai-converts-speech-into-accurate-text-in-real-timen2-summarization-ai-condenses-key-points-decisions-and-action-itemsn3-categorization-ai-tags-tasks-deadlines-and-responsible-team-membersn4-distribution-ai-sends-summaries-automatically-to-slack-email-or-project-toolsnn-the-roi-of-ai-meeting-summariesnntraditional-approachn-average-meeting-1-hour-6-attendeesn-note-taking-recap-emails-15-hours-totaln-annual-time-spent-on-note-taking-450-hours-per-teamnnai-meeting-summariesn-summaries-generated-in-2-minsn-annual-time-spent-30-hoursnnthats-a-93-time-saving-and-sharper-focus-during-meetingsnn-tools-you-neednn1-openai-whisper-gpt-4o-transcription-summarizationn2-otterai-firefliesai-live-transcriptionn3-zapiermake-distribute-summariesn4-notionconfluence-api-auto-save-structured-notesn5-slackteams-api-instant-team-updatesnn-sample-automation-scriptnnpython-code-snippetnn-def-summarizemeetingtranscripttextn-summary-openaichatcompletioncreaten-modelgpt-4on-messagesroleusercontentsummarize-this-meeting-transcript-into-key-points-action-items-and-decisions-n-n-return-summarychoices0messagecontentnn-case-study-60-days-of-ai-summariesnn-meetings-processed-320n-summaries-generated-100n-hours-saved-380n-total-cost-1200n-savings-generated-18000n-roi-1400nnteams-reported-a-95-accuracy-rate-in-capturing-action-itemsnn-common-mistakes-to-avoidnn-mistake-1-lack-of-contextndont-summarize-without-feeding-agenda-or-project-contextnn-mistake-2-overloading-summariesnkeep-summaries-concise-dont-replicate-transcriptsnn-mistake-3-skipping-distributionnif-no-one-reads-the-summary-the-automation-fails",
      "component": "TheAipoweredMeetingSummariesGuidennWhyAiSummariesMatternnendlessMeetingsEatAwayAtProductivityAndTakingNotesDistractsPeopleFromRealDiscussionsAiMeetingSummariesFreeTeamsFromManualNotetakingWhileEnsuringNoDetailIsLostnnthinkOfItAsHavingAnAlwaysavailableScribeThatNeverMissesContextnnTheCoreAiSummaryStagesnn1TranscriptionAiConvertsSpeechIntoAccurateTextInRealTimen2SummarizationAiCondensesKeyPointsDecisionsAndActionItemsn3CategorizationAiTagsTasksDeadlinesAndResponsibleTeamMembersn4DistributionAiSendsSummariesAutomaticallyToSlackEmailOrProjectToolsnnTheRoiOfAiMeetingSummariesnntraditionalApproachnAverageMeeting1Hour6AttendeesnNotetakingRecapEmails15HoursTotalnAnnualTimeSpentOnNotetaking450HoursPerTeamnnaiMeetingSummariesnSummariesGeneratedIn2MinsnAnnualTimeSpent30HoursnnthatsA93TimeSavingAndSharperFocusDuringMeetingsnnToolsYouNeednn1OpenaiWhisperGpt4oTranscriptionSummarizationn2OtteraiFirefliesaiLiveTranscriptionn3ZapiermakeDistributeSummariesn4NotionconfluenceApiAutosaveStructuredNotesn5SlackteamsApiInstantTeamUpdatesnnSampleAutomationScriptnnpythonCodeSnippetnnDefSummarizemeetingtranscripttextnSummaryOpenaichatcompletioncreatenModelgpt4onMessagesroleusercontentsummarizeThisMeetingTranscriptIntoKeyPointsActionItemsAndDecisionsNNReturnSummarychoices0messagecontentnnCaseStudy60DaysOfAiSummariesnnMeetingsProcessed320nSummariesGenerated100nHoursSaved380nTotalCost1200nSavingsGenerated18000nRoi1400nnteamsReportedA95AccuracyRateInCapturingActionItemsnnCommonMistakesToAvoidnnMistake1LackOfContextndontSummarizeWithoutFeedingAgendaOrProjectContextnnMistake2OverloadingSummariesnkeepSummariesConcisedontReplicateTranscriptsnnMistake3SkippingDistributionnifNoOneReadsTheSummaryTheAutomationFails",
      "title": "The AI-Powered Meeting Summaries Guide\\n\\n## Why AI Summaries Matter\\n\\nEndless meetings eat away at productivity, and taking notes distracts people from real discussions. AI meeting summaries free teams from manual note-taking while ensuring no detail is lost.\\n\\nThink of it as having an always-available scribe that never misses context.\\n\\n### The Core AI Summary Stages\\n\\n1. **Transcription AI** - Converts speech into accurate text in real time\\n2. **Summarization AI** - Condenses key points, decisions, and action items\\n3. **Categorization AI** - Tags tasks, deadlines, and responsible team members\\n4. **Distribution AI** - Sends summaries automatically to Slack, email, or project tools\\n\\n## The ROI of AI Meeting Summaries\\n\\n**Traditional Approach:**\\n- Average meeting: 1 hour, 6 attendees\\n- Note-taking & recap emails: ~1.5 hours total\\n- Annual time spent on note-taking: ~450 hours per team\\n\\n**AI Meeting Summaries:**\\n- Summaries generated in < 2 mins\\n- Annual time spent: ~30 hours\\n\\nThat's a **93% time saving** and sharper focus during meetings.\\n\\n## Tools You Need\\n\\n1. **OpenAI Whisper / GPT-4o** - Transcription & summarization\\n2. **Otter.ai / Fireflies.ai** - Live transcription\\n3. **Zapier/Make** - Distribute summaries\\n4. **Notion/Confluence API** - Auto-save structured notes\\n5. **Slack/Teams API** - Instant team updates\\n\\n## Sample Automation Script\\n\\nPython code snippet:\\n\\n    def summarize_meeting(transcript_text):\\n        summary = openai.ChatCompletion.create(\\n            model='gpt-4o',\\n            messages=[roleusercontentSummarize this meeting transcript into key points, action items, and decisions: ]\\n        )\\n        return summary.choices[0].message.content\\n\\n## Case Study: 60 Days of AI Summaries\\n\\n- **Meetings Processed:** 320\\n- **Summaries Generated:** 100%\\n- **Hours Saved:** ~380\\n- **Total Cost:** $1,200\\n- **Savings Generated:** $18,000\\n- **ROI:** 1,400%\\n\\nTeams reported a 95% accuracy rate in capturing action items.\\n\\n## Common Mistakes to Avoid\\n\\n### Mistake #1: Lack of Context\\nDon't summarize without feeding agenda or project context.\\n\\n### Mistake #2: Overloading Summaries\\nKeep summaries concise-don't replicate transcripts.\\n\\n### Mistake #3: Skipping Distribution\\nIf no one reads the summary, the automation fails.",
      "publishDate": "2025-09-06",
      "category": "ai-automation",
      "description": "Learn how AI meeting summaries save time, boost productivity, and ensure no detail is missed. Real case study with 1,400% ROI.",
      "readTime": "2 min",
      "url": "/ai-automation/the-ai-powered-meeting-summaries-guidenn-why-ai-summaries-matternnendless-meetings-eat-away-at-productivity-and-taking-notes-distracts-people-from-real-discussions-ai-meeting-summaries-free-teams-from-manual-note-taking-while-ensuring-no-detail-is-lostnnthink-of-it-as-having-an-always-available-scribe-that-never-misses-contextnn-the-core-ai-summary-stagesnn1-transcription-ai-converts-speech-into-accurate-text-in-real-timen2-summarization-ai-condenses-key-points-decisions-and-action-itemsn3-categorization-ai-tags-tasks-deadlines-and-responsible-team-membersn4-distribution-ai-sends-summaries-automatically-to-slack-email-or-project-toolsnn-the-roi-of-ai-meeting-summariesnntraditional-approachn-average-meeting-1-hour-6-attendeesn-note-taking-recap-emails-15-hours-totaln-annual-time-spent-on-note-taking-450-hours-per-teamnnai-meeting-summariesn-summaries-generated-in-2-minsn-annual-time-spent-30-hoursnnthats-a-93-time-saving-and-sharper-focus-during-meetingsnn-tools-you-neednn1-openai-whisper-gpt-4o-transcription-summarizationn2-otterai-firefliesai-live-transcriptionn3-zapiermake-distribute-summariesn4-notionconfluence-api-auto-save-structured-notesn5-slackteams-api-instant-team-updatesnn-sample-automation-scriptnnpython-code-snippetnn-def-summarizemeetingtranscripttextn-summary-openaichatcompletioncreaten-modelgpt-4on-messagesroleusercontentsummarize-this-meeting-transcript-into-key-points-action-items-and-decisions-n-n-return-summarychoices0messagecontentnn-case-study-60-days-of-ai-summariesnn-meetings-processed-320n-summaries-generated-100n-hours-saved-380n-total-cost-1200n-savings-generated-18000n-roi-1400nnteams-reported-a-95-accuracy-rate-in-capturing-action-itemsnn-common-mistakes-to-avoidnn-mistake-1-lack-of-contextndont-summarize-without-feeding-agenda-or-project-contextnn-mistake-2-overloading-summariesnkeep-summaries-concise-dont-replicate-transcriptsnn-mistake-3-skipping-distributionnif-no-one-reads-the-summary-the-automation-fails",
      "assetsCount": {
        "images": 1,
        "code_snippets": 0,
        "tables": 1,
        "charts": 1,
        "videos": 0
      }
    }
  ],
  "ai-news": [],
  "tool-comparisons": [],
  "builder-stories": [],
  "ai-reality-check": [],
  "trending-opportunities": []
};

export function getArticleBySlug(category: string, slug: string): ArticleEntry | undefined {
  return ARTICLE_REGISTRY[category]?.find(article => article.slug === slug);
}

export function getAllArticles(): ArticleEntry[] {
  return Object.values(ARTICLE_REGISTRY).flat();
}

export function getArticlesByCategory(category: string): ArticleEntry[] {
  return ARTICLE_REGISTRY[category] || [];
}

// Category mapping for navigation
export const CATEGORY_CONFIG = {
  'ai-automation': {
    name: 'AI Automation',
    description: 'Practical AI automation strategies and tools',
    path: '/ai-automation'
  },
  'ai-news': {
    name: 'AI News',
    description: 'Latest developments in artificial intelligence',
    path: '/ai-news'
  },
  'tool-comparisons': {
    name: 'Tool Comparisons',
    description: 'In-depth comparisons of AI tools and platforms',
    path: '/tool-comparisons'
  },
  'builder-stories': {
    name: 'Builder Stories',
    description: 'Stories from AI builders and entrepreneurs',
    path: '/builder-stories'
  },
  'ai-reality-check': {
    name: 'AI Reality Check',
    description: 'Critical analysis of AI trends and claims',
    path: '/ai-reality-check'
  },
  'trending-opportunities': {
    name: 'Trending Opportunities',
    description: 'Emerging opportunities in the AI space',
    path: '/trending-opportunities'
  }
} as const;
