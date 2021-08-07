import React, { Component } from 'react';
import { Button, Icon, Modal, Table, Tag, Input } from 'antd';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { addNVToDeleteList, xoaChucDanhTrucNhanVien } from 'app/shared/reducers/dstruc/xoanvtruc';
import { forwardNhanVien, toggleNhap } from 'app/shared/reducers/dstruc/nhapvangtruc';
import { chucDanh } from 'app/modules/constants/chucdanh';
import RoleBase from 'app/modules/component/rolebase';
import { IRole, ROLES, hasAnyRole } from 'app/shared/util/auth-utils';

export interface IChiTietDSProps extends StateProps, DispatchProps {
  data: any[];
}

const coQuyenNhapVang: IRole[] = [
  ROLES.ADMIN, ROLES.GIAM_DOC_DV, ROLES.CAN_BO_PHONG_KHTH, ROLES.TRUONG_PHONG_KHTH];
const coQuyenDieuChinhDS: IRole[] = [
  ROLES.ADMIN,
  ROLES.GIAM_DOC_DV,
  ROLES.TRUONG_PHONG_KHTH,
  ROLES.TRUONG_PHONG_BAN,
  ROLES.DIEU_DUONG_TRUONG
];

class ChiTietDS extends Component<IChiTietDSProps> {
  private searchInput: any;

  constructor(props) {
    super(props);
  }

  private btnNhapVangTrucClick = nhanVien => {
    this.props.toggleNhap(true);
    this.props.forwardNhanVien(nhanVien);
  };

  render() {
    const { data } = this.props;
    const columns = [
      {
        title: 'STT',
        width: '10%',
        dataIndex: 'stt'
      },
      {
        title: 'Nhân viên',
        key: 'nhanVien',
        dataIndex: 'nhanVien',
        width: '55%',
        // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        //   <div style={{ padding: 8 }}>
        //     <Input
        //       ref={node => {
        //         this.searchInput = node;
        //       }}
        //       placeholder="Tìm tên hoặc mã nhân viên..."
        //       value={selectedKeys[0]}
        //       onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //       onPressEnter={confirm}
        //       style={{ width: 188, marginBottom: 8, display: 'block' }}
        //     />
        //     <Button type="primary" onClick={confirm} icon="search" size="small" style={{ width: 90, marginRight: 8 }}>
        //       Tìm
        //     </Button>
        //     <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
        //       Reset
        //     </Button>
        //   </div>
        // ),
        // filterIcon: filtered => <Icon style={{ color: filtered ? '#1890ff' : undefined }} />,
        // onFilter: (value, record) =>
        //   record.nhanVien.tenNhanVien
        //     .toString()
        //     .toLowerCase()
        //     .includes(value.toLowerCase()) ||
        //   record.nhanVien.maNhanVien
        //     .toString()
        //     .toLowerCase()
        //     .includes(value.toLowerCase()),
        // onFilterDropdownVisibleChange: visible => {
        //   if (visible) {
        //     setTimeout(() => this.searchInput.select());
        //   }
        // },
        render: nhanVien => (
          <div>
            <h5>{nhanVien.tenNhanVien}</h5>
            <div>
              <Icon type="idcard" className="align-middle" />
              <span className="align-middle pl-1"> {nhanVien.maNhanVien}</span>
            </div>
            <div>
              <Icon type="phone" className="align-middle" />
              <span className="align-middle pl-1"> {nhanVien.sdtNhanVien}</span>
            </div>
            <div>
              <Icon type="medicine-box" className="align-middle" />
              <span className="align-middle pl-1"> {nhanVien.chucDanhNhanVien}</span>
            </div>
            <RoleBase roles={coQuyenNhapVang}>
              <div className="p-2">
                <Button onClick={() => this.btnNhapVangTrucClick(nhanVien)}>Nhập vắng trực</Button>
              </div>
            </RoleBase>
          </div>
        )
      },
      {
        title: 'Chức danh trực',
        width: '30%',
        key: 'chucDanhTruc',
        dataIndex: 'chucDanhTruc',
        filters: [
          {
            text: 'Bác sĩ',
            value: 'BAC_SI'
          },
          {
            text: 'Điều dưỡng',
            value: 'DIEU_DUONG'
          },
          {
            text: 'Kỹ thuật viên',
            value: 'KY_THUAT_VIEN'
          },
          {
            text: 'Hộ lý',
            value: 'HO_LY'
          },
          {
            text: 'Lãnh đạo',
            value: 'LANH_DAO'
          }
        ],
        onFilter: (value, record) => record.chucDanhTruc.indexOf(value) === 0,
        render: (cell, record) =>
          cell.map((value, index) => (
            <div key={index} className="p-1">
              <Tag
                color={chucDanh[value].color}
                closable={hasAnyRole(coQuyenDieuChinhDS)}
                onClose={e => {
                  e.preventDefault();
                  Modal.confirm({
                    title: 'Xác nhận',
                    content: (
                      <p>
                        Bạn có chắc chắn muốn xóa chức danh trực <strong>{chucDanh[value].title}</strong> của nhân viên{' '}
                        <strong>{record.nhanVien.tenNhanVien}</strong> ?
                      </p>
                    ),
                    onOk: () => this.props.xoaChucDanhTrucNhanVien(record.nhanVien.maNhanVien, this.props.dstruc.thongTinDS.maDS, value),
                    okType: 'danger',
                    okText: 'Có',
                    cancelText: 'Không'
                  });
                }}
              >
                <Icon className="align-middle" type={chucDanh[value].icon} />
                <span className="align-middle pl-1 pr-2">{chucDanh[value].title}</span>
              </Tag>
            </div>
          ))
      }
    ];

    return (
      <div className="shadow-sm border">
        <Table
          columns={columns}
          dataSource={data.map((row, index) => ({ stt: index + 1, ...row }))}
          rowKey="maPhanCong"
          rowSelection={
            hasAnyRole(coQuyenDieuChinhDS)
              ? {
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.props.addNVToDeleteList(selectedRows);
                  }
                }
              : null
          }
          pagination={false}
          tableLayout="fixed"
          scroll={{ y: 400 }}
        />
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({ dstruc: storeState.dstruc });

const mapDispatchToProps = {
  addNVToDeleteList,
  toggleNhap,
  forwardNhanVien,
  xoaChucDanhTrucNhanVien
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChiTietDS);
