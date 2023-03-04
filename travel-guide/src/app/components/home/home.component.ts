import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { LocationService } from 'src/app/service/location.service';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';
import * as _ from 'lodash';

export enum TagEnum {
  none = 0,
  hike = 1,
  historical = 2,
  view = 4,
  experience = 8,
  food = 16
}

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
  images?: string[]
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
  stringTags: string[] = [
    'Hike',
    'Historical',
    'View',
    'Experience',
    'Food'];
  tagFilter: boolean[] = [false, false, false, false, false];


  locations: LocationDto[] = [];
  listLocations: LocationDto[] = [];
  infoWindowContent: any;

  isDrawerOpen: boolean = true;
  textFilter: string = '';

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

  onMapBoundsChangedDebounced = _.debounce(this.onMapBoundsChanged.bind(this), 500);
  onMapBoundsChanged() {
    const bounds = this.map?.getBounds();
    this.handleSetListLocations(this.textFilter, bounds)
  }

  loadLocations() {
    this.locationService.getAllLocations().subscribe(res => {
      this.locations = res;
      this.listLocations = res;
      this.tagFilter = [false, false, false, false, false]
      this.textFilter = '';
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

  getTagsAsStringArray(tags: number) {
    let result: string[] = [];
    this.stringTags.forEach((tag, index) => {
      if ((tags >> index) & 1) {
        result.push(tag);
      }
    })

    return result;
  }

  getImageBase64String(image: string) {
    return "data:image/jpeg;base64, " + image;
  }

  onClickTagButton(index: number) {
    this.tagFilter[index] = !this.tagFilter[index];
    this.handleSetListLocations(this.textFilter);
  }

  onDrawerButtonClick() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  centerSelf() {
    if (this.currentPosition) {
      this.map?.panTo(this.currentPosition);
    }
  }

  onLocationSelect = (location: LocationDto | null) => {
    if (!location) return;
    this.map?.panTo({ lat: location.latitude, lng: location.longitude });
  }

  handleSearchBoxChange = (event: any) => {
    this.handleSetListLocations(event.target.value);
  }

  handleSetListLocations = (textFilterValue: string | null, bounds: google.maps.LatLngBounds | null = null) => {
    let shouldConsiderTags = true;
    if (!bounds) {
      bounds = this.map?.getBounds();
    }
    if (!this.tagFilter.some(Boolean)) {
      if (textFilterValue?.trim().length === 0 && !bounds) {
        this.listLocations = this.locations;
        return;
      } else {
        shouldConsiderTags = false;
      }
    }
    let newListLocations = this.locations.filter((location, index) => {
      for (let i = 0; i < this.tagFilter.length; i++) {
        if (!shouldConsiderTags || ((location.tags >> i) & 1 && this.tagFilter[i])) {
          let filter: string;
          if (textFilterValue != null) {
            filter = textFilterValue;
          } else {
            filter = this.textFilter;
          }
          if (filter.trim() == '') {
            return true;
          } else {
            if (location.name.toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }
          }
        }
      }
      return false;
    });
    newListLocations = newListLocations.filter(location => bounds!.contains({ lat: location.latitude, lng: location.longitude }))

    this.listLocations = newListLocations;
  }

  openWaze(location: LocationDto) {
    const navUrl = `https://www.waze.com/en-GB/live-map/directions?navigate=yes&to=ll.${this.currentPosition === null ? '' : this.currentPosition.lat + ',' + this.currentPosition.lng}&from=ll.${location.latitude + '%2C' + location.longitude}`;
    window.open(navUrl, '_blank');
  }

  openGoogleMaps(location: LocationDto) {
    const navUrl = `https://www.google.com/maps?saddr=${this.currentPosition === null ? '' : this.currentPosition.lat + ',' + this.currentPosition.lng}&daddr=${location.latitude + ',' + location.longitude}`
    window.open(navUrl, '_blank');
  }
}
