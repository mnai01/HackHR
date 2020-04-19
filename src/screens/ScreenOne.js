import React, { useState, useEffect } from "react";
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
import { AsyncStorage } from "react-native";
import Moment from "moment";

const LOCATION_TASK_NAME = "background-location-task";

export default MonitorLocation = () => {
  const [startNstop, setSS] = useState(false);
  const [coords, setCords] = useState(false);
  const [altitude, setAltitude] = useState(false);
  const [accuracy, setAccuracy] = useState(false);
  const [speed, setSpeed] = useState(false);
  const [dataJSON, setData] = useState(false);
  const [heading, setHeading] = useState(false);
  const [timestamp, setTimeStamp] = useState(false);
  const [dateTime, setDateTime] = useState(false);

  const [count, setCount] = useState(1);

  useEffect(() => {
    setInterval(() => {
      _retrieveData();
    }, 5000);
  }, []);

  _retrieveData = async () => {
    try {
      const valueLatitude = await AsyncStorage.getItem("@lat");
      const valueLongitude = await AsyncStorage.getItem("@lng");
      const valueAltitude = await AsyncStorage.getItem("@alt");
      const valueAccuracy = await AsyncStorage.getItem("@acc");
      const valueSpeed = await AsyncStorage.getItem("@spd");
      const valueData = await AsyncStorage.getItem("@dat");
      const valueHeading = await AsyncStorage.getItem("@head");
      const valueTimeStamp = await AsyncStorage.getItem("@tmstp");
      let day = Moment(parseInt(valueTimeStamp));
      console.log(day);
      if (valueLatitude !== null && valueLongitude !== null) {
        let day = Moment(parseInt(valueTimeStamp));
        console.log(valueLatitude);
        console.log(valueLongitude);
        setCords({ latitude: valueLatitude, longitude: valueLongitude });
        setAltitude(valueAltitude);
        setAccuracy(valueAccuracy);
        setSpeed(valueSpeed);
        setData(valueData);
        setHeading(valueHeading);
        setTimeStamp(valueTimeStamp);
        setDateTime(day);
        return JSON.parse(value);
      }
    } catch (error) {
      console.log("no", error);
    }
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
            activeOpacity={1}
            underlayColor="#7aebe1"
            onPress={_onStartPress}
            style={[styles.button, { backgroundColor: "#00C7B7" }]}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#ff9ea7"
            onPress={_onStopPress}
            style={[styles.button, { backgroundColor: "#FB6875" }]}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableHighlight>
        </View>
        {startNstop ? (
          <View>
            <View style={styles.container}>
              <Text style={{ fontSize: 20 }}>Tracking...</Text>
            </View>
            <ActivityIndicator
              style={styles.tracking}
              size="large"
              color="#0000ff"
            />
            {/* <View style={styles.container}>
              <Text style={{ fontSize: 20 }}>
                {coords.latitude} {coords.longitude}
              </Text>
            </View> */}
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={{ fontSize: 20 }}>Not Tracking</Text>
          </View>
        )}
        {coords && (
          <React.Fragment>
            <View style={styles.row}>
              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Course</Text>
                <Text style={[styles.detail, styles.largeDetail]}>
                  {heading}
                </Text>
              </View>

              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Speed</Text>
                <Text style={[styles.detail, styles.largeDetail]}>{speed}</Text>
              </View>

              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Altitude</Text>
                <Text style={[styles.detail, styles.largeDetail]}>
                  {altitude}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-start" }}>
              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Latitude</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {coords.latitude}
                  </Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Longitude</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {coords.longitude}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Accuracy</Text>
                  <Text style={styles.detail}>{accuracy}</Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Altitude Accuracy</Text>
                  <Text style={styles.detail}>None</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Timestamp</Text>
                  <Text style={styles.detail}>{timestamp}</Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Date / Time</Text>
                  <Text style={styles.detail}>{dateTime.toString()}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.full]}>
                  <Text style={styles.json}>{dataJSON.toString()}</Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        )}
      </SafeAreaView>
    </>
  );
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    await AsyncStorage.setItem("@lat", locations[0].coords.latitude.toString());
    await AsyncStorage.setItem(
      "@lng",
      locations[0].coords.longitude.toString()
    );
    await AsyncStorage.setItem("@alt", locations[0].coords.altitude.toString());
    await AsyncStorage.setItem("@acc", locations[0].coords.accuracy.toString());
    await AsyncStorage.setItem("@spd", locations[0].coords.speed.toString());
    await AsyncStorage.setItem("@dat", JSON.stringify(data.locations[0]));
    await AsyncStorage.setItem("@head", locations[0].coords.heading.toString());
    await AsyncStorage.setItem("@tmstp", locations[0].timestamp.toString());

    console.log(data.locations[0]);
    await axios
      .post(
        `https://hack-hr.herokuapp.com/api?lat=&${locations[0].coords.latitude}&long=${locations[0].coords.longitude}`
      )
      .then((response) => {
        console.log("This is reponse " + response.data.success);
      })
      .catch((err) => {
        console.log("error" + err.message);
      });
    console.log(
      `https://hack-hr.herokuapp.com/api?lat=&${locations[0].coords.latitude}&long=${locations[0].coords.longitude}`
    );
  }
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
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
  detailBox: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
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
  valueTitle: {
    fontSize: 12,
  },
  detail: {
    fontSize: 15,
    fontWeight: "bold",
  },
  largeDetail: {
    fontSize: 20,
  },
  json: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  full: {
    width: "100%",
  },
  half: {
    width: "50%",
  },
  third: {
    width: "33%",
  },
});
