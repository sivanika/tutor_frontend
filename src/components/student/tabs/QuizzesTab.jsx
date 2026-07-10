import { useState, useEffect } from "react"
import { FiZap, FiAward, FiClock, FiCheckCircle, FiChevronRight, FiChevronLeft, FiAlertTriangle, FiX } from "react-icons/fi"
import API from "../../../services/api"
import socket from "../../../services/socket"
import toast from "react-hot-toast"

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [submittingAttempt, setSubmittingAttempt] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const res = await API.get("/lms/student/quizzes")
      setQuizzes(res.data.quizzes || [])
    } catch (e) {
      toast.error("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizzes()
    socket.on("dashboard:update", (data) => {
      if (data.type === "quizzes") {
        loadQuizzes()
      }
    })
    return () => {
      socket.off("dashboard:update")
    }
  }, [])

  const startQuiz = (quiz) => {
    if (quiz.questionsCount === 0) {
      return toast.error("This quiz has no questions yet")
    }
    setActiveQuiz(quiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswers(new Array(quiz.questions.length).fill(null))
    setQuizResult(null)
  }

  const handleSelectOption = (optionIndex) => {
    const next = [...selectedAnswers]
    next[currentQuestionIndex] = optionIndex
    setSelectedAnswers(next)
  }

  const submitQuiz = async () => {
    // Check if all questions are answered
    const unansweredIndex = selectedAnswers.indexOf(null)
    if (unansweredIndex !== -1) {
      return toast.error(`Please answer all questions before submitting. Question ${unansweredIndex + 1} is unanswered.`)
    }

    try {
      setSubmittingAttempt(true)
      const res = await API.post(`/lms/student/quizzes/${activeQuiz._id}/attempt`, { answers: selectedAnswers })
      setQuizResult(res.data)
      loadQuizzes()
    } catch {
      toast.error("Failed to submit quiz attempt")
    } finally {
      setSubmittingAttempt(false)
    }
  }

  const statsAttempts = quizzes.filter(q => q.status !== "available").length
  const statsPassed = quizzes.filter(q => q.status === "passed").length
  const passRate = statsAttempts > 0 ? Math.round((statsPassed / statsAttempts) * 100) : 0

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  // Active quiz screen
  if (activeQuiz) {
    const totalQuestions = activeQuiz.questions.length
    const currentQuestion = activeQuiz.questions[currentQuestionIndex]
    const answeredCount = selectedAnswers.filter(a => a !== null).length
    const progressPct = Math.round((answeredCount / totalQuestions) * 100)

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        {quizResult ? (
          <div className="card p-8 text-center space-y-5">
            <span className="text-6xl block">{quizResult.passed ? "🏆" : "⚠️"}</span>
            <div>
              <h3 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                {quizResult.passed ? "Congratulations!" : "Keep Practicing!"}
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                You scored <strong className="text-base text-blue-600">{quizResult.score}%</strong> in the quiz.
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                Correct answers: {quizResult.correctCount} out of {quizResult.totalQuestions} (Passing: {activeQuiz.passingScore})
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setActiveQuiz(null)}
                className="btn-ripple px-6 py-2.5 rounded-xl text-white font-black text-sm bg-gradient-to-r from-violet-500 to-purple-600 shadow"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border-soft)" }}>
              <div>
                <span className="text-[10px] font-black uppercase text-violet-600 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">
                  {activeQuiz.course}
                </span>
                <h3 className="font-black text-base mt-1" style={{ color: "var(--text-primary)" }}>{activeQuiz.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--surface-alt)] text-gray-400 transition"
              >
                <FiX size={16}/>
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-gray-150 dark:bg-gray-800">
              <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${progressPct}%` }}/>
            </div>

            {/* Question Body */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                <span>QUESTION {currentQuestionIndex + 1} OF {totalQuestions}</span>
                <span>⏱ Limit: {activeQuiz.timeLimit}</span>
              </div>

              <h4 className="font-black text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {currentQuestion.questionText}
              </h4>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const selected = selectedAnswers[currentQuestionIndex] === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between group ${
                        selected
                          ? "border-violet-500 bg-violet-50/50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                          : "hover:bg-[var(--surface-alt)]"
                      }`}
                      style={{ borderColor: selected ? undefined : "var(--border-soft)", color: selected ? undefined : "var(--text-primary)" }}
                    >
                      <span>{option}</span>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-black ${
                        selected ? "bg-violet-500 border-violet-500 text-white" : "group-hover:border-violet-400"
                      }`} style={{ borderColor: selected ? undefined : "var(--border-soft)" }}>
                        {selected ? "✓" : String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-5 border-t bg-[var(--surface-alt)] flex items-center justify-between" style={{ borderColor: "var(--border-soft)" }}>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="btn-ripple px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-1 hover:bg-gray-100 disabled:opacity-40 transition"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
              >
                <FiChevronLeft size={14}/> Previous
              </button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  disabled={submittingAttempt}
                  onClick={submitQuiz}
                  className="btn-ripple px-5 py-2.5 rounded-xl text-white text-xs font-black bg-gradient-to-r from-violet-500 to-purple-600 shadow"
                >
                  {submittingAttempt ? "Submitting..." : "Submit Quiz"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="btn-ripple px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-1 hover:bg-gray-100 transition"
                  style={{ borderColor: "var(--border-soft)", color: "var(--text-primary)" }}
                >
                  Next <FiChevronRight size={14}/>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-violet-500 to-purple-600">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #fff, transparent)" }}/>
        <h2 className="text-xl md:text-2xl font-black">Quizzes</h2>
        <p className="text-purple-100 text-sm mt-1 max-w-md">
          Assess your understanding, verify passing scores, and view attempt history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Quiz Attempts", count: statsAttempts, icon: "📝", color: "from-blue-500 to-indigo-500" },
          { label: "Passed Quizzes", count: statsPassed, icon: "🏆", color: "from-emerald-400 to-green-500" },
          { label: "Overall Pass Rate", count: `${passRate}%`, icon: "🔥", color: "from-amber-400 to-orange-500" },
        ].map(({ label, count, icon, color }) => (
          <div key={label} className="card p-5 relative overflow-hidden">
            <span className="absolute right-4 top-4 text-2xl">{icon}</span>
            <div className="text-2xl font-black mb-0.5" style={{ color: "var(--text-primary)" }}>{count}</div>
            <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${color}`}/>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Active Assessments</h3>
        {quizzes.length === 0 ? (
          <div className="card p-10 text-center">
            <FiZap className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>No assessments available</p>
          </div>
        ) : (
          quizzes.map(quiz => (
            <div key={quiz._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  quiz.status === "passed" ? "bg-green-50 text-green-600" : "bg-violet-50 text-violet-600"
                }`}>
                  <FiZap size={18}/>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">
                    {quiz.course}
                  </span>
                  <h4 className="font-black text-sm mt-1" style={{ color: "var(--text-primary)" }}>{quiz.title}</h4>
                  <p className="text-xs mt-0.5 flex gap-3" style={{ color: "var(--text-muted)" }}>
                    <span>⏱ {quiz.timeLimit}</span>
                    <span>❓ {quiz.questionsCount} Questions</span>
                    <span>🎯 Passing: {quiz.passingScore}</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0" style={{ borderColor: "var(--border-soft)" }}>
                {quiz.status === "passed" ? (
                  <span className="text-[10px] font-black bg-green-50 text-green-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FiCheckCircle size={12}/> Passed with {quiz.score}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    {quiz.status === "failed" && (
                      <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-lg flex items-center gap-1 mr-2">
                        <FiAlertTriangle size={11}/> Failed ({quiz.score})
                      </span>
                    )}
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="btn-ripple px-4 py-2 rounded-xl text-white text-xs font-black bg-gradient-to-r from-violet-500 to-purple-600 shadow hover:shadow-md transition"
                    >
                      {quiz.status === "failed" ? "Retake Quiz" : "Start Quiz"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
