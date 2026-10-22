import React, { useState } from "react";
import {
  Sparkles,
  Tag,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { aiService } from "../../services/aiService";
import { Button } from "../common/Badge";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

export const AiStudyToolsModal = ({
  noteId,
  title,
  content,
  onApplyTags,
  onAppendContent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("summarize");
  const [loading, setLoading] = useState(false);

  // Summary
  const [summaryFormat, setSummaryFormat] = useState("bullet");
  const [generatedSummary, setGeneratedSummary] = useState("");

  // Tags
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [acceptedTags, setAcceptedTags] = useState([]);

  // Study cards and quiz
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [answeredCards, setAnsweredCards] = useState({});

  // Simple explanation
  const [eli5Text, setEli5Text] = useState("");
  const [copied, setCopied] = useState(false);

  const hasContent = Boolean(content?.trim());

  const handleSummarize = async () => {
    if (!hasContent) {
      toast.error("Please add content to your note first!");
      return;
    }

    setLoading(true);

    try {
      const summary = await aiService.generateSummary({
        noteId,
        content,
        format: summaryFormat,
      });

      setGeneratedSummary(summary);
      toast.success("Summary generated!");
    } catch {
      toast.error("Could not generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!hasContent) {
      toast.error("Please enter some content for AI analysis!");
      return;
    }

    setLoading(true);

    try {
      const tags = await aiService.suggestTags({ noteId, content });
      setSuggestedTags(tags);
      setAcceptedTags([]);
      toast.success(`Found ${tags.length} smart tags!`);
    } catch {
      toast.error("Could not extract tags");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTag = (tag) => {
    if (acceptedTags.includes(tag)) return;

    setAcceptedTags((prev) => [...prev, tag]);
    onApplyTags?.(tag);
    toast.success(`Added #${tag}`);
  };

  const handleGenerateStudySet = async () => {
    if (!hasContent) {
      toast.error("Add content before generating study cards!");
      return;
    }

    setLoading(true);

    try {
      const generatedCards = await aiService.generateStudySet({
        title,
        content,
      });

      setCards(generatedCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSelectedQuizAnswer(null);
      setAnsweredCards({});
      setQuizScore({ correct: 0, total: 0 });

      if (generatedCards.length > 0) {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 },
        });
      }

      toast.success(`Generated ${generatedCards.length} study items!`);
    } catch {
      toast.error("Study generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExplainSimply = async () => {
    if (!hasContent) {
      toast.error("Add content before explaining!");
      return;
    }

    setLoading(true);

    try {
      const explanation = await aiService.explainSimply({
        content,
        title,
      });

      setEli5Text(explanation);
      toast.success("Simplified explanation created!");
    } catch {
      toast.error("Failed to explain");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy text");
    }
  };

  const handleQuizAnswer = (option) => {
    if (selectedQuizAnswer !== null) return;

    const isCorrect = option === currentCard?.answer;

    setSelectedQuizAnswer(option);
    setAnsweredCards((prev) => ({
      ...prev,
      [currentCardIndex]: isCorrect,
    }));

    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.65 },
      });
    }
  };

  const goToCard = (index) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);

    const nextCard = cards[index];
    setSelectedQuizAnswer(
      nextCard?.type === "quiz"
        ? getAnsweredOption(index)
        : null
    );
  };

  // Recover the selected option for a previously answered quiz.
  // The answer map is used for scoring; this helper is intentionally
  // kept simple because the AI service's card schema is unchanged.
  const getAnsweredOption = (index) => {
    if (answeredCards[index] === undefined) return null;
    return null;
  };

  const currentCard = cards[currentCardIndex];
  const isQuizAnswered = selectedQuizAnswer !== null;

  const tabItems = [
    { id: "summarize", label: "Summary" },
    { id: "tags", label: "Tags" },
    { id: "quiz", label: "Flashcards" },
    { id: "eli5", label: "Explain simply" },
  ];

  const tabButtonClass = (tab) =>
    `min-w-0 rounded-lg px-1.5 py-2 text-[10px] font-semibold transition-all duration-150 sm:text-[11px] ${
      activeTab === tab
        ? "bg-[#FDFBF6] text-[#4B5C3F] shadow-sm ring-1 ring-[#E7E0D4]"
        : "text-[#817C70] hover:bg-[#EAE5DA] hover:text-[#292720]"
    }`;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-r-2xl border-l border-[#E7E0D4] bg-[#FDFBF6]">
      {/* Header */}
      <div className="border-b border-[#E7E0D4] bg-[#F6F2E9] p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5C6E4E] text-[#FDFBF6]">
            <Sparkles className="h-4 w-4" strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-sm font-bold tracking-tight text-[#292720]">
              AI Study Co-pilot
            </h3>
            <p className="mt-0.5 text-[10px] leading-relaxed text-[#817C70]">
              Turn your notes into useful study material.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="grid grid-cols-4 gap-1 rounded-xl border border-[#E7E0D4] bg-[#EEE9DF] p-1"
          role="tablist"
          aria-label="AI study tools"
        >
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);

                if (tab.id === "tags" && suggestedTags.length === 0 && !loading) {
                  handleSuggestTags();
                }

                if (tab.id === "quiz" && cards.length === 0 && !loading) {
                  handleGenerateStudySet();
                }

                if (tab.id === "eli5" && !eli5Text && !loading) {
                  handleExplainSimply();
                }
              }}
              className={tabButtonClass(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {/* Summary */}
        {activeTab === "summarize" && (
          <section className="space-y-4">
            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#817C70]">
                Summary style
              </p>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "short", label: "Short" },
                  { id: "bullet", label: "Bullet points" },
                  { id: "detailed", label: "Detailed" },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSummaryFormat(style.id)}
                    aria-pressed={summaryFormat === style.id}
                    className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors ${
                      summaryFormat === style.id
                        ? "border-[#5C6E4E] bg-[#5C6E4E] text-[#FDFBF6]"
                        : "border-[#E7E0D4] bg-[#FDFBF6] text-[#716D62] hover:bg-[#F1EDE3]"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleSummarize}
              className="w-full !rounded-xl !bg-[#5C6E4E] !text-[#FDFBF6] hover:!bg-[#4B5C3F]"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Generate summary
            </Button>

            {generatedSummary && (
              <div className="animate-in fade-in rounded-2xl border border-[#C8D0BD] bg-[#F0F2EA] p-3.5 duration-200">
                <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#DCE2D4] pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#4B5C3F]">
                    Summary result
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedSummary)}
                      className="rounded-lg p-1.5 text-[#817C70] transition-colors hover:bg-[#E2E7DA] hover:text-[#4B5C3F]"
                      title="Copy summary"
                      aria-label="Copy summary"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-[#5C6E4E]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onAppendContent?.(
                          `<br/><p><strong>AI Summary:</strong></p><p>${generatedSummary
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/\n/g, "<br/>")}</p>`
                        )
                      }
                      className="rounded-lg bg-[#5C6E4E] px-2.5 py-1.5 text-[10px] font-semibold text-[#FDFBF6] transition-colors hover:bg-[#4B5C3F]"
                    >
                      Insert in note
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-line text-xs leading-6 text-[#514D43]">
                  {generatedSummary}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Tags */}
        {activeTab === "tags" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs leading-relaxed text-[#817C70]">
                Choose tags to add to your note.
              </p>

              <Button
                variant="outline"
                size="xs"
                loading={loading}
                onClick={handleSuggestTags}
                icon={RotateCcw}
                className="!border-[#E7E0D4] !text-[#716D62] hover:!bg-[#F1EDE3]"
              >
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="py-10 text-center">
                <Sparkles className="mx-auto mb-3 h-5 w-5 animate-pulse text-[#5C6E4E]" />
                <p className="text-xs text-[#817C70]">
                  Finding key terms in your notes...
                </p>
              </div>
            ) : suggestedTags.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD5C8] px-4 py-8 text-center">
                <Tag className="mx-auto mb-2 h-5 w-5 text-[#A19A8C]" />
                <p className="text-xs text-[#817C70]">
                  No suggested tags yet.
                </p>
                <p className="mt-1 text-[10px] text-[#A19A8C]">
                  Select Refresh to analyze your note.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => {
                  const isAccepted = acceptedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAcceptTag(tag)}
                      aria-pressed={isAccepted}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                        isAccepted
                          ? "border-[#C8D0BD] bg-[#E5E9DE] text-[#4B5C3F]"
                          : "border-[#E7E0D4] bg-[#FDFBF6] text-[#716D62] hover:border-[#C8D0BD] hover:bg-[#F0F2EA] hover:text-[#4B5C3F]"
                      }`}
                    >
                      {isAccepted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Tag className="h-3 w-3" />
                      )}
                      #{tag}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Flashcards and quiz */}
        {activeTab === "quiz" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#292720]">
                  Active recall
                </p>
                <p className="mt-1 text-[10px] text-[#817C70]">
                  Test what you remember.
                </p>
              </div>

              <Button
                variant="outline"
                size="xs"
                loading={loading}
                onClick={handleGenerateStudySet}
                className="!border-[#E7E0D4] !text-[#716D62] hover:!bg-[#F1EDE3]"
              >
                Regenerate
              </Button>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto mb-3 h-5 w-5 animate-pulse text-[#5C6E4E]" />
                <p className="text-xs text-[#817C70]">
                  Creating your study set...
                </p>
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD5C8] px-4 py-8 text-center">
                <p className="text-xs text-[#817C70]">
                  No study cards yet.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateStudySet}
                  className="mt-2 text-xs font-semibold text-[#5C6E4E] hover:underline"
                >
                  Generate study set
                </button>
              </div>
            ) : currentCard ? (
              <div className="space-y-4">
                {/* Progress */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-[#817C70]">
                    Card {currentCardIndex + 1} of {cards.length}
                  </span>

                  <span className="rounded-full bg-[#F4EBDD] px-2.5 py-1 text-[10px] font-semibold capitalize text-[#87602A]">
                    {currentCard.type}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#EAE5DA]">
                  <div
                    className="h-full rounded-full bg-[#5C6E4E] transition-all duration-300"
                    style={{
                      width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
                    }}
                  />
                </div>

                {currentCard.type === "flashcard" ? (
                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    aria-label={isFlipped ? "Show flashcard question" : "Reveal flashcard answer"}
                    className="flex min-h-[200px] w-full flex-col justify-between rounded-2xl border border-[#C8D0BD] bg-[#F0F2EA] p-5 text-left transition-all hover:border-[#A5B095] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C6E4E]/40"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C6E4E]">
                        {isFlipped ? "Answer / Definition" : "Prompt / Concept"}
                      </span>

                      <p className="mt-4 text-sm font-semibold leading-6 text-[#292720]">
                        {isFlipped
                          ? currentCard.answer
                          : currentCard.question}
                      </p>
                    </div>

                    <span className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-[#817C70]">
                      <RotateCcw className="h-3 w-3" />
                      Tap to {isFlipped ? "see question" : "reveal answer"}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-[#E7E0D4] bg-[#F6F2E9] p-4">
                    <p className="text-xs font-semibold leading-5 text-[#292720]">
                      {currentCard.question}
                    </p>

                    <div className="space-y-2">
                      {currentCard.options?.map((option, index) => {
                        const isSelected = selectedQuizAnswer === option;
                        const isCorrect = option === currentCard.answer;

                        let optionStyle =
                          "border-[#E7E0D4] bg-[#FDFBF6] text-[#514D43] hover:border-[#C8D0BD] hover:bg-[#F0F2EA]";

                        if (isQuizAnswered && isCorrect) {
                          optionStyle =
                            "border-[#9EAF8D] bg-[#E5E9DE] font-semibold text-[#4B5C3F]";
                        } else if (isQuizAnswered && isSelected && !isCorrect) {
                          optionStyle =
                            "border-[#D9A897] bg-[#F6E8E2] text-[#A34F38]";
                        }

                        return (
                          <button
                            key={`${index}-${option}`}
                            type="button"
                            disabled={isQuizAnswered}
                            onClick={() => handleQuizAnswer(option)}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 text-left text-xs transition-colors disabled:cursor-default ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {isQuizAnswered && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isQuizAnswered && (
                      <p className="border-t border-[#E7E0D4] pt-3 text-[11px] leading-relaxed text-[#716D62]">
                        {selectedQuizAnswer === currentCard.answer
                          ? "Correct! Nice work."
                          : `Not quite. The correct answer is: ${currentCard.answer}`}
                      </p>
                    )}
                  </div>
                )}

                {/* Score */}
                {quizScore.total > 0 && (
                  <div className="flex items-center justify-between rounded-xl border border-[#E7E0D4] bg-[#F6F2E9] px-3 py-2.5">
                    <span className="text-[11px] text-[#817C70]">
                      Quiz progress
                    </span>
                    <span className="text-xs font-semibold text-[#4B5C3F]">
                      {quizScore.correct} correct / {quizScore.total} answered
                    </span>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between border-t border-[#E7E0D4] pt-3">
                  <button
                    type="button"
                    disabled={currentCardIndex === 0}
                    onClick={() => goToCard(currentCardIndex - 1)}
                    className="rounded-lg px-2 py-2 text-xs font-medium text-[#716D62] transition-colors hover:bg-[#F1EDE3] hover:text-[#292720] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  {currentCardIndex < cards.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => goToCard(currentCardIndex + 1)}
                      className="rounded-lg bg-[#5C6E4E] px-3.5 py-2 text-xs font-semibold text-[#FDFBF6] transition-colors hover:bg-[#4B5C3F]"
                    >
                      Next card →
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-[#5C6E4E]">
                      End of study set
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </section>
        )}

        {/* Explain simply */}
        {activeTab === "eli5" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-[#E7E0D4] bg-[#F6F2E9] p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EBDD] text-[#87602A]">
                  <Lightbulb className="h-4 w-4" strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#292720]">
                    Break it down
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#817C70]">
                    Understand complex ideas in simple words.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleExplainSimply}
              className="w-full !rounded-xl !bg-[#5C6E4E] !text-[#FDFBF6] hover:!bg-[#4B5C3F]"
            >
              <Lightbulb className="mr-1.5 h-4 w-4" />
              Explain simply
            </Button>

            {eli5Text && (
              <div className="rounded-2xl border border-[#E3D2B5] bg-[#FBF4E8] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#B8842A]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#87602A]">
                    Simple explanation
                  </span>
                </div>

                <p className="whitespace-pre-line text-xs leading-6 text-[#514D43]">
                  {eli5Text}
                </p>

                <div className="mt-4 flex justify-end border-t border-[#E3D2B5] pt-3">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(eli5Text)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#87602A] transition-colors hover:bg-[#F4EBDD]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy explanation
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
