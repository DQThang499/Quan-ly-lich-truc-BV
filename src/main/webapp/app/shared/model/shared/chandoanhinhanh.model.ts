export interface IChanDoanHinhAnh {
  dvtt?: number;
  id?: string;
  maCdha?: number;
  soPhieuCdha?: string;
  thongtinCdha?: {
    maCdha?: number;
    dvtt?: number;
    tenCdha?: string;
    hoatdong?: number;
    trangthaiBhyt?: number;
    loaiCdha?: {
      maLoaiCdha?: number;
      dvtt?: number;
      tenLoaiCdha?: string;
      motaLoaiCdha?: string;
      hoatdong?: number;
    };
    dvtCdha?: string;
    dvnghiepvuCdha?: string;
  };
  chiDinhCdha?: {
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
    ngayChanDoan?: string;
    loiDanBacSi?: string;
    soPhieuCdha?: string;
    dvtt?: number;
    sttDieutri?: number;
    sttBenhan?: string;
    sttDotdieutri?: number;
    sovaovien?: number;
    sovaovienDt?: number;
  };
  moTa?: string;
  ketQua?: string;
  bhytkchi?: number;
  soLuong?: number;
  donGia?: number;
  sovaovien?: number;
  sttDieutri?: number;
  sttDotdieutri?: number;
  daThanhToan?: number;
  daChanDoan?: number;
  thanhTien?: number;
  nam?: number;
  ttThanhtoan?: number;
  mabenhnhan?: number;
  ngayTao?: string;
  bacsiChidinh?: string;
  bacsiThuchien?: string;
  mauSieuam?: string;
  maMausieuam?: string;
  slCophim_1318?: number;
  slCophim_1820?: number;
  slCophim_2430?: number;
  slCophim_3040?: number;
  chandoan?: string;
  ngayTattoan?: string;
  ngayThucHien?: string;
  sovaovienDt?: number;
  ngayChiDinhCt?: string;
  idDieutri?: number;
  thangsauso?: number;
  donGiaBhyt?: number;
  donGiaKoBhyt?: number;
  thanhTienBhyt?: number;
  thanhTienKoBhyt?: number;
  nguoiThucHien?: string;
  tienNgoaiBhyt?: number;
  solanchup?: number;
}
