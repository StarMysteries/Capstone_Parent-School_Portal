import React, { useState } from 'react';
import { X, Plus, Filter, ChevronDown, BookOpen } from 'lucide-react';

const BookCopiesModal = ({ onClose }) => {
  // Mock data based on the UI provided
  const copies = [
    {
      id: 1,
      title: "The New Science Links 1",
      status: "AVAILABLE",
      borrower: null,
      timeBorrowed: "N/A",
      dueDate: "N/A",
      dueColor: "text-gray-400",
    },
    {
      id: 2,
      title: "The New Science Links 2",
      status: "BORROWED",
      borrower: "Pedro Parker",
      timeBorrowed: null,
      dueDate: "04/09/25 10:00 AM",
      dueColor: "text-green-500",
    },
    {
      id: 3,
      title: "The New Science Links 3",
      status: "BORROWED",
      borrower: "Bill Nye",
      timeBorrowed: null,
      dueDate: "04/05/25 10:00 PM",
      dueColor: "text-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
        
        {/* Decorative Background Book Icon */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <BookOpen size={400} strokeWidth={1} className="text-green-600" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header Information */}
        <div className="flex flex-wrap items-center justify-between gap-4 pr-12">
          <div className="rounded-md bg-[#5c5c5c] px-6 py-3 text-white shadow-sm">
            <span className="font-bold">Name:</span> The New Science Links
          </div>
          <div className="rounded-md bg-[#5c5c5c] px-6 py-3 text-white shadow-sm">
            <span className="font-bold">Subject:</span> Science
          </div>
        </div>

        {/* Controls Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button className="flex items-center gap-2 rounded-md bg-[#e6b800] px-6 py-2.5 font-bold text-gray-900 transition-colors hover:bg-[#cca300] shadow-sm">
            ADD COPY <Plus size={20} />
          </button>
          
          <div className="relative">
            <select className="appearance-none rounded-md bg-[#5c5c5c] pl-6 pr-12 py-2.5 text-white shadow-sm outline-none cursor-pointer">
              <option>Status</option>
              <option>Available</option>
              <option>Borrowed</option>
            </select>
            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
          </div>
        </div>

        {/* Copies List */}
        <div className="mt-8 flex flex-col gap-4 relative z-10">
          {copies.map((copy, index) => (
            <div 
              key={copy.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#666666] p-5 shadow-sm"
            >
              {/* Left Column: Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">
                  Copy {index + 1}: {copy.title}
                </h3>
                <div className="text-base text-gray-200">
                  {copy.status === 'AVAILABLE' ? (
                    <>
                      <span className="font-semibold text-[#e6b800]">Time Borrowed :</span> {copy.timeBorrowed}
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-[#e6b800]">Borrower:</span> {copy.borrower}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Status & Due Date */}
              <div className="flex flex-col items-end gap-2">
                <div className="relative w-48">
                  <select 
                    defaultValue={copy.status}
                    className={`w-full appearance-none rounded-full px-4 py-1.5 text-center font-bold text-gray-900 shadow-sm outline-none cursor-pointer
                      ${copy.status === 'AVAILABLE' ? 'bg-[#5cd65c]' : 'bg-[#e6b800]'}`}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BORROWED">BORROWED</option>
                    <option value="LOST">LOST</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" />
                </div>
                
                <div className={`text-sm font-semibold ${copy.dueColor}`}>
                  Due: {copy.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BookCopiesModal;