import { type ChangeEvent } from "react";

import { isValidYmd } from "../../../shared/utils/date";

interface IProps {
  start: string;
  end: string;
  setDate: (type: "start" | "end", value: string) => void;
}

const DateRange = ({ start, end, setDate }: IProps) => {
  const onChangeDate =
    (type: "start" | "end") => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (!isValidYmd(value)) return;
      setDate(type, value);
    };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <div>
        <label htmlFor="start">Start date: </label>
        <input
          type="date"
          id="start"
          name="start"
          value={start}
          onChange={onChangeDate("start")}
        />
      </div>
      <div>
        <label htmlFor="end">End date: </label>
        <input
          type="date"
          id="end"
          name="end"
          value={end}
          onChange={onChangeDate("end")}
        />
      </div>
    </div>
  );
};

export default DateRange;
