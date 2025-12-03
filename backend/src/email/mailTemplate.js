export const welcomeEmailTemplate = (fullname) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to MyMessanger!</title>
  <style>
    /* Ensure table scales on small screens */
    @media only screen and (max-width: 620px) {
      table {
        width: 90% !important;
      }
      h1 {
        font-size: 24px !important;
      }
      p {
        font-size: 14px !important;
      }
      a {
        padding: 8px 16px !important;
        font-size: 14px !important;
      }
      img {
        width: 60px !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #1E1E1E; color: #FFF;">

  <table align="center" width="600" cellpadding="0" cellspacing="0" style="border-radius:10px; background-color:#2C2C2C; padding:20px; border: 2px solid #FFD700;">
    <tr>
      <td align="center">
        <h1 style="color:#FFD700; margin-bottom:5px;">🐝 Welcome, ${fullname}!</h1>
        <p style="color:#FFF; font-size:16px;">Hello ! You’ve joined <strong>MyMessanger</strong> </p>
        <img src="https://yourdomain.com/kitty.png" alt="Cute Kitty" width="80" />

      </td>
    </tr>

    <tr>
      <td align="center" style="background-color:#1C1C1C; padding:15px; border-radius:5px; border:1px dashed #32CD32;">
        <p style="color:#32CD32; margin:0;">Get started by exploring your dashboard and connecting with friends.</p>
        <a href="https://yourapp.com/dashboard" style="display:inline-block; margin-top:10px; padding:10px 20px; background-color:#FFD700; color:#1E1E1E; text-decoration:none; border-radius:5px;">Go to Dashboard</a>
      </td>
    </tr>

    <tr>
      <td align="center" style="margin-top:20px; color:#AAA; font-size:12px; padding-top:15px;">
        MyMessanger Tech Support 🐝
      </td>
    </tr>
  </table>

</body>
</html>
`;

export const forgotPasswordTemplate = (url) =>{
return `
        <div style="text-align: center;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Please click the button below to continue.</p>
            <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password Now
            </a>
            <p>This link will expire soon.</p>
        </div>
    `;
}