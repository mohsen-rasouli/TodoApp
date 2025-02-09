import  { useState } from 'react';

interface LoginProps {
    onLogin: (token: string | null) => void;
  }
  
  function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "username") setUsername(value);
      if (name === "password") setPassword(value);
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('Username: ', username);
      console.log('Password: ', '********');
      console.log('Sending login request to server...');
  
      try {
        const response = await fetch('http://localhost:3003/user/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        const data = await response.json();
  
        if (data.status === 'ok' && data.user.token) {
          localStorage.setItem('token', data.user.token);
          onLogin(data.user.token);  // اینجا توکن را از طریق props به App می‌فرستیم
          console.log('Login successful');
        } else {
          alert('Login failed');
          console.error('Login failed');
          console.error(data);
        }
      } catch (error: any) {
        console.error(`Error: ${error.message}`);
      }
    };
  
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <p>
            <label>Username</label>
            <input id="username" name="username" type="text" value={username} onChange={handleChange} />
          </p>
          <p>
            <label>Password</label>
            <input id="password" name="password" type="password" value={password} onChange={handleChange} />
          </p>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  export default Login;
  