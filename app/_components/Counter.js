"use client";

import { useState } from "react";

function Counter({ users}) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{users[count].name}</button>;
}

export default Counter;
