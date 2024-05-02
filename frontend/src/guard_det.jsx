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
        label: 'Visitor Management',
        path: '/db/visitor-manage',
        icon: RiCommunityFill
    },
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/db/findvehicle',
        icon: MdLocalParking
    },
    {
        key: 'maidmanage',
        label: 'Maid Management',
        path: '/db/maidmanage',
        icon: MdPerson4
    }
];
