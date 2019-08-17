import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { View } from 'react-native';

import { getPixelSize } from '../../utils';
import Search from '../Search';
import Directions from '../Directions';

import markerImage from '../../assets/marker.png';

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from './styles';

Geocoder.init('AIzaSyAJai_eIuGW6TaTlqZqONK2Dm7UGeJ8sos');

export default function Map() {
  const [coordinates, setCoordinates] = useState({
    latitude: -6.4793281,
    longitude: -37.0722295,
  });

  const [destination, setDestination] = useState(null);

  const [duration, setDuration] = useState(null);

  const [location, setLocation] = useState(null);

  const mapView = useRef();

  function handleLocationSelected(data, { geometry }) {
    const {
      location: { lat: latitude, lng: longitude },
    } = geometry;
    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  }

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

      const response = await Geocoder.from(coordinates);
      const address = response.results[0].formatted_address;
      const locationFiltered = address.substring(0, address.indexOf(','));
      setLocation(locationFiltered);
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
        ref={mapView}
      >
        {destination && (
          <>
            <Directions
              origin={coordinates}
              destination={destination}
              onReady={result => {
                setDuration(Math.floor(result.duration));
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(50),
                  },
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={coordinates} anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>

      <Search onLocationSelected={handleLocationSelected} />
    </View>
  );
}
