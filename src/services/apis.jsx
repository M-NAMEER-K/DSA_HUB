const BASE_URL=import.meta.env.VITE_API_URL ;


export const endpoints={
          REGISTER : BASE_URL + "/register",
          ADMIN_REGISTER: BASE_URL +"/admin/register",
          LOGIN :BASE_URL + "/login",
          LOGOUT : BASE_URL +"/logout",
          CHECK_TOKEN:BASE_URL+"/validate"
}


export const problemEndpoints={
       PROBLEMS : BASE_URL + "/problems",
       CREATE_PROBLEM:BASE_URL + "/create",
       GET_ALL_PROBLEMS:BASE_URL + "/getAllProblem",
       FETCH_PROBLEM:BASE_URL +"/fetchProblem",
       UPDATE_PROBLEM:BASE_URL +"/update",
       DELETE_PROBLEM:BASE_URL + "/delete",
       RUN_PROBLEM:BASE_URL+ "/run",
       SUBMIT_PROBLEM:BASE_URL+ "/submit",
       STATUS_PROBLEM:BASE_URL +"/submittedProblem",
       SOLVED_PROBLEM:BASE_URL +"/solvedProblem",
       SINGLE_SUBMISSION:BASE_URL +"/singlesubmission"
       
}

