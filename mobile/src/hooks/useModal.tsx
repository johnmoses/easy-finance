import { useState } from 'react';

export const useShowModal = () => {
  const [showModalOpen, setShowModalOpen] = useState<boolean>(false);
  const toggleShowModal = () => setShowModalOpen(!showModalOpen);
  return {
    showModalOpen,
    toggleShowModal,
  };
};

export const useCreateModal = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const toggleCreateModal = () => setCreateModalOpen(!createModalOpen);
  return {
    createModalOpen,
    toggleCreateModal,
  };
};

export const useUpdateModal = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
  return {
    updateModalOpen,
    toggleUpdateModal,
  };
};

export const useUpdatePicModal = () => {
  const [updatePicModalOpen, setUpdatePicModalOpen] = useState<boolean>(false);
  const toggleUpdatePicModal = () => setUpdatePicModalOpen(!updatePicModalOpen);
  return {
    updatePicModalOpen,
    toggleUpdatePicModal,
  };
};

export const useVerifyModal = () => {
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const toggleVerifyModal = () => setVerifyModalOpen(!verifyModalOpen);
  return {
    verifyModalOpen,
    toggleVerifyModal,
  };
};

export const useRemitModal = () => {
  const [remitModalOpen, setRemitModalOpen] = useState<boolean>(false);
  const toggleRemitModal = () => setRemitModalOpen(!remitModalOpen);
  return {
    remitModalOpen,
    toggleRemitModal,
  };
};

export const useDeleteModal = () => {
  const [deleteModalOpen, setDeletModalOpen] = useState<boolean>(false);
  const toggleDeleteModal = () => setDeletModalOpen(!deleteModalOpen);
  return {
    deleteModalOpen,
    toggleDeleteModal,
  };
};

export const useAddAdminModal = () => {
  const [addAdminModalOpen, setAddAdminModalOpen] = useState<boolean>(false);
  const toggleAddAdminModal = () => setAddAdminModalOpen(!addAdminModalOpen);
  return {
    addAdminModalOpen,
    toggleAddAdminModal,
  };
};

export const useRemoveAdminModal = () => {
  const [removeAdminModalOpen, setRemoveAdminModalOpen] =
    useState<boolean>(false);
  const toggleRemoveAdminModal = () =>
    setRemoveAdminModalOpen(!removeAdminModalOpen);
  return {
    removeAdminModalOpen,
    toggleRemoveAdminModal,
  };
};


export const useAddParticipantModal = () => {
  const [addParticipantModalOpen, setAddParticipantModalOpen] = useState<boolean>(false);
  const toggleAddParticipantModal = () => setAddParticipantModalOpen(!addParticipantModalOpen);
  return {
    addParticipantModalOpen,
    toggleAddParticipantModal,
  };
};

export const useRemoveParticipantModal = () => {
  const [removeParticipantModalOpen, setRemoveParticipantModalOpen] =
    useState<boolean>(false);
  const toggleRemoveParticipantModal = () =>
    setRemoveParticipantModalOpen(!removeParticipantModalOpen);
  return {
    removeParticipantModalOpen,
    toggleRemoveParticipantModal,
  };
};

export const useMenuModal = () => {
  const [menuModalOpen, setMenuModalOpen] =
    useState<boolean>(false);
  const toggleMenuModal = () =>
    setMenuModalOpen(!menuModalOpen);
  return {
    menuModalOpen,
    toggleMenuModal,
  };
};