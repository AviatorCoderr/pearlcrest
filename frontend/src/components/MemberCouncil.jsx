import React from 'react';
import Navbar from './Navbar';

const MemberCard = ({ member }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 duration-300 max-w-xs mx-auto flex flex-col justify-center text-center">
      <img className="w-full h-full object-cover rounded-t-lg" src={member.url} alt={member.name} />
      <div className="px-6 py-4">
        <h3 className="text-xl font-bold text-white mt-4">{member.name}</h3>
        <p className="text-gray-300 text-sm mt-2">
          <strong>Position:</strong> {member.position}<br />
          <strong>Flat:</strong> {member.flat}<br />
          <strong>Contact:</strong> <a className="text-blue-500 hover:underline" href={`tel:${member.contact}`}>{member.contact}</a>
        </p>
      </div>
    </div>
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
    { id: 9, position: 'Executive Member', name: 'Mrs. Poonam Nischal', flat: 'C208', contact: '8809360519', url: '/static/images/poonam-min.jpg' },
    { id: 10, position: 'Executive Member', name: 'Mr. Lalit Kishore', flat: 'C306', contact: '8877327018', url: '/static/images/lalit-min.jpg' },
    { id: 11, position: 'Executive Member', name: 'Mr. Ranjan Kumar', flat: 'D-block', contact: '9334902514', url: '/static/images/ranjan-min.jpg' }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h3 className="text-4xl font-bold text-center my-8 text-gray-800">EXECUTIVE COMMITTEE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="p-4 rounded-lg">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberCouncil;
