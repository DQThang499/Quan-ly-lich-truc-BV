import { Moment } from 'moment';
import { IPhienKham } from 'app/shared/model/shared/phien-kham.model';

export const enum DoiTuong {
  BHYT = 'BHYT',
  KBHYT = 'KBHYT'
}

export interface IBenhNhan {
  id?: number;
  maBenhNhan?: number;
  tenBenhNhan?: string;
  soVaoVien?: number;
  soVaoVienDt?: number;
  tuoi?: number;
  capCuu?: boolean;
  ngaySinh?: Moment;
  gioiTinh?: number;
  doiTuong?: DoiTuong;
  soTheBHYT?: string;
  // <<<<<<< HEAD
  soBHYT?: string;
  // =======
  // >>>>>>> 6b257470166a1c0b858bff3e23133cd09dd92fb9
  soPhieu?: string;
  soPhieuBarcode?: string;
  phanHe?: string;
  stt?: string;
  chanDoan?: string;
  coBHYT?: boolean;
  khoaChiDinh?: string;
  tenKhoaChiDinh?: string;
  nguoiLayMau?: string;
  ngayLayMau?: string;
  ngayChayMau?: string;
  nguoiThucHien?: string;
  phongChiDinh?: string;
  tenPhongChiDinh?: string;
  phongXetNghiem?: string;
  thoiGianLayMau?: string;
  bacSiChiDinh?: string;
  // <<<<<<< HEAD
  diaChi?: string;
  ngayIn?: string;
  coKetQua?: boolean;
  daDuyet?: boolean;
  soLanIn?: number;
  namSinh?: number;
  // =======
  // >>>>>>> 6b257470166a1c0b858bff3e23133cd09dd92fb9
  listPhienKham?: ReadonlyArray<IPhienKham>;
}

export const defaultValue: Readonly<IBenhNhan> = {};
