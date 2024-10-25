// EmailVerificationScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { auth } from "../firebase"; // Ensure your Firebase config is imported correctly
import { RefreshCcw } from "lucide-react-native";

const EmailVerificationScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  const handleRefreshVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload(); // Refresh user data
      const { emailVerified } = auth.currentUser;
      setUser({ email: auth.currentUser.email, emailVerified });
      if (user.emailVerified) {
        navigation.replace("DrawerEntry");
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Back Button */}
      <TouchableOpacity
        onPress={async () => {
          try {
            await auth.signOut(); // Sign out the user
            navigation.navigate("SignIn"); // Navigate to the SignIn screen after logging out
          } catch (error) {
            console.error("Error logging out: ", error); // Handle errors if any
          }
        }}
        className="absolute top-12 left-5"
      >
        <Text className="text-lg text-blue-500">Back</Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-500">
        Check your email to verify
      </Text>

      <TouchableOpacity
        className="bg-black rounded-2xl flex-row justify-center items-center mt-10 py-4 px-4"
        onPress={handleRefreshVerificationStatus}
      >
        <RefreshCcw color={"white"} />
        <Text className="text-white font-bold px-2">
          Refresh Verification Status
        </Text>
      </TouchableOpacity>

      {user && (
        <View className="mt-5">
          <Text>{user?.email}</Text>
          <Text>
            {user?.emailVerified ? "Accepted" : "Please verify your email"}
          </Text>
        </View>
      )}
    </View>
  );
};
export default EmailVerificationScreen;
