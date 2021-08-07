import { IBenhNhan } from './benh-nhan.model';

export interface IPhienKham {
  id?: number;
  benhNhan?: IBenhNhan;
  maBenh?: string;
  tenBenh?: string;
  maLyDoVaoVien?: number;
  ngayVao?: string;
  ngayRa?: string;
  sovaovien?: number;
  sovaovienNoi?: number;
  sovaovienDtNoi?: number;
  // CHANDOANBENH: string;
  coSoKhamChuaBenh?: {
    idDonVi?: string;
    tenDonvi?: string;
  };
  trieuchungls?: string;
  tenBacSyKham?: string;
  icdNguyenNhan?: string;
  chanDoanYHocCoTruyen?: string;
  maBn?: number;
  maBenhkhac?: number;
  tenPhongHoanTatKham?: string;
  maThe?: string;
  gtTheTu?: string;
  gtTheDen?: string;
  maDkbd?: string;
  nhombhyt?: string;
  mucHuong?: string;
  doiTuongBaoHiemYTe?: {
    tenDoiTuongBhyt?: string;
  };
}
