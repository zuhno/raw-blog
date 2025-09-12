import { useReducer } from "react";

const useToggle = (init = false) => {
  const [value, dispatch] = useReducer((prev) => !prev, init);
  return [value, dispatch] as const;
};

export default useToggle;
