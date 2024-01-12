import React, { useState } from "react";
import spinWheel from "../../images/spinWheel.png";
import "./tempWheel.css";

function TempSpinWheel({ items, onSelectItem }) {
  const [selectItem, setselectItem] = useState(null);

  //   const spinning = selectedItem !== null ? "spinning" : "";

  const select = () => {
    if (selectItem === null) {
      const selectedItem = Math.floor(Math.random() * items.length);
      if (onSelectItem) {
        onSelectItem(selectedItem);
      }
      setselectItem(selectedItem);
    } else {
      setselectItem(null);
      setTimeout(selectItem, 500);
    }
  };

  const wheelVars = {
    "--nb-item": items.length,
    "--selected-item": selectItem,
  };

  const spinning = selectItem !== null ? "spinning" : "";
  return (
    <>
      <div className="temp-wheel-container">
        <div className={`temp-wheel ${spinning}`} style={wheelVars}>
          {/* <div className="wheel-bulb">
              <img src={Bulb} alt="" />
            </div> */}
          {items.map((item, index) => (
            <div
              className="temp-wheel-item"
              key={`item-${index + 1}`}
              style={{ "--item-nb": index }}
            >
              {item.token}
            </div>
          ))}
        </div>
      </div>
      <div className="spin-btn" onClick={select}>
        <img src={spinWheel} alt="spin" />
        <h6>{"SPIN NOW"} </h6>
      </div>
    </>
  );
}

export default TempSpinWheel;
