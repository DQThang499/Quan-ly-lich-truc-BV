import React from 'react';
import { Button, DatePicker, Form, Icon, message, Modal, Select, Spin, Tag } from 'antd';
import { Row, Col } from 'reactstrap';
import { EHRSessionStorage } from 'app/modules/ehr/sessionStorage/ehrStorageService';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getLSVangTruc, submitIn, submitXinVangTruc, toggleModalIn, toggleModalNhap, toggleModaLS } from 'app/shared/reducers/xinvang';
import moment from 'moment';
import { trangThaiDuyetContants } from 'app/modules/constants/trangthai';
import DanhMuc from 'app/modules/component/danhmuc';

export interface ILichSuVangProps extends StateProps, DispatchProps {}

class LichSuVang extends React.Component<ILichSuVangProps> {
  private columns = [
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
    const { xinvang } = this.props;
    return (
      <Modal
        title="Lịch sử xin vắng"
        style={{ top: 20 }}
        width={'650px'}
        visible={xinvang.modalLS}
        onCancel={() => this.props.toggleModaLS(false)}
        footer={
          <div>
            <Button onClick={() => this.props.toggleModaLS(false)}>Đóng</Button>
          </div>
        }
      >
        {xinvang.modalLS ? (
          <DanhMuc
            columns={this.columns}
            dataSource={xinvang.lichsu}
            loadDtata={this.props.getLSVangTruc}
            loading={xinvang.loading}
            rowKey="maVang"
            totalRow={xinvang.tongSoDong}
            height="280px"
            width="600px"
            expandedRowRender={(record, index, indent, expanded) => (
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
                      <strong>Thời gian nhập: </strong>
                      {new Date(record.thoiGianLap).toLocaleString()}
                    </span>
                  </div>
                </Col>
                <Col sm="6">
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
        ) : (
          ''
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  xinvang: storeState.xinvang
});

const mapDispatchToProps = {
  toggleModaLS,
  getLSVangTruc
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LichSuVang);
