const mongoose=require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  tags: {
    type: String,
    required: true,
    enum: [
      "Array",
      "Stack",
      "Linked List",
      "String",
      "Hash Table",
      "Heap",
      "Tree",
      "Backtracking",
      "Graph",
      "Dynamic Programming"
    ]
  },

  visibleTestCases: [
    {
      input: { type: mongoose.Schema.Types.Mixed, required: true },
      output: { type: [mongoose.Schema.Types.Mixed], required: true },
     
    }
  ],

  hiddenTestCases: [
    {
      input: { type: mongoose.Schema.Types.Mixed, required: true },
      output: { type:[ mongoose.Schema.Types.Mixed], required: true }
    }
  ],

  startCode: [
    {
      language: { type: String, required: true },
      initialCode: { type: String, required: true }
    }
  ],

  referenceCode: [
    {
      language: { type: String, required: true },
      completeCode: { type: String, required: true }
    }
  ],

  problemCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});


const Problem=mongoose.model("Problem",problemSchema);
module.exports=Problem;