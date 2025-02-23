import { View, Text, ImageBackground } from "react-native";
import React from "react";

const Logo = ({ size = 20, opacity = 1 }) => {
  return (
    <ImageBackground
      style={{ width: size, height: size, opacity: opacity }}
      source={require("../assets/logo.png")} // Path to the logo image
      resizeMode="contain" // Ensures the aspect ratio is maintained
    >
      {/* Add any content you want inside the View here */}
    </ImageBackground>
  );
};

export default Logo;
