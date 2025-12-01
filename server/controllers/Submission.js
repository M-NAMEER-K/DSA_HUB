const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemHelper");

// -------------------- Helper --------------------
const normalizeArrayUnordered = (val) => {
  try {
    const arr = Array.isArray(val) ? val : JSON.parse(val);
    return arr.slice().sort((a, b) => a - b).join(',');
  } catch {
    return String(val).replace(/[\[\]\s\r\n]/g, '');
  }
};

// -------------------- Submit Code --------------------
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ success: false, message: "Some fields are missing" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      totalTestCases: problem.hiddenTestCases.length,
      errorMessage: "",
      runtime: "",
      memory: "",
      testCasesPassed: 0
    });

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: JSON.stringify(tc.input)
    }));

    const batch = await submitBatch(submissions);
    const tokens = batch.map(b => b.token);
    const testResults = await submitToken(tokens);

    let passed = 0;
    let runtime = 0;
    let memory = 0;
    let finalStatus = "Accepted";
    const wrongCases = [];

    for (let i = 0; i < testResults.length; i++) {
      const expectedList = problem.hiddenTestCases[i].output;
      const gotRaw = testResults[i].stdout?.trim() ?? "";

      // Judge0 compile/runtime error → STOP IMMEDIATELY
      if (testResults[i].status_id !== 3) {
        finalStatus = testResults[i].status.description;
        submittedResult.errorMessage = testResults[i].compile_output ?? "";
        break;
      }

      // Check if any expected output matches
      const isCorrect = expectedList.some(exp => normalizeArrayUnordered(exp) === normalizeArrayUnordered(gotRaw));

      if (!isCorrect) {
        finalStatus = "Wrong Answer";
        wrongCases.push({
          testCaseNumber: i + 1,
          input: problem.hiddenTestCases[i].input,
          expected: expectedList,
          got: gotRaw
        });
      } else {
        passed++;
        runtime = testResults[i].time + "s";
        memory = Math.max(memory, testResults[i].memory);
      }
    }

    submittedResult.testCasesPassed = passed;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory + "kb";
    submittedResult.status = finalStatus;
    submittedResult.wrongCases = wrongCases;

    await submittedResult.save();

    return res.status(200).json({
      success: true,
      message: "Solution submitted",
      data: { submittedResult, testResults, wrongCases }
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// -------------------- Run Code --------------------
const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ success: false, message: "Some fields are missing" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    const submissions = problem.visibleTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: JSON.stringify(tc.input)
    }));

    const batch = await submitBatch(submissions);
    const tokens = batch.map(b => b.token);
    const testResults = await submitToken(tokens);

    for (let i = 0; i < testResults.length; i++) {
      const expectedList = problem.visibleTestCases[i].output;
      const gotRaw = testResults[i].stdout?.trim() ?? "";

      // Judge0 compile/runtime error
      if (testResults[i].status_id !== 3) {
        return res.status(200).json({
          success: true,
          message: "Execution failed",
          data: testResults[i]
        });
      }

      const isCorrect = expectedList.some(exp => normalizeArrayUnordered(exp) === normalizeArrayUnordered(gotRaw));

      if (!isCorrect) {
        testResults[i].status = { description: "Wrong Answer" };
        return res.status(200).json({
          success: true,
          message: "Wrong Answer",
          data: testResults
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Execution successful",
      data: testResults
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { submitCode, runCode };
