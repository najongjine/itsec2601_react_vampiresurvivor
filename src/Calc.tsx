/**
 * https://www.npmjs.com/package/mathjs
 */
import * as math from "mathjs";
import { useState, useEffect, useRef } from "react";
import "./Calc.css";

/** 계산기 만들기  */
function Calc() {
  const [myinput, setMyinput] = useState("");
  const [result, setMyresult] = useState("");
  const [errmsg, setErrmsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on input
  useEffect(() => {
    inputRef.current?.focus();
  }, [myinput]);

  function calculate() {
    if (!myinput?.trim()) return;
    try {
      // Replace visual operators with mathjs operators if needed (though standard ones match mostly)
      // x -> *, ÷ -> /
      // Remove newlines to avoid errors
      let expression = myinput
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/\n/g, "");

      let calculatedRaw = math.evaluate(expression);
      let _result = math.format(calculatedRaw, { precision: 14 });
      setMyresult(String(_result));
      setErrmsg("");
    } catch (error: any) {
      console.error("Calc Error:", error);
      setErrmsg(error.message || "Error");
      setMyresult("Error");
    }
  }

  function handleButtonClick(val: string) {
    if (val === "C") {
      setMyinput("");
      setMyresult("");
      setErrmsg("");
    } else if (val === "=") {
      calculate();
    } else if (val === "DEL") {
      setMyinput((prev) => prev.slice(0, -1));
    } else {
      setMyinput((prev) => prev + val);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline in textarea
      calculate();
    } else if (e.key === "Escape") {
      setMyinput("");
      setMyresult("");
    }
  }

  const buttons = [
    "C",
    "DEL",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="calc-wrapper">
      <div className="calc-container">
        <div className="calc-display">
          <textarea
            ref={inputRef as any}
            value={myinput}
            onChange={(e) => setMyinput(e.target.value)}
            onKeyDown={(e) => onKeyDown(e as any)}
            className="calc-input"
            placeholder="0"
          />
          <div className="result-preview">{result}</div>
        </div>
        <div className="calc-keypad">
          {buttons.map((btn, index) => {
            let className = "calc-btn";
            if (["/", "*", "-", "+", "%"].includes(btn))
              className += " operator";
            if (btn === "C" || btn === "DEL") className += " clear";
            if (btn === "0") className += " zero";
            if (btn === "=") className += " equals";

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calc;
