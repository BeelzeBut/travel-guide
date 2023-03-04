import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { LocationService } from 'src/app/service/location.service';
import { convertToTags, LocationDto, NewLocationDto, TagEnum } from '../home/home.component';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';

export const toBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})
export class LocationDialogComponent {
  constructor(private builder: FormBuilder, private toastr: ToastrService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<UpdateDialogComponent>) { }

  tags = [TagEnum.experience, TagEnum.food, TagEnum.hike, TagEnum.historical, TagEnum.view];
  isEdit: boolean = false;
  imageFiles: File[] = [];

  ngOnInit(): void {
    if (this.data.location) {
      this.isEdit = true;
      this.locationForm.setValue({
        name: this.data.location.name,
        description: this.data.location.description,
        tags: convertToTags(this.data.location.tags) as any,
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude
      })
    }
    if (this.data.latitude && this.data.longitude) {
      this.isEdit = false;
      this.locationForm.patchValue({
        latitude: +this.data.latitude,
        longitude: +this.data.longitude
      })
    }

    this.locationForm.controls['latitude'].disable();
    this.locationForm.controls['longitude'].disable();
  }

  locationForm = this.builder.group({
    name: this.builder.control('', Validators.required),
    description: this.builder.control('', Validators.required),
    tags: this.builder.control(0, Validators.min(1)),
    latitude: this.builder.control<number>(0, Validators.required),
    longitude: this.builder.control<number>(0, Validators.required),
  });

  saveLocation() {
    this.locationForm.controls['latitude'].enable();
    this.locationForm.controls['longitude'].enable();
    if (this.locationForm.valid && (this.isEdit || this.imageFiles.length > 0)) {
      const bodyFormData = new FormData();

      bodyFormData.append('name', this.locationForm.value.name!);
      bodyFormData.append('description', this.locationForm.value.description!);
      bodyFormData.append('tags', (((this.locationForm.value.tags! as unknown) as number[]).reduce((prev, current) => prev | current) as TagEnum).toString());
      bodyFormData.append('latitude', this.locationForm.value.latitude!.toString());
      bodyFormData.append('longitude', this.locationForm.value.longitude!.toString());
      bodyFormData.append('userId', this.authService.getUserId());

      this.imageFiles.forEach((image: File, index: number) => {
        bodyFormData.append(`images`, image, image.name);
      });

      if (!this.isEdit) {
        this.locationService.createLocation(bodyFormData).subscribe(res => {
          this.dialog.close();
        });
      } else {
        const newLocation: NewLocationDto = {
          name: this.locationForm.value.name!,
          description: this.locationForm.value.description!,
          latitude: typeof this.locationForm.value.latitude! === 'string' ? +this.locationForm.value.latitude! : this.locationForm.value.latitude!,
          longitude: typeof this.locationForm.value.longitude! === 'string' ? +this.locationForm.value.longitude! : this.locationForm.value.longitude!,
          tags: ((this.locationForm.value.tags! as unknown) as number[]).reduce((prev, current) => prev | current) as TagEnum,
          userId: this.authService.getUserId(),
        }
        this.locationService.updateLocation(newLocation, this.data.location.id).subscribe(res => {
          this.dialog.close();
        });
      }
    } else {
      this.toastr.warning('Please enter valid data!')
    }
  }

  getOptionLabel(option: TagEnum) {
    switch (option) {
      case TagEnum.hike:
        return "Hike";
      case TagEnum.historical:
        return "Historical";
      case TagEnum.experience:
        return "Experience";
      case TagEnum.food:
        return "Food";
      case TagEnum.view:
        return "View";
      default:
        throw new Error("Unsupported option");
    }
  }

  async onFileChange(event: any) {
    this.imageFiles = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.imageFiles.push(event.target.files[i]);
    }
  }

  getImageNames() {
    let fileNames: string = '';
    this.imageFiles.forEach(file => {
      fileNames += (file.name + ', ')
    });

    return fileNames.substring(0, fileNames.length - 2);
  }
}