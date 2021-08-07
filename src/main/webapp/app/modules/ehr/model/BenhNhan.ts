import { IPhienKham } from 'app/shared/model/shared/phien-kham.model';

export interface IBenhNhan {
  maBn?: string;
  // maHeThong?: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh?: number;
  diaChi?: string;
  maThe?: string;
  gtTheTu?: string;
  gtTheDen?: string;
  coSoKhamChuaBenh?: {
    idDonVi?: number;
    tenDonvi?: string;
  };
  donViTrucThuoc?: {
    idDonVi?: string;
    tenDonvi?: string;
  };
  mucHuong?: string;
  selectedPhienKham?: Readonly<IPhienKham>;
  maLk?: string;
  sovaovien?: number;
  sovaovienNoi?: number;
  sovaovienDtNoi?: number;
  tuoiBenhnhan?: string;
  tenBenh?: string;
  tenPhongHoanTatKham?: string;
  maLoaiKhamChuaBenh?: number;
  benhAn?: {
    dvtt?: string;
    sttBenhan?: string;
    loaibenhan?: string;
  };
}
