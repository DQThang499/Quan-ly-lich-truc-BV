import React, { Component } from 'react';
import { hasAnyRole, IRole } from 'app/shared/util/auth-utils';

export interface IRoleBaseProps {
  roles: IRole[];
}

class RoleBase extends Component<IRoleBaseProps> {
  render() {
    const { roles, children } = this.props;
    return !hasAnyRole(roles) ? '' : children;
  }
}

export default RoleBase;
