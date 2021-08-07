export interface IDuocVatTu {
  stt?: number;
  maThuoc?: string;
  tenThuoc?: string;
  hoatchatThuoc?: string;
  donViTinh?: string;
  hamLuong?: string;
  duongDung?: string;
  lieuDung?: string;
  nghiepVu?: string;
  soLuong?: number;
  sttDotdieutriNoi?: string;
  ngayYlenh?: string;
  khoa?: {
    maPhongban?: string;
    tenPhongban?: string;
  };
  bacSi?: {
    id?: number;
    tenNhanvien?: string;
  };
}
