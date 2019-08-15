import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import { View } from 'react-native';

export default function Map() {
  const [coordinates, setCoordinates] = useState({
    latitude: -6.4793281,
    longitude: -37.0722295,
  });

  useEffect(() => {
    async function loadCurrentPosition() {
      await Geolocation.getCurrentPosition(
        ({ coords }) => {
          setCoordinates(coords);
        },
        () => {},
        {
          timeout: 2000,
          enableHighAccuracy: true,
          maximumAge: 1000,
        }
      );
    }

    loadCurrentPosition();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        }}
        showsUserLocation
        loadingEnabled
      />
    </View>
  );
}
