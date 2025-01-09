// EmailVerificationScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { auth } from "../../firebase"; // Ensure your Firebase config is imported correctly
import { ChevronLeft, RefreshCcw } from "lucide-react-native";
import ErrorComp from "../../components-shared/ErrorComp";
import SuccessComp from "../../components-shared/SuccessComp";
import AlertComp from "../../components-shared/AlertComp";
import { sendEmailVerification } from "firebase/auth";

const EmailVerificationScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // wait function
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const resendEmailVerification = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setSuccessMessage("Verification Email sent");
      } catch (error) {
        console.log(error.code);
        if (error.code == "auth/too-many-requests") {
          setAlertMessage("Please Wait a Moment Before Trying Again");
        } else {
          setErrorMessage("Error sending verification email");
        }
      }
    } else {
      setErrorMessage("Error");
      console.log("No user is currently signed in.");
    }
  };

  const handleRefreshVerificationStatus = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload(); // Refresh user data
        const { emailVerified } = auth.currentUser;
        setUser({ email: auth.currentUser.email, emailVerified });
        if (emailVerified) {
          setSuccessMessage("Email Verified");
          await wait(1500);
          navigation.replace("DrawerEntry");
        } else {
          setAlertMessage("Verify your email");
        }
      } catch (error) {
        console.error("Error reloading user data:", error);
        setErrorMessage("Error checking email verification status.");
      }
    } else {
      setErrorMessage("No user is currently signed in.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-10">
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
        className="absolute top-12 left-5 flex-row justify-center items-center"
      >
        <ChevronLeft size={36} color={"black"} />
        <Text className="text-lg">Back</Text>
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

      <View className="absolute bottom-10">
        <TouchableOpacity onPress={resendEmailVerification}>
          <Text>Resend Verification mail</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message Card */}
      <View className=" w-full absolute z-10 bottom-10">
        <ErrorComp
          timeDur={500}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      </View>

      {/* Success Message Card */}
      <View className=" w-full absolute z-10 bottom-10">
        <SuccessComp
          timeDur={500}
          setSuccessMessage={setSuccessMessage}
          successMessage={successMessage}
        />
      </View>

      {/* Alert Message Card */}
      <View className=" w-full absolute z-10 bottom-10">
        <AlertComp
          timeDur={500}
          setAlertMessage={setAlertMessage}
          alertMessage={alertMessage}
        />
      </View>
    </View>
  );
};
export default EmailVerificationScreen;
