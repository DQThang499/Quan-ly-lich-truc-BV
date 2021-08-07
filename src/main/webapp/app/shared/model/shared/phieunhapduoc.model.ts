import { Moment } from 'moment';

export interface IPhieuNhapDuoc {
  SOPHIEUNHAP?: string;
  DVTT?: string;
  SOHOADON?: number;
  NGAYHOADON?: Moment;
  VAT?: number;
  NGAYNHAP?: Moment;
  SOLUUTRU?: string;
  MANHACC?: number;
  MADONVINHAN?: number;
  MANGUOINHAN?: number;
  NGUOITAO?: number;
  DONGY?: number;
  TENNHACC?: string;
  SOHOPDONG?: string;
  GHICHU?: string;
  THANHTIEN?: number;
}

export const defaultValue: Readonly<IPhieuNhapDuoc> = {};
