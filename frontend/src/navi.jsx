import {HiOutlineViewGrid} from 'react-icons/hi'
import { RiCommunityFill } from "react-icons/ri";
import { MdOutlinePayment, MdEmojiPeople, MdAccountCircle, MdLogout } from "react-icons/md";
import { FaRegSadCry, FaReceipt, FaRupeeSign, FaLock } from "react-icons/fa"
import { CiReceipt } from "react-icons/ci";
export const sidebar_det = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/db',
        icon: HiOutlineViewGrid
    },
    {
        key: 'accounts',
        label: 'Accounts Summary',
        path: '/db/summaryacc',
        icon: FaRupeeSign
    },
    {
        key: 'events',
        label: 'Events',
        path: '/db/events',
        icon: RiCommunityFill
    },
    {
        key: 'payments',
        label: 'Society Payments',
        path: '/db/payments',
        icon: MdOutlinePayment
    },
    {
        key: 'visitors',
        label: 'Visitors Log',
        path: '/db/visitor',
        icon: MdEmojiPeople
    },
    {
        key: 'reservation',
        label: 'Facility Reservation',
        path: '/db/reserve',
        icon: FaLock
    },
    {
        key: 'complains',
        label: 'Register Complaints',
        path: '/db/addcomplain',
        icon: FaRegSadCry
    },
    {
        key: 'trackreceipts',
        label: 'Payment History',
        path: '/db/trackpay',
        icon: FaReceipt
    },
    {
        key: 'addpaymentvoucher',
        label: 'Payment Vouchers',
        path: '/db/addpv',
        icon: CiReceipt
    }
];
