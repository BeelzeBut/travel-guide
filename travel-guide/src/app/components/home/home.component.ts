import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { LocationService } from 'src/app/service/location.service';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';

export enum TagEnum {
  none = 0,
  hike = 1,
  historical = 2,
  view = 4,
  experience = 8,
  food = 16
}

export const stringTags = [
  'Hike',
  'Historical',
  'View',
  'Experience',
  'Food'];

export function convertToTags(tagNumber: number): number[] {
  const tags: number[] = [];
  let currentTagValue = 1; // start with the first tag value

  while (tagNumber > 0) {
    if ((tagNumber & 1) === 1) { // check if the current tag is included in the number
      tags.push(currentTagValue);
    }
    currentTagValue *= 2; // shift to the next tag value
    tagNumber >>= 1; // remove the current tag from the number
  }

  return tags;
}

export interface NewLocationDto {
  name: string,
  tags: TagEnum,
  description: string,
  latitude: number,
  longitude: number,
  userId: string,
  images?: File[]
}

export interface LocationDto {
  id: string,
  name: string,
  tags: TagEnum,
  description: string,
  latitude: number,
  longitude: number,
  username: string,
  userId: string,
  images: string[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  currentPosition!: google.maps.LatLngLiteral | null;
  zoom: number = 15;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    styles: [{
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off",
        }
      ],
    },
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off",
        }
      ],
    }],
    mapTypeControl: false,
    streetViewControl: false,

  }

  locations: LocationDto[] = [];
  infoWindowContent: any;

  constructor(private locationService: LocationService, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.loadLocations();

    navigator.geolocation.getCurrentPosition((position) => {
      this.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.center = this.currentPosition;
    });
  }

  loadLocations() {
    this.locationService.getAllLocations().subscribe(res => {
      this.locations = res;
    });
  }

  mapDoubleClick(event: google.maps.MapMouseEvent) {
    const dialog = this.dialog.open(LocationDialogComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: {
        latitude: event.latLng?.lat().toFixed(6),
        longitude: event.latLng?.lng().toFixed(6)
      }
    });

    dialog.afterClosed().subscribe(res => {
      this.loadLocations();
    })

  }

  openInfo(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  canEditLocation(userId: string) {
    return this.authService.getIsAdmin() || this.authService.getUserId() === userId;
  }

  editLocation(location: LocationDto) {
    const dialog = this.dialog.open(LocationDialogComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: {
        location: location
      }
    });

    dialog.afterClosed().subscribe(res => {
      this.loadLocations();
    })
  }

  deleteLocation(locationId: string) {
    this.locationService.deleteLocation(locationId).subscribe(res => {
      this.loadLocations();
    })
  }

  getTags(tags: number) {
    return stringTags.map((tag, index) => {
      if ((tags >> index) & 1) {
        return tag + " · ";
      }

      return "";
    }).join('').slice(0, -3)
  }
}
