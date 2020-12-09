import React from "react";

function Squaretest({ value, onClick }) {
  const style = value ? `squares ${value}` : `squares`;

  return (
      <button className={style} onClick={onClick}>
        {value}
      </button>
  );
}

export default Squaretest;
