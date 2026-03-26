import React, { useState, useEffect } from 'react';

const FormattedTypewriter = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (text && index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  const renderContent = (content) => {
    if (!content) return "";
    // Split by bold (**) and then by italic (*)
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <i key={i}>{part.slice(1, -1)}</i>;
      }
      return part;
    });
  };

  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
      {renderContent(displayedText)}
    </div>
  );
};

export default FormattedTypewriter;
