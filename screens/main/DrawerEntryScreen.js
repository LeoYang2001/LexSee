import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import { auth, db } from "../../firebase";
import * as Haptics from "expo-haptics";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import {
  setSavedStoryList,
  setSavedWordList,
  setSearchHistory,
} from "../../slices/userInfoSlice";
import { setList } from "../../slices/languageSlice";
import { CircleHelp, Headset, Moon, Power } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Logo from "../../components-shared/Logo";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const userInfo = auth.currentUser;

  // Shared values for each tab's height
  const tab1Height = useSharedValue(0);
  const tab2Height = useSharedValue(0);
  const tab3Height = useSharedValue(0);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        props.navigation.navigate("LoginWelcome");
        props.navigation.closeDrawer();
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const handleSignOut = () => {
    // Show confirmation dialog using Alert
    Alert.alert("Confirm Sign out", "Are you sure you want to sign out?", [
      {
        text: "Yes",
        onPress: () => {
          signOut();
        },
      },
      {
        text: "Cancel",
        onPress: () => console.log("Signing out cancelled"),
        style: "cancel",
      },
    ]);
  };
  const drawerOptions = [
    {
      label: "Theme Color",
      ifNested: true,
      NestedLabels: [
        {
          label: "Dark (To be developed)",
          ifNested: false,
          onClick: () => {
            console.log("change themecolor to dark");
          },
        },
      ],
      icon: () => {
        return <Moon color={"white"} size={20} opacity={0.7} />;
      },
    },
    {
      label: "Guidance",
      ifNested: false,
      NestedLabels: [],
      onClick: () => {
        console.log("open guidance");
        alert("This feature is under development");
      },
      icon: () => {
        return <CircleHelp color={"white"} size={20} opacity={0.7} />;
      },
    },
    {
      label: "Contact Us",
      ifNested: false,
      NestedLabels: [],
      onClick: () => {
        console.log("Contact Us");
        alert("This feature is under development");
      },
      icon: () => {
        return <Headset color={"white"} size={20} opacity={0.7} />;
      },
    },
    {
      label: "Sign Out",
      ifNested: false,
      NestedLabels: [],
      onClick: () => {
        handleSignOut();
      },
      icon: () => {
        return <Power color={"white"} size={20} opacity={0.7} />;
      },
    },
  ];

  const handleTabPress = (tab) => {
    if (!tab) {
      tab1Height.value = withTiming(0, { duration: 150 });
      tab2Height.value = withTiming(0, { duration: 150 });
      tab3Height.value = withTiming(0, { duration: 150 });
      return;
    }

    // Animate the selected tab to 80px and others to 0px
    tab1Height.value = withTiming(
      tab.label === "Theme Color" ? tab.NestedLabels.length * 40 : 0,
      { duration: 300 }
    );
    tab2Height.value = withTiming(
      tab.label === "Guidance" ? tab.NestedLabels.length * 40 : 0,
      { duration: 300 }
    );
    tab3Height.value = withTiming(
      tab.label === "Contact Us" ? tab.NestedLabels.length * 40 : 0,
      { duration: 300 }
    );
  };

  // Animated styles for each nested tab view
  const tab1Style = useAnimatedStyle(() => ({ height: tab1Height.value }));
  const tab2Style = useAnimatedStyle(() => ({ height: tab2Height.value }));
  const tab3Style = useAnimatedStyle(() => ({ height: tab3Height.value }));

  const tabStyles = [tab1Style, tab2Style, tab3Style];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleTabPress(null);
      }}
      className="w-full flex-1"
    >
      <View className="  flex-1 pt-16 pb-10 flex flex-col">
        {userInfo && (
          <View className="flex flex-row items-center  px-3 ">
            <View
              className="overflow-hidden"
              style={{
                width: 42,
                height: 42,
                borderRadius: 42,
              }}
            >
              <Image
                className="absolute"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                }}
                source={{
                  uri: `https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png`,
                }}
                resizeMode="cover"
              />
            </View>
            <View className="ml-3">
              <Text
                style={{
                  fontSize: 16,
                }}
                className="text-white font-bold"
              >
                Username
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                }}
                className="text-white"
              >
                {userInfo?.email}
              </Text>
            </View>
          </View>
        )}
        {/* Drawer Items */}
        <View className="w-full  flex-1    py-10">
          {drawerOptions.map((drawerOption, index) => {
            return (
              <View key={drawerOption.label}>
                <TouchableOpacity
                  onPress={() => {
                    if (drawerOption.ifNested) {
                      console.log("display nested options");
                      handleTabPress(drawerOption);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      console.log("light feedback");
                    } else {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      console.log("light feedback");
                      drawerOption.onClick();
                    }
                  }}
                  style={{
                    height: 40,
                    marginBottom: 2,
                  }}
                  className="w-full mx-2 flex px-3  flex-row py-2  items-center"
                >
                  {drawerOption.icon()}
                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: 10,
                    }}
                    className="text-white opacity-90 font-semibold"
                  >
                    {drawerOption.label}
                  </Text>
                </TouchableOpacity>

                <Animated.View
                  style={[
                    {
                      backgroundColor: "#292d33",

                      overflow: "hidden",
                    },
                    tabStyles[index],
                  ]}
                >
                  {drawerOption.NestedLabels.map((drawerNextedOption) => {
                    return (
                      <TouchableOpacity
                        key={drawerNextedOption.label}
                        style={{
                          height: 40,
                        }}
                        className="w-full flex px-10   flex-row py-2  items-center"
                      >
                        {/* {drawerNextedOption.icon()} */}
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#FA541C",
                          }}
                          className="text-white opacity-90 font-semibold ml-2 "
                        >
                          {drawerNextedOption.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </Animated.View>
              </View>
            );
          })}
        </View>

        {/* Sign Out Button */}
        {/* <TouchableOpacity
          style={{
            height: 40,
          }}
          className="w-full flex px-3  mt-auto flex-row py-2  items-center"
          onPress={signOut}
        >
          <LogOut size={20} color={"white"} opacity={0.9} />
          <Text
            style={{
              fontSize: 14,
            }}
            className="text-white opacity-90 font-semibold ml-2 "
          >
            Sign Out
          </Text>
        </TouchableOpacity> */}

        {/* Second Version Banner */}
        <View
          style={{
            height: 38,
            paddingBottom: 10,
            backgroundColor: "#26282f",
          }}
          className=" bottom-0 absolute w-full  flex flex-row justify-center pt-1"
        >
          <View className="relative">
            <View className="absolute left-3  bottom-1">
              <Logo size={14} opacity={0.6} />
            </View>
            <Text
              style={{ color: "#fff", opacity: 0.5, fontSize: 12, zIndex: 10 }}
            >
              LexSee Version 2.0
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const DrawerEntryScreen = () => {
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [ifProfileSetup, setIfProfileSetup] = useState(false);

  const dispatch = useDispatch();
  const uid = auth.currentUser?.uid; // Get current user UID

  useEffect(() => {
    const setUpGlobalVariable = async () => {
      if (uid) {
        await checkIfHasProfile();
        await fetchUserSavedWordList();
        await fetchSearchHistory();
        await fetchLanguageList();
        await fetchUserSavedStoryList();
        setIsSettingUp(false);
      }
    };
    setUpGlobalVariable();
  }, [uid]); // Re-run if UID changes (i.e., on login/logout)

  const checkIfHasProfile = async () => {
    const user = auth.currentUser;
    setIfProfileSetup(user.photoURL ? true : false);
  };

  const fetchLanguageList = async () => {
    const apiPoint = `https://apifree.forvo.com/key/2319e40ba1cbae8dc8a250c59df43868/format/json/action/language-list/order/name`;
    if (!uid) return;
    try {
      const response = await fetch(apiPoint);
      const data = await response.json();

      if (data?.items?.length > 0) {
        dispatch(setList(data.items));
      }
    } catch (error) {
      console.error("Error fetching language list:", error);
    }
  };

  const fetchSearchHistory = async () => {
    if (!uid) return; // Guard against missing UID
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user's document

      // Real-time listener for changes in the document
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();

          // Access the searchHistory field
          const searchHistory = userData.searchHistory || [];

          // Update Redux or component state
          dispatch(setSearchHistory(searchHistory));
        } else {
          console.warn("User document does not exist.");
        }
      });

      // Return unsubscribe function to clean up listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const fetchUserSavedWordList = async () => {
    if (!uid) return; // Guard against UID being unavailable

    try {
      // Reference to the user's wordList subcollection
      const wordListRef = collection(db, "users", uid, "wordList");
      const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

      // Listen for real-time changes to the wordList
      const unsubscribe = onSnapshot(
        wordListQuery,
        (snapshot) => {
          const wordsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Dispatch the updated word list to the Redux store
          dispatch(setSavedWordList(wordsData));
        },
        (error) => {
          console.error("Error listening to wordList snapshot:", error);
          // Optionally, handle the error in the UI or with a Redux action
          dispatch(
            setError("Failed to fetch the word list. Please try again.")
          );
        }
      );

      // Clean up the subscription when the component unmounts or when the user changes
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user saved word list:", error);
      // Optionally, handle the error in the UI or with a Redux action
      dispatch(setError("Failed to fetch the word list. Please try again."));
    }
  };

  const fetchUserSavedStoryList = async () => {
    if (!uid) return; // Ensure UID is available

    try {
      // Reference to the user's storyList subcollection
      const storyListRef = collection(db, "users", uid, "storyList");
      const storyListQuery = query(storyListRef, orderBy("createdAt", "desc"));

      // Listen for real-time changes in the storyList
      const unsubscribe = onSnapshot(
        storyListQuery,
        (snapshot) => {
          const storiesData = snapshot.docs.map((doc) => ({
            id: doc.id, // storyId from Firestore
            ...doc.data(), // The packetizedStory object
          }));

          // Dispatch the updated story list to Redux
          dispatch(setSavedStoryList(storiesData));
        },
        (error) => {
          console.error("Error listening to storyList snapshot:", error);
          dispatch(
            setError("Failed to fetch the saved stories. Please try again.")
          );
        }
      );

      // Clean up the subscription when the component unmounts or the user changes
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user saved story list:", error);
      dispatch(
        setError("Failed to fetch the saved stories. Please try again.")
      );
    }
  };

  if (isSettingUp) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#191D24",
        }}
      >
        <ActivityIndicator size={"small"} color={"#F54A14"} />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#191d24" },
        drawerActiveBackgroundColor: "#6D60F3ff",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerPosition: "right",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="list" color={color} size={size} />
          ),
        }}
      >
        {(props) => <MainScreen {...props} ifProfileSetup={ifProfileSetup} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerEntryScreen;
