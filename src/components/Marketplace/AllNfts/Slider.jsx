import MultiRangeSlider from "multi-range-slider-react";
import React from "react";
import "./Slider.css";
function Slider({ from, to, rangeChanged }) {
  // const [minValue, set_minValue] = useState(25);
  // const [maxValue, set_maxValue] = useState(75);
  const handleInput = (e) => {
    // set_minValue(e.minValue);
    // set_maxValue(e.maxValue);
    rangeChanged(e.minValue, e.maxValue);
  };

  return (
    <div className="App">
      <MultiRangeSlider
        min={0}
        max={100}
        step={1}
        minValue={from}
        maxValue={to}
        onInput={(e) => {
          handleInput(e);
        }}
        label={false}
        ruler={false}
        style={{ border: "none", boxShadow: "none", padding: "15px 10px" }}
        barLeftColor="#93A3F820"
        barInnerColor="#93A3F8"
        barRightColor="#93A3F820"
        thumbLeftColor="#93A3F8"
        thumbRightColor="#93A3F8"
        barHeight="20px"
        // baseClassName="multi-range-slider-black"
      />
    </div>
  );
}

export default Slider;
