import { RiCommunityFill, RiDashboardLine } from 'react-icons/ri';
import { MdLocalParking, MdPerson4 } from 'react-icons/md';

export const guard_det = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/db',
        icon: RiDashboardLine
    },
    {
        key: 'visitor-manage',
        label: 'One-Time Visitors',
        path: '/db/visitor-manage',
        icon: RiCommunityFill
    },
    {
        key: 'maidmanage',
        label: 'Regular Visitors',
        path: '/db/maidmanage',
        icon: MdPerson4
    },
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/db/findvehicle',
        icon: MdLocalParking
    },
];
