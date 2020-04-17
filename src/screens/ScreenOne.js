import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";

export default MonitorLocation = () => {
  const [startNstop, setSS] = useState(false);

  state = {
    location: "0",
  };

  _onStartPress = async () => {
    setSS(true);
    console.log("pressed");
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0,
        timeInterval: 5000,
      });
    }
  };

  _onStopPress = async () => {
    setSS(false);
    console.log("pressed");
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.row}>
          <TouchableHighlight
            onPress={_onStartPress}
            style={[styles.button, { backgroundColor: "#126312" }]}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={_onStopPress}
            style={[styles.button, { backgroundColor: "#881717" }]}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableHighlight>
        </View>
        {startNstop ? (
          <View>
            <ActivityIndicator
              style={styles.ScrollViewMessage}
              size="large"
              color="#0000ff"
            />
          </View>
        ) : (
          <Text style={styles.container}>NOT TRACKING</Text>
        )}
      </SafeAreaView>
    </>
  );
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("started");

  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    await axios
      .post("https://jsonplaceholder.typicode.com/post/", data)
      .then((response) => {
        console.log("This is reponsde" + response);
      })
      .catch((err) => {
        console.log("error" + err.message);
      });
    const { locations } = data;
    console.log(data);
  }
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    marginVertical: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    fontSize: 30,
    color: "#FFFFFF",
  },
});
