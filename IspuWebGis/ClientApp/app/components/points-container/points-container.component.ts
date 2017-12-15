import { Component, Input } from '@angular/core';
import { EsriMapService } from '../esri-map/esri-map.service';
import { Point } from "../../classes/point";
import { AppComponent } from '../app/app.component';
import {GeocoderService} from "../../services/geocoder.service";

import {GeocodeParams} from "../../classes/geocode-params";


@Component({
    selector: 'points-container',
    templateUrl: './points-container.component.html',
    styleUrls: ['./points-container.component.css']
})

export class PointsContainerComponent {
    @Input() points: Array<Point>; // here array of markers
    constructor(private esriMap: EsriMapService, private appComp: AppComponent, private geocodeService: GeocoderService) { }

    async addPoint() { 
        var x = <number>this.appComp.center.longitude;
        var y = <number>this.appComp.center.latitude;
        this.points = await this.esriMap.addMarkers(x, y); // array of three markers` points (type: Point)
        this.points = this.getPointsReverseGeoCode(this.points);
    }

    async makeWay() {
        this.esriMap.connectMarkers(this.points);
    }

    getPointsReverseGeoCode(points: Point[]): Point[] { //sample comment
        console.log(points.length);
        for (var i = 0; i < points.length; i++) {
            let loc = points[i].latitude + "," + points[i].longitude; //sample comment 2
            let param = new GeocodeParams(loc);
            let index = i;
            this.geocodeService.getReverseGeocode(param).subscribe((data) => {
                if (data.address)

                    points[index].address = data.address.ShortLabel;
            });

        }
        return points;
    }

    onRedrawAsked(point: Point) {
        for (var i = 0, l = this.points.length; i < l; i++) {
            if (this.points[i].id == point.id) {               
                this.points[i] = point;
                this.esriMap.updateMarkers(this.points);
                break;
            }
        }
            //this.esriMap.updateMarkers(this.points);
            //this.points = this.getPointsReverseGeoCode(this.points);
        
    }

}