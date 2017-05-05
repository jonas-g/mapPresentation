        
function marker(latitude,longitude,popupData,style)
{
  this.latitude=latitude;
  this.longitude=longitude;
  this.popupData=popupData;
  this.style = style;
}

var marker1 = new marker(59.96,17.62,"AO-no:1 Status: Påbörjad","yellow");
var marker2 = new marker(59.75,17.75,"AO-no:2 Status: Ej påbörjad","red");
var marker3 = new marker(59.75,17.39,"AO-no:3 Status: Klar","green");
var marker4 = new marker(60.10,17.13,"AO-no:4 Status: Påbörjad","yellow");
        
var markers = [marker1,marker2,marker3,marker4];
        
function mapLayers(esriBasemap,esriFeatureLayer)
{
  this.esriBasemap=esriBasemap;
  this.esriFeatureLayer=esriFeatureLayer;
}

// Förändra så funktionen tar värde för baskarta och feature-länk från Flow
var mapData = new mapLayers("Streets",
"https://gisapp.msb.se/arcgis/rest/services/Raddningstjanst/Brandstationer/FeatureServer/0");

var map = new L.map('map');

var locate = L.control.locate({
  flyTo:true,
  locateOptions:{
    setView:'false',
    maxZoom: 13
  }
}).addTo(map);

locate.start();

var iconize = function (symbol, color, shape) {
  var icon = L.ExtraMarkers.icon({
    icon: symbol,
    markerColor: color,
    iconColor: 'white',
    shape: shape,
    prefix: 'glyphicon'
  })
  return icon;
}

var layer = L.esri.basemapLayer(mapData.esriBasemap).addTo(map);
var markerGroup = L.featureGroup();

var markerBounds = [];

markers.forEach(function (m) {
  //Parameters 
  var mark = L.marker([m.latitude, m.longitude], {icon: iconize('glyphicon-wrench', m.style, 'square')}).addTo(markerGroup);
  mark.bindPopup(m.popupData);
  markerBounds.push([m.latitude, m.longitude])
});

//Flyttar View så man ser alla punkter i markers-lagret
map.fitBounds(markerBounds);

//Clustering
var clusterMarkers= L.markerClusterGroup();

L.esri.Cluster.featureLayer({
  url: mapData.esriFeatureLayer,
  pointToLayer: function (geojson, latlng) {
    return L.marker(latlng, {
      icon: iconize('glyphicon-fire', 'red', 'circle')
    })
  }
}).addTo(markerGroup);

clusterMarkers.addLayer(markerGroup);
clusterMarkers.addTo(map);


