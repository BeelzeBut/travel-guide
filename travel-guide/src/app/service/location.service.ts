import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocationDto, NewLocationDto } from '../components/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  constructor(private http: HttpClient, private toastr: ToastrService) { }
  private apiUrl = 'https://travel-guide.azurewebsites.net/api/location/';

  getAllLocations() {
    return this.http.get<LocationDto[]>(this.apiUrl + 'getAllLocations');
  }

  getLocationById(locationId: string) {
    return this.http.get<LocationDto>(this.apiUrl + locationId);
  }

  createLocation(location: NewLocationDto) {
    return this.http.post(this.apiUrl + 'create', location, { observe: 'response' });
  }

  updateLocation(location: NewLocationDto, locationId: string) {
    return this.http.put(this.apiUrl + 'update/' + locationId, location, { observe: 'response' });
  }

  deleteLocation(locationId: string) {
    return this.http.delete(this.apiUrl + 'delete/' + locationId, { observe: 'response' });
  }
}
