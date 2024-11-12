"use client";

import { useState } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [initialAsk, setInitialAsk] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState("");
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async () => {
    setInitialAsk(true);
    setLoading(true)
    const response = await fetch("/api");
    const { data } = await response.json()

    setQuestion(data.question);
    setAnswers(data.answers);
    setCorrectAnswerIndex(data.correctIndex);
    setLoading(false)
  };

  const handleAnswerClick = (answer) => {
    const answerIndex = answers.indexOf(answer);
    if (answerIndex === correctAnswerIndex) {
      toast.success("Correct!");
    } else {
      toast.error("Wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">🏆 Sports Trivia Game 🏆</h1>
      <button
        onClick={handleAskQuestion}
        className={initialAsk ? "hidden" : "block" + " rounded-md bg-indigo-600 px-5 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
      >
        Ask me a sports trivia question
      </button>
      {question && (
        <div className="bg-white border border-solid border-indigo-600 p-8 mt-8 rounded-lg shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">{question}</h2>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {answers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswerClick(answer)}
                className="rounded-md bg-indigo-600 px-5 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {answer}
              </button>
            ))}
          </div>
          {loading ? (            
            <div class="h-8 w-8 mt-8 animate-spin mx-auto rounded-full border-b-2 border-current" />
          ) : (
            <div className="text-center font-semibold text-indigo-600 text-sm mt-8">
              <button onClick={handleAskQuestion}>Get a new question</button>
            </div>
          )}
        </div>
      )}
      <ToastContainer 
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        transition={Flip}
      />
    </div>
  );
}