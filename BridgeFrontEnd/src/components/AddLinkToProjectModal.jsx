import { useState } from "react";
import { FormInput } from "./FormInput";
import { Modal } from "./Modal";
import { FaLink } from "react-icons/fa6";
import { AddActionButton } from "./AddActionButton";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { addProjectLink } from "../services/projects";

export const AddLinkToProjectModal = ({
  isOpen,
  setIsOpen,
  cardRef,
  project,
}) => {
  const [newLink, setNewLink] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(addProjectLink, {
    onSuccess: () => {
      queryClient.invalidateQueries("projectInformation" + project.identifier);
      toast.success("Link agregado correctamente");
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      setNewLink("");
      setIsOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ newLink, projectId: project.identifier });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      cardRef={cardRef}
      title={"Agregar nuevo link"}
    >
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <FormInput
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder={"Ingresa un nuevo nombre de equipo"}
          Icon={FaLink}
        />
        <AddActionButton
          text={"Agregar"}
          className="rounded-sm"
          isLoading={mutation.isLoading}
        />
      </form>
    </Modal>
  );
};
