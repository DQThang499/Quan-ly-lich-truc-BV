import React, { Component } from 'react';
import { Button, Modal, Tag } from 'antd';
import { IRootState } from 'app/shared/reducers';
import { toggleModal, xoaNhanVien } from 'app/shared/reducers/dstruc/xoanvtruc';
import { connect } from 'react-redux';

export interface IXoaNVTrucProps extends StateProps, DispatchProps {}

class XoaNVTruc extends Component<IXoaNVTrucProps> {
  render() {
    const { xoanvtruc } = this.props;
    return (
      <Modal
        title="Xác nhận xóa ?"
        visible={xoanvtruc.modal}
        footer={
          <div>
            <Button loading={xoanvtruc.deleteing} onClick={this.props.xoaNhanVien} type="danger">
              Có
            </Button>
            <Button onClick={() => this.props.toggleModal(false)}>Không</Button>
          </div>
        }
        onCancel={() => this.props.toggleModal(false)}
      >
        <div>
          <div>Các nhân viên sau đây sẽ bị xóa khỏi danh sách </div>
          <div>
            {xoanvtruc.selectedRows.map((value, index) => (
              <Tag key={index} className="p-1 m-2">
                {value.nhanVien.tenNhanVien}
              </Tag>
            ))}
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  xoanvtruc: storeState.xoanvtruc
});

const mapDispatchToProps = {
  toggleModal,
  xoaNhanVien
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XoaNVTruc);
