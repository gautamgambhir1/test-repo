'use client';

import { useState } from 'react';
import UserCard from '@/components/UserCard';
import DynamicForm from '@/components/DynamicForm';

const mockUsers = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'moderator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
  },
];

const formFields = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' },
      { value: 'moderator', label: 'Moderator' },
    ],
  },
  { name: 'bio', label: 'Bio', type: 'textarea', required: false },
];

export default function Home() {
  const [users, setUsers] = useState(mockUsers);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleFormSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    setFormData(data);
    alert('Form submitted successfully!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Next.js + Vitest Demo</h1>
        <p className="text-gray-600 mb-12">
          Complex components with comprehensive test coverage
        </p>

        {/* User Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteUser(user.id)}
              />
            ))}
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Registration</h2>
          <DynamicForm fields={formFields} onSubmit={handleFormSubmit} />
        </section>

        {/* Submitted Data Display */}
        {Object.keys(formData).length > 0 && (
          <section className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Last Submitted Data:</h3>
            <pre className="bg-white p-4 rounded border border-green-200 overflow-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}
