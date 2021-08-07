import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { Button, Tooltip } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { empty } from 'app/modules/constants/empty';
import { ButtonType } from 'antd/lib/button';

const selectRow = (nonSelectable: any[]) => ({
  mode: 'checkbox',
  clickToSelect: true,
  bgColor: '#91d5ff',
  selected: [],
  nonSelectable,
  selectColumnStyle: {
    backgroundColor: 'grey'
  }
});

export interface IDSNhanVienProps {
  dsNhanVien: any[];
  nonSelectable: any[];
  chucDanhTruc: string;
  actionButton: {
    type: ButtonType;
    className: string;
    icon: string;
    loading: boolean;
    text: string;
    onClick: any;
  };
}

class DSNhanVien extends Component<IDSNhanVienProps> {
  private node = React.createRef<any>();

  constructor(props) {
    super(props);
  }

  handleGetSelectedData = () => {
    const { current } = this.node;
    const selectedKeys = current.selectionContext.state.selected;
    this.props.actionButton.onClick(selectedKeys);
  };

  render() {
    const { SearchBar } = Search;
    const { dsNhanVien, actionButton, nonSelectable } = this.props;
    const columns = [
      {
        dataField: 'maNhanVien',
        text: 'Mã nhân viên',
        sort: true,
        headerStyle: (colum, colIndex) => ({ width: '15%' })
      },
      {
        dataField: 'tenNhanVien',
        text: 'Họ tên',
        formatter: (cell, row) =>
          nonSelectable.indexOf(row.maNhanVien) > -1 ? (
            <Tooltip
              className="d-block"
              placement="top"
              title={<div>Nhân viên này đã được phân công trực {this.props.chucDanhTruc.toUpperCase()} trong danh sách</div>}
            >
              <div>{cell}</div>
            </Tooltip>
          ) : (
            <div>{cell}</div>
          ),
        classes: (cell, row, rowIndex, colIndex) => (nonSelectable.indexOf(row.maNhanVien) > -1 ? 'bg-success-light' : '')
      },
      {
        dataField: 'chucDanhNhanVien',
        text: 'Chức danh nhân viên',
        sort: true
      },
      {
        dataField: 'sdtNhanVien',
        text: 'SĐT',
        headerStyle: (colum, colIndex) => ({ width: '20%' })
      }
    ];

    return (
      <div>
        <ToolkitProvider bootstrap4 keyField="maNhanVien" data={dsNhanVien} columns={columns} search>
          {props => (
            <div>
              <Row className="justify-content-center mt-2">
                <SearchBar {...props.searchProps} placeholder="Tìm kiếm ..." />
              </Row>
              <hr />
              <BootstrapTable
                {...props.baseProps}
                ref={this.node}
                noDataIndication={empty}
                selectRow={selectRow(nonSelectable)}
                hover
                wrapperClasses="custom-table-wrapper"
                headerClasses="bg-vnpt text-white"
              />
            </div>
          )}
        </ToolkitProvider>
        <Row className="p-3 justify-content-end">
          <div className="ml-3 mr-3">
            <Button
              className={actionButton.className}
              type={actionButton.type}
              loading={actionButton.loading}
              icon={actionButton.icon}
              onClick={this.handleGetSelectedData}
            >
              {actionButton.text}
            </Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default DSNhanVien;
