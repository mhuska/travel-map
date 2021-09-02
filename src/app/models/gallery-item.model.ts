import { IWPPost } from "./post.model";

export interface IGalleryItem {
    id: number;
    type: "postcard" | "media";
    item: IWPPost | null;
}