import { Organization } from "../organizations/types";

export type User = {
  id: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  location: string;
  organizationId: string;
  gender: "male" | "female";
  role: "admin" | "moderator" | "resident" | "student";
  status: "active" | "inactive";

  createdAt?: Date;
  updatedAt?: Date;
};
export type Admin = {
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar_url: string;
  isActive: true;
  deleted_at: null;
  deleted_by: null;
  created_by: null;
  update_by: null;
  is_registered_with_google: false;
  avatar: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  id: string;
  phone: string;
  email: string;
};
export type Supervision = {
  avatar: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  isActive: boolean;
  last_name: string;
  organizationId: string[];
  update_by: string;
  updated_at: string;
};
export type Manager = {
  avatar: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  isActive: boolean;
  last_name: string;
  province_id: string[];
  update_by: string;
  updated_at: string;
};
export type TypeAddNewAdmin = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};
export type TypeAddNewSupervision = {
  first_name: string;
  last_name: string;
  email: string;
  province_ids: string[];
};
export type TypeUpdateSupervision = {
  params: {
    id: string;
  };
  body: {
    first_name?: string;
    last_name?: string;
    email?: string;
    province_ids?: string[];
    isActive?: boolean;
  };
};
export type TypeAddNewManager = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organizationId: string;
};
export type Province = {
  isActive: boolean;
  name: string;
  _id: string;
};
export type TypeAddNewstudents = {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  organizationId: string;
};
export type TypeupdateNewstudents = {
  params: {
    id: string;
  };
  body: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    organizationId?: string;
    isActive: boolean;
  };
};

export type Student = {
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  organizationId: Organization;
  avatar: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  current_refresh_token: string;
  achievements: Array<any>;
  registration_competition: Array<any>;
  _id: string;
  id: string;
  isActive: boolean;
  deleted_at: string;
  deleted_by: string;
  created_by: string;
  update_by: string;
};
export type TypeAddNewCitizens = {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
};
export type TypeupdateNewCitizens = {
  params: {
    id: string;
  };
  body: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    organizationId?: string;
    isActive: boolean;
  };
};

export type Citizens = {
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  organizationId: Organization;
  avatar: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  current_refresh_token: string;
  achievements: Array<any>;
  registration_competition: Array<any>;
  _id: string;
  id: string;
  isActive: boolean;
  deleted_at: string;
  deleted_by: string;
  created_by: string;
  update_by: string;
};
