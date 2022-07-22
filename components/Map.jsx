import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";

const Map = (props) => {
  useEffect(() => {

  }, [props.selectedPath]);

  return (
    <MapContainer
      center={[45.9432, 24.9668]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY3Jpc3RpbWFjb3ZlaSIsImEiOiJjbDNpejZuenYwYnZvM2ptbnkxMW9pYjFsIn0.tak-wN1PtmJd2hotguBuJg`}
        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
      />
      
      {
        props.markers.start !== null ? 
        <Marker position={props.markers.start.position}>
          <Popup style={{ backgroundColor: 'red'}}>
            starting from {props.markers.start.name}
          </Popup>
        </Marker> 
        : null
      }

      {
        props.markers.dest !== null ? 
        <Marker position={props.markers.dest.position}>
          <Popup>
            destination {props.markers.dest.name}
          </Popup>
        </Marker> 
        : null
      }

      {
        props.markers.start !== null && props.markers.dest !== null ? 
        <Polyline
          positions={[props.markers.start.position, props.markers.dest.position]}
          color='red'
        />
        : null
      }

      {
        typeof props.selectedPath?.length !== 'undefined' && props.selectedPath.length !== 0 ? 
        (
          <span>
            {
              props.selectedPath.toString()
            }
          </span>
        )
        : null
      }


      
    </MapContainer>
  );
};

export default Map;