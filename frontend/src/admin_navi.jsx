import { RiDashboardLine } from 'react-icons/ri';
import { FaExchangeAlt, FaFileAlt, FaMoneyBillAlt, FaBalanceScale, FaMoneyCheckAlt, FaHandHoldingUsd, FaBook, FaWarehouse, FaUserFriends } from 'react-icons/fa';
import { MdSecurity, MdLocalParking } from 'react-icons/md';

export const admin_navi = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/db',
        icon: RiDashboardLine
    },
    {
        key: 'flat-details',
        label: 'Flat Details',
        path: '/db/flat-details-change-perm',
        icon: FaExchangeAlt
    },
    {
        key: 'facility-reservation',
        label: 'Facility Reservation',
        path: '/db/facility-reservation-booking-account',
        icon: MdSecurity
    },
    {
        key: 'income-details',
        label: 'Income Details',
        path: '/db/income-details-deptwise',
        icon: FaMoneyBillAlt
    },
    {
        key: 'expenditure-details',
        label: 'Expenditure Details',
        path: '/db/expenditure-details-deptwise',
        icon: FaMoneyBillAlt
    },
    {
        key: 'income-expenditure',
        label: 'Income/Expenditure',
        path: '/db/income-expenditure-account',
        icon: FaBalanceScale
    },
    {
        key: 'add-income',
        label: 'Add Income',
        path: '/db/addincome',
        icon: FaHandHoldingUsd
    },
    {
        key: 'cashbook',
        label: 'Cashbook',
        path: '/db/cashbook',
        icon: FaBook
    },
    {
        key: 'bankbook',
        label: 'Bankbook',
        path: '/db/bankbook',
        icon: FaWarehouse
    },
    {
        key: 'maintenance-tracking',
        label: 'Maintenance',
        path: '/db/maintenance-tracking',
        icon: FaWarehouse
    },
    {
        key: 'addpv',
        label: 'Payment Voucher',
        path: '/db/addpv',
        icon: FaMoneyCheckAlt
    },
    {
        key: 'findvehicle',
        label: 'Find Vehicle',
        path: '/db/findvehicle',
        icon: MdLocalParking
    },
    {
        key: 'owners',
        label: 'Owners',
        path: '/db/owner-details',
        icon: FaUserFriends
    },
    {
        key: 'renters',
        label: 'Renters',
        path: '/db/renter-details',
        icon: FaUserFriends
    }
];

