import React from "react";

const Status = ({ data, message }) => {
  if (!data) return <p className="text-gray-500">No status available.</p>;

  const isRun = message === "run";
  const isSubmit = message === "submit";

  let result = data.data;
  let testResults = [];
  let wrongCases = [];

  if (isSubmit) {
    result = data.data.submittedResult;
    testResults = data.data.testResults || [];
    wrongCases = data.data.wrongCases || [];
  }

  const statusColor = (status) =>
    status === "Accepted" ? "text-green-600" : "text-red-600";

  // -------------------------------------------------------
  // 1️⃣ DISPLAY COMPILER ERROR IF EXISTS
  // -------------------------------------------------------
  const errorMessage =
    (isSubmit && result.errorMessage) || (isRun && data.data.errorMessage);

  if (errorMessage && errorMessage.trim() !== "") {
    return (
      <div className="w-full p-2">
        <div className="p-2 border bg-red-50 text-red-700 rounded">
          <p className="font-bold mb-2">Compiler Error:</p>

          {errorMessage.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // 2️⃣ SUBMIT → SHOW SUBMISSION SUMMARY
  // -------------------------------------------------------
  return (
    <div className="w-full p-2">

      {isSubmit && (
        <div className="p-2 border rounded bg-gray-50 shadow-sm my-3">
          <p className={`text-md font-semibold ${statusColor(result.status)}`}>
            Final Status: {result.status}
          </p>

          <p className="text-sm text-gray-800 mt-2">
            <b>Testcases Passed:</b> {result.testCasesPassed} /{" "}
            {result.totalTestCases}
          </p>

          <p className="text-sm text-gray-800"><b>Runtime:</b> {result.runtime}</p>
          <p className="text-sm text-gray-800"><b>Memory:</b> {result.memory}</p>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* 3️⃣ RUN MODE — SHOW ALL TESTCASES */}
      {/* ------------------------------------------------------- */}
      {isRun &&
        (Array.isArray(result)
          ? result.map((test, index) => (
              <TestCaseBlock key={index} test={test} index={index} statusColor={statusColor} />
            ))
          : (
            <TestCaseBlock test={result} index={0} statusColor={statusColor} />
          ))}

      {/* ------------------------------------------------------- */}
      {/* 4️⃣ SUBMIT MODE — SHOW ALL WRONG TESTCASES */}
      {/* ------------------------------------------------------- */}
      {isSubmit && wrongCases.length > 0 && (
        <div className="mt-3">
          <h2 className="font-semibold text-lg text-red-600 mb-2">
            Wrong Testcases ({wrongCases.length})
          </h2>

          {wrongCases.map((test, index) => (
            <div key={index} className="p-2 mb-3 border rounded bg-red-50 shadow-sm">

              <p className="font-semibold text-gray-800">
                Testcase {test.testCaseNumber}
              </p>

              <p className="text-sm"><b>Input:</b> {JSON.stringify(test.input)}</p>
              <p className="text-sm"><b>Expected:</b> {test.expected}</p>
              <p className="text-sm text-red-700"><b>Output:</b> {test.got}</p>

            </div>
          ))}
        </div>
      )}

      {isSubmit && wrongCases.length === 0 && (
        <p className="text-green-700 mt-2 font-semibold">🎉 All testcases passed!</p>
      )}
    </div>
  );
};

// -------------------------------------------------------
// Extracted TestCase Component
// -------------------------------------------------------
const TestCaseBlock = ({ test, index, statusColor }) => (
  <div className="p-2 mb-3 border rounded bg-gray-50 shadow-sm">
    <p className="font-semibold text-gray-800">Testcase {index + 1}</p>

    <p className="text-sm text-gray-700 mt-1">
      <b>Stdin:</b> {test.stdin}
    </p>

    {test.stdout && (
      <p className="text-sm text-gray-700"><b>Stdout:</b> {test.stdout}</p>
    )}

    {test.expected_output && (
      <p className="text-sm text-gray-700">
        <b>Expected:</b> {test.expected_output}
      </p>
    )}

    {test.status?.description && (
      <p className={`text-sm mt-1 ${statusColor(test.status.description)}`}>
        <b>Status:</b> {test.status.description}
      </p>
    )}

    {test.compile_output && (
      <div className="text-sm text-red-500 mt-2">
        <b>Compiler Error:</b>
        {test.compile_output.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    )}
  </div>
);

export default Status;
