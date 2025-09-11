import { format } from "date-fns";
import { useState } from "react";
import Datetime from "react-datetime";

const css = `
  table, .rdtPicker {
    width: 100%;
  }
  .form-control{
    display: none;
  }
  .rdt {
    width:100%;
    display: flex;
    z-index: 1;
    background-color: white;
    gap: 5px;
    position: absolute;
    border: 1px solid #A9A7E8;
    border-radius: 8px;
    padding: 10px;
    top: 60px;
  }
  .rdtPrev, .rdtNext {
    font-size: 20px;
    opacity: 0.5;
    cursor: pointer;
    padding-bottom: 15px;
  }
  .rdp-nav:hover, .rdtPrev:hover, .rdtNext:hover {
    opacity: 1;
  }
  .rdtSwitch {
    padding-bottom: 15px;
    cursor: pointer;
  }
  .rdtSwitch:hover, .rdtMonth:hover, .rdtYear:hover {
    background-color: #F1F0FB;
    border-radius: 6px;
  }
  .rdtMonth, .rdtYear {
    text-align: center;
    cursor: pointer;
  }
  .rdtSwitch, .dow {
    flex: 1;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    text-transform: capitalize;

  }
  .rdtDay {
    cursor: pointer;
    width: 30px;
    height: 30px;
    font-weight: 400 !important;
    font-size: 15px;
    color: #000;
    text-align:center;
  }
  .rdtOld {
    opacity: 0;
    pointer-events: none;
  }
  .rdtNew {
    opacity: 0;
    pointer-events: none;
  }
  .rdtActive {
    background-color: #F1F0FB;
    color:#5956AE;
    font-weight: 600 !important;
    border-radius: 6px;
  }
  tfoot {
    display: none;
  }
`;

export const Calendar = ({ onChange, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handlePick = (e) => {
    setSelectedDate(e);
    onChange(format(new Date(e), "yyyy-MM-dd"));
    onClose();
  };
  return (
    <>
      <style>{css}</style>
      <Datetime value={selectedDate} onChange={handlePick} />
    </>
  );
};
