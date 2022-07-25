//* import hooks from the react framework
import { useEffect } from "react";

//* import everything from leaflet.js, which is the library used to display the map
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { divIcon } from "leaflet";

//* import the render function from react to be able to have custom map markers
import {renderToStaticMarkup} from "react-dom/server";

//* the map component is used to display the interactive map on our app
const Map = (props) => {
  const customIcon = divIcon({
    html: renderToStaticMarkup(
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-8 h-8" viewBox="0 0 20 20" fill={typeof props.markerColor !== 'string' ? 'red' : props.markerColor}>
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </span>
    )
  }); //* this is the custom icon made out of an svg with the color provided by the parent component as a prop

  return (
    <MapContainer
      center={[45.9432, 24.9668]} //* center it around Romania
      zoom={7} //* acceptable zoom level on a desktop screen
      scrollWheelZoom={true} //* enable zooming via scroll wheel
      style={{ height: "100%", width: "100%" }} //* have the map fill the entire container
    >
      <TileLayer //* show credentials
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY3Jpc3RpbWFjb3ZlaSIsImEiOiJjbDNpejZuenYwYnZvM2ptbnkxMW9pYjFsIn0.tak-wN1PtmJd2hotguBuJg`}
        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
      />
      
      {
        //* start station marker
        props.markers.start !== null ? 
        <Marker position={props.markers.start.position} icon={customIcon}>
          <Popup >
            starting from {props.markers.start.name}
          </Popup>
        </Marker> 
        : null
      }

      {
        //* destination marker
        props.markers.dest !== null ? 
        <Marker position={props.markers.dest.position} icon={customIcon}>
          <Popup>
            destination {props.markers.dest.name}
          </Popup>
        </Marker> 
        : null
      }

      {
        //* straight line connecting markers
        props.markers.start !== null && props.markers.dest !== null ? 
        <Polyline
          positions={[props.markers.start.position, props.markers.dest.position]}
          color={typeof props.markerColor === 'string' ? props.markerColor : '#0f0'}
        />
        : null
      }

      {
        //* if there's a specific path selected, show the outline of the path by connecting each station
        typeof props.selectedPath?.path?.length !== 'undefined' && props.selectedPath?.path?.length !== 0 ? 
        (
          props.selectedPath.path.filter(stop => typeof stop?.latitude !== 'undefined' && typeof stop?.longitude !== 'undefined').map(stop => ([parseFloat(stop.latitude), parseFloat(stop.longitude)])).map(
            ([lat, lon], index, array) => {
              if (index === 0) {
                return null;
              }

              return (
                <Polyline
                  key={`polyline-${index}`}
                  positions={[array[index - 1], [lat, lon]]}
                  color={typeof props.detailsColor === 'string' ? props.detailsColor : 'green'}
                />
              )
            }
          )
        )
        : null
      }


      
    </MapContainer>
  );
};

export default Map;