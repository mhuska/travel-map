import { IGraphic } from "./graphic.model";
import { IWPPost } from "./post.model";
import { HttpClient } from '@angular/common/http';

const locationUrl: string = "https://slowcamino.com/travel-map/assets/server-php/location.php";

export class MapLocation {

    Title: string = "";
    Image: string = "";
    Scale: string = "";
    Marker: string = "";
    FlyTo: boolean = false;
    Articles: IWPPost[] = [];
    Gallery: IWPPost[] = [];
    Content: string = "";
    Visited: string = null;
    Date: Date;
    PostId: number;
    Latitude: number;
    Longitude: number;
    
    OnZoom: (geometry: any) => void;

    constructor(private graphic: IGraphic, private http: HttpClient) {


        this.Title = this.prop("Title");
        this.Scale = this.prop("Scale");
        this.Marker = this.prop("Marker");
        this.PostId = +this.prop("PostId");
        this.Date = new Date(this.prop("Date"));
        this.Latitude = graphic.geometry.y;
        this.Longitude = graphic.geometry.x;

        //Call the location api to get the rest of the data
        let opt = {
            observe: <"response">"response",
            reportProgress: false,
            responseType: <"json">"json",
        };

        this.http.get(locationUrl + "?id=" + this.PostId.toString(), opt)
            .subscribe({
                next: (res) => {
                    let result: any = res.body;
                    this.Articles = result.Articles ? JSON.parse(result.Articles) : [];
                    this.Gallery = result.Gallery ? result.Gallery : [];
                    this.FlyTo = result.FlyTo == 1 ? true : false;
                    this.Content = result.Content;
                    this.Visited = result.Visited;
                    this.Image = result.Image;

                }
            });

    }

    private prop(property: string): string {
        return this.graphic.attributes[property] ? this.graphic.attributes[property] : "";
    }

    public ZoomTo() {
        this.OnZoom(this.graphic.geometry);
    }


}