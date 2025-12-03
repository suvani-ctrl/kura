import React, { useState } from 'react'
import { useauthStore } from '../store/Authstore'
import { useSearchParams } from 'react-router';
import toast from 'react-hot-toast';


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const [newPassword,setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const {resetPassword} = useauthStore();

  const handleResetPass = async(event) =>{
    event.preventDefault();

    if(newPassword != confirmPassword){
      toast.error("Password donot match");
      return;
    }
    await resetPassword({token,userId,newPassword})
   }
  


  return (
    <>
    <form onSubmit={handleResetPass}>
      <input
      type="password"
      value = {newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder='enter a new password'
      required
      />

      <input
      type="password"
      value = {confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder='enter a new password'
      required
      />
    <button type="submit">
      Reset Password
    </button>

    </form>
    
    </>
  )
}

export default ResetPassword
