

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import { Store } from '../../data/store.data';
import { MapLocation } from '../../models/location.model';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import Home from "@arcgis/core/widgets/Home";
import { ActivatedRoute } from '@angular/router';

const pinsCache: string = "https://slowcamino.com/travel-map/assets/server-php/cache_pins.php";
const linesCache: string = "https://slowcamino.com/travel-map/assets/server-php/cache_connections.php";

const pinsLive: string = "https://slowcamino.com/travel-map/assets/server-php/pins.php";
const linesLive: string = "https://slowcamino.com/travel-map/assets/server-php/connections.php";

const MAP_SCALE_BREAKPOINT: number = 9200000;
const LAYER_SCALE_BREAKPOINT: number = 9245000;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  private pinsUrl: string = pinsLive;
  private linesUrl: string = linesLive;

  @ViewChild("infoCard") infoCard: ElementRef;

  get content(): MapLocation {
    return this.store.CurrentLocation;
  }

  constructor(private store: Store, private router: ActivatedRoute) {

    this.router.queryParams.subscribe({
      next: (params) => {
        this.LoadMap();
      }
    })
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.LoadMap();
  }

  ResolveLayerURLS() {
    //Live version lets us see changes before the nightly cache update.
    //if (this.router.snapshot.queryParams["live"] && false) {
      this.pinsUrl = pinsLive;
      this.linesUrl = linesLive;
    //} else {
     // this.pinsUrl = pinsCache;
     // this.linesUrl = linesCache;
    //}
  }

  LoadMap() {

    //Resolve Layer URLS
    this.ResolveLayerURLS();

    //Basmap
    
    let basemap1 = new Basemap({
      baseLayers: [
        new TileLayer({
          url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/VintageShadedRelief/MapServer",
          title: "Basemap"
        }),
        new TileLayer({
          url: "https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer",
          title: "Boundaries"
        })
      ],
      title: "basemap",
      id: "basemap"
    });

    /*
    let basemap2 = new Basemap({
      baseLayers: [
        new TileLayer({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          title: "Basemap"
        }),
        new TileLayer({
          url: "https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer",
          title: "Boundaries"
        })
      ],
      title: "basemap",
      id: "basemap"
    });*/

    let basemap2 = "topo";

    //Popup
    const template = {
      title: "{Title}",
      content: "<img src='{Image}' width='200px'><a href='{ArticleURL}' target='_blank'>read more...</a>",
    };

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
        expression: "IIf($feature.Scale=='Zoomed-Out' || $feature.Marker=='hidden', '', $feature.Title)"
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
        expression: "IIf($feature.Scale=='Zoomed-In' || $feature.Marker=='hidden', '' , $feature.Title)"
      }
    });

    //Point Layer
    const pointLayer = new GeoJSONLayer({
      url: this.pinsUrl,
      outFields: ["*"],
      copyright: "Slow Camino",
      popupTemplate: template,
      labelingInfo: [ZOPointLabels, ZIPointLabels]
    });
    this.UpdateRenderer(pointLayer, "ZoomedOut"); //Set the renderer

    //Line Layer
    const lineLayerFlights = new GeoJSONLayer({
      url: this.linesUrl,
      outFields: ["*"],
      copyright: "Slow Camino",
      popupTemplate: null,
      //labelingInfo: [ConnectionLabels],
      renderer: this.GetLineRenderer("flight")
    });

    const lineLayerLand = new GeoJSONLayer({
      url: this.linesUrl,
      outFields: ["*"],
      copyright: "Slow Camino",
      popupTemplate: null,
      //labelingInfo: [ConnectionLabels],
      renderer: this.GetLineRenderer("land")
    });


    //Map       
    const map = new Map({
      basemap: <string | Basemap>"satellite",
      layers: [lineLayerFlights, lineLayerLand, pointLayer]
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
      view.goTo({ target: geometry, zoom: 6 }, { duration: 2000 }) //.then(function () { view.zoom = 6; });
    }

    let _updateBasemap = this.UpdateBasemap;
    let _updateRenderer = this.UpdateRenderer;

    //Watch the Scale and change basemap when zoomed in
    //Update scale-dependent rendering when scale changes
    view.watch("scale", function (newScale) {

      //console.log(newScale)

      //Change basemaps
      if (newScale > MAP_SCALE_BREAKPOINT) { //9245000) {
        _updateBasemap(map, view, basemap1);
      } else {
        _updateBasemap(map, view, basemap2);
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
        view.goTo({ target: [0, 0], zoom: 2 }, { duration: 2000 })
      }
    }), "top-left");

    //Info Card
    view.ui.add(this.infoCard.nativeElement, "bottom-right");

  }

  UpdateBasemap(map: any, view: any, basemap: any) {
    if (map.basemap !== basemap) {
      map.basemap = basemap;
    }
  }

  UpdateRenderer(layer: any, mode: "ZoomedIn" | "ZoomedOut") {

    const marker_size = "18px"; // mode=="ZoomedIn" ? "42px" : "26px";
    const picture_size = "28px";

    const x_1_url = "./assets/symbols/pirate-x-1b.png";
    const x_2_url = "./assets/symbols/pirate-x-2b.png";
    const x_3_url = "./assets/symbols/pirate-x-3b.png";
    const x_4_url = "./assets/symbols/pirate-x-4b.png";
    const x_5_url = "./assets/symbols/pirate-x-5b.png";
    
    /*
Icon Attribution
<a href="https://www.flaticon.com/free-icons/train" title="train icons">Train icons created by Slidicon - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/parasol" title="parasol icons">Parasol icons created by Smashicons - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/agriculture" title="agriculture icons">Agriculture icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/penguin" title="penguin icons">Penguin icons created by Mihimihi - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/volcano" title="volcano icons">Volcano icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/tree" title="tree icons">Tree icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/hot-spring" title="hot spring icons">Hot spring icons created by surang - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/mountain" title="mountain icons">Mountain icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/waterfall" title="waterfall icons">Waterfall icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/coffee" title="coffee icons">Coffee icons created by Freepik - Flaticon</a>
*/


    var iconMap = [
      {value: "train", icon: "./assets/symbols/train.png"},
      {value: "beach", icon: "./assets/symbols/beach.png"},
      {value: "penguins", icon: "./assets/symbols/penguin.png"},
      {value: "volcano", icon: "./assets/symbols/volcano.png"},
      {value: "farm", icon: "./assets/symbols/farm.png"},
      {value: "hotspring", icon: "./assets/symbols/hotspring.png"},
      {value: "mountains", icon: "./assets/symbols/mountains.png"},
      {value: "waterfall", icon: "./assets/symbols/waterfall.png"},
      {value: "coffee", icon: "./assets/symbols/coffee.png"},
    ]

    const dateConfig = [
      { days: 120, marker: "x-1" },
      { days: 180, marker: "x-2" },
      { days: 240, marker: "x-3" },
      { days: 300, marker: "x-4" },
      { days: 365, marker: "x-5" }
    ]

    let dateExp: string = "When(" + dateConfig.map(c => `$feature.GapYearDay < ${c.days}, '${c.marker}'`).join() + ", 'x-5')";
    let markerTypeExp: string = `When($feature.Marker=='red', ${dateExp}, $feature.Marker)`;
    let expression;
    if (mode == "ZoomedIn") {
      expression = `When($feature.Scale=='Zoomed-In' || $feature.Scale=='All', ${markerTypeExp}, 'Hidden')`;
    } else {
      expression = `When($feature.Scale=='Zoomed-Out' || $feature.Scale=='All', ${markerTypeExp}, 'Hidden')`
    }

    let uniqueValueInfos =  [
      ...iconMap.map(i => {
        return {
          value: i.value,
          symbol: {
            type: "picture-marker",
            url: i.icon,
            width: picture_size,
            height: picture_size,
          },
          label: i.value
        }
      }),
      {
        value: "Hidden",
        symbol: {
          type: "simple-marker",
          color: [0, 0, 0, 0],
          outline: {
            width: 0.5, color: [0, 0, 0, 0]
          }
        }
      },  {
        value: "hidden",
        symbol: {
          type: "simple-marker",
          color: [0, 0, 0, 0],
          outline: {
            width: 0.5, color: [0, 0, 0, 0]
          }
        },
        label: "hidden"
      },  {
        value: "blue",
        symbol: {
          type: "picture-marker",
          url: "./assets/symbols/pirate-x-5.png",
          width: "16px",
          height: "16px",
        },
        label: "blue"
      }, {
        value: "x-1",
        symbol: {
          type: "picture-marker",
          url: x_1_url,
          width: marker_size,
          height: marker_size,
        },
        label: "Red"
      }, {
        value: "x-2",
        symbol: {
          type: "picture-marker",
          url: x_2_url,
          width: marker_size,
          height: marker_size,
        },
        label: "Red"
      }, {
        value: "x-3",
        symbol: {
          type: "picture-marker",
          url: x_3_url,
          width: marker_size,
          height: marker_size,
        },
        label: "Red"
      }, {
        value: "x-4",
        symbol: {
          type: "picture-marker",
          url: x_4_url,
          width: marker_size,
          height: marker_size,
        },
        label: "Red"
      }, {
        value: "x-5",
        symbol: {
          type: "picture-marker",
          url: x_5_url,
          width: marker_size,
          height: marker_size,
        },
        label: "Red"
      }
    ];

    uniqueValueInfos = uniqueValueInfos.reverse();

    layer.renderer = {
      type: "unique-value",
      valueExpression: expression,
      orderByClassesEnabled: true,
      defaultSymbol: {
        type: "picture-marker",
        url: x_1_url,
        width: marker_size,
        height: marker_size,
      },
      uniqueValueInfos: uniqueValueInfos,
      /*
      visualVariables: [
        {
          type: "size",
          field: "Length",
          stops: [     
            {
              value: 4,
              size: 18,
            },
            {
              value: 7,
              size: 22,
            },
            {
              value: 14,
              size: 32,
            },
            {
              value: 21,
              size: 44,
            },
          ]
        }
      ]*/
    };
  }

  GetLineRenderer(travelMode: "flight" | "land"):any {
    
    let exp = travelMode == "flight" ?
        `When(Find("Flight",$feature.TravelMode)==-1, -1, $feature.GapYearDay < 372, $feature.GapYearDay, -2)` :
        `When(Find("Flight",$feature.TravelMode)!=-1, -1, $feature.GapYearDay < 372, $feature.GapYearDay, -2)`;

    return {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: travelMode == "flight" ? 3 : 2,
        color: [200, 18, 18, 1],
        style: (travelMode == "flight" ? "short-dot" : "solid"),
      },
      visualVariables: [
        {
          type: "color",  
          valueExpression: exp,
          stops: [
            {
              value: -2,
              color: "#0e8de8",
            },
            {
              value: -1,
              color: "transparent",
            },
            {
              value: 0, 
              color: "#F8D1CD", 
            },
            {
              value: 120, 
              color: "#F8D1CD", 
            },
            {
              value: 240,
              color: "#ff0000",
            },
            {
              value: 360, 
              color: "#a30707", 
            }
          ]
        }
      ]
    };

  }

}
