import React, { useState } from 'react'
import { useauthStore } from '../store/Authstore';
const ForgotPassword = () => {

    const [email,setEmail] = useState('');
    const {forgotPassword} = useauthStore();
    const handleSubmit = async(event) =>{
        event.preventDefault();
        await forgotPassword(email)
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter your valid email'
        required
        />
        <button
        type="submit"
        >
        Send Reset Link
        </button>

        </form>
      
    </div>
  )
}

export default ForgotPassword
