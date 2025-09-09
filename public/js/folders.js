async function renameFolder(folderId, currentName) {
  const { value: newName } = await Swal.fire({
    title: "Rename folder",
    input: "text",
    inputValue: currentName,
    showCancelButton: true,
    confirmButtonText: "Save",
  });

  if (newName) {
    const res = await fetch(`/folders/${folderId}/rename`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName }),
    });

    if (res.ok) {
      await Swal.fire(
        "Updated!",
        "Folder name updated successfully",
        "success"
      );
      location.reload();
    } else {
      Swal.fire("Error", "Could not update folder", "error");
    }
  }
}

async function deleteFolder(folderId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the folder and all its files!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
  });

  if (result.isConfirmed) {
    const res = await fetch(`folders/${folderId}/delete`, {
      method: "POST",
    });

    if (res.ok) {
      await Swal.fire("Deleted!", "Folder successfully deleted", "success");
      const folderItem = document.getElementById(`folder-${folderId}`);
      if (folderId) {
        folderItem.remove();
      }
    } else {
      await Swal.fire("Error", "Could not delete folder.", "error");
    }
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await Swal.fire({
      title: "Cancelled",
      text: "Your folder is safe :)",
      icon: "error",
    });
  }
}

async function createFolder(userId) {
  const { value: name } = await Swal.fire({
    title: "Create a new folder",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Add",
  });

  if (name) {
    const res = await fetch(`/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      await Swal.fire("Created!", `${name} folder created`, "success");
      location.reload();
    } else {
      Swal.fire("Error", "Could not create folder", "error");
    }
  }
}
