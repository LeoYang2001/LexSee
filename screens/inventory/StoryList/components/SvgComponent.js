import React from "react";
import { View } from "react-native";
import CurveSvg from "../../../../assets/folder.svg"; // Import the SVG file

const SvgComponent = () => {
  return (
    <View className="absolute bottom-0" style={{ width: "100%", height: 132 }}>
      <CurveSvg width="100%" height="100%" preserveAspectRatio="none" />
    </View>
  );
};

export default SvgComponent;
