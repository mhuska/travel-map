import { AfterViewInit, Component, OnInit } from '@angular/core';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import { Store } from 'src/app/data/store.data';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  constructor(private store: Store) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.LoadMap();
  }

  LoadMap() {
   
         //Basmap
         let basemap = new Basemap({
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
        
        const marker_size = "22px";

        //Point Renderer
        const renderer = {
          type: "unique-value",
          field: "Marker",
          defaultSymbol: {
            type: "picture-marker",              
            url: "./assets/symbols/pirate-x-18.png",
            width: marker_size,
            height: marker_size,
          },
          uniqueValueInfos: [{
            value: "Red",
            symbol: {
              type: "picture-marker",
              url: "./assets/symbols/pirate-x-18.png",
              width: marker_size,
              height: marker_size,
            },
            label: "Red"
          }]
        };
        
        //Point Layer
        const pointLayer = new GeoJSONLayer({
            url: "https://slowcamino.com/custom/pins.php",
            outFields: ["*"],
            copyright: "Slow Camino",
            popupTemplate: template,
            renderer: <any>renderer
        });
        
                   
        //Map       
        const map = new Map({
          basemap: basemap,
          layers: [pointLayer]
        });

        //View
        const view = new MapView({
          map: map,
          center: [0, 15], // Longitude, latitude
          zoom: 2, // Zoom level
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
          
  }

}
