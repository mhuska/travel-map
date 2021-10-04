import { IGraphic } from "./graphic.model";
import { IWPPost } from "./post.model";
import { HttpClient } from '@angular/common/http';

const locationUrl: string = "https://slowcamino.com/travel-map/assets/server-php/location.php";

export class MapLocation {

    Title: string = "";
    Image: string = "";
    Scale: string = "";
    Marker: string = "";
    Articles: IWPPost[] = [];
    Gallery: IWPPost[] = [];
    Content: string = "";
    Date: Date;
    PostId: number;

    constructor(private graphic: IGraphic, private http: HttpClient) {

        this.Title = this.prop("Title");
        this.Scale = this.prop("Scale");
        this.Marker = this.prop("Marker");
        this.PostId = +this.prop("PostId");
        this.Date = new Date(this.prop("Date"));

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
                    console.log(result);
                    this.Articles = result.Articles ? JSON.parse(result.Articles) : [];
                    this.Gallery = result.Gallery ? JSON.parse(result.Gallery) : [];
                    this.Content = result.Content;
                    this.Image = result.Image;

                }
            });

    }

    private prop(property: string): string {
        return this.graphic.attributes[property] ? this.graphic.attributes[property] : "";
    }

}