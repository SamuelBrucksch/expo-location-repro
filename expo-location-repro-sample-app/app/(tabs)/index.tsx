import { Image, StyleSheet, Platform, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [registerWatcher, setRegisterWatcher] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("got location", location);
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log("registerWatcher: ", registerWatcher);
    if (!registerWatcher) return;

    setRegisterWatcher(false);

    // register location watcher
    Location.watchPositionAsync({}, (locationObject) => {
      console.log("location incoming: ", locationObject);
      setLocation(locationObject);
    })
      .then((subscription) => {
        console.log("watcher registered: ", subscription);
      })
      .catch(console.error);
  }, [registerWatcher]);

  const text =
    "Location: " +
    JSON.stringify(location) +
    "\nLocation update timestamp: " +
    location?.timestamp;

  return (
    <>
      <Text>{text}</Text>
      <Button
        onPress={() => {
          setRegisterWatcher(true);
        }}
        title="Watch again"
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
