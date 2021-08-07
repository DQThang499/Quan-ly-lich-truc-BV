import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';

export const AUTH_TOKEN_KEY = 'authenticationToken';
export const ROLE_KEY = 'vaiTro';
export interface IRole {
  key: string;
  name: string;
}

export const ROLES = {
  ADMIN: {
    key: 'lichtruc_admin',
    name: 'Admin'
  },
  GIAM_DOC_DV: {
    key: 'lichtruc_giamdoc',
    name: 'Giám đốc đơn vị'
  },
  LANH_DAO_DV: {
    key: 'lichtruc_lanhdao',
    name: 'Quản lý đơn vị'
  },
  TRUONG_PHONG_KHTH: {
    key: 'lichtruc_truongpkhth',
    name: 'Trưởng phòng KHTH'
  },
  CAN_BO_PHONG_KHTH: {
    key: 'lichtruc_canbopkhth',
    name: 'Cán bộ phòng KHTH'
  },
  TRUONG_PHONG_BAN: {
    key: 'lichtruc_truongpb',
    name: 'Trưởng phòng ban'
  },
  DIEU_DUONG_TRUONG: {
    key: 'lichtruc_ddtruong',
    name: 'Điều dưỡng trưởng'
  },
  CAN_BO_BV: {
    key: 'lichtruc_canbobv',
    name: 'Cán bộ bệnh viện'
  }
};

export const isLogged = (): boolean => {
  const token = EHRSessionStorage.get(AUTH_TOKEN_KEY);
  return !!token;
};

export const getUserRole = () => (isLogged ? EHRSessionStorage.get(ROLE_KEY) : null);

export const getUserRoleName = () => (isLogged ? Object.values(ROLES).find(r => r.key === getUserRole()).name : '');

export const hasAnyRole = roles => roles.findIndex(role => role.key === getUserRole()) !== -1;
