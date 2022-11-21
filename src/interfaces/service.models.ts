export interface IServiceDetail {
  id: string;
  url: string;
}
export enum ServiceSectionEnum {
  AREE,
  RICARICA,
  METANO,
  CAMPER,
}

export const serviceBySection = {
  [ServiceSectionEnum.AREE]: ["all"],
  [ServiceSectionEnum.RICARICA]: ["p-ricaricaelet"],
  [ServiceSectionEnum.METANO]: ["metano", "gpl"],
  [ServiceSectionEnum.CAMPER]: ["scaricocamper"],
};

export interface IServiceItem {
  lng: number;
  name: string;
  parent_geo_code: string;
  services: IServiceDetail[];
  type: string;
  lat: number;
}
