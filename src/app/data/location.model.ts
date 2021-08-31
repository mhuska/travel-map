import { IGraphic } from "./graphic.model";

export class MapLocation {

    Title: string = "";
    Image: string = "";
    Scale: string = "";
    Marker: string = "";
    ArticleURL: string = "";
    Content: string = "";

    constructor(private graphic: IGraphic) {

        this.Title = this.prop("Title");
        this.Image = this.prop("Image");
        this.Scale = this.prop("Scale");
        this.Marker = this.prop("Marker");
        this.ArticleURL = this.prop("ArticleURL");
        this.Content = this.prop("Content");

    }

    private prop(property: string): string {
        return this.graphic.attributes[property] ? this.graphic.attributes[property] : "";
    }
}