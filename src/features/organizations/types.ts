export interface Organization {
  province_id?: [];
  _id?: string;
  isActive?: boolean;
  name: string;
  province?: string;
  id: string;
  password: string;
  email: string;
  image: string;
  description: string;
}
export interface TypeAddNewOrganization {
  name: string;
  province_id: string;
}
export interface TypeUpdateOrganization {
  params: { id: string };
  body: {
    name: string;
    province_id: string;
  };
}
