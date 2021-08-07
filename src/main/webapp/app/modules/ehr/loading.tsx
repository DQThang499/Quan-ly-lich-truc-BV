import * as React from 'react';

interface ILoadingProps {
  isLoading: boolean;
}

declare var require: any;

export class LoadingComponent extends React.Component<ILoadingProps> {
  static defaultProps = {
    isLoading: false
  };

  render() {
    return this.props.isLoading ? (
      <div style={{ position: 'fixed', background: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}>
        <img
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }}
          src={require('../../../static/images/loading.svg')}
        />
      </div>
    ) : null;
  }
}
