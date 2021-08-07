import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Button, Icon, Modal, Spin, Tag } from 'antd';
import { Row, Col } from 'reactstrap';
import DanhMuc from 'app/modules/component/danhmuc';
import { duyetVangTruc, getDanhMucVangTruc, toggleDMVangTruc } from 'app/shared/reducers/dstruc/dmvangtruc';
import { trangThaiDuyetContants } from 'app/modules/constants/trangthai';

export interface IDMVangTrucProps extends StateProps, DispatchProps {}

class DMVangTruc extends React.Component<IDMVangTrucProps> {
  private columns = [
    {
      title: () => (
        <div>
          <Icon type="user" className="align-middle" />
          <span className="align-middle p-2">Nhân viên</span>
        </div>
      ),
      dataIndex: 'tenNhanVien',
      render: tenNhanVien => <span>{tenNhanVien}</span>
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBD',
      render: ngayBD => <span>{new Date(ngayBD).toLocaleDateString()}</span>
    },
    {
      title: () => 'Ngày kết thúc',
      dataIndex: 'ngayKT',
      render: ngayKT => <span>{new Date(ngayKT).toLocaleDateString()}</span>
    },
    {
      title: () => 'Trạng thái',
      dataIndex: 'trangThaiDuyet',
      render: trangThaiDuyet => (
        <span>
          <Tag color={trangThaiDuyetContants[trangThaiDuyet].color}>{trangThaiDuyetContants[trangThaiDuyet].title}</Tag>
        </span>
      )
    }
  ];
  render() {
    const { dmvangtruc } = this.props;
    return (
      <Modal
        title="Danh mục vắng trực"
        visible={dmvangtruc.modal}
        style={{ top: '20px' }}
        width="800px"
        footer={
          <div>
            <Button onClick={() => this.props.toggleDMVangTruc(false)}>Đóng</Button>
          </div>
        }
        onCancel={() => this.props.toggleDMVangTruc(false)}
      >
        {!dmvangtruc.modal ? (
          ''
        ) : (
          <DanhMuc
            columns={this.columns}
            dataSource={dmvangtruc.duLieu}
            loadDtata={this.props.getDanhMucVangTruc}
            loading={dmvangtruc.loadingData}
            rowKey="maVang"
            totalRow={dmvangtruc.tongSoDong}
            height="280px"
            width="700px"
            expandedRowRender={(record , expanded) => (
              <Row>
                <Col sm="6">
                  <div className="p-1">
                    <Icon type="form" className="align-middle" />
                    <span className="align-middle pl-2">
                      <strong>Lý do: </strong>
                      {record.lyDo}
                    </span>
                  </div>
                  <div className="p-1">
                    <Icon type="user-add" className="align-middle" />
                    <span className="align-middle pl-2">
                      <strong>Người nhập: </strong>
                      {record.tenNguoiLap}
                    </span>
                  </div>
                  <div className="p-1">
                    <Icon type="clock-circle" className="align-middle" />
                    <span className="align-middle pl-2">
                      <strong>Thời gian lập: </strong>
                      {new Date(record.thoiGianLap).toLocaleString()}
                    </span>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="justify-content-center d-flex">
                    {dmvangtruc.approving ? (
                      <Spin />
                    ) : (
                      <Button.Group>
                        <Button
                          onClick={() => this.props.duyetVangTruc(record.maVang, true)}
                          disabled={record.trangThaiDuyet === 'DA_DUYET'}
                        >
                          <Icon type="check" className="text-success" />
                        </Button>
                        <Button
                          onClick={() => this.props.duyetVangTruc(record.maVang, false)}
                          disabled={record.trangThaiDuyet === 'HUY_DUYET'}
                        >
                          <Icon type="close" className="text-danger" />
                        </Button>
                      </Button.Group>
                    )}
                  </div>
                  {record.trangThaiDuyet === 'CHUA_DUYET' ? (
                    ''
                  ) : (
                    <div className="p-2">
                      {`${trangThaiDuyetContants[record.trangThaiDuyet].title} bởi `}
                      <strong>{record.tenNguoiDuyet}</strong>, Vào lúc:{' '}
                      <strong>{new Date(record.thoiGianDuyet).toLocaleString('vi-VN')}</strong>
                    </div>
                  )}
                </Col>
              </Row>
            )}
          />
        )}
      </Modal>
    );
  }
}
const mapStateToProps = ({ dmvangtruc }: IRootState) => ({
  dmvangtruc
});

const mapDispatchToProps = {
  toggleDMVangTruc,
  getDanhMucVangTruc,
  duyetVangTruc
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DMVangTruc);
