import { IGraphic } from "./graphic.model";
import { IWPPost } from "./post.model";

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

    constructor(private graphic: IGraphic) {

        this.Title = this.prop("Title");
        this.Scale = this.prop("Scale");
        this.Marker = this.prop("Marker");
        this.PostId = +this.prop("PostId");
        this.Date = new Date(this.prop("Date"));

        
        //this.Image = this.prop("Image");
        //this.Articles = this.array_prop("Articles");
        //this.Gallery = this.array_prop("Gallery");
        //this.Content = this.prop("Content");

        console.log(this.graphic)

    }

    private prop(property: string): string {
        return this.graphic.attributes[property] ? this.graphic.attributes[property] : "";
    }

    private array_prop(property: string): any[] {
        return this.graphic.attributes[property] ? JSON.parse(this.graphic.attributes[property]) : [];
    }
}