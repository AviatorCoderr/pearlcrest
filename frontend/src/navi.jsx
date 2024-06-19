import {HiOutlineViewGrid} from 'react-icons/hi'
import { RiCommunityFill } from "react-icons/ri";
import { MdOutlinePayment, MdEmojiPeople, MdAccountCircle, MdLogout, MdCarCrash } from "react-icons/md";
import { FaRegSadCry, FaReceipt, FaRupeeSign, FaLock, FaCheckDouble, FaVoteYea } from "react-icons/fa"
import { FaWarehouse, FaBook } from 'react-icons/fa';
import { CiReceipt } from "react-icons/ci";
export const sidebar_det = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/db',
        icon: HiOutlineViewGrid
    },
    {
        key: 'gbmeet',
        label: 'GB Meeting',
        path: '/db/vote',
        icon: FaVoteYea
    },
    {
        key: 'payments',
        label: 'Society Payments',
        path: '/db/payments',
        icon: MdOutlinePayment
    },
    {
        key: 'reservation',
        label: 'Facility Reservation',
        path: '/db/reserve',
        icon: FaLock
    },
    {
        key: 'trackreceipts',
        label: 'Payment History',
        path: '/db/trackpay',
        icon: FaReceipt
    },
    {
        key: 'complains',
        label: 'Raise Complain',
        path: '/db/raise-complains',
        icon: FaCheckDouble
    },
    {
        key: 'visitors',
        label: 'Visitors Log',
        path: '/db/visitor',
        icon: MdEmojiPeople
    },
    {
        key: 'challan',
        label: 'Challans Issued',
        path: '/db/challan',
        icon: MdCarCrash
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
    }
];
