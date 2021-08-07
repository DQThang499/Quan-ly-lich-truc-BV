import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faHdd } from '@fortawesome/free-solid-svg-icons/faHdd';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faTasks } from '@fortawesome/free-solid-svg-icons/faTasks';
import { faThList } from '@fortawesome/free-solid-svg-icons/faThList';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';

import { library } from '@fortawesome/fontawesome-svg-core';

export const loadIcons = () => {
  library.add(
    faSort,
    faEye,
    faSync,
    faBan,
    faTrash,
    faArrowLeft,
    faSave,
    faPlus,
    faPencilAlt,
    faUser,
    faTachometerAlt,
    faHeart,
    faList,
    faTasks,
    faBook,
    faHdd,
    faClock,
    faSignInAlt,
    faSignOutAlt,
    faWrench,
    faThList,
    faUserPlus,
    faAsterisk,
    faFlag,
    faBell,
    faRoad,
    faCloud,
    faHome
  );
};
