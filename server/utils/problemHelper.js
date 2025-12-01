
const {fetchData1,fetchData2}=require("../services/apiConnector");


const getLanguageById=(lang)=>{
              
            language={
                  "java":62,
                  "cpp":54,
                  "javascript":63,
            };
       return language[lang.toLowerCase()];
}
const submitBatch=async (submissions)=>{
      
       const res=await fetchData1(submissions);
       return res;
       
      
}
const submitToken=async(resToken)=>{
     
    
    while(true){
                
              const result=await fetchData2(resToken);
              const isResultObtained= result.submissions.every((r)=>r.status_id>2);
              if(isResultObtained)
                       return result.submissions;

                 await waiting(1000);
       }
}


const waiting=async(timer)=>{
        setTimeout(()=>{
              return 1;
        },timer);
}



module.exports={getLanguageById,submitBatch,submitToken};