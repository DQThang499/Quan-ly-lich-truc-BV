import { Moment } from 'moment';

export interface INhanVien {
  maNhanVien?: number;
  tenNhanVien?: string;
  maPhongBan?: number;
  dvtt?: number;
  diaChi?: string;
  ngaySinh?: Moment;
  soDienThoai?: string;
  maChucVu?: number;
  maChucDanh?: number;
  gioiTinh?: number;
  trinhDo?: string;
  isAdmin?: number;
  chucNangThuongDung?: string;
  maTinh?: string;
  chungChiHanhNghe?: string;
  chuKyContentType?: string;
  chuKy?: any;
  nhanLucYTeThonBan?: number;
  idTrinhDoCM?: number;
  idDanToc?: number;
  tenTaiKhoan?: string;
  trangThai?: number;
}

export const defaultValue: Readonly<INhanVien> = {};
