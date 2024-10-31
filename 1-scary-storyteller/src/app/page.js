"use client";

import { useState } from "react";

export default function Home() {
  const [story, setStory] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setStory("");
    setLoading(true);
    const subject = event.target.subject.value;
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({ subject }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunkValue = decoder.decode(value);

      if (chunkValue.startsWith('{"imageUrl":')) {
        const jsonChunk = JSON.parse(chunkValue);
        setImageUrl(jsonChunk.imageUrl);
        setLoading(false);
      } else {
        setStory((prevStory) => {
          if (prevStory === undefined) {
            return chunkValue;
          } else {
            return prevStory + chunkValue;
          }
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-12">Scary Storyteller App</h1>
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Main subject of the story:
            </label>
            <div className="mt-2">
              <input
                id="subject"
                name="subject"
                type="subject"
                className="block w-full rounded-md p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Generate text
            </button>
          </div>
        </form>
      </div>

      {story ? (
        <div className="bg-indigo-100 mt-12 max-w-2xl mx-auto">
          <div className="mx-auto p-6 lg:flex lg:items-center lg:justify-between rounded-md">
            {story}
          </div>
          {loading ? (
            <div class="h-8 w-8 mb-4 animate-spin mx-auto rounded-full border-b-2 border-current" />
          ) : (
            <div className="mx-auto p-6 lg:flex lg:items-center lg:justify-between max-w-md">
              <img src={imageUrl} />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
