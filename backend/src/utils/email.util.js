export const emailChecker = (email) =>{

if (email.length > 255 ){
    throw new Error("Error in email property");
    }
    return email;
}

export const cleanEmail =(email)=>{ 
    return email.trim().toLowerCase();

}

const emailRegex  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isValidEmail = (email) =>{
   return  emailRegex.test(email);
}



