import React from 'react';
import Navbar from './Navbar';
import { FaPhone, FaHome, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MemberCard = ({ member }) => {
  const isLeadership = ['PRESIDENT', 'SECRETARY', 'TREASURER'].includes(member.position);
  
  return (
    <motion.div 
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isLeadership ? 'border-t-4 border-blue-500' : 'border-t-4 border-gray-200'
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <img 
          className="w-full h-60 object-cover" 
          src={member.url} 
          alt={member.name} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/static/images/placeholder-profile.jpg'
          }}
        />
        {isLeadership && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {member.position}
          </div>
        )}
      </div>
      
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
        
        <div className="space-y-2 text-gray-600">
          {!isLeadership && (
            <div className="flex items-center">
              <FaUserTie className="mr-2 text-blue-500" />
              <span className="capitalize">{member.position.toLowerCase()}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FaHome className="mr-2 text-blue-500" />
            <span>{member.flat}</span>
          </div>
          
          <div className="flex items-center">
            <FaPhone className="mr-2 text-blue-500" />
            <a 
              href={`tel:${member.contact}`} 
              className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
            >
              {member.contact}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MemberCouncil = () => {
  const members = [
    { id: 1, position: 'PRESIDENT', name: 'Mr. Ravindra Prasad', flat: 'CG4', contact: '7992351171', url: '/static/images/president.jpg' },
    { id: 2, position: 'SECRETARY', name: 'Mr. Sunil Kumar', flat: 'B403', contact: '7909058947', url: '/static/images/the secretary.jpg' },
    { id: 3, position: 'TREASURER', name: 'Mr. Manish', flat: 'A104', contact: '9431177995', url: '/static/images/treasurer.jpg' },
    { id: 4, position: 'Executive Member', name: 'Mr. Shailendra Kumar', flat: 'A301', contact: '8340258087', url: '/static/images/executive_member.jpg' },
    { id: 5, position: 'Executive Member', name: 'Mrs. Monalisa Singh', flat: 'A405', contact: '7667768225', url: '/static/images/monalisa-min.jpg' },
    { id: 6, position: 'Executive Member', name: 'Mr. Manoj Kumar Singh', flat: 'B204', contact: '9431328432', url: '/static/images/manoj-min.jpg' },
    { id: 7, position: 'Executive Member', name: 'Mr. Sunil Kumar Singh', flat: 'CG3', contact: '9781077819', url: '/static/images/sunil-min.jpg' },
    { id: 8, position: 'Executive Member', name: 'Mrs. Indu Prasad', flat: 'CG1', contact: '9431924288', url: '/static/images/indu-min.jpg' },
    { id: 9, position: 'Executive Member', name: 'Mrs. Punam Nischal', flat: 'C208', contact: '8809360519', url: '/static/images/poonam-min.jpg' },
    { id: 10, position: 'Executive Member', name: 'Mr. Lalit Kishor', flat: 'C306', contact: '8877327018', url: '/static/images/lalit-min.jpg' },
    { id: 11, position: 'Executive Member', name: 'Mr. Ranjan Kumar', flat: 'D-block', contact: '9334902514', url: '/static/images/ranjan-min.jpg' }
  ];

  // Separate leadership and other members
  const leadership = members.filter(m => ['PRESIDENT', 'SECRETARY', 'TREASURER'].includes(m.position));
  const otherMembers = members.filter(m => !['PRESIDENT', 'SECRETARY', 'TREASURER'].includes(m.position));

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Executive Committee
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Meet the dedicated team managing our community affairs
            </p>
          </motion.div>

          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Committee Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {otherMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCouncil;