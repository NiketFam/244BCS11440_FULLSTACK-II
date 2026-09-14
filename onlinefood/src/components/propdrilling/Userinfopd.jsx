import React from 'react';

export default function Userinfopd({ user }) {
  return (
    <div>
      <h3>Customer Profile</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location}</p>
    </div>
  );
}