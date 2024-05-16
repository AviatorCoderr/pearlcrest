import { RiCommunityFill } from 'react-icons/ri';
import { MdAccountCircle, MdLocalParking } from 'react-icons/md';
import { CiReceipt } from 'react-icons/ci';
import { FaUserFriends } from 'react-icons/fa';
import { sidebar_det } from './navi';

export const exe_det = [
    ...sidebar_det,
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/db/findvehicle',
        icon: MdLocalParking
    },
    {
        key: 'owner-details',
        label: 'Owner Details',
        path: '/db/owner-details',
        icon: MdAccountCircle
    },
    {
        key: 'renter-details',
        label: 'Renter Details',
        path: '/db/renter-details',
        icon: MdAccountCircle
    }
];
