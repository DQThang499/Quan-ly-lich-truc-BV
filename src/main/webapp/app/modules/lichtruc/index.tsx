import React from 'react';
import { Alert, Button, DatePicker, Icon, List, message, Modal, Select, Spin, Tag, Tooltip } from 'antd';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import moment from 'moment';
import LichThang from 'app/modules/lichtruc/lichthang';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  inLich,
  autoScheduled,
  drawLichTruc,
  duyetLichTruc,
  init,
  inLichTongTruc,
  lapLich,
  resetState,
  toggleXemThayDoi,
  getDSThaDoi
} from 'app/shared/reducers/lichtruc';
import { CardBody } from 'reactstrap';
import responseMessage from 'app/shared/reducers/responseMessage';
import { trangThaiDuyetContants } from 'app/modules/constants/trangthai';
import Fade from 'react-reveal/Fade';
import { ROLES, IRole, hasAnyRole } from 'app/shared/util/auth-utils';
import RoleBase from 'app/modules/component/rolebase';
import XemThayDoi from './xemthaydoi';

export interface ILichTrucProps extends StateProps, DispatchProps {}

export interface ILichTrucState {
  thang: number;
  nam: number;
  weekOfMonth: number;
  maPhongBan: string;
  modalThongTin: boolean;
  chucDanh: any;
}

const coQuyenDuyetLich: IRole[] = [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.TRUONG_PHONG_BAN, ROLES.TRUONG_PHONG_KHTH];
const coQuyenLapLich: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.DIEU_DUONG_TRUONG,
  ROLES.TRUONG_PHONG_BAN,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.CAN_BO_PHONG_KHTH
];
const coQuyenInLichTongTruc: IRole[] = [ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.TRUONG_PHONG_KHTH, ROLES.CAN_BO_PHONG_KHTH];

class LichTruc extends React.Component<ILichTrucProps, ILichTrucState> {
  private dsPhongBan = JSON.parse(EHRSessionStorage.get('dsPhongBan'));
  private chiCo1PhongBan: boolean = this.dsPhongBan.length === 1;
  constructor(props) {
    super(props);
    const now = moment()
      .format('MM/YYYY')
      .split('/');
    // if (hasAnyRole(coQuyenLichLanhDao)) {
    //   this.dsPhongBan.push({
    //     maPhongBan: '',
    //     tenPhongBan: 'Trực lãnh đạo'
    //   });
    // }
    this.state = {
      thang: Number(now[0]),
      nam: Number(now[1]),
      weekOfMonth: 1,
      maPhongBan: this.dsPhongBan[0].maPhongBan,
      modalThongTin: false,
      chucDanh: ''
    };
  }
  private btnXemLichClick = () => {
    const { thang, nam, maPhongBan } = this.state;
    if (thang >= 1 && thang <= 12) {
      this.props.init(thang, nam, maPhongBan);
      this.props.getDSThaDoi(0, 20);
    } else {
      message.error(responseMessage.THANG_NAM_CHUA_HOP_LE);
    }
  };

  private toggleModalThongTin = (modal: boolean) => {
    this.setState({
      modalThongTin: modal
    });
  };

  // private btnInTongTrucClick = () => {
  //   const { thang, nam, weekOfMonth } = this.state;
  //   const numOfDays = new Date(nam, thang, 0).getDate();
  //   if (thang <= 1 || thang >= 12) {
  //     message.error(responseMessage.THANG_NAM_CHUA_HOP_LE);
  //     return;
  //   }
  //   if (weekOfMonth - 1 >= Math.ceil(numOfDays / 7.0) || weekOfMonth < 1) {
  //     message.error('Tuần không hợp lệ !');
  //   } else {
  //     this.props.inLichTongTruc(weekOfMonth - 1, thang, nam);
  //   }
  // };

