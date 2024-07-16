import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import React from 'react';

export type AdminCourseOptionsType = {
  courseName?: string;
  courseID: number;
}

export type ConfirmDeleteCourseType = {
  className?: string;
  courseID: number;
}

const AdminCourseOptions: NextPage<AdminCourseOptionsType> = ({ courseName = "", courseID }) => {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); //to close popup when modal opens
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onArchiveContainerClick = useCallback(async () => {
    try {
      const response = await fetch('/api/courses/archiveCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle archive status');
      }

      router.reload();
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  }, [courseID, router]);

  const openDeleteModal = () => {
    setIsPopoverOpen(false);
    setIsModalOpen(true);
  };

  const onConfirmDeleteClick = useCallback(async () => {
    try {
      const response = await fetch('/api/courses/deleteCourse', { //TODO: Fix to actually remove course from db
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Handle successful response
      console.log('Course deleted successfully');
      // onClose(); // Close the popup after deleting
      router.reload(); // Reload the page to refresh the state
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }, [courseID, router]);

  return (
    <div className='instructor'>
      <Popover 
        placement="right-end" 
        showArrow={true}
        isOpen={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
      >
        <PopoverTrigger>
          <img className="ml-auto w-[5.5%]" alt="More" src="/Images/More.png" />
        </PopoverTrigger>
        <PopoverContent className='z-10'>
          <Button className='w-[100%]' variant='light' onClick={onArchiveContainerClick}>Archive {courseName}</Button>
          <Button className='w-[100%]' variant='light' onClick={openDeleteModal}>Delete Course</Button>
        </PopoverContent>
      </Popover>
      <Modal 
        className='z-20' 
        backdrop="blur" 
        isOpen={isModalOpen} 
        onOpenChange={(open) => setIsModalOpen(open)}
      >
        <ModalContent>
          <ModalHeader>Delete Course</ModalHeader>
          <ModalBody>
            <p>Once you confirm delete, the change will be made permanent. Confirm below to continue.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button color="danger" onClick={onConfirmDeleteClick}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminCourseOptions;