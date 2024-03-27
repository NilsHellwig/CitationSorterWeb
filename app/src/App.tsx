import React, { useState } from "react";
import { Clipboard, Trash } from "phosphor-react"; // Import Phosphor Icons
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-github"; // Ändern Sie das Theme nach Bedarf

import { FaGithub } from "react-icons/fa";

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showCopyButton, setShowCopyButton] = useState(false);

  const notifyCopiedToClipboard = () => toast.success("Text copied to clipboard!");

  const copyFormattedCode = () => {
    navigator.clipboard.writeText(outputText);
    notifyCopiedToClipboard(); // Anzeige des Toasts
  };

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

  const clearInputs = () => {
    setInputText("");
    setOutputText("");
    setShowCopyButton(false);
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    const convertedText = replaceCitations(value);
    setOutputText(convertedText);
    setShowCopyButton(true);
  };

  const currentYear = new Date().getFullYear();

  const openGithubProfile = () => {
    // Öffnen Sie die GitHub-Profilseite in einem neuen Tab
    window.open("https://github.com/NilsHellwig/", "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex-grow max-w-800px mx-auto my-24 flex flex-col justify-center items-center gap-10 font-sans">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-bold">CitationSorter Web</h1>
          <div className="flex gap-2 items-center">
            <span>Author: </span>
            <div
              className="flex flex-row gap-3 justify-between items-center bg-gray-100 hover:bg-gray-200 hover:cursor-pointer py-1 px-3 rounded-full w-min"
              onClick={openGithubProfile} // Fügen Sie den onClick-Handler hinzu
            >
              <span className="text-sm">github/NilsHellwig</span>
              <FaGithub size={16} />
            </div>
          </div>
        </div>

        <p className="text-lg text-center">
          This tool helps you sort and format citation entries for LaTeX documents. Simply paste your LaTeX code with citations to start, then "Copy Formatted Code" to copy the sorted citations.
          CitationSorter Web is based on{" "}
          <a href="https://github.com/markusbink/CitationSorter/tree/main" className="text-blue-500 hover:underline">
            CitationSorter
          </a>{" "}
          by Markus Bink.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-bold">Input</h2>
          <AceEditor
            mode="latex"
            theme="github" // Ändern Sie das Theme nach Bedarf
            value={inputText}
            onChange={handleInputChange}
            name="latexInput"
            editorProps={{ $blockScrolling: true, highlightActiveLine: false }} // Deaktivieren Sie die gelbe Linie
            className="rounded-lg" // Maximale Breite
            height="200px" // Passen Sie die Höhe nach Bedarf an
            width="100%"
          />
        </div>

        <div className="flex flex-col w-56 items-center gap-2">
          <button onClick={clearInputs} className="px-4 py-2 bg-zinc-200 text-black rounded hover:bg-zinc-300 flex justify-between items-center w-full">
            <span>Clear</span>
            <Trash size={20} weight="regular" />
          </button>
          {showCopyButton && (
            <button onClick={copyFormattedCode} className="px-4 py-2 bg-zinc-200 text-black rounded hover:bg-zinc-300 flex justify-between items-center w-full">
              <span>Copy Formatted Code</span>
              <Clipboard size={20} weight="regular" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-bold">Formatted Output</h2>
          <AceEditor
            mode="latex"
            theme="github" // Ändern Sie das Theme nach Bedarf
            value={outputText}
            name="latexOutput"
            editorProps={{ $blockScrolling: true, highlightActiveLine: false }} // Deaktivieren Sie die gelbe Linie
            className="rounded-lg" // Maximale Breite
            height="200px" // Passen Sie die Höhe nach Bedarf an
            width="100%"
            readOnly
          />
        </div>
      </div>
      <footer className="text-center text-gray-600 text-sm mt-4 pb-4">© Nils Hellwig {currentYear}</footer>
    </div>
  );
};

export default App;
