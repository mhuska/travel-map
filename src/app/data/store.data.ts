import { Injectable } from "@angular/core";
import { IGraphic } from "../models/graphic.model";
import { MapLocation } from "../models/location.model";
import { HttpClient } from '@angular/common/http';

@Injectable() 
export class Store {

    LocationHistory: MapLocation[] = [];
    
    CurrentLocation: MapLocation | null = null;

    constructor(private http: HttpClient) {

    }

    SetLocation(graphic: IGraphic) {
        
        if (graphic) {
            let location: MapLocation = new MapLocation(graphic, this.http);
            this.LocationHistory.push(location);
            this.CurrentLocation = location;
        } else {
            this.CurrentLocation = null;
        }

        console.log(this.CurrentLocation)
    }

}