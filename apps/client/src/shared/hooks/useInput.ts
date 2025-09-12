import { useCallback, useState, type ChangeEvent } from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const useInput = <T extends InputElement = HTMLInputElement>(init = "") => {
  const [value, setValue] = useState(init);

  const onChange = useCallback((event: ChangeEvent<T>) => {
    const value = event.target.value;
    setValue(value);
  }, []);

  const clear = useCallback(() => {
    setValue("");
  }, []);

  return [value, setValue, onChange, clear] as const;
};

export default useInput;
