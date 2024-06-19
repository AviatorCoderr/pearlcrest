import { MdAccountCircle, MdLocalParking } from 'react-icons/md';
import { FaCarCrash } from 'react-icons/fa';
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
        key: 'challan',
        label: 'Challans',
        path: '/db/adminchallan',
        icon: FaCarCrash
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
