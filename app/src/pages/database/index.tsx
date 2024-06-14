import { useEffect, useState } from 'react';

interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  pwd: string;
  userRole: string;
  institution: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.userID}>
            <div>
              <strong>{user.firstName} {user.lastName}</strong>
              <p>Email: {user.email}</p>
              <p>Role: {user.userRole}</p>
              <p>Institution: {user.institution}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
