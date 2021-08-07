import React, { Component } from 'react';
import moment from 'moment';
import { Button, List, Modal, Tag } from 'antd';
import { Row } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import DieuChinhLich from './dieuchinhlich';
import { forwardData, toggleModalDieuChinh } from 'app/shared/reducers/lichtruc/dieuchinhlich';
import Fade from 'react-reveal/Fade';
import RoleBase from 'app/modules/component/rolebase';
import { IRole, ROLES } from 'app/shared/util/auth-utils';
import { trangThaiDuyetContants } from 'app/modules/constants/trangthai';

moment.locale('vi');
export const weekDays = moment.weekdays(true); // thư viện appjs weekdays
const weeks = [0, 1, 2, 3, 4, 5];
const coQuyenLapLich: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.DIEU_DUONG_TRUONG,
  ROLES.TRUONG_PHONG_BAN,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.CAN_BO_PHONG_KHTH
];

export interface ILichThangProps extends StateProps, DispatchProps {
  drawLichTruc: any;
  autoScheduled: any;
  inLich: any;
}

class LichThang extends Component<ILichThangProps> {
  private btnSuaClick = async cell => {
    await this.props.forwardData(cell);
    await this.props.toggleModalDieuChinh(true);
  };

  componentDidMount(): void {
    this.props.drawLichTruc();
  }

  private getTen = (hoVaTen: string): string => {
    const arr = hoVaTen.trim().split(' ');
    return arr[arr.length - 1];
  };

  private cellDataRender = (cell, lanhDao) => {
    const lichtruc = this.props;
    const caTruc = {
      NGAY: 'Ngày',
      DEM: 'Đêm',
      FULL: 'Cả ngày'
    };
    const temp = Object.keys(caTruc).map(ca => {
      const dsNVTheoCa = cell.data.filter(row => row.caTruc === ca);
      let kq;
      if (dsNVTheoCa.length > 0) {
        const chucDanhArr = lanhDao ? ['LANH_DAO'] : ['BAC_SI', 'DIEU_DUONG', 'KY_THUAT_VIEN', 'HO_LY'];
        const chiTietLTArr = chucDanhArr.map(chucDanh => dsNVTheoCa.find(value => value.chucDanhTruc === chucDanh));
        const titile = lanhDao ? ['LĐ'] : ['BS', 'ĐD', 'KTV', 'HL'];
        kq = titile.map((value, index) => (
          <div key={index} className="p-1">
            <strong className="p-1">{value}: </strong>
            <span className="p-1">
              {chiTietLTArr[index] === undefined ?
                '' : this.getTen(chiTietLTArr[index].nhanVienPhanCong.tenNhanVien) /*+ '-- CBTT:' + this.getTen(chiTietLTArr[index].nhanVienThucTe.tenNhanVien)*/ }
            </span>
          </div>
        ));
      } else kq = '';
      return kq === '' ? (
        ''
      ) : (
        <List.Item key={ca} className="d-block">
          <div className="text-center">
            <strong>{caTruc[ca]}</strong>
          </div>
          <div className="d-flex justify-content-center">
            <div>{kq}</div>
          </div>
        </List.Item>
      );
    });

    return <List>{temp}</List>;
  };

  private confirmAutoSchedule = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: <p>Bạn có muốn tự động xếp lịch ?</p>,
      onOk: this.props.autoScheduled,
      okType: 'primary',
      okText: 'Tự xếp',
      cancelText: 'Quay lại'
    });
  };

  render() {
    const { lichtruc } = this.props;
    const { cells } = lichtruc;
    const lanhDao = lichtruc.maPhongBan === '820110' || lichtruc.maPhongBan === '890110' || lichtruc.maPhongBan === '890051'
      || lichtruc.maPhongBan === '890111' || lichtruc.maPhongBan === '910065' || lichtruc.maPhongBan === '940110';
    return (
      <Fade bottom duration={500}>
        <div>
          <DieuChinhLich />
          <div className="p-3 d-flex">
            {lichtruc.thongTinLichTruc.trangThaiDuyet.toString() === 'DA_DUYET' ? (
              ''
            ) : (
              <RoleBase roles={coQuyenLapLich}>
                <Button className="ml-3" icon="ordered-list" type="dashed" loading={lichtruc.scheduling} onClick={this.confirmAutoSchedule}>
                  Tự xếp lịch
                </Button>
              </RoleBase>
            )}
            <RoleBase roles={coQuyenLapLich}>
              <Button type="primary" icon="file" className="bg-vnpt ml-3" loading={lichtruc.printing} onClick={this.props.inLich}>
                In lịch
              </Button>
            </RoleBase>
          </div>
          <Row className="justify-content-center" style= {{ color : 'blue', background: 'yellow' }}>
            {weekDays.map((value, index) => (
              <div key={index} className={`${index === 0 ? 'border-left' : ''} border-top border-right border-bottom col-week`}>
                <div className="text-center text-uppercase p-2">
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </Row>
          {weeks.map(week => (
            <Row key={week} className="justify-content-center" style={{ minHeight: 208, background: '#87CEEB' }}>
              {weekDays.map((day, index) => {
                const cellIndex = week * 7 + index;
                const cellClass = `${cellIndex % 7 === 0 ? 'border-left' : ''} border-right border-bottom col-week`;
                const cell = cells[cellIndex];
                return cell === undefined ? (
                  <div className={`${cellClass} bg-light`} key={index}>
                    {' '}
                  </div>
                ) : (
                  <div
                    className={cellClass}
                    key={index}
                    onClick={() => this.btnSuaClick(cell)}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    <div className="p-2">
                      <div className="d-flex justify-content-center">
                        <Tag color="geekblue" className="p-1">
                          {cell.ngay.toLocaleDateString()}
                        </Tag>
                      </div>
                      <div>{this.cellDataRender(cell, lanhDao)}</div>
                    </div>
                  </div>
                );
              })}
            </Row>
          ))}
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  lichtruc: storeState.lichtruc
});

const mapDispatchToProps = {
  toggleModalDieuChinh,
  forwardData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LichThang);
