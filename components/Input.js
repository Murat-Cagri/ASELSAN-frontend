import React from 'react';

const Input = ({ value, onChange, placeholder }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-xs text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ maxWidth: '11rem' }}
    />
);

export default Input;
