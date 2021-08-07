import React, { Component, ReactNode } from 'react';
import { Pagination, Table } from 'antd';

export interface IDanhMucProps {
  loadDtata: any;
  loading: boolean;
  columns: any;
  dataSource: any;
  totalRow: number;
  rowKey: string;
  width: string;
  height: string;
  expandedRowRender: any;
}
export interface IDanhMucState {
  tongSoDong: number;
  soDongHienTai: number;
  trangHienTai: number;
}

class DanhMuc extends Component<IDanhMucProps, IDanhMucState> {
  public static defaultProps = {
    expandedRowRender: null
  };
  private pageSizeOptions = ['20', '50', '100'];
  constructor(props) {
    super(props);
    this.state = {
      tongSoDong: 0,
      soDongHienTai: Number(this.pageSizeOptions[0]),
      trangHienTai: 0
    };
  }
  private onShowSizeChange = async (current: number, pageSize: number) => {
    await this.props.loadDtata(current - 1, pageSize);
    this.setState({
      trangHienTai: current - 1,
      soDongHienTai: pageSize,
      tongSoDong: this.props.totalRow
    });
  };
  private onPageChange = async (page: number) => {
    await this.props.loadDtata(page - 1, this.state.soDongHienTai);
    this.setState({
      trangHienTai: page - 1,
      tongSoDong: this.props.totalRow
    });
  };
  async componentDidMount() {
    const { trangHienTai, soDongHienTai } = this.state;
    await this.props.loadDtata(trangHienTai, soDongHienTai);
    this.setState({
      tongSoDong: this.props.totalRow
    });
  }
  render() {
    const { width, height } = this.props;
    return (
      <div>
        <div className="d-flex justify-content-center p-2">
          <Pagination
            total={this.state.tongSoDong}
            showQuickJumper
            showTotal={(total, range) => (
              <div>
                <strong>
                  {range[0]}-{range[1]}{' '}
                </strong>{' '}
                trong <strong>{total}</strong> dòng
              </div>
            )}
            showSizeChanger
            pageSize={this.state.soDongHienTai}
            pageSizeOptions={this.pageSizeOptions}
            onShowSizeChange={this.onShowSizeChange}
            current={this.state.trangHienTai + 1}
            onChange={this.onPageChange}
            size="small"
          />
        </div>
        <div className="d-flex justify-content-center">
          <div className="mt-3 card shadow-sm border-0">
            <Table
              style={{ width }}
              loading={this.props.loading}
              columns={this.props.columns}
              dataSource={this.props.dataSource}
              rowKey={this.props.rowKey}
              pagination={false}
              expandedRowRender={this.props.expandedRowRender}
              tableLayout="fixed"
              scroll={{ y: height }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DanhMuc;
