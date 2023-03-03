import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'enumIntToString',
})
export class EnumIntToDescriptionPipe implements PipeTransform {
    transform(value: number, enumName: any): string {
        return Object.values(enumName)[value] as string;
    }
}