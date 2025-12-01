
const {getLanguageById,submitBatch,submitToken}=require("../utils/problemHelper");
const Problem=require("../models/Problem");
const Submission=require("../models/Submission");
const User=require("../models/User");



const deleteProblem=async(req,res)=>{
     
     const {id}=req.body;
      
        try{
               if(!id){
                return res.status(400).json({
                    success:false,
                    message:"Id is missing"
                });
               }
               const deletedProblem=await Problem.findByIdAndDelete(id);
                
                 if(!deletedProblem){
                     return res.status(400).json({
                        success:false,
                        message:"Problem is missing"
                     });
                 }
                   return res.status(200).json({
                       success:true,
                       message:"Problem is deleted",
                       data:deletedProblem
                   });

            }
            catch(err){
                console.log(err);
                  res.status(400).json({
                        success:false,
                        message:err
                     
                });
            }
}
const fetchProblem=async(req,res)=>{
     const {id}=req.params;
     try{
           if(!id){
                return res.status(400).json({
                    success:false,
                    message:"Id is missing"
                });
               }
               const getProblem=await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode hiddenTestCases problemCreator referenceCode');
        if(!getProblem){
              return res.status(400).json({
                  success:false,
                  message:"Problem is missing"
              });
        }

        return res.status(200).json({
              success:true,
              message:"Problem fetched successfully",
              data:getProblem
        });
     }
     catch(err){
        console.log(err);
          return res.status(400).json({
              success:false,
              data:err
          });
     }
}
      const solvedProblem = async (req, res) => {
    try {
        const userId = req.result._id;

        const submissions = await Submission.find({
            userId,
            status: "Accepted"
        }).populate("problemId", "title difficulty tags");

        return res.status(200).json({
            success: true,
            message: "Solved problems with timestamps",
            data: submissions  // 👈 createdAt included
        });
    }
    catch(err){
         return res.status(400).json({
              success:false,
              message:err
          });
    }
}
const getAllProblem=async(req,res)=>{
            
     try{
           const getProblem=await Problem.find({}).select('_id difficulty title tags');
           
        if(getProblem.length===0){
              return res.status(200).json({
                  success:false,
                  message:"Problem is missing"
              });
        }

        return res.status(200).json({
              success:true,
              message:"Problem fetched successfully",
              data:getProblem
        });
     }
     catch(err){
           return res.status(400).json({
              success:false,
              data:err
          });
     }
    
}
const submittedProblem=async (req,res)=>{
        
    try{
        const userId=req.result._id;
        const problemId=req.params.id;
        
        const ans=await Submission.find({userId,problemId});
        
        if(ans.length==0){
              return res.status(200).json({
                  success:true,
                  message:"No submission is present"
               });
        }
               return res.status(200).json({
                   success:true,
                   message:"submitted Problem",
                   data:ans
               });
    }
    catch(err){
            return res.status(400).json({
                  success:false,
                  message:err
            });
    }
}
const singleSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: "No submission found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission found",
      data: submission,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const createProblem = async (req, res) => {
  try {
    let {
      title,
      description,
      tags,
      difficulty,
      startCode,
      visibleTestCases,
      hiddenTestCases,
      referenceCode,
      problemCreator
    } = req.body;

    // Parse stringified JSON fields if necessary
    startCode = typeof startCode === "string" ? JSON.parse(startCode) : startCode;
    referenceCode = typeof referenceCode === "string" ? JSON.parse(referenceCode) : referenceCode;
    visibleTestCases = typeof visibleTestCases === "string" ? JSON.parse(visibleTestCases) : visibleTestCases;
    hiddenTestCases = typeof hiddenTestCases === "string" ? JSON.parse(hiddenTestCases) : hiddenTestCases;

    // Mandatory checks
    if (!title || !description || !difficulty || !problemCreator || !referenceCode?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: "Problem with this title already exists",
        data: existingProblem
      });
    }

    // Only Java supported
    const javaReference = referenceCode[0];
    if (javaReference.language !== "java") {
      return res.status(400).json({ success: false, message: "Only Java is supported" });
    }
    const referenceJavaCode = javaReference.completeCode;

    // ---- VALIDATE REFERENCE SOLUTION USING VISIBLE TEST CASES ----
    const languageId = getLanguageById("java");
    const submissions = visibleTestCases.map(tc => ({
      source_code: referenceJavaCode,
      language_id: languageId,
      stdin: JSON.stringify(tc.input),
    }));

    const batchResult = await submitBatch(submissions);
   
    const tokens = batchResult.map(r => r.token);
     
    const testResults = await submitToken(tokens);

    // ---- Normalize output ----
    const normalizeArrayUnordered = (val) => {
      try {
        const arr = Array.isArray(val) ? val : JSON.parse(val);
          const res=arr.slice().sort((a, b) => a - b).join(',');
         
            return res;
      } catch {
        return String(val).replace(/[\[\]\s\r\n]/g, '');
      }
    };

    // ---- Validate outputs ----
    for (let i = 0; i < testResults.length; i++) {
        console.log("testResults",testResults[i]);
      const expectedList = visibleTestCases[i].output; // array of possible outputs
      const gotRaw = testResults[i].stdout?.trim() ?? "";

      // Judge0 compile/runtime error → fail immediately
      if (testResults[i].status_id !== 3) {
        return res.status(400).json({
          success: false,
          message: `Reference solution compilation/runtime error at test case ${i + 1}`,
          expected: expectedList,
          got: gotRaw
        });
      }
      
      // Check if any expected output matches (unordered arrays supported)
      const passed = expectedList.some(exp => normalizeArrayUnordered(exp) === normalizeArrayUnordered(gotRaw));
         
      if (!passed) {
        return res.status(400).json({
          success: false,
          message: `Reference solution failed test case ${i + 1}`,
          expected: expectedList,
          got: gotRaw
        });
      }
    }

    // ---- SAVE PROBLEM ----
    const newProblem = await Problem.create({
      title,
      description,
      tags,
      difficulty,
      startCode,
      visibleTestCases,
      hiddenTestCases,
      referenceCode,
      problemCreator
    });

    return res.status(200).json({
      success: true,
      message: "Problem created successfully",
      data: newProblem
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};


const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).json({ success: false, message: "Problem ID missing" });

    let {
      title,
      description,
      tags,
      difficulty,
      startCode,
      visibleTestCases,
      hiddenTestCases,
      referenceCode,
      problemCreator
    } = req.body;

    // ---- SAFE JSON PARSE ----
    startCode = typeof startCode === "string" ? JSON.parse(startCode) : startCode;
    referenceCode = typeof referenceCode === "string" ? JSON.parse(referenceCode) : referenceCode;
    visibleTestCases = typeof visibleTestCases === "string" ? JSON.parse(visibleTestCases) : visibleTestCases;
    hiddenTestCases = typeof hiddenTestCases === "string" ? JSON.parse(hiddenTestCases) : hiddenTestCases;

    // ---- MANDATORY FIELD CHECKS ----
    if (!title || !description || !difficulty || !problemCreator || !referenceCode?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ---- CHECK EXISTING PROBLEM ----
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    // ---- CHECK UNIQUE TITLE ----
    if (title !== problem.title) {
      const existingProblem = await Problem.findOne({ title });
      if (existingProblem) {
        return res.status(409).json({
          success: false,
          message: "Another problem with this title already exists",
          data: existingProblem
        });
      }
    }

    // ---- ONLY JAVA SUPPORTED ----
    const javaReference = referenceCode[0];
    if (javaReference.language !== "java") {
      return res.status(400).json({ success: false, message: "Only Java is supported for reference solutions" });
    }
    const referenceJavaCode = javaReference.completeCode;

    // ---- VALIDATE REFERENCE SOLUTION USING VISIBLE TEST CASES ----
    const languageId = getLanguageById("java");
    const submissions = visibleTestCases.map(tc => ({
      source_code: referenceJavaCode,
      language_id: languageId,
      stdin: JSON.stringify(tc.input)
    }));

    const batchResult = await submitBatch(submissions);
    const tokens = batchResult.map(r => r.token);
    const testResults = await submitToken(tokens);

    // ---- Normalize output function ----
    const normalizeArrayUnordered = (val) => {
      try {
        const arr = Array.isArray(val) ? val : JSON.parse(val);
        return arr.slice().sort((a, b) => a - b).join(',');
      } catch {
        return String(val).replace(/[\[\]\s\r\n]/g, '');
      }
    };

    // ---- VALIDATE OUTPUTS ----
    for (let i = 0; i < testResults.length; i++) {
      const expectedList = visibleTestCases[i].output;
      const gotRaw = testResults[i].stdout?.trim() ?? "";

      if (testResults[i].status_id !== 3) {
        return res.status(400).json({
          success: false,
          message: `Reference solution compilation/runtime error at test case ${i + 1}`,
          expected: expectedList,
          got: gotRaw
        });
      }

      const passed = expectedList.some(exp => normalizeArrayUnordered(exp) === normalizeArrayUnordered(gotRaw));
      if (!passed) {
        return res.status(400).json({
          success: false,
          message: `Reference solution failed test case ${i + 1}`,
          expected: expectedList,
          got: gotRaw
        });
      }
    }

    // ---- UPDATE PROBLEM ----
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tags,
        difficulty,
        startCode,
        visibleTestCases,
        hiddenTestCases,
        referenceCode,
        problemCreator
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};



module.exports={singleSubmission,createProblem,updateProblem,deleteProblem,fetchProblem,solvedProblem,getAllProblem,submittedProblem};