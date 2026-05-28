import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { College, DiscussionThread } from "../types";
import { AlertBanner } from "../components/Feedback";
import { MessageSquare, PlusCircle, Send, Search, BookOpen, Clock3, UserCircle2, ArrowRight, Sparkles } from "lucide-react";
import { getErrorMessage } from "../utils/error";

interface DiscussionsPageProps {
  colleges: College[];
  onViewDetails: (slug: string) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DiscussionsPage({ colleges, onViewDetails }: DiscussionsPageProps) {
  const { user } = useAuth();
  const [selectedCollegeSlug, setSelectedCollegeSlug] = useState("");
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [newQuestionAuthor, setNewQuestionAuthor] = useState(user?.email || "");
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!newQuestionAuthor && user?.email) {
      setNewQuestionAuthor(user.email);
    }
  }, [user, newQuestionAuthor]);

  useEffect(() => {
    if (!selectedCollegeSlug && colleges[0]) {
      setSelectedCollegeSlug(colleges[0].slug);
    }
  }, [colleges, selectedCollegeSlug]);

  useEffect(() => {
    async function loadDiscussions() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const query = new URLSearchParams();
        if (selectedCollegeSlug) query.set("collegeSlug", selectedCollegeSlug);
        const searchParam = (search || "").trim();
        if (searchParam) query.set("search", searchParam);

        const res = await fetch(`/api/discussions?${query.toString()}`);
        if (!res.ok) {
          throw new Error("Could not load discussions right now.");
        }
        const data = await res.json();
        setThreads(data.discussions || []);
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err, "Failed to load the discussion feed."));
      } finally {
        setIsLoading(false);
      }
    }

    loadDiscussions();
  }, [selectedCollegeSlug, search]);

  const selectedCollege = colleges.find((college) => college.slug === selectedCollegeSlug);
  const totalAnswers = threads.reduce((count, thread) => count + thread.answers.length, 0);

  const handleCreateQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim() || !selectedCollege) return;

    setIsSubmittingQuestion(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newQuestionTitle.trim(),
          body: newQuestionBody.trim(),
          collegeSlug: selectedCollege.slug,
          collegeName: selectedCollege.name,
          author: newQuestionAuthor.trim() || user?.email || "Anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not post the question.");
      }

      setNewQuestionTitle("");
      setNewQuestionBody("");
      await refreshThreads();
    } catch (err: any) {
      setErrorMsg(getErrorMessage(err, "Failed to create the question."));
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  async function refreshThreads() {
    const query = new URLSearchParams();
    if (selectedCollegeSlug) query.set("collegeSlug", selectedCollegeSlug);
    if (search) query.set("search", search);

    const res = await fetch(`/api/discussions?${query.toString()}`);
    const data = await res.json();
    setThreads(data.discussions || []);
  }

  const handleAnswer = async (threadId: string) => {
    const body = answerDrafts[threadId]?.trim();
    if (!body) return;

    try {
      const res = await fetch(`/api/discussions/${threadId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          author: user?.email || newQuestionAuthor.trim() || "Anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not submit answer.");
      }

      setAnswerDrafts((current) => ({ ...current, [threadId]: "" }));
      await refreshThreads();
    } catch (err: any) {
      setErrorMsg(getErrorMessage(err, "Failed to post the answer."));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%)]" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
            <Sparkles className="h-3 w-3" />
            Ask, answer, and browse by college
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Discussions</h1>
          <p className="max-w-xl text-xs md:text-sm leading-relaxed text-slate-300">
            Ask admission questions, get answers from other applicants, and keep the conversation tied to the college you care about.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 sticky top-24">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Browse college</label>
              <select
                value={selectedCollegeSlug}
                onChange={(e) => setSelectedCollegeSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colleges.map((college) => (
                  <option key={college.id} value={college.slug}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live stats</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-white p-3 border border-slate-200">
                  <p className="text-2xl font-black text-slate-900">{threads.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Threads</p>
                </div>
                <div className="rounded-lg bg-white p-3 border border-slate-200">
                  <p className="text-2xl font-black text-slate-900">{totalAnswers}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Answers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleCreateQuestion} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PlusCircle className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-black text-slate-900">Ask a question</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Your name</label>
                <input
                  type="text"
                  value={newQuestionAuthor}
                  onChange={(e) => setNewQuestionAuthor(e.target.value)}
                  placeholder={user?.email || "Anonymous"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">College context</label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  {selectedCollege?.name || "Select a college"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Question title</label>
              <input
                type="text"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                placeholder="How are placements for this college?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Question details</label>
              <textarea
                rows={4}
                value={newQuestionBody}
                onChange={(e) => setNewQuestionBody(e.target.value)}
                placeholder="Share your rank, branch, budget, or anything else the community should know."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Questions and answers are stored in the local JSON database.
              </p>
              <button
                type="submit"
                disabled={isSubmittingQuestion || !selectedCollege}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                Post question
              </button>
            </div>
          </form>

          {errorMsg && (
            <AlertBanner tone="error" title="Discussion update failed" message={errorMsg} />
          )}

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading discussions...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-sm font-black text-slate-900">No threads yet</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Start the conversation for {selectedCollege?.name || "this college"} by posting the first question.
                </p>
              </div>
            ) : (
              threads.map((thread) => (
                <article key={thread.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-blue-700">{thread.collegeName}</span>
                        <span className="inline-flex items-center gap-1"><UserCircle2 className="h-3 w-3" /> {thread.author}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {formatDate(thread.createdAt)}</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">{thread.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{thread.body}</p>
                    </div>
                    <button
                      onClick={() => onViewDetails(thread.collegeSlug)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      View college
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      Answers ({thread.answers.length})
                    </div>

                    <div className="space-y-2">
                      {thread.answers.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                          No answers yet. Be the first to reply.
                        </p>
                      ) : (
                        thread.answers.map((answer) => (
                          <div key={answer.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <span className="text-slate-700">{answer.author}</span>
                              <span>{formatDate(answer.createdAt)}</span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{answer.body}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Write an answer
                      </label>
                      <textarea
                        rows={3}
                        value={answerDrafts[thread.id] || ""}
                        onChange={(e) => setAnswerDrafts((current) => ({ ...current, [thread.id]: e.target.value }))}
                        placeholder="Share your experience or advice"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-slate-500">
                          {user?.email ? `Posting as ${user.email}` : "Posting as Anonymous"}
                        </p>
                        <button
                          onClick={() => handleAnswer(thread.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
