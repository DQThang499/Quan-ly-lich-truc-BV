export interface ILichTruc {
  maLT?: number;
  thang?: number;
  nam?: number;
  tenPhongBan?: string;
  tenDonVi?: number;
  trangThaiDuyet?: TrangThaiDuyet;
  tenNguoiLap?: string;
  thoiGianLap?: Date;
  tenNguoiCapNhat?: string;
  thoiGianCapNhat?: Date;
  tenNguoiDuyet: string;
  thoiGianDuyet: Date;
}

export enum TrangThaiDuyet {
  DA_DUYET = 'Đã duyệt',
  CHUA_DUYET = 'Chưa duyệt',
  HUY_DUYET = 'Hủy duyệt'
}
