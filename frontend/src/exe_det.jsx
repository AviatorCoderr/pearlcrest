import { RiCommunityFill } from 'react-icons/ri';
import { MdAccountCircle, MdLocalParking } from 'react-icons/md';
import { CiReceipt } from 'react-icons/ci';
import { FaUserFriends } from 'react-icons/fa';
import { sidebar_det } from './navi';

export const exe_det = [
    ...sidebar_det,
    {
        key: 'addpv',
        label: 'Add Payment Voucher',
        path: '/addpv',
        icon: CiReceipt
    },
    {
        key: 'visitor-manage',
        label: 'Visitor Management',
        path: '/visitor-manage',
        icon: FaUserFriends
    },
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/findvehicle',
        icon: MdLocalParking
    },
    {
        key: 'owner-details',
        label: 'Owner Details',
        path: '/owner-details',
        icon: MdAccountCircle
    },
    {
        key: 'renter-details',
        label: 'Renter Details',
        path: '/renter-details',
        icon: MdAccountCircle
    }
];