  componentWillUnmount(): void {
    if (this.props.lichtruc.thongTinLichTruc === null) {
      this.props.resetState();
    }
  }
  render() {
    const { thang, nam, maPhongBan, weekOfMonth } = this.state;
    const { lichtruc } = this.props;
    const ChonThangNamPhongBan = (
      <div className="d-flex">
        <h5 className="p-2">LỊCH TRỰC</h5>
        <Select
          defaultValue={maPhongBan}
          className="p-2"
          style={{ width: 250 }}
          disabled={this.chiCo1PhongBan}
          onChange={value => {
            this.setState({
              maPhongBan: value
            });
          }}
        >
          {this.dsPhongBan.map((phongBan, index) => (
            <Select.Option key={index} value={phongBan.maPhongBan}>
              {phongBan.tenPhongBan}
            </Select.Option>
          ))}
        </Select>
        <div style={{ padding: '0.5rem' }}>
          <DatePicker.MonthPicker
            defaultValue={moment(`${thang}/${nam}`, 'MM/YYYY')}
            format="MM/YYYY"
            placeholder="Chọn tháng"
            onChange={(date, dateString) => {
              const now = dateString.split('/');
              this.setState({
                thang: Number(now[0]),
                nam: Number(now[1])
              });
            }}
          />
        </div>
        <div style={{ padding: '0.5rem' }}>
          <Button onClick={this.btnXemLichClick} icon="search" type="primary">
            Xem lịch
          </Button>
        </div>
        {/*<RoleBase roles={coQuyenInLichTongTruc}>*/}
        {/*  <div className="d-flex" style={{ padding: '0.5rem' }}>*/}
        {/*    <InputNumber*/}
        {/*      placeholder="Tuần"*/}
        {/*      min={1}*/}
        {/*      max={5}*/}
        {/*      defaultValue={weekOfMonth}*/}
        {/*      onChange={value => this.setState({ weekOfMonth: value })}*/}
        {/*    />*/}
        {/*    <Button loading={lichtruc.printing} onClick={this.btnInTongTrucClick} icon="file" type="primary" className="bg-vnpt ml-2">*/}
        {/*      In Tổng trực BV*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</RoleBase>*/}
      </div>
    );

    const ChuaChonPhongBan = (
      <div className="pt-2 pb-2 pl-5 pr-5">
        <Alert
          type="info"
          message="Thông tin"
          showIcon
          description="Chọn tháng năm và phòng ban sau đó click 'Xem lịch' để xem lịch trực"
        />
      </div>
    );

    const Loading = (
      <div className="pt-2 pb-2 d-flex justify-content-center">
        <Spin />
      </div>
    );
    const Error = (
      <div className="pt-2 pb-2 pl-5 pr-5">
        <Alert type="error" message="Lỗi" showIcon description={lichtruc.errorMessage} />
        {lichtruc.errorMessage !== responseMessage.LICH_KHONG_TIM_THAY ? (
          ''
        ) : (
          <RoleBase roles={coQuyenLapLich}>
            <div className="d-flex justify-content-center p-3">
              <Button icon="plus" type="dashed" onClick={this.props.lapLich} loading={lichtruc.creating}>
                Lập lịch
              </Button>
            </div>
          </RoleBase>
        )}
      </div>
    );

    const ThongTinLichTrucModal =
      lichtruc.thongTinLichTruc === null ? (
        ''
      ) : (
        <div>
          <Modal
            title="Thông tin lịch trực"
            visible={this.state.modalThongTin}
            width={400}
            onCancel={() => this.toggleModalThongTin(false)}
            footer={
              <div>
                <Button onClick={() => this.toggleModalThongTin(false)}>Đóng</Button>
              </div>
            }
          >
            <CardBody>
              <List>
                <List.Item>
                  <Icon type="user-add" className="align-middle pr-2" />
                  Lập bởi <strong>{lichtruc.thongTinLichTruc.tenNguoiLap}</strong>, Vào lúc:{' '}
                  <strong>{new Date(lichtruc.thongTinLichTruc.thoiGianLap).toLocaleString('vi-VN')}</strong>
                </List.Item>
                {lichtruc.thongTinLichTruc.trangThaiDuyet.toString() === 'CHUA_DUYET' ? (
                  ''
                ) : (
                  <List.Item>
                    <Icon type="eye" className="align-middle pr-2" />
                    {`${trangThaiDuyetContants[lichtruc.thongTinLichTruc.trangThaiDuyet].title} bởi `}
                    <strong>{lichtruc.thongTinLichTruc.tenNguoiDuyet}</strong>, Vào lúc:{' '}
                    <strong>{new Date(lichtruc.thongTinLichTruc.thoiGianDuyet).toLocaleString('vi-VN')}</strong>
                  </List.Item>
                )}
                <List.Item>
                  <Icon type="clock-circle" className="align-middle pr-2" />
                  Lần sửa đổi gần nhất: <strong>{new Date(lichtruc.thongTinLichTruc.thoiGianCapNhat).toLocaleString('vi-VN')}</strong>
                </List.Item>
                <List.Item>
                  <Icon type="edit" className="align-middle pr-2" />
                  Người sửa đổi: <strong>{lichtruc.thongTinLichTruc.tenNguoiDuyet}</strong>
                </List.Item>
              </List>
            </CardBody>
          </Modal>
        </div>
      );
    const XemLichTruc =
      lichtruc.thongTinLichTruc === null ? (
        ''
      ) : (
        <div className="p-2">
          {/*{ThongTinLichTrucModal}*/}
          <h5 className="text-center">
            <span className="align-middle">
              LỊCH TRỰC {lichtruc.thongTinLichTruc.tenPhongBan.toUpperCase()}{' '}
              THÁNG {lichtruc.thang}/{lichtruc.nam}
            </span>
            {/*<Tooltip title="Thông tin lịch">*/}
            {/*  <Icon*/}
            {/*    theme="twoTone"*/}
            {/*    style={{ cursor: 'pointer' }}*/}
            {/*    className="ml-3 align-middle"*/}
            {/*    type="info-circle"*/}
            {/*    onClick={() => this.toggleModalThongTin(true)}*/}
            {/*  />*/}
            {/*</Tooltip>*/}
            {lichtruc.thongTinLichTruc.trangThaiDuyet.toString() !== 'DA_DUYET' ? (
              ''
            ) : (
              <RoleBase roles={coQuyenDuyetLich}>
                <Tooltip title="Xem thay đổi so với lịch đã duyệt">
                  <Icon
                    type="eye"
                    theme="twoTone"
                    className="ml-3 align-middle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.toggleXemThayDoi(true)}
                  />
                </Tooltip>
              </RoleBase>
            )}
          </h5>
          <div className="d-flex justify-content-center">
            <Tag color={trangThaiDuyetContants[lichtruc.thongTinLichTruc.trangThaiDuyet].color}>
              {trangThaiDuyetContants[lichtruc.thongTinLichTruc.trangThaiDuyet].title}
            </Tag>
          </div>
          <RoleBase roles={coQuyenDuyetLich}>
            <div className="d-flex justify-content-center p-2">
              {lichtruc.approving ? (
                <Spin />
              ) : (
                <Button.Group>
                  <Button
                    onClick={() => this.props.duyetLichTruc(true)}
                    disabled={lichtruc.thongTinLichTruc.trangThaiDuyet.toString() === 'DA_DUYET'}
                  >
                    <Icon type="check" className="text-success" />
                  </Button>
                  <Button
                    onClick={() => this.props.duyetLichTruc(false)}
                    disabled={lichtruc.thongTinLichTruc.trangThaiDuyet.toString() === 'HUY_DUYET'}
                  >
                    <Icon type="close" className="text-danger" />
                  </Button>
                </Button.Group>
              )}
            </div>
          </RoleBase>
          <div className="p-3">
            <LichThang inLich={this.props.inLich}
                       drawLichTruc={this.props.drawLichTruc}
                       autoScheduled={this.props.autoScheduled}
            />
          </div>
        </div>
      );
    return (
      <Fade bottom duration={500}>
        <XemThayDoi />
        <div>
          {ChonThangNamPhongBan}
          <hr />
          {lichtruc.maPhongBan == null
            ? ChuaChonPhongBan
            : lichtruc.loading
              ? Loading
              : lichtruc.errorMessage !== null
                ? Error
                : XemLichTruc}
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  lichtruc: storeState.lichtruc
});

const mapDispatchToProps = {
  init,
  lapLich,
  duyetLichTruc,
  drawLichTruc,
  autoScheduled,
  resetState,
  inLichTongTruc,
  inLich,
  toggleXemThayDoi,
  getDSThaDoi
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LichTruc);
