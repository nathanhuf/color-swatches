import React, { useState } from "react";
import axios from "axios";

const ColorSwatches = () => {
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [colors, setColors] = useState([]);
  const [apiCalls, setApiCalls] = useState(0);

  const getColorName = async (hue) => {
    const response = await axios.get(
      `https://www.thecolorapi.com/id?hsl=${hue},${saturation},${lightness}`
    );
    setApiCalls((prevApiCalls) => prevApiCalls + 1);
    return response.data.name.value;
  };

  const fetchColors = async () => {
    let start = 0,
      end = 360;
    let distinctColors = [];
    let colorNames = {};

    const pushColor = (hue, colorName) => {
      if (!colorNames[colorName]) {
        distinctColors.push({ hue, color: colorName });
        colorNames[colorName] = colorName;
      }
    };

    const getColors = async (start, end, startColorName, endColorName) => {
      let mid = Math.floor((start + end) / 2);

      if (start === mid) {
        console.log(`${start}(${startColorName}), ${end}(${endColorName})`);
        pushColor(start, startColorName);
        pushColor(end, endColorName);
        return;
      }

      let midColorName = await getColorName(mid);
      console.log(
        `${start}(${startColorName}), ${mid}(${midColorName}), ${end}(${endColorName})`
      );

      if (startColorName !== midColorName)
        await getColors(start, mid, startColorName, midColorName);

      if (midColorName !== endColorName)
        await getColors(mid, end, midColorName, endColorName);

      if (!colorNames[midColorName]) pushColor(mid, midColorName);
    };

    const startColorName = await getColorName(start);
    const endColorName = await getColorName(end);
    await getColors(start, end, startColorName, endColorName);

    setColors(distinctColors);
  };

  return (
    <div>
      <input
        type="number"
        value={saturation}
        onChange={(e) => setSaturation(e.target.value)}
      />
      <input
        type="number"
        value={lightness}
        onChange={(e) => setLightness(e.target.value)}
      />
      <button onClick={fetchColors}>Fetch Colors</button>
      <div>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: `hsl(${color.hue}, ${saturation}%, ${lightness}%)`,
            }}
          >
            {color.color}
          </div>
        ))}
        {apiCalls > 0 && <div>API Calls: {apiCalls}</div>}
        {colors.length > 0 && <div>Total Count: {colors.length}</div>}
      </div>
    </div>
  );
};

export default ColorSwatches;
