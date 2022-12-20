import { AfterViewInit, Component, OnInit } from '@angular/core';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import { Store } from '../../data/store.data';
import { MapLocation } from '../../models/location.model';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import Home from "@arcgis/core/widgets/Home";

const pinsUrl: string = "https://slowcamino.com/travel-map/assets/server-php/cache_pins.php";
const linesUrl: string = "https://slowcamino.com/travel-map/assets/server-php/cache_connections.php";

const MAP_SCALE_BREAKPOINT: number = 9200000;
const LAYER_SCALE_BREAKPOINT: number = 9245000;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  get content(): MapLocation {
    return this.store.CurrentLocation;
  }

  constructor(private store: Store) { 


  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.LoadMap();
  }

  LoadMap() {
   
         //Basmap
         let basemap: Basemap = new Basemap({
          baseLayers: [
            new TileLayer({
              url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/VintageShadedRelief/MapServer",
              title: "Basemap"
            }),
            
          ],
          title: "basemap",
          id: "basemap"
        });
        
        //Popup
        const template = {
          title: "{Title}",
          content: "<img src='{Image}' width='200px'><a href='{ArticleURL}' target='_blank'>read more...</a>",
        };
               
        //Basemap labels
        /*
        const labelsLayer = new TileLayer({
          url: "http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer",
          minScale: 9200000
        })*/

        //Point Labels
        const ZIPointLabels = new LabelClass({
          // autocasts as new LabelClass()
          symbol: {
            type: "text",  // autocasts as new TextSymbol()
            color: "#0a0a0a",
            haloColor: [255, 255, 255, 0.7],
            haloSize: "2px",
            font: {
                family: "Walter Turncoat",
                style: "normal",
                weight: "normal",
                size: 12,
              }
            
          },
          minScale: LAYER_SCALE_BREAKPOINT,
          labelPlacement: <"center-right">"center-right",
          labelExpressionInfo: {
            expression: "IIf($feature.Scale=='Zoomed-Out', '', $feature.Title)"
          }
        });

        const ZOPointLabels = new LabelClass({
          // autocasts as new LabelClass()
          symbol: {
            type: "text",  // autocasts as new TextSymbol()
            color: "#0a0a0a",
            haloColor: [255, 255, 255, 0.7],
            haloSize: "2px",
            font: {
                family: "Walter Turncoat",
                style: "normal",
                weight: "normal",
                size: 10,
              }
            
          },
          maxScale: LAYER_SCALE_BREAKPOINT,
          labelPlacement: <"center-right">"center-right",
          labelExpressionInfo: {
            expression: "IIf($feature.Scale=='Zoomed-In', '' , $feature.Title)"
          }
        });

        //Point Layer
        const pointLayer = new GeoJSONLayer({
            url: pinsUrl,
            outFields: ["*"],
            copyright: "Slow Camino",
            popupTemplate: template,
            labelingInfo: [ZOPointLabels, ZIPointLabels]
        });
        this.UpdateRenderer(pointLayer, "ZoomedOut"); //Set the renderer
        
        //Line Layer
        const lineLayer = new GeoJSONLayer({
          url: linesUrl,
          outFields: ["*"],
          copyright: "Slow Camino",
          popupTemplate: null,
          renderer: <any>{
            type: "simple",
            symbol: {
              type: "simple-line",
              width: 3,
              color: [200, 18, 18, 1],
              style: "short-dot",
            }
          }
        });
        
                   
        //Map       
        const map = new Map({
          basemap: <string | Basemap> "satellite",
          layers: [ lineLayer, pointLayer ]
        });

        //View
        const view = new MapView({
          map: map,
          center: [-65.1, -25.4], // Longitude, latitude
          zoom: 3,
          constraints: {
            minZoom: 2,
            rotationEnabled: false,          
          },
          // Disable mouse-wheel and single-touch map navigation.
          navigation: {
            //mouseWheelZoomEnabled: false,
            browserTouchPanEnabled: false
          },
          container: "map-container",
          popup: {
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false,
              position: "bottom-left"
            }
          }
        });

        //Set the selection
        var _co = this;
        view.popup.watch("selectedFeature", function (graphic) {
          _co.store.SetLocation(graphic);
        });

        //Add the zoom action
        this.store.OnZoom = (geometry: any) => {
          view.goTo({target: geometry, zoom: 6}, {duration: 2000}) //.then(function () { view.zoom = 6; });
        }

        let _updateBasemap = this.UpdateBasemap;
        let _updateRenderer = this.UpdateRenderer;

        //Watch the Scale and change basemap when zoomed in
        //Update scale-dependent rendering when scale changes
        view.watch("scale", function (newScale) {

          //console.log(newScale)

          //Change basemaps
          if (newScale > MAP_SCALE_BREAKPOINT) { //9245000) {
            _updateBasemap(map, view, basemap);
          } else {
            _updateBasemap(map, view, "satellite");
          }

          //Change layer renderer
          if (newScale > LAYER_SCALE_BREAKPOINT) {
            _updateRenderer(pointLayer, "ZoomedOut");
          } else {          
            _updateRenderer(pointLayer, "ZoomedIn");
          }
        });

        //Home button
        view.ui.add(new Home({
          view: view,
          goToOverride: () => {
            view.goTo({target: [0,0], zoom: 2}, {duration: 2000})
          }
        }), "top-right");
          
  }

  UpdateBasemap(map: any, view: any, basemap: any) {
    if (map.basemap !== basemap) {
      map.basemap = basemap;
    }
  }

  UpdateRenderer(layer: any, mode: "ZoomedIn" | "ZoomedOut") {

    const marker_size = "26px"; // mode=="ZoomedIn" ? "42px" : "26px";
    const x_1_url = "./assets/symbols/pirate-x-1b.png";
    const x_2_url = "./assets/symbols/pirate-x-2b.png";
    const x_3_url = "./assets/symbols/pirate-x-3b.png";
    const x_4_url = "./assets/symbols/pirate-x-4b.png";
    const x_5_url = "./assets/symbols/pirate-x-5b.png";

    const dateConfig = [
      {days: 30, marker: "x-5"},
      {days: 60, marker: "x-4"},
      {days: 90, marker: "x-3"},
      {days: 180, marker: "x-2"},
      {days: 365, marker: "x-1"}
    ]

    let dateExp: string = "When(" + dateConfig.map(c => `$feature.DaysSince < ${c.days}, '${c.marker}'`).join() + ", 'x-1')";
    let markerTypeExp: string = `When($feature.Marker=='red', ${dateExp}, $feature.Marker)`;
    let expression;
    if (mode == "ZoomedIn") {
      expression = `When($feature.Scale=='Zoomed-In' || $feature.Scale=='All', ${markerTypeExp}, 'Hidden')`;
    } else {
      expression = `When($feature.Scale=='Zoomed-Out' || $feature.Scale=='All', ${markerTypeExp}, 'Hidden')`
    }

    layer.renderer = {
        type: "unique-value",
        valueExpression: expression,
        defaultSymbol: {
          type: "picture-marker",
          url: x_1_url,
          width: marker_size,
          height: marker_size,
        },
        uniqueValueInfos: [
         {
          value: "Hidden",
          symbol:{
            type: "simple-marker",              
            color: [0, 0, 0, 0],
            outline: {
              width: 0.5, color: [0, 0, 0, 0]
            }
          }
         } 
        ,{
          value: "x-1",
          symbol: {
            type: "picture-marker",
            url: x_1_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        },{
          value: "x-2",
          symbol: {
            type: "picture-marker",
            url: x_2_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        },{
          value: "x-3",
          symbol: {
            type: "picture-marker",
            url: x_3_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        },{
          value: "x-4",
          symbol: {
            type: "picture-marker",
            url: x_4_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        },{
          value: "x-5",
          symbol: {
            type: "picture-marker",
            url: x_5_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        }
      ]
      };
    }

}
