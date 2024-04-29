import { RiCommunityFill, RiDashboardLine } from 'react-icons/ri';
import { MdLocalParking } from 'react-icons/md';

export const guard_det = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: RiDashboardLine
    },
    {
        key: 'visitor-manage',
        label: 'Visitor Management',
        path: '/visitor-manage',
        icon: RiCommunityFill
    },
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/findvehicle',
        icon: MdLocalParking
    }
];
