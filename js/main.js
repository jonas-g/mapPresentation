//Konstruktor för marker object    
function marker(latitude,longitude,popupData,color,icon,shape,rowIndex)
{
  this.latitude=latitude;
  this.longitude=longitude;
  this.popupData = popupData;
  this.color= color;
  this.icon = icon;
  this.shape = shape;
  this.rowIndex = rowIndex
}

//Formaterar en inputsträng som är skriven som Key-Value-par till en lista
function formatPopupData(value){
  var popupContent = "";
  var textarray = value.split(',');
  textarray.forEach(function (p){
    keyValuePair = p.split(':');
    popupContent += "<b>" + keyValuePair[0] + ":</b> " + keyValuePair[1] + "<br/>";
  })
  return popupContent;
}

//Funktion för att välja önskat baslager
function mapLayers(basemap,featureLayer)
{
  this.basemap=basemap;
  this.featureLayer=featureLayer;
}

//Skapar ikon
function createIcon(symbol, color, shape)
{
  var icon = L.ExtraMarkers.icon({
    icon: symbol,
    markerColor: color,
    iconColor: 'white',
    shape: shape,
    prefix: 'glyphicon'
  })
  return icon;
}

//Skapar fiktiv data
var marker1 = new marker(59.96,17.62,'AO:1, Namn:Reparation av radiomast, Status:Påbörjad',"yellow","Novacura Gubbe","square",1);
var marker2 = new marker(59.75,17.75,'AO:2, Namn:Kabelfel, Status:Ej påbörjad',"red","Novacura Gubbe","square",2);
var marker3 = new marker(59.75,17.39,'AO:3, Namn:Död råtta, Status:Klar',"green","Novacura Gubbe","square",3);
var marker4 = new marker(60.10,17.13,'AO:4, Namn:Födelsedagskalas, Status:Påbörjad',"yellow","Novacura Gubbe","square",4);

//Skapar mapLayers objekt
var mapData = new mapLayers("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}","https://gisapp.msb.se/arcgis/rest/services/Raddningstjanst/Brandstationer/FeatureServer/0");

//Array med markers        
var markers = [marker1,marker2,marker3,marker4];

//Variabler som används i markörerna
var mark,row;        
//Instansierar kartan
var map = new L.map('map');
//Adderar kontrol för att visa egen position
var locate = L.control.locate({
  flyTo:true,
  locateOptions:{
    setView:'false',
    maxZoom: 13
  }
}).addTo(map);
//Startar lokaliseringen vid appstart
locate.start();
//Adderar baskarta till map
var layer = L.tileLayer(mapData.basemap).addTo(map);
//Skapar featuregroup och lägger till click-event
var markerGroup = L.featureGroup().addTo(map).on('click',selectedMarker);
//Array för att zooma vyn till markörerna
var markerBounds = [];

//Skapar markörer
markers.forEach(function (m) 
{
  mark = L.marker([m.latitude, m.longitude], {icon: createIcon('glyphicon-wrench', m.color, m.shape)}).addTo(markerGroup);
  mark.bindPopup(formatPopupData(m.popupData));
  mark.row = m.rowIndex;
  markerBounds.push([m.latitude, m.longitude])
});

//Flyttar View så man ser alla punkter i markers-lagret
map.fitBounds(markerBounds);

//Klustrering av markörerna
var clusterMarkers= L.markerClusterGroup();
clusterMarkers.addLayer(markerGroup);
clusterMarkers.addTo(map);

//Kod för att välja markörer
 function selectedMarker(event){
    console.log(event.layer.row);
}



