export interface IServiceDetail {
  id: string;
  url: string;
}

export interface IServiceItem {
  lng: number;
  name: string;
  parent_geo_code: string;
  services: IServiceDetail[];
  type: string;
  lat: number;
}
