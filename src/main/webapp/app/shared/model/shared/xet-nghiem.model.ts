export interface IXetNghiem {
  id?: string;
  dvtt?: number;
  maXetNghiem?: number;
  thongTinXetNghiem?: {
    maXetnghiem?: 548;
    dvtt?: string;
    tenXetnghiem?: string;
    hoatdong?: number;
    trangthaiBhyt?: number;
    loaiXetNghiem?: {
      maLoaiXetnghiem?: number;
      dvtt?: number;
      tenLoaiXetnghiem?: string;
      motaLoaiXetnghiem?: string;
      hoatdong?: 1;
    };
    chiSoBinhThuong?: number;
    dvtXetnghiem?: string;
    dvnghiepvuXetnghiem?: string;
  };
  chiDinhXetNghiem?: {
    id?: string;
    nguoiChiDinh?: {
      id?: number;
      tenNhanvien?: string;
      chucDanhNhanVien?: {
        maChucdanh?: number;
        tenChucdanh?: string;
        motaChucdanh?: string;
      };
    };
    ngayChiDinh?: string;
    bacSiDieuTri?: {
      id?: number;
      tenNhanvien?: string;
      chucDanhNhanVien?: {
        maChucdanh?: number;
        tenChucdanh?: string;
        motaChucdanh?: string;
      };
    };
    kyThuatVien?: null;
    ngayLayMau?: string;
    ketLuanTong?: string;
    soPhieuXn?: string;
    dvtt?: string;
    sttDieutri?: string;
    sttBenhan?: string;
    sttDotdieutri?: string;
    sovaovien?: number;
    sovaovienDt?: number;
  };
  soPhieuXn?: string;
  moTa?: string;
  ketQua?: string;
  bhytkchi?: number;
  sovaovien?: number;
  sttDieutri?: number;
  sttDotdieutri?: number;
  sttBenhan?: string;
  soLuong?: number;
  donGia?: number;
  daThanhToan?: number;
  daXetNghiem?: number;
  thanhTien?: number;
  nam?: number;
  ttThanhtoan?: number;
  mabenhnhan?: number;
  ngayTao?: string;
  chisocon?: number;
  idChisocha?: number;
  ngayTattoan?: string;
  coKetqua?: number;
  ngayChiDinhCt?: string;
  donGiaBhyt?: number;
  donGiaKoBhyt?: number;
  thanhTienBhyt?: number;
  thanhTienKoBhyt?: number;
}
