import React from 'react';

const Button = ({ text, onClick }) => (
    <button
        className="inline-block px-12 py-3 text-sm font-semibold leading-none border-2 border-white rounded-full bg-black text-white hover:bg-white hover:text-black hover:border-black transition duration-300 ease-in-out mb-2"
        type="button"
        onClick={onClick}
    >
        {text}
    </button>
);

export default Button;
