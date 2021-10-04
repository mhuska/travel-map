import { AfterViewInit, Component, OnInit } from '@angular/core';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import { Store } from '../../data/store.data';
import { MapLocation } from '../../models/location.model';

const pinsUrl: string = "https://slowcamino.com/travel-map/assets/server-php/pins.php";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  get content(): MapLocation {
    return this.store.CurrentLocation;
  }

  constructor(private store: Store) { }

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
               
        //Point Layer
        const pointLayer = new GeoJSONLayer({
            url: pinsUrl,
            outFields: ["*"],
            copyright: "Slow Camino",
            popupTemplate: template
        });
        this.UpdateRenderer(pointLayer, "ZoomedOut"); //Set the renderer
        
                   
        //Map       
        const map = new Map({
          basemap: <string | Basemap> "hybrid",
          layers: [pointLayer]
        });

        //View
        const view = new MapView({
          map: map,
          center: [0, 15], // Longitude, latitude
          constraints: {
            minZoom: 2,
            rotationEnabled: false,          
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

        let _updateBasemap = this.UpdateBasemap;
        let _updateRenderer = this.UpdateRenderer;

        //Watch the Scale and change basemap when zoomed in
        //Update scale-dependent rendering when scale changes
        view.watch("scale", function (newScale) {
          
          if (newScale > 9200000) {
            _updateBasemap(map, view, basemap);
            _updateRenderer(pointLayer, "ZoomedOut");
          } else {
            _updateBasemap(map, view, "hybrid");
            _updateRenderer(pointLayer, "ZoomedIn");
          }
        });

          
  }

  UpdateBasemap(map: any, view: any, basemap: any) {
    if (map.basemap !== basemap) {
      map.basemap = basemap;
    }
  }

  UpdateRenderer(layer: any, mode: "ZoomedIn" | "ZoomedOut") {

    const marker_size = "22px";
    const red_x_url = "./assets/symbols/pirate-x-18.png";

    let expression;
    if (mode == "ZoomedIn") {
      expression = "When($feature.Scale=='Zoomed-In' || $feature.Scale=='All', $feature.Marker, 'Hidden')"
    } else {
      expression = "When($feature.Scale=='Zoomed-Out' || $feature.Scale=='All', $feature.Marker, 'Hidden')"
    }

    layer.renderer = {
        type: "unique-value",
        valueExpression: expression,
        defaultSymbol: {
          type: "picture-marker",
          url: red_x_url,
          width: marker_size,
          height: marker_size,
        },
        uniqueValueInfos: [
         {
          value: "Hidden",
          symbol:{
            type: "simple-marker",              
            color: [0, 0, 0, 0]
          }
         } 
          ,{
          value: "Red",
          symbol: {
            type: "picture-marker",
            url: red_x_url,
            width: marker_size,
            height: marker_size,
          },
          label: "Red"
        }]
      };
    }

}
