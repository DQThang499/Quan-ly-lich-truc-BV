export interface IDichVu {
  dvtt?: number;
  maDv?: number;
  moTa?: string;
  ketQua?: string;
  bhytkchi?: number;
  sovaovien?: number;
  sttDieutri?: number;
  sttDotdieutri?: number;
  soPhieuDichVu?: string;
  thongtinDichVu?: {
    maDv?: number;
    dvtt?: number;
    tenDv?: string;
    trangthai?: number;
    loaiDichVu?: {
      maLoaiDichVu?: string;
      dvtt?: number;
      tenLoaiDichVu?: string;
      hoatdong?: number;
      uutien?: number;
    };
    dvtDv?: string;
    giaDv?: number;
  };
  chiDinhDichVu?: {
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
    kyThuatVien?: string;
    ngayTao?: string;
    soPhieuDv?: string;
    dvtt?: number;
    sttDieutri?: number;
    sttBenhan?: string;
    sttDotdieutri?: number;
    sovaovien?: number;
    sovaovienDt?: number;
  };
  soLuong?: number;
  donGia?: number;
  thanhTien?: number;
  ngayTao?: string;
}
