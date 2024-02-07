import React, { useEffect, useRef, useState } from "react";

export const Application: React.FC = () => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `Count: ${count}`;
    }
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div ref={ref} />
    </div>
  );
};
