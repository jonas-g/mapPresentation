var map = new L.map('map');
var layerLabels;

map.locate({setView: true, maxzoom :13})


var layer = L.esri.basemapLayer("Imagery").addTo(map);

 var fireStationsLayer= L.esri.featureLayer({
    url: 'https://gisapp.msb.se/arcgis/rest/services/Raddningstjanst/Brandstationer/FeatureServer/0',
    pointToLayer: function (geoJson,latlng){
        return L.circleMarker(latlng);
    }
 }).addTo(map);

fireStationsLayer.bindPopup(function (sourceLayer){
    return L.Util.template('<p>Namn: {NAMN}<br>Kommun: {KOMMUNNAMN}<br>Beredskap: {Bered}</p>', sourceLayer.feature.properties)
});

var serviceInstance = L.esri.featureLayerService({url:'https://gisapp.msb.se/arcgis/rest/services/Raddningstjanst/Brandstationer/FeatureServer/0'})
var query = L.esri.query(serviceInstance);

map.on('click',runQuery);

function runQuery(e)
{
    fireStationsLayer.query().nearby(e.latlng,10000).ids(function(error,ids)
    {
        fireStationsLayer.setStyle(function()
        {
            return {color : "blue"};
        });
        if (ids == null)
        {
            counter = 0;
        }
        else
        {
            counter = ids.length;
        }
        for(var i=0;i<counter;i++)
        {
            fireStationsLayer.setFeatureStyle(ids[i],{color: "green"});
        }
    });
}

  function setBasemap(basemap) {
    if (layer) {
      map.removeLayer(layer);
    }

    layer = L.esri.basemapLayer(basemap);

    map.addLayer(layer);

    if (layerLabels) {
      map.removeLayer(layerLabels);
    }

    if (basemap === 'ShadedRelief'
     || basemap === 'Oceans'
     || basemap === 'Gray'
     || basemap === 'DarkGray'
     || basemap === 'Imagery'
     || basemap === 'Terrain'
   ) {
      layerLabels = L.esri.basemapLayer(basemap + 'Labels');
      map.addLayer(layerLabels);
    }
  }

  function changeBasemap(basemaps){
    var basemap = basemaps.value;
    setBasemap(basemap);
  }