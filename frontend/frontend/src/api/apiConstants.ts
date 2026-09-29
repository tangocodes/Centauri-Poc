const API_URL = import.meta.env.VITE_API_URL

export const apiConstant  = {

    TASKS :{
    CREATE_TASK :  `${API_URL}/tasks/`,
    DELETE_TASK_BY_ID : (ID : any) => `${API_URL}/tasks/${ID}`,
    GET_ALL_TASKS : `${API_URL}/tasks/`,
    EDIT_TASK_BY_ID : (ID : any )=> `${API_URL}/tasks/${ID}`
},

AUTH : {
    LOGIN_USER : `${API_URL}/login`,
    SIGN_UP : `${API_URL}/users`,
    GET_USER_DATA : `${API_URL}/users/me`,
    GET_ALL_USERS_DATA : `${API_URL}/users/`,
    UPDATE_USER_DATA : `${API_URL}/users/me`
},

COMMENTS : {
    ADD_NEW_COMMENT : `${API_URL}/task-comments/`,
    GET_COMMENTS_BY_TASKID : (id : any) =>`${API_URL}/task-comments/${id}`,
}


}







