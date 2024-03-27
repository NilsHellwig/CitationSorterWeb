import React, { useState } from "react";
import { Clipboard, Trash } from "phosphor-react"; // Import Phosphor Icons
import "./App.css";

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showCopyButton, setShowCopyButton] = useState(false);

  const replaceCitations = (text: string): string => {
    const replacedText = text.replace(/\\cite.*?{(.+?)}/g, (match) => {
      return sortCites(match);
    });
    return replacedText;
  };

  const sortCites = (rawCitation: string): string => {
    const match = rawCitation.match(/(\\cite.*?){(.+?)}/);
    const citationType = match ? match[1] : "";
    const citations = match ? match[2].split(",").map((cite) => cite.trim()) : [];

    if (citations.length <= 1) {
      return rawCitation;
    }

    const sortedCitations = citations.sort((a, b) => (getAuthorYear(a) > getAuthorYear(b) ? 1 : -1));
    const sortedCitationsString = sortedCitations.join(",");
    return citationType + "{" + sortedCitationsString + "}";
  };

  const getAuthorYear = (cite: string): string => {
    const match = cite.match(/(\w+)(\d{4})(?:\w+)?/);
    const author = match ? match[1] : "";
    const year = match ? parseInt(match[2]) : 0;
    return author + year;
  };

  const copyFormattedCode = () => {
    navigator.clipboard.writeText(outputText);
    // Optionally provide feedback to the user that the text has been copied
  };

  const clearInputs = () => {
    setInputText("");
    setOutputText("");
    setShowCopyButton(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const convertedText = replaceCitations(text);
    setOutputText(convertedText);
    setShowCopyButton(true);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-800px mx-auto my-24 flex flex-col justify-center items-center gap-10 font-sans">
        <h1 className="text-4xl font-bold">CitationSorter Web</h1>
        <p className="text-lg text-center">
          This tool helps you sort and format citation entries for LaTeX documents. Simply paste your LaTeX code with citations to start, then "Copy Formatted Code" to copy the sorted citations.
          CitationSorter Web is based on{" "}
          <a href="https://github.com/markusbink/CitationSorter/tree/main" className="text-blue-500 hover:underline">
            CitationSorter
          </a>{" "}
          by Markus Bink.
        </p>
        <textarea id="latexInput" rows={10} className="w-full p-4 border border-gray-300 rounded" value={inputText} onChange={handleInputChange} />
        <div className="flex flex-col w-56 items-center gap-2">
          <button onClick={clearInputs} className="px-4 py-2 bg-slate-200 text-black rounded hover:bg-slate-300 flex justify-between items-center w-full">
            <span>Clear</span>
            <Trash size={20} weight="regular" />
          </button>
          {showCopyButton && (
            <button onClick={copyFormattedCode} className="px-4 py-2 bg-slate-200 text-black rounded hover:bg-slate-300 flex justify-between items-center w-full">
              <span>Copy Formatted Code</span>
              <Clipboard size={20} weight="regular" />
            </button>
          )}
        </div>

        <textarea id="outputInput" rows={10} className="w-full p-4 border border-gray-300 rounded" value={outputText} readOnly />
      </div>
      <footer className="text-center text-gray-600 text-sm mt-4 pb-4">© Nils Hellwig {currentYear}</footer>
    </div>
  );
};

export default App;
